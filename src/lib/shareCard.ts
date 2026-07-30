const WIDTH = 375;
const HEIGHT = 667;
const GREEN = "#58cc02";
const DARK_GREEN = "#46a302";
const ORANGE = "#ff9600";
const BG = "#131f24";
const CARD_BG = "#1a2c35";
const WHITE = "#ffffff";
const GRAY = "#afafaf";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export interface LevelShareData {
  chapterName: string;
  score: number;
  total: number;
  xpEarned: number;
}

export interface ProfileShareData {
  totalXp: number;
  streak: number;
  completedLevels: number;
}

export function generateLevelCard(data: LevelShareData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx);

  // Logo
  ctx.font = "bold 28px system-ui";
  ctx.fillStyle = GREEN;
  ctx.textAlign = "center";
  ctx.fillText("StockLingo", WIDTH / 2, 60);

  // Chapter name
  ctx.font = "600 16px system-ui";
  ctx.fillStyle = GRAY;
  ctx.fillText(data.chapterName, WIDTH / 2, 100);

  // Score circle
  const pct = Math.round((data.score / data.total) * 100);
  drawScoreCircle(ctx, WIDTH / 2, 250, 80, pct);

  // Stats cards
  const statsY = 380;
  drawStatBox(ctx, 40, statsY, 135, 90, `${data.score}/${data.total}`, "正确题数");
  drawStatBox(ctx, 200, statsY, 135, 90, `+${data.xpEarned}`, "获得 XP");

  // Footer
  ctx.font = "14px system-ui";
  ctx.fillStyle = GRAY;
  ctx.textAlign = "center";
  ctx.fillText("来 StockLingo 学炒股", WIDTH / 2, 560);

  return canvas;
}

export function generateProfileCard(data: ProfileShareData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx);

  // Logo
  ctx.font = "bold 28px system-ui";
  ctx.fillStyle = GREEN;
  ctx.textAlign = "center";
  ctx.fillText("StockLingo", WIDTH / 2, 60);

  // Title
  ctx.font = "bold 24px system-ui";
  ctx.fillStyle = WHITE;
  ctx.fillText("我的成绩", WIDTH / 2, 130);

  // Stats
  const startY = 200;
  drawStatBox(ctx, 40, startY, 295, 100, `${data.totalXp}`, "总经验值");
  drawStatBox(ctx, 40, startY + 130, 135, 100, `${data.streak}`, "连续打卡");
  drawStatBox(ctx, 200, startY + 130, 135, 100, `${data.completedLevels}`, "完成关卡");

  // Footer
  ctx.font = "14px system-ui";
  ctx.fillStyle = GRAY;
  ctx.textAlign = "center";
  ctx.fillText("来 StockLingo 学炒股", WIDTH / 2, 560);

  return canvas;
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Decorative gradient at top
  const grad = ctx.createLinearGradient(0, 0, WIDTH, 150);
  grad.addColorStop(0, "rgba(88,204,2,0.1)");
  grad.addColorStop(1, "rgba(88,204,2,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WIDTH, 150);
}

function drawScoreCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  pct: number,
) {
  // Background circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = CARD_BG;
  ctx.lineWidth = 12;
  ctx.stroke();

  // Progress arc
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * pct) / 100;
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.strokeStyle = pct >= 60 ? GREEN : "#ff4b4b";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.stroke();

  // Percentage text
  ctx.font = "bold 48px system-ui";
  ctx.fillStyle = WHITE;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${pct}%`, cx, cy);
  ctx.textBaseline = "alphabetic";
}

function drawStatBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  value: string,
  label: string,
) {
  roundRect(ctx, x, y, w, h, 12);
  ctx.fillStyle = CARD_BG;
  ctx.fill();

  ctx.font = "bold 28px system-ui";
  ctx.fillStyle = ORANGE;
  ctx.textAlign = "center";
  ctx.fillText(value, x + w / 2, y + h / 2);

  ctx.font = "14px system-ui";
  ctx.fillStyle = GRAY;
  ctx.fillText(label, x + w / 2, y + h / 2 + 30);
}

export async function shareCanvas(canvas: HTMLCanvasElement): Promise<void> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) return;

  if (navigator.share && navigator.canShare) {
    const file = new File([blob], "stocklingo-score.png", { type: "image/png" });
    const shareData = { files: [file] };
    if (navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return;
    }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "stocklingo-score.png";
  a.click();
  URL.revokeObjectURL(url);
}
