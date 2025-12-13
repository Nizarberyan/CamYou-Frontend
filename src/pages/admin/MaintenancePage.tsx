import { useEffect, useState } from "react";
import { apiMethods } from "@/services/api";
import type { Truck } from "@/types/truck.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, CheckCircle, AlertTriangle } from "lucide-react";

export default function MaintenancePage() {
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const data = await apiMethods.maintenance.getStatus();
            setTrucks(data);
        } catch (error) {
            console.error("Failed to fetch maintenance status", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handlePerformMaintenance = async (truckId: string) => {
        const notes = window.prompt("Enter maintenance notes (e.g., 'Oil change done'):");
        if (!notes) return;

        try {
            setProcessing(truckId);
            await apiMethods.maintenance.perform(truckId, notes);
            // Refresh list
            await fetchStatus();
        } catch (error) {
            console.error("Failed to perform maintenance", error);
            alert("Failed to perform maintenance");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading maintenance status...</div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Fleet Maintenance</h1>
                <Button variant="outline" onClick={fetchStatus}>
                    Refresh
                </Button>
            </div>

            {trucks.length === 0 ? (
                <Card className="bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                        <h3 className="text-lg font-medium">All Systems Operational</h3>
                        <p>No trucks currently require maintenance.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {trucks.map((truck) => (
                        <Card key={truck._id} className="border-l-4 border-l-destructive shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{truck.licensePlate}</CardTitle>
                                    <Badge variant="destructive" className="uppercase">
                                        {truck.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {truck.brand} {truck.vehicleModel} ({truck.year})
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-red-950/30 border border-red-900/50 p-3 rounded-md space-y-2">
                                    <div className="flex items-center gap-2 text-red-400 font-semibold">
                                        <AlertTriangle className="h-4 w-4" />
                                        Required Actions:
                                    </div>
                                    <ul className="list-disc list-inside text-sm space-y-1 text-red-200">
                                        {truck.maintenanceFlags.map((flag, idx) => (
                                            <li key={idx}>{flag}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground block">Mileage</span>
                                        <span className="font-mono">{truck.currentMileage.toLocaleString()} km</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block">Next Service</span>
                                        <span className="font-mono">{truck.nextMaintenanceMileage?.toLocaleString() ?? "N/A"} km</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-4"
                                    onClick={() => handlePerformMaintenance(truck._id)}
                                    disabled={!!processing}
                                >
                                    {processing === truck._id ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <Wrench className="mr-2 h-4 w-4" />
                                            Perform Maintenance
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
