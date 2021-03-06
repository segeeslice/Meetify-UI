/*
 * UI component for the main entry point for the app
 */

import React, { useState, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { Tab, Paper } from '@material-ui/core'

import AppTabBar from './AppTabBar'
import Login from './account/Login'

import Meet from './meet/Meet'
import Intersect from './intersect/Intersect'
import Account from './account/Account'
import Matches from './matches/Matches'

import './App.css'

const TRANSITION_DURATION = 500

const useStyles = makeStyles((theme) => ({
  tabBar: {
    float: 'left',
    maxWidth: '25%',
    height: '100%',
  },
}))

export default function App () {
  const classes = useStyles()

  const loggedIn = useSelector((state) => state.account.loggedIn)
  const username = useSelector((state) => state.account.username)
  const profile = useSelector((state) => state.account.profile)

  const TAB_CONFIG = [{
    label: 'Meet',
    val: 'meet',
    component: <Meet/>,
  },{
    label: 'Matches',
    val: 'matches',
    component: <Matches/>
  }, {
    label: 'Intersect',
    val: 'intersect',
    component: <Intersect/>,
  }, {
    label: 'Profile',
    val: 'profile',
    component: <Account username={username} profile={profile} editable/>,
  }];

  const TAB_DEFAULT = TAB_CONFIG[0].val

  const [activeTab, setActiveTab] = useState(TAB_DEFAULT)

  const getActiveComponent = () => TAB_CONFIG.find(x => x.val === activeTab).component
  const getActiveComponentIndex = () => TAB_CONFIG.findIndex(x => x.val === activeTab)

  const tabs = TAB_CONFIG.map((x) => (
    <Tab
      key={x.val}
      label={x.label}
      onClick={() => setActiveTab(x.val)}
    />
  ))

  const component = getActiveComponent();
  const componentIndex = getActiveComponentIndex();

  const mainAppComp = (
    <>
      <div className={classes.tabBar}>
        <AppTabBar activeIndex={componentIndex}>
          {tabs}
        </AppTabBar>
      </div>
      <div className="main-container">
        {component}
      </div>
    </>
  )

  const loginRef = useRef(null)
  const appRef = useRef(null)

  return (
    <Paper className="app-root" square style={{position:'relative'}}>
      {/* TODO: Try to make this into generic transition component */}
      <CSSTransition
        classNames="fade"
        timeout={TRANSITION_DURATION}
        unmountOnExit
        style={{position: 'absolute', height: '100%', width: '100%'}}
        nodeRef={loginRef}
      in={!loggedIn}
      >
        <div ref={loginRef}>
          <Login/>
        </div>
      </CSSTransition>

      <CSSTransition
        classNames="fade"
        timeout={TRANSITION_DURATION}
        unmountOnExit
        style={{position: 'absolute', height: '100%', width: '100%'}}
        nodeRef={appRef}
      in={loggedIn}
      >
        <div ref={appRef}>
          <div style={{display: 'flex', height: '100%', width: '100%'}}>
            {mainAppComp}
          </div>
        </div>
      </CSSTransition>
    </Paper>
  );
}
