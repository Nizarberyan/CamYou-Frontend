import { useEffect, useState } from "react";
import { apiMethods } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, RefreshCw, BarChart3, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DailyReport {
    _id: string;
    date: string;
    totalMiles: number;
    totalFuel: number;
    activeTrips: number;
    completedTrips: number;
    createdAt: string;
}

export default function ReportsPage() {
    const [reports, setReports] = useState<DailyReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const data = await apiMethods.reports.getDaily(30); // Get last 30 days
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleGenerateReport = async () => {
        try {
            setGenerating(true);
            await apiMethods.reports.generate();
            await fetchReports();
        } catch (error) {
            console.error("Failed to generate report", error);
            alert("Failed to generate today's report");
        } finally {
            setGenerating(false);
        }
    };

    const handleDownloadPDF = async (id: string) => {
        try {
            const blob = await apiMethods.reports.downloadPDF(id);
            const url = window.URL.createObjectURL(new Blob([blob as any]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `report-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error("Failed to download PDF", error);
            alert("Failed to download PDF");
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Trip Reports</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of fleet performance and fuel consumption.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchReports} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={handleGenerateReport} disabled={generating}>
                        <Plus className="h-4 w-4 mr-2" />
                        {generating ? "Generating..." : "Generate Today's Report"}
                    </Button>
                </div>
            </div>

            {loading && reports.length === 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse h-40 bg-muted/50" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {reports.map((report) => (
                        <Card key={report._id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {new Date(report.date).toLocaleDateString(undefined, {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </CardTitle>
                                            <CardDescription>
                                                Generated at {new Date(report.createdAt).toLocaleTimeString()}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 pt-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase font-medium">Total Miles</span>
                                            <span className="text-xl font-bold font-mono">
                                                {report.totalMiles.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase font-medium">Fuel Used</span>
                                            <span className="text-xl font-bold font-mono">
                                                {report.totalFuel.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">L</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t pt-3">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Active Trips</span>
                                            <span className="font-medium flex items-center gap-1 mt-1">
                                                <Badge variant="outline" className="px-2 py-0.5">
                                                    {report.activeTrips ?? 0}
                                                </Badge>
                                            </span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-xs text-muted-foreground">Completed</span>
                                            <span className="font-medium flex items-center justify-end gap-1 mt-1">
                                                <Badge variant="secondary" className="px-2 py-0.5 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                                    {report.completedTrips ?? 0}
                                                </Badge>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t">
                                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownloadPDF(report._id)}>
                                            <Download className="mr-2 h-4 w-4" /> Download PDF
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && reports.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No reports found. Generate one to get started.</p>
                </div>
            )}
        </div>
    );
}
