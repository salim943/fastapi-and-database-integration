import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/client"; // keep this


// ======================
// FETCH PROFILES
// ======================
export const fetchProfiles = createAsyncThunk(
  "profile/fetchProfiles",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState().profile;

    const res = await api.get("/profiles/", {
      params: {
        page: state.page,
        limit: state.limit,
        search: state.search
      }
    });

    return res.data;
  }
);

// ======================
// CREATE PROFILE
// ======================
export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (data) => {
    const res = await api.post("/profiles/", data);
    return res.data;
  }
);

// ======================
// UPDATE PROFILE
// ======================
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ id, data }) => {
    const res = await api.put(`/profiles/${id}`, data);
    return res.data;
  }
);

// ======================
// DELETE PROFILE
// ======================
export const deleteProfile = createAsyncThunk(
  "profile/deleteProfile",
  async (id) => {
    await api.delete(`/profiles/${id}`);
    return id;
  }
);

// ======================
// INITIAL STATE
// ======================
const initialState = {
  profiles: [],
  loading: false,
  page: 1,
  total: 0,
  limit: 5,
  search: ""
};

// ======================
// SLICE
// ======================
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload.profiles || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchProfiles.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createProfile.fulfilled, (state, action) => {
        state.profiles.unshift(action.payload);
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        const index = state.profiles.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.profiles[index] = action.payload;
        }
      })

      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.profiles = state.profiles.filter(
          (p) => p.id !== action.payload
        );
      });
  }
});

export const { setPage, setSearch } = profileSlice.actions;
export default profileSlice.reducer;