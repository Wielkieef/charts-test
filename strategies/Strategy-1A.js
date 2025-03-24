export const strategyMeta = {
  name: '1A',
  symbol: 'BTCUSDT',
  interval: '4h',
  source: 'binance',
};

export async function getData() {
  const interval = '4h';
  const symbol = 'BTCUSDT';
  const limit = 500;

  const intervalMap = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1h': 3600,
    '4h': 14400,
    '1d': 86400,
  };

  const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
  const raw = await response.json();

  return raw.map(candle => ({
    time: candle[0] / 1000,
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
  }));
}

export async function getMarkers(candles) {
  try {
    const res = await fetch('https://europe-central2-big-bliss-342920.cloudfunctions.net/markers?strategy=1A', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candles),
    });

    if (!res.ok) {
      console.error('Błąd przy pobieraniu markerów:', await res.text());
      return [];
    }

    const markers = await res.json();
    return markers;
  } catch (err) {
    console.error('Błąd:', err);
    return [];
  }
}
