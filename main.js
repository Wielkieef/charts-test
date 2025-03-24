document.addEventListener('DOMContentLoaded', function () {
  const chartContainer = document.getElementById('chart');
  if (!chartContainer) return;

  const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight,
    layout: {
      background: { color: '#ffffff' }, // zmieniamy z szarego na biały
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

  lineSeries.setData([
    { time: '2023-03-01', value: 100 },
    { time: '2023-03-02', value: 105 },
    { time: '2023-03-03', value: 102 },
  ]);
});
