import { Art, RevealGroup, imagePath } from './ArtistArtwork';

export default function KanikaLayer({ progress }) {
  return <div className="kanika-artboard" role="img" aria-label="Kanika Kapoor — Dhwani artist reveal. Three portraits with yellow title, musical notes, and festival partner logos.">
    <RevealGroup progress={progress} start={0} fromY={-12}>
      <div className="kanika-partners">
        <img src={imagePath('ces')} alt="Campus Events" width="98" height="99" />
        <img src={imagePath('dhwani logo png og 2')} alt="Dhwani 26" width="72" height="120" />
        <img src={imagePath('Primary_ White')} alt="Campus Music Festival" width="241" height="82" />
      </div>
    </RevealGroup>
    <RevealGroup progress={progress} start={.015} fromY={0} scaleFrom={.72}>
      <div className="kanika-sun" />
    </RevealGroup>
    <RevealGroup progress={progress} start={.025} fromX={-35} fromY={12} className="kanika-music">
      <Art file="music note" x={-210} y={-75} width={1005} style={{ rotate: '-22deg' }} />
      <Art file="music note 3" x={2110} y={-190} width={1228} />
      <Art file="music note 4" x={-150} y={820} width={1362} />
      <Art file="music note" x={2380} y={810} width={1005} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.045} fromY={100} className="kanika-rays">
      <div className="kanika-ray kanika-ray--pink-left" /><div className="kanika-ray kanika-ray--pink-right" />
      <div className="kanika-ray kanika-ray--blue-left" /><div className="kanika-ray kanika-ray--blue-right" />
      <div className="kanika-days kanika-days--left" aria-hidden="true">DAY 2 DAY 2 DAY 2</div>
      <div className="kanika-days kanika-days--right" aria-hidden="true">DAY 2 DAY 2 DAY 2</div>
    </RevealGroup>
    <RevealGroup progress={progress} start={.08} fromX={-95} fromY={25} className="kanika-side-portrait">
      <Art file="kanika left" x={672} y={348} width={715} className="kanika-left" />
      <Art file="head effect 2" x={681} y={384} width={200} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.10} fromX={95} fromY={25} className="kanika-side-portrait">
      <Art file="kanika right" x={1360} y={424} width={2033} className="kanika-right" />
      <Art file="head effect" x={2414} y={414} width={205} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.12} fromY={90} scaleFrom={.96} className="kanika-main-portrait">
      <Art file="kanika main" x={1136} y={204} width={938} className="kanika-main" />
    </RevealGroup>
    <RevealGroup progress={progress} start={.06} fromY={-35}>
      <Art className="artist-tiny" file="note 4" mobile={[7, 18, 8]} x={379} y={97} width={142} />
      <Art className="artist-tiny" file="note 2" mobile={[27, 17, 5]} x={993} y={70} width={73} style={{ rotate: '-16deg' }} />
      <Art className="artist-tiny" file="note 1" mobile={[77, 18, 8]} x={1974} y={77} width={130} />
      <Art className="artist-tiny" file="note 3" mobile={[89, 29, 6]} x={2334} y={98} width={75} style={{ rotate: '14deg' }} />
      <Art className="artist-tiny" file="note 2" mobile={[89, 19, 6]} x={2750} y={123} width={114} />
      <Art className="artist-tiny" file="note 1" mobile={[5, 35, 6]} x={493} y={480} width={70} style={{ rotate: '-12deg' }} />
      <Art className="artist-tiny" file="note 3" mobile={[28, 30, 6]} x={1031} y={340} width={100} />
      <Art className="artist-tiny" file="note 4" mobile={[70, 36, 5]} x={2223} y={340} width={61} style={{ rotate: '25deg' }} />
      <Art className="artist-tiny" file="note 2" mobile={[3, 69, 6]} x={495} y={919} width={80} style={{ rotate: '-15deg' }} />
      <Art className="artist-tiny" file="note 3" mobile={[91, 68, 6]} x={2809} y={930} width={76} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.16} fromY={80}>
      <div className="kanika-title-bed" />
      <svg className="kanika-base" viewBox="0 0 3240 1440" aria-hidden="true">
        <path d="M0 1188 1160 1440 910 1440 0 1274ZM3240 1188 2080 1440 2330 1440 3240 1274ZM0 1360 700 1440H0ZM3240 1360 2540 1440H3240Z" fill="#0660cd" />
      </svg>
      <Art file="KANIKA KAPOOR title" x={388} y={1080} width={2467} />
    </RevealGroup>
  </div>;
}

