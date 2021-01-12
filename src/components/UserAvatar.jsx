/*
 * Basic wrapper for the Material UI "Avatar" component
 * Displays given user's profile picture
 *
 * If no profile picture given, defaults to the first letter of their display name
 * If no display name, defaults to a basic profile picture
 *
 * Props:
 * - displayName (String) = display name of the user
 * - src (String) = image URL of the profile picture (should be square!)
 * - All other props for the Avatar component
 */

import React from 'react'
import { Avatar } from '@material-ui/core'

export default function UserAvatar (props) {
  if (!props) props = {}

  // Pull out className for application to base img object within Avatar
  // This allows for app to automatically figure out width based on image height
  // NOTE: The intended look relies on a given src and a square image
  //       If we want to support tiles having letters and defaults, we need to
  //       Hard-code heights and widths somewhere.
  const { className } = props
  const imgProps = className ? {className} : {}

  const { displayName, ...avatarProps } = props
  const firstLetter = displayName ? displayName[0].toUpperCase() : undefined

  return (
    <Avatar {...avatarProps} imgProps={imgProps}>
      {firstLetter}
    </Avatar>
  )
}
