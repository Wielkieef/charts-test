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
        background: { color: '#1e1e1e' },   // ciemne tło
        textColor: '#d1d4dc',              // jasny tekst
      },
      grid: {
        vertLines: { color: '#2b2b2b' },
        horzLines: { color: '#2b2b2b' },
      },
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: '#555',
      },
      timeScale: {
        borderColor: '#555',
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderUpColor: '#4bffb5',
      borderDownColor: '#ff4976',
      wickUpColor: '#4bffb5',
      wickDownColor: '#ff4976',
    });

    async function loadChart() {
      try {
        const candles = await getData();

        if (!Array.isArray(candles) || candles.length === 0) {
          console.error('⛔ Brak danych świec:', candles);
          return;
        }

        candleSeries.setData(candles);
        chart.timeScale().fitContent();

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
