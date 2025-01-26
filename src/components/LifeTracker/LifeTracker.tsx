import { useEffect, useMemo, useState } from "react";
import { useCommanderDamage } from "../../context/CommanderDamageContext";
import { usePlayers } from "../../context/PlayersContext";
import styles from './LifeTracker.module.css'
import cn from 'classnames'
import { ExponentialButton } from "../ExponentialButton/ExponentialButton";
import { CommanderDamage } from "./CommanderDamage";

type LifeTrackerProps = {
    player: string;
    initialLife: number;
    flipped?: boolean;
}

function generatePastelColor(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = (hash & 0xFF0000) >> 16;
    const g = (hash & 0x00FF00) >> 8;
    const b = hash & 0x0000FF;
    const pastelFactor = 0.7;
    const pastelR = Math.floor((r + 255 * pastelFactor) / (1 + pastelFactor));
    const pastelG = Math.floor((g + 255 * pastelFactor) / (1 + pastelFactor));
    const pastelB = Math.floor((b + 255 * pastelFactor) / (1 + pastelFactor));
    return `#${pastelR.toString(16).padStart(2, '0')}${pastelG.toString(16).padStart(2, '0')}${pastelB.toString(16).padStart(2, '0')}`;
}

export const LifeTracker = ({initialLife, player, flipped}: LifeTrackerProps) => {
    const [life, setLife] = useState(initialLife)
    const {playerDamage} = useCommanderDamage()
    const {players, registerPlayer, deregisterPlayer, getPlayerDetails} = usePlayers();
    const [showCommanderDamage, setShowCommanderDamage] = useState(false)

    useEffect(() => {
        registerPlayer({
            id: player,
            name: "",
            color: generatePastelColor(player)
        })

        return () => {
            // Clean up player when component unmounts
            deregisterPlayer(player)
        }
    }, [deregisterPlayer, player, registerPlayer])

    const playerDetails = useMemo(() => getPlayerDetails(player), [getPlayerDetails, player])
    const totalLife = life - Object.values(playerDamage[player] || {}).reduce((acc, curr) => acc + curr, 0)
    const commandDamageRecievedFromPlayers = Object.entries(playerDamage[player] || {}).map(([player, damage]) => ({player, damage})) 
    const deadToCommanderDamage = commandDamageRecievedFromPlayers.some(({damage}) => damage >= 21)
    const playerIsDead = totalLife <= 0 || deadToCommanderDamage


    useEffect(() => {
        if (playerIsDead ){
            setShowCommanderDamage(false)
        }
    }, [playerIsDead])

    return (
        <div className={cn(styles.lifeTracker, {[styles.flipped]: flipped, [styles.dead]: playerIsDead})} style={{backgroundColor: playerDetails?.color}}>
            <p>{playerDetails?.name}</p>
            <p className={styles.lifeCounter}>{playerIsDead ? 'Dead' : totalLife}</p>
            <ExponentialButton className={styles.lifePlus} onClick={() => !deadToCommanderDamage && setLife(life + 1)}>+</ExponentialButton>
            <ExponentialButton className={styles.lifeNegative} onClick={() => !deadToCommanderDamage && !playerIsDead && setLife(life - 1)}>-</ExponentialButton>
            <button className={styles.commanderToggle} onClick={() => setShowCommanderDamage(true)}>CMD DMG</button>
            {showCommanderDamage && <CommanderDamage flipped={flipped} player={player} players={players} onClickOutside={() => setShowCommanderDamage(false)} />}
        </div>
    )
}