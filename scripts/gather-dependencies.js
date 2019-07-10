// Gather all of the workspaces that `workspace` depends on
exports.gatherDependencies = (info, workspace) => {
  let deps = [workspace];
  let ws = [workspace];
  while (ws.length) {
    console.log(info, ws);
    info[ws[0]].workspaceDependencies.forEach(w => {
      ws.push(w);
      deps.push(w);
    });
    ws.shift();
  }
  return deps;
};
