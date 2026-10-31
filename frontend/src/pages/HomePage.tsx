import EnConstruction from '../components/common/EnConstruction';
import { useAuth } from '../hooks/useAuth';
import DashboardPage from './DashboardPage';
import DashboardTechnicienPage from './DashboardTechnicienPage';

export default function HomePage() {
  const { user } = useAuth();

  if (user === null) {
    return null;
  }

  switch (user.role) {
    case 'admin':
      return <DashboardPage />;
    case 'technicien':
      return <DashboardTechnicienPage />;
    case 'demandeur':
      return (
        <EnConstruction
          titre="Accueil"
          message="Votre espace support arrive bientôt. En attendant, vous pouvez suivre vos tickets et consulter l'aide."
        />
      );
  }
}