import { arrow, label, line, plot, rect } from "./drawing.js";

const number = (value, decimals = 2) => Number(value.toFixed(decimals)).toString();
const samples = (upper, fn, size = 160) =>
  Array.from({ length: size + 1 }, (_, index) => {
    const x = upper * index / size;
    return [x, fn(x)];
  });

export function enzymeParameters(inhibition, ratio) {
  const factor = 1 + ratio;
  return {
    vmax: inhibition === "noncompetitive" ? 120 / factor : 120,
    km: inhibition === "competitive" ? 2 * factor : 2,
  };
}

export function initialRate(substrate, { vmax, km }) {
  return vmax * substrate / (km + substrate);
}

function legend(ctx, x, y, text, color, dash = []) {
  line(ctx, x, y, x + 27, y, { color, width: 3, dash });
  label(ctx, text, x + 36, y, { color, size: 17, weight: 650 });
}

const enzyme = {
  id: "enzyme-kinetics",
  subject: "Biology",
  title: "Enzyme kinetics",
  course: "BIO SCI 98",
  intro: "Compare initial rates for an idealized enzyme as substrate and inhibitor levels change.",
  prediction: "What will happen to the plateau when you switch from competitive to pure noncompetitive inhibition?",
  controls: [
    { key: "inhibition", label: "Inhibition", type: "select", value: "competitive", options: [
      { value: "none", label: "No inhibitor" },
      { value: "competitive", label: "Competitive" },
      { value: "noncompetitive", label: "Pure noncompetitive" },
    ] },
    { key: "substrate", label: "Substrate [S]", type: "range", min: 0, max: 30, step: 0.5, value: 5, unit: "mM" },
    { key: "ratio", label: "Inhibitor ratio [I]/Kᵢ", type: "range", min: 0, max: 4, step: 0.25, value: 1 },
  ],
  source: {
    label: "NCBI Assay Guidance Manual · inhibition mechanisms",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK92001/",
  },
  assumptions: "Initial rate v₀ = Vₘₐₓ[S]/(Kₘ + [S]). Baseline Kₘ is 2 mM and Vₘₐₓ is 120 µM/min. Competitive inhibition multiplies apparent Kₘ by 1 + [I]/Kᵢ. In the pure noncompetitive special case, the inhibitor binds E and ES equally well, so the same factor divides apparent Vₘₐₓ. The enzyme has one substrate and no cooperativity. Rate and substrate use different concentration units. All values are illustrative.",
  render({ inhibition, substrate, ratio }) {
    const reference = enzymeParameters("none", 0);
    const trial = enzymeParameters(inhibition, ratio);
    const referenceRate = initialRate(substrate, reference);
    const trialRate = initialRate(substrate, trial);
    return {
      figureLabel: "Initial reaction rate plotted against substrate concentration. The dashed curve is the uninhibited control.",
      summary: `At [S] = ${number(substrate)} mM, the trial rate is ${number(trialRate, 1)} µM/min and the uninhibited rate is ${number(referenceRate, 1)} µM/min.`,
      metrics: [
        { label: "Trial rate", value: `${number(trialRate, 1)} µM/min` },
        { label: "Apparent Kₘ", value: `${number(trial.km)} mM` },
        { label: "Apparent Vₘₐₓ", value: `${number(trial.vmax)} µM/min` },
      ],
      draw(ctx, theme) {
        plot(ctx, {
          x: [0, 30], y: [0, 130],
          xLabel: "Substrate concentration [S] (mM)", yLabel: "Initial rate v₀ (µM/min)",
          xTicks: [0, 5, 10, 15, 20, 25, 30], yTicks: [0, 30, 60, 90, 120],
          series: [
            { points: samples(30, x => initialRate(x, trial)), color: theme.teal, width: 4 },
            { points: samples(30, x => initialRate(x, reference)), color: theme.blue, dash: [8, 6], width: 2.5 },
          ],
          guides: [{ axis: "x", at: substrate }, { axis: "y", at: trial.vmax, color: theme.teal }],
          markers: [
            { x: substrate, y: referenceRate, color: theme.blue, radius: 7 },
            { x: substrate, y: trialRate, color: theme.teal, radius: 6 },
          ],
        });
        legend(ctx, 92, 25, "Uninhibited control", theme.blue, [8, 6]);
        legend(ctx, 340, 25, "Current trial", theme.teal);
      },
    };
  },
};

