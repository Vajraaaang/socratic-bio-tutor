import { circle, label, line, plot, rect } from './drawing.js';

const acidMolarity = 0.1;
const baseMolarity = 0.1;
const acidVolume = 25;
const waterKw = 1e-14;
const aceticKa = 1.8e-5;
const equivalence = acidVolume * acidMolarity / baseMolarity;

function titrationPh(acid, addedVolume) {
  const totalVolume = acidVolume + addedVolume;
  const acidTotal = acidMolarity * acidVolume / totalVolume;
  const sodium = baseMolarity * addedVolume / totalVolume;
  let low = 0;
  let high = 14;

  // Solve electroneutrality using concentrations at the mixed volume.
  // For the weak acid, [A⁻] follows from the acid mass balance and Kₐ.
  for (let iteration = 0; iteration < 55; iteration += 1) {
    const pH = (low + high) / 2;
    const hydronium = 10 ** (-pH);
    const anion = acid === 'weak'
      ? acidTotal * aceticKa / (aceticKa + hydronium)
      : acidTotal;
    const netCharge = hydronium + sodium - waterKw / hydronium - anion;
    if (netCharge > 0) low = pH;
    else high = pH;
  }

  return (low + high) / 2;
}

const titrationVolumes = [
  ...Array.from({ length: 201 }, (_, i) => i / 4),
  24.9, 24.99, 24.999, 25.001, 25.01, 25.1,
].sort((a, b) => a - b);

const titrationCurves = Object.fromEntries(['strong', 'weak'].map((acid) => [
  acid,
  titrationVolumes.map((volume) => [volume, titrationPh(acid, volume)]),
]));

const titration = {
  id: 'titration',
  subject: 'Chemistry',
  title: 'Acid–base titration',
  course: 'CHEM 1C · M2C',
  intro: 'Trace pH as strong base is added to a monoprotic acid. Compare acids with the same starting amount.',
  prediction: 'How would swapping the strong acid for a weak acid affect the pH at equivalence?',
  controls: [
    {
      key: 'acid', label: 'Acid', type: 'select', value: 'strong',
      options: [
        { value: 'strong', label: 'Strong acid · HCl' },
        { value: 'weak', label: 'Weak acid · acetic acid' },
      ],
    },
    { key: 'volume', label: 'Strong base added', type: 'range', min: 0, max: 50, step: 0.5, value: 25, unit: 'mL' },
  ],
  source: { label: 'OpenStax Chemistry 2e · Acid–base titrations', url: 'https://openstax.org/books/chemistry-2e/pages/14-7-acid-base-titrations' },
  assumptions: 'An ideal aqueous mixture at 25 °C starts with 25 mL of 0.100 M acid. Added NaOH is 0.100 M. The model uses additive volumes, charge and mass balance, and water autoionization. Acetic acid has Kₐ = 1.8 × 10⁻⁵. Grey guides mark half-equivalence and equivalence.',
  render({ acid, volume }) {
    const pH = titrationPh(acid, volume);
    let stage = 'Before equivalence';
    if (volume === 0) stage = 'Initial acid';
    if (volume === equivalence / 2) stage = 'Half-equivalence';
    if (volume === equivalence) stage = 'Equivalence';
    if (volume > equivalence) stage = 'After equivalence';

    return {
      figureLabel: 'pH against added base volume',
      summary: `The ${acid} acid has a pH of ${pH.toFixed(2)} after ${volume} mL of base. Half-equivalence is at 12.5 mL and equivalence is at 25 mL.`,
      metrics: [
        { label: 'pH', value: pH.toFixed(2) },
        { label: 'Stage', value: stage },
        { label: 'Base to acid mole ratio', value: (volume / equivalence).toFixed(2) },
      ],
      draw(ctx, colors) {
        const ink = acid === 'weak' ? colors.teal : colors.blue;
        plot(ctx, {
          x: [0, 50], y: [0, 14],
          xLabel: 'Strong base added (mL)', yLabel: 'pH',
          xTicks: [0, 10, 20, 30, 40, 50], yTicks: [0, 2, 4, 6, 8, 10, 12, 14],
          series: [{ points: titrationCurves[acid], color: ink }],
          markers: [{ x: volume, y: pH, color: ink }],
          guides: [
            { axis: 'x', at: equivalence / 2, color: colors.muted, dash: [2, 5] },
            { axis: 'x', at: equivalence, color: colors.muted, dash: [5, 5] },
          ],
        });
        line(ctx, 145, 25, 172, 25, { color: colors.muted, dash: [2, 5] });
        label(ctx, 'Half-equivalence', 185, 25, { size: 16, color: colors.muted });
        line(ctx, 410, 25, 437, 25, { color: colors.muted, dash: [5, 5] });
        label(ctx, 'Equivalence', 450, 25, { size: 16, color: colors.muted });
      },
    };
  },
};

