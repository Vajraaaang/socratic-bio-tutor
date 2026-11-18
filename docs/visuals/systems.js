import { arrow, circle, label, line, plot, rect } from './drawing.js';

const cellOsmolarity = 300;
const restVoltage = -70;
const threshold = -55;
const pulseStart = 0.6;
const pulsePeak = 1.5;
const spike = [
  [0, threshold], [0.25, -30], [0.5, 14], [0.75, 36], [1, 33], [1.4, 10],
  [1.8, -34], [2.25, restVoltage], [2.8, -82], [3.4, -77], [4.25, -72], [5.2, restVoltage],
];

const percent = fraction => (fraction * 100).toFixed(1) + '%';
const voltage = mv => (mv > 0 ? '+' : mv < 0 ? '−' : '') + Math.abs(mv).toFixed(1) + ' mV';

function osmoleDots(ctx, colors, centerX, osmolarity) {
  const columns = [0, 3, 1, 4, 2];
  const rows = [1, 2, 0, 3];
  const count = Math.round(osmolarity / 25);
  for (let index = 0; index < count; index += 1) {
    const col = columns[index % columns.length];
    const row = rows[Math.floor(index / columns.length)];
    const x = centerX + (col - 2) * 36 + (row % 2 === 0 ? -5 : 5);
    const y = 131 + row * 39 + (col % 2 === 0 ? -4 : 4);
    circle(ctx, x, y, 5, { fill: colors.violet });
  }
}

const membraneTransport = {
  id: 'membrane-transport',
  subject: 'Biology',
  title: 'Osmosis across a cell membrane',
  course: 'BIO SCI 93 · E109',
  intro: 'Change the concentration of impermeable solute in the bath and compare net water flow with the cell’s change in volume.',
  prediction: 'If the bath rises from 300 to 400 mOsm/L, what is the initial direction of net water flow?',
  controls: [
    { key: 'external', label: 'Bath osmolarity', type: 'range', min: 200, max: 450, step: 25, value: 300, unit: 'mOsm/L' },
  ],
  source: {
    label: 'OpenStax Biology 2e §5.2 · Passive transport',
    url: 'https://openstax.org/books/biology-2e/pages/5-2-passive-transport',
  },
  assumptions: 'The diagram shows initial concentrations in a wall-free model cell and a large bath. Only water crosses. With fixed intracellular osmoles and negligible hydrostatic pressure, volume at equilibrium divided by starting volume equals initial intracellular osmolarity divided by bath osmolarity. The model omits active volume regulation, permeable solutes and lysis. The dots and the membrane are schematic.',
  render({ external }) {
    const gradient = external - cellOsmolarity;
    const relativeVolume = cellOsmolarity / external;
    const tonicity = gradient > 0 ? 'Hypertonic' : gradient < 0 ? 'Hypotonic' : 'Isotonic';
    const flux = gradient > 0 ? 'Out of the cell' : gradient < 0 ? 'Into the cell' : 'None';
    const volume = Math.round(relativeVolume * 100) + '%';
    const waterDescription = gradient === 0 ? 'Water moves in both directions at equal rates.' : 'Water initially flows ' + flux.toLowerCase() + '.';

    return {
      figureLabel: 'Initial osmosis across an aquaporin in a selectively permeable cell membrane.',
      summary: `The cell starts at 300 mOsm/L and the bath is at ${external} mOsm/L. ${waterDescription} At equilibrium the modeled cell reaches ${volume} of its initial volume.`,
      metrics: [
        { label: 'Bath tonicity', value: tonicity },
        { label: 'Initial net water flow', value: flux },
        { label: 'Final relative volume', value: volume },
      ],
      draw(ctx, colors) {
        rect(ctx, 35, 40, 318, 272, { fill: colors.tealSoft, radius: 20 });
        rect(ctx, 367, 40, 318, 272, { fill: colors.blueSoft, radius: 20 });
        label(ctx, 'Cell interior', 184, 78, { align: 'center', size: 25, weight: 680 });
        label(ctx, 'Extracellular bath', 536, 78, { align: 'center', size: 25, weight: 680 });
        label(ctx, '300 mOsm/L', 184, 105, { align: 'center', size: 20, color: colors.muted });
        label(ctx, external + ' mOsm/L', 536, 105, { align: 'center', size: 20, color: colors.muted });
        osmoleDots(ctx, colors, 165, cellOsmolarity);
        osmoleDots(ctx, colors, 555, external);

        for (let y = 64; y <= 296; y += 12) {
          if (y > 155 && y < 229) continue;
          for (const direction of [-1, 1]) {
            const x = 360 + direction * 14;
            circle(ctx, x, y, 4, { fill: colors.gold });
            line(ctx, x - direction * 3, y - 1, x - direction * 11, y - 3, { color: colors.gold });
            line(ctx, x - direction * 3, y + 1, x - direction * 11, y + 3, { color: colors.gold });
          }
        }
        rect(ctx, 333, 159, 54, 17, { fill: colors.teal, radius: 8 });
        rect(ctx, 333, 204, 54, 17, { fill: colors.teal, radius: 8 });

        if (gradient === 0) {
          arrow(ctx, 307, 185, 413, 185, { color: colors.blue, width: 3, head: 9 });
          arrow(ctx, 413, 196, 307, 196, { color: colors.blue, width: 3, head: 9 });
        } else {
          const flowDirection = Math.sign(gradient);
          arrow(ctx, 360 - 57 * flowDirection, 190, 360 + 57 * flowDirection, 190,
            { color: colors.blue, width: 6, head: 14 });
        }
        label(ctx, 'H₂O', 277, 190, { align: 'center', size: 20, weight: 680, color: colors.blue });
        label(ctx, 'Initial state', 52, 341, { size: 18, weight: 680 });
        label(ctx, tonicity + ' bath', 52, 370, { size: 23, weight: 680 });
        circle(ctx, 305, 337, 5, { fill: colors.violet });
        label(ctx, 'Nonpenetrating solute', 321, 343, { color: colors.muted, size: 18 });
        rect(ctx, 297, 360, 16, 10, { fill: colors.teal, radius: 4 });
        label(ctx, 'Aquaporin (water channel)', 321, 372, { color: colors.muted, size: 18 });
      },
    };
  },
};

