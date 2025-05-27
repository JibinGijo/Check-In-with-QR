import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import Card from '../components/common/Card';
import { Camera, AlertCircle } from 'lucide-react';

const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleScan = (decodedText: string) => {
    try {
      // Extract the encoded email from the URL
      const url = new URL(decodedText);
      const encodedEmail = url.pathname.split('/').pop();
      
      if (encodedEmail) {
        // Navigate to check-in page with the encoded email
        navigate(`/scan/${encodedEmail}`);
      } else {
        setError('Invalid QR code format');
      }
    } catch (err) {
      setError('Please scan a valid check-in QR code');
    }
  };

  return (
    <Card title="QR Code Scanner" className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center p-6">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Camera size={32} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Scan Attendee QR Code
        </h3>
        <p className="text-gray-600 mb-6 text-center">
          Position the QR code within the frame to check in the attendee
        </p>
        
        {error && (
          <div className="w-full max-w-md mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle size={20} className="flex-shrink-0 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="w-full">
          <QRScanner onScan={handleScan} />
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700 w-full max-w-md">
          <ul className="list-disc list-inside space-y-2">
            <li>Ensure good lighting for better scanning</li>
            <li>Hold the camera steady</li>
            <li>QR code should be clearly visible</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ScannerPage;