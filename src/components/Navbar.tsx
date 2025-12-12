import { Link, useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";
import authService from "@/services/auth/auth.service";

export function Navbar() {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            dispatch(logout());
            navigate("/login");
        }
    };

    const dashboardLink = user?.role === "admin" ? "/admin/dashboard" : "/driver/dashboard";

    return (
        <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="container px-4 md:px-8 mx-auto">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-90 transition-opacity"
                    >
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                            <Truck className="h-5 w-5" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                            CamYou
                        </span>
                        <span className="text-foreground">Fleet</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={dashboardLink}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
