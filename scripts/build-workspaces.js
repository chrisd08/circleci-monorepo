/* eslint-disable @typescript-eslint/no-var-requires */
const { exec, spawn } = require("child_process");

const app = process.env["APP_WORKSPACE"];

exec("yarn workspaces info --json", (_err, stdout) => {
  const info = JSON.parse(JSON.parse(stdout).data);
  const getDependencies = (workspace, deps = []) => {
    deps.push(workspace);
    workspace.workspaceDependencies.forEach(dep => getDependencies(info[dep], deps));
    return deps;
  };
  const dependencies = getDependencies(info[app]);
  console.log("\n", "----->", "Building workspaces");
  dependencies.forEach(dep => {
    console.log("\n", "----->", `Building ${dep.location}`);
    const build = spawn("yarn", ["build"], {
      cwd: __dirname + "/../" + dep.location,
    });
    build.stdout.on("data", data => {
      console.log(data.toString());
    });
    build.stderr.on("data", data => {
      console.log(data.toString());
    });
    build.on("error", error => {
      throw error;
    });
  });
});
