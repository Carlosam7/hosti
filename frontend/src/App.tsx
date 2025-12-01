import Navbar from './components/navbar'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import NewProject from './pages/NewProject'

function App() {
  return (
    <>
    <div className='flex justify-center w-full min-w-[350px]'>
      <Navbar/>
      {/* <Dashboard/> */}
      {/* <LandingPage/> */}
      <NewProject/>
    </div>
    </>
  )
}

export default App
