// Dashboard-related types

export interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  pendingPayments: number;
  overdueInvoices: number;
}

export interface DashboardStatsProps {
  duration: string;
}

export interface InvoiceChartData {
  date: string;
  count: number;
  revenue: number;
}

export interface InvoiceChartProps {
  duration: string;
}
