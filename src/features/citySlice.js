import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCity: {
    name: "Hyderabad",
    lat: 17.385044,
    lng: 78.486671,
  },
  pageNo: 0,
};

export const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
      state.pageNo = 0;
    },
    setPageNo: (state, action) => {
      state.pageNo = action.payload;
    },
  },
});

export const { setSelectedCity, setPageNo } = citySlice.actions;
export default citySlice.reducer;
