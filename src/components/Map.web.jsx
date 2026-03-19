import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const INITIAL_CENTER = [10.4912244, -66.7805869];
const INITIAL_ZOOM = 20;

export default function Map({ markers = [] }) {
    const [isMounted, setIsMounted] = useState(false);

    // We must lazily load Leaflet only on the client-side to prevent "window is not defined" SSR errors
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <View style={styles.container} />;
    }

    const { MapContainer, TileLayer, Marker: LeafletMarker, Popup, useMap } = require('react-leaflet');
    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');

    // Fix for default marker icons in React Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });

    // Dynamic icon generator based on SVG with color
    const getIconByColor = (color) => {
        // SVG Raw markup with injected dynamic color
        const svgMarkup = `
            <svg version="1.1" id="svg2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 1200" fill="${color}" stroke="#1E1E1E" stroke-width="20" style="width: 100%; height: 100%;">
                <g id="SVGRepo_iconCarrier"> 
                    <path d="M600,0C350.178,0,147.656,202.521,147.656,452.344 c0,83.547,16.353,169.837,63.281,232.031L600,1200l389.062-515.625c42.625-56.49,63.281-156.356,63.281-232.031 C1052.344,202.521,849.822,0,600,0z M600,261.987c105.116,0,190.356,85.241,190.356,190.356C790.356,557.46,705.116,642.7,600,642.7 s-190.356-85.24-190.356-190.356S494.884,261.987,600,261.987z"/> 
                </g>
            </svg>
        `;

        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style='width: 32px; height: 32px; display: flex; justify-content: center; align-items: center;'>${svgMarkup}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32], // Anchor point centered horizontally and at the bottom edge vertically to align correctly over map
            popupAnchor: [0, -32] // Popup point opens just above the marker
        });
    };

    function MapUpdater({ markers }) {
        const map = useMap();

        useEffect(() => {
            if (markers.length > 0) {
                const bounds = L.latLngBounds(markers.map((m) => [m.latitude, m.longitude]));
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
            }
        }, [markers, map]);

        return null;
    }

    return (
        <View style={styles.container}>
            <MapContainer
                center={INITIAL_CENTER}
                zoom={INITIAL_ZOOM}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers.map((marker) => (
                    <LeafletMarker
                        key={marker.id}
                        position={[marker.latitude, marker.longitude]}
                        icon={getIconByColor(marker.color)}
                    >
                        <Popup>
                            {marker.title}
                        </Popup>
                    </LeafletMarker>
                ))}
            </MapContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // In React Native Web, we need to ensure the container takes up space
        height: '100%',
        width: '100%',
    }
});
