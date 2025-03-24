document.addEventListener('DOMContentLoaded', async function () {
  const chartContainer = document.getElementById('chart');
  if (!chartContainer) return;

  const symbol = 'BTCUSDT';
  const interval = '4h';
  const limit = 1000;

  const now = Date.now();
  const threeMonthsAgo = now - 90 * 24 * 60 * 60 * 1000;

  const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${threeMonthsAgo}&limit=${limit}`;

  try {
    const res = await fetch(binanceUrl);
    const data = await res.json();

    const candles = data.map(c => ({
      time: Math.floor(c[0] / 1000),
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4]),
    }));

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
    candleSeries.setData(candles);

    document.querySelector('h1').textContent = 'Strategia: 1A';

  } catch (error) {
    console.error('Błąd podczas pobierania danych z Binance:', error);
    document.querySelector('h1').textContent = '❌ Błąd podczas pobierania danych.';
  }
});
