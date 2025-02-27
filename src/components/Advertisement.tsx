import React, { useEffect } from 'react';

interface AdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  layout?: 'in-article' | 'display';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const Advertisement: React.FC<AdProps> = ({ slot, format = 'auto', layout = 'display', className = '' }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Ad error:', err);
    }
  }, []);

  // Add placeholder image while ads are not live
  const placeholderStyle = {
    width: format === 'vertical' ? '160px' : '100%',
    height: format === 'vertical' ? '600px' : '120px',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    fontSize: '0.875rem',
    border: '2px dashed #d1d5db',
    borderRadius: '0.75rem',
    flexDirection: format === 'vertical' ? 'column' : 'row',
    textAlign: 'center',
    padding: '1rem',
  } as const;

  return (
    <div className={`ad-container ${format === 'vertical' ? 'vertical' : ''} ${className}`}>
      {process.env.NODE_ENV === 'development' ? (
        <div style={placeholderStyle}>
          <div>Advertisement</div>
          <div>({format})</div>
          <div>Slot: {slot}</div>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your AdSense publisher ID
          data-ad-slot={slot}
          data-ad-format={format}
          data-ad-layout={layout}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}; 