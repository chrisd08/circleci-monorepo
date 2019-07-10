/* eslint-disable @typescript-eslint/no-var-requires */
const gatherDependencies = require("./gather-dependencies");
const { exec, spawn } = require("child_process");

const app = process.env["APP_WORKSPACE"];

exec("yarn workspaces info --json", (err, stdout) => {
  const output = JSON.parse(stdout);
  const info = JSON.parse(output.data);

  const dependencies = gatherDependencies(info, info[app]);

  console.log("\n", "----->", "Building workspaces:", app.split(","));

  dependencies.forEach(wp => {
    const build = spawn("yarn", ["build"], {
      cwd: __dirname + "/../" + wp.location,
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
