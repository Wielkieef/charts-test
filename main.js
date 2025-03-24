// main.js
import { getStrategy1AData } from './strategies/Strategy-1A.js';
import { getStrategy1AMarkers } from './strategies/Strategy-1A-signals.js';

document.addEventListener('DOMContentLoaded', async function () {
  const chartContainer = document.getElementById('chart');
  const statusText = document.getElementById('status');
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

  const lineSeries = chart.addCandlestickSeries();

  try {
    // Pobieramy dane z Binance (3 miesiące interwał 4h)
    const symbol = 'BTCUSDT';
    const interval = '4h';
    const limit = 500;
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const response = await fetch(url);
    const raw = await response.json();

    const candles = raw.map(c => ({
      time: Math.floor(c[0] / 1000),
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4]),
      value: parseFloat(c[4]) // for strategy logic
    }));

    lineSeries.setData(candles);

    // MARKERY ZE STRATEGII
    const markers = getStrategy1AMarkers(candles);
    lineSeries.setMarkers(markers);

    statusText.textContent = 'Strategia załadowana.';
  } catch (err) {
    console.error('Błąd pobierania danych z Binance:', err);
    statusText.textContent = 'Błąd ładowania strategii.';
  }
});
