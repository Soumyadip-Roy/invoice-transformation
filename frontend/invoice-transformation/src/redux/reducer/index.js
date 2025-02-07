import { combineReducers } from "@reduxjs/toolkit";
import invoiceReducer from "../slices/invoiceSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "invoice",
  storage,
  whitelist: ["invoice"],
};

const rootReducer = combineReducers({
  invoice: invoiceReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export default rootReducer;
