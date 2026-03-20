import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';

const PlanetDecor = ({ 
    globeImageUrl = '//unpkg.com/three-globe/example/img/earth-dark.jpg', 
    atmosphereColor = 'rgba(255, 123, 0, 0.4)', 
    size = 400, 
    position = { right: '-150px', top: '20%' },
    delay = 0 
}) => {
    const globeEl = useRef(null);

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.controls().enableZoom = false;
            globeEl.current.pointOfView({ altitude: 2.0 });
        }
    }, []);

    return (
        <div style={{
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            ...position,
            opacity: 0.7,
            zIndex: 0,
            pointerEvents: 'none',
            animation: `float 6s ease-in-out infinite`,
            animationDelay: `${delay}s`
        }}>
            <Globe
                ref={globeEl}
                width={size}
                height={size}
                globeImageUrl={globeImageUrl}
                backgroundColor="rgba(0,0,0,0)"
                showAtmosphere={true}
                atmosphereColor={atmosphereColor}
                atmosphereAltitude={0.25}
                // Stripped back for performance: No points, arcs, or heavy polygons!
            />
        </div>
    );
};

export default PlanetDecor;
