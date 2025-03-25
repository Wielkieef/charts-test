export const strategyMeta = {
  name: '1A',
  symbol: 'BTCUSDT',
  interval: '4h',
  source: 'binance',
};

export async function getData() {
  const total = 1500;
  const limit = 500;
  const result = [];

  let endTime = Date.now();

  while (result.length < total) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${strategyMeta.symbol}&interval=${strategyMeta.interval}&limit=${limit}&endTime=${endTime}`;
    const response = await fetch(url);
    const raw = await response.json();

    if (!Array.isArray(raw) || raw.length === 0) break;

    result.unshift(...raw);
    endTime = raw[0][0] - 1;

    if (result.length > 5000) break; // Bezpiecznik
  }

  const sliced = result.slice(-total);

  console.log(`✅ Dane z Binance: ${sliced.length} świec`);

  return sliced.map((candle) => ({
    time: candle[0] / 1000,
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
  }));
}

export async function getMarkers(candles) {
  try {
    const res = await fetch(
      'https://europe-central2-big-bliss-342920.cloudfunctions.net/markers?strategy=1A',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'abc123XYZsecret',
        },
        body: JSON.stringify({ candles }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Błąd odpowiedzi z backendu:', errorText);
      return [];
    }

    const markers = await res.json();

    if (!Array.isArray(markers)) {
      console.error('❌ Nieprawidłowy format odpowiedzi z backendu:', markers);
      return [];
    }

    console.log(`✅ Markery odebrane: ${markers.length}`);
    return markers;
  } catch (err) {
    console.error('❌ Błąd w getMarkers:', err);
    return [];
  }
}
