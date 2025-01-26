import React, { createContext, useState, useContext, useCallback } from 'react';

export interface Player {
    id: string;
    name: string;
    color: string;
}

interface PlayersContextProps {
    players: Player[];
    registerPlayer: (player: Player) => void;
    deregisterPlayer: (playerId: string) => void;
    getPlayerDetails: (playerId: string) => Player | undefined;
}

const PlayersContext = createContext<PlayersContextProps | undefined>(undefined);

export const PlayersProvider = ({ children }: { children?: React.ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>([]);

    const registerPlayer = useCallback((player: Player) => {
        setPlayers((prevPlayers) => [...prevPlayers, player]);
        return player
    }, []);

    const getPlayerDetails = useCallback((playerId: string) => {
        return players.find(player => player.id === playerId);
    }, [players]);

    const deregisterPlayer = useCallback((playerId: string) => {
        setPlayers((prevPlayers) => prevPlayers.filter(player => player.id !== playerId));
    }, []);

    return (
        <PlayersContext.Provider value={{ players, registerPlayer, deregisterPlayer, getPlayerDetails }}>
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