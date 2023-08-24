import { configureStore } from "@reduxjs/toolkit";
import tsrReducer from "../Feature/Tesseract/tsrSlice";

const store = configureStore({
  reducer: {
    tsr: tsrReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
