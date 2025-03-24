// 📌 Pobierz nazwę strategii z URL, np. ?strategy=Strategy-1B
const urlParams = new URLSearchParams(window.location.search);
const strategyName = urlParams.get('strategy') || 'Strategy-1A';

// 📌 Dynamiczny import strategii na podstawie parametru
async function loadStrategyModule(name) {
  try {
    const module = await import(`./strategies/${name}.js`);
    return module;
  } catch (err) {
    console.error(`❌ Nie udało się załadować modułu strategii: ${name}`, err);
    return null;
  }
}

const chartContainer = document.getElementById('chart');

const chart = LightweightCharts.createChart(chartContainer, {
  width: chartContainer.clientWidth,
  height: 600,
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
    const strategy = await loadStrategyModule(strategyName);
    if (!strategy || !strategy.getData || !strategy.getMarkers) {
      console.error('❌ Moduł strategii nie zawiera wymaganych funkcji (getData, getMarkers).');
      return;
    }

    const candles = await strategy.getData();

    if (!Array.isArray(candles) || candles.length === 0) {
      console.error('⛔ Brak poprawnych danych świec:', candles);
      return;
    }

    candleSeries.setData(candles);

    const markers = await strategy.getMarkers(candles);

    if (Array.isArray(markers)) {
      candleSeries.setMarkers(markers);
    } else {
      console.warn('⚠️ Brak markerów do ustawienia.');
    }

    console.log(`✅ ${strategyName} – wykres i markery załadowane (${markers.length})`);
  } catch (err) {
    console.error('❌ Błąd wczytywania wykresu:', err);
  }
}

loadChart();
