import Navbar from './components/navbar'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import NewProject from './pages/NewProject'

function App() {
  return (
    <>
    <div className='w-full min-w-[350px]'>
      <Navbar/>
      <Dashboard/>
      {/* <LandingPage/> */}
    </div>
    </>
  )
}

export default App
