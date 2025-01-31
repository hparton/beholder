import { useEffect, useMemo, useState } from "react";
import { useCommanderDamage } from "../../context/CommanderDamageContext";
import { usePlayers } from "../../context/PlayersContext";
import styles from './LifeTracker.module.css'
import cn from 'classnames'
import { ExponentialButton } from "../ExponentialButton/ExponentialButton";
import { CommanderDamage } from "./CommanderDamage";
import  randomColor  from 'randomcolor'

type LifeTrackerProps = {
    player: string;
    initialLife: number;
    flipped?: boolean;
    gridArea: number;
}

const getColorHueForPlayer = (playerIndex: number) => {
    switch (playerIndex) {
        case 0:
            return 'blue'
        case 1:
            return 'red'
        case 2:
            return 'green'
        case 3:
            return 'orange'
        case 4:
            return 'purple'
        default:
            return 'yellow'
    }
}


export const LifeTracker = ({initialLife, player, flipped, gridArea}: LifeTrackerProps) => {
    const [life, setLife] = useState(initialLife)
    const {playerDamage} = useCommanderDamage()
    const {players, registerPlayer, deregisterPlayer, getPlayerDetails} = usePlayers();
    const [showCommanderDamage, setShowCommanderDamage] = useState(false)

    const playerIndex = players.findIndex(p => p.id === player)

    useEffect(() => {
        registerPlayer({
            id: player,
            name: "",
            color: randomColor({
                luminosity: 'light',
                hue: getColorHueForPlayer(playerIndex)
             })
        })

        return () => {
            // Clean up player when component unmounts
            deregisterPlayer(player)
        }
    }, [deregisterPlayer, player, registerPlayer, playerIndex])

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
        <div className={cn(styles.lifeTracker, {[styles.flipped]: flipped, [styles.dead]: playerIsDead})} style={{backgroundColor: playerDetails?.color, gridArea: `area${gridArea}`}}>
            <p>{playerDetails?.name}</p>
            <p className={styles.lifeCounter}>{playerIsDead ? 'R.I.P' : totalLife}</p>
            <ExponentialButton className={styles.lifePlus} onClick={() => !deadToCommanderDamage && setLife(life + 1)}>+</ExponentialButton>
            <ExponentialButton className={styles.lifeNegative} onClick={() => !deadToCommanderDamage && !playerIsDead && setLife(life - 1)}>-</ExponentialButton>
            <button className={styles.commanderToggle} onClick={() => setShowCommanderDamage(true)}>CMD DMG</button>
            {showCommanderDamage && <CommanderDamage flipped={flipped} player={player} players={players} onClickOutside={() => setShowCommanderDamage(false)} />}
        </div>
    )
}