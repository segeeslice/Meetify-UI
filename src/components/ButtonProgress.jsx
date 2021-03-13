/*
 * A basic wrapper to material ui's CircularProgress
 * Intended for centralized style for use in buttons when they are loading
 */

import React from 'react'
import {
  CircularProgress
} from '@material-ui/core'

export default function ButtonProgress (props) {
  return (
    <CircularProgress
      size={24}
      thickness={4.6}
    />
  )
}
