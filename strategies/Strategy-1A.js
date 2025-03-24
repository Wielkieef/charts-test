// Strategy-1A.js

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

  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );

    if (!response.ok) {
      console.error('Błąd przy pobieraniu danych z Binance:', await response.text());
      return [];
    }

    const raw = await response.json();

    return raw.map((candle) => ({
      time: candle[0] / 1000,
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
    }));
  } catch (err) {
    console.error('Błąd w getData():', err);
    return [];
  }
}

export async function getMarkers(candles) {
  if (!Array.isArray(candles) || candles.length === 0) {
    console.error('getMarkers: Niepoprawne dane wejściowe:', candles);
    return [];
  }

  try {
    const res = await fetch(
      'https://europe-central2-big-bliss-342920.cloudfunctions.net/markers?strategy=1A',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candles }), // 🔧 owinięcie w { candles }
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Błąd przy pobieraniu markerów:', errorText);
      return [];
    }

    const markers = await res.json();

    if (!Array.isArray(markers)) {
      console.error('Nieprawidłowy format odpowiedzi:', markers);
      return [];
    }

    return markers;
  } catch (err) {
    console.error('Błąd w getMarkers():', err);
    return [];
  }
}
