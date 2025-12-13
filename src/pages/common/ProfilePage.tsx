import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiMethods } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
// import type { RootState } from "@/store"; // Need to check where RootState defines, usually store/index.ts

export function ProfilePage() {
    const { user } = useSelector((state: any) => state.auth); // Using any temporarily for RootState/Auth structure compat
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Password Form State
    const [passData, setPassData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Profile Info State
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (user?._id) {
            apiMethods.users.getById(user._id)
                .then(res => setEmail(res.data.email))
                .catch(err => console.error(err));
        }
    }, [user]);

    const handlePassChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (passData.newPassword !== passData.confirmPassword) {
            setMessage({ type: 'error', text: "New passwords do not match" });
            return;
        }

        try {
            setLoading(true);
            await apiMethods.users.changePassword(user!._id, {
                oldPassword: passData.oldPassword,
                newPassword: passData.newPassword
            });
            setMessage({ type: 'success', text: "Password updated successfully" });
            setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || "Failed to update password" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl space-y-6">
            <h1 className="text-3xl font-bold">My Profile</h1>

            {/* Profile Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Your account details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input value={email} disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Role</Label>
                        <div className="capitalize font-medium">{user?.role}</div>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your secure password.</CardDescription>
                </CardHeader>
                <CardContent>
                    {message && (
                        <div className={`p-4 mb-4 rounded-md flex items-center gap-2 ${message.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-green-100 text-green-800'}`}>
                            {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handlePassChange} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="oldPass">Current Password</Label>
                            <Input
                                id="oldPass"
                                type="password"
                                value={passData.oldPassword}
                                onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="newPass">New Password</Label>
                            <Input
                                id="newPass"
                                type="password"
                                value={passData.newPassword}
                                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPass">Confirm New Password</Label>
                            <Input
                                id="confirmPass"
                                type="password"
                                value={passData.confirmPassword}
                                onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
