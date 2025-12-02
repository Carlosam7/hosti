import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar';
import AppRoutes from './routes/AppRoutes.tsx';
import './App.css';
import NewProject from './pages/NewProject.tsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col bg-white">
          {/* <NewProject />  */}
          <div className="">
            <AppRoutes />
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
