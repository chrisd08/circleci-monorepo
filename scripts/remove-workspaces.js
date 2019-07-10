/* eslint-disable @typescript-eslint/no-var-requires */
const gatherDependencies = require("./gather-dependencies");
const { exec } = require("child_process");
const { existsSync, rename } = require("fs");
const app = process.env["APP_WORKSPACE"];

exec("yarn workspaces info --json", (err, stdout) => {
  const output = JSON.parse(stdout);
  const info = JSON.parse(output.data);

  const dependencies = gatherDependencies(info, app);
  const unneeded = Object.keys(info)
    .filter(i => !dependencies.includes(i))
    // Notice we are referencing the "location" here, not the package name
    .map(key => info[key].location);

  console.log("\t", "----->", "Pruning unused workspaces:", unneeded);
  unneeded.forEach(i => exec(`rm -rf ${i}`));

  const procfilePath = `${__dirname}/../packages/${app}/Procfile`;
  if (existsSync(procfilePath)) {
    rename(procfilePath, `${__dirname}/../Procfile`, () => {
      console.log("\t", "----->", "Moved Procfile to root");
    });
  }
});
