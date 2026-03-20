import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

const WebGLGlobe = () => {
    const containerRef = useRef(null);
    const globeEl = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [arcsData, setArcsData] = useState([]);
    const [pointsData, setPointsData] = useState([]);
    const [ringsData, setRingsData] = useState([]);
    const [countries, setCountries] = useState({ features: [] });

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(console.error);

        const cities = [
            { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
            { lat: 40.7128, lng: -74.0060, name: 'New York' },
            { lat: 51.5074, lng: -0.1278, name: 'London' },
            { lat: 48.8566, lng: 2.3522, name: 'Paris' },
            { lat: 52.5200, lng: 13.4050, name: 'Berlin' },
            { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
            { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
            { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
            { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
            { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
            { lat: -23.5505, lng: -46.6333, name: 'Sao Paulo' },
            { lat: 19.4326, lng: -99.1332, name: 'Mexico City' },
            { lat: -34.6037, lng: -58.3816, name: 'Buenos Aires' },
            { lat: 39.9042, lng: 116.4074, name: 'Beijing' },
            { lat: 55.7558, lng: 37.6173, name: 'Moscow' },
            { lat: -1.2921, lng: 36.8219, name: 'Nairobi' },
            { lat: -26.2041, lng: 28.0473, name: 'Johannesburg' },
            { lat: 30.0444, lng: 31.2357, name: 'Cairo' },
            { lat: 43.6532, lng: -79.3832, name: 'Toronto' }
        ];

        const hubs = cities.filter(c => ['New York', 'London', 'Tokyo', 'Singapore', 'San Francisco', 'Dubai', 'Sydney', 'Sao Paulo'].includes(c.name));

        const generateData = () => {
            const arcs = [];
            const points = [];
            const rings = [];

            cities.forEach(city => {
                const isHub = hubs.some(h => h.name === city.name);
                // Made the dots slightly smaller and more delicate for a premium tech feel
                points.push({ lat: city.lat, lng: city.lng, size: isHub ? 0.7 : 0.25, color: '#ffffff' });
                // Tighter logic for the ripples
                rings.push({ lat: city.lat, lng: city.lng, maxRadius: isHub ? 3.5 : 1.5 });
            });

            const numConnections = 35;
            for (let i = 0; i < numConnections; i++) {
                const startHub = hubs[Math.floor(Math.random() * hubs.length)];
                let destCity;
                do {
                    destCity = cities[Math.floor(Math.random() * cities.length)];
                } while (destCity.name === startHub.name);

                // REFINED ARC COLORS: Fading orange smoothly into pure transparent logic 
                // avoiding any muddy blue color mix! This makes lines look like pure fiber optics.
                const vibrantColors = [
                    ['rgba(255, 123, 0, 0.95)', 'rgba(255, 123, 0, 0.05)'], 
                    ['rgba(255, 180, 0, 0.85)', 'rgba(255, 123, 0, 0.05)'],
                ];

                arcs.push({
                    startLat: startHub.lat,
                    startLng: startHub.lng,
                    endLat: destCity.lat,
                    endLng: destCity.lng,
                    color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
                    altitude: Math.random() * 0.25 + 0.1
                });
            }

            return { arcs, points, rings };
        };

        const data = generateData();
        setArcsData(data.arcs);
        setPointsData(data.points);
        setRingsData(data.rings);
    }, []);

    useEffect(() => {
        if (globeEl.current && dimensions.width > 0) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 1.0;
            globeEl.current.controls().enableZoom = false;

            globeEl.current.pointOfView({ altitude: 8.0 });

            setTimeout(() => {
                globeEl.current.pointOfView({ altitude: 2.2 }, 3500);
            }, 300);

            // Removing the 3D starfield because you already added the beautiful CSS stars to Hero.jsx!
            // Having both would double the stars and hurt performance.
        }
    }, [dimensions]);

    // Using earth-night instead of earth-dark gives us the gorgeous city lights back
    // which pairs incredibly well with the translucent orange country overlay!
    const globeImageUrl = '//unpkg.com/three-globe/example/img/earth-night.jpg';
    const bumpImageUrl = '//unpkg.com/three-globe/example/img/earth-topology.png';

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                zIndex: 2,
                background: 'transparent'
            }}
        >
            {dimensions.width > 0 && dimensions.height > 0 && (
                <div
                    className="webgl-globe-container"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'visible',
                        cursor: 'grab'
                    }}
                >
                    <Globe
                        ref={globeEl}
                        width={dimensions.width}
                        height={dimensions.height}
                        globeImageUrl={globeImageUrl}
                        bumpImageUrl={bumpImageUrl}
                        backgroundColor="rgba(0,0,0,0)"
                        // Changed the atmosphere glow to a pure, polished CodeFox brand orange
                        atmosphereColor="rgba(255, 123, 0, 0.5)" 
                        atmosphereAltitude={0.2}

                        polygonsData={countries.features}
                        polygonAltitude={0.012}
                        // Made the orange transparent! Now the city lights will beautifully shine THROUGH the orange
                        polygonCapColor={() => 'rgba(63, 44, 0, 0.5)'} 
                        polygonSideColor={() => 'rgba(201, 197, 197, 0.05)'}
                        // Thinner, much more elegant border! Translucent neon orange.
                        polygonStrokeColor={() => 'rgba(255, 123, 0, 0.4)'} 

                        arcsData={arcsData}
                        arcColor="color"
                        arcDashLength={0.5}
                        arcDashGap={0.2}
                        arcDashInitialGap={() => Math.random()}
                        arcDashAnimateTime={2000}
                        arcStroke={0.4} // Thinned out the arcs slightly for an elegant look

                        pointsData={pointsData}
                        pointColor="color"
                        pointAltitude={0.015}
                        pointRadius="size"

                        ringsData={ringsData}
                        ringColor={() => '#FF7B00'}
                        ringMaxRadius="maxRadius"
                        ringPropagationSpeed={2.5}
                        ringRepeatPeriod={800}
                    />
                </div>
            )}
        </div>
    );
};

export default WebGLGlobe;
