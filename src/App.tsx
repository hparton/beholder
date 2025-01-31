import { useMemo, useState } from 'react'
import './App.css'
import { CommanderDamageProvider } from './context/CommanderDamageContext'
import { PlayersProvider } from './context/PlayersContext'
import { Game } from './views/Game'
import { v4 } from 'uuid'

function App() {
  const [startingLife, setStartingLife] = useState(40)
  const [gameStarted, setGameStarted] = useState(false);
  const [layout, setLayout] = useState(4);

  const players = useMemo(() => {
    return Array.from({ length: layout }).map(() => {
        return {
            id: v4(),
        };
    });
  }, [layout])


  return (
    <>
    {!gameStarted ? (
      <>
      <p>Start er up</p>
      <p>Starting life: {startingLife}</p>
      <input type="range" min="20" max="60" value={startingLife} onChange={(e) => setStartingLife(parseInt(e.target.value))} />
      <p>Select Layout:</p>
      <div>
        <button onClick={() => setLayout(2)}>
          <pre>{`[    ]
[    ]`}</pre>
          2
        </button>
        <button onClick={() => setLayout(3)}>
          <pre>{`[ ][ ]
[ ]   
`}</pre>
          3
        </button>
        <button onClick={() => setLayout(4)}>
          <pre>{`[ ][ ]
[ ][ ]
`}</pre>
          4
        </button>
        <button onClick={() => setLayout(5)}>
          <pre>{`[ ][ ]| |
[ ][ ]| |`}</pre>
          5
        </button>
        <button onClick={() => setLayout(6)}>
          <pre>{`[ ][ ][ ]
[ ][ ][ ]`}</pre>
          6
        </button>
      </div>
      <div>
      <button onClick={() => setGameStarted(true)}>Start Game</button>
      </div>
      </>
      ) : (

    <PlayersProvider>
      <CommanderDamageProvider>
        <Game quitGame={() => setGameStarted(false)} players={players} startingLife={startingLife} layout={layout.toString()} />
      </CommanderDamageProvider>
      </PlayersProvider>
      )}

    </>
  )
}

export default App
