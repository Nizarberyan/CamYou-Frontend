import React from "react";

interface WearProgressBarProps {
    current: number;
    target?: number; // Target mileage (for countdowns like Oil/Rotation)
    interval?: number; // The full interval (to calculate percentage)
    max?: number;    // Absolute max value (for things like Tread Depth)
    label: string;
    unit?: string;
    inverse?: boolean; // If true, higher is better (like tread depth). Default false (usage).
}

export function WearProgressBar({
    current,
    target,
    interval,
    max,
    label,
    unit = "km",
    inverse = false,
}: WearProgressBarProps) {
    let percentage = 0;
    let displayValue = "";
    let colorClass = "bg-green-500";

    if (inverse && max !== undefined) {
        // Mode: Absolute Value (e.g., Tread Depth)
        // 12mm (max) -> 100% (Green)
        // 0mm -> 0% (Red)
        percentage = (current / max) * 100;
        displayValue = `${current} ${unit}`;

        // Color logic for Tread (Low is bad)
        if (percentage < 25) colorClass = "bg-red-500";
        else if (percentage < 50) colorClass = "bg-yellow-500";

    } else if (target !== undefined && interval !== undefined) {
        // Mode: Countdown (e.g., Oil Change)
        // Target = 15000, Current = 14000
        // Remaining = 1000
        const remaining = target - current;

        // Percentage Consumed: (Interval - Remaining) / Interval * 100
        // Example: (15000 - 1000) / 15000 = 93% used.
        // BUT typically a progress bar shows "Health" (Remaining).
        // Let's show "Life Remaining".
        percentage = (remaining / interval) * 100;

        displayValue = `${Math.max(0, remaining).toLocaleString()} ${unit} left`;

        // Color logic for Life Remaining (Low is bad)
        if (percentage < 10) colorClass = "bg-red-500";
        else if (percentage < 25) colorClass = "bg-yellow-500";
    }

    // Clamp
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    return (
        <div className="space-y-1 w-full">
            <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className={percentage < 10 ? "text-red-400 font-bold" : "text-muted-foreground"}>
                    {displayValue}
                </span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClass} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
