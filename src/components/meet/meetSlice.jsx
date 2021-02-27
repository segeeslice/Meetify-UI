
/*
 * Redux slice for containing data for the Meet tab
 * (NOTE: Currently just uses test data)
 *
 * Sends to state.meet
 */

import { createSlice } from '@reduxjs/toolkit'

const meetSlice = createSlice({
  name: 'meet',
  initialState: {
    // Array of dicts containing { displayname, profilePicUrl, songsMatched }
    matches: [],
  },
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload
    },
    clearMatches: state => {
      state.matches = []
    },
  }
})

export { meetSlice }
export const { setMatches, clearMatches } = meetSlice.actions
export default meetSlice.reducer
