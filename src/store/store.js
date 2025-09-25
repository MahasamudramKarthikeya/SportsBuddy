import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "../features/citySlice";

export const store = configureStore({
  reducer: {
    city: cityReducer,
  },
});
