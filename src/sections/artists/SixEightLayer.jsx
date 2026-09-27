import { Art, RevealGroup } from './ArtistArtwork';

const EightArt = props => <Art folder="six eight" {...props} />;

export default function SixEightLayer({ progress }) {
  return <div className="kanika-artboard six-eight-artboard" role="img"
    aria-label="Six Eight — Crafting the Echo. Three artist portraits, Starvalue and Dhwani logos, yellow clouds and musical notes.">
    <RevealGroup progress={progress} fromY={-16}>
      <EightArt file="dhwani logo png og" x={1360} y={28} width={70} />
      <EightArt file="title starvalue" x={1456} y={44} width={422} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.025} fromY={55} scaleFrom={.94}>
      <EightArt className="six-eight-backdrop" file="artist background" x={474} y={170} width={2472} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.045} fromY={-32}>
      <EightArt file="blue note 3" x={241} y={182} width={133} />
      <EightArt file="blue note 1" x={1092} y={62} width={110} />
      <EightArt file="blue note 2" x={2351} y={64} width={111} />
      <EightArt file="blue note 3" x={3003} y={161} width={133} style={{ rotate: '-15deg' }} />
      <EightArt file="blue note" x={100} y={516} width={138} />
      <EightArt file="note 3" x={406} y={683} width={67} />
      <EightArt file="note 2" x={3074} y={504} width={91} />
      <EightArt file="note 1" x={2920} y={719} width={141} />
      <Art folder="srishti" file="head effect 1" mobile={[3, 24, 16]} x={405} y={319} width={220} style={{ rotate: '-50deg' }} />
      <Art folder="srishti" file="head effect 2" mobile={[82, 23, 16]} x={2502} y={171} width={220} style={{ rotate: '45deg' }} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.07} fromY={85} scaleFrom={.975} className="six-eight-portraits">
      <EightArt file="artist main" x={488} y={204} width={2390} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.105} fromY={75} className="artist-bottom-cloud">
      <EightArt file="base clouddd" x={-1} y={940} width={3242} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.13} fromY={60} scaleFrom={.96} className="artist-foreground">
      <EightArt file="Six Eight Logo" x={584} y={888} width={2068} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.15} fromX={-32} fromY={65} className="artist-bottom-cloud">
      <EightArt file="cloud base 1" x={-360} y={760} width={1276} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.16} fromX={32} fromY={65} className="artist-bottom-cloud">
      <EightArt file="cloud base 2" x={2370} y={770} width={1276} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.18} fromY={30} className="artist-foreground">
      <div className="six-eight-tagline" aria-hidden="true">CRAFTING THE ECHO!</div>
    </RevealGroup>
  </div>;
}
