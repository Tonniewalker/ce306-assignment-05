/* =========================================================
 * ui.js — ธีมมืด/สว่าง, หน้าต่างวิธีเล่น, ปุ่มและคีย์บอร์ด
 * ========================================================= */

import { el } from './dom.js';
import { newGame, move, changeLevel, nextLevel } from './game.js';

// ---------- ธีม ----------
export function syncThemeButton() {
  const dark = document.documentElement.classList.contains('dark');
  el.themeBtn.setAttribute('aria-pressed', String(dark));
  el.themeIcon.textContent = dark ? '☀️' : '🌙';
  el.themeLabel.textContent = dark ? 'โหมดสว่าง' : 'โหมดมืด';
}

function toggleTheme() {
  const dark = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('cave-theme', dark ? 'dark' : 'light'); } catch (e) { /* ข้าม */ }
  syncThemeButton();
}

// ---------- วิธีเล่น ----------
export function openHelp() {
  if (!el.helpDialog.open) el.helpDialog.showModal();
}

// เปิดวิธีเล่นอัตโนมัติในการเข้าเล่นครั้งแรก
export function openHelpOnFirstVisit() {
  try {
    if (!localStorage.getItem('cave-seen-help')) {
      localStorage.setItem('cave-seen-help', '1');
      openHelp();
    }
  } catch (e) { /* ข้าม */ }
}

// ---------- คีย์บอร์ด ----------
const KEY_TO_DIR = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
  ' ': 'wait', '.': 'wait',
};

const KEY_ACTIONS = {
  r: () => newGame(),
  enter: () => nextLevel(),
  '+': () => changeLevel(1),
  '=': () => changeLevel(1),
  '-': () => changeLevel(-1),
  _: () => changeLevel(-1),
  h: () => openHelp(),
  '?': () => openHelp(),
};

function onKeyDown(e) {
  if (el.helpDialog.open || e.ctrlKey || e.metaKey || e.altKey) return;

  const dir = KEY_TO_DIR[e.key];
  if (dir) {
    // Space บนปุ่มให้ทำงานตามปกติของปุ่ม
    if (e.key === ' ' && e.target instanceof HTMLButtonElement) return;
    e.preventDefault();
    move(dir);
    return;
  }

  const action = KEY_ACTIONS[e.key.toLowerCase()];
  if (action) {
    e.preventDefault();
    action();
  }
}

// ---------- ผูก event ทั้งหมด ----------
export function bindControls() {
  document.addEventListener('keydown', onKeyDown);

  document.querySelectorAll('[data-dir]').forEach((btn) => {
    btn.addEventListener('click', () => move(btn.dataset.dir));
  });

  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    newGame();
  });
  el.levelUp.addEventListener('click', () => changeLevel(1));
  el.levelDown.addEventListener('click', () => changeLevel(-1));
  el.playAgainBtn.addEventListener('click', () => newGame());
  el.nextLevelBtn.addEventListener('click', nextLevel);
  el.helpBtn.addEventListener('click', openHelp);
  el.helpDialog.addEventListener('close', () => el.helpBtn.focus());
  el.themeBtn.addEventListener('click', toggleTheme);
}
