import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import TicketsPage from '../pages/TicketsPage';
import TicketDetailPage from '../pages/TicketDetailPage';
import NouveauTicketPage from '../pages/NouveauTicketPage';
import TechniciensPage from '../pages/TechniciensPage';
import RapportsSlaPage from '../pages/RapportsSlaPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/nouveau-ticket" element={<NouveauTicketPage />} />
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/techniciens" element={<TechniciensPage />} />
              <Route path="/rapports-sla" element={<RapportsSlaPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}