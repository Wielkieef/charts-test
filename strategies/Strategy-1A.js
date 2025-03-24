export const strategyMeta = {
  name: '1A',
  symbol: 'BTCUSDT',
  interval: '4h',
  source: 'binance',
};

// Dane OHLC – mogą być z Binance lub statyczne
export async function getData() {
  const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=4h&limit=500');
  const rawData = await response.json();

  return rawData.map(([time, open, high, low, close]) => ({
    time: Math.floor(time / 1000), // sekundowe timestampy
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
  }));
}

// Markery wygenerowane wcześniej – np. z PineScript, backendu itp.
export async function getMarkers() {
  return [
    {
      time: 1713489600, // timestamp w sekundach
      position: 'belowBar',
      color: 'blue',
      shape: 'arrowUp',
      text: 'Long',
    },
    {
      time: 1713622800,
      position: 'aboveBar',
      color: 'purple',
      shape: 'arrowDown',
      text: 'Close',
    },
    // Dodaj kolejne sygnały zgodnie z logiką
  ];
}
