/* =========================================================
 * ล่าสมบัติในถ้ำ (Cave Treasure) — จุดเริ่มต้นของเกม
 *
 * โครงสร้างไฟล์:
 *   config.js  ค่าตั้งต้น Level และชื่อคลาส Tailwind
 *   utils.js   ฟังก์ชันช่วยทั่วไป
 *   map.js     สุ่มแผนที่ + ตรวจสอบช่อง
 *   dom.js     อ้างอิง element ในหน้า
 *   render.js  วาดกระดานและสถานะ
 *   game.js    ตรรกะเกม
 *   ui.js      ธีม วิธีเล่น ปุ่ม/คีย์บอร์ด
 * ========================================================= */

import { newGame } from './game.js';
import { bindControls, syncThemeButton, openHelpOnFirstVisit } from './ui.js';

bindControls();
syncThemeButton();
newGame(1);
openHelpOnFirstVisit();
