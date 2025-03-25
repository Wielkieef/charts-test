export const strategyMeta = {
  name: '2A',
  symbol: 'BTCUSDT',      // ✅ para BTC/USDT
  interval: '4h',          // ✅ interwał 4 godziny
  source: 'binance',
};


export async function getData() {
  const symbol = strategyMeta.symbol;
  const interval = strategyMeta.interval;
  const limit = 1500; // ← więcej świec

  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );

  if (!response.ok) {
    console.error('❌ Błąd pobierania danych z Binance:', await response.text());
    return [];
  }

  const raw = await response.json();
  console.log(`✅ Dane z Binance (${symbol}): ${raw.length} świec`);

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
    const res = await fetch(
      'https://europe-central2-big-bliss-342920.cloudfunctions.net/markers?strategy=2A',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'abc123XYZsecret', // 🔐 Twój klucz API
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

    console.log(`✅ Markery odebrane (2A): ${markers.length}`);
    return markers;
  } catch (err) {
    console.error('❌ Błąd w getMarkers (2A):', err);
    return [];
  }
}
