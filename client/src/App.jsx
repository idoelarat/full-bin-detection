import MapHolder from './components/MapHolder'
import ResponsiveAppBar from './components/AppBar'

function App() {
  return (
    <>
      <ResponsiveAppBar />
      <div style={{ marginTop: '20px' }}>
        <MapHolder />
      </div>
    </>
  )
}

export default App