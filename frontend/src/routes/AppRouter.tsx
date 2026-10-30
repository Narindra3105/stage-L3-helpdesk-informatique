import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import TicketsPage from '../pages/TicketsPage';
import TicketDetailPage from '../pages/TicketDetailPage';
import NouveauTicketPage from '../pages/NouveauTicketPage';
import ArticlesPage from '../pages/ArticlesPage';
import ArticleDetailPage from '../pages/ArticleDetailPage';
import ArticleEditorPage from '../pages/ArticleEditorPage';
import TechniciensPage from '../pages/TechniciensPage';
import UtilisateursPage from '../pages/UtilisateursPage';
import RapportsSlaPage from '../pages/RapportsSlaPage';
import ParametresPage from '../pages/ParametresPage';

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
            <Route path="/base-connaissances" element={<ArticlesPage />} />
            <Route path="/base-connaissances/:id" element={<ArticleDetailPage />} />
            <Route element={<ProtectedRoute roles={['admin', 'technicien']} />}>
              <Route path="/base-connaissances/nouveau" element={<ArticleEditorPage />} />
              <Route path="/base-connaissances/:id/modifier" element={<ArticleEditorPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/techniciens" element={<TechniciensPage />} />
              <Route path="/utilisateurs" element={<UtilisateursPage />} />
              <Route path="/rapports-sla" element={<RapportsSlaPage />} />
              <Route path="/parametres" element={<ParametresPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}