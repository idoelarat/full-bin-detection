//import './App.css'
import MapHolder from './components/MapHolder'
import ResponsiveAppBar from './components/AppBar'

function App() {

  return (
    <>
    <ResponsiveAppBar/>
    <div className='content-wrapper'>
      <MapHolder/>
    </div>
    
    </>
  )
}

export default App
