import { useState } from 'react';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { Copy, Upload } from 'lucide-react';

interface MediaItem { url: string; name: string; uploadedAt: string; }

export function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const url = await uploadToCloudinary(file);
        setItems(prev => [{ url, name: file.name, uploadedAt: new Date().toLocaleTimeString() }, ...prev]);
      } catch { alert('Upload failed: ' + file.name); }
    }
    setUploading(false);
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{fontFamily:'Syne,sans-serif',color:'#111111'}}>Media Library</h1>
      <div
        className="rounded-xl border-2 border-dashed p-8 text-center mb-6"
        style={{borderColor:'#C8B89A',background:'#F3F1EC'}}
        onDrop={e=>{e.preventDefault();if(e.dataTransfer.files.length)handleFiles(e.dataTransfer.files);}}
        onDragOver={e=>e.preventDefault()}
      >
        <Upload size={32} className="mx-auto mb-3" style={{color:'#C8B89A'}} />
        <p className="font-semibold mb-2" style={{color:'#111'}}>Drag and drop images here</p>
        <p className="text-sm mb-4" style={{color:'#666'}}>Or click to browse from file explorer</p>
        <label className="cursor-pointer px-6 py-2 rounded-lg font-semibold text-sm inline-block" style={{background:'#111111',color:'#F3F1EC'}}>
          {uploading ? 'Uploading...' : 'Choose Files'}
          <input type="file" multiple accept="image/*" className="hidden" onChange={e=>{if(e.target.files)handleFiles(e.target.files);}} disabled={uploading} />
        </label>
      </div>
      {items.length > 0 && (
        <div className="grid gap-3" style={{gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))'}}>
          {items.map((item,i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-sm" style={{background:'#fff'}}>
              <img src={item.url} alt={item.name} className="w-full h-36 object-cover" />
              <div className="p-2">
                <p className="text-xs truncate mb-1" style={{color:'#666'}}>{item.name}</p>
                <button onClick={()=>copy(item.url)} className="flex items-center gap-1 text-xs w-full justify-center py-1 rounded" style={{background:'#F3F1EC',color:'#111'}}>
                  <Copy size={11}/> {copied===item.url ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {items.length === 0 && !uploading && (
        <p className="text-center text-sm" style={{color:'#999'}}>No images uploaded yet in this session. Upload images to get their Cloudinary URLs.</p>
      )}
    </div>
  );
}
