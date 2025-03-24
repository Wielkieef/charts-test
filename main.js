const symbol = 'BTCUSDT';
const interval = '4h';
const limit = 1000; // max dozwolone przez Binance

// Oblicz timestamp sprzed 90 dni
const now = Date.now();
const threeMonthsAgo = now - 90 * 24 * 60 * 60 * 1000;

const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${threeMonthsAgo}&limit=${limit}`;

fetch(binanceUrl)
  .then(res => res.json())
  .then(data => {
    const formattedData = data.map(candle => ({
      time: Math.floor(candle[0] / 1000), // timestamp (w sekundach)
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
    }));

    const chartContainer = document.getElementById('chart');
    const chart = LightweightCharts.createChart(chartContainer, {
      width: 800,
      height: 500,
    });

    const series = chart.addCandlestickSeries();
    series.setData(formattedData);

    // Zmieniamy tekst nagłówka po załadowaniu
    document.querySelector('h1').textContent = 'Strategia: 1A';
  })
  .catch(err => {
    console.error('Błąd podczas pobierania danych:', err);
  });
