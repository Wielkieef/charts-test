export const strategyMeta = {
  name: '1A',
  symbol: 'BTCUSDT',
  interval: '4h',
  source: 'binance',
};

function intervalToBinance(interval) {
  return {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '1h': '1h',
    '4h': '4h',
    '1d': '1d',
  }[interval] || '4h';
}

export async function getData() {
  const symbol = strategyMeta.symbol;
  const interval = intervalToBinance(strategyMeta.interval);
  const limit = 500; // ~3 miesiące danych 4h

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Błąd API Binance');

  const rawData = await response.json();

  return rawData.map(d => ({
    time: d[0] / 1000,
    open: parseFloat(d[1]),
    high: parseFloat(d[2]),
    low: parseFloat(d[3]),
    close: parseFloat(d[4]),
  }));
}

export async function getMarkers() {
  // Tymczasowo PUSTE – gotowe do implementacji
  return [];
}
