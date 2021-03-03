
/*
 * Redux slice for containing data for the Matches tab
 * (NOTE: Currently just uses test data)
 *
 * Sends to state.matches
 */

import { createSlice } from '@reduxjs/toolkit'

const matchesSlice = createSlice({
  name: 'matches',
  initialState: {
    // Array of dicts containing { displayname, profilePicUrl, songsMatched }
    matches: []
  },
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload
    },
    clearMatches: state => {
      state.matches = []
    },
    setMessages: (state, action) => {
      const { matchId, messages } = action.payload
      state.matches = state.matches.map((m) => m.matchId !== matchId ? m : {...m, messages})
    },
  }
})

export { matchesSlice }
export const { setMatches, clearMatches, setMessages } = matchesSlice.actions
export default matchesSlice.reducer