function spikeStart(drive) {
  return pulseStart + (pulsePeak - pulseStart) * (threshold - restVoltage) / drive;
}

function membraneVoltage(time, drive) {
  if (time <= pulseStart) return restVoltage;
  if (drive < threshold - restVoltage) {
    const graded = time <= pulsePeak
      ? (time - pulseStart) / (pulsePeak - pulseStart)
      : Math.exp(-(time - pulsePeak) / 0.7);
    return restVoltage + drive * graded;
  }

  const start = spikeStart(drive);
  if (time < start) return restVoltage + drive * (time - pulseStart) / (pulsePeak - pulseStart);
  const elapsed = time - start;
  const next = spike.findIndex(([at]) => at > elapsed);
  if (next < 1) return restVoltage;
  const [leftTime, leftVoltage] = spike[next - 1];
  const [rightTime, rightVoltage] = spike[next];
  return leftVoltage + (rightVoltage - leftVoltage) * (elapsed - leftTime) / (rightTime - leftTime);
}

function channelStates(time, drive) {
  if (time < pulseStart || drive === 0) return ['Resting', 'Closed, available', 'Mostly closed'];
  if (drive < threshold - restVoltage) {
    if (time < pulsePeak) return ['Graded depolarization', 'Mostly closed', 'Mostly closed'];
    if (time < 5) return ['Graded recovery', 'Mostly closed', 'Mostly closed'];
    return ['Near resting', 'Closed, available', 'Mostly closed'];
  }

  const elapsed = time - spikeStart(drive);
  if (elapsed < 0) return ['Graded depolarization', 'Mostly closed', 'Mostly closed'];
  if (elapsed < 0.75) return ['Depolarization', 'Opening, Na⁺ inward', 'Opening slowly'];
  if (elapsed < 2.25) return ['Repolarization', 'Inactivated', 'Open, K⁺ outward'];
  if (elapsed < 5.2) return ['Afterhyperpolarization', 'Recovering', 'Closing slowly'];
  return ['Resting', 'Closed, available', 'Mostly closed'];
}

