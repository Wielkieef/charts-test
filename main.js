import { strategyMeta, getData, getMarkers } from './strategies/Strategy-1A.js';

document.addEventListener('DOMContentLoaded', async () => {
  const chartContainer = document.getElementById('chart');
  if (!chartContainer) return;

  document.querySelector('h1').textContent = `Strategia: ${strategyMeta.name}`;

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
    const data = await getData();
    const markers = await getMarkers();

    candleSeries.setData(data);
    candleSeries.setMarkers(markers);
  } catch (error) {
    console.error('Błąd podczas ładowania danych:', error);
  }
});
