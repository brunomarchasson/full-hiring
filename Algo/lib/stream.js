const { Readable, Transform } = require('stream');
const { finished } = require('stream/promises');

class NumberStream extends Readable {
  constructor(limit, options = {}) {
    super(options);
    this.limit = limit;
    this.current = 1;
  }

  _read() {
    if (this.current <= this.limit) {
      this.push(String(this.current));
      this.current++;
    } else {
      this.push(null);
    }
  }
}

class FizzBuzzTransform extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, encoding, callback) {
    const number = Number(chunk);
    let output = '';
    if (number % 3 === 0) output += 'Fizz';
    if (number % 5 === 0) output += 'Buzz';
    this.push((output || String(number)) + '\n');
    callback();
  }
}

exports.fizzBuzzStream = async function fizzBuzzStream(number) {
  const numberStream = new NumberStream(number);
  const fizzBuzzTransform = new FizzBuzzTransform(null, '\n');
  numberStream.pipe(fizzBuzzTransform).pipe(process.stdout)
  await finished(numberStream);
}

exports.fizzBuzzStreamAsync = async function fizzBuzzStreamAsync(number) {
  return new Promise((resolve, reject) => {
    const numberStream = new NumberStream(number);
    const fizzBuzzTransform = new FizzBuzzTransform(null, '\n');
    numberStream.on("end", resolve)
    numberStream.on("error", reject)
    numberStream.pipe(fizzBuzzTransform).pipe(process.stdout);
  })
}  