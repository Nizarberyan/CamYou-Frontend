import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import tripService from "@/services/trip/trip.service";
import type { Trip } from "@/types/trip.types";
import { TripList } from "@/components/driver/TripList";
import { User } from "lucide-react";

export default function DriverDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const data = await tripService.getMyTrips(user._id);
        setTrips(data);
      } catch (err) {
        console.error("Failed to fetch trips", err);
        setError("Failed to load your trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user?._id]);

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Driver Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back,{" "}
            <span className="font-semibold text-foreground">{user?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
          <User className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium capitalize">
            {user?.role} Account
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Your Assigned Trips
          </h2>
          <span className="text-sm text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full font-medium">
            {trips.length}
          </span>
        </div>
        <TripList trips={trips} loading={loading} showQuickActions={true} />
      </div>
    </div>
  );
}
