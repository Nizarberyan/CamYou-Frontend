import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiMethods } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
// import type { RootState } from "@/store"; // Need to check where RootState defines, usually store/index.ts

export function ProfilePage() {
  const { user } = useSelector((state: any) => state.auth); // Using any temporarily for RootState/Auth structure compat
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password Form State
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Profile Info State
  const [profileData, setProfileData] = useState({
    name: "",
    licenseNumber: "",
    email: "",
    role: "",
  });

  // ... inside ProfilePage component
  const [photoLoading, setPhotoLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (user?._id) {
      apiMethods.users
        .getById(user._id)
        .then((res) => {
          setProfileData({
            name: res.data.name,
            licenseNumber: res.data.licenseNumber || "",
            email: res.data.email,
            role: res.data.role
          });
          setProfileImage(res.data.profileImage || "");
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?._id) return;

    try {
      setPhotoLoading(true);
      const res = await apiMethods.users.uploadPhoto(user._id, file);
      setProfileImage(res.data.profileImage);
      setMessage({ type: "success", text: "Profile photo updated!" });
      // Ideally dispatch an action to update redux state if user info is stored there
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to upload photo" });
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      setLoading(true);
      await apiMethods.users.update(user!._id, {
        name: profileData.name,
        licenseNumber: profileData.licenseNumber,
      });
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (passData.newPassword !== passData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      await apiMethods.users.changePassword(user!._id, {
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword,
      });
      setMessage({ type: "success", text: "Password updated successfully" });
      setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {message && (
        <div
          className={`p-4 rounded-md flex items-center gap-2 ${message.type === "error" ? "bg-destructive/15 text-destructive" : "bg-green-100 text-green-800"}`}
        >
          {message.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6 gap-4">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-secondary flex items-center justify-center border-2 border-primary/10">
              {profileImage ? (
                <img
                  src={`http://localhost:3000/${profileImage}`}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {profileData.name.charAt(0).toUpperCase()}
                </span>
              )}
              {photoLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="flex items-center">
              <Input
                type="file"
                id="photo-upload"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <Label
                htmlFor="photo-upload"
                className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground h-9 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors"
              >
                Change Photo
              </Label>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input
                value={profileData.name}
                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={profileData.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>

            {profileData.role === 'driver' && (
              <div className="grid gap-2">
                <Label>License Number</Label>
                <Input
                  value={profileData.licenseNumber}
                  onChange={e => setProfileData({ ...profileData, licenseNumber: e.target.value })}
                  placeholder="Driver License #"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label>Role</Label>
              <div className="capitalize font-medium px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                {profileData.role}
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
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
            <div
              className={`p-4 mb-4 rounded-md flex items-center gap-2 ${message.type === "error" ? "bg-destructive/15 text-destructive" : "bg-green-100 text-green-800"}`}
            >
              {message.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
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
                onChange={(e) =>
                  setPassData({ ...passData, oldPassword: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPass">New Password</Label>
              <Input
                id="newPass"
                type="password"
                value={passData.newPassword}
                onChange={(e) =>
                  setPassData({ ...passData, newPassword: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPass">Confirm New Password</Label>
              <Input
                id="confirmPass"
                type="password"
                value={passData.confirmPassword}
                onChange={(e) =>
                  setPassData({ ...passData, confirmPassword: e.target.value })
                }
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
