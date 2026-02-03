import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface DeleteCustomerDialogProps {
  open: boolean;
  customerName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  t: (key: string, params?: any) => string;
}

export const DeleteCustomerDialog = ({
  open,
  customerName,
  isDeleting,
  onClose,
  onConfirm,
  t,
}: DeleteCustomerDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('customers.confirmDeleteTitle')}</DialogTitle>
          <DialogDescription>
            {t('customers.confirmDeleteDesc', { name: customerName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isDeleting}
          >
            {t('profile.cancel')}
          </Button>
          <Button
            className='bg-red-600 hover:bg-red-700'
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner className='mr-2 h-4 w-4 text-white' />
                {t('profile.deleting')}
              </>
            ) : (
              t('customers.delete')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
