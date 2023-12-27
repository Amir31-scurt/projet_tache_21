import AuthContextProvider from './contexte/AuthContext';
import './App.css';
import { EmailProvider } from './contexte/EmailContexte';
import ProtectedRoutes from './pages/ProtectedRoutes';
export default function App() {
  return (
    <AuthContextProvider>
      <EmailProvider>
        <div className="">
          <ProtectedRoutes />
        </div>
      </EmailProvider>
    </AuthContextProvider>
  );
}
