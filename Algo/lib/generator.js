const { Readable } = require('stream');
const { finished } = require('stream/promises');

function* generator(number) {
  for (var i = 1; i <= number; i++) {
    var output = "";
    if (i % 3 == 0)
      output += "Fizz";

    if (i % 5 == 0)
      output += "Buzz";

    if (!output)
      output = i.toString();

    yield output+'\n';
  }
}

exports.fizzBuzzGenerator =function fizzBuzzGenerator(number) {
  for (const n of generator(number)) {
    process.stdout.write(n);
  }
}

exports.fizzBuzzGeneratorStream =async function fizzBuzzGeneratorStream (number) {
  const readable = Readable.from(generator(number));

  readable.on('data', (chunk) => {
    process.stdout.write(chunk);
  });
  await finished(readable);
}

exports.fizzBuzzGeneratorStreamPipe =async function fizzBuzzGeneratorStreamPipe(number) {
  const readable = Readable.from(generator(number));
  readable.pipe(process.stdout)
  await finished(readable);
}