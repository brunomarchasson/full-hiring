exports.fizzBuzzTrampoline = function fizzBuzzTrampoline(number) {
  function step(i) {
    if (i > number) return () => { };
    let output = '';
    if (i % 3 === 0) output += 'Fizz';
    if (i % 5 === 0) output += 'Buzz';
    console.log(output || i);
    return () => step(i + 1);
  }

  function trampoline(fn) {
    while (fn && typeof fn === 'function') {
      fn = fn();
    }
  }

  trampoline(() => step(1));
}