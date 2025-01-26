import { useMemo, useState } from 'react'
import './App.css'
import { CommanderDamageProvider } from './context/CommanderDamageContext'
import { PlayersProvider } from './context/PlayersContext'
import { Game } from './views/Game'
import { v4 } from 'uuid'

function App() {
  const [startingLife, setStartingLife] = useState(40)
  const [playerCount, setPlayerCount] = useState(4)
  const [gameStarted, setGameStarted] = useState(false);
  

  const players = useMemo(() => {
    return Array.from({ length: playerCount }).map(() => {
        return {
            id: v4(),
        };
    });
  }, [playerCount])


  return (
    <>
    {!gameStarted ? (
      <>
      <p>Start er up</p>
      <p>Starting life: {startingLife}</p>
      <input type="range" min="20" max="60" value={startingLife} onChange={(e) => setStartingLife(parseInt(e.target.value))} />
      <p>Player count: {playerCount}</p>
      <input type="range" min="2" max="4" value={playerCount} onChange={(e) => setPlayerCount(parseInt(e.target.value))} />
      <div>
      <button onClick={() => setGameStarted(true)}>Start Game</button>
      </div>
      </>
      ) : (

    <PlayersProvider>
      <CommanderDamageProvider>
        <Game quitGame={() => setGameStarted(false)} players={players} startingLife={startingLife} />
      </CommanderDamageProvider>
      </PlayersProvider>
      )}

    </>
  )
}

export default App
