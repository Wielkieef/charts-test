export const strategyMeta = {
  name: '1A',
  symbol: 'BTCUSDT',
  interval: '4h',
  source: 'local'
};

export async function getData() {
  // Przykladowe dane świec (candlestick)
  return [
    { time: 1710806400, open: 100, high: 105, low: 95, close: 102 },
    { time: 1710820800, open: 102, high: 108, low: 100, close: 107 },
    { time: 1710835200, open: 107, high: 109, low: 103, close: 105 },
  ];
}

export async function getMarkers() {
  return [
    {
      time: 1710820800,
      position: 'belowBar',
      color: 'blue',
      shape: 'arrowUp',
      text: 'Long',
    },
    {
      time: 1710835200,
      position: 'aboveBar',
      color: 'purple',
      shape: 'arrowDown',
      text: 'Close',
    },
  ];
}
