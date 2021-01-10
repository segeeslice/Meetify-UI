/*
 * Basic wrapper for the Material UI "Avatar" component
 * Displays given user's profile picture
 *
 * If no profile picture given, defaults to the first letter of their display name
 * If no display name, defaults to a basic profile picture
 *
 * Props:
 * - src (String) = image URL of the profile picture
 * - displayName (String) = display name of the user
 */

import React from 'react'
import { Avatar } from '@material-ui/core'

export default function UserAvatar (props) {
  if (!props) {
    return <Avatar/>

  } else if (props.displayName) {
    const { displayName, ...avatarProps } = props
    const firstLetter = displayName[0].toUpperCase()
    return <Avatar {...avatarProps}>{firstLetter}</Avatar>

  } else {
    return <Avatar {...props}/>
  }
}
