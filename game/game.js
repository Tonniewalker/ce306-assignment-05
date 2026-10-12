/* =========================================================
 * game.js — ตรรกะของเกม (สถานะ การเดิน มอนสเตอร์ ชนะ/แพ้)
 * ชนะ: เก็บอัญมณีครบแล้วไปถึงประตู
 * แพ้: หัวใจหมด หรือ ก้าวเดินหมด
 * ========================================================= */

import { LEVELS, MAX_HEARTS, DIRS } from './config.js';
import { key, same, manhattan, randInt } from './utils.js';
import { generateMap, isWalkable, monsterAt } from './map.js';
import {
  render, setStatus, renderLevelControls, showResult, showEndScreen, shakeBoard,
} from './render.js';

// ---------- สถานะเกม ----------
let state = null;
let level = 1;

export const getState = () => state;
export const getLevel = () => level;

// ---------- เริ่มเกม ----------
export function newGame(lvl = level) {
  level = Math.min(Math.max(lvl, 1), LEVELS.length);
  const cfg = LEVELS[level - 1];
  const map = generateMap(cfg);

  state = {
    ...map,
    cfg,
    player: { ...map.start },
    hearts: MAX_HEARTS,
    stepsLeft: map.steps,
    totalGems: map.gems.size,
    status: 'playing',
  };

  showResult(false);
  renderLevelControls(level);
  render(state);
  setStatus(
    `Level ${level} (${cfg.name}) เริ่มแล้ว! เก็บอัญมณี ${state.totalGems} เม็ด แล้วหนีออกทางประตูภายใน ${state.stepsLeft} ก้าว`,
    'info',
  );
}

export function changeLevel(delta) {
  const next = Math.min(Math.max(level + delta, 1), LEVELS.length);
  if (next === level) return;
  newGame(next);
}

export function nextLevel() {
  if (state.status === 'won' && level < LEVELS.length) newGame(level + 1);
}

// ---------- การเคลื่อนที่ ----------
export function move(dirName) {
  if (!state || state.status !== 'playing') return;
  const [dr, dc] = DIRS[dirName];
  const target = { r: state.player.r + dr, c: state.player.c + dc };

  if (dirName !== 'wait' && !isWalkable(state, target.r, target.c)) {
    setStatus('ทางตัน! มีกำแพงหรือขอบถ้ำขวางอยู่ (ไม่เสียก้าว)', 'info');
    return;
  }

  state.player = target;
  state.stepsLeft -= 1;
  let message = dirName === 'wait' ? 'คุณยืนรอ 1 ตา' : '';
  let tone = 'info';

  // ชนมอนสเตอร์ตอนเดินเข้าไป
  if (monsterAt(state, state.player)) {
    hitPlayer();
  } else {
    const k = key(state.player.r, state.player.c);
    if (state.gems.has(k)) {
      state.gems.delete(k);
      const left = state.gems.size;
      message = left
        ? `เก็บอัญมณีได้! เหลืออีก ${left} เม็ด`
        : 'เก็บอัญมณีครบแล้ว! ประตูเปิดแล้ว รีบไปที่ 🚪';
      tone = 'good';
    }
    if (same(state.player, state.exit)) {
      if (state.gems.size === 0) {
        endGame('won');
        return;
      }
      message = `ประตูยังล็อกอยู่ ต้องเก็บอัญมณีอีก ${state.gems.size} เม็ด`;
    }
    moveMonsters();
    if (monsterAt(state, state.player)) hitPlayer();
  }

  if (state.status !== 'playing') return;

  if (state.stepsLeft <= 0) {
    endGame('lost', 'ก้าวเดินหมดแล้ว คุณติดอยู่ในถ้ำตลอดกาล...');
    return;
  }

  render(state);
  if (state.justHit) {
    state.justHit = false;
    setStatus(`โดนมอนสเตอร์โจมตี! เหลือหัวใจ ${state.hearts} ดวง ถูกส่งกลับจุดเริ่ม`, 'bad');
  } else if (message) {
    setStatus(message, tone);
  } else {
    const warn = state.stepsLeft <= 5 ? ` ⚠️ เหลือเพียง ${state.stepsLeft} ก้าว!` : '';
    setStatus(`ตำแหน่ง แถว ${state.player.r + 1} คอลัมน์ ${state.player.c + 1}${warn}`, warn ? 'bad' : 'info');
  }
}

function moveMonsters() {
  const { chase } = state.cfg;
  const options = [DIRS.up, DIRS.down, DIRS.left, DIRS.right];

  state.monsters.forEach((m, i) => {
    const others = state.monsters.filter((_, j) => j !== i);
    const candidates = options
      .map(([dr, dc]) => ({ r: m.r + dr, c: m.c + dc }))
      .filter((p) => isWalkable(state, p.r, p.c) && !same(p, state.exit) && !others.some((o) => same(o, p)));
    if (!candidates.length) return;

    let next;
    if (Math.random() < chase) {
      candidates.sort((a, b) => manhattan(a, state.player) - manhattan(b, state.player));
      next = candidates[0];
    } else {
      next = candidates[randInt(candidates.length)];
    }
    m.r = next.r;
    m.c = next.c;
  });
}

function hitPlayer() {
  state.hearts -= 1;
  shakeBoard();
  if (state.hearts <= 0) {
    endGame('lost', 'มอนสเตอร์จับคุณได้ หัวใจหมดแล้ว!');
    return;
  }
  state.player = { ...state.start };
  state.justHit = true;
  // ถ้ามีมอนสเตอร์อยู่ใกล้จุดเริ่ม ให้ย้ายไปช่องว่างที่ไกลออกไป
  state.monsters.forEach((m) => {
    if (manhattan(m, state.start) > 2) return;
    const spots = [];
    for (let r = 0; r < state.size; r++) {
      for (let c = 0; c < state.size; c++) {
        const p = { r, c };
        if (isWalkable(state, r, c) && manhattan(p, state.start) >= Math.ceil(state.size / 2) &&
            !same(p, state.exit) && !monsterAt(state, p)) spots.push(p);
      }
    }
    if (spots.length) Object.assign(m, spots[randInt(spots.length)]);
  });
}

function endGame(result, reason = '') {
  state.status = result;
  render(state);
  const won = result === 'won';
  showEndScreen({ won, level, hearts: state.hearts, stepsLeft: state.stepsLeft, reason });
  setStatus(won ? `ชนะ! ผ่าน Level ${level} แล้ว` : `แพ้แล้ว: ${reason}`, won ? 'good' : 'bad');
}
