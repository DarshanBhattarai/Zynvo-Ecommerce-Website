import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Upload helper
const uploadToCloudinary = async (file) => {
  const sigRes = await fetch("http://localhost:5000/api/cloudinary/signature", {
    credentials: "include",
  });
  const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("upload_preset", "zynvo_uploads");

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const uploadRes = await fetch(uploadUrl, { method: "POST", body: formData });

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json();
    throw new Error(errorData.error?.message || "Cloudinary upload failed");
  }
  return (await uploadRes.json()).secure_url;
};

// Async thunk: send vendor request
export const sendVendorRequest = createAsyncThunk(
  "vendor/sendRequest",
  async (requestData, { rejectWithValue }) => {
    try {
      const logoUrl = await uploadToCloudinary(requestData.logoFile);
      const payload = { ...requestData, logo: logoUrl };
      delete payload.logoFile;

      const response = await axios.post(
        "http://localhost:5000/api/moderator/request",
        payload,
        { withCredentials: true }
      );
      return response.data; // { message, vendor }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk: fetch vendor profile
export const fetchVendorProfile = createAsyncThunk(
  "vendor/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/moderator/profile/${userId}`,
        { withCredentials: true }
      );
      return response.data; // vendor object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    profile: null,
    status: "idle",
    error: null,
    requestStatus: null,
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
    builder
      // Send request
      .addCase(sendVendorRequest.pending, (state) => {
        state.requestLoading = true;
        state.requestError = null;
      })
      .addCase(sendVendorRequest.fulfilled, (state, action) => {
        state.requestLoading = false;
        state.requestStatus = action.payload.vendor?.status?.toLowerCase() || null;
      })
      .addCase(sendVendorRequest.rejected, (state, action) => {
        state.requestLoading = false;
        state.requestError = action.payload;
      })

      // Fetch profile
      .addCase(fetchVendorProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        state.requestStatus = action.payload?.status?.toLowerCase() || null;
      })
      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearVendorState, setRequestStatus } = vendorSlice.actions;
export default vendorSlice.reducer;
