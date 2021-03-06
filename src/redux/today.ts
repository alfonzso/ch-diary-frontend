import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { UserData } from "../types";
import { addOneDay, getYYYYMMDD, removeOneDay } from "../utils/util";

// Define a type for the slice state
interface TodayState {
  everyHalfHour: number
  todayDateAsString: string
  todayDate: Date
}

// Define the initial state using that type
const initialState: TodayState = {
  everyHalfHour: 24 * 2,
  todayDateAsString: "1970-01-01",
  todayDate: getYYYYMMDD()
}

export const todaySlice = createSlice({
  name: "today",
  initialState,
  reducers: {
    getToDay: (state) => {
      state.todayDateAsString = state.todayDate.toLocaleDateString("en-ca")
    },
    previousDay: (state) => {
      state.todayDate = removeOneDay(state.todayDate)
      state.todayDateAsString = state.todayDate.toLocaleDateString("en-ca")
    },
    todayDay: (state) => {
      state.todayDate = getYYYYMMDD()
      state.todayDateAsString = state.todayDate.toLocaleDateString("en-ca")
    },
    nextDay: (state) => {
      state.todayDate = addOneDay(state.todayDate)
      state.todayDateAsString = state.todayDate.toLocaleDateString("en-ca")
    }
  }
});

export const { getToDay, previousDay, todayDay, nextDay } = todaySlice.actions;
export default todaySlice.reducer
