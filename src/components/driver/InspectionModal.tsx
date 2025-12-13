import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2, ClipboardCheck } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { apiMethods } from "@/services/api";

type InspectionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    truckId: string;
    truckPlate: string;
    trailerId?: string;
    trailerPlate?: string;
    onSuccess: () => void;
};

export default function InspectionModal({
    isOpen,
    onClose,
    truckId,
    truckPlate,
    trailerId,
    trailerPlate,
    onSuccess,
}: InspectionModalProps) {
    const [loading, setLoading] = useState(false);
    const [targetVehicle, setTargetVehicle] = useState<"truck" | "trailer">(
        "truck",
    );
    const [status, setStatus] = useState<"good" | "issues_found">("good");
    const [notes, setNotes] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const vehicleId = targetVehicle === "truck" ? truckId : trailerId;
            const vehicleModel = targetVehicle === "truck" ? "Truck" : "Trailer";

            if (!vehicleId) {
                alert("No vehicle selected");
                return;
            }

            await apiMethods.maintenance.logInspection(vehicleId, {
                vehicleModel,
                status,
                notes,
            });

            alert("Inspection logged successfully!");
            setNotes("");
            setStatus("good");
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to log inspection");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background w-full max-w-md rounded-lg shadow-xl border animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Log Vehicle Inspection</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Vehicle to Inspect</label>
                        <div className="flex gap-4">
                            <div
                                className={`flex items-center gap-2 border p-3 rounded-md w-full cursor-pointer hover:bg-muted ${targetVehicle === "truck" ? "border-primary bg-primary/5" : ""}`}
                                onClick={() => setTargetVehicle("truck")}
                            >
                                <input
                                    type="radio"
                                    name="vehicle"
                                    checked={targetVehicle === "truck"}
                                    onChange={() => setTargetVehicle("truck")}
                                    className="accent-primary"
                                />
                                <span className="text-sm">Truck ({truckPlate})</span>
                            </div>

                            {trailerId && (
                                <div
                                    className={`flex items-center gap-2 border p-3 rounded-md w-full cursor-pointer hover:bg-muted ${targetVehicle === "trailer" ? "border-primary bg-primary/5" : ""}`}
                                    onClick={() => setTargetVehicle("trailer")}
                                >
                                    <input
                                        type="radio"
                                        name="vehicle"
                                        checked={targetVehicle === "trailer"}
                                        onChange={() => setTargetVehicle("trailer")}
                                        className="accent-primary"
                                    />
                                    <span className="text-sm">Trailer ({trailerPlate})</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Inspection Status</label>
                        <Select
                            value={status}
                            onValueChange={(v) => setStatus(v as any)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="good">All Good ✅</SelectItem>
                                <SelectItem value="issues_found">Issues Found ⚠️</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Notes & Observations</label>
                        <textarea
                            required={status === "issues_found"}
                            placeholder={
                                status === "good"
                                    ? "Optional notes..."
                                    : "Describe the issues found..."
                            }
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Report
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
