module.exports = {
  default: {
    require: [
      'src/App/tests/features/step_definitions/**/*.ts'
    ],
    paths: [
      'src/App/tests/features/**/*.feature'
    ],
    requireModule: [
      'ts-node/register'
    ],
  }
};
