export async function getData() {
  const interval = '4h';
  const symbol = 'BTCUSDT';
  const limit = 500;

  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );

  if (!response.ok) {
    console.error('❌ Błąd pobierania danych z Binance:', await response.text());
    return [];
  }

  const raw = await response.json();

  console.log(`✅ Dane z Binance: ${raw.length} świec`);

  return raw.map((candle) => ({
    time: candle[0] / 1000,
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
  }));
}