const actionPotential = {
  id: 'action-potential',
  subject: 'Biology',
  title: 'Neuron action potential',
  course: 'BIO SCI E109 · N110',
  intro: 'Move a marker along the voltage trace to compare membrane potential and voltage-gated Na⁺ and K⁺ channel states.',
  prediction: 'If you lower the stimulus from 20 to 10 mV, what happens to the voltage trace?',
  controls: [
    { key: 'drive', label: 'Stimulus depolarization', type: 'range', min: 0, max: 30, step: 1, value: 20, unit: 'mV' },
    { key: 'time', label: 'Inspect time', type: 'range', min: 0, max: 8, step: 0.1, value: 1.6, unit: 'ms' },
  ],
  source: {
    label: 'OpenStax Biology 2e §35.2 · How neurons communicate',
    url: 'https://openstax.org/books/biology-2e/pages/35-2-how-neurons-communicate',
  },
  assumptions: 'This is a piecewise schematic of one location on a typical axon. −70 mV and −55 mV are illustrative resting and threshold voltages. The input is the size of the graded depolarization it would produce without a spike. Above threshold the model uses the same spike shape. Channel states are approximate for populations of channels. The Na⁺/K⁺ pump maintains gradients over time. Fast repolarization primarily reflects Na⁺ channel inactivation and K⁺ efflux.',
  render({ time, drive }) {
    const opensSodium = drive >= threshold - restVoltage;
    const current = membraneVoltage(time, drive);
    const [phase, sodium, potassium] = channelStates(time, drive);
    const markerTimes = opensSodium ? spike.map(([at]) => at + spikeStart(drive)) : [pulseStart, pulsePeak];
    const samples = [...Array.from({ length: 81 }, (_, index) => index / 10), ...markerTimes]
      .sort((a, b) => a - b);
    const points = samples.map(t => [t, membraneVoltage(t, drive)]);
    return {
      figureLabel: 'Membrane voltage over time with a highlighted threshold and the selected channel states.',
      summary: `At ${time.toFixed(1)} ms the membrane voltage is ${voltage(current)}. ${phase}. Voltage-gated sodium channels are ${sodium.toLowerCase()} and voltage-gated potassium channels are ${potassium.toLowerCase()}.`,
      metrics: [
        { label: 'Membrane voltage', value: voltage(current) },
        { label: 'Phase', value: phase },
        { label: 'Peak voltage', value: voltage(opensSodium ? 36 : restVoltage + drive) },
      ],
      draw(ctx, colors) {
        plot(ctx, {
          x: [0, 8], y: [-100, 50],
          xLabel: 'Time (ms)', yLabel: 'Membrane voltage (mV)',
          xTicks: [0, 2, 4, 6, 8], yTicks: [-100, -70, -55, 0, 50],
          series: [{ points, color: colors.blue, width: 4 }],
          guides: [{ axis: 'y', at: threshold, color: colors.rust, dash: [6, 5] }],
          markers: [{ x: time, y: current, color: colors.teal }],
          bounds: { left: 103, top: 34, right: 680, bottom: 258 },
        });
        line(ctx, 478, 16, 505, 16, { color: colors.rust, dash: [6, 5] });
        label(ctx, 'Threshold (−55 mV)', 514, 16, { size: 16, color: colors.rust });

        rect(ctx, 31, 328, 319, 58, { fill: colors.blueSoft, radius: 11 });
        rect(ctx, 370, 328, 319, 58, { fill: colors.rustSoft, radius: 11 });
        label(ctx, 'Na⁺ channels', 48, 350, { color: colors.blue, size: 18, weight: 680 });
        label(ctx, sodium, 48, 373, { size: 20, weight: 620 });
        label(ctx, 'K⁺ channels', 387, 350, { color: colors.rust, size: 18, weight: 680 });
        label(ctx, potassium, 387, 373, { size: 20, weight: 620 });
      },
    };
  },
};

const endDay = 12;
function headcount(time, initial, rate, capacity) {
  if (capacity === undefined) return initial * Math.exp(rate * time);
  return capacity / (1 + (capacity / initial - 1) * Math.exp(-rate * time));
}

function populationTicks(maximum) {
  const magnitude = 10 ** Math.floor(Math.log10(maximum / 4));
  const interval = Math.ceil(maximum / (4 * magnitude)) * magnitude;
  return Array.from({ length: 5 }, (_, index) => index * interval);
}

