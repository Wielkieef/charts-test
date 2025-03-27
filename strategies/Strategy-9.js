export const strategyMeta = {
  symbol: '^GSPC',        // S&P500 z Yahoo Finance
  interval: '1d',
};

export async function getData() {
  const url = `https://europe-central2-big-bliss-342920.cloudfunctions.net/chartDataFetcher?symbol=${encodeURIComponent(strategyMeta.symbol)}&range=1y&interval=1d`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('❌ Błąd pobierania danych z chmury');

  return await res.json();
}

export function getMarkers(candles) {
  const atrLength = 14;
  const atrMultiplier = 2.0;
  const emaLength = 20;
  const trendFilterLength = 50;
  const smaLength = 200;
  const stopLossPercent = 10;

  const markers = [];
  let inPosition = null;
  let entryPrice = null;

  const ema = (arr, len) => {
    const k = 2 / (len + 1);
    let emaPrev = arr[0].close;
    return arr.map((candle, i) => {
      const price = candle.close;
      emaPrev = price * k + emaPrev * (1 - k);
      return emaPrev;
    });
  };

  const sma = (arr, len) => {
    return arr.map((_, i) => {
      if (i < len - 1) return null;
      const slice = arr.slice(i - len + 1, i + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / len;
    });
  };

  const atr = (arr, len) => {
    const tr = [];
    for (let i = 1; i < arr.length; i++) {
      const curr = arr[i];
      const prev = arr[i - 1];
      const highLow = curr.high - curr.low;
      const highClose = Math.abs(curr.high - prev.close);
      const
