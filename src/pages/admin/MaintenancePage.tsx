import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiMethods } from "@/services/api";
import type { Truck } from "@/types/truck.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  History,
  Settings,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function MaintenancePage() {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({});
  const [view, setView] = useState<"status" | "history" | "settings">("status");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [maintenanceNotes, setMaintenanceNotes] = useState("");

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

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await apiMethods.maintenance.getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await apiMethods.maintenance.getConfig();
      setConfig(data);
    } catch (error) {
      console.error("Failed to fetch config", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "status") fetchStatus();
    else if (view === "history") fetchHistory();
    else if (view === "settings") fetchConfig();
  }, [view]);

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiMethods.maintenance.updateConfig(config);
      alert("Configuration updated successfully");
    } catch (error) {
      console.error("Failed to update config", error);
      alert("Failed to update configuration");
    }
  };

  const openMaintenanceModal = (truckId: string) => {
    setSelectedTruckId(truckId);
    setMaintenanceNotes("");
    setIsModalOpen(true);
  };

  const confirmMaintenance = async () => {
    if (!selectedTruckId || !maintenanceNotes) return;

    try {
      setProcessing(selectedTruckId);
      await apiMethods.maintenance.perform(selectedTruckId, maintenanceNotes);
      setIsModalOpen(false);
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
      <Button
        variant="ghost"
        className="mb-2 pl-0 hover:pl-2 transition-all"
        onClick={() => navigate("/admin/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fleet Maintenance</h1>
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={view === "status" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("status")}
          >
            Status
          </Button>
          <Button
            variant={view === "history" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("history")}
          >
            History
          </Button>
          <Button
            variant={view === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("settings")}
          >
            Settings
          </Button>
        </div>
      </div>

      {view === "history" ? (
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <History className="h-5 w-5" /> Maintenance Log
            </h2>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No maintenance history found.
                </p>
              ) : (
                history.map((log: any) => (
                  <div
                    key={log._id}
                    className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {log.vehicle?.brand
                          ? `${log.vehicle.brand} ${log.vehicle.vehicleModel}`
                          : "Unknown Vehicle"}
                        <Badge variant="outline" className="text-xs">
                          {log.vehicle?.licensePlate}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.description}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">
                        {new Date(log.date).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(log.date).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : /* Status View */ null}

      {view === "settings" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Maintenance Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateConfig} className="space-y-4 max-w-md">
              <div className="grid gap-2">
                <Label htmlFor="oil">Oil Change Interval (km)</Label>
                <Input
                  id="oil"
                  type="number"
                  value={config.oilChangeIntervalKm || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      oilChangeIntervalKm: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inspection">
                  Annual Inspection Interval (months)
                </Label>
                <Input
                  id="inspection"
                  type="number"
                  value={config.inspectionIntervalMonths || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      inspectionIntervalMonths: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tire">Tire Rotation Interval (km)</Label>
                <Input
                  id="tire"
                  type="number"
                  value={config.tireRotationIntervalKm || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tireRotationIntervalKm: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {view === "status" &&
        (trucks.length === 0 ? (
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
              <Card
                key={truck._id}
                className="border-l-4 border-l-destructive shadow-sm"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      {truck.licensePlate}
                    </CardTitle>
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
                      <span className="text-muted-foreground block">
                        Mileage
                      </span>
                      <span className="font-mono">
                        {truck.currentMileage.toLocaleString()} km
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">
                        Next Service
                      </span>
                      <span className="font-mono">
                        {truck.nextMaintenanceMileage?.toLocaleString() ??
                          "N/A"}{" "}
                        km
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => openMaintenanceModal(truck._id)}
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
        ))}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background border rounded-lg shadow-lg max-w-lg w-full p-6 space-y-4 animate-in fade-in-0 zoom-in-95">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Perform Maintenance
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter details about the maintenance performed. This will be
                saved to the vehicle's history.
              </p>
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="notes">Maintenance Notes</Label>
                <textarea
                  id="notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={maintenanceNotes}
                  onChange={(e) => setMaintenanceNotes(e.target.value)}
                  placeholder="E.g., Oil change, Brake pad replacement..."
                />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmMaintenance}
                disabled={!maintenanceNotes || !!processing}
              >
                {processing ? "Processing..." : "Confirm & Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
