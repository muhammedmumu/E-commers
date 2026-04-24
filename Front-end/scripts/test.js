require("./setLocalTemp");

if (!process.argv.includes("--runInBand")) {
  process.argv.push("--runInBand");
}

require("react-scripts/scripts/test");
