import PlexAPI from 'plex-api';
import EventEmitter from 'events';
import { name, version } from '../package.json';


export default class Aplexa extends EventEmitter {
  constructor({
    minDelay = 2 * 1000,
    maxDelay = 60 * 1000,
    ...options
  }) {
    super();
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
      this.tick();
    }
  }

  async tick() {
    clearTimeout(this.nextTick);
    const { current: prev } = this;
    const data = await this.getAlexaNowPlaying();
    if (data.playing) {
      const sameSong = (
        data.artist === prev.artist
        && data.title === prev.title
        && data.album === prev.album
      );
      this.current = data;
      if (!sameSong) {
        this.emit('song', data);
      }
      this.delay = data.duration - data.offset;
    } else {
      this.delay = prev.playing ? this.minDelay : Math.min(this.delay * 2, this.maxDelay);
    }
    this.nextTick = setTimeout(this.tick, this.delay);
  }

  stop() {
    clearTimeout(this.nextTick);
  }

  async getAlexaNowPlaying() {
    const result = await this.client.query('/status/sessions');
    const data = result.MediaContainer.Metadata.find(m => m.Player.device === 'Alexa');
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
      duration: data.duration,
      offset: data.viewOffset,
    };
  }
}
