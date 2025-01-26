import LayoutGrid, { useLayouGridRotations } from "../components/LayoutGrid/LayoutGrid";
import { LifeTracker } from "../components/LifeTracker/LifeTracker";
import { Player } from "../context/PlayersContext";

interface GameProps {
    startingLife: number;
    players: Pick<Player, "id">[],
    quitGame: () => void;
}

export const Game = ({startingLife, players, quitGame}: GameProps) => {
  const rotations = useLayouGridRotations()

  return (
    <>
      <LayoutGrid>
        {players.map((player, index) => (
            <LifeTracker
                key={player.id}
                player={player.id}
                initialLife={startingLife}
                flipped={rotations[index]}
            />
        ))}
      </LayoutGrid>
      <button
        onClick={quitGame}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        End
      </button>
    </>
  );
};
