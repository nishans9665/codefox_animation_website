import React, { useEffect, useRef, useState } from 'react';

const WebGLGlobe = () => {
    const containerRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const globeInstance = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const loadScript = async (src) => {
            return new Promise((resolve, reject) => {
                let script = document.querySelector(`script[src="${src}"]`);
                if (script) {
                    if (script.getAttribute('data-loaded') === 'true') {
                        resolve();
                    } else {
                        script.addEventListener('load', resolve);
                        script.addEventListener('error', reject);
                    }
                    return;
                }
                script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    script.setAttribute('data-loaded', 'true');
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const initGlobe = async () => {
            try {
                const baseUrl = import.meta.env.BASE_URL;

                await loadScript(`${baseUrl}globe/three.min.js`);
                await loadScript(`${baseUrl}globe/Detector.js`);
                await loadScript(`${baseUrl}globe/globe.js`);

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

                // Add simple rotation animation with idle detection
                const rotateGlobe = () => {
                    if (isMounted) {
                        // 2000ms (2 seconds) of idle time before auto-rotating
                        if (Date.now() - lastInteractionTime > 2000) {
                            if (globe.target) {
                                globe.target.x -= 0.0008;
                            }
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

        let lastInteractionTime = Date.now();
        const resetIdleTimer = () => { lastInteractionTime = Date.now(); };
        const containerElement = containerRef.current;

        if (containerElement) {
            containerElement.addEventListener('mousedown', resetIdleTimer);
            containerElement.addEventListener('mousemove', resetIdleTimer);
            containerElement.addEventListener('touchstart', resetIdleTimer, { passive: true });
            containerElement.addEventListener('touchmove', resetIdleTimer, { passive: true });
        }

        initGlobe();

        // Ensure we fix canvas rendering offsets by observing container size changes
        const resizeObserver = new ResizeObserver(() => {
            if (isMounted) {
                window.dispatchEvent(new Event('resize'));
            }
        });
        if (containerElement) {
            resizeObserver.observe(containerElement);
        }

        return () => {
            isMounted = false;
            resizeObserver.disconnect();
            if (containerElement) {
                containerElement.removeEventListener('mousedown', resetIdleTimer);
                containerElement.removeEventListener('mousemove', resetIdleTimer);
                containerElement.removeEventListener('touchstart', resetIdleTimer);
                containerElement.removeEventListener('touchmove', resetIdleTimer);
                containerElement.innerHTML = '';
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
            <div
                ref={containerRef}
                className="webgl-globe-container"
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                    cursor: 'move'
                }}
            />
            {!loaded && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, pointerEvents: 'none' }}>
                    Loading Interactive Globe...
                </div>
            )}
        </div>
    );
};

export default WebGLGlobe;  
