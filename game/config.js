/* =========================================================
 * config.js — ค่าตั้งต้นของเกม และชื่อคลาส Tailwind ทั้งหมด
 * ชื่อคลาสเขียนเต็มทุกตัว (ห้ามต่อสตริงแบบ grid-cols-${n})
 * ========================================================= */

// ---------- การตั้งค่าแต่ละ Level ----------
export const LEVELS = [
  { name: 'มือใหม่',     size: 7,  gems: 3, monsters: 1, walls: 7,  slack: 1.9,  chase: 0.30 },
  { name: 'นักสำรวจ',    size: 8,  gems: 4, monsters: 2, walls: 11, slack: 1.7,  chase: 0.45 },
  { name: 'นักผจญภัย',   size: 9,  gems: 5, monsters: 3, walls: 15, slack: 1.55, chase: 0.60 },
  { name: 'ผู้กล้า',      size: 10, gems: 6, monsters: 4, walls: 20, slack: 1.45, chase: 0.75 },
  { name: 'ตำนาน',       size: 10, gems: 7, monsters: 5, walls: 24, slack: 1.35, chase: 0.90 },
];
export const MAX_HEARTS = 3;

export const DIRS = {
  up:    [-1, 0],
  down:  [1, 0],
  left:  [0, -1],
  right: [0, 1],
  wait:  [0, 0],
};

// ---------- คลาสของกระดาน ----------
export const BOARD_BASE =
  'grid h-full w-full gap-0.5 rounded-2xl border-4 border-stone-700 bg-stone-800 p-1 shadow-xl [container-type:inline-size] ' +
  'dark:border-stone-600 dark:bg-black forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] sm:gap-1';

export const GRID_COLS = {
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
};

// ---------- คลาสของแต่ละช่อง ----------
export const CELL_BASE =
  'flex aspect-square items-center justify-center rounded-md select-none leading-none ' +
  'transition-colors duration-150 motion-reduce:transition-none';

// ขนาดอีโมจิในช่อง อิงความกว้างกระดาน (cqw) ตามจำนวนช่อง
export const CELL_TEXT = {
  7: 'text-[8cqw]',
  8: 'text-[7cqw]',
  9: 'text-[6.2cqw]',
  10: 'text-[5.6cqw]',
};

export const CELL_STYLE = {
  floor:   'bg-stone-300 dark:bg-stone-700 forced-colors:border forced-colors:border-[GrayText]',
  wall:    'bg-stone-600 dark:bg-stone-900 forced-colors:bg-[GrayText]',
  gem:     'bg-cyan-200 dark:bg-cyan-900 forced-colors:border forced-colors:border-[CanvasText]',
  exitLocked: 'bg-stone-400 dark:bg-stone-600 forced-colors:border-2 forced-colors:border-[GrayText]',
  exitOpen:   'bg-emerald-400 dark:bg-emerald-700 animate-pulse motion-reduce:animate-none forced-colors:border-2 forced-colors:border-[LinkText]',
  monster: 'bg-rose-300 dark:bg-rose-900 forced-colors:border-2 forced-colors:border-[CanvasText]',
  player:  'bg-amber-300 ring-4 ring-amber-500 dark:bg-amber-600 dark:ring-amber-300 forced-colors:bg-[Highlight] forced-colors:ring-[Highlight]',
  start:   'bg-stone-200 dark:bg-stone-600 forced-colors:border forced-colors:border-[GrayText]',
};

export const CELL_ICON = {
  player: '🧙',
  monster: '👾',
  wall: '🧱',
  gem: '💎',
  exitOpen: '🚪',
  exitLocked: '🔒',
  start: '',
  floor: '',
};

// ---------- คลาสของข้อความสถานะ / ผลลัพธ์ / แถบก้าว ----------
const STATUS_BASE = 'shrink-0 rounded-lg border-2 max-lg:landscape:col-span-2 px-3 py-1.5 text-sm font-medium forced-colors:border-[CanvasText] ';
export const STATUS_STYLE = {
  info: STATUS_BASE + 'border-amber-300 bg-amber-100 text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100',
  good: STATUS_BASE + 'border-emerald-300 bg-emerald-100 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100',
  bad:  STATUS_BASE + 'border-rose-300 bg-rose-100 text-rose-950 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-100',
};

export const RESULT_STYLE = {
  won:  'w-full max-w-sm rounded-xl border-2 p-4 text-center shadow-2xl border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-50 focus:outline-none forced-colors:border-[CanvasText]',
  lost: 'w-full max-w-sm rounded-xl border-2 p-4 text-center shadow-2xl border-rose-400 bg-rose-50 text-rose-950 dark:border-rose-600 dark:bg-rose-950 dark:text-rose-50 focus:outline-none forced-colors:border-[CanvasText]',
};

const STEPS_BAR_BASE = 'h-full rounded-full transition-all duration-300 motion-reduce:transition-none forced-colors:bg-[Highlight] ';
export const STEPS_BAR_STYLE = {
  high: STEPS_BAR_BASE + 'bg-sky-500',
  mid:  STEPS_BAR_BASE + 'bg-amber-500',
  low:  STEPS_BAR_BASE + 'bg-rose-500',
};
