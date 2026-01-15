import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getBusinessDetailsList,
  deleteBusinessDetails,
} from '@/api/business-details/business-details.api';

export interface BusinessDetail {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  vatNumber?: string;
  companyRegistrationNumber?: string;
  identificationNumber?: string;
  country: string;
}

export function useBusinessDetailsList() {
  const router = useRouter();
  const [data, setData] = useState<BusinessDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (!token) {
        setIsLoading(false);
        toast.error('Authentication token not found');
        return;
      }
      try {
        setIsLoading(true);
        const offset = Math.max(0, (page - 1) * limit);
        const response = await getBusinessDetailsList({ token, offset, limit });
        let detailsList: BusinessDetail[] = [];
        if (response?.data?.results?.businessDetails) {
          detailsList = response.data.results.businessDetails;
        } else if (response?.data?.data?.results?.businessDetails) {
          detailsList = response.data.data.results.businessDetails;
        } else if (Array.isArray(response?.data?.results)) {
          detailsList = response.data.results;
        } else if (response?.data) {
          detailsList = [response.data];
        }
        setData(detailsList);
        let total = 0;
        const results =
          response?.data?.data?.results || response?.data?.results || {};
        total =
          results?.total ||
          results?.totalCount ||
          results?.totalRecords ||
          results?.count ||
          results?.recordsCount ||
          response?.data?.total ||
          response?.data?.totalCount ||
          response?.data?.recordsCount ||
          0;
        if (typeof total === 'number' && total > 0) {
          setTotalItems(total);
        } else if (Array.isArray(detailsList) && detailsList.length > 0) {
          setTotalItems((page - 1) * limit + detailsList.length);
        } else {
          setTotalItems(0);
        }
        setHasMore(
          Array.isArray(detailsList) ? detailsList.length >= limit : false
        );
      } catch (error: any) {
        console.error('Error fetching business details:', error);
        toast.error('Failed to load business details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinessDetails();
  }, [token, page]);

  const handleEdit = (id: string) => {
    router.push(`/profile/business-details/business-details-form?id=${id}`);
  };

  const handleDeleteClick = (id: string, companyName: string) => {
    setDeleteItemId(id);
    setDeleteItemName(companyName);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItemId || !token) return;
    try {
      setIsDeleting(true);
      const response = await deleteBusinessDetails({
        token,
        businessDetailsId: deleteItemId,
      });
      if (
        response?.data?.status === 'success' ||
        response?.status === 200
      ) {
        toast.success(
          `Business detail "${deleteItemName}" deleted successfully`
        );
        setData(data.filter((item) => item.id !== deleteItemId));
        setDeleteModalOpen(false);
        setDeleteItemId(null);
        setDeleteItemName('');
      } else {
        toast.error('Failed to delete business detail');
      }
    } catch (error: any) {
      console.error('Error deleting business detail:', error);
      toast.error('Error deleting business detail');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    data,
    isLoading,
    page,
    setPage,
    limit,
    totalItems,
    hasMore,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteItemId,
    deleteItemName,
    isDeleting,
    handleEdit,
    handleDeleteClick,
    confirmDelete,
  };
}
