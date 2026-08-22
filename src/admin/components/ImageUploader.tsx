import { useRef, useState } from 'react';
import { uploadToCloudinary } from '../../lib/cloudinary';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

export function ImageUploader({ value, onChange, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');
    if (file.size > 10 * 1024 * 1024) { setError('File too large (max 10MB)'); return; }
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { setError('Invalid file type. Use JPG, PNG or WebP'); return; }
    setUploading(true);
    setProgress(10);
    try {
      const interval = setInterval(() => setProgress(p => Math.min(p + 10, 90)), 200);
      const url = await uploadToCloudinary(file);
      clearInterval(interval);
      setProgress(100);
      onChange(url);
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{color:'#111111'}}>{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed rounded-lg p-4 text-center"
        style={{borderColor:'#C8B89A', background:'#F3F1EC'}}
      >
        {value ? (
          <div className="relative inline-block">
            <img src={value} alt="preview" className="h-32 w-32 object-cover rounded-lg mx-auto" />
            <div className="mt-2 flex gap-2 justify-center">
              <button type="button" onClick={() => inputRef.current?.click()} className="text-xs px-3 py-1 rounded" style={{background:'#111111',color:'#F3F1EC'}}>Replace</button>
              <button type="button" onClick={() => { if(confirm('Remove image?')) onChange(''); }} className="text-xs px-3 py-1 rounded border" style={{borderColor:'#111111',color:'#111111'}}>Remove</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm mb-2" style={{color:'#666'}}>Drag & drop or click to upload</p>
            <button type="button" onClick={() => inputRef.current?.click()} className="text-sm px-4 py-2 rounded font-semibold" style={{background:'#111111',color:'#F3F1EC'}}>
              Upload Image
            </button>
          </div>
        )}
        {uploading && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full transition-all" style={{width:${progress}%,background:'#111111'}}></div>
            </div>
            <p className="text-xs mt-1">{progress}%</p>
          </div>
        )}
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => { const f = e.target.files?.[0]; if(f) handleFile(f); }} />
    </div>
  );
}
