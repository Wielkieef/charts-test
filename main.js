document.addEventListener('DOMContentLoaded', function() {
  const chartContainer = document.getElementById('chart');
  if (!chartContainer) return;

  const chart = LightweightCharts.createChart(chartContainer, {
    width: 600,
    height: 400,
  });
  const lineSeries = chart.addLineSeries();
  lineSeries.setData([
    { time: '2023-03-01', value: 100 },
    { time: '2023-03-02', value: 105 },
    { time: '2023-03-03', value: 102 },
  ]);
});
