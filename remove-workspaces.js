const { exec } = require("child_process");
const app = process.env["APP_WORKSPACE"];

exec("yarn workspaces info --json", (err, stdout, stderr) => {
  const output = JSON.parse(stdout);
  const info = JSON.parse(output.data);

  const dependencies = gatherDependencies(info, app);
  const unneeded = Object.keys(info)
    .filter(i => !dependencies.includes(i))
    // Notice we are referencing the "location" here, not the package name
    .map(key => info[key].location);

  console.log("\t", "----->", "Pruning unused workspaces:", unneeded);
  unneeded.forEach(i => exec(`rm -rf ${i}`));
});

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
