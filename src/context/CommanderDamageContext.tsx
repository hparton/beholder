import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePlayers } from './PlayersContext';

interface DamageRecord {
    [attacker: string]: number;
}

interface PlayerDamage {
    [player: string]: DamageRecord;
}

interface CommanderDamageContextProps {
    playerDamage: PlayerDamage;
    registerPlayer: (player: string) => void;
    recordDamage: (attacker: string, defender: string, damage: number) => void;
}

const CommanderDamageContext = createContext<CommanderDamageContextProps | undefined>(undefined);

export const CommanderDamageProvider = ({ children }: { children?: React.ReactNode}) => {
    const [playerDamage, setPlayerDamage] = useState<PlayerDamage>({});
    const {players} = usePlayers();

    const registerPlayer = useCallback((player: string) => {
        setPlayerDamage(prevState => ({
            ...prevState,
            [player]: {}
        }));
    }, []);

    useEffect(() => {
        players.forEach(player => {
            registerPlayer(player.id);
        });
    }, [players, registerPlayer]);

    const recordDamage = useCallback((attacker: string, defender: string, damage: number) => {
        setPlayerDamage(prevState => {
            const computedDamage = (prevState[defender][attacker] || 0) + damage

            if (computedDamage < 0) {
                return {
                    ...prevState,
                    [defender]: {
                        ...prevState[defender],
                        [attacker]: 0
                    }
                }
            }
    
            return {
            ...prevState,
            [defender]: {
                ...prevState[defender],
                [attacker]: (prevState[defender][attacker] || 0) + damage
            }
        }
    });
    }, []);

    return (
        <CommanderDamageContext.Provider value={{ playerDamage, registerPlayer, recordDamage }}>
            {children}
        </CommanderDamageContext.Provider>
    );
};

export const useCommanderDamage = () => {
    const context = useContext(CommanderDamageContext);
    if (!context) {
        throw new Error('useCommanderDamage must be used within a CommanderDamageProvider');
    }
    return context;
};