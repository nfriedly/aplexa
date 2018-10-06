
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
  <div className="grid-container now-playing">
    <style jsx>
      {`
      p { margin-bottom: 0; }
      h2 { margin-top: 6px; }
      .album-art { width: 100%; }
      .art-col { padding: 0; margin: 0 -15px; }
      @media (min-width: 768px) {
        .now-playing { margin-top: 15px; }
        .album-art { width: auto; max-width: 100%; margin: auto; display: block; min-height: 100%;  }
        .grid-container {
          border: 1px solid black;
          display: grid;
        }
        .art-col {
          grid-column: 2;
          grid-row: 1 / span 2;
        }
      }
  `}
    </style>
    <div className="artist-title meta-col">
      <h1>
        {title}
        {' '}
      </h1>
      <p>by</p>
      <h2>
        {artist}
      </h2>
    </div>
    <div className="art-col">
      <img src={albumPic || artistPic} className="album-art" alt="album art" />
    </div>
    <div className="album-time meta-col">
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
  </div>
);


export default NowPlaying;