const populationGrowth = {
  id: 'population-growth',
  subject: 'Biology',
  title: 'Population growth and carrying capacity',
  course: 'BIO SCI 94 · E106',
  intro: 'Compare an exponential population with a density-limited population that starts with the same size and intrinsic growth rate.',
  prediction: 'What happens to the logistic curve if you set the initial population above carrying capacity?',
  controls: [
    { key: 'mode', label: 'Growth model', type: 'select',
      options: [
        { value: 'logistic', label: 'Logistic' },
        { value: 'exponential', label: 'Exponential' },
        { value: 'compare', label: 'Compare both' },
      ], value: 'logistic' },
    { key: 'initial', label: 'Initial population N₀', type: 'range', min: 20, max: 280, step: 20, value: 40 },
    { key: 'capacity', label: 'Carrying capacity K', type: 'range', min: 100, max: 400, step: 25, value: 200 },
    { key: 'rate', label: 'Intrinsic growth rate r', type: 'range', min: 0, max: 0.35, step: 0.05, value: 0.30, unit: 'day⁻¹' },
  ],
  source: {
    label: 'OpenStax Biology 2e §45.3 · Environmental limits to population growth',
    url: 'https://openstax.org/books/biology-2e/pages/45-3-environmental-limits-to-population-growth',
  },
  assumptions: 'The exponential model uses dN/dt = rN. The logistic model uses dN/dt = rN(1 − N/K). Both are continuous and deterministic. K and r stay constant and there is no migration or demographic randomness. The decimal headcounts are model estimates.',
  render({ mode, initial, capacity, rate }) {
    const logistic = mode !== 'exponential';
    const exponential = mode !== 'logistic';
    const initialChange = rate * initial * (logistic ? 1 - initial / capacity : 1);
    const lt = headcount(endDay, initial, rate, capacity);
    const et = headcount(endDay, initial, rate);
    const estimates = [];
    if (logistic) estimates.push({ label: 'Logistic N after 12 days', value: lt.toFixed(1) });
    if (exponential) estimates.push({ label: 'Exponential N after 12 days', value: et.toFixed(1) });
    const yTicks = populationTicks(Math.max(initial, logistic ? Math.max(capacity, lt) : 0, exponential ? et : 0));

    return {
      figureLabel: 'Population size against time for the selected model or models.',
      summary: `The starting population is ${initial}. ${logistic ? `The logistic population reaches ${lt.toFixed(1)} after 12 days with carrying capacity ${capacity}. ` : ''}${exponential ? `The exponential population reaches ${et.toFixed(1)} after 12 days.` : ''}`.trim(),
      metrics: [
        ...estimates,
        { label: mode === 'compare' ? 'Initial logistic growth' : 'Initial population growth', value: initialChange.toFixed(1) + ' individuals/day' },
      ],
      draw(ctx, colors) {
        const makeSeries = (color, cap, dash) => ({
          color, width: 4, dash,
          points: Array.from({ length: 61 }, (_, index) => {
            const time = index / 5;
            return [time, headcount(time, initial, rate, cap)];
          }),
        });
        const series = [];
        if (logistic) series.push(makeSeries(colors.teal, capacity));
        if (exponential) series.push(makeSeries(colors.rust, undefined, [9, 4]));

        plot(ctx, {
          x: [0, 12], y: [0, yTicks[yTicks.length - 1]], xTicks: [0, 3, 6, 9, 12],
          yTicks: yTicks.map(value => ({ value, label: value >= 1000 ? value / 1000 + 'k' : String(value) })),
          xLabel: 'Time (days)', yLabel: 'Population (individuals)',
          series, guides: logistic ? [{ axis: 'y', at: capacity, color: colors.muted, dash: [4, 5] }] : [],
          bounds: { left: 112, top: 32, right: 680, bottom: 299 },
        });
        if (logistic) {
          line(ctx, 100, 370, 121, 370, { color: colors.teal, width: 4 });
          label(ctx, 'Logistic', 132, 376, { color: colors.teal, size: 19, weight: 680 });
          line(ctx, 251, 370, 274, 370, { color: colors.muted, dash: [3, 4] });
          label(ctx, 'K = ' + capacity, 286, 376, { color: colors.muted, size: 19 });
        }
        if (exponential) {
          const left = logistic ? 418 : 100;
          line(ctx, left, 370, left + 25, 370, { color: colors.rust, width: 4, dash: [9, 4] });
          label(ctx, 'Exponential', left + 36, 376, { color: colors.rust, size: 19, weight: 680 });
        }
      },
    };
  },
};

