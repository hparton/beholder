import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { LifeTracker } from './components/LifeTracker/LifeTracker'
import { CommanderDamageProvider } from './context/CommanderDamageContext'
import { PlayersProvider } from './context/PlayersContext'

function App() {
  const [startingLife, setStartingLife] = useState(40)
  const [gameStarted, setGameStarted] = useState(false);
  

  return (
    <>
    {!gameStarted ? (
      <>
      <p>Start er up</p>
      <p>Starting life: {startingLife}</p>
      <input type="range" min="20" max="60" value={startingLife} onChange={(e) => setStartingLife(parseInt(e.target.value))} />
      <button onClick={() => setGameStarted(true)}>Start Game</button>
      </>
      ) : (

    <PlayersProvider>
      <CommanderDamageProvider>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr ', gap: '1rem', width: '100vw', height: '100vh', padding: "1rem", boxSizing: 'border-box', zIndex: 99}}>
          <LifeTracker flipped={true}player='Garry' initialLife={startingLife} />
          <LifeTracker flipped={true}player='Luke' initialLife={startingLife} />
          <LifeTracker  player='Niel' initialLife={startingLife} />
          <LifeTracker  player='Mike' initialLife={startingLife} />
        </div>
        <button onClick={() => setGameStarted(false)} style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>End</button>
      </CommanderDamageProvider>
      </PlayersProvider>
      )}

    </>
  )
}

export default App
