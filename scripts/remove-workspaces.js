/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require("child_process");
const { existsSync, rename } = require("fs");
const app = process.env["APP_WORKSPACE"];

// Gather all of the workspaces that `workspace` depends on
function gatherDependencies(info, workspace) {
  let deps = [workspace];
  let ws = [workspace];
  while (ws.length) {
    info[ws[0]].workspaceDependencies.forEach(w => {
      ws.push(w);
      deps.push(w);
    });
    ws.shift();
  }
  return deps;
}

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
