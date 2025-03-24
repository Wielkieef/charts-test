import { strategyMeta, getData, getMarkers } from './strategies/Strategy-1A.js';

const chartContainer = document.getElementById('chart');

const chart = LightweightCharts.createChart(chartContainer, {
  width: chartContainer.clientWidth,
  height: 500,
  layout: {
    background: { color: '#f0f0f0' },
    textColor: 'black',
  },
  grid: {
    vertLines: { color: '#e0e0e0' },
    horzLines: { color: '#e0e0e0' },
  },
});

const candleSeries = chart.addCandlestickSeries();

async function loadChart() {
  try {
    const data = await getData();
    candleSeries.setData(data);

    const markers = await getMarkers();
    candleSeries.setMarkers(markers);
  } catch (err) {
    console.error('Błąd wczytywania danych:', err);
  }
}

loadChart();
