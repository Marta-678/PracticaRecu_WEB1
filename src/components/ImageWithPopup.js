import React, { useState } from 'react';

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
      <img
        src={src}
        alt={alt}
        onClick={handleImageClick}
        style={{ cursor: 'pointer' }}
      />
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            // Sin estilos adicionales por ahora
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
