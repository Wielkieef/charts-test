export async function getMarkers(candles) {
  try {
    const res = await fetch(
      'https://europe-central2-big-bliss-342920.cloudfunctions.net/markers?strategy=1A',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'abc123XYZsecret' // <-- 👈 Twój API_KEY tutaj
        },
        body: JSON.stringify({ candles }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Błąd przy pobieraniu markerów:', errorText);
      return [];
    }

    const markers = await res.json();

    if (!Array.isArray(markers)) {
      console.error('Nieprawidłowy format odpowiedzi:', markers);
      return [];
    }

    console.log(`✅ Markery odebrane: ${markers.length}`);
    return markers;
  } catch (err) {
    console.error('❌ Błąd w getMarkers:', err);
    return [];
  }
}