const peakUncatalyzed = 80;
const peakCatalyzed = 50;

function energyPath(keyPoints) {
  const path = [keyPoints[0]];
  for (let index = 1; index < keyPoints.length; index += 1) {
    const [x0, y0] = keyPoints[index - 1];
    const [x1, y1] = keyPoints[index];
    for (let step = 1; step <= 40; step += 1) {
      const t = step / 40;
      const fraction = (1 - Math.cos(Math.PI * t)) / 2;
      path.push([x0 + t * (x1 - x0), y0 + fraction * (y1 - y0)]);
    }
  }
  return path;
}

const reactionEnergy = {
  id: 'reaction-energy',
  subject: 'Chemistry',
  title: 'Reaction free energy',
  course: 'CHEM 51A · 132A',
  intro: 'Compare the free-energy landscape of a one-step pathway with an alternative route through an intermediate.',
  prediction: 'Which features of the energy profile would change if a catalyst opened a different pathway?',
  controls: [
    {
      key: 'catalyst', label: 'Pathway', type: 'select', value: 'off',
      options: [
        { value: 'off', label: 'Uncatalyzed' },
        { value: 'on', label: 'Compare with catalyst' },
      ],
    },
    { key: 'productEnergy', label: 'Product free energy relative to reactants', type: 'range', min: -30, max: 30, step: 5, value: -20, unit: 'kJ/mol' },
  ],
  source: { label: 'OpenStax Organic Chemistry · Reaction intermediates', url: 'https://openstax.org/books/organic-chemistry/pages/6-10-describing-a-reaction-intermediates' },
  assumptions: 'The reaction coordinate is progress along a pathway. It has no time axis. The curves are schematic free energies. The diagram reports the highest transition state measured from each endpoint, while an elementary step uses the energy of its own starting state. Equilibrium uses ΔG° = −RT ln K at 298 K.',
  render({ catalyst, productEnergy }) {
    const compare = catalyst === 'on';
    const peak = compare ? peakCatalyzed : peakUncatalyzed;
    const equilibrium = Math.exp(-productEnergy / (0.008314462618 * 298));
    const energy = `${productEnergy} kJ/mol`;
    const oneStep = energyPath([[0, 0], [0.5, peakUncatalyzed], [1, productEnergy]]);
    const twoStep = energyPath([[0, 0], [0.25, peakCatalyzed], [0.5, 12], [0.73, 39], [1, productEnergy]]);

    return {
      figureLabel: compare ? 'Uncatalyzed and catalyzed reaction free-energy profiles' : 'Uncatalyzed reaction free-energy profile',
      summary: compare
        ? `Both routes start at 0 and end at ${energy}. The uncatalyzed transition state is at 80 kJ/mol. The two-step route has peaks at 50 and 39 kJ/mol separated by an intermediate at 12 kJ/mol.`
        : `From reactants at 0, free energy rises to a transition state at 80 kJ/mol, then falls to products at ${energy}.`,
      metrics: [
        { label: 'Reaction ΔG°', value: energy },
        { label: 'Highest TS from reactants', value: `${peak} kJ/mol` },
        { label: 'Highest TS from products', value: `${peak - productEnergy} kJ/mol` },
        { label: 'Equilibrium K (298 K)', value: equilibrium.toPrecision(3) },
      ],
      draw(ctx, colors) {
        const series = [{
          points: oneStep, color: compare ? colors.muted : colors.blue, dash: compare ? [7, 5] : [],
        }];
        const markers = [{ x: 0.5, y: peakUncatalyzed, color: compare ? colors.muted : colors.blue }];
        if (compare) {
          series.push({ points: twoStep, color: colors.teal });
          markers.push(
            { x: 0.25, y: peakCatalyzed, color: colors.teal },
            { x: 0.5, y: 12, color: colors.teal },
            { x: 0.73, y: 39, color: colors.teal },
          );
        }

        plot(ctx, {
          x: [0, 1], y: [-40, 90],
          xLabel: 'Reaction coordinate', yLabel: 'Free energy (kJ/mol)',
          xTicks: [{ value: 0, label: 'Reactants' }, { value: 1, label: 'Products' }],
          yTicks: [-40, -20, 0, 20, 40, 60, 80],
          series, markers,
          guides: [{ axis: 'y', at: 0, color: colors.muted, dash: [2, 5] }],
        });
        line(ctx, 144, 25, 173, 25, { color: series[0].color, dash: series[0].dash, width: 3 });
        label(ctx, 'Uncatalyzed', 185, 25, { size: 16, color: colors.muted });
        if (compare) {
          line(ctx, 410, 25, 439, 25, { color: colors.teal, width: 3 });
          label(ctx, 'Catalyzed', 450, 25, { size: 16, color: colors.teal });
        }
      },
    };
  },
};