export function beerLambert(concentrationMicromolar, pathCm) {
  const absorbance = 4000 * pathCm * concentrationMicromolar / 1_000_000;
  return { absorbance, transmittance: 10 ** (-absorbance) };
}

const absorbance = {
  id: "absorbance",
  subject: "Chemistry",
  title: "Absorbance and concentration",
  course: "CHEM 1LC · 152",
  intro: "Vary the concentration of an absorbing solute and the distance light travels through it.",
  prediction: "If you double the path length at the same concentration, how will absorbance and transmitted light each change?",
  controls: [
    { key: "concentration", label: "Solute concentration", type: "range", min: 0, max: 500, step: 25, value: 150, unit: "µM" },
    { key: "path", label: "Optical path length", type: "range", min: 0.25, max: 2, step: 0.25, value: 1, unit: "cm" },
  ],
  source: {
    label: "Duke Analytical Chemistry · Absorbance and Beer’s law",
    url: "https://chem.libretexts.org/Courses/Duke_University/CHEM_401L%3A_Analytical_Chemistry_Lab/06%3A_Instrument_Facilities_for_CHEM401L/02%3A_Absorption_Spectrometers_%28UV-vis%29/2.01%3A_Absorbance_and_Beer%27s_Law",
  },
  assumptions: "A = εℓc and T = P/P₀ = 10⁻ᴬ. This uses a fixed wavelength and ε = 4,000 L⋅mol⁻¹⋅cm⁻¹. The homogeneous solution follows ideal Beer–Lambert behavior. The beam bars indicate relative radiant power. The drawing does not model scattering, detector limits or real spectra.",
  render({ concentration, path }) {
    const reading = beerLambert(concentration, path);
    const transmitted = number(100 * reading.transmittance, 2);
    return {
      figureLabel: "A light beam passes through a sample cuvette. Below, a graph relates absorbance to concentration.",
      summary: `At ${concentration} µM and ${number(path)} cm, absorbance is ${number(reading.absorbance, 3)} and ${transmitted}% of the incident light is transmitted.`,
      metrics: [
        { label: "Absorbance A", value: number(reading.absorbance, 3) },
        { label: "Transmitted P/P₀", value: `${transmitted}%` },
        { label: "Slope at this path length", value: `${number(path * 0.004, 4)} per µM` },
      ],
      draw(ctx, theme) {
        const cellWidth = 70 + path * 54;
        const cellLeft = 352 - cellWidth / 2;
        const cellRight = cellLeft + cellWidth;
        rect(ctx, cellLeft, 39, cellWidth, 72,
          { radius: 8, fill: theme.tealSoft, stroke: theme.teal });
        arrow(ctx, 108, 75, cellLeft - 13, 75, { color: theme.gold, width: 7, head: 14 });
        arrow(ctx, cellRight + 13, 75, 587, 75,
          { color: theme.gold, width: 1 + 6 * reading.transmittance, head: 9 });
        label(ctx, "Incident · P₀", 108, 43, { color: theme.gold, weight: 650 });
        label(ctx, "Transmitted · P", 587, 43, { color: theme.gold, weight: 650, align: "right" });
        label(ctx, `${number(path)} cm`, 352, 75, { align: "center", color: theme.teal, weight: 700 });
        plot(ctx, {
          bounds: { left: 90, top: 148, right: 680, bottom: 330 },
          x: [0, 500], y: [0, 4],
          xLabel: "Concentration (µM)", yLabel: "Absorbance A",
          xTicks: [0, 100, 200, 300, 400, 500], yTicks: [0, 1, 2, 3, 4],
          series: [{ points: [[0, 0], [500, beerLambert(500, path).absorbance]], color: theme.teal }],
          markers: [{ x: concentration, y: reading.absorbance }],
        });
      },
    };
  },
};

