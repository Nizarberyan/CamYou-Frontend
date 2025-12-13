import { useState } from "react";
import { X } from "lucide-react";

interface TripCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    endMileage: number;
    fuelAdded?: number;
    notes?: string;
  }) => void;
  loading?: boolean;
}

export default function TripCompletionModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: TripCompletionModalProps) {
  const [endMileage, setEndMileage] = useState("");
  const [fuelAdded, setFuelAdded] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      endMileage: Number(endMileage),
      fuelAdded: fuelAdded ? Number(fuelAdded) : undefined,
      notes: notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background w-full max-w-md rounded-lg shadow-xl border">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Complete Trip</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              End Mileage <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter final odometer reading"
              value={endMileage}
              onChange={(e) => setEndMileage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Fuel Added (L)
            </label>
            <input
              type="number"
              min="0"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Optional"
              value={fuelAdded}
              onChange={(e) => setFuelAdded(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Notes
            </label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any issues or comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !endMileage}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4"
            >
              {loading ? "Completing..." : "Complete Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
