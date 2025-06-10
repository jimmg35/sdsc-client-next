'use client';

import { useEffect, useState } from 'react';

const images = [
  '/img/welcome-banner/banner-1.jpg',
  '/img/welcome-banner/banner-2.jpg',
  '/img/welcome-banner/banner-3.jpg',
  '/img/welcome-banner/banner-4.jpg'
];

const SlideShow = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            animation: index === currentImage ? 'zoomIn 5s ease-in-out' : ''
          }}
        ></div>
      ))}
      <style jsx>{`
        @keyframes zoomIn {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default SlideShow;
