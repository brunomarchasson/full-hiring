const { fizzBuzzLoop } = require("./lib/dummyLoop");
const { fizzBuzzFunctional } = require("./lib/functional");
const { fizzBuzzGeneratorStream, fizzBuzzGeneratorStreamPipe, fizzBuzzGenerator } = require("./lib/generator");
const { fizzBuzzRecursive } = require("./lib/reucursive");
const { fizzBuzzStreamAsync, fizzBuzzStream } = require("./lib/stream");
const { fizzBuzzTrampoline } = require("./lib/trampoline");

const NUMBER = 500000

async function monitorMultipleFunctions(functions) {
  const results = []
  for (const [index, fn] of functions.entries()) {
    try {
      const startTime = performance.now();

      await fn(NUMBER);

      const endTime = performance.now();
      const timeTaken = endTime - startTime;
      results.push({
        name: fn.name || `Function ${index + 1}`,
        timeTaken: timeTaken.toFixed(2) + ' ms',
       
      });
    } catch (error) {
      console.error(error)
      results.push({
        name: fn.name || `Function ${index + 1}`,
        error: error.message,
        timeTaken: Infinity,
     
      });
    }
  }

  results.sort((a, b) => parseFloat(a.timeTaken) - parseFloat(b.timeTaken));
  const baseTime = parseFloat(results[0].timeTaken);
  results.forEach(result => {
    result.timePercentageDifference = ((parseFloat(result.timeTaken) - baseTime) / baseTime * 100).toFixed(2) + ' %';
  });

  return results;
}

(async () => {
  const results = await monitorMultipleFunctions([
    fizzBuzzLoop,
    fizzBuzzFunctional,
    fizzBuzzGenerator,
    fizzBuzzGeneratorStream,
    fizzBuzzGeneratorStreamPipe,
    fizzBuzzRecursive,
    fizzBuzzStream,
    fizzBuzzStreamAsync,
    fizzBuzzTrampoline,

  ])
  console.log(results)
})()