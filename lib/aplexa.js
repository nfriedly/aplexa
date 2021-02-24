import PlexAPI from 'plex-api';
import EventEmitter from 'events';
import { name, version } from '../package.json';

export default class Aplexa extends EventEmitter {
  constructor({
    minDelay = 1 * 1000,
    maxDelay = 60 * 1000,
    ...options
  }) {
    super();
    this.off = this.off || this.removeListener; // on the client-side, we some how can end up with a really old version of EventEmitter (?)
    this.current = { playing: false };
    this.minDelay = minDelay;
    this.delay = this.minDelay;
    this.maxDelay = maxDelay;
    this.client = new PlexAPI({
      options: {
        identifier: name, // this one is important - the default is a random, but plex remembers each one as a separate device!
        deviceName: name,
        version,
        product: 'Alexa',
        device: 'Node.js',
      },
      ...options,
    });
    this.tick = this.tick.bind(this);
    if (options.poll) {
      this.resume();
    }
  }

  async tick() {
    try {
      clearTimeout(this.nextTick);
      const data = await this.getAlexaNowPlaying();
      const prev = this.current;
      this.current = data;
      if (data.playing) {
        const sameSong = (
          data.artist === prev.artist
          && data.title === prev.title
          && data.album === prev.album
        );
        if (!sameSong) {
          this.emit('song', data);
        }
        // plex only updates the offsets every now and then,
        // so we need to start checking sooner than the offset and duration would indicate
        const remaining = data.duration - data.offset;
        if (remaining >= this.maxDelay) {
          this.delay = this.maxDelay;
        } else {
          // gradually shorten the update delay as we approach the end of the song
          // eslint-disable-next-line no-mixed-operators
          this.delay = Math.round(remaining * this.minDelay / this.maxDelay);
        }
      } else {
        // gradually lengthen the delay it's not playing anything
        this.delay = prev.playing ? this.minDelay : Math.min(this.delay * 2, this.maxDelay);
      }
      this.nextTick = setTimeout(this.tick, this.delay);
    } catch (err) {
      this.emit('error', err);
    }
  }

  pause() {
    clearTimeout(this.nextTick);
  }

  resume() {
    this.tick();
  }

  async getAlexaNowPlaying() {
    const result = await this.client.query('/status/sessions');
    const data = result.MediaContainer.Metadata && result.MediaContainer.Metadata.find((m) => m.Player.device === 'Alexa');
    if (!data) {
      return { playing: false };
    }
    const base = `http://${this.client.hostname}:${this.client.port}`;
    return {
      playing: true,
      artist: data.originalTitle || data.grandparentTitle, // track artist or album artist
      title: data.title,
      album: data.parentTitle,
      albumPic: data.thumb ? `${base}${data.thumb}` : '',
      artistPic: data.art ? `${base}${data.art}` : '',
      duration: parseInt(data.duration, 10),
      offset: parseInt(data.viewOffset, 10),
    };
  }
}
