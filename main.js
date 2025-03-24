document.addEventListener('DOMContentLoaded', async () => {
  const chartContainer = document.getElementById('chart');
  const title = document.querySelector('h1');

  const params = new URLSearchParams(window.location.search);
  const strategyName = params.get("strategy") || "Strategy-1A";

  try {
    const module = await import(`./strategies/${strategyName}.js`);
    const { strategyMeta, getData, getMarkers } = module;

    title.textContent = `Strategia: ${strategyMeta.name}`;

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
    const candles = await getData();
    candleSeries.setData(candles);

    const markers = await getMarkers();
    candleSeries.setMarkers(markers);
  } catch (error) {
    title.textContent = 'Błąd podczas ładowania strategii.';
    console.error('Błąd ładowania strategii:', error);
  }
});
