import Navbar from './components/navbar'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import NewProject from './pages/NewProject'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
    <div className='flex justify-center w-full h-screen min-w-[350px]'>
      <AppRoutes/>
      {/* <Navbar/> */}
      {/* <Dashboard/> */}
      {/* <LandingPage/> */}
      {/* <NewProject/> */}
    </div>
    </>
  )
}

export default App