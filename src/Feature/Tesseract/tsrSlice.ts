import { createSlice } from "@reduxjs/toolkit";

const TsrSlice = createSlice({
  name: "Tsr",
  initialState: {
    value: {
      textExc: "",
      textShow: "",
    },
  },
  reducers: {
    setTxtExc: (state, action) => {
      state.value.textExc = action.payload;
    },
    setTxtShow: (state, action) => {
      state.value.textShow = action.payload;
    },
  },
});

const tsrReducer = TsrSlice.reducer;
export const tsrAction = { ...TsrSlice.actions };
export default tsrReducer;
