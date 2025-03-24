import { getStrategy1AData } from './strategies/Strategy-1A.js';

document.addEventListener('DOMContentLoaded', function () {
  const chartContainer = document.getElementById('chart');
  if (!chartContainer) return;

  const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight,
    layout: {
      background: { color: '#ffffff' },
      textColor: '#000',
    },
    grid: {
      vertLines: { color: '#e0e0e0' },
      horzLines: { color: '#e0e0e0' },
    },
  });

  const lineSeries = chart.addLineSeries({
    color: 'red',
    lineWidth: 2,
  });

  const data = getStrategy1AData();
  lineSeries.setData(data);
});
