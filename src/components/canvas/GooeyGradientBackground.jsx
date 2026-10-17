import React, { useEffect, useRef } from 'react';
import './GooeyGradientBackground.css';

/**
 * GooeyGradientBackground
 * 
 * A mesmerizing, interactive gooey liquid gradient background with animated blobs.
 * Features:
 * - Pure CSS animations for background blobs with distinct trajectories and durations
 * - SVG filter (feGaussianBlur + feColorMatrix) for the signature organic "gooey" liquid effect
 * - Interactive mouse-following blob with damped lerp physics
 * - Configurable themes ('vibrant' reference default or 'gold' luxury)
 */
export function GooeyGradientBackground({
  children,
  className = '',
  theme = 'vibrant',
}) {
  const interactiveRef = useRef(null);

  useEffect(() => {
    let curX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let curY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    let tgX = curX;
    let tgY = curY;
    let animId = null;

    const handleMouseMove = (event) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    const animate = () => {
      if (interactiveRef.current) {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, []);

  const themeClass = theme === 'vibrant' ? 'theme-vibrant' : '';

  return (
    <div className={`gooey-wrapper ${themeClass} ${className}`}>
      <div className="gradient-bg">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <filter id="goo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <div ref={interactiveRef} className="interactive"></div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default GooeyGradientBackground;
