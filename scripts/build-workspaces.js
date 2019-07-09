const { exec, spawn } = require('child_process');
const app = process.env['APP_WORKSPACE'];

exec('yarn workspaces info --json', (err, stdout, stderr) => {
  const output = JSON.parse(stdout);
  const info = JSON.parse(output.data);

  const dependencies = gatherDependencies(info, info[app]);

  console.log('\n', '----->', 'Building workspaces:', app.split(','));

  dependencies.forEach(wp => {
    const build = spawn('yarn', ['build'], {
      cwd: __dirname + '/../' + wp.location,
    });
    build.stdout.on('data', data => {
      console.log(data.toString());
    });
    build.stderr.on('data', data => {
      console.log(data.toString());
    });
    build.on('error', error => {
      throw error;
    });
  });
});

// Gather all of the workspaces that `workspace` depends on
function gatherDependencies(info, workspace) {
  let deps = [workspace];
  let ws = [workspace];
  while (ws.length) {
    ws[0].workspaceDependencies.forEach(w => {
      ws.push(info[w]);
      deps.push(info[w]);
    });
    ws.shift();
  }
  return deps;
}