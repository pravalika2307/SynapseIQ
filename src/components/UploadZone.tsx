import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelected,
  accept = '.csv,.xlsx',
  maxSizeMB = 10,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      alert(`File size exceeds limit of ${maxSizeMB}MB.`);
      return;
    }
    onFileSelected(file);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`
        w-full bg-[#151B23] border border-dashed rounded-2xl py-12 px-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none
        ${dragActive 
          ? 'border-[#83D18B] bg-[#83D18B]/5 scale-[1.01]' 
          : 'border-white/10 hover:border-white/20 hover:bg-white/[0.01]'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      
      <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:border-[#83D18B]/20">
        <UploadCloud size={20} className="text-white/30" />
      </div>

      <h3 className="text-15 font-semibold text-white/90 mb-1 font-sans tracking-tight">
        Drop your analytics spreadsheet
      </h3>
      <p className="text-12 text-white/40 mb-5 font-serif italic">
        or click to browse local files
      </p>

      <div className="flex gap-2">
        <span className="text-[10px] font-bold text-white/50 bg-[#0D1117] border border-white/5 rounded px-2.5 py-1 tracking-wider uppercase font-mono">
          CSV
        </span>
        <span className="text-[10px] font-bold text-white/50 bg-[#0D1117] border border-white/5 rounded px-2.5 py-1 tracking-wider uppercase font-mono">
          XLSX
        </span>
      </div>
    </div>
  );
};