const stereoGroups = {
  hydroxyl: { name: 'OH', rank: 1, color: 'teal' },
  carboxyl: { name: 'CO₂H', rank: 2, color: 'blue' },
  methyl: { name: 'CH₃', rank: 3, color: 'violet' },
  hydrogen: { name: 'H', rank: 4, color: 'rust' },
};

const fischerPositions = [
  { name: 'top', x: 360, y: 88, horizontal: false },
  { name: 'right', x: 532, y: 198, horizontal: true },
  { name: 'bottom', x: 360, y: 309, horizontal: false },
  { name: 'left', x: 188, y: 198, horizontal: true },
];

function fischer(projection, orientation) {
  const sequence = projection === 'mirror'
    ? ['carboxyl', 'hydroxyl', 'methyl', 'hydrogen']
    : ['carboxyl', 'hydrogen', 'methyl', 'hydroxyl'];
  const offset = orientation === 'rotate' ? 2 : 0;
  return fischerPositions.map((position, i) => ({
    ...position,
    ...stereoGroups[sequence[(i + offset) % sequence.length]],
    position: position.name,
  }));
}

function fischerConfiguration(groups) {
  const [first, second, third, fourth] = [...groups].sort((a, b) => a.rank - b.rank);
  const cross = (second.x - first.x) * (third.y - first.y)
    - (second.y - first.y) * (third.x - first.x);
  const clockwise = cross > 0;
  return clockwise !== fourth.horizontal ? 'R' : 'S';
}

