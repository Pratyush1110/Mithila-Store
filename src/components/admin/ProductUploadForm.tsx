'use client';

import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import type { ProductCategory, ProductType } from '@/types';
import { useRouter } from 'next/navigation';

interface FormState {
  title:       string;
  price:       string;
  size:        string;
  description: string;
  story:       string;
  category:    ProductCategory;
  type:        ProductType;
  is_featured: boolean;
}

const INITIAL_FORM: FormState = {
  title:       '',
  price:       '',
  size:        '',
  description: '',
  story:       '',
  category:    'mithila_painting',
  type:        'ready_to_ship',
  is_featured: false,
};

function Toast({ message, kind }: { message: string; kind: 'success' | 'error' }) {
  return (
    <div style={{
      position:   'fixed',
      bottom:     '32px',
      right:      '32px',
      zIndex:     9999,
      background: kind === 'success' ? '#EAF3E9' : '#FEF2F2',
      border:     `1px solid ${kind === 'success' ? '#8CBF8A' : '#FCA5A5'}`,
      color:      kind === 'success' ? '#3B5E3A' : '#991B1B',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      fontSize:   '0.875rem',
      padding:    '12px 20px',
      maxWidth:   '320px',
      boxShadow:  '0 4px 16px rgba(0,0,0,0.08)',
    }}>
      {message}
    </div>
  );
}