const generations = 20;
function genotypeFractions(p) {
  const q = 1 - p;
  return [p * p, 2 * p * q, q * q];
}

function nextAlleleFrequency(p, fitness) {
  const [aaUpper, hetero, aaLower] = genotypeFractions(p).map((share, index) => share * fitness[index]);
  return (aaUpper + hetero / 2) / (aaUpper + hetero + aaLower);
}

function genotypeFitnessLabel(name, genotype, fitness) {
  return { key: name, label: genotype + ' relative fitness', type: 'range', min: 0.25, max: 1, step: 0.05, value: fitness };
}

const naturalSelection = {
  id: 'natural-selection',
  subject: 'Biology',
  title: 'Allele frequencies under selection',
  course: 'BIO SCI 94 · 97 · E106',
  intro: 'Change genotype fitness and follow how selection shifts an allele’s frequency across diploid generations.',
  prediction: 'If AA and aa both have a relative fitness of 0.60 and Aa stays at 1.00, how does the frequency of A change?',
  controls: [
    { key: 'initial', label: 'Starting A frequency', type: 'range', min: 0, max: 1, step: 0.05, value: 0.5 },
    genotypeFitnessLabel('fitAA', 'AA', 1),
    genotypeFitnessLabel('fitAa', 'Aa', 1),
    genotypeFitnessLabel('fitaa', 'aa', 0.6),
  ],
  source: {
    label: 'OpenStax Biology 2e §19.3 · Adaptive evolution',
    url: 'https://openstax.org/books/biology-2e/pages/19-3-adaptive-evolution',
  },
  assumptions: 'One autosomal locus with two alleles in a large, randomly mating diploid population. Zygote proportions before selection are p², 2pq and q², with q = 1 − p. Weight each proportion by its relative fitness and normalize by mean fitness. The next A frequency is the weighted share of AA plus half the weighted share of Aa. There is no mutation, migration or drift, and relative fitness is constant.',
  render({ initial, fitAA, fitAa, fitaa }) {
    const fitness = [fitAA, fitAa, fitaa];
    const points = [[0, initial]];
    let p = initial;
    for (let generation = 1; generation <= generations; generation += 1) {
      p = nextAlleleFrequency(p, fitness);
      points.push([generation, p]);
    }

    const shares = genotypeFractions(p);
    const genotypeNames = ['AA', 'Aa', 'aa'];
    const zygotes = shares.map((share, index) => genotypeNames[index] + ' ' + percent(share)).join(' · ');
    return {
      figureLabel: 'A allele frequency over 20 generations and generation-20 genotype fractions before selection.',
      summary: `A starts at ${percent(initial)} and reaches ${percent(p)} at generation 20. The modeled generation-20 zygotes before selection are ${zygotes}.`,
      metrics: [
        { label: 'A frequency at generation 20', value: percent(p) },
        { label: 'a frequency at generation 20', value: percent(1 - p) },
        { label: 'Zygotes before selection', value: zygotes },
      ],
      draw(ctx, colors) {
        plot(ctx, {
          x: [0, 20], y: [0, 1], xTicks: [0, 5, 10, 15, 20], yTicks: [0, 0.25, 0.5, 0.75, 1],
          xLabel: 'Generation', yLabel: 'A allele frequency (p)',
          series: [{ points, color: colors.teal, width: 4 }],
          markers: [{ x: 20, y: p, color: colors.teal }],
          bounds: { left: 90, top: 32, right: 680, bottom: 253 },
        });

        label(ctx, 'Generation 20 zygotes', 90, 327, { size: 18, weight: 680 });
        const fills = [colors.teal, colors.blue, colors.violet];
        let left = 90;
        const barWidth = 540;
        shares.forEach((share, index) => {
          const width = share * barWidth;
          if (width > 0) rect(ctx, left, 338, width, 18, { fill: fills[index] });
          left += width;
        });
        genotypeNames.forEach((name, index) => {
          const x = 90 + index * 180;
          circle(ctx, x + 5, 375, 5, { fill: fills[index] });
          label(ctx, name + ' ' + percent(shares[index]), x + 18, 381, { size: 18, weight: 620 });
        });
      },
    };
  },
};

export const systemsModels = [membraneTransport, actionPotential, populationGrowth, naturalSelection];
