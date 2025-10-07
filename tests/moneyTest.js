import {currencyFormat} from '../scripts/utility/money.js';

console.log('test suite: currencyFormat')

console.log('converts cents into dollars');

if(currencyFormat(2095) === '20.95') {
  console.log('passed');
} else {
  console.log('failed');
}

console.log('works with 0');

if (currencyFormat(0) === '0.00') {
  console.log('passed');
} else {
  console.log('failed');
}

console.log('rounds up to the nearest cent');

if (currencyFormat(2000.5) === '20.01') {
  console.log('passed');
} else {
  console.log('failed');
}

if (currencyFormat(2000.4) === '20.00') {
  console.log('passed');
} else {
  console.log('failed');
}