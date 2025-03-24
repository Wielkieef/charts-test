(function() {
  const chartContainer = document.getElementById('chart');
  if (!chartContainer) return;

  const chart = LightweightCharts.createChart(chartContainer, {
    width: 800,
    height: 500,
  });

  const series = chart.addLineSeries({
    color: 'blue',
    lineWidth: 2,
  });

  series.setData([
    { time: '2023-03-01', value: 120 },
    { time: '2023-03-02', value: 128 },
    { time: '2023-03-03', value: 122 },
    { time: '2023-03-04', value: 135 },
  ]);

  // 👇 tu później będą markery, eventy, itd.
})();
