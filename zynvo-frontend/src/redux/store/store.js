import { configureStore } from "@reduxjs/toolkit";
import vendorReducer from "../slices/vendorSlice.js";
import Logger from "redux-logger";
export const store = configureStore({
  reducer: {
    vendor: vendorReducer, // assign vendor reducer here
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(Logger),
});
