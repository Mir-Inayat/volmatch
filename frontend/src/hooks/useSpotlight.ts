import { useState, useEffect } from 'react';

export const useSpotlight = (initialX = 50, initialY = 50) => {
  const [mousePosition, setMousePosition] = useState({ x: initialX, y: initialY });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const getGradientStyle = (x: number, y: number) => ({
    background: `
      radial-gradient(
        circle at ${x}% ${y}%, 
        rgb(30, 64, 175) 0%, 
        rgba(30, 58, 138, 0.9) 20%, 
        rgba(23, 37, 84, 0.8) 40%, 
        rgba(15, 23, 42, 0.9) 60%, 
        rgb(15, 23, 42) 80%
      ),
      linear-gradient(
        45deg, 
        rgb(30, 58, 138) 0%, 
        rgb(23, 37, 84) 50%, 
        rgb(15, 23, 42) 100%
      )
    `
  });

  const initialGradientStyle = getGradientStyle(initialX, initialY);

  return { mousePosition, getGradientStyle, initialGradientStyle };
}; 