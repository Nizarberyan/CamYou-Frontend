import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiMethods } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Truck,
  User,
  Container,
} from "lucide-react";
import type { User as UserType } from "@/types/auth.types";
import type { Truck as TruckType } from "@/types/truck.types";
import type { Trailer as TrailerType } from "@/types/trailer.types";

export function CreateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [drivers, setDrivers] = useState<UserType[]>([]);
  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [trailers, setTrailers] = useState<TrailerType[]>([]);

  const [formData, setFormData] = useState({
    startLocation: "",
    endLocation: "",
    scheduledDate: "",
    driverId: "",
    truckId: "",
    trailerId: "none",
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversData, trucksData, trailersData] = await Promise.all([
          apiMethods.getDrivers(),
          apiMethods.trucks.getAll(),
          apiMethods.trailers.getAll(),
        ]);
        setDrivers(driversData);
        setTrucks(trucksData);
        setTrailers(trailersData);
      } catch (error) {
        console.error("Failed to load form data:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        trailerId:
          formData.trailerId === "none" ? undefined : formData.trailerId,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
      };

      await apiMethods.createTrip(payload);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Failed to create trip:", error);
      alert("Failed to create trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return <div className="p-8 flex justify-center">Loading form data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:pl-2 transition-all"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Locations */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Route Details</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startLocation">Origin</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startLocation"
                      className="pl-9"
                      placeholder="City, State"
                      required
                      value={formData.startLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startLocation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endLocation">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endLocation"
                      className="pl-9"
                      placeholder="City, State"
                      required
                      value={formData.endLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endLocation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Schedule</Label>
              <div className="space-y-2">
                <Label htmlFor="date">Scheduled Date & Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="datetime-local"
                    className="pl-9"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduledDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Resources</Label>

              <div className="space-y-2">
                <Label>Driver</Label>
                <Select
                  required
                  value={formData.driverId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, driverId: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select a driver" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver._id} value={driver._id}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Truck</Label>
                  <Select
                    required
                    value={formData.truckId}
                    onValueChange={(val) =>
                      setFormData({ ...formData, truckId: val })
                    }
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select a truck" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {trucks
                        .filter((t) => t.status !== "maintenance")
                        .map((truck) => (
                          <SelectItem key={truck._id} value={truck._id}>
                            {truck.brand} {truck.vehicleModel} (
                            {truck.licensePlate})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trailer (Optional)</Label>
                  <Select
                    value={formData.trailerId}
                    onValueChange={(val) =>
                      setFormData({ ...formData, trailerId: val })
                    }
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Container className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select a trailer" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {trailers.map((trailer) => (
                        <SelectItem key={trailer._id} value={trailer._id}>
                          {trailer.type} ({trailer.licensePlate})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input // Using Input since Textarea might not be imported/available globally yet
                id="notes"
                placeholder="Additional instructions..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Trip"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
