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
    Disc as TireIcon,
    Edit,
    Search,
    AlertCircle,
    Loader2,
    Link as LinkIcon,
    ArrowLeft,
    History,
    X,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Tire } from "@/types/tire.types";
import type { Truck } from "@/types/truck.types";
import type { Trailer } from "@/types/trailer.types";
import { WearProgressBar } from "@/components/WearProgressBar";

export function TiresPage() {
    const navigate = useNavigate();
    const [tires, setTires] = useState<Tire[]>([]);
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [trailers, setTrailers] = useState<Trailer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<"list" | "form">("list");
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState<Partial<Tire>>({
        serialNumber: "",
        brand: "",
        size: "",
        status: "spare",
        condition: "new",
        treadDepth: 0,
        assignedTo: undefined,
        assignedToModel: undefined,
        position: "",
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [historyTire, setHistoryTire] = useState<Tire | null>(null);
    const [tireHistory, setTireHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const [historyFormOpen, setHistoryFormOpen] = useState(false);
    const [historyFormData, setHistoryFormData] = useState({
        treadDepth: 0,
        type: "inspection",
        notes: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tiresRes, trucksRes, trailersRes] = await Promise.all([
                apiMethods.tires.getAll(),
                apiMethods.trucks.getAll(),
                apiMethods.trailers.getAll(),
            ]);
            setTires(tiresRes);
            setTrucks(trucksRes);
            setTrailers(trailersRes);
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
            // Logic to handle unassignment cleanup
            const payload = { ...formData };
            if (!payload.assignedTo) {
                payload.assignedTo = undefined; // Ensure undefined implies unassigned in backend if handled, or null
                payload.assignedToModel = undefined;
                payload.position = undefined;
            }

            // Auto-update status if assigned
            if (payload.assignedTo && payload.status === "spare") {
                payload.status = "in_use";
            }

            if (editingId) {
                await apiMethods.tires.update(editingId, payload);
            } else {
                await apiMethods.tires.create(payload);
            }
            setView("list");
            setEditingId(null);
            resetForm();
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save tire");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tire?")) return;
        try {
            await apiMethods.tires.delete(id);
            setTires(tires.filter((t) => t._id !== id));
        } catch (err) {
            alert("Failed to delete tire");
        }
    };

    const startEdit = (tire: Tire) => {
        let assignedToId: string | undefined = undefined;
        if (tire.assignedTo) {
            // Extract ID if it's a populated object
            assignedToId =
                typeof tire.assignedTo === "object"
                    ? (tire.assignedTo as any)._id
                    : tire.assignedTo;
        }

        setFormData({
            serialNumber: tire.serialNumber,
            brand: tire.brand,
            size: tire.size,
            status: tire.status,
            condition: tire.condition,
            treadDepth: tire.treadDepth,
            assignedTo: assignedToId,
            assignedToModel: tire.assignedToModel || undefined,
            position: tire.position || "",
        });
        setEditingId(tire._id);
        setView("form");
    };

    const resetForm = () => {
        setFormData({
            serialNumber: "",
            brand: "",
            size: "",
            status: "spare",
            condition: "new",
            treadDepth: 0,
            assignedTo: undefined,
            assignedToModel: undefined,
            position: "",
        });
    };

    const openHistory = async (tire: Tire) => {
        setHistoryTire(tire);
        setHistoryModalOpen(true);
        setHistoryLoading(true);
        // Reset history form
        setHistoryFormOpen(false);
        setHistoryFormData({
            treadDepth: tire.treadDepth,
            type: "inspection",
            notes: "",
        });

        try {
            const history = await apiMethods.tires.getHistory(tire._id);
            setTireHistory(history);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch tire history");
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleAddHistoryLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!historyTire) return;

        setHistoryLoading(true);
        try {
            await apiMethods.tires.addHistory(historyTire._id, {
                treadDepth: historyFormData.treadDepth,
                type: historyFormData.type,
                notes: historyFormData.notes
            });

            // Refresh history and tire data (since tread depth might update)
            const history = await apiMethods.tires.getHistory(historyTire._id);
            setTireHistory(history);
            fetchData(); // Update the main list in background
            setHistoryFormOpen(false);

            // Update local tire state for display if needed
            setHistoryTire(prev => prev ? ({ ...prev, treadDepth: historyFormData.treadDepth }) : null);

        } catch (err) {
            alert("Failed to add history log");
        } finally {
            setHistoryLoading(false);
        }
    };

    const filteredTires = tires.filter(
        (t) =>
            t.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.brand.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Helper to get name of assigned resource
    const getAssignedName = (tire: Tire) => {
        if (!tire.assignedTo) return "Unassigned";

        // Handle populated object (if backend populates it)
        if (typeof tire.assignedTo === "object" && (tire.assignedTo as any)._id) {
            const assigned: any = tire.assignedTo;
            if (tire.assignedToModel === "Truck") {
                // Check if it has truck properties like brand or vehicleModel
                const name = assigned.brand
                    ? `${assigned.brand} ${assigned.vehicleModel || ""}`
                    : "Truck";
                return `${name} (${assigned.licensePlate})`;
            } else {
                return `${assigned.type || "Trailer"} (${assigned.licensePlate})`;
            }
        }

        // Handle string ID (fallback)
        if (tire.assignedToModel === "Truck") {
            const truck = trucks.find((t) => t._id === tire.assignedTo);
            return truck ? `${truck.brand} (${truck.licensePlate})` : "Unknown Truck";
        } else if (tire.assignedToModel === "Trailer") {
            const trailer = trailers.find((t) => t._id === tire.assignedTo);
            return trailer
                ? `${trailer.type} (${trailer.licensePlate})`
                : "Unknown Trailer";
        }
        return "Unknown";
    };

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
                    <h1 className="text-3xl font-bold">Tire Management</h1>
                    <p className="text-muted-foreground">
                        Manage your fleet tires inventory.
                    </p>
                </div>
                {view === "list" ? (
                    <Button
                        onClick={() => {
                            resetForm();
                            setEditingId(null);
                            setView("form");
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Tire
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
                            placeholder="Search by Serial or Brand..."
                            className="pl-8 max-w-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredTires.map((tire) => (
                            <Card key={tire._id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <TireIcon className="h-4 w-4 text-orange-700" />
                                        </div>
                                        <CardTitle className="text-base font-semibold">
                                            {tire.serialNumber}
                                        </CardTitle>
                                    </div>
                                    <div
                                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${tire.status === "in_use"
                                            ? "bg-green-100 text-green-800"
                                            : tire.status === "maintenance"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {tire.status.replace("_", " ")}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm space-y-1 text-muted-foreground mb-3">
                                        <div>
                                            {tire.brand} - {tire.size}
                                        </div>
                                        <div className="capitalize">
                                            Condition: {tire.condition}
                                        </div>
                                        <div>Tread: {tire.treadDepth} mm</div>
                                    </div>

                                    <div className="mb-3">
                                        <WearProgressBar
                                            label="Tread Depth"
                                            current={tire.treadDepth}
                                            max={12} // Assuming 12mm is standard new tread
                                            inverse={true} // Higher is better
                                            unit="mm"
                                        />
                                    </div>

                                    {tire.assignedTo && (
                                        <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md mb-3">
                                            <LinkIcon className="h-3 w-3" />
                                            <span className="truncate">
                                                {tire.position ? `${tire.position} on ` : ""}{" "}
                                                {getAssignedName(tire)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => openHistory(tire)}
                                        >
                                            <History className="h-4 w-4 mr-2" /> History
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => startEdit(tire)}
                                        >
                                            <Edit className="h-4 w-4 mr-2" /> Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleDelete(tire._id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {filteredTires.length === 0 && (
                            <div className="col-span-full text-center p-8 text-muted-foreground">
                                No tires found.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Card className="max-w-xl mx-auto">
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit Tire" : "Add New Tire"}</CardTitle>
                        <CardDescription>Enter tire details below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Serial Number</Label>
                                    <Input
                                        required
                                        value={formData.serialNumber}
                                        onChange={(e) =>
                                            setFormData({ ...formData, serialNumber: e.target.value })
                                        }
                                    />
                                </div>
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
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Size (e.g., 295/80R22.5)</Label>
                                    <Input
                                        required
                                        value={formData.size}
                                        onChange={(e) =>
                                            setFormData({ ...formData, size: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tread Depth (mm)</Label>
                                    <Input
                                        type="number"
                                        required
                                        value={formData.treadDepth}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                treadDepth: parseFloat(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Condition</Label>
                                    <Select
                                        value={formData.condition}
                                        onValueChange={(val) =>
                                            setFormData({ ...formData, condition: val as any })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="good">Good</SelectItem>
                                            <SelectItem value="worn">Worn</SelectItem>
                                            <SelectItem value="damaged">Damaged</SelectItem>
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
                                            <SelectItem value="in_use">In Use</SelectItem>
                                            <SelectItem value="spare">Spare</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="scrap">Scrap</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Assignment Section */}
                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4" /> Vehicle Assignment
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Assigned To</Label>
                                        <Select
                                            value={formData.assignedToModel || "None"}
                                            onValueChange={(val) => {
                                                const model =
                                                    val === "None"
                                                        ? undefined
                                                        : (val as "Truck" | "Trailer");
                                                setFormData({
                                                    ...formData,
                                                    assignedToModel: model,
                                                    assignedTo: undefined, // Reset assigned vehicle when type changes
                                                    position: "",
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Not assigned" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="None">None (Unassigned)</SelectItem>
                                                <SelectItem value="Truck">Truck</SelectItem>
                                                <SelectItem value="Trailer">Trailer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {formData.assignedToModel && (
                                        <>
                                            <div className="space-y-2">
                                                <Label>Select {formData.assignedToModel}</Label>
                                                <Select
                                                    value={formData.assignedTo || ""}
                                                    onValueChange={(val) =>
                                                        setFormData({ ...formData, assignedTo: val })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={`Select ${formData.assignedToModel}`}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {formData.assignedToModel === "Truck"
                                                            ? trucks.map((truck) => (
                                                                <SelectItem key={truck._id} value={truck._id}>
                                                                    {truck.brand} {truck.vehicleModel} (
                                                                    {truck.licensePlate})
                                                                </SelectItem>
                                                            ))
                                                            : trailers.map((trailer) => (
                                                                <SelectItem
                                                                    key={trailer._id}
                                                                    value={trailer._id}
                                                                >
                                                                    {trailer.type} ({trailer.licensePlate})
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Position on Vehicle (e.g. Front Right)</Label>
                                                <Input
                                                    value={formData.position}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            position: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter position..."
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={formLoading}>
                                {formLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editingId ? "Update Tire" : "Create Tire"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
            {/* History Modal */}
            {historyModalOpen && historyTire && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <History className="h-5 w-5" /> Tire History
                                </h2>
                                <p className="text-muted-foreground text-sm mt-1">
                                    History for {historyTire.brand} ({historyTire.serialNumber})
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setHistoryModalOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="px-6 py-4 flex-shrink-0 bg-muted/20 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold">Activity Log</h3>
                                {!historyFormOpen && (
                                    <Button size="sm" onClick={() => setHistoryFormOpen(true)} variant="outline">
                                        <Plus className="h-3 w-3 mr-1" /> Log Event
                                    </Button>
                                )}
                            </div>

                            {historyFormOpen && (
                                <form onSubmit={handleAddHistoryLog} className="mt-4 p-4 border rounded-md bg-background space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Event Type</Label>
                                            <Select
                                                value={historyFormData.type}
                                                onValueChange={(val) => setHistoryFormData({ ...historyFormData, type: val })}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="inspection">Inspection</SelectItem>
                                                    <SelectItem value="repair">Repair</SelectItem>
                                                    <SelectItem value="replacement">Replacement</SelectItem>
                                                    <SelectItem value="rotation">Rotation</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Tread Depth (mm)</Label>
                                            <Input
                                                type="number"
                                                className="h-8"
                                                required
                                                value={historyFormData.treadDepth}
                                                onChange={(e) => setHistoryFormData({ ...historyFormData, treadDepth: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Notes</Label>
                                        <Input
                                            className="h-8"
                                            placeholder="Details about this event..."
                                            value={historyFormData.notes}
                                            onChange={(e) => setHistoryFormData({ ...historyFormData, notes: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-1">
                                        <Button size="sm" variant="ghost" type="button" onClick={() => setHistoryFormOpen(false)}>Cancel</Button>
                                        <Button size="sm" type="submit" disabled={historyLoading}>
                                            {historyLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Log"}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {historyLoading && !historyFormOpen ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="animate-spin h-8 w-8" />
                                </div>
                            ) : tireHistory.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
                                    No history records found for this tire.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="relative border-l ml-2 space-y-6 pl-6">
                                        {tireHistory.map((record, index) => (
                                            <div key={index} className="relative">
                                                <div className="absolute -left-[31px] bg-background border rounded-full p-1">
                                                    <div className="bg-primary/20 p-1 rounded-full">
                                                        <div className="h-2 w-2 bg-primary rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                    <div>
                                                        <div className="font-semibold text-sm">
                                                            {new Date(record.date).toLocaleDateString(
                                                                undefined,
                                                                {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                },
                                                            )}
                                                        </div>
                                                        <div className="text-sm font-medium mt-1 capitalize text-primary">
                                                            Type: {record.type}
                                                        </div>
                                                        {record.notes && (
                                                            <div className="text-sm text-muted-foreground mt-1">
                                                                {record.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="bg-muted px-3 py-1 rounded text-sm font-mono whitespace-nowrap">
                                                        Tread:{" "}
                                                        <span className="font-bold">
                                                            {record.treadDepth}
                                                        </span>{" "}
                                                        mm
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-muted/20 text-xs text-muted-foreground text-center">
                            History is automatically recorded when tread depth is updated.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
