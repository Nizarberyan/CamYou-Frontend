import { useState, useEffect } from "react";
import { apiMethods } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Key, User as UserIcon, Loader2, AlertCircle } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface User {
    _id: string;
    email: string;
    role: string;
    createdAt: string;
}

export function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'list' | 'create'>('list');

    // Create Form State
    const [newUser, setNewUser] = useState({ email: "", password: "", role: "driver" });
    const [createLoading, setCreateLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await apiMethods.users.getAll();
            setUsers(res.data);
            setError(null);
        } catch (err: any) {
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await apiMethods.users.delete(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            await apiMethods.users.create(newUser);
            setView('list');
            setNewUser({ email: "", password: "", role: "driver" });
            fetchUsers(); // Refresh list
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create user");
        } finally {
            setCreateLoading(false);
        }
    };

    if (loading && view === 'list') {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8" /></div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">User Management</h1>
                {view === 'list' && (
                    <Button onClick={() => setView('create')}>
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                )}
                {view === 'create' && (
                    <Button variant="outline" onClick={() => setView('list')}>
                        Cancel
                    </Button>
                )}
            </div>

            {error && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}

            {view === 'list' ? (
                <div className="grid gap-4">
                    {users.map(user => (
                        <Card key={user._id}>
                            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <UserIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{user.email}</div>
                                        <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
                                        <div className="text-xs text-muted-foreground">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    {/* Future: Edit User / Reset Pass Modal */}
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(user._id)}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {users.length === 0 && <div className="text-center text-muted-foreground p-10">No users found.</div>}
                </div>
            ) : (
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Create New User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    required
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Role</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={val => setNewUser({ ...newUser, role: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="driver">Driver</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="dispatcher">Dispatcher</SelectItem>
                                        <SelectItem value="mechanic">Mechanic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full" disabled={createLoading}>
                                {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create User
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
