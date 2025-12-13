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
  Container as TrailerIcon,
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
import type { Trailer } from "@/types/trailer.types";

export function TrailersPage() {
  const navigate = useNavigate();
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<Partial<Trailer>>({
    licensePlate: "",
    type: "box",
    capacityWeight: 0,
    brand: "",
    year: new Date().getFullYear(),
    status: "available",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTrailers();
  }, []);

  const fetchTrailers = async () => {
    setLoading(true);
    try {
      const res = await apiMethods.trailers.getAll();
      setTrailers(res);
      setError(null);
    } catch (err) {
      setError("Failed to fetch trailers");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) {
        await apiMethods.trailers.update(editingId, formData);
      } else {
        await apiMethods.trailers.create(formData);
      }
      setView("list");
      setEditingId(null);
      resetForm();
      fetchTrailers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save trailer");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trailer?")) return;
    try {
      await apiMethods.trailers.delete(id);
      setTrailers(trailers.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete trailer");
    }
  };

  const startEdit = (trailer: Trailer) => {
    setFormData({
      licensePlate: trailer.licensePlate,
      type: trailer.type,
      capacityWeight: trailer.capacityWeight,
      brand: trailer.brand,
      year: trailer.year,
      status: trailer.status,
    });
    setEditingId(trailer._id);
    setView("form");
  };

  const resetForm = () => {
    setFormData({
      licensePlate: "",
      type: "box",
      capacityWeight: 0,
      brand: "",
      year: new Date().getFullYear(),
      status: "available",
    });
  };

  const filteredTrailers = trailers.filter(
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
          <h1 className="text-3xl font-bold">Trailer Management</h1>
          <p className="text-muted-foreground">Manage your fleet trailers.</p>
        </div>
        {view === "list" ? (
          <Button
            onClick={() => {
              resetForm();
              setEditingId(null);
              setView("form");
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Trailer
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
            {filteredTrailers.map((trailer) => (
              <Card key={trailer._id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <TrailerIcon className="h-4 w-4 text-blue-700" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      {trailer.licensePlate}
                    </CardTitle>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      trailer.status === "available"
                        ? "bg-green-100 text-green-800"
                        : trailer.status === "maintenance"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {trailer.status}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <div>
                      {trailer.year} {trailer.brand}
                    </div>
                    <div className="capitalize">Type: {trailer.type}</div>
                    <div>
                      Capacity: {trailer.capacityWeight.toLocaleString()} kg
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => startEdit(trailer)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDelete(trailer._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredTrailers.length === 0 && (
              <div className="col-span-full text-center p-8 text-muted-foreground">
                No trailers found.
              </div>
            )}
          </div>
        </div>
      ) : (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Trailer" : "Add New Trailer"}
            </CardTitle>
            <CardDescription>Enter trailer details below.</CardDescription>
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
                  <Label>Capacity (kg)</Label>
                  <Input
                    type="number"
                    required
                    value={formData.capacityWeight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacityWeight: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) =>
                      setFormData({ ...formData, type: val as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="flatbed">Flatbed</SelectItem>
                      <SelectItem value="refrigerated">Refrigerated</SelectItem>
                      <SelectItem value="tanker">Tanker</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                {editingId ? "Update Trailer" : "Create Trailer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
