import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapPreviewProps {
  origin: string;
  destination: string;
}

export function MapPreview({ origin, destination }: MapPreviewProps) {
  // Construct the Google Maps URL for viewing directions in a new tab
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    origin,
  )}&destination=${encodeURIComponent(destination)}`;

  // Construct the Embed URL
  // saddr = start address, daddr = destination address
  // output=embed gives us the iframe-able version
  const embedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(
    origin,
  )}&daddr=${encodeURIComponent(destination)}&hl=en&output=embed`;

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border shadow-sm h-[300px] bg-muted/20">
      <iframe
        title="Map Preview"
        width="100%"
        height="100%"
        className="w-full h-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
        src={embedUrl}
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
      />

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[1px]"
      >
        <Button
          variant="secondary"
          className="shadow-lg gap-2 pointer-events-none"
        >
          <ExternalLink className="h-4 w-4" />
          Open in Google Maps
        </Button>
      </a>
    </div>
  );
}
