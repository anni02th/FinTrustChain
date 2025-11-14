import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { users as usersApi } from "../api/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [bio, setBio] = useState(user?.bio || "");
  const [upiId, setUpiId] = useState(user?.upiId || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const previewSrc = user?.avatarUrl ? (user.avatarUrl.startsWith("http") ? user.avatarUrl : `/img/users/${user.avatarUrl}`) : null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      if (avatarFile) fd.append("avatar", avatarFile, avatarFile.name);
      if (upiId) fd.append("upiId", upiId);
      if (bio) fd.append("bio", bio);

      const res = await usersApi.updateMe(fd);
      toast.success("Profile updated");
      await refreshUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-max py-28">
      <div className="max-w-2xl mx-auto card p-6 rounded">
        <h2 className="text-2xl font-semibold neon-text">Profile</h2>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/6 overflow-hidden flex items-center justify-center">
              {previewSrc ? <img src={previewSrc} alt="avatar" className="w-full h-full object-cover" /> : <div className="text-sm text-gray-400">No image</div>}
            </div>
            <div>
              <div className="font-medium">{user?.name}</div>
              <div className="text-sm text-gray-300">{user?.email}</div>
            </div>
          </div>

          <label className="text-sm text-gray-400">Upload avatar</label>
          <input type="file" accept="image/*" onChange={(e)=>setAvatarFile(e.target.files[0])} />

          <label className="text-sm text-gray-400">UPI ID</label>
          <input value={upiId} onChange={(e)=>setUpiId(e.target.value)} placeholder="example@upi" className="p-3 rounded bg-transparent border border-white/6" />

          <label className="text-sm text-gray-400">Bio</label>
          <textarea value={bio} onChange={(e)=>setBio(e.target.value)} rows={4} className="p-3 rounded bg-transparent border border-white/6" />

          <div className="flex gap-3">
            <button className="btn-neon p-3 rounded" disabled={loading}>{loading?"Saving...":"Save profile"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
