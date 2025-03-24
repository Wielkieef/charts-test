const SYMBOL = 'ETHUSDT';
const INTERVAL = '4h';
const LIMIT = 500;
const API_KEY = 'abc123XYZsecret'; // <- podmień jeśli inny

export const strategyMeta = {
  id: 'Strategy-1B',
  name: 'S&R breakout ETH [4h]',
  symbol: SYMBOL,
  interval: INTERVAL,
};

export async function getData() {
  const url = `https://api.binance.com/api/v3/klines?symbol=${SYMBOL}&interval=4h&limit=${LIMIT}`;
  const res = await fetch(url);
  const raw = await res.json();

  if (!Array.isArray(raw)) throw new Error('Niepoprawne dane z Binance');

  console.log(`✅ Dane z Binance (${SYMBOL}): ${raw.length} świec`);

  return raw.map(c => ({
    time: Math.floor(c[0] / 1000),
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
  }));
}

export async function getMarkers(candles) {
  try {
    const res = await fetch(
      'https://europe-central2-big-bliss-342920.cloudfunctions.net/markers?strategy=1B',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_KEY,
        },
        body: JSON.stringify({ candles }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Błąd przy pobieraniu markerów 1B:', errorText);
      return [];
    }

    const markers = await res.json();

    if (!Array.isArray(markers)) {
      console.error('Nieprawidłowy format markerów:', markers);
      return [];
    }

    console.log(`✅ Markery Strategy-1B: ${markers.length}`);
    return markers;
  } catch (err) {
    console.error('❌ Błąd w getMarkers (1B):', err);
    return [];
  }
}
