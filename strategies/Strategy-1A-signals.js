// strategies/Strategy-1A-signals.js

export function getStrategy1AMarkers(candles, stopLossPercent = 5) {
  const left = 7;
  const right = 7;
  const lengthSMA1 = 50;
  const lengthSMA2 = 100;
  const lengthAdaptive = 25;

  const markers = [];
  const closes = candles.map(c => c.value);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);

  // Helper: SMA
  function sma(src, length, i) {
    if (i < length) return null;
    const slice = src.slice(i - length, i);
    return slice.reduce((sum, val) => sum + val, 0) / length;
  }

  // Helper: Kaufman adaptive filter
  function adaptiveFilter(i) {
    if (i < lengthAdaptive) return closes[i];
    const change = Math.abs(closes[i] - closes[i - lengthAdaptive]);
    const volatility = closes
      .slice(i - lengthAdaptive + 1, i + 1)
      .reduce((sum, v, j, arr) => sum + Math.abs(v - arr[j - 1] || v), 0);

    const er = change / volatility;
    const pow = 1 / er;
    const per = Math.pow(change / volatility, pow);

    return per * closes[i] + (1 - per) * closes[i - 1];
  }

  let position = null;
  let entryPrice = null;

  for (let i = 0; i < candles.length; i++) {
    const time = candles[i].time;
    const close = closes[i];
    const high = highs[i];
    const low = lows[i];

    // --- S&R logic
    let top = null, bot = null;
    if (i >= left + right) {
      const highSlice = highs.slice(i - left - right, i + 1);
      const lowSlice = lows.slice(i - left - right, i + 1);
      const mid = left;
      if (
        highSlice[mid] === Math.max(...highSlice) &&
        mid !== 0 && mid !== highSlice.length - 1
      ) {
        top = highSlice[mid];
      }
      if (
        lowSlice[mid] === Math.min(...lowSlice) &&
        mid !== 0 && mid !== lowSlice.length - 1
      ) {
        bot = lowSlice[mid];
      }
    }

    const sma1 = sma(closes, lengthSMA1, i);
    const sma2 = sma(closes, lengthSMA2, i);
    const adaptive = adaptiveFilter(i);
    const a_f = adaptive / closes[i - 1] > 0.999 && adaptive / closes[i - 1] < 1.001;

    if (top && close > top && sma1 > sma2 && !a_f && !position) {
      // LONG ENTRY
      position = 'long';
      entryPrice = close;

      markers.push({
        time,
        position: 'aboveBar',
        color: 'blue',
        shape: 'arrowUp',
        text: 'LONG'
      });
    }

    if (position === 'long') {
      const stopLossPrice = entryPrice * (1 - stopLossPercent / 100);
      if (close < stopLossPrice) {
        // STOP LOSS
        position = null;
        markers.push({
          time,
          position: 'belowBar',
          color: 'red',
          shape: 'arrowDown',
          text: 'SL'
        });
        continue;
      }

      if (bot && close < bot && sma1 > sma2 && !a_f) {
        // CLOSE
        position = null;
        markers.push({
          time,
          position: 'belowBar',
          color: 'purple',
          shape: 'arrowDown',
          text: 'CLOSE'
        });
      }
    }
  }

  return markers;
}