const stereochemistry = {
  id: 'stereochemistry',
  subject: 'Chemistry',
  title: 'A chiral carbon in lactic acid',
  course: 'CHEM 51A · BIO SCI 98',
  intro: 'Rotate or reflect a Fischer projection. Track the four substituents attached to the central carbon.',
  prediction: 'What could you compare to tell whether a half-turn of the page gives the same result as a mirror reflection?',
  controls: [
    {
      key: 'projection', label: 'Projection', type: 'select', value: 'original',
      options: [{ value: 'original', label: 'Original' }, { value: 'mirror', label: 'Mirror reflection' }],
    },
    {
      key: 'orientation', label: 'Page orientation', type: 'select', value: 'normal',
      options: [{ value: 'normal', label: '0°' }, { value: 'rotate', label: '180°' }],
    },
    {
      key: 'ranks', label: 'CIP priorities and configuration', type: 'select', value: 'hidden',
      options: [{ value: 'hidden', label: 'Hide for prediction' }, { value: 'shown', label: 'Show assignment' }],
    },
  ],
  source: { label: 'OpenStax Organic Chemistry · Cahn–Ingold–Prelog sequence rules', url: 'https://openstax.org/books/organic-chemistry/pages/5-5-sequence-rules-for-specifying-configuration' },
  assumptions: 'A Fischer projection points its horizontal bonds toward the viewer and its vertical bonds away. For lactic acid, OH outranks both carbon-based groups. CO₂H outranks CH₃ because the next comparison is O,O,O versus H,H,H. H has lowest priority, so reverse the pagewise 1→2→3 direction when H is horizontal.',
  render({ projection, orientation, ranks }) {
    const groups = fischer(projection, orientation);
    const configuration = fischerConfiguration(groups);
    const showAssignment = ranks === 'shown';
    const metrics = [
      { label: 'Horizontal bonds', value: 'Toward the viewer' },
      { label: 'Vertical bonds', value: 'Away from the viewer' },
    ];
    if (showAssignment) metrics.push({ label: 'Configuration', value: configuration });

    return {
      figureLabel: 'Lactic acid Fischer projection',
      summary: `${groups.map((group) => `${group.position} ${group.name}${showAssignment ? ` (priority ${group.rank})` : ''}`).join(', ')}. Horizontal bonds point toward you and vertical bonds point away.`,
      metrics,
      draw(ctx, colors) {
        rect(ctx, 83, 37, 554, 324, { fill: colors.white, stroke: colors.grid, radius: 18 });
        line(ctx, 188, 198, 532, 198, { color: colors.blue, width: 4 });
        line(ctx, 360, 88, 360, 309, { color: colors.teal, width: 4 });
        circle(ctx, 360, 198, 18, { fill: colors.ink });
        label(ctx, 'C', 360, 198, { size: 17, weight: 700, color: colors.white, align: 'center' });

        for (const group of groups) {
          rect(ctx, group.x - 55, group.y - 24, 110, 48, {
            fill: showAssignment ? colors[`${group.color}Soft`] : colors.paper,
            stroke: colors.grid, radius: 10,
          });
          label(ctx, group.name, group.x, group.y, { size: 26, color: colors.ink, weight: 700, align: 'center' });
          if (showAssignment) {
            circle(ctx, group.x + 49, group.y - 18, 13, { fill: colors[group.color] });
            label(ctx, String(group.rank), group.x + 49, group.y - 18, { size: 15, weight: 700, align: 'center', color: colors.white });
          }
        }
        label(ctx, 'Vertical away', 248, 386, { size: 17, color: colors.teal, align: 'center' });
        label(ctx, 'Horizontal toward', 474, 386, { size: 17, color: colors.blue, align: 'center' });
      },
    };
  },
};

const spectra = {
  ethyl: {
    name: 'Ethyl acetate', formula: 'CH₃–C(=O)–O–CH₂–CH₃',
    peaks: [
      { shift: 4.12, coupling: 7.1, group: 'O–CH₂', type: 'quartet', protons: 2, weights: [1, 3, 3, 1] },
      { shift: 2.05, coupling: 0, group: 'CH₃–C(=O)', type: 'singlet', protons: 3, weights: [1] },
      { shift: 1.26, coupling: 7.1, group: 'O–CH₂–CH₃ (terminal methyl)', type: 'triplet', protons: 3, weights: [1, 2, 1] },
    ],
  },
  methyl: {
    name: 'Methyl propanoate', formula: 'CH₃–CH₂–C(=O)–O–CH₃',
    peaks: [
      { shift: 3.67, coupling: 0, group: 'O–CH₃', type: 'singlet', protons: 3, weights: [1] },
      { shift: 2.33, coupling: 7.5, group: 'CH₂–C(=O)', type: 'quartet', protons: 2, weights: [1, 3, 3, 1] },
      { shift: 1.13, coupling: 7.5, group: 'CH₃–CH₂ (terminal methyl)', type: 'triplet', protons: 3, weights: [1, 2, 1] },
    ],
  },
};

function spectrumLines(peaks) {
  return peaks.flatMap(({ shift, coupling, weights, protons }) => {
    const weightTotal = weights.reduce((total, weight) => total + weight, 0);
    const midpoint = (weights.length - 1) / 2;
    return weights.map((weight, position) => ({
      position: shift + (position - midpoint) * coupling / 400,
      height: protons * weight / weightTotal,
    }));
  });
}

