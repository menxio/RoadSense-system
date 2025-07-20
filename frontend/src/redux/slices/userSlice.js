import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

const initialState = {
  custom_id: "",
  name: "",
  school_id: "",
  avatarUrl: "",
  plate_number: "",
  vehicle_color: "",
  vehicle_type: "",
  email: "",
  role: "",
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found. Please log in.");
    }

    try {
      const response = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error.response); // Debugging
      return rejectWithValue(
        error.response?.data?.message || "Error fetching profile"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, ...action.payload };
    },
    clearUser(state) {
      localStorage.removeItem("token");
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.custom_id = action.payload.custom_id;
        state.phone_number = action.payload.phone_number;
        state.avatarUrl = action.payload.avatarUrl;
        state.plate_number = action.payload.plate_number;
        state.vehicle_color = action.payload.vehicle_color;
        state.vehicle_type = action.payload.vehicle_type;
        state.school_id = action.payload.school_id;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
