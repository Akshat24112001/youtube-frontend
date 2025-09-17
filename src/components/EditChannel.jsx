import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utiles/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utiles/userSlice";

// component for editing channel details
export default function EditChannel({ channel, onClose, onUpdate }) {
  // states for fields
  const [channelName, setChannelName] = useState(channel?.channelName || "");
  const [description, setDescription] = useState(channel?.description || "");
  const [channelAvatar, setChannelAvatar] = useState(null);
  const [channelBanner, setChannelBanner] = useState(null);

  // states for managing request
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const user=useSelector(store=>store.user.user);
const dispatch=useDispatch();

// handle submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // validation: prevent empty fields
  if (!channelName.trim()) {
    setError("Channel name cannot be empty");
    return;
  }
  if (!description.trim()) {
    setError("Description cannot be empty");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  formData.append("channelName", channelName.trim());
  formData.append("description", description.trim());
  if (channelAvatar) formData.append("channelAvatar", channelAvatar);
  if (channelBanner) formData.append("channelBanner", channelBanner);

  try {
    const res = await axiosInstance.put(`/channel/edit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // updating the user in the redux store too
          const updatedUser = {
          ...user,
          channelAvatar: res.data.channel.channelAvatar
        };
    
    dispatch(addUser(updatedUser)); // directly update store
    onUpdate(res.data.channel); // update parent with new data
    toast.success("Channel updated successfully");
    onClose(); // close dialog
  } catch (err) {
    toast.error(
      err.response?.data?.message || err.message || "Something went wrong"
    );
    setError(err.response?.data?.message || "Failed to update channel");
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Channel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Channel Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Channel Name
          </label>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter channel name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter channel description"
          />
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Channel Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setChannelAvatar(e.target.files[0])}
            className="block w-full text-sm text-gray-900 border rounded-lg cursor-pointer bg-gray-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Channel Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setChannelBanner(e.target.files[0])}
            className="block w-full text-sm text-gray-900 border rounded-lg cursor-pointer bg-gray-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