function signalTrace(peaks, min, max) {
  const lines = spectrumLines(peaks);
  const width = 0.003;
  return Array.from({ length: 1501 }, (_, i) => {
    const shift = min + i / 1500 * (max - min);
    const intensity = lines.reduce((sum, line) =>
      sum + line.height * Math.exp(-0.5 * ((shift - line.position) / width) ** 2), 0);
    return [shift, intensity];
  });
}

const spectrumRegions = ['downfield', 'middle', 'upfield'];
const protonNmr = {
  id: 'proton-nmr',
  subject: 'Chemistry',
  title: 'Proton NMR of ester isomers',
  course: 'CHEM 51A–C · 132B',
  intro: 'Compare how two constitutional isomers distribute the same eight hydrogens among proton environments.',
  prediction: 'How would the splitting of the most downfield signal change if you switch from ethyl acetate to methyl propanoate?',
  controls: [
    {
      key: 'molecule', label: 'Ester', type: 'select', value: 'ethyl',
      options: [
        { value: 'ethyl', label: 'Ethyl acetate' },
        { value: 'methyl', label: 'Methyl propanoate' },
      ],
    },
    {
      key: 'region', label: 'Spectrum window', type: 'select', value: 'full',
      options: [
        { value: 'full', label: 'Full spectrum' },
        { value: 'downfield', label: 'Most downfield signal' },
        { value: 'middle', label: 'Middle signal' },
        { value: 'upfield', label: 'Most upfield signal' },
      ],
    },
  ],
  source: { label: 'OpenStax Organic Chemistry · Spin–spin splitting', url: 'https://openstax.org/books/organic-chemistry/pages/13-6-spin-spin-splitting-in-1h-nmr-spectra' },
  assumptions: 'The 400 MHz classroom spectra use illustrative peak positions and first-order splitting by equivalent adjacent hydrogens. A group’s integrated area is proportional to its proton count. The curves use equal linewidth and omit solvent peaks, impurities, noise and long-range coupling.',
  render({ molecule, region }) {
    const { name, formula, peaks } = spectra[molecule];
    const focus = peaks[spectrumRegions.indexOf(region)];
    const highlightColor = focus ? 'teal' : 'blue';
    const low = focus ? focus.shift - 0.09 : 0;
    const high = focus ? focus.shift + 0.09 : 5;
    const xTicks = focus
      ? [high, focus.shift + 0.045, focus.shift, focus.shift - 0.045, low].map((value) => Number(value.toFixed(3)))
      : [5, 4, 3, 2, 1, 0];
    const maxSignal = focus && focus.type !== 'singlet' ? 1.75 : 3.5;
    const prettySignal = ({ shift, type, protons, group }) =>
      `${shift.toFixed(2)} ppm, ${type}, ${protons} H from ${group}`;
    const metrics = focus ? [
      { label: 'Chemical shift', value: `${focus.shift.toFixed(2)} ppm` },
      { label: 'Multiplicity', value: focus.type },
      { label: 'Integration', value: `${focus.protons} H` },
      { label: 'Proton environment', value: focus.group },
    ] : [
      { label: 'Condensed structure', value: formula },
      { label: 'Integration (downfield to upfield)', value: peaks.map(({ protons }) => protons).join(' : ') },
      { label: 'Distinct signals', value: String(peaks.length) },
    ];

    return {
      figureLabel: focus ? `${name}, expanded proton NMR signal` : `${name}, full proton NMR spectrum`,
      summary: focus ? `${name}, ${prettySignal(focus)}.` : `${name} (${formula}). Signals from downfield to upfield are ${peaks.map(prettySignal).join(' · ')}.`,
      metrics,
      draw(ctx, colors) {
        plot(ctx, {
          x: [high, low], y: [0, maxSignal],
          xLabel: 'Chemical shift δ (ppm)', yLabel: 'Relative signal',
          xTicks, yTicks: focus && focus.type !== 'singlet' ? [0, 0.5, 1, 1.5] : [0, 1, 2, 3],
          series: [{ points: signalTrace(peaks, low, high), color: colors[highlightColor] }],
        });
        label(ctx, formula, 90, 25, { size: 20, weight: 650, color: colors.ink });
      },
    };
  },
};

export const chemistryModels = [titration, reactionEnergy, stereochemistry, protonNmr];