function UploadBar({ progress }: { progress: number }) {
  return (
    <div style={{
      width:      '100%',
      height:     '3px',
      background: '#E8E4DC',
      marginTop:  '8px',
    }}>
      <div style={{
        height:     '100%',
        width:      `${progress}%`,
        background: '#C8A96E',
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}

function Label({ children, htmlFor, required }: { children: React.ReactNode; htmlFor: string; required?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display:       'block',
        fontFamily:    '"DM Sans", system-ui, sans-serif',
        fontSize:      '0.6875rem',
        fontWeight:    500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color:         '#7A7068',
        marginBottom:  '8px',
      }}
    >
      {children}
      {required && <span style={{ color: '#C8A96E', marginLeft: '4px' }}>*</span>}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width:       '100%',
  fontFamily:  '"DM Sans", system-ui, sans-serif',
  fontSize:    '0.9375rem',
  color:       '#1A1714',
  background:  '#FAFAF7',
  border:      '1px solid #E8E4DC',
  padding:     '11px 14px',
  outline:     'none',
  boxSizing:   'border-box',
  transition:  'border-color 0.2s',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance:          'none',
  backgroundImage:     `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B6057' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat:    'no-repeat',
  backgroundPosition:  'right 14px center',
  paddingRight:        '36px',
  cursor:              'pointer',
};

export default function ProductUploadForm() {
  const [form,          setForm]          = useState<FormState>(INITIAL_FORM);
  const [imageFiles,    setImageFiles]    = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading,     setUploading]     = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [toast,         setToast]         = useState<{ message: string; kind: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function showToast(message: string, kind: 'success' | 'error') {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 4000);
  }

  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const previews = files.map(f => URL.createObjectURL(f));
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...previews]);
  }

  function removeImage(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function uploadImages(): Promise<string[]> {
    if (!imageFiles.length) return [];
    setUploading(true);
    setUploadProgress(0);
    const publicUrls: string[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file      = imageFiles[i];
      const ext       = file.name.split('.').pop() ?? 'jpg';
      const filename  = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path      = `products/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { cacheControl: '31536000', upsert: false });

      if (uploadError) {
        setUploading(false);
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      publicUrls.push(urlData.publicUrl);
      setUploadProgress(Math.round(((i + 1) / imageFiles.length) * 100));
    }

    setUploading(false);
    return publicUrls;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) { showToast('Title is required.', 'error'); return; }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) { showToast('Enter a valid price.', 'error'); return; }

    setSubmitting(true);
    try {
      const imageUrls = await uploadImages();

      // ✅ SECURED: Submit product registration details via POST body to our endpoint
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title:       form.title.trim(),
          description: form.description.trim(),
          story:       form.story.trim() || null,
          price,
          size:        form.size.trim() || null,
          category:    form.category,
          type:        form.type,
          is_featured: form.is_featured,
          images:      imageUrls,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save product information.');
      }

      showToast('Product added successfully.', 'success');
      
      router.push('/admin/products');
      router.refresh();
      
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Something went wrong.', 'error');
      setSubmitting(false);
    } 
  }

  const isWorking = uploading || submitting;

  return (
    <>
      {toast && <Toast message={toast.message} kind={toast.kind} />}

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          background:  '#FAFAF7',
          border:      '1px solid #E8E4DC',
          padding:     '40px 48px',
          maxWidth:    '760px',
        }}
      >
        <fieldset style={{ border: 'none', margin: 0, padding: 0, marginBottom: '40px' }}>
          <legend style={{
            fontFamily:    '"Playfair Display", Georgia, serif',
            fontSize:      '1.125rem',
            fontWeight:    600,
            color:         '#1A1714',
            marginBottom:  '28px',
            paddingBottom: '12px',
            borderBottom:  '1px solid #E8E4DC',
            width:         '100%',
            display:       'block',
          }}>
            Piece Details
          </legend>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Label htmlFor="title" required>Title</Label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleFieldChange}
                placeholder="e.g. Ganesha on Handmade Paper"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <Label htmlFor="price" required>Price (INR ₹)</Label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position:   'absolute',
                  left:       '14px',
                  top:        '50%',
                  transform:  'translateY(-50%)',
                  fontFamily: '"DM Sans"',
                  fontSize:   '0.9375rem',
                  color:      '#9B9187',
                }}>₹</span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  value={form.price}
                  onChange={handleFieldChange}
                  placeholder="4500"
                  required
                  style={{ ...inputStyle, paddingLeft: '28px' }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="size">Size</Label>
              <input
                id="size"
                name="size"
                type="text"
                value={form.size}
                onChange={handleFieldChange}
                placeholder="e.g. 22 × 30 inches"
                style={inputStyle}
              />
            </div>

            <div>
              <Label htmlFor="category" required>Category</Label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleFieldChange}
                style={selectStyle}
              >
                <option value="mithila_painting">Mithila Painting</option>
                <option value="knitting">Knitting</option>
              </select>
            </div>

            <div>
              <Label htmlFor="type" required>Availability</Label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleFieldChange}
                style={selectStyle}
              >
                <option value="ready_to_ship">Ready to Ship</option>
                <option value="made_to_order">Made to Order</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleFieldChange}
                rows={3}
                placeholder="A concise description shown on the product card and listing page."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.65' }}
              />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: 'none', margin: 0, padding: 0, marginBottom: '40px' }}>
          <legend style={{
            fontFamily:    '"Playfair Display", Georgia, serif',
            fontSize:      '1.125rem',
            fontWeight:    600,
            color:         '#1A1714',
            marginBottom:  '8px',
            paddingBottom: '12px',
            borderBottom:  '1px solid #E8E4DC',
            width:         '100%',
            display:       'block',
          }}>
            The Story Behind the Art
          </legend>
          <p style={{
            fontFamily:   '"DM Sans", system-ui, sans-serif',
            fontSize:     '0.875rem',
            color:        '#9B9187',
            marginBottom: '20px',
            lineHeight:   '1.6',
          }}>
            Describe the motifs, their cultural meaning, and the intention held while painting. This appears as a pull-quote on the product page.
          </p>
          <textarea
            id="story"
            name="story"
            value={form.story}
            onChange={handleFieldChange}
            rows={6}
            placeholder="The fish in Mithila tradition symbolises fertility and abundance — the original sacred creature of the River Kamala. Here, seven fish circle the central lotus in the Saptarishi pattern, invoking protection for the household that receives this piece…"
            style={{
              ...inputStyle,
              resize:      'vertical',
              lineHeight:  '1.75',
              fontFamily:  '"Playfair Display", Georgia, serif',
              fontSize:    '0.9375rem',
              fontStyle:   'italic',
              color:       '#4A3F36',
              minHeight:   '140px',
            }}
          />
        </fieldset>

        <fieldset style={{ border: 'none', margin: 0, padding: 0, marginBottom: '40px' }}>
          <legend style={{
            fontFamily:    '"Playfair Display", Georgia, serif',
            fontSize:      '1.125rem',
            fontWeight:    600,
            color:         '#1A1714',
            marginBottom:  '20px',
            paddingBottom: '12px',
            borderBottom:  '1px solid #E8E4DC',
            width:         '100%',
            display:       'block',
          }}>
            Images
          </legend>

          <div
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
            aria-label="Choose image files to upload"
            style={{
              border:        '1.5px dashed #C8A96E',
              padding:       '32px 24px',
              textAlign:     'center',
              cursor:        'pointer',
              background:    '#FAF8F4',
              marginBottom:  '20px',
              transition:    'background 0.2s',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px', display: 'block' }} aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p style={{ fontFamily: '"DM Sans"', fontSize: '0.875rem', color: '#6B6057', margin: '0 0 4px' }}>
              Click to select images
            </p>
            <p style={{ fontFamily: '"DM Sans"', fontSize: '0.75rem', color: '#9B9187', margin: 0 }}>
              JPG, PNG, WebP — multiple files allowed
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-hidden="true"
          />

          {uploading && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontFamily: '"DM Sans"', fontSize: '0.8125rem', color: '#9B9187', margin: '0 0 4px' }}>
                Uploading images… {uploadProgress}%
              </p>
              <UploadBar progress={uploadProgress} />
            </div>
          )}

          {imagePreviews.length > 0 && (
            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap:                 '12px',
            }}>
              {imagePreviews.map((src, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    style={{
                      width:      '100%',
                      aspectRatio: '1',
                      objectFit:  'cover',
                      border:     '1px solid #E8E4DC',
                      display:    'block',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label={`Remove image ${i + 1}`}
                    style={{
                      position:   'absolute',
                      top:        '4px',
                      right:      '4px',
                      width:      '22px',
                      height:     '22px',
                      borderRadius: '50%',
                      background: 'rgba(26,23,20,0.72)',
                      border:     'none',
                      color:      '#FAFAF7',
                      fontSize:   '0.75rem',
                      cursor:     'pointer',
                      display:    'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
          <button
            type="button"
            role="switch"
            aria-checked={form.is_featured}
            onClick={() => setForm(prev => ({ ...prev, is_featured: !prev.is_featured }))}
            style={{
              width:      '42px',
              height:     '24px',
              borderRadius: '12px',
              border:     'none',
              background: form.is_featured ? '#C8A96E' : '#E8E4DC',
              cursor:     'pointer',
              position:   'relative',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
            aria-label="Feature this product on the homepage"
          >
            <span style={{
              position:   'absolute',
              top:        '3px',
              left:       form.is_featured ? '21px' : '3px',
              width:      '18px',
              height:     '18px',
              borderRadius: '50%',
              background: '#FAFAF7',
              boxShadow:  '0 1px 4px rgba(0,0,0,0.18)',
              transition: 'left 0.2s',
              display:    'block',
            }} />
          </button>
          <span style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize:   '0.875rem',
            color:      '#1A1714',
          }}>
            Feature on homepage
          </span>
        </div>

        <button
          type="submit"
          disabled={isWorking}
          style={{
            fontFamily:   '"DM Sans", system-ui, sans-serif',
            fontSize:     '0.9375rem',
            fontWeight:   500,
            color:        '#FAFAF7',
            background:   isWorking ? '#9B9187' : '#1A1714',
            border:       'none',
            padding:      '14px 40px',
            cursor:       isWorking ? 'not-allowed' : 'pointer',
            letterSpacing: '0.02em',
            transition:   'background 0.2s',
            display:      'flex',
            alignItems:   'center',
            gap:          '10px',
          }}
        >
          {isWorking && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }} aria-hidden="true">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          )}
          {submitting ? 'Saving piece…' : uploading ? 'Uploading images…' : 'Add to Inventory'}
        </button>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          input:focus, textarea:focus, select:focus { border-color: #C8A96E; box-shadow: 0 0 0 3px rgba(200,169,110,0.12); }
        `}</style>
      </form>
    </>
  );
}