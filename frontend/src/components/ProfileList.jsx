import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfiles,
  setPage,
  setSearch,
  deleteProfile
} from "../store/profileSlice";
import ProfileForm from "./ProfileForm";

export default function ProfileList() {
  const dispatch = useDispatch();

  // Redux state
  const { profiles, loading, page, total, limit, search } =
    useSelector((s) => s.profile);

  // Local state
  const [selected, setSelected] = useState(null);

  // ⚠️ TEMP USER (replace with auth later)
  const user = {
    id: 1,
    role: "admin" // change to "user" to test
  };

  // FETCH WHEN PAGE OR SEARCH CHANGES
  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch, page, search]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-4xl mx-auto my-8 bg-gray-100 p-8 rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">
        Profile Manager Dashboard
      </h1>

      {/* FORM */}
      <ProfileForm
        selected={selected}
        clearSelection={() => setSelected(null)}
        user={user}
        existingProfile={
          profiles.some((p) => p.user_id === user.id)
        }
      />

      {/* SEARCH */}
      <input
        placeholder="Search users..."
        className="w-full p-3 mb-5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => {
          dispatch(setSearch(e.target.value));
          dispatch(setPage(1)); // reset page on search
        }}
      />

      {/* LOADING */}
      {loading && (
        <p className="text-gray-600">Loading...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && profiles.length === 0 && (
        <p className="text-gray-500">
          No profiles found.
        </p>
      )}

      {/* PROFILE LIST */}
      <div className="space-y-4">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="bg-white p-5 rounded-xl shadow-sm"
          >
            <h3 className="text-xl font-semibold">
              {p.name}
            </h3>

            <p className="text-gray-700">{p.email}</p>

            <p className="text-gray-600 mt-1">
              {p.description}
            </p>

            <div className="mt-4 flex gap-3">
              {/* 👑 EDIT BUTTON (ADMIN OR OWNER) */}
              {(user.role === "admin" ||
                user.id === p.user_id) && (
                <button
                  onClick={() => setSelected(p)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Edit
                </button>
              )}

              {/* 👑 DELETE BUTTON (ADMIN OR OWNER) */}
              {(user.role === "admin" ||
                user.id === p.user_id) && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  onClick={async () => {
                    await dispatch(deleteProfile(p.id));
                    setSelected(null);
                    dispatch(fetchProfiles());
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex items-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => dispatch(setPage(page - 1))}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          {page}/{totalPages || 1}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => dispatch(setPage(page + 1))}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}