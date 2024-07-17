import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  isLogin: boolean
  username: string | null
  token: string | null
}

const initialState: CounterState = {
  isLogin: false,
  username: null,
  token: null,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string; token: string }>) {
      state.isLogin = true
      state.username = action.payload.username
      state.token = action.payload.token
      console.log( state.username)
    },
    loginout(state) {
      state.isLogin = false
      state.username = null
      state.token = null
      localStorage.removeItem('token')
    },
    setToken(state, action: PayloadAction<string>) {
      state.isLogin = true
      state.token = action.payload
    }
  },
})

export const { login, loginout, setToken } = counterSlice.actions

export default counterSlice.reducer
