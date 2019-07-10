/* eslint-disable @typescript-eslint/no-var-requires */
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const spawn = require("child_process").spawn;
const shared = ["@codeponder/common"];

function gatherDependencies(info, workspace) {
  let deps = [workspace];
  let ws = [workspace];
  while (ws.length) {
    info[ws[0]].workspaceDependencies.forEach(w => {
      ws.push(w);
      deps.push(info[w].location.split("/")[1]);
    });
    ws.shift();
  }
  return deps;
}

async function deploy() {
  console.log(process.env["CIRCLE_COMPARE_URL"]);

  let { stdout: workspaces } = await exec("yarn workspaces info --json");
  let { stdout: changed } = await exec(
    'git log --format="" --name-only c6900a6af77295e2eac7f5879fc9cf2b572e6e22...ad384636f335edfb99d511263bd877113fbcc7d8 packages'
  );
  workspaces = JSON.parse(JSON.parse(workspaces).data);
  changed = new Set(
    changed
      .trim()
      .split(/\r?\n/)
      .map(path => path.split("/")[1])
  );

  const needsDeploy = [];

  for (const [k] of Object.entries(workspaces)) {
    if (shared.includes(k)) continue;
    const deps = gatherDependencies(workspaces, k);
    if (deps.some(dep => changed.has(dep))) {
      needsDeploy.push(k);
    }
  }

  console.log("\n", "----->", "Deploying workspaces:", needsDeploy.join(", "));

  for (const k of needsDeploy) {
    const deployment = spawn("yarn", ["run", `ci:deploy:${k}`]);
    deployment.stdout.on("data", data => {
      console.log(data.toString());
    });
    deployment.stderr.on("data", data => {
      console.log(data.toString());
    });
    deployment.on("error", error => {
      throw error;
    });
  }
}

deploy();
