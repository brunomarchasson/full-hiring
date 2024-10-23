const factors = [[3, 'Fizz'], [5, 'Buzz']]
const fizzBuzz = num => factors.map(([factor, text]) => (num % factor) ? '' : text).join('') || num
const range = x => [...Array(x + 1).keys()].slice(1)

exports.fizzBuzzFunctional = function fizzBuzzFunctional(number) {
  const outputs = range(number).map(fizzBuzz)
  console.log(outputs.join('\n'))
}