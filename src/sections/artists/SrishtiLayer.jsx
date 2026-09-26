import { Art, RevealGroup } from './ArtistArtwork';

const SrishtiArt = props => <Art folder="srishti" {...props} />;
// The center singer is last in paint order; the flute and bass sit behind him.
// Native reference coordinates preserve all seven musicians and instruments.
const MUSICIANS = [
  { file: 'man1', x: -4, y: 240, width: 875, start: .045, fromX: -65 },
  { file: 'man2', x: 292, y: 232, width: 1097, start: .06, fromX: -45 },
  { file: 'man3', x: 736, y: 232, width: 1250, start: .075, fromX: -25 },
  { file: 'man7', x: 2392, y: 240, width: 780, start: .045, fromX: 65 },
  { file: 'man6', x: 1788, y: 232, width: 1449, start: .06, fromX: 45 },
  { file: 'man5', x: 1396, y: 220, width: 1273, start: .075, fromX: 25 },
  { file: 'man4', x: 928, y: 48, width: 1380, start: .10, fromX: 0 },
];

export default function SrishtiLayer({ progress }) {
  return <div className="kanika-artboard srishti-artboard" role="img"
    aria-label="Srishti — Creating the Resonance. Seven musicians, Dhwani and Srishti logos, layered yellow clouds and musical notes.">
    <div className="kanika-texture" />
    <RevealGroup progress={progress} fromY={-16}>
      <Art file="dhwani logo png og 2" x={1492} y={24} width={95} />
      <SrishtiArt file="Srishti LOGO" x={1632} y={36} width={114} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.02} fromY={65} scaleFrom={.98}>
      <SrishtiArt file="Shape backround" x={0} y={183} width={3240} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.035} fromY={-35}>
      <SrishtiArt file="head effect 2" x={157} y={42} width={254} />
      <SrishtiArt file="head effect 1" x={824} y={83} width={265} />
      <SrishtiArt file="head effect 2" x={1982} y={49} width={254} />
      <SrishtiArt file="head effect 1" x={2824} y={90} width={265} style={{ rotate: '26deg' }} />
      <SrishtiArt file="note 2" x={25} y={213} width={100} style={{ rotate: '-28deg' }} />
      <Art folder="six eight" file="blue note 1" x={1245} y={73} width={110} />
      <Art folder="six eight" file="blue note 2" x={2450} y={83} width={111} />
      <SrishtiArt file="note 2" x={3085} y={46} width={113} />
    </RevealGroup>
    {MUSICIANS.map(({ start, fromX, ...art }) =>
      <RevealGroup key={art.file} progress={progress} start={start} fromX={fromX} fromY={65} className="srishti-musician">
        <SrishtiArt {...art} />
      </RevealGroup>
    )}
    <RevealGroup progress={progress} start={.11} fromX={-22} fromY={80}>
      <SrishtiArt file="base cloud left" x={0} y={810} width={2936} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.12} fromX={22} fromY={85}>
      <SrishtiArt file="base cloud right" x={0} y={613} width={3239} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.14} fromY={70}>
      <SrishtiArt file="cloud 1" x={12} y={818} width={1113} />
      <SrishtiArt file="cloud 2" x={2085} y={734} width={1173} />
      <SrishtiArt file="cloud 3" x={964} y={616} width={1270} />
    </RevealGroup>
    <RevealGroup progress={progress} start={.17} fromY={65} scaleFrom={.97}>
      <SrishtiArt file="Shape title background" x={672} y={865} width={1895} />
      <SrishtiArt file="title" x={940} y={928} width={1327} />
      <SrishtiArt file="Creating the resonance" x={1008} y={1288} width={1172} />
      <SrishtiArt file="yellow note music" x={807} y={851} width={138} />
      <SrishtiArt file="note" x={2394} y={942} width={113} />
      <Art folder="six eight" file="note 3" x={849} y={1200} width={67} />
    </RevealGroup>
  </div>;
}
