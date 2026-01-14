import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from 'react-i18next';

interface PDFPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loadingPreview: boolean;
  previewUrl: string | null;
}

export default function PDFPreviewModal({
  open,
  onOpenChange,
  loadingPreview,
  previewUrl,
}: PDFPreviewModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='DialogContent'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            {t('invoices.pdfPreview', { defaultValue: 'Invoice Preview' })}
          </DialogTitle>
        </DialogHeader>
        <div className='flex-1 w-full h-[calc(90vh-80px)] overflow-hidden'>
          {loadingPreview ? (
            <div className='flex flex-col items-center justify-center h-full gap-4'>
              <Spinner className='h-12 w-12' />
              <p className='text-gray-600'>
                {t('invoices.loadingPreview', {
                  defaultValue: 'Loading preview...',
                })}
              </p>
            </div>
          ) : previewUrl ? (
            <iframe
              src={previewUrl}
              className='w-full h-full border-0 rounded'
              title='Invoice Preview'
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
