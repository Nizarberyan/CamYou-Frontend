import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiMethods } from "@/services/api";
import { StatsCard } from "@/components/admin/StatsCard";
import { TripCard } from "@/components/driver/TripCard";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    Truck,
    Calendar,
    Plus,
    Activity
} from "lucide-react";
import type { Trip } from "@/types/trip.types";

export default function AdminDashboard() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [stats, setStats] = useState({
        totalTrips: 0,
        activeTrips: 0,
        completedTrips: 0,
        totalDrivers: 0,
        totalTrucks: 0,
        maintenanceTrucks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tripsData, driversData, trucksData] = await Promise.all([
                    apiMethods.getTrips(),
                    apiMethods.getDrivers(),
                    apiMethods.getTrucks()
                ]);

                // Calculate Stats
                const activeTrips = tripsData.filter((t: Trip) => t.status === "in_progress").length;
                const completedTrips = tripsData.filter((t: Trip) => t.status === "completed").length;
                const maintenanceTrucks = trucksData.filter((t: any) => t.status === "maintenance").length;

                setTrips(tripsData);
                setStats({
                    totalTrips: tripsData.length,
                    activeTrips,
                    completedTrips,
                    totalDrivers: driversData.length,
                    totalTrucks: trucksData.length,
                    maintenanceTrucks
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 flex justify-center">Loading dashboard...</div>;
    }

    // Sort trips by date (most recent first)
    const recentTrips = [...trips].sort((a, b) =>
        new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    ).slice(0, 6);

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Overview of your fleet operations</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link to="/trips/new">
                            <Plus className="mr-2 h-4 w-4" /> New Trip
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Active Trips"
                    value={stats.activeTrips}
                    icon={Activity}
                    description="Currently in progress"
                />
                <StatsCard
                    title="Total Drivers"
                    value={stats.totalDrivers}
                    icon={Users}
                    description="Registered in system"
                />
                <StatsCard
                    title="Fleet Status"
                    value={`${stats.totalTrucks - stats.maintenanceTrucks}/${stats.totalTrucks}`}
                    icon={Truck}
                    description={`${stats.maintenanceTrucks} trucks in maintenance`}
                />
                <StatsCard
                    title="Total Trips"
                    value={stats.totalTrips}
                    icon={Calendar}
                    description={`${stats.completedTrips} completed`}
                    className="border-l-4 border-l-blue-500"
                />
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">Recent Activity</h2>
                    <Button variant="link" asChild>
                        <Link to="/trips">View all</Link>
                    </Button>
                </div>

                {recentTrips.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-muted/10">
                        <p className="text-muted-foreground">No recent trips found.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {recentTrips.map(trip => (
                            <TripCard key={trip._id} trip={trip} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
