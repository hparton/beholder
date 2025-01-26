import { useRef, useState, useEffect } from "react";

type ExponentialButtonProps = {
    onClick: () => void;
    onHold?: () => void;
    initialDelay?: number;
    intervalDelay?: number;
    intervalDelayFactor?: number;
    minimumIntervalDelay?: number;
    children: React.ReactNode;
    className?: string;
};

export const ExponentialButton = ({ onClick, onHold = onClick, initialDelay = 250, intervalDelay = 250, intervalDelayFactor = 0.95, minimumIntervalDelay = 60, children, ...props }: ExponentialButtonProps) => {
    const [isHolding, setIsHolding] = useState<boolean>(false);
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const intervalRef = useRef<number | null>(null);
    const intervalDelayRef = useRef(intervalDelay); // Start with an even faster interval


    useEffect(() => {
        if (!isClicked) return;

        const timeout = window.setTimeout(() => {
            setIsHolding(true);
        }, initialDelay);

        return () => {
            window.clearTimeout(timeout);
        }
    }, [isClicked, initialDelay])

    useEffect(() => {
        if (isHolding) {
            intervalRef.current = window.setInterval(() => {
                onHold();
                intervalDelayRef.current = Math.max(minimumIntervalDelay, intervalDelayRef.current * intervalDelayFactor);
            }, intervalDelayRef.current);
        } else {
            window.clearInterval(intervalRef.current!);
            intervalRef.current = null;
            intervalDelayRef.current = intervalDelay;
        }

        return () => {
            window.clearInterval(intervalRef.current!);
        }
    }, [isHolding, onHold, intervalDelay, minimumIntervalDelay, intervalDelayFactor])


    return (
        <button
            {...props}
            onMouseDown={() => setIsClicked(true)}
            onMouseUp={() => {
                if (!isHolding) onClick();
                setIsClicked(false);
                setIsHolding(false);
            }}
            onTouchStart={(e) => {
                e.preventDefault(); // Prevent text selection
                setIsClicked(true);
            }}
            onTouchEnd={() => {
                if (!isHolding) onClick();
                setIsClicked(false);
                setIsHolding(false);
            }}
        >
            {children}
        </button>
    );
};