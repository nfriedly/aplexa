const NowPlaying = ({
  title, artist, album, albumPic, artistPic,
}) => (
  <div className="row now-playing">
    <style jsx>
      {`
      p { margin-bottom: 0; }
      h2 { margin-top: 6px; }
  `}
    </style>
    <div className="col-md-4">
      <h1>
        {title}
        {' '}
      </h1>
      <p>by</p>
      <h2>
        {artist}
      </h2>
      <p>from</p>
      <h2>
        {album}
      </h2>
    </div>
    <div className="col-md-8">
      <img src={albumPic || artistPic} style={{ width: '100%' }} className="album-art" alt="album art" />
    </div>
  </div>
);


export default NowPlaying;
