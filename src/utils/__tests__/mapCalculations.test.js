import { getRegionWithMostNodes } from '../mapCalculations';

describe('getRegionWithMostNodes', () => {
    const createMarker = (lat, lng) => ({
        id: `m${lat}_${lng}`,
        title: 'Test',
        color: 'blue',
        latitude: lat,
        longitude: lng,
        address: '',
        departments: [],
        modules: [],
    });

    it('returns null for empty markers', () => {
        expect(getRegionWithMostNodes([])).toBeNull();
        expect(getRegionWithMostNodes(null)).toBeNull();
        expect(getRegionWithMostNodes(undefined)).toBeNull();
    });

    it('returns a region object with the correct shape', () => {
        const markers = [createMarker(10.4912, -66.7805)];

        const result = getRegionWithMostNodes(markers);

        expect(result).toHaveProperty('latitude');
        expect(result).toHaveProperty('longitude');
        expect(result).toHaveProperty('latitudeDelta');
        expect(result).toHaveProperty('longitudeDelta');
        expect(typeof result.latitude).toBe('number');
        expect(typeof result.longitude).toBe('number');
    });

    it('handles markers with coordinate object format', () => {
        const markers = [
            {
                id: 'm1',
                coordinate: { latitude: 10.4912, longitude: -66.7805 },
            },
        ];

        const result = getRegionWithMostNodes(markers);

        expect(result).not.toBeNull();
    });

    it('skips markers with invalid coordinates', () => {
        const markers = [
            createMarker(10.4912, -66.7805),
            { id: 'bad', latitude: 'invalid', longitude: -66.7805 },
            { id: 'bad2', latitude: 10.4912 },
        ];

        const result = getRegionWithMostNodes(markers);

        expect(result).not.toBeNull();
        expect(result.latitude).toBeCloseTo(10.4918, 3);
    });

    it('groups nearby markers and centers on the densest cluster', () => {
        const markers = [
            // Cluster A: 3 markers (most dense)
            createMarker(10.4912, -66.7805),
            createMarker(10.4913, -66.7806),
            createMarker(10.4914, -66.7807),
            // Cluster B: 2 markers
            createMarker(10.5, -66.79),
            createMarker(10.5001, -66.7901),
        ];

        const result = getRegionWithMostNodes(markers);

        expect(result.latitude).toBeGreaterThan(10.49);
        expect(result.latitude).toBeLessThan(10.5);
    });
});
