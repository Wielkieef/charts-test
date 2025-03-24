// main.js
import { getStrategy1AData } from './strategies/Strategy-1A.js';
import { getStrategy1AMarkers } from './strategies/Strategy-1A-markers.js';

document.addEventListener('DOMContentLoaded', function () {
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

  // ŚWIECOWY wykres zamiast linii
  const candleSeries = chart.addCandlestickSeries();

  // Ustaw dane do świec (open, high, low, close)
  candleSeries.setData(getStrategy1AData());

  // Dodaj markery do tej serii
  candleSeries.setMarkers(getStrategy1AMarkers());
});
