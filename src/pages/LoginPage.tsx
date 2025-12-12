import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, setError } from "@/features/auth/authSlice";
import type { User } from "@/types/auth.types";
import { useNavigate, Link } from "react-router-dom";
import authService from "@/services/auth/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, ArrowRight, Loader2 } from "lucide-react";
import volvoImg from "../assets/images/volvo.jpg";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/driver/dashboard");
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setError(null));
        try {
            const response = await authService.login({ email, password });
            console.log(response);
            dispatch(
                setCredentials({
                    user: response.user as unknown as User,
                    token: response.token,
                }),
            );
            if (response.user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/driver/dashboard");
            }
        } catch (err: any) {
            dispatch(
                setError(
                    err.response?.data?.message || "Login failed. Please try again.",
                ),
            );
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
            <div className="flex items-center justify-center py-12 bg-gradient-to-br from-background via-background to-secondary/30">
                <div className="mx-auto w-[350px] space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="mx-auto bg-primary text-primary-foreground p-2 rounded-lg mb-2">
                            <Truck className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold">Welcome back</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email to sign in to your account
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to="#"
                                    className="ml-auto inline-block text-sm underline opacity-70 hover:opacity-100"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    Login
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="underline font-medium hover:text-primary">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative overflow-hidden">
                <img
                    src={volvoImg}
                    alt="Image"
                    className="h-full w-full object-cover dark:brightness-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12 text-white">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Streamline Your Logistics</h2>
                        <p className="text-lg text-gray-200">Manage your entire fleet from a single, intuitive dashboard.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
