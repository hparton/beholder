import { useRef } from "react";
import { useCommanderDamage } from "../../context/CommanderDamageContext";
import { ExponentialButton } from "../ExponentialButton/ExponentialButton";
import LayoutGrid from "../LayoutGrid/LayoutGrid"
import styles from './LifeTracker.module.css'
import cn from 'classnames'

type CommanderDamageProps = {
    players: {id: string, color?: string}[];
    player: string;
    onClickOutside: () => void;
    flipped?: boolean;
}

export const CommanderDamage = ({players, player, onClickOutside, flipped}: CommanderDamageProps) => {
    const {recordDamage, playerDamage} = useCommanderDamage()
    const containerRef = useRef<HTMLDivElement>(null)
    const commandDamageRecievedFromPlayers = Object.entries(playerDamage[player] || {}).map(([player, damage]) => ({player, damage})) 

    const handleRecordDamage = (fromPlayer: string, damage: number) => {
        recordDamage(fromPlayer, player, damage)
    }

    return (
        <div className={cn(styles.commanderDamage, {[styles.flipped]: flipped})} ref={containerRef} onClick={(e) => {
            if (containerRef.current === e.target) {
                onClickOutside()
            }
        }}>
            <div className={styles.commanderDamageInner}>
                <LayoutGrid layout={players.length.toString()}>
                    {players.map((p, index) => (
                        <div 
                            key={p.id} 
                            className={cn(styles.commanderDamagePlayer, {[styles.flipped]: flipped, [styles.commanderDamageSelf]: p.id === player})} 
                            style={{backgroundColor: p?.color, gridArea: `area${index + 1}`}}
                        >
                                <>
                                    <p className={styles.commanderDamageCounter}>{commandDamageRecievedFromPlayers.find(c => c.player == p.id)?.damage ?? 0}</p>
                                    <ExponentialButton className={styles.lifeNegative} onClick={() => handleRecordDamage(p.id, -1)}>-</ExponentialButton>
                                    <ExponentialButton className={styles.lifePlus} onClick={() => handleRecordDamage(p.id, 1)}>+</ExponentialButton>
                                </>
                        </div>
                    ))}
                </LayoutGrid>
            </div>
        </div>
    )
}