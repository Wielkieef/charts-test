export const strategyMeta = {
  name: '1A',
  symbol: 'BTCUSDT',
  interval: '4h',
  source: 'binance',
};

export async function getData() {
  const symbol = strategyMeta.symbol;
  const interval = '4h';
  const limit = 500; // Maksymalna liczba świec na jedno zapytanie
  const endTime = Date.now();
  const startTime = endTime - 90 * 24 * 60 * 60 * 1000; // Ostatnie 90 dni

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.map(candle => ({
      time: candle[0] / 1000,
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
    }));
  } catch (error) {
    console.error('Błąd podczas pobierania danych z Binance:', error);
    return [];
  }
}

export async function getMarkers() {
  // Tutaj dodaj logikę generowania markerów na podstawie pobranych danych
  return [];
}
