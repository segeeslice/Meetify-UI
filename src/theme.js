/*
 * Material UI theme and relevant utilities to use across the app
 *
 * Color customization:
 * https://material-ui.com/customization/color/
 *
 * All potential theme fields:
 * https://material-ui.com/customization/default-theme/
 */

import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red'
import pink from '@material-ui/core/colors/pink'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#4ac776',
      main: '#1DB954',
      dark: '#14813a',
      contrastText: '#fff',
    },
    secondary: {
      light: pink[300],
      main: pink[400],
      dark: pink[500],
      contrastText: '#000',
    },
    gray: {
      light: '#474343',
      main: '#191414',
      dark: '#110e0e',
      contrastText: '#000',
    },
    error: {
      light: red[300],
      main: red[400],
      dark: red[500],
    },
  },
  tile: {
    height: '135px',
  },
  images: {
    squareImageHeight: '150px',
    cardImageHeight: '100px',
  },
})

const defaultOpts = {
  deg: '90deg',
}

theme.getGradient = (colors, opts) => {
  if (!opts) opts = {}
  const optsWithDefaults = Object.assign({}, defaultOpts, opts)

  if (colors.length === 0)
    return 'rgba(0, 0, 0, 0)'
  else if (colors.length === 1)
    return colors[0]
  else if (colors.length === 2)
    return `linear-gradient(${optsWithDefaults.deg}, ${colors[0]} 16%, ${colors[1]} 77%`
  else
    return `linear-gradient(${optsWithDefaults.deg}, ${colors[0]} 16%, ${colors[1]} 77%, ${colors[2]} 100%)`
}

export { theme }
export default theme
