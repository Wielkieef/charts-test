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
        background: { color: '#e5e5e5' },   // Jasnoszare tło
        textColor: '#000000',              // Czarny tekst (ceny, daty)
      },
      grid: {
        vertLines: { color: '#d0d0d0' },
        horzLines: { color: '#d0d0d0' },
      },
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: '#cccccc',
      },
      timeScale: {
        borderColor: '#cccccc',
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    async function loadChart() {
      try {
        const candles = await getData();

        if (!Array.isArray(candles) || candles.length === 0) {
          console.error('⛔ Brak danych świec:', candles);
          return;
        }

        candleSeries.setData(candles);
        chart.timeScale().fitContent(); // 👈 Dopasuj wykres do dostępnych danych

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
