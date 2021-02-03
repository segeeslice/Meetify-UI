# Meetify Front-end TODO

## !!URGENT!!
1. [x] Add all tabs to the matches page
1. [x] Make meet page look like matches page
1. [x] Account -> Profile
1. [ ] Make user's own profile editable
1. [ ] Probably simplify profile and remove gradient
1. [ ] Add "create account" form to front page

## Initial Designs
1. [x] Investigate color schemes (green & pink?)
1. [x] Song tiles
    1. [x] Base component
    1. [x] Clean up / separate into one tile, tile list, etc.
1. [x] Re-vamp playlist intersection with song tiles
1. [x] Add more robust login system w/ animations
    - Splash screen
    - Don't allow app interaction unless logged in
    - If "remembered", log in and greet with welcome before giving access
1. [x] User profile area
1. [x] Meet area
    1. [x] User list
        - Similar to SongTile
    1. [x] Exact song match view
        - Floating maximizable dialog
    1. [x] Profile view
        - Floating maximizable dialog
1. [x] Messaging area
    1. [x] Chat selection
    1. [x] Chat usage
1. [x] General alert for errors
    
## Design refine
1. [x] Make song tiles smaller & exclude album
1. [ ] Redesign meet area to use "generic" material cards
1. [ ] Make song tiles clickable
1. [ ] Make profile page use avatars
1. [ ] Add chat loading
   - Stretch: Better implement message testing to actually display your message?
1. [ ] Intersect tab - add heading subtitle with some more details about the tab

## Boilerplate & Administrative
1. [x] Investigate Typescript integration
    - Likely will not do - Occam's razor
1. [x] Investigate Redux integration prior to back-end connection
    - Would help manage data, should app components become "far-reaching"
    - Main drawback is the initial setup, but should be worht it in the long run
1. [x] Better organize files
1. [ ] Other random refactors
    - Move theme injection up to index.js
    - Rename "Account" to "Profile"
1. [x] Fix NPM vulnerabilities and warnings
1. [x] Fix in-house warnings (within electron console)
1. [ ] Add react dev tools to Electron?
1. [ ] Style management decision
    1. [ ] Find a way to default most components to w/h 100% and style further
           using layout wrappers, allowing for better reusability
    1. [ ] Investigate integrating [CSS
           modules](https://github.com/css-modules/css-modules)
1. [ ] Internally change Account to Profile, where needed

## Edge Cases / Refining
1. [ ] Song Tile
    1. [ ] Handle extra long text
    1. [ ] Handle missing / malformatted data
1. [ ] Song Tile List
    1. [ ] Handle lots of results (keep merger thing in sight)
    1. [ ] Handle missing / malformatted data

## Pending...
- Click on song &rarr; [open Spotify page] or [open proprietary info page]

