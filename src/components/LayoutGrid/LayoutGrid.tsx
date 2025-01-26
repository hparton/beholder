import React, { useMemo } from 'react';
import styles from './LayoutGrid.module.css';
import { usePlayers } from '../../context/PlayersContext';

interface LayoutGridProps {
    children: React.ReactNode;
}

const LayoutGrid: React.FC<LayoutGridProps> = ({  children }) => {
    const {players} = usePlayers()

    return (
        <div className={`${styles.layoutGrid} ${styles[`layoutGrid${players.length}`]}`}>
            {children}
        </div>
    );
};

export const useLayouGridRotations = () => {
    const {players} = usePlayers()

    const rotations = useMemo(() => {
        switch (players.length) {
            case 2:
                return [true, false];
            case 3:
                return [true, true, false];
            case 4:
                return [true, true, false, false];
            default:
                return [];
        }
    }, [players])

    return rotations
}

export default LayoutGrid;