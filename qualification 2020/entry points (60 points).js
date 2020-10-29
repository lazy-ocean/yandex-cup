/* entry points (60 points)
You have a documentation of spaceship's life support system. There're life support modules and their dependencies: if the modules will be launched in the wrong order, the spaceship will be destroyed.
Write a function that returns the list of modules that could be launched first.
*/
/// INPUT DOCUMENTATION
let full = {
  absoluteRepoPath: "/var/www/projects/project1",
  aliases: {
    "@": "/var/www/projects/project1/src",
  },
  modules: [
    {
      file: "./src/pages/a.js",
      deps: ["/var/www/projects/project1/src/pages/b.js", "./b.js"],
    },
    {
      file: "./src/pages/b.js",
      deps: ["@/pages/с.js"],
    },
    {
      file: "./src/pages/c.js",
      deps: ["./src/pages/c.js"],
    },
    {
      file: "./src/pages/d.js",
      deps: [],
    },
  ],
};

/// OUTPUT PARAMETERS
/* Output should look like lexicographically sorted array of modules with absolute paths:
[  
    "/var/www/projects/project1/src/pages/c.js",  
    "/var/www/projects/project1/src/pages/d.js"  
]
If there're several start modules for one node, choose one in lexicographical order.
*/

// Relative to absolute path
function absolute(base, relative) {
  var stack = base.split("/"),
    parts = relative.split("/");
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] == ".") continue;
    if (parts[i] == "..") stack.pop();
    else stack.push(parts[i]);
  }
  return stack.join("/");
}

// Adapting paths
const adaptPath = (path) => {
  let newPath;
  let aliases = Object.keys(full.aliases);
  aliases.map((alias) => (newPath = path.replace(alias, full.aliases[alias])));
  if (newPath.startsWith(".")) {
    return absolute(full.absoluteRepoPath, newPath);
  } else if (newPath.startsWith("/")) {
    return newPath;
  }
};

// Adapting tree
const adaptTree = (tree) => {
  let modules = tree.modules;
  let result = {};
  modules.map((module) => {
    let { file, deps } = module;
    let name = adaptPath(file);
    let pathDs = deps.map((d) => adaptPath(d));
    result[name] = pathDs;
  });
  return result;
};

// Finding and sorting dependencies
const sortDeps = (startTree) => {
  const tree = adaptTree(startTree);
  let res = [];
  let list = [];
  let visited = {};

  const dfs = (node) => {
    if (visited[node]) return;
    if (!tree[node]) return;
    visited[node] = true;

    let deps = tree[node];
    if (deps.length) {
      deps.map((dep) => dfs(dep));
    } else {
      list.push(node);
    }
  };

  Object.keys(tree).forEach((node) => {
    if (!visited[node]) {
      dfs(node);
      if (list.length) res.push(list.sort((a, b) => a.localeCompare(b))[0]);
      list = [];
    }
  });
  return res.sort((a, b) => a.localeCompare(b));
};
