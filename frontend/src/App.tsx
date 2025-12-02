import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar';
import AppRoutes from './routes/AppRoutes.tsx';
import './App.css';
import NewProject from './pages/NewProject.tsx';

function App() {
  return (
<<<<<<< HEAD
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
=======
    <>
    <div className='flex justify-center w-full min-w-[350px]'>
      <Navbar/>
      {/* <Dashboard/> */}
      <LandingPage/>
      {/* <NewProject/> */}
    </div>
    </>
  )
}

export default App
>>>>>>> c3ed765d35e3bfbbb3944b3fdcfb05e6ac11bbce
