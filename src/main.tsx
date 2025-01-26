import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import NoSleep from '@zakj/no-sleep';

const noSleep = new NoSleep();

document.addEventListener(
  'click',
  function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  },
  false,
);

const touchHandler = (ev: TouchEvent) => {
  ev.preventDefault() // Prevent text selection
}
document.addEventListener('touchstart', touchHandler, {passive:false})
document.addEventListener('touchmove', touchHandler, {passive:false})
document.addEventListener('touchend', touchHandler, {passive:false})
document.addEventListener('touchcancel', touchHandler, {passive:false})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
