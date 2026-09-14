const gameKey = "SM64: Spicy Mycena 64";
const parts = [
  "mario_hat_color",
  "mario_shirt_color",
  "mario_overalls_color",
  "mario_gloves_color",
  "mario_shoes_color",
  "mario_skin_color",
  "mario_hair_color",
];
const partLabels = ["Hat", "Shirt", "Overalls", "Gloves", "Shoes", "Skin", "Hair"];
const choices = [
  "random", "black", "white", "gray", "red", "green", "blue", "yellow",
  "cyan", "magenta", "purple", "orange", "pink", "brown", "__custom__",
];
const presets = {
  mario: ["red", "red", "blue", "white", "default_brown", "default_skin", "default_brown"],
  luigi: ["green", "green", "blue", "white", "default_brown", "default_skin", "default_brown"],
  fire_mario: ["white", "white", "red", "white", "default_brown", "default_skin", "default_brown"],
  fire_luigi: ["white", "white", "green", "white", "default_brown", "default_skin", "default_brown"],
  nes_mario: [11796480, 7366656, 11796480, 16752963, 7366656, 16752963, 7366656],
  nes_luigi: ["white", 104961, "white", 16752963, 104961, 16752963, 104961],
  nes_firebro: ["white", 11796480, "white", 16752963, 11796480, 16752963, 11796480],
  wario: [16776960, 16776960, 10289407, "white", 32768, "default_skin", "default_brown"],
  waluigi: [4194432, 4194432, 64, "white", 12615680, "default_skin", "default_brown"],
  smash_pastel: [6340808, 14688406, 6340808, "white", 6243639, "default_skin", "default_brown"],
  smash_dark: [5255264, 11842740, 5255264, "white", 3683666, "default_skin", "default_brown"],
  smash_green: [3043088, 3043088, 7953460, "white", 4340293, "default_skin", "default_brown"],
  mario_maker: [16304134, 16304134, "red", "white", "default_brown", "default_skin", "default_brown"],
  pink: [16711807, 16711807, "white", "white", "default_brown", "default_skin", "default_brown"],
  peach_pink: [15712004, 12528201, 15300495, "white", 6565155, 16694959, 16775256],
  blue: ["blue", "blue", "white", "white", "default_brown", "default_skin", "default_brown"],
  cyan: ["cyan", "cyan", "white", "white", "default_brown", "default_skin", "default_brown"],
  black_and_white: ["white", "white", "black", "white", "default_brown", "default_skin", "default_brown"],
  shadow: ["black", "black", 1052688, 1052688, "black", 2105376, 4737096],
  negative: [65535, 65535, 16776960, "black", 9298929, 81542, 9239039],
  gameboy: [3224862, 3224862, 6583124, 9280124, 3224862, 9280124, 3224862],
  dk_mario: ["red", "blue", "red", 16695673, "blue", "default_skin", "blue"],
  mario_bros_mario: ["blue", "red", "blue", 16695673, 16745728, "default_skin", "default_brown"],
  mario_bros_luigi: ["green", 8586752, "green", 16695673, "blue", "default_skin", "default_brown"],
  smb3_mario: [11796480, 11796480, "black", 16695673, 11796480, "default_skin", "black"],
  smb3_luigi: [104961, 104961, "black", 16695673, 104961, "default_skin", "black"],
  smash_luigi_orange: [16745728, 16745728, 2534109, "white", 7032872, "default_skin", "default_brown"],
  smash_luigi_pink: [16748699, 16748699, 11542544, "white", "default_brown", "default_skin", "default_brown"],
  smash_luigi_cyan: [8388863, "cyan", 8388863, "white", 6243639, "default_skin", "default_brown"],
  smash_luigi_blue: [3359880, 7859744, 33023, "white", 6243639, "default_skin", "default_brown"],
  smash_luigi_yellow: [24608, 9476656, 24608, "white", 6243639, "default_skin", "default_brown"],
};
let selectedPreset = "mario";
let customPalette = [...presets.mario];
const elements = {
  palettePreset: document.querySelector("#palettePreset"),
  paletteGrid: document.querySelector("#paletteGrid"),
  rawYaml: document.querySelector("#rawYaml"),
  status: document.querySelector("#status"),
  sprite: document.querySelector("#sprite"),
  themeToggle: document.querySelector("#themeToggle"),
};
const pretty = (key) => key.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
const colorNumbers = {
  black: 0, white: 16777215, gray: 8421504, red: 16711680, green: 65280,
  blue: 255, yellow: 16776960, cyan: 65535, magenta: 16711935,
  purple: 16711935, orange: 16753920, pink: 16761035, brown: 10824234,
  default_brown: 7478286, default_skin: 16695673,
};
const hex = (value, part) => {
  const number =
    value === "default_brown" && part === "mario_hair_color"
      ? 7538176
      : typeof value === "number"
        ? value
        : /^\d+$/.test(String(value))
          ? Number(value)
          : colorNumbers[value];
  return number === undefined ? "#888888" : "#" + number.toString(16).padStart(6, "0");
};
const yamlKey = (value) => (/^\d|^(off|true|false)$/.test(value) ? "'" + value + "'" : value);
const yamlValue = (value) => (typeof value === "number" ? value : yamlKey(value));
function activePalette() { return selectedPreset === "custom" ? customPalette : presets[selectedPreset]; }
function paletteLabel(value) { return value === "__custom__" ? "Exact custom color" : pretty(String(value)); }
function paletteChoices(part) {
  if (part === "mario_shoes_color") return ["default_brown", ...choices];
  if (part === "mario_skin_color") return ["default_skin", ...choices];
  if (part === "mario_hair_color") return ["default_brown", ...choices];
  return choices;
}
function paletteLabelForPart(value, part) {
  if (value === "default_brown" && part === "mario_shoes_color") return "Default Shoes";
  if (value === "default_brown" && part === "mario_hair_color") return "Default Hair";
  if (value === "default_skin" && part === "mario_skin_color") return "Default Skin";
  return paletteLabel(value);
}
function renderPreset() {
  elements.palettePreset.innerHTML =
    '<option value="custom">Custom</option>' +
    Object.keys(presets).map((name) => `<option value="${name}">${pretty(name)}</option>`).join("");
  elements.palettePreset.value = selectedPreset;
}
function renderPalette() {
  const palette = activePalette();
  elements.paletteGrid.innerHTML = parts.map((part, index) => {
    const value = String(palette[index]);
    const selected = /^\d+$/.test(value) ? "__custom__" : value;
    const options = paletteChoices(part)
      .map((choice) => `<option value="${choice}" ${choice === selected ? "selected" : ""}>${paletteLabelForPart(choice, part)}</option>`)
      .join("");
    const control = selectedPreset === "custom"
      ? `<select data-part="${index}">${options}</select><input class="custom-picker ${selected === "__custom__" ? "visible" : ""}" type="color" value="${hex(value, part)}" data-picker="${index}" title="Choose ${partLabels[index]} color">`
      : `<span class="color-preview" style="background:${hex(value, part)}"></span>`;
    return `<div class="palette-row"><label>${partLabels[index]}</label>${control}</div>`;
  }).join("");
  drawSprite(palette);
}
function drawSprite(palette) {
  const canvas = elements.sprite;
  const context = canvas.getContext("2d");
  const scale = 10;
  canvas.width = 224;
  canvas.height = 224;
  context.clearRect(0, 0, 224, 224);
  const colors = {
    hat: hex(palette[0], "mario_hat_color"), shirt: hex(palette[1], "mario_shirt_color"),
    overalls: hex(palette[2], "mario_overalls_color"), gloves: hex(palette[3], "mario_gloves_color"),
    shoes: hex(palette[4], "mario_shoes_color"), skin: hex(palette[5], "mario_skin_color"),
    hair: hex(palette[6], "mario_hair_color"),
  };
  const pixel = (x, y, color) => { context.fillStyle = color; context.fillRect((x + 3) * scale, (y + 3) * scale, scale, scale); };
  const sprite = [
    ".....HHHHH......", "....HHHHHHHHH...", "....RRRKKEK.....", "...RKRKKKEKKK...",
    "...RKRRKKKEKKK..", "....RKKKKEEEE...", ".....KKKKKK.....", "....OOSOOSOO....",
    "...OOOSOOSOOO...", "..OOOOSOOSOOOO..", "..GGOOSSSSOOGG..", "..GGGSYSSYSGGG..",
    "..GGSSSSSSSSGG..", "....SSS..SSS....", "...BBB....BBB...", "..BBBB....BBBB..",
  ];
  const map = { H: colors.hat, S: colors.overalls, O: colors.shirt, K: colors.skin, R: colors.hair, G: colors.gloves, B: colors.shoes, Y: hex("yellow"), E: "#172322" };
  sprite.forEach((row, y) => [...row].forEach((token, x) => { if (token !== "." && token !== " ") pixel(x, y, map[token]); }));
  context.imageSmoothingEnabled = false;
}
function outputYaml() {
  const palette = activePalette();
  const music = document.querySelector('input[name="music"]:checked').value;
  const skybox = document.querySelector('input[name="skybox"]:checked').value;
  const settings = parts
    .map((part, index) => `  ${part}: ${yamlValue(palette[index])}`)
    .concat([`  music_shuffle: ${music}`, `  skybox_shuffle: ${skybox}`]);
  return `####################\n# Cosmetic Options #\n####################\n${settings.join("\n")}\n`;
}
function update() {
  elements.rawYaml.value = outputYaml();
  elements.status.textContent = "Updated";
}
elements.palettePreset.onchange = (event) => {
  const previousPalette = activePalette();
  selectedPreset = event.target.value;
  if (selectedPreset === "custom") customPalette = [...previousPalette];
  renderPalette();
  update();
};
elements.paletteGrid.addEventListener("change", (event) => {
  const input = event.target.closest("[data-part]");
  if (!input) return;
  if (selectedPreset !== "custom") {
    const previousPalette = [...activePalette()];
    selectedPreset = "custom";
    customPalette = previousPalette;
    renderPreset();
  }
  customPalette[Number(input.dataset.part)] = input.value === "__custom__" ? 0 : input.value;
  renderPalette();
  update();
});
elements.paletteGrid.addEventListener("input", (event) => {
  const input = event.target.closest("[data-picker]");
  if (!input) return;
  customPalette[Number(input.dataset.picker)] = parseInt(input.value.slice(1), 16);
  selectedPreset = "custom";
  renderPreset();
  drawSprite(customPalette);
  update();
});
document.querySelectorAll("input[type=radio]").forEach((input) => (input.onchange = update));
document.querySelector("#copyYaml").onclick = async () => {
  try {
    await navigator.clipboard.writeText(elements.rawYaml.value);
    elements.status.textContent = "Copied YAML";
  } catch {
    elements.status.textContent = "Copy unavailable";
  }
};
let storedTheme = null;
try { storedTheme = localStorage.getItem("yaml-editor-theme"); } catch { storedTheme = null; }
if (storedTheme !== "light") document.body.classList.add("dark");
elements.themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  try { localStorage.setItem("yaml-editor-theme", document.body.classList.contains("dark") ? "dark" : "light"); } catch {}
  elements.themeToggle.textContent = document.body.classList.contains("dark") ? "Use light mode" : "Use dark mode";
};
elements.themeToggle.textContent = document.body.classList.contains("dark") ? "Use light mode" : "Use dark mode";
renderPreset();
renderPalette();
update();
