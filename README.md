# Battleship!

## Installation and Running

1.  `npm i`
2.  `npm run dev`
3.  open `http://www.localhost:3000`

Tested in Node v8.9.1, but should function in any LTS or greater version of Node.

## Notes on stack

- UI framework is React

- State management is via Redux. I don't always use Redux (I typically use it for truly shared, global state, and I generally try to design components that are more isolated / can function effectively with local state), but it's an excellent fit for game logic like this.

- Server/render framework is [NextJS](https://github.com/zeit/next.js). I mostly used it here for the convenience of a simple server, with easy bindings for Redux and Styled Components.

- CSS is Styled Components, which I've enjoyed recently for their nice, JS-centric functional style. More broadly I'm a big fan of SC for critical-path rendering and streaming CSS, though both of those are production optimizations that don't apply here :)

## If I had more time

- I'd add `jest` and include some tests. Because I made a UI I was able to test for functionality, which is fine for a quick code challenge like this. But generally I coded this to be testable; the entire game is in Redux state, which should be fairly painless to test.

- I'd make it responsive, which wouldn't be too much extra work. My general approach would be to center the layout and size the individual cells with `vw` units, with whatever `max-width` felt appropriate.

- I'd make this playable, and add a takeover to prompt the player to hand the device to their adversary.

## And Finally

- Thanks for the challenge! This was a fun one.
