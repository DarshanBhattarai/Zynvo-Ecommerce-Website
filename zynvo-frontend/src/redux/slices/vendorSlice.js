// src/redux/slices/vendorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to send vendor request
export const sendVendorRequest = createAsyncThunk(
  "vendor/sendRequest",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/vendor/request", requestData);
      return response.data; // expected: { message, vendorStatus, vendorData }
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to send vendor request");
    }
  }
);

// Async thunk to fetch vendor profile/data
export const fetchVendorProfile = createAsyncThunk(
  "vendor/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/vendor/profile/${userId}`);
      return response.data; // expected: vendor profile object
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to fetch vendor profile");
    }
  }
);

// Slice
const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    profile: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    requestStatus: null, // e.g. 'pending', 'approved', 'rejected'
    requestLoading: false,
    requestError: null,
  },
  reducers: {
    clearVendorState(state) {
      state.profile = null;
      state.status = "idle";
      state.error = null;
      state.requestStatus = null;
      state.requestLoading = false;
      state.requestError = null;
    },
    setRequestStatus(state, action) {
      state.requestStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Send vendor request
    builder
      .addCase(sendVendorRequest.pending, (state) => {
        state.requestLoading = true;
        state.requestError = null;
      })
      .addCase(sendVendorRequest.fulfilled, (state, action) => {
        state.requestLoading = false;
        state.requestStatus = action.payload.vendorStatus; // e.g. 'pending'
      })
      .addCase(sendVendorRequest.rejected, (state, action) => {
        state.requestLoading = false;
        state.requestError = action.payload;
      });

    // Fetch vendor profile
    builder
      .addCase(fetchVendorProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearVendorState, setRequestStatus } = vendorSlice.actions;

export default vendorSlice.reducer;
