// main.js - Strategy 1A z danymi z Binance (4h, 3 miesiace)

// Parametry strategii
const symbol = 'BTCUSDT';
const interval = '4h';
const limit = 1000;
const now = Date.now();
const threeMonthsAgo = now - 90 * 24 * 60 * 60 * 1000;

const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${threeMonthsAgo}&limit=${limit}`;

// Wczytanie danych i rysowanie wykresu
fetch(binanceUrl)
  .then(res => res.json())
  .then(data => {
    const formattedData = data.map(candle => ({
      time: Math.floor(candle[0] / 1000),
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4])
    }));

    const chartContainer = document.getElementById('chart');
    const chart = LightweightCharts.createChart(chartContainer, {
      width: 800,
      height: 500,
      layout: {
        background: { color: '#f0f0f0' },
        textColor: '#000'
      },
      grid: {
        vertLines: { color: '#e0e0e0' },
        horzLines: { color: '#e0e0e0' }
      }
    });

    const series = chart.addCandlestickSeries();
    series.setData(formattedData);

    document.querySelector('h1').textContent = 'Strategia: 1A';
  })
  .catch(err => {
    console.error('Błąd podczas pobierania danych z Binance:', err);
    document.querySelector('h1').textContent = 'Błąd ładowania strategii';
  });
