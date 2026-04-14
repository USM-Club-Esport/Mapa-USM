export const getRegionWithMostNodes = (markers) => {
    if (!markers || markers.length === 0) return null;

    const CELL_SIZE = 0.0015; // approximate cell size
    const cells = {};

    markers.forEach((marker) => {
        const latitude = marker?.coordinate?.latitude ?? marker?.latitude;
        const longitude = marker?.coordinate?.longitude ?? marker?.longitude;

        if (typeof latitude !== 'number' || typeof longitude !== 'number') return;

        const latCell = Math.floor(latitude / CELL_SIZE);
        const lngCell = Math.floor(longitude / CELL_SIZE);
        const key = `${latCell}_${lngCell}`;

        if (!cells[key]) cells[key] = [];
        cells[key].push({ latitude, longitude });
    });

    const allKeys = Object.keys(cells);
    if (allKeys.length === 0) return null;

    let bestKey = allKeys[0];
    allKeys.forEach((key) => {
        if (cells[key].length > cells[bestKey].length) {
            bestKey = key;
        }
    });

    const bestPoints = cells[bestKey];

    let minLat = bestPoints[0].latitude;
    let maxLat = bestPoints[0].latitude;
    let minLng = bestPoints[0].longitude;
    let maxLng = bestPoints[0].longitude;

    bestPoints.forEach((p) => {
        if (p.latitude < minLat) minLat = p.latitude;
        if (p.latitude > maxLat) maxLat = p.latitude;
        if (p.longitude < minLng) minLng = p.longitude;
        if (p.longitude > maxLng) maxLng = p.longitude;
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    const LATITUDE_OFFSET = 0.0006;

    return {
        latitude: centerLat + LATITUDE_OFFSET,
        longitude: centerLng,
        latitudeDelta: Math.max((maxLat - minLat) * 3, 0.0025),
        longitudeDelta: Math.max((maxLng - minLng) * 3, 0.0025),
    };
};
