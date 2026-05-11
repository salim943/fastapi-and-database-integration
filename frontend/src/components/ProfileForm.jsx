import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createProfile,
  fetchProfiles,
  updateProfile
} from "../store/profileSlice";

export default function ProfileForm({
  selected,
  clearSelection,
  user,
  existingProfile
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: ""
  });

  // Fill form when editing
  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name || "",
        email: selected.email || "",
        description: selected.description || ""
      });
    }
  }, [selected]);

  // Submit handler
  const submit = async () => {
    // basic validation
    if (!form.name || !form.email) return;

    if (selected) {
      // UPDATE
      await dispatch(
        updateProfile({ id: selected.id, data: form })
      );
      clearSelection();
    } else {
      // CREATE
      await dispatch(createProfile(form));
    }

    dispatch(fetchProfiles());
    setForm({ name: "", email: "", description: "" });
  };

  // 🚫 Hide create form for normal user if profile already exists
  if (user.role !== "admin" && existingProfile) {
    return null;
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-md mb-5">
      <h3 className="text-xl font-semibold mb-4">
        {selected ? "Update Profile" : "Create Profile"}
      </h3>

      <div className="flex flex-col gap-3">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={submit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          {selected ? "Update" : "Create"}
        </button>

        {/* Cancel edit mode */}
        {selected && (
          <button
            onClick={clearSelection}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}