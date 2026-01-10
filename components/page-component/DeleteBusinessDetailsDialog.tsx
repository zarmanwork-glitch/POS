import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import React from 'react';

interface DeleteBusinessDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isDeleting: boolean;
  deleteItemName: string;
  confirmDelete: () => void;
  t: any;
}

export const DeleteBusinessDetailsDialog: React.FC<
  DeleteBusinessDetailsDialogProps
> = ({ open, setOpen, isDeleting, deleteItemName, confirmDelete, t }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('profile.confirmDelete', { defaultValue: 'Confirm Delete' })}
          </DialogTitle>
          <DialogDescription>
            {t('profile.areYouSureDelete', {
              defaultValue:
                'Are you sure you want to delete the business detail for',
            })}{' '}
            <strong>{deleteItemName}</strong>?
            <br />
            {t('profile.actionCannotBeUndone', {
              defaultValue: 'This action cannot be undone.',
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 mt-4'>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            {t('profile.cancel')}
          </Button>
          <Button
            className='bg-red-600 hover:bg-red-700'
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting
              ? t('profile.deleting', { defaultValue: 'Deleting...' })
              : t('profile.delete', { defaultValue: 'Delete' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
