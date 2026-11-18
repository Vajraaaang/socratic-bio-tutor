export const colors = {
  ink: "#172e3b",
  muted: "#4c616a",
  grid: "#dfe9e7",
  paper: "#f8fbfa",
  white: "#ffffff",
  teal: "#087567",
  tealSoft: "#e0f2ec",
  blue: "#285d95",
  blueSoft: "#e7eef9",
  rust: "#a14832",
  rustSoft: "#f8e8e0",
  gold: "#865b14",
  goldSoft: "#f5efd9",
  violet: "#6d4e95",
  violetSoft: "#eee7f7",
};

export const figureWidth = 720;
export const figureHeight = 400;

export function label(ctx, text, x, y, options = {}) {
  const { size = 18, color = colors.ink, weight = 500, align = "left" } = options;
  ctx.save();
  ctx.font = `${weight} ${size}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function line(ctx, x1, y1, x2, y2, options = {}) {
  const { color = colors.ink, width = 2, dash = [] } = options;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

export function circle(ctx, x, y, radius, options = {}) {
  shape(ctx, options, () => ctx.arc(x, y, radius, 0, 2 * Math.PI));
}

export function rect(ctx, x, y, width, height, options = {}) {
  const { radius = 0 } = options;
  shape(ctx, options, () => ctx.roundRect(x, y, width, height, radius));
}

function shape(ctx, options, path) {
  const { fill, stroke, width = 2 } = options;
  ctx.save();
  ctx.beginPath();
  path();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  ctx.restore();
}

export function arrow(ctx, x1, y1, x2, y2, options = {}) {
  const { color = colors.ink, width = 2, head = 10 } = options;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  line(ctx, x1, y1, x2, y2, { color, width });
  shape(ctx, { fill: color }, () => {
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(angle - 0.5), y2 - head * Math.sin(angle - 0.5));
    ctx.lineTo(x2 - head * Math.cos(angle + 0.5), y2 - head * Math.sin(angle + 0.5));
    ctx.closePath();
  });
}

export function plot(ctx, options) {
  const {
    x, y, xLabel, yLabel, xTicks = [], yTicks = [],
    series = [], markers = [], guides = [],
  } = options;
  const bounds = options.bounds ?? { left: 90, top: 50, right: 680, bottom: 332 };
  const { left, top, right, bottom } = bounds;
  const px = value => left + (value - x[0]) * (right - left) / (x[1] - x[0]);
  const py = value => bottom - (value - y[0]) * (bottom - top) / (y[1] - y[0]);

  for (const tick of yTicks) {
    const value = typeof tick === "number" ? tick : tick.value;
    label(ctx, typeof tick === "number" ? tick : tick.label, left - 12, py(value),
      { size: 16, align: "right", color: colors.muted });
    line(ctx, left, py(value), right, py(value), { color: colors.grid, width: 1 });
  }
  for (const tick of xTicks) {
    const value = typeof tick === "number" ? tick : tick.value;
    line(ctx, px(value), top, px(value), bottom, { color: colors.grid, width: 1 });
    label(ctx, typeof tick === "number" ? tick : tick.label, px(value), bottom + 19,
      { size: 16, align: "center", color: colors.muted });
  }

  ctx.save();
  ctx.beginPath();
  // Keep curves within both axes and leave room for markers at their endpoints.
  ctx.rect(left - 6, top - 6, right - left + 12, bottom - top + 12);
  ctx.clip();
  for (const guide of guides) {
    const style = { color: guide.color ?? colors.muted, width: 1.5, dash: guide.dash ?? [6, 5] };
    if (guide.axis === "x") {
      line(ctx, px(guide.at), top, px(guide.at), bottom, style);
    } else {
      line(ctx, left, py(guide.at), right, py(guide.at), style);
    }
  }
  for (const { points, color = colors.teal, width = 3, dash = [] } of series) {
    if (!points.length) continue;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(px(points[0][0]), py(points[0][1]));
    for (const [xValue, yValue] of points.slice(1)) ctx.lineTo(px(xValue), py(yValue));
    ctx.stroke();
    ctx.restore();
  }
  for (const marker of markers) {
    circle(ctx, px(marker.x), py(marker.y), marker.radius ?? 6,
      { fill: marker.color ?? colors.teal, stroke: colors.white, width: 2 });
  }
  ctx.restore();

  line(ctx, left, bottom, right, bottom, { color: colors.muted, width: 1 });
  line(ctx, left, top, left, bottom, { color: colors.muted, width: 1 });
  if (xLabel) label(ctx, xLabel, (left + right) / 2, bottom + 49, { align: "center" });
  if (yLabel) {
    ctx.save();
    ctx.translate(left - 60, (top + bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    label(ctx, yLabel, 0, 0, { align: "center" });
    ctx.restore();
  }
}
