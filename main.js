// main.js
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const strategyId = urlParams.get('strategy') || 'Strategy-1A';

  // dynamiczny import
  try {
    const module = await import(`./strategies/${strategyId}.js`);
    const { strategyMeta, getMarkers, getData } = module;

    document.getElementById('strategy-title').textContent = `Wykres strategii: ${strategyMeta.name}`;

    const chart = LightweightCharts.createChart(document.getElementById('chart'), {
      width: 1000,
      height: 600,
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

    // tymczasowo użyj danych z pliku strategii (w kolejnym kroku zrobimy fetchOHLC z Binance)
    const candleData = await getData();
    candleSeries.setData(candleData);

    if (getMarkers) {
      const markers = await getMarkers();
      candleSeries.setMarkers(markers);
    }

  } catch (err) {
    document.getElementById('strategy-title').textContent = 'Błąd ładowania strategii';
    console.error('Nie udało się załadować strategii:', err);
  }
});
