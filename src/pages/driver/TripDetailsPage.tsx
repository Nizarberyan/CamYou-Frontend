import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiMethods } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Truck,
  FileText,
  ArrowLeft,
  Clock,
  Navigation,
  User,
} from "lucide-react";
import type { Trip } from "@/types/trip.types";
import type { Truck as TruckType } from "@/types/truck.types";
import type { Trailer as TrailerType } from "@/types/trailer.types";
import TripCompletionModal from "../../components/driver/TripCompletionModal";
import { MapPreview } from "@/components/common/MapPreview";

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Action States
  const [actionLoading, setActionLoading] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      try {
        const data = await apiMethods.getTripById(id);
        setTrip(data);
      } catch (error) {
        console.error("Failed to fetch trip details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!trip) return;
    try {
      setDownloading(true);
      const blob = await apiMethods.downloadWorkOrder(trip._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `WorkOrder-${trip.tripNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download PDF", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusUpdate = async (status: string, data?: any) => {
    if (!trip) return;
    try {
      setActionLoading(true);
      const updatedTrip = await apiMethods.updateTripStatus(
        trip._id,
        status,
        data,
      );
      setTrip(updatedTrip);
      setIsCompletionModalOpen(false);
    } catch (error) {
      console.error(`Failed to update status to ${status}`, error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center bg-muted/20 mt-8 rounded-lg animate-pulse h-96 mx-8" />
    );
  if (!trip)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Trip not found
      </div>
    );

  const truck = trip.truck as TruckType;
  const trailer = trip.trailer as TrailerType | undefined;
  const driver = trip.driver as any; // Type assertion since User interface might be basic

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          className="pl-0 hover:pl-2 transition-all"
          asChild
        >
          <Link to={-1 as any}>
            {" "}
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Trip {trip.tripNumber}
              </h1>
              <Badge
                variant="outline"
                className="text-sm uppercase tracking-wider"
              >
                {trip.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(trip.scheduledDate).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <Button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full md:w-auto"
          >
            <FileText className="mr-2 h-4 w-4" />
            {downloading ? "Downloading..." : "Download Work Order"}
          </Button>
        </div>
      </div>

      {/* Route Card */}
      <Card className="overflow-hidden border-2 border-primary/10">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" /> Route Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Origin
            </p>
            <p className="text-lg font-semibold flex items-start gap-2">
              <MapPin className="h-5 w-5 text-green-500 mt-1 shrink-0" />
              {trip.startLocation}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Destination
            </p>
            <p className="text-lg font-semibold flex items-start gap-2">
              <MapPin className="h-5 w-5 text-red-500 mt-1 shrink-0" />
              {trip.endLocation}
            </p>
          </div>

          {/* Map Preview */}
          <div className="md:col-span-2">
            <MapPreview origin={trip.startLocation} destination={trip.endLocation} />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resource Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-5 w-5 text-primary" /> Vehicle & Equipment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Truck</span>
              <span className="font-medium">
                {truck?.brand} {truck?.vehicleModel} ({truck?.licensePlate})
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Trailer</span>
              <span className="font-medium">
                {trailer
                  ? `${trailer.type} (${trailer.licensePlate})`
                  : "None Assigned"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Driver</span>
              <span className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {driver?.name || "Unknown"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Status Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-primary" /> Timeline & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Scheduled</span>
              <span className="font-medium">
                {new Date(trip.scheduledDate).toLocaleTimeString()}
              </span>
            </div>
            {trip.startDate && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Started</span>
                <span className="font-medium">
                  {new Date(trip.startDate).toLocaleString()}
                </span>
              </div>
            )}
            {trip.endDate && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">
                  {new Date(trip.endDate).toLocaleString()}
                </span>
              </div>
            )}
            {trip.notes && (
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Notes
                </p>
                <p className="text-sm bg-muted p-2 rounded">{trip.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions Footer */}
      {!["completed", "cancelled"].includes(trip.status) && (
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
          {trip.status === "planned" && (
            <Button
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleStatusUpdate("in_progress")}
              disabled={actionLoading}
            >
              {actionLoading ? "Starting..." : "Start Trip"}
            </Button>
          )}

          {trip.status === "in_progress" && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() => setIsCompletionModalOpen(true)}
              disabled={actionLoading}
            >
              Complete Trip
            </Button>
          )}

          <Button
            variant="destructive"
            size="lg"
            className="sm:w-auto"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to cancel this trip?")
              ) {
                handleStatusUpdate("cancelled");
              }
            }}
            disabled={actionLoading}
          >
            Cancel Trip
          </Button>
        </div>
      )}

      <TripCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onConfirm={(data) => handleStatusUpdate("completed", data)}
        loading={actionLoading}
      />
    </div>
  );
}
