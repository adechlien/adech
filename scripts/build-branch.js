const fs = require("fs");
const path = require("path");

const branchName = process.argv[2];

if (!branchName) {
  console.error("Usage: node scripts/build-branch.js <branch-name>");
  process.exit(1);
}

const rootDir = path.join(__dirname, "..");
const srcDir = path.join(rootDir, "src", "branches", branchName);
const distDir = path.join(rootDir, "dist", branchName);
const tokensPath = path.join(srcDir, "tokens.json");

if (!fs.existsSync(tokensPath)) {
  console.error(`No tokens.json found for branch "${branchName}" at: ${tokensPath}`);
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));
const prefix = tokens.prefix || "adech";
const subbranches = tokens.subbranches || {};

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function validateHex(hex, tokenPath) {
  const isValid = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex);
  if (!isValid) {
    throw new Error(`Invalid HEX color at ${tokenPath}: ${hex}`);
  }
}

function getEntries() {
  const entries = [];

  for (const [familyName, scale] of Object.entries(subbranches)) {
    if (typeof scale !== "object" || scale === null || Array.isArray(scale)) {
      throw new Error(`Family "${familyName}" must be an object of steps -> hex values.`);
    }

    for (const [step, hex] of Object.entries(scale)) {
      validateHex(hex, `${branchName}.subbranches.${familyName}.${step}`);

      entries.push({
        familyName,
        step,
        tokenName: `${prefix}-${familyName}-${step}`,
        cssVar: `--${prefix}-${familyName}-${step}`,
        twVar: `--color-${prefix}-${familyName}-${step}`,
        hex,
      });
    }
  }

  return entries;
}

function buildJson(tokensObject) {
  return `${JSON.stringify(tokensObject, null, 2)}\n`;
}

function buildCss(entries) {
  const lines = entries.map((entry) => `  ${entry.cssVar}: ${entry.hex};`);
  return `:root {\n${lines.join("\n")}\n}\n`;
}

function buildTailwindV4(entries) {
  const lines = entries.map((entry) => `  ${entry.twVar}: ${entry.hex};`);
  return `@theme {\n${lines.join("\n")}\n}\n`;
}

function buildTailwindV3(entries) {
  const lines = entries.map(
    (entry) => `        "${entry.tokenName}": "${entry.hex}"`
  );

  return `module.exports = {
  theme: {
    extend: {
      colors: {
${lines.join(",\n")}
      }
    }
  }
};
`;
}

function buildIndex(outputName) {
  return `const tokens = require("./${outputName}.json");

module.exports = {
  name: "${outputName}",
  tokens,
  files: {
    json: "./${outputName}.json",
    css: "./${outputName}.css",
    tailwindV4: "./${outputName}.tailwind.css",
    tailwindV3: "./${outputName}.preset.cjs"
  }
};
`;
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Generated: ${path.relative(rootDir, filePath)}`);
}

try {
  ensureDir(distDir);

  const entries = getEntries();

  writeFile(path.join(distDir, `${branchName}.json`), buildJson(tokens));
  writeFile(path.join(distDir, `${branchName}.css`), buildCss(entries));
  writeFile(
    path.join(distDir, `${branchName}.tailwind.css`),
    buildTailwindV4(entries)
  );
  writeFile(
    path.join(distDir, `${branchName}.preset.cjs`),
    buildTailwindV3(entries)
  );
  writeFile(path.join(distDir, "index.js"), buildIndex(branchName));

  console.log(`\nBranch "${branchName}" built successfully.`);
} catch (error) {
  console.error(`Build failed for "${branchName}": ${error.message}`);
  process.exit(1);
}
