import PlexAPI from 'plex-api';


export default class Aplexa {
  constructor(options) {
    this.client = new PlexAPI(options);
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
