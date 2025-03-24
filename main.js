document.addEventListener('DOMContentLoaded', async function () {
  const chartContainer = document.getElementById('chart');
  if (!chartContainer) return;

  const chart = LightweightCharts.createChart(chartContainer, {
    width: 800,
    height: 500,
    layout: {
      background: { color: '#f0f0f0' },
      textColor: '#000',
    },
    grid: {
      vertLines: { color: '#e0e0e0' },
      horzLines: { color: '#e0e0e0' },
    },
  });

  const candleSeries = chart.addCandlestickSeries();

  try {
    const response = await fetch(
      'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=4h&limit=100'
    );
    const data = await response.json();

    const formattedData = data.map(candle => ({
      time: candle[0] / 1000, // ms → UNIX seconds
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
    }));

    candleSeries.setData(formattedData);
  } catch (err) {
    console.error('Błąd pobierania danych z Binance:', err);
  }
});
