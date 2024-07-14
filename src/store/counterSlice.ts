import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface CounterState {
  isLogin: boolean
  token: string
  featchVal: number
}

const initialState: CounterState = {
  isLogin: false,
  token: '',
  featchVal: 0
}

export const fetchSettimeout = createAsyncThunk(
  'counter/fetchSettimeout', (id: number)=>{
    return new Promise<number>((resolve) => {
      setTimeout(()=>{
       resolve(id)
      },3000)
    })
  }
)

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    login: (state,args) => {
      state.token = args?.payload as string
      state.isLogin = true
    },
    loginout: (state) => {
      state.token = ''
      state.isLogin = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSettimeout.fulfilled, (state, action) => {
      state.featchVal = action.payload
    })
  }
})
// Action creators are generated for each case reducer function
export const { login ,loginout} = counterSlice.actions
export default counterSlice.reducer
