import React, { useState, useRef } from 'react';
import { parseCSV } from '../utils/csvParser';
import { useAttendees } from '../context/AttendeeContext';
import { CSVRow } from '../types';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './common/Button';
import Card from './common/Card';

const CSVUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addAttendees } = useAttendees();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await processFile(file);
  };

  const processFile = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Check if it's a CSV file
      if (!file.name.endsWith('.csv')) {
        throw new Error('Please upload a valid CSV file');
      }
      
      const parsedData = await parseCSV(file);
      
      if (parsedData.length === 0) {
        throw new Error('No valid entries found in the CSV file');
      }
      
      addAttendees(parsedData);
      setSuccess(`Successfully imported ${parsedData.length} attendees`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    await processFile(file);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card title="Import Attendees" className="max-w-xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Upload Attendee CSV</h3>
        <p className="text-gray-500 mb-4">
          Drag and drop your CSV file here, or click to browse
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".csv"
        />
        <Button
          variant="outline"
          onClick={openFileSelector}
          isLoading={isLoading}
          icon={<Upload size={16} />}
        >
          Browse Files
        </Button>
        <div className="mt-4 text-sm text-gray-500">
          CSV must include 'email' and 'name' columns
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
          <CheckCircle size={18} className="mr-2 flex-shrink-0" />
          {success}
        </div>
      )}
    </Card>
  );
};

export default CSVUploader;