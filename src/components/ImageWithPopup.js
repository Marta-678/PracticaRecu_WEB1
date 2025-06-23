import React, { useState } from 'react';
import Image from 'next/image';

function ImageWithPopup({ src, alt, children, toggleOnClick = true, closeButtonLabel = 'Cerrar' }) {
  const [open, setOpen] = useState(false);

  const handleImageClick = () => {
    if (toggleOnClick) {
      setOpen(prev => !prev);
    } else if (!open) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Image
        src={src}
        alt={alt}
        onClick={handleImageClick}
        // style={{ cursor: 'pointer' }}
        width={20}              // ancho real o deseado
        height={10}             // alto real o deseado
      />
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
          }}
        >
          {/* Botón de cierre */}
          <button onClick={handleClose}>
            {closeButtonLabel}
          </button>
          {children}
        </div>
      )}
    </div>
  );
}

export default ImageWithPopup;
