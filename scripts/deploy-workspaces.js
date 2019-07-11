/* eslint-disable @typescript-eslint/no-var-requires */
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const spawn = require("child_process").spawn;
const { readFileSync } = require("fs");

async function deploy() {
  const range = process.env["CIRCLE_COMPARE_URL"].split("/").pop();
  const { stdout: yarnOutput } = await exec("yarn workspaces info --json");
  const { stdout: gitOutput } = await exec(`git log --format="" --name-only ${range} packages`);
  const workspaces = JSON.parse(JSON.parse(yarnOutput).data);
  const changed = gitOutput
    .trim()
    .split(/\r?\n/)
    .filter((item, index, self) => self.indexOf(item) === index)
    .map(path => path.split("/")[1]);

  const hasChanged = workspace => {
    if (changed.includes(workspace.split("/").pop())) return true;
    return workspaces[workspace].workspaceDependencies.some(dep => hasChanged(dep));
  };

  const canDeploy = workspace => {
    const package = JSON.parse(readFileSync(`${workspaces[workspace].location}/package.json`));
    return package.scripts && package.scripts["ci:deploy"];
  };

  const needsDeploy = Object.keys(workspaces).filter(ws => hasChanged(ws) && canDeploy(ws));

  if (needsDeploy.length) {
    console.log("\n", "----->", "Deploying workspaces:", needsDeploy.join(", "));
    for (const package of needsDeploy) {
      const workspace = package.split("/").pop();
      const deployment = spawn("yarn", ["run", `ci:deploy:${workspace}`]);
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
}

deploy();
