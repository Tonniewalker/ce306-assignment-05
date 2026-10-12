/* =========================================================
 * dom.js — อ้างอิง element ต่างๆ ในหน้า HTML ไว้ที่เดียว
 * ========================================================= */

const $ = (id) => document.getElementById(id);

export const el = {
  board: $('board'),
  boardWrap: $('boardWrap'),
  status: $('status'),
  result: $('result'),
  resultCard: $('resultCard'),
  resultHeading: $('result-heading'),
  resultText: $('result-text'),
  playAgainBtn: $('playAgainBtn'),
  nextLevelBtn: $('nextLevelBtn'),
  statHearts: $('statHearts'),
  statSteps: $('statSteps'),
  statGems: $('statGems'),
  stepsBar: $('stepsBar'),
  stepsBarFill: $('stepsBarFill'),
  form: $('settingsForm'),
  levelUp: $('levelUp'),
  levelDown: $('levelDown'),
  levelNumber: $('levelNumber'),
  levelName: $('levelName'),
  helpBtn: $('helpBtn'),
  helpDialog: $('helpDialog'),
  themeBtn: $('themeBtn'),
  themeIcon: $('themeIcon'),
  themeLabel: $('themeLabel'),
};
