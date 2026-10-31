import EnConstruction from '../components/common/EnConstruction';
import { useAuth } from '../hooks/useAuth';
import DashboardPage from './DashboardPage';

export default function HomePage() {
  const { user } = useAuth();

  if (user === null) {
    return null;
  }

  switch (user.role) {
    case 'admin':
      return <DashboardPage />;
    case 'technicien':
      return (
        <EnConstruction
          titre="Tableau de bord"
          message="Votre tableau de bord personnel arrive bientôt. En attendant, vous pouvez consulter les tickets et la base de connaissances."
        />
      );
    case 'demandeur':
      return (
        <EnConstruction
          titre="Accueil"
          message="Votre espace support arrive bientôt. En attendant, vous pouvez suivre vos tickets et consulter l'aide."
        />
      );
  }
}