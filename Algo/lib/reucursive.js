exports.fizzBuzzRecursive = function fizzBuzzRecursive (number, i = 1) {
  if (i > number) return;
  let output = '';
  if (i % 3 === 0) output += 'Fizz';
  if (i % 5 === 0) output += 'Buzz';
  console.log(output || i);
  return fizzBuzzRecursive(number, i + 1);
}