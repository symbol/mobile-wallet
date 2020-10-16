// eslint-disable-next-line import/no-extraneous-dependencies
const NodeEnvironment = require('jest-environment-node');

module.exports = class extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.global = global;
    // Make process.exit immutable to prevent Jest adding logging output to it
    const realExit = global.process.exit;
    Object.defineProperty(global.process, 'exit', {
      get() {
        return realExit;
      },
      set() {},
    });
  }

  // eslint-disable-next-line class-methods-use-this
  runScript(script) {
    return script.runInThisContext();
  }
};
