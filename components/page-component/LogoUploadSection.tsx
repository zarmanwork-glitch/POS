import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface LogoUploadSectionProps {
  logoPreview: string;
  setLogoPreview: (preview: string) => void;
  t: ReturnType<typeof useTranslation>[0];
}

export const LogoUploadSection = ({
  logoPreview,
  setLogoPreview,
  t,
}: LogoUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <Card
      className='border-2 border-dashed border-gray-300 h-full rounded-md flex items-center justify-center p-6 bg-blue-50 hover:border-blue-400 transition-colors'
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <label className='w-full h-full flex flex-col items-center justify-center cursor-pointer gap-3'>
        {logoPreview ? (
          <div className='w-full flex flex-col items-center gap-2'>
            <Image
              src={logoPreview}
              alt={t('invoices.form.logoPreviewAlt')}
              width={160}
              height={160}
              className='w-auto h-auto max-w-40 max-h-40 object-contain'
            />
            <button
              type='button'
              className='text-xs text-blue-600 hover:text-blue-800 mt-2'
              onClick={(e) => {
                e.preventDefault();
                setLogoPreview('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              {t('invoices.form.removeLogo')}
            </button>
          </div>
        ) : (
          <>
            <div className='text-2xl font-bold text-gray-300'>
              {t('invoices.form.logoLabel')}
            </div>
            <Upload className='h-6 w-6 text-gray-400' />
            <p className='text-center text-gray-400 text-sm'>
              {t('invoices.form.dragDropLogo')}
            </p>
          </>
        )}
        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          onChange={handleLogoChange}
          className='hidden'
        />
      </label>
    </Card>
  );
};
