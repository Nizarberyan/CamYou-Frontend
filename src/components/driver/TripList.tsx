import type { Trip } from "@/types/trip.types";
import { TripCard } from "./TripCard";
import { Truck } from "lucide-react";

interface TripListProps {
    trips: Trip[];
    loading?: boolean;
    showQuickActions?: boolean;
}

export function TripList({ trips, loading, showQuickActions }: TripListProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 rounded-xl bg-muted/50 animate-pulse" />
                ))}
            </div>
        );
    }

    if (trips.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg border-2 border-dashed">
                <div className="bg-muted p-4 rounded-full mb-4">
                    <Truck className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No trips assigned</h3>
                <p className="text-muted-foreground max-w-sm mt-1">
                    You don't have any trips assigned to you at the moment. assigned trips will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} showAction={showQuickActions} />
            ))}
        </div>
    );
}
