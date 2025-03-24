const chartContainer = document.getElementById('chart');

// 👇 Wyciągamy strategię z parametru URL
const urlParams = new URLSearchParams(window.location.search);
const strategyName = urlParams.get('strategy') || '1A'; // domyślnie 1A

// ⏬ Ładujemy dynamicznie strategię
import(`./strategies/Strategy-${strategyName}.js`)
  .then(({ strategyMeta, getData, getMarkers }) => {
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
        const candles = await getData();

        if (!Array.isArray(candles) || candles.length === 0) {
          console.error('⛔ Brak danych świec:', candles);
          return;
        }

        candleSeries.setData(candles);

        const markers = await getMarkers(candles);
        if (Array.isArray(markers)) {
          candleSeries.setMarkers(markers);
        } else {
          console.warn('⚠️ Brak markerów');
        }

        console.log(`✅ Wczytano strategię ${strategyName}`);
      } catch (err) {
        console.error('❌ Błąd wczytywania:', err);
      }
    }

    loadChart();
  })
  .catch(err => {
    console.error(`❌ Nie znaleziono strategii "${strategyName}"`, err);
    chartContainer.innerHTML = `<p style="color: red;">Nie znaleziono strategii "${strategyName}"</p>`;
  });
