import { Link } from "react-router-dom";
import type { Trip } from "@/types/trip.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TripCardProps {
  trip: Trip;
  showAction?: boolean;
}

export function TripCard({ trip, showAction = false }: TripCardProps) {
  const getStatusColor = (status: Trip["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "in_progress":
        return "bg-blue-500 hover:bg-blue-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-slate-500 hover:bg-slate-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              {trip.tripNumber}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              {formatDate(trip.scheduledDate)}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(trip.status)}>
            {trip.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">From</p>
                <p className="text-muted-foreground">{trip.startLocation}</p>
              </div>
            </div>
            <div className="flex items-center justify-center my-1 text-muted-foreground">
              <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0 bg-secondary/50 rounded-full p-0.5 box-content" />
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">To</p>
                <p className="text-muted-foreground">{trip.endLocation}</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              className="w-full"
              variant={trip.status === "completed" ? "outline" : "default"}
              asChild
            >
              {/* Only show "Start Trip" if explicitly enabled AND status is planned */}
              {showAction && trip.status === "planned" ? (
                <Link to={`/trips/${trip._id}`}>Start Trip</Link>
              ) : (
                <Link to={`/trips/${trip._id}`}>View Details</Link>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
