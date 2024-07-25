import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  isLogin: boolean
  username: string | null
  token: string | null
  userType: string | null
}

const initialState: CounterState = {
  isLogin: false,
  username: null,
  token: null,
  userType: '',
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
      state.userType = ''
      localStorage.removeItem('token')
    },
    setToken(state, action: PayloadAction<string>) {
      state.isLogin = true
      state.token = action.payload
    },
    setUserType: (state, action) => {
      state.userType = action.payload
    }
  },
})

export const { login, loginout, setToken, setUserType } = counterSlice.actions

export default counterSlice.reducer
