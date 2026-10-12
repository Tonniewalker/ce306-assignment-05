/* =========================================================
 * render.js — วาดกระดาน แถบสถานะ และหน้าจอผลลัพธ์
 * ทุกฟังก์ชันรับ state เข้ามา ไม่แก้ไข state เอง
 * ========================================================= */

import {
  LEVELS, MAX_HEARTS, BOARD_BASE, GRID_COLS, CELL_BASE, CELL_TEXT, CELL_STYLE, CELL_ICON,
  STATUS_STYLE, RESULT_STYLE, STEPS_BAR_STYLE,
} from './config.js';
import { key, same } from './utils.js';
import { monsterAt } from './map.js';
import { el } from './dom.js';

function cellType(state, r, c) {
  const pos = { r, c };
  if (same(pos, state.player)) return 'player';
  if (monsterAt(state, pos)) return 'monster';
  if (state.walls.has(key(r, c))) return 'wall';
  if (state.gems.has(key(r, c))) return 'gem';
  if (same(pos, state.exit)) return state.gems.size === 0 ? 'exitOpen' : 'exitLocked';
  if (same(pos, state.start)) return 'start';
  return 'floor';
}

function renderBoard(state) {
  const { size } = state;
  el.board.className = `${BOARD_BASE} ${GRID_COLS[size]}`;

  const frag = document.createDocumentFragment();
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const caught = state.status === 'lost' && same({ r, c }, state.player);
      const type = caught ? 'monster' : cellType(state, r, c);
      const cell = document.createElement('div');
      cell.className = `${CELL_BASE} ${CELL_TEXT[size]} ${CELL_STYLE[type]}`;
      cell.textContent = caught ? '💀' : CELL_ICON[type];
      cell.setAttribute('aria-hidden', 'true');
      frag.appendChild(cell);
    }
  }
  el.board.replaceChildren(frag);

  const collected = state.totalGems - state.gems.size;
  el.board.setAttribute(
    'aria-label',
    `แผนที่ถ้ำ ${size} คูณ ${size} ช่อง ผู้เล่นอยู่แถว ${state.player.r + 1} คอลัมน์ ${state.player.c + 1}, ` +
      `ประตูอยู่มุมขวาล่าง, เก็บอัญมณีแล้ว ${collected} จาก ${state.totalGems} เม็ด, มอนสเตอร์ ${state.monsters.length} ตัว`,
  );
}

function renderStats(state) {
  const hearts = Math.max(state.hearts, 0);
  const heartIcons = document.createElement('span');
  heartIcons.setAttribute('aria-hidden', 'true');
  heartIcons.textContent = '❤️'.repeat(hearts) + '🖤'.repeat(MAX_HEARTS - hearts);
  const heartText = document.createElement('span');
  heartText.className = 'sr-only';
  heartText.textContent = `${hearts} จาก ${MAX_HEARTS} ดวง`;
  el.statHearts.replaceChildren(heartIcons, heartText);

  const stepsLeft = Math.max(state.stepsLeft, 0);
  el.statSteps.textContent = stepsLeft;
  el.statGems.textContent = `${state.totalGems - state.gems.size}/${state.totalGems}`;

  el.stepsBar.setAttribute('aria-valuemax', state.steps);
  el.stepsBar.setAttribute('aria-valuenow', stepsLeft);
  const pct = stepsLeft / state.steps;
  el.stepsBarFill.style.width = `${pct * 100}%`;
  el.stepsBarFill.className = pct > 0.5 ? STEPS_BAR_STYLE.high : pct > 0.2 ? STEPS_BAR_STYLE.mid : STEPS_BAR_STYLE.low;
}

export function render(state) {
  renderBoard(state);
  renderStats(state);
}

export function setStatus(text, tone = 'info') {
  el.status.className = STATUS_STYLE[tone];
  el.status.textContent = text;
}

export function renderLevelControls(level) {
  el.levelNumber.textContent = level;
  el.levelName.textContent = LEVELS[level - 1].name;
  el.levelDown.disabled = level <= 1;
  el.levelUp.disabled = level >= LEVELS.length;
}

export function showResult(show) {
  el.result.classList.toggle('hidden', !show);
  el.result.classList.toggle('flex', show);
  if (!show && el.result.contains(document.activeElement)) el.board.focus();
}

export function showEndScreen({ won, level, hearts, stepsLeft, reason }) {
  const isLast = level >= LEVELS.length;
  el.resultCard.className = won ? RESULT_STYLE.won : RESULT_STYLE.lost;
  el.resultHeading.textContent = won ? '🏆 คุณชนะ! หนีออกจากถ้ำได้สำเร็จ' : '💀 เกมจบ — คุณแพ้';
  el.resultText.textContent = won
    ? `ผ่าน Level ${level} โดยเหลือหัวใจ ${hearts} ดวง และเหลือ ${stepsLeft} ก้าว` +
      (isLast ? ' — คุณพิชิต Level สูงสุดแล้ว สุดยอด!' : '')
    : `${reason} ลองใหม่อีกครั้งนะ`;
  el.nextLevelBtn.hidden = !won || isLast;
  showResult(true);
  el.resultCard.focus();
}

export function shakeBoard() {
  el.boardWrap.classList.remove('shake');
  void el.boardWrap.offsetWidth; // รีสตาร์ทแอนิเมชัน
  el.boardWrap.classList.add('shake');
}
