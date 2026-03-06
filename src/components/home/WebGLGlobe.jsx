import React, { useEffect, useRef, useState } from 'react';

const WebGLGlobe = () => {
    const containerRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const globeInstance = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const loadScript = async (src) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const initGlobe = async () => {
            try {
                const baseUrl = import.meta.env.BASE_URL;

                if (!window.THREE) {
                    await loadScript(`${baseUrl}globe/three.min.js`);
                    await loadScript(`${baseUrl}globe/Detector.js`);
                    await loadScript(`${baseUrl}globe/globe.js`);
                }

                if (!isMounted || !containerRef.current) return;

                if (window.Detector && !window.Detector.webgl) {
                    window.Detector.addGetWebGLMessage({ parent: containerRef.current });
                    return;
                }

                if (!window.DAT || !window.DAT.Globe) {
                    console.error("Globe scripts not loaded properly.");
                    return;
                }

                const globe = new window.DAT.Globe(containerRef.current, {
                    imgDir: `${baseUrl}globe/`
                });

                globeInstance.current = globe;

                const response = await fetch(`${baseUrl}globe/population909500.json`);
                const data = await response.json();

                if (!isMounted) return;

                for (let i = 0; i < data.length; i++) {
                    globe.addData(data[i][1], { format: 'magnitude', name: data[i][0], animated: true });
                }

                globe.createPoints();
                globe.time = 0;
                globe.animate();

                // Add simple rotation animation
                const rotateGlobe = () => {
                    if (isMounted) {
                        // The older globe uses target.x for rotation
                        if (globe.target) {
                            globe.target.x += 0.001;
                        }
                        requestAnimationFrame(rotateGlobe);
                    }
                };
                rotateGlobe();

                setLoaded(true);

            } catch (err) {
                console.error("Failed to initialize WebGL Globe:", err);
            }
        };

        initGlobe();

        return () => {
            isMounted = false;
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="webgl-globe-container"
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'move',
                zIndex: 2
            }}
        >
            {!loaded && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                    Loading Interactive Globe...
                </div>
            )}


        </div>
    );
};

export default WebGLGlobe;  
