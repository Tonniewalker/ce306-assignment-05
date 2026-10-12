/* =========================================================
 * map.js — สุ่มสร้างแผนที่ถ้ำ และฟังก์ชันตรวจสอบช่องบนแผนที่
 * ========================================================= */

import { DIRS } from './config.js';
import { key, same, manhattan, shuffle } from './utils.js';

const STEPS = [DIRS.up, DIRS.down, DIRS.left, DIRS.right];

// ---------- ตรวจสอบช่องบนแผนที่ ----------
export function isWalkable(state, r, c) {
  return r >= 0 && c >= 0 && r < state.size && c < state.size && !state.walls.has(key(r, c));
}

export function monsterAt(state, pos) {
  return state.monsters.some((m) => same(m, pos));
}

// ---------- ค้นหาเส้นทาง ----------
function bfsDistances(size, walls, from) {
  const dist = new Map([[key(from.r, from.c), 0]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift();
    const d = dist.get(key(cur.r, cur.c));
    for (const [dr, dc] of STEPS) {
      const r = cur.r + dr;
      const c = cur.c + dc;
      const k = key(r, c);
      if (r < 0 || c < 0 || r >= size || c >= size || walls.has(k) || dist.has(k)) continue;
      dist.set(k, d + 1);
      queue.push({ r, c });
    }
  }
  return dist;
}

// ประมาณจำนวนก้าวขั้นต่ำ: เดินไปอัญมณีที่ใกล้สุดทีละเม็ด แล้วไปประตู
function estimateRoute(size, walls, start, gems, exit) {
  let pos = start;
  let total = 0;
  const remaining = [...gems];
  while (remaining.length) {
    const dist = bfsDistances(size, walls, pos);
    remaining.sort((a, b) => dist.get(key(a.r, a.c)) - dist.get(key(b.r, b.c)));
    const next = remaining.shift();
    total += dist.get(key(next.r, next.c));
    pos = next;
  }
  total += bfsDistances(size, walls, pos).get(key(exit.r, exit.c));
  return total;
}

// ---------- สร้างแผนที่ ----------
export function generateMap(cfg) {
  const { size } = cfg;
  const start = { r: 0, c: 0 };
  const exit = { r: size - 1, c: size - 1 };
  const reserved = new Set([key(0, 0), key(0, 1), key(1, 0), key(exit.r, exit.c)]);

  for (let attempt = 0; attempt < 500; attempt++) {
    const cells = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!reserved.has(key(r, c))) cells.push({ r, c });
      }
    }
    shuffle(cells);

    const walls = new Set(cells.splice(0, cfg.walls).map((p) => key(p.r, p.c)));
    const gems = cells.splice(0, cfg.gems);
    const dist = bfsDistances(size, walls, start);
    const reachable = [...gems, exit].every((p) => dist.has(key(p.r, p.c)));
    if (!reachable) continue;

    // มอนสเตอร์ต้องอยู่ห่างจากจุดเริ่ม และอยู่ในพื้นที่ที่เดินถึงได้
    const monsterSpots = cells.filter(
      (p) => manhattan(p, start) >= Math.ceil(size / 2) && dist.has(key(p.r, p.c)),
    );
    if (monsterSpots.length < cfg.monsters) continue;
    const monsters = monsterSpots.slice(0, cfg.monsters).map((p) => ({ ...p }));

    const route = estimateRoute(size, walls, start, gems, exit);
    const steps = Math.ceil(route * cfg.slack) + 6;
    return { size, start, exit, walls, gems: new Set(gems.map((p) => key(p.r, p.c))), monsters, steps };
  }
  throw new Error('สร้างแผนที่ไม่สำเร็จ');
}
