export const strategyMeta = {
  symbol: 'ETHUSDT',
  interval: '4h',
};

export async function getData() {
  const limit = 500;
  const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${strategyMeta.symbol}&interval=4h&limit=${limit}`);
  const raw = await res.json();

  return raw.map(d => ({
    time: d[0] / 1000,
    open: +d[1],
    high: +d[2],
    low: +d[3],
    close: +d[4],
  }));
}

export async function getMarkers(candles) {
  try {
    const res = await fetch(
      `https://europe-central2-big-bliss-342920.cloudfunctions.net/markers?strategy=1B`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'abc123XYZsecret', // 👈 Ustaw swój API_KEY
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
