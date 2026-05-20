import { MARKERS_DATA } from '../markersData';

describe('MARKERS_DATA', () => {
    it('has at least one marker', () => {
        expect(MARKERS_DATA.length).toBeGreaterThan(0);
    });

    it('every marker has required fields', () => {
        MARKERS_DATA.forEach((marker) => {
            expect(marker).toHaveProperty('id');
            expect(marker).toHaveProperty('subItemId');
            expect(marker).toHaveProperty('categoryId');
            expect(marker).toHaveProperty('title');
            expect(marker).toHaveProperty('latitude');
            expect(marker).toHaveProperty('longitude');
        });
    });

    it('every marker has valid coordinates', () => {
        MARKERS_DATA.forEach((marker) => {
            expect(typeof marker.latitude).toBe('number');
            expect(typeof marker.longitude).toBe('number');
            expect(marker.latitude).toBeGreaterThanOrEqual(-90);
            expect(marker.latitude).toBeLessThanOrEqual(90);
            expect(marker.longitude).toBeGreaterThanOrEqual(-180);
            expect(marker.longitude).toBeLessThanOrEqual(180);
        });
    });

    it('every marker has unique id', () => {
        const ids = MARKERS_DATA.map((m) => m.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('every marker has a non-empty title', () => {
        MARKERS_DATA.forEach((marker) => {
            expect(marker.title).toBeTruthy();
        });
    });

    it('every marker has address, departments, and modules as strings or arrays', () => {
        MARKERS_DATA.forEach((marker) => {
            expect(typeof marker.address).toBe('string');
            expect(Array.isArray(marker.departments)).toBe(true);
            expect(Array.isArray(marker.modules)).toBe(true);
        });
    });
});
