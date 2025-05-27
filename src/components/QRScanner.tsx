import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerId = 'qr-reader';

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: 250,
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      defaultZoomValueIfSupported: 2,
      formatsToSupport: [0], // QR_CODE format
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
    };

    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner(containerId, config, false);
      scanner.render(
        (decodedText) => {
          console.log('✅ QR Code Scanned:', decodedText);
          onScan(decodedText);
          scanner.pause();
        },
        (error) => {
          if (!error?.includes('No QR code found')) {
            console.warn('❌ Scan error:', error);
          }
        }
      );
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [onScan]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id={containerId} className="rounded-lg overflow-hidden shadow-lg" />
    </div>
  );
};

export default QRScanner;