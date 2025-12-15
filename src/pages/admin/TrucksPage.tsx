import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiMethods } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Plus,
  Trash2,
  Truck as TruckIcon,
  Edit,
  Search,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Truck } from "@/types/truck.types";

import { WearProgressBar } from "@/components/WearProgressBar";

export function TrucksPage() {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [config, setConfig] = useState<any>({}); // Maintenance config

  // Form State
  const [formData, setFormData] = useState<Partial<Truck>>({
    licensePlate: "",
    brand: "",
    vehicleModel: "",
    year: new Date().getFullYear(),
    currentMileage: 0,
    fuelType: "diesel",
    fuelCapacity: 0,
    status: "available",
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trucksRes, configRes] = await Promise.all([
        apiMethods.trucks.getAll(),
        apiMethods.maintenance.getConfig(),
      ]);
      setTrucks(trucksRes);
      setConfig(configRes);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingUserId) {
        await apiMethods.trucks.update(editingUserId, formData);
      } else {
        await apiMethods.trucks.create(formData);
      }
      setEditingUserId(null);
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save truck");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this truck?")) return;
    try {
      await apiMethods.trucks.delete(id);
      setTrucks(trucks.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete truck");
    }
  };

  const startEdit = (truck: Truck) => {
    setFormData({
      licensePlate: truck.licensePlate,
      brand: truck.brand,
      vehicleModel: truck.vehicleModel,
      year: truck.year,
      currentMileage: truck.currentMileage,
      fuelType: truck.fuelType,
      fuelCapacity: truck.fuelCapacity,
      status: truck.status,
    });
    setEditingUserId(truck._id);
    setView("form");
  };

  const resetForm = () => {
    setFormData({
      licensePlate: "",
      brand: "",
      vehicleModel: "",
      year: new Date().getFullYear(),
      currentMileage: 0,
      fuelType: "diesel",
      fuelCapacity: 0,
      status: "available",
    });
  };

  const filteredTrucks = trucks.filter(
    (t) =>
      t.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && view === "list") {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Truck Management</h1>
          <p className="text-muted-foreground">Manage your fleet vehicles.</p>
        </div>
        {view === "list" ? (
          <Button
            onClick={() => {
              resetForm();
              setEditingUserId(null);
              setView("form");
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Truck
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setView("list")}>
            Cancel
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {view === "list" ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Plate or Brand..."
              className="pl-8 max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrucks.map((truck) => (
              <Card key={truck._id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <TruckIcon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      {truck.licensePlate}
                    </CardTitle>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${truck.status === "available"
                      ? "bg-green-100 text-green-800"
                      : truck.status === "maintenance"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {truck.status.replace("_", " ")}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <div>
                      {truck.year} {truck.brand} {truck.vehicleModel}
                    </div>
                    <div>
                      Mileage: {truck.currentMileage.toLocaleString()} km
                    </div>
                    <div>
                      Fuel: {truck.fuelType} ({truck.fuelCapacity}L)
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <WearProgressBar
                      label="Oil Life"
                      current={truck.currentMileage}
                      target={truck.nextMaintenanceMileage}
                      interval={config.oilChangeIntervalKm || 15000}
                    />
                    {/* Try to infer tire health if nextTireRotationMileage exists, 
                         otherwise fallback or hide if property missing (though added to model) */}
                    {/* Note: The Truck type might need update in frontend if not already there, 
                         but standard 'any' casting or updated type helps. */}
                    {truck.nextTireRotationMileage && (
                      <WearProgressBar
                        label="Tire Health"
                        current={truck.currentMileage}
                        target={truck.nextTireRotationMileage}
                        interval={config.tireRotationIntervalKm || 50000}
                      />
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => startEdit(truck)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDelete(truck._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredTrucks.length === 0 && (
              <div className="col-span-full text-center p-8 text-muted-foreground">
                No trucks found.
              </div>
            )}
          </div>
        </div>
      ) : (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>
              {editingUserId ? "Edit Truck" : "Add New Truck"}
            </CardTitle>
            <CardDescription>Enter vehicle details below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>License Plate</Label>
                  <Input
                    required
                    value={formData.licensePlate}
                    onChange={(e) =>
                      setFormData({ ...formData, licensePlate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Input
                    required
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input
                    required
                    value={formData.vehicleModel}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleModel: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Mileage (km)</Label>
                  <Input
                    type="number"
                    required
                    value={formData.currentMileage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentMileage: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fuel Capacity (L)</Label>
                  <Input
                    type="number"
                    required
                    value={formData.fuelCapacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fuelCapacity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(val) =>
                      setFormData({ ...formData, fuelType: val as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) =>
                      setFormData({ ...formData, status: val as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="on_trip">On Trip</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={formLoading}>
                {formLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingUserId ? "Update Truck" : "Create Truck"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
