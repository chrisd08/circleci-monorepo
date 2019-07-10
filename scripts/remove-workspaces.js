/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require("child_process");
const { existsSync, rename } = require("fs");

const app = process.env["APP_WORKSPACE"];

exec("yarn workspaces info --json", (_err, stdout) => {
  const info = JSON.parse(JSON.parse(stdout).data);
  const getDependencies = (workspace, deps = []) => {
    deps.push(workspace);
    info[workspace].workspaceDependencies.forEach(dep => getDependencies(dep, deps));
    return deps;
  };
  const dependencies = getDependencies(app);
  const unneeded = Object.keys(info)
    .filter(i => !dependencies.includes(i))
    .map(key => info[key].location);

  console.log("\t", "----->", "Pruning unused workspaces:", unneeded);
  unneeded.forEach(i => exec(`rm -rf ${i}`));

  const procfilePath = `${__dirname}/../${info[app].location}/Procfile`;
  if (existsSync(procfilePath)) {
    rename(procfilePath, `${__dirname}/../Procfile`, () => {
      console.log("\t", "----->", "Moved Procfile to root");
    });
  }
});
