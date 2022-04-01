const originalRequire = require;

const fs = originalRequire("fs");

function loadModule(filePath, module, require) {
  const wrapSourceCode = `(function (module, exports, require) {
    ${fs.readFileSync(filePath, "utf8")}
  }(module, module.exports, require))`;

  eval(wrapSourceCode);
}

require = function require(filePath) {
  const absoluteFilePath = require.resolve(filePath);

  if (require.cache[absoluteFilePath]) return require.cache[absoluteFilePath];

  const module = {
    id: absoluteFilePath,
    exports: {},
  };

  require.cache[absoluteFilePath] = module;

  loadModule(absoluteFilePath, module, require);

  return module.exports;
};

require.cache = {};
require.resolve = originalRequire.resolve;

const indexExports = require(process.argv[2]);

console.log(indexExports);
