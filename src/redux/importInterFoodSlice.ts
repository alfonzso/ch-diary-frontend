import { AnyAction, createAsyncThunk, createSlice, ThunkDispatch } from '@reduxjs/toolkit'
import { InterfoodImportResponse } from '../types'
import { newFetchWithAuth } from '../utils/fetchInstance'
import { ToastError, ToastSucces } from '../utils/oneliners'
import { logMeOut } from './logoutSlice'
import { setRedirectNeeded } from './redirectSlice'
import { RootState } from './store'


interface ImportState {
  value: boolean;
  event: boolean;
  // diaryFood: foodInnerProps[];
  // todayFood: foodInnerProps[];
}

const initialState: ImportState = {
  value: false,
  event: false,
  // diaryFood: [],
  // todayFood: []
};

export const sendImportedData = createAsyncThunk<InterfoodImportResponse, string[], { state: RootState, dispatch: ThunkDispatch<RootState, any, AnyAction> }>(
  'import/InterFood',
  async (importData, { getState, dispatch }) => {

    return newFetchWithAuth<InterfoodImportResponse, Promise<InterfoodImportResponse>>({
      url: `/api/interfood/import`,
      newFetchResolve:
        (response) => {
          if (response.error) {
            const msg = response.error.message.toLowerCase().includes("token") ? "Session Expired !" : 'Import Failed => ' + response.error.message
            ToastError(msg)
            dispatch(setRedirectNeeded(true))
            dispatch(logMeOut())
          }
          return response
        },
      config:
      {
        method: "POST",
        body: JSON.stringify({ data: importData }),
      }
    })

  }
)

// export const getTodayFoods = createAsyncThunk<ITodayFoods, { date: string }>(
//   'today/getFood',
//   async ({ date }) => {
//     return newFetchWithAuth<DiaryGetEntryNickNameDateResponse, ITodayFoods>({
//       url: `/api/diary/getEntry/date/${date}`,
//       newFetchResolve: (response) => {
//         return { resp: response, date }
//       },
//       newFetchReject(error) {
//         return Promise.reject(error)
//       },
//     })
//   }
// )

export const importIFSlice = createSlice({
  name: 'importIF',
  initialState,
  extraReducers: (builder) => {

    builder.addCase(sendImportedData.fulfilled, (state, { payload }) => {
      if (!payload.error) ToastSucces('Import Big Success!! ')
      state.event = !state.event
    })

    builder.addCase(sendImportedData.rejected, (state, { payload }) => {
      ToastError('Import Failed!! ')
      state.event = !state.event
    })

    // builder.addCase(getTodayFoods.fulfilled, (state, { payload: { resp, date } }) => {
    //   if (!(resp && date)) return

    //   const convertedFoodData: foodInnerProps[] = resp.data.map(diaryFood => {
    //     return {
    //       id: diaryFood.id,
    //       name: diaryFood.Food.name,
    //       date: new Date(diaryFood.createdAt).toLocaleDateString("en-ca"),
    //       dateTime: hourMinuteToDateTime(new Date(diaryFood.createdAt)),
    //       type: diaryFood.Food.Interfood.InterfoodType.name,
    //       portion: diaryFood.Food.portion,
    //       props: diaryFood.Food.FoodProperite
    //     }
    //   })

    //   state.diaryFood = removeDuplicatedElementsById([...state.diaryFood, ...convertedFoodData])
    //   state.todayFood = convertedFoodData.filter(data => data.date === date)

    // })

    // builder.addCase(getTodayFoods.rejected, (state, { payload }) => {
    //   // console.log('getTodayFoods rejected: ', state, payload);
    //   ToastError("Can't get today's food ! ")
    // })
  },
  reducers: {
    importToggle: (state) => {
      state.value = !state.value
    }
  },
})

// Action creators are generated for each case reducer function
export const { importToggle } = importIFSlice.actions

export default importIFSlice.reducer
