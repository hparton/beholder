import { useEffect, useState } from "react";
import { useCommanderDamage } from "../../context/CommanderDamageContext";
import { usePlayers } from "../../context/PlayersContext";
import styles from './LifeTracker.module.css'
import cn from 'classnames'
import { ExponentialButton } from "../ExponentialButton/ExponentialButton";

type LifeTrackerProps = {
    player: string;
    initialLife: number;
    flipped?: boolean;
}

export const LifeTracker = ({initialLife, player, flipped}: LifeTrackerProps) => {
    const [life, setLife] = useState(initialLife)
    const {recordDamage, playerDamage} = useCommanderDamage()
    const {players, registerPlayer, deregisterPlayer} = usePlayers();

    useEffect(() => {
        registerPlayer({
            id: player,
            name: player
        })

        return () => {
            // Clean up player when component unmounts
            deregisterPlayer(player)
        }
    }, [deregisterPlayer, player, registerPlayer])


    const totalLife = life - Object.values(playerDamage[player] || {}).reduce((acc, curr) => acc + curr, 0)
    const commandDamageRecievedFromPlayers = Object.entries(playerDamage[player] || {}).map(([player, damage]) => ({player, damage})) 
    const deadToCommanderDamage = commandDamageRecievedFromPlayers.some(({damage}) => damage >= 21)

    const playerIsDead = totalLife <= 0 || deadToCommanderDamage

    const otherPlayers = players.filter(p => p.id !== player)

    const handleRecordDamage = (fromPlayer: string, damage: number) => {
        recordDamage(fromPlayer, player, damage)
    }

    return (
        <div className={cn(styles.lifeTracker, {[styles.flipped]: flipped, [styles.dead]: playerIsDead})}>
            <p>{player}</p>
            <p className={styles.lifeCounter}>{playerIsDead ? 'Dead' : totalLife}</p>
            <ExponentialButton className={styles.lifePlus} onClick={() => !deadToCommanderDamage && setLife(life + 1)}>+</ExponentialButton>
            <ExponentialButton className={styles.lifeNegative} onClick={() => !deadToCommanderDamage && !playerIsDead && setLife(life - 1)}>-</ExponentialButton>
            <div className={styles.commanderDamage}>
                {otherPlayers.map((p) => (
                    <div className={styles.commanderDamagePlayer} key={p.id}>
                        <p key={p.id}>{p.name}: {commandDamageRecievedFromPlayers.find(c => c.player == p.id)?.damage ?? 0}</p>
                        <ExponentialButton onClick={() => handleRecordDamage(p.id, 1)}>+</ExponentialButton>
                        <ExponentialButton onClick={() => handleRecordDamage(p.id, -1)}>-</ExponentialButton>
                    </div>
                ))}
            </div>
        </div>
    )
}