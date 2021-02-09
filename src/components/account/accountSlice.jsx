/*
 * Redux slice for containing current user account data
 * Should be only written to within the Login component
 * (NOTE: Currently just uses test data)
 *
 * Sends to state.account
 */

import { createSlice } from '@reduxjs/toolkit'

// Temporary test data for the profile
const PROFILE_TEST_INFO = {
  displayName: 'Doug Douglas',
  description: 'Hey! The name\'s Doug, but you can call be "D-D-D-Doug in da Hiz House". Please talk to me. '.repeat(10),
  status: 'Chillin\'',
  profilePicUrl: 'https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-male-user-icon.png',
}

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    loggedIn: false,
    username: '',
    profile: {
      displayName: '',
      description: '',
      status: '',
      profilePicUrl: '',
    }
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload
    },
    setUsername: (state, action) => {
      state.username = action.payload
      // TODO: Pull info from server based on username
      //       (which should probably be async)
      state.profile = {...PROFILE_TEST_INFO}
    },
    editProfile: (state, action) => {
      // TODO: Send to server and receive again
      const { changes } = action.payload
      state.profile = { ...state.profile, ...changes }
      console.log(state.profile)
    }
  }
})

export const { setLoggedIn, setUsername, editProfile } = accountSlice.actions
export default accountSlice.reducer
