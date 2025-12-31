export const backendApiEnums = {
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
    },
    CUSTOMERS: {
      ADD_CUSTOMER: '/customers/add',
      GET_CUSTOMER_LIST: '/customers/get',
      UPDATE_CUSTOMER: '/customers/update',
      GET_CUSTOMERS_LIST: '/customers/list',
      GET_CUSTOMER_BY_ID: '/customers/id',
      DELETE_CUSTOMER: '/customers/delete',
    },
    ITEMS: {
      ADD_ITEMS: '/items/add',
      UPDATE_ITEM: '/items/update',
      DELETE_ITEM: '/items/delete',
      GET_ITEMS_LIST: '/items/list',
      GET_ITEMS_BY_ID: '/items/id',
    },
    BANK_DETAILS: {
      ADD_BANK_DETAILS: '/bank-details/create',
      UPDATE_BANK_DETAILS: '/bank-details/update',
      BANK_DETAILS_LIST: '/bank-details/list',
      GET_BANK_DETAILS_BY_ID: '/bank-details/id',
      DELETE_BANK_DETAILS: '/bank-details/delete',
    },
    BUSINESS_DETAILS: {
      ADD_BUSINESS_DETAILS: '/business-details/add',
      BUSINESS_DETAILS_LIST: '/business-details/list',
      GET_BUSINESS_DETAILS_BY_ID: '/business-details/id',
      DELETE_BUSINESS_DETAILS: '/business-details/delete',
      UPDATE_BUSINESS_DETAILS: '/business-details/update',
    },
  },
  METHODS: {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
  },
};
