import { UploadCloud } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface UploadInputProps {
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
  selectedFile: File | null;
  helperText: string;
}

export default function UploadInput({ label, accept, onChange, selectedFile, helperText }: UploadInputProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-heading text-sm font-semibold col-white/80">{label}</label>
      
      <div className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
        selectedFile 
          ? 'border-[var(--color-secondary)]/40 bg-[var(--color-secondary)]/5' 
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}>
        <input 
          type="file" 
          accept={accept} 
          onChange={handleFileChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <UploadCloud className={`w-8 h-8 ${selectedFile ? 'col-secondary' : 'col-white/40'}`} />
        
        <span className="font-sans-serif text-sm col-white font-medium text-center px-4 line-clamp-1">
          {selectedFile ? selectedFile.name : 'Clique para selecionar ou arraste o arquivo'}
        </span>
        
        <span className="font-sans-serif text-xs col-white/40 text-center">
          {helperText}z
        </span>
      </div>
    </div>
  );
}