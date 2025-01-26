import React, { createContext, useState, useContext, useCallback } from 'react';

interface Player {
    id: string;
    name: string;
}

interface PlayersContextProps {
    players: Player[];
    registerPlayer: (player: Player) => void;
    deregisterPlayer: (playerId: string) => void;
}

const PlayersContext = createContext<PlayersContextProps | undefined>(undefined);

export const PlayersProvider = ({ children }: { children?: React.ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>([]);

    const registerPlayer = useCallback((player: Player) => {
        setPlayers((prevPlayers) => [...prevPlayers, player]);
    }, []);

    const deregisterPlayer = useCallback((playerId: string) => {
        setPlayers((prevPlayers) => prevPlayers.filter(player => player.id !== playerId));
    }, []);

    return (
        <PlayersContext.Provider value={{ players, registerPlayer, deregisterPlayer }}>
            {children}
        </PlayersContext.Provider>
    );
};

export const usePlayers = (): PlayersContextProps => {
    const context = useContext(PlayersContext);
    if (!context) {
        throw new Error('usePlayers must be used within a PlayersProvider');
    }
    return context;
};