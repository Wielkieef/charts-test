import { strategyMeta, getData, getMarkers } from './strategies/Strategy-1A.js';

const chartContainer = document.getElementById('chart');

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
      console.error('⛔ Brak poprawnych danych świec:', candles);
      return;
    }

    candleSeries.setData(candles);

    const markers = await getMarkers(candles);

    if (Array.isArray(markers)) {
      candleSeries.setMarkers(markers);
    } else {
      console.warn('⚠️ Brak markerów do ustawienia.');
    }

    console.log('✅ Wykres i markery załadowane');
  } catch (err) {
    console.error('❌ Błąd wczytywania danych:', err);
  }
}

loadChart();
