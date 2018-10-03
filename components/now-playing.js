const NowPlaying = ({
  title, artist, album, albumPic, artistPic,
}) => (
  <div className="row now-playing">
    <div className="col-md-4">
      <h1>
        {title}
        {' '}
      </h1>
      <h2>
        <small>by</small>
        {' '}
        {artist}
      </h2>
      <h3>
        <small>from</small>
        {' '}
        {album}
      </h3>
    </div>
    <div className="col-md-8">
      <img src={albumPic || artistPic} className="album-art" alt="album art" />
    </div>
  </div>
);


export default NowPlaying;
