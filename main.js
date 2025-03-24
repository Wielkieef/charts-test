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

  // Pobierz dane z Binance API
  try {
    const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=4h&limit=100');
    const data = await response.json();

    // Przekształć dane do formatu Lightweight Charts
    const candles = data.map(item => ({
      time: Math.floor(item[0] / 1000), // timestamp in seconds
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));

    candleSeries.setData(candles);
  } catch (err) {
    console.error('Błąd podczas pobierania danych z Binance:', err);
  }
});
