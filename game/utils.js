/* =========================================================
 * utils.js — ฟังก์ชันช่วยทั่วไป (พิกัด และการสุ่ม)
 * ========================================================= */

export const key = (r, c) => `${r},${c}`;
export const same = (a, b) => a.r === b.r && a.c === b.c;
export const manhattan = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
export const randInt = (n) => Math.floor(Math.random() * n);

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
