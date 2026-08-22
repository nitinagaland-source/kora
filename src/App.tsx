import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AdminLayout } from './admin/AdminLayout';
import { AdminGuard } from './admin/AdminGuard';
import { LoginPage } from './admin/pages/LoginPage';
import { DashboardPage } from './admin/pages/DashboardPage';
import { ProductsPage } from './admin/pages/ProductsPage';
import { CategoriesPage } from './admin/pages/CategoriesPage';
import { CollectionsPage } from './admin/pages/CollectionsPage';
import { OrdersPage } from './admin/pages/OrdersPage';
import { CustomersPage } from './admin/pages/CustomersPage';
import { HomepageStudioPage } from './admin/pages/HomepageStudioPage';
import { ReviewsPage } from './admin/pages/ReviewsPage';
import { AnalyticsPage } from './admin/pages/AnalyticsPage';
import { MarketingPage } from './admin/pages/MarketingPage';
import { MediaLibraryPage } from './admin/pages/MediaLibraryPage';
import { SettingsPage } from './admin/pages/SettingsPage';
import { AuditLogPage } from './admin/pages/AuditLogPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="homepage" element={<HomepageStudioPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="marketing" element={<MarketingPage />} />
            <Route path="media" element={<MediaLibraryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="audit" element={<AuditLogPage />} />
          </Route>
          <Route path="*" element={<div style={{padding:40,fontFamily:'Syne,sans-serif'}}>Storefront coming soon</div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