export function boxState(n, lengthNm) {
  const planck = 6.62607015e-34;
  const electronMass = 9.1093837139e-31;
  const joulesPerEV = 1.602176634e-19;
  const lengthMeters = lengthNm * 1e-9;
  const energy = n ** 2 * planck ** 2 / (8 * electronMass * lengthMeters ** 2 * joulesPerEV);
  return {
    energy,
    psi: fraction => fraction <= 0 || fraction >= 1 ? 0 : Math.SQRT2 * Math.sin(n * Math.PI * fraction),
  };
}

const particle = {
  id: "particle-in-a-box",
  subject: "Chemistry",
  title: "Particle in a box",
  course: "CHEM 132B",
  intro: "Change the quantum state and the width of a one-dimensional infinite well confining an electron.",
  prediction: "With the box width fixed, how will increasing n from 2 to 3 change the number of internal nodes and the energy?",
  controls: [
    { key: "state", label: "Quantum number n", type: "range", min: 1, max: 5, step: 1, value: 2 },
    { key: "width", label: "Well width L", type: "range", min: 0.5, max: 2, step: 0.1, value: 1, unit: "nm" },
  ],
  source: {
    label: "OpenStax University Physics · the quantum particle in a box",
    url: "https://openstax.org/books/university-physics-volume-3/pages/7-4-the-quantum-particle-in-a-box",
  },
  assumptions: "For an electron in a one-dimensional infinite square well, Eₙ = n²h²/(8mₑL²) and ψₙ(x) = √(2/L) sin(nπx/L). The chart shows the dimensionless scaled quantities √L ψ and L|ψ|² versus x/L. The physical density |ψ|² is normalized over x from 0 to L. The well walls are fixed at x = 0 and x = L.",
  render({ state, width }) {
    const { energy, psi } = boxState(state, width);
    const nodes = Array.from({ length: state - 1 }, (_, index) => (index + 1) / state);
    return {
      figureLabel: "Signed wave function and nonnegative probability density between the two walls of an infinite well.",
      summary: `State n = ${state} in a ${number(width)} nm well has energy ${number(energy, 3)} eV. ${nodes.length ? `Interior nodes at x/L = ${nodes.map(value => number(value, 3)).join(", ")}.` : "There are no interior nodes."}`,
      metrics: [
        { label: "Energy Eₙ", value: `${number(energy, 3)} eV` },
        { label: "Interior nodes", value: String(nodes.length) },
        { label: "Boundary values ψ(0), ψ(L)", value: "0, 0" },
      ],
      draw(ctx, theme) {
        plot(ctx, {
          x: [0, 1], y: [-1.6, 2.1],
          xLabel: "Position relative to well width (x/L)", yLabel: "Scaled value",
          xTicks: [0, 0.25, 0.5, 0.75, 1], yTicks: [-1, 0, 1, 2],
          series: [
            { points: samples(1, psi), color: theme.blue, dash: [8, 6] },
            { points: samples(1, x => psi(x) ** 2), color: theme.teal },
          ],
          guides: [{ axis: "y", at: 0 }, ...nodes.map(at => ({ axis: "x", at }))],
          markers: nodes.map(x => ({ x, y: 0, color: theme.violet })),
        });
        legend(ctx, 92, 25, "Scaled wave function", theme.blue, [8, 6]);
        legend(ctx, 380, 25, "Scaled probability density", theme.teal);
      },
    };
  },
};

export const coreModels = [enzyme, absorbance, particle];
