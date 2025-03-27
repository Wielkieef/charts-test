export const strategyMeta = {
  symbol: '^GSPC', // SPX500 / S&P 500
  interval: '1d',
};

// Yahoo API przez serwer proxy (bo Yahoo nie pozwala bezpośrednio na CORS)
const PROXY_URL = 'https://yh-finance-api.vercel.app'; // sprawdzony open source proxy

export async function getData() {
  const res = await fetch(`${PROXY_URL}/chart/${encodeURIComponent(strategyMeta.symbol)}?range=1y&interval=1d`);

  if (!res.ok) {
    throw new Error('❌ Błąd pobierania danych z Yahoo Finance');
  }

  const json = await res.json();

  const timestamps = json.chart.result[0].timestamp;
  const ohlc = json.chart.result[0].indicators.quote[0];

  return timestamps.map((t, i) => ({
    time: t,
    open: ohlc.open[i],
    high: ohlc.high[i],
    low: ohlc.low[i],
    close: ohlc.close[i],
  }));
}

export async function getMarkers(candles) {
  try {
    const res = await fetch(
      `https://europe-central2-big-bliss-342920.cloudfunctions.net/markers?strategy=9`,
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
      console.error('❌ Marker error:', errorText);
      return [];
    }

    const markers = await res.json();
    return Array.isArray(markers) ? markers : [];
  } catch (err) {
    console.error('❌ Marker fetch error:', err);
    return [];
  }
}
