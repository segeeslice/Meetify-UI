
/*
 * Redux slice for containing data for the Chat tab
 * (NOTE: Currently just uses test data)
 *
 * Sends to state.chat
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { TEST_USERS } from '../meet/meetSlice'

// Test messages
const TEST_MESSAGES = [
  {
    sender: 'other', // Injected soon
    date: Date(Date.now() - 15000),
    text: 'Hey!'
  },
  {
    sender: 'me',
    date: Date(Date.now() - 10000),
    text: 'Hey man what\'s up?',
  },
  {
    sender: 'other',
    date: Date(Date.now() - 5000),
    text: 'Please leave me alone I am sleepin',
  },
  {
    sender: 'me',
    date: Date(Date.now() - 2000),
    text: 'What?',
  },
  {
    sender: 'other',
    date: Date(Date.now()),
    text: 'I SAID I\'M NO LONGER INTERESTED. PLEASE STOP CONTACTING ME OR I WILL CONTACT ATTORNEY GENERAL. THZSKS',
  },
]

// Pin messages to user chat objects
const getTestChat = ({ userObj, me}) => {
  const messages = [...TEST_MESSAGES].map(o => (
    {...o, ...{ sender: o.sender === 'me' ? me : userObj.username }}
  ))
  return Object.assign({}, userObj, { messages })
}

const loadChats = createAsyncThunk(
  'meet/loadChatsStatus',
  async ({ username }, thunkAPI) => {
    // For now, just return test data after a pause
    return new Promise(resolve => setTimeout(() => {
      const chatsWithSenders = [...TEST_USERS].map(userObj => getTestChat({ userObj, me: username}))
      resolve(chatsWithSenders)
    }, 2000))
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    // Array of dicts containing { displayname, profilePicUrl, songsMatched }
    chats: []
  },
  reducers: {
    setMatches: (state, action) => {
      state.chats = action.payload
    },
    clearMatches: state => {
      state.chats = []
    },
  },
  extraReducers: {
    // When findMatches succeeds, do this with the result...
    [loadChats.fulfilled]: (state, action) => {
      state.chats = action.payload
    },
  }
})

export { chatSlice, loadChats }
export const { setMatches, clearMatches } = chatSlice.actions
export default chatSlice.reducer
