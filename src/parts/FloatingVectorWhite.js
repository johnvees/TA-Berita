import React, { useEffect, useState } from 'react';
import VectorLeft from '../assets/images/vectorleftwhite.png';
import VectorRight from '../assets/images/vectorrightwhite.png';

export default function FloatingVectorWhite() {
  const [topPosition, setTopPosition] = useState(200);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const componentHeight =
        document.querySelector('.float-component').offsetHeight;
      const maxTopPosition = windowHeight - componentHeight - 80;
      const targetTopPosition = Math.max(
        80,
        Math.min(
          scrollTop + windowHeight / 2 - componentHeight / 2,
          maxTopPosition
        )
      );
      setTopPosition(targetTopPosition);
    };

    let ticking = false; // To throttle scroll event
    const updatePosition = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  return (
    <div
      className="float-component d-none d-md-block"
      style={{ top: `${topPosition}px` }}
    >
      <img className="vector vector-left" src={VectorLeft} alt="" />
      <img className="vector vector-right" src={VectorRight} alt="" />
    </div>
  );
}
