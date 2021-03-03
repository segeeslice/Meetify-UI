/*
 * Redux slice for containing current user account data
 * Should be only written to within the Login component
 *
 * Sends to state.account
 */

import { createSlice } from '@reduxjs/toolkit'

const defaultData = {
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
    ...defaultData,
    spotify: { ...defaultData.spotify },
    profile: { ...defaultData.profile },
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload

      // If we just logged out, reset all data to defaults
      if (!action.payload) state = {
        ...defaultData,
        spotify: { ...defaultData.spotify },
        profile: { ...defaultData.profile },
      }
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
  }
})

export const {
  setLoggedIn,
  setUsername,
  setUserId,
  setProfile,
  setSpotifyLinked,
} = accountSlice.actions
export default accountSlice.reducer
