export const STRING_IDLE_COLOR = "#444444";
export const STRING_HEIGHT_RATIO = 0.58;
export const STRING_SETTLE_SECONDS = 2.5;

export type StringSegment = {
  y: number;
  offset: number;
  velocity: number;
};

export type StringModel = {
  x: number;
  segments: StringSegment[];
  tension: number;
  damping: number;
  width: number;
  playing: boolean;
  playTime: number;
};

function createStringSegments(canvasHeight: number): StringSegment[] {
  const segments: StringSegment[] = [];
  const segmentCount = 20;
  const drawHeight = canvasHeight * STRING_HEIGHT_RATIO;
  const yOffset = (canvasHeight - drawHeight) / 2;
  const segmentHeight = drawHeight / segmentCount;

  for (let i = 0; i <= segmentCount; i++) {
    segments.push({
      y: yOffset + i * segmentHeight,
      offset: 0,
      velocity: 0,
    });
  }

  return segments;
}

function resetStringToRest(string: StringModel): void {
  string.playing = false;
  string.playTime = 0;
  string.segments.forEach((segment) => {
    segment.offset = 0;
    segment.velocity = 0;
  });
}

export function initStrings(width: number, height: number): StringModel[] {
  const stringCount = Math.max(8, Math.floor(width / 36));
  const strings: StringModel[] = [];

  for (let i = 0; i < stringCount; i++) {
    strings.push({
      x: (width / stringCount) * i + width / stringCount / 2,
      segments: createStringSegments(height),
      tension: 0.025,
      damping: 0.98,
      width: 2,
      playing: false,
      playTime: 0,
    });
  }

  return strings;
}

export function pluckString(strings: StringModel[], index: number, force = 5): void {
  const string = strings[index];
  if (!string) return;

  const middleIndex = Math.floor(string.segments.length / 2);
  const pluckRange = Math.floor(string.segments.length / 4);

  for (let i = middleIndex - pluckRange; i <= middleIndex + pluckRange; i++) {
    if (i >= 0 && i < string.segments.length) {
      const falloff = 1 - Math.abs(middleIndex - i) / pluckRange;
      string.segments[i].offset = (Math.random() > 0.5 ? 1 : -1) * force * falloff;
      string.segments[i].velocity = 0;
    }
  }

  string.playing = true;
  string.playTime = 0;
}

export function updateStrings(
  ctx: CanvasRenderingContext2D,
  strings: StringModel[],
  reducedMotion: boolean,
  deltaSeconds: number,
): void {
  strings.forEach((string) => {
    if (!reducedMotion) {
      const settleProgress = string.playing
        ? string.playTime / STRING_SETTLE_SECONDS
        : 1;
      const extraDamping = string.playing
        ? 0.98 - Math.min(settleProgress, 1) * 0.08
        : 0.98;

      for (let i = 1; i < string.segments.length - 1; i++) {
        const segment = string.segments[i];
        const prevSegment = string.segments[i - 1];
        const nextSegment = string.segments[i + 1];

        const force =
          (prevSegment.offset + nextSegment.offset - 2 * segment.offset) * string.tension;
        segment.velocity += force;
        segment.velocity *= extraDamping;
        segment.offset += segment.velocity;
      }

      if (string.playing) {
        string.playTime += deltaSeconds;
        if (string.playTime >= STRING_SETTLE_SECONDS) {
          resetStringToRest(string);
        }
      }
    }

    drawString(ctx, string);
  });
}

function drawString(ctx: CanvasRenderingContext2D, string: StringModel): void {
  ctx.beginPath();

  if (string.playing) {
    ctx.shadowBlur = 0;
    const t = 1 - string.playTime / STRING_SETTLE_SECONDS;
    const r = Math.floor(230 + 25 * t);
    const g = Math.floor(59 + 40 * t);
    const b = Math.floor(46 + 30 * t);
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
  } else {
    ctx.strokeStyle = STRING_IDLE_COLOR;
    ctx.shadowColor = "rgba(68, 68, 68, 0.35)";
    ctx.shadowBlur = 3;
  }

  ctx.lineWidth = string.width;
  ctx.moveTo(string.x, string.segments[0].y);

  for (let i = 1; i < string.segments.length; i++) {
    const segment = string.segments[i];
    ctx.lineTo(string.x + segment.offset, segment.y);
  }

  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function resetCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
}

export function drawStaticStrings(
  ctx: CanvasRenderingContext2D,
  strings: StringModel[],
): void {
  strings.forEach((string) => {
    ctx.beginPath();
    ctx.strokeStyle = STRING_IDLE_COLOR;
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(68, 68, 68, 0.35)";
    ctx.shadowBlur = 3;
    ctx.moveTo(string.x, string.segments[0].y);
    ctx.lineTo(string.x, string.segments[string.segments.length - 1].y);
    ctx.stroke();
    ctx.shadowBlur = 0;
  });
}
