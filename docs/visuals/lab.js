import { colors, figureHeight, figureWidth } from "./drawing.js";
import { coreModels } from "./core.js";
import { geneticsModels } from "./genetics.js";
import { systemsModels } from "./systems.js";
import { chemistryModels } from "./chemistry.js";

const models = [...coreModels, ...geneticsModels, ...systemsModels, ...chemistryModels];
const sections = {
  Biology: [
    "enzyme-kinetics", "gene-expression", "linked-genes", "gene-regulation",
    "membrane-transport", "action-potential", "population-growth", "natural-selection",
  ],
  Chemistry: [
    "titration", "reaction-energy", "stereochemistry", "proton-nmr",
    "absorbance", "particle-in-a-box",
  ],
};
const byId = new Map(models.map(model => [model.id, model]));
const defaultModel = byId.get("enzyme-kinetics");

const get = id => document.getElementById(id);
const library = get("library");
const picker = get("model-picker");
const controls = get("controls");
const canvas = get("model-canvas");
const metrics = get("metrics");
const figure = canvas.parentElement;
const hint = document.querySelector(".figure-hint");
const context = canvas.getContext("2d");
const widthScale = Math.min(window.devicePixelRatio || 1, 3);

let activeModel;
let values;

function element(tag, text) {
  const child = document.createElement(tag);
  if (text !== undefined) child.textContent = text;
  return child;
}

function buildLibrary() {
  for (const [subject, ids] of Object.entries(sections)) {
    const list = element("ul");
    const group = element("optgroup");
    group.label = subject;

    for (const id of ids) {
      const { title } = byId.get(id);
      const link = element("a", title);
      link.href = `#${id}`;
      const item = element("li");
      item.append(link);
      list.append(item);

      const option = element("option", title);
      option.value = id;
      group.append(option);
    }
    library.append(element("h2", subject), list);
    picker.append(group);
  }
}

function selectControl(config, fieldId) {
  const field = element("select");
  field.id = fieldId;
  for (const { value, label } of config.options) {
    const option = element("option", label);
    option.value = value;
    field.append(option);
  }
  field.value = config.value;
  field.addEventListener("change", () => update(config.key, field.value));
  return field;
}

function rangeControl(config, fieldId, controlLabel) {
  const field = element("input");
  const reading = element("span");
  const header = element("div");
  header.className = "range-header";
  field.id = fieldId;
  field.type = "range";
  field.min = config.min;
  field.max = config.max;
  field.step = config.step;
  field.value = config.value;
  reading.className = "range-value";
  reading.setAttribute("aria-hidden", "true");
  header.append(controlLabel, reading);

  function describe() {
    const display = config.unit ? `${field.value} ${config.unit}` : field.value;
    reading.textContent = display;
    field.setAttribute("aria-valuetext", display);
  }
  describe();
  field.addEventListener("input", () => {
    describe();
    update(config.key, field.valueAsNumber);
  });
  return [header, field];
}

function buildControls() {
  controls.replaceChildren();
  for (const config of activeModel.controls) {
    const wrapper = element("div");
    wrapper.className = "control";
    const fieldId = `control-${config.key}`;
    const controlLabel = element("label", config.label);
    controlLabel.htmlFor = fieldId;
    if (config.type === "select") {
      wrapper.append(controlLabel, selectControl(config, fieldId));
    } else {
      wrapper.append(...rangeControl(config, fieldId, controlLabel));
    }
    controls.append(wrapper);
  }
}

function showReadout() {
  const reading = activeModel.render(values);
  canvas.setAttribute("aria-label", reading.figureLabel);
  context.setTransform(widthScale, 0, 0, widthScale, 0, 0);
  context.fillStyle = colors.paper;
  context.fillRect(0, 0, figureWidth, figureHeight);
  reading.draw(context, colors);

  metrics.replaceChildren(...reading.metrics.map(metric => {
    const pair = element("div");
    pair.append(element("dt", metric.label), element("dd", metric.value));
    return pair;
  }));
  get("model-summary").textContent = reading.summary;
}

function update(key, value) {
  values[key] = value;
  showReadout();
}

function reset() {
  values = Object.fromEntries(activeModel.controls.map(config => [config.key, config.value]));
  buildControls();
  showReadout();
}

function selectModel() {
  const id = window.location.hash.slice(1);
  const next = byId.get(id) ?? defaultModel;
  if (activeModel === next) return;
  activeModel = next;

  const activeLink = library.querySelector(`[href="#${next.id}"]`);
  library.querySelector("[aria-current]")?.removeAttribute("aria-current");
  activeLink.setAttribute("aria-current", "true");
  picker.value = next.id;
  get("course").textContent = next.course;
  get("model-title").textContent = next.title;
  get("model-intro").textContent = next.intro;
  get("prediction").textContent = next.prediction;
  get("assumptions").textContent = next.assumptions;
  get("model-source").textContent = next.source.label;
  get("model-source").href = next.source.url;
  get("model-details").open = false;
  figure.scrollLeft = 0;
  reset();
  get("model").hidden = false;
}

if (context) {
  canvas.width = Math.round(figureWidth * widthScale);
  canvas.height = Math.round(figureHeight * widthScale);
  buildLibrary();
  get("compact-library").hidden = false;
  picker.addEventListener("change", () => { window.location.hash = picker.value; });
  get("reset").addEventListener("click", reset);
  window.addEventListener("hashchange", selectModel);
  new ResizeObserver(() => {
    const canScroll = figure.scrollWidth > figure.clientWidth;
    hint.classList.toggle("visible", canScroll);
    if (canScroll) figure.tabIndex = 0;
    else figure.removeAttribute("tabindex");
  }).observe(figure);
  selectModel();
} else {
  const fallback = element("p", "This browser cannot draw the models. The tutor can guide you through the same concepts in chat.");
  get("experiment").append(fallback);
}
