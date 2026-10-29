import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 print:block print:h-auto">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 print:overflow-visible print:p-0">
        <Outlet />
      </main>
    </div>
  );
}