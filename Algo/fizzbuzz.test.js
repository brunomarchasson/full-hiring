const test = require( "node:test");
const assert = require( "node:assert");
const { fizzBuzzLoop } = require("./lib/dummyLoop");
const { fizzBuzzFunctional } = require("./lib/functional");
const { fizzBuzzGeneratorStream, fizzBuzzGeneratorStreamPipe, fizzBuzzGenerator } = require("./lib/generator");
const { fizzBuzzRecursive } = require("./lib/reucursive");
const { fizzBuzzStreamAsync, fizzBuzzStream } = require("./lib/stream");
const { fizzBuzzTrampoline } = require("./lib/trampoline");

function captureConsole(fn) {
  return async function (...args) {
    let buff = "";
    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    
    process.stdout.write = (chunk, ...rest) => {
      const text = chunk instanceof Buffer ? "" : chunk
      var justText = String(text).replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
      buff+= justText
      originalStdoutWrite(chunk,...rest)
    };
    
    try {
      await fn.apply(this, args);
    } finally {
      process.stdout.write = originalStdoutWrite.bind(process.stdout);;
    }
    return buff
  }
};

const N =50;
const expectedResult = '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz\n31\n32\nFizz\n34\nBuzz\nFizz\n37\n38\nFizz\nBuzz\n41\nFizz\n43\n44\nFizzBuzz\n46\n47\nFizz\n49\nBuzz\n';

test('fizzBuzz test suite', async (t) => {
  await t.test('test fizzBuzzLoop', async () => {
    const stdOutData = await captureConsole(fizzBuzzLoop)(N);
    assert.equal(stdOutData, expectedResult);
  });
  await t.test('test fizzBuzzFunctional', async () => {
    const stdOutData = await captureConsole(fizzBuzzFunctional)(N);
    assert.equal(stdOutData, expectedResult);
  });
  await t.test('test fizzBuzzGenerator', async () => {
    const stdOutData = await captureConsole(fizzBuzzGenerator)(N);
    assert.equal(stdOutData, expectedResult);
  });
  await t.test('test fizzBuzzGeneratorStream', async () => {
    const stdOutData = await captureConsole(fizzBuzzGeneratorStream)(N);
    assert.equal(stdOutData, expectedResult);
  });
  await t.test('test fizzBuzzGeneratorStreamPipe', async () => {
    const stdOutData = await captureConsole(fizzBuzzGeneratorStreamPipe)(N);
    assert.equal(stdOutData, expectedResult);
  });
  await t.test('test fizzBuzzRecursive', async () => {
    const stdOutData = await captureConsole(fizzBuzzRecursive)(N);
    assert.equal(stdOutData, expectedResult);
  });
  await t.test('test fizzBuzzStream', async () => {
    const stdOutData = await captureConsole(fizzBuzzStream)(N);
    assert.equal(stdOutData, expectedResult);
  });
  await t.test('test fizzBuzzStreamAsync', async () => {
    const stdOutData = await captureConsole(fizzBuzzStreamAsync)(N);
    assert.equal(stdOutData, expectedResult);
  });
  await t.test('test fizzBuzzTrampoline', async () => {
    const stdOutData = await captureConsole(fizzBuzzTrampoline)(N);
    assert.equal(stdOutData, expectedResult);
  });
})
