/*
 * Redux slice for containing current user account data
 * Should be only written to within the Login component
 *
 * Sends to state.account
 */

import { createSlice } from '@reduxjs/toolkit'

const DEFAULT_DATA = {
  loggedIn: false,
  username: '',
  userId: -1,
  spotify: {
    linked: false,
  },
  profile: {
    displayName: '',
    description: '',
    profilePicUrl: '',
  },
}

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    ...DEFAULT_DATA,
    spotify: { ...DEFAULT_DATA.spotify },
    profile: { ...DEFAULT_DATA.profile },
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload
    },
    setUsername: (state, action) => {
      state.username = action.payload
    },
    setUserId: (state, action) => {
      state.userId = action.payload
    },
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    setSpotifyLinked: (state, action) => {
      state.spotify.linked = action.payload
    },
    resetAccountData: (state, action) => {
      state = {
        ...DEFAULT_DATA,
        spotify: { ...DEFAULT_DATA.spotify },
        profile: { ...DEFAULT_DATA.profile },
      }
    }
  }
})

export const {
  setLoggedIn,
  setUsername,
  setUserId,
  setProfile,
  setSpotifyLinked,
  resetAccountData,
} = accountSlice.actions
export default accountSlice.reducer
