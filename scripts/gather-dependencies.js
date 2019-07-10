// Gather all of the workspaces that `workspace` depends on
export default function gatherDependencies(info, workspace) {
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
