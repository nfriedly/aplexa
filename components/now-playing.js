
const Time = ({ ms }) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return (
    <span>
      {minutes}
      :
      {seconds}
    </span>
  );
};

const NowPlaying = ({
  title, artist, album, albumPic, artistPic, duration, offset,
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
      <p style={{ marginTop: '1em' }} title="Plex data may be outdated by up to ~30 seconds">
        {'~ '}
        <Time ms={offset} />
        {' / '}
        <Time ms={duration} />
      </p>
      <progress max={duration} value={offset} style={{ width: '100%' }} />
    </div>
    <div className="col-md-8">
      <img src={albumPic || artistPic} style={{ width: '100%' }} className="album-art" alt="album art" />
    </div>
  </div>
);


export default NowPlaying;
