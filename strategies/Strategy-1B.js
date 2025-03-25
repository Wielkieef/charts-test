export const strategyMeta = {
  symbol: 'ETHUSDT',
  interval: '4h',
};

// 🔁 Funkcja z paginacją po endTime (dla Binance)
export async function getData() {
  const total = 1500; // łączna liczba świec, które chcemy pobrać
  const limit = 500;
  const result = [];

  let endTime = Date.now();

  while (result.length < total) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${strategyMeta.symbol}&interval=${strategyMeta.interval}&limit=${limit}&endTime=${endTime}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) break;

    result.unshift(...data);

    // Ustaw kolejny endTime na najstarszą świecę - 1ms
    endTime = data[0][0] - 1;

    // ⛔ Safety – nie pobieraj więcej niż 5000 świec
    if (result.length > 5000) break;
  }

  // 🎯 Zwróć tylko najnowsze `total` świec, przekształcone
  return result.slice(-total).map(d => ({
    time: d[0] / 1000,
    open: +d[1],
    high: +d[2],
    low: +d[3],
    close: +d[4],
  }));
}

// 📍 Marker fetch – bez zmian
export async function getMarkers(candles) {
  try {
    const res = await fetch(
      `https://europe-central2-big-bliss-342920.cloudfunctions.net/markers?strategy=1B`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'abc123XYZsecret', // ← Twój API_KEY
        },
        body: JSON.stringify({ candles }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('❌ Marker error:', err);
      return [];
    }

    const markers = await res.json();
    return Array.isArray(markers) ? markers : [];
  } catch (err) {
    console.error('❌ Marker fetch error:', err);
    return [];
  }
}
