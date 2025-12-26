"use client";

import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { AuthService } from "@/services/auth.service";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";

export default function Dashboard() {
  const { isAuthenticated, user, profile, loading, updateProfile } =
    useSupabaseAuth();
  const [imdbUrl, setImdbUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/auth/signin?redirect=${encodeURIComponent("/dashboard")}`);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="container py-24 text-center">
        <div className="text-h2 text-muted">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSaveImdb = async () => {
    setError("");

    if (!imdbUrl.trim()) {
      setError("Please enter a valid IMDb URL");
      return;
    }

    // Basic validation for IMDb URL
    if (!imdbUrl.includes("imdb.com/name/")) {
      setError(
        "Please enter a valid IMDb profile URL (e.g., https://www.imdb.com/name/nm0000123/)"
      );
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        imdb_profile_url: imdbUrl,
        imdb_synced: true,
      });
      setImdbUrl("");
    } catch (err: any) {
      setError(err.message || "Failed to save IMDb profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveImdb = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        imdb_profile_url: null,
        imdb_synced: false,
      });
    } catch (err: any) {
      setError(err.message || "Failed to remove IMDb profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNames = async () => {
    setProfileError("");
    setProfileSuccess("");
    setIsProfileSaving(true);

    try {
      await updateProfile({
        display_name: displayName.trim() || null,
        full_name: fullName.trim() || null,
      });
      setProfileSuccess("Names updated successfully!");
    } catch (err: any) {
      setProfileError(err.message || "Failed to update names");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleUpdateEmail = async () => {
    setProfileError("");
    setProfileSuccess("");

    if (!newEmail.trim()) {
      setProfileError("Please enter a new email address");
      return;
    }

    if (newEmail === user?.email) {
      setProfileError("New email is the same as current email");
      return;
    }

    setIsProfileSaving(true);
    try {
      await AuthService.updateEmail(newEmail);
      setProfileSuccess(
        "Email update initiated! Please check your new email for confirmation."
      );
      setNewEmail("");
    } catch (err: any) {
      setProfileError(err.message || "Failed to update email");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setProfileError("");
    setProfileSuccess("");

    if (!newPassword || !confirmPassword) {
      setProfileError("Please enter and confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setProfileError("Password must be at least 6 characters long");
      return;
    }

    setIsProfileSaving(true);
    try {
      await AuthService.updatePassword(newPassword);
      setProfileSuccess("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setProfileError(err.message || "Failed to update password");
    } finally {
      setIsProfileSaving(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-display">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-bold text-lg">
              {profile?.display_name || user?.email}
            </div>
            <div className="text-sm text-muted">{user?.email}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
            {(profile?.display_name || user?.email || "U")[0].toUpperCase()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <section className="glass-panel p-6 md:col-span-2">
          <h2 className="text-h3 mb-6">Profile Settings</h2>

          {profileError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-4">
              {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg mb-4">
              {profileSuccess}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted mt-1">
                This is the name shown to other users
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted mt-1">
                Your legal name for professional purposes
              </p>
            </div>

            <button
              onClick={handleUpdateNames}
              disabled={isProfileSaving}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProfileSaving ? "Saving..." : "Update Names"}
            </button>
          </div>

          <div className="border-t border-white/10 my-8"></div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Email
              </label>
              <div className="px-4 py-3 bg-surface/50 border border-white/5 rounded-lg text-muted">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                New Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted mt-1">
                You will need to verify your new email
              </p>
            </div>

            <button
              onClick={handleUpdateEmail}
              disabled={isProfileSaving || !newEmail.trim()}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProfileSaving ? "Updating..." : "Update Email"}
            </button>
          </div>

          <div className="border-t border-white/10 my-8"></div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              onClick={handleUpdatePassword}
              disabled={isProfileSaving || !newPassword || !confirmPassword}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProfileSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </section>

        {/* IMDb Integration */}
        <section className="glass-panel p-6">
          <h2 className="text-h3 mb-6">IMDb Integration</h2>

          {profile?.imdb_synced ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-surface/50 rounded-lg border border-primary/20">
                <span className="text-2xl">✓</span>
                <div className="flex-1">
                  <div className="font-bold text-primary">Connected</div>
                  <div className="text-xs text-muted truncate">
                    {profile.imdb_profile_url}
                  </div>
                </div>
              </div>

              <button
                onClick={handleRemoveImdb}
                disabled={isSaving}
                className="btn btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-full disabled:opacity-50"
              >
                {isSaving ? "Removing..." : "Disconnect IMDb"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-surface/50 rounded-lg border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎬</span>
                  <div>
                    <div className="font-bold">Not Connected</div>
                    <div className="text-xs text-muted">
                      Sync your IMDb profile to bid on projects
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  IMDb Profile URL
                </label>
                <input
                  type="url"
                  value={imdbUrl}
                  onChange={(e) => setImdbUrl(e.target.value)}
                  placeholder="https://www.imdb.com/name/nm0000123/"
                  className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              <button
                onClick={handleSaveImdb}
                disabled={isSaving || !imdbUrl.trim()}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Connecting..." : "Connect IMDb"}
              </button>

              <p className="text-xs text-muted">
                Enter your IMDb profile URL to verify your professional status
                and enable bidding on projects.
              </p>
            </div>
          )}
        </section>

        {/* My Pitches */}
        <section className="glass-panel p-6 md:col-span-3">
          <h2 className="text-h3 mb-6">My Pitches</h2>
          <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
            <p className="text-muted mb-4">
              You haven't created any pitches yet.
            </p>
            <Link href="/create-pitch" className="btn btn-primary">
              Create Pitch
            </Link>
          </div>
        </section>

        {/* Active Bids */}
        <section className="glass-panel p-6 md:col-span-3">
          <h2 className="text-h3 mb-6">Active Bids</h2>
          <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
            <p className="text-muted">
              {profile?.imdb_synced
                ? "No active bids found. Browse projects to place a bid!"
                : "Connect your IMDb profile to start bidding on projects."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
