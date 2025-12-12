import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function RootLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-primary/20">
            <Navbar />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
