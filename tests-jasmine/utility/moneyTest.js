import {currencyFormat} from '../../scripts/utility/money.js';

describe('test suite: currencyFormat', () => {
  it('converts cents into dollars', () => {
    expect(currencyFormat(2025)).toEqual('20.25');
  });

  it('works with 0', () => {
    expect(currencyFormat(0)).toEqual('0.00');
  });

  describe('rounds up to the nearest cent', () => {
    it('works with 0.5', () => {
      expect(currencyFormat(2000.5)).toEqual('20.01');
    });

    it('works with 0.4', () => {
      expect(currencyFormat(2000.4)).toEqual('20.00');
    });
  });

  it('negative number works', () => {
    expect(currencyFormat(-500)).toEqual('-5.00');
  });

});