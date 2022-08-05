'use strict';

const btnContainer = document.getElementById('buttons');

if (!btnContainer) {
  throw new Error('No #button element found');
}


// yeah, I use clamp for this :D
const count = 33;

// what will be blocked?
const eventType = 'keypress';

// keep track of buttons
// (window will catch )
const buttons = [];

// [ 'a', 'b', 'c', ..., 'z' ]
const alphabet = (
  new Array(alphabeticClamp(count))
    .fill('a'.charCodeAt(0))
    .map((startCode, id) => startCode + id)
    .map(code => String.fromCharCode(code))
);

// Create buttons
for (let i = 0; i < alphabeticClamp(count); i += 1) {
  const btn = document.createElement('button');
  btn.appendChild(
    document.createTextNode(alphabet[i])
  );
    
  btn.addEventListener('click', () => alert(alphabet[i]));
  btnContainer.appendChild(btn);

  // track the buttons for later usage
  buttons.push(btn);
}


// Handles specified type of event on Window
function eventTypeHandler(e) {
  const x = e.keyCode;
  let alphabetCodes = alphabet.map(char => char.toLowerCase().charCodeAt(0));

  const [a, z] = [
    Math.min(...alphabetCodes),
    Math.max(...alphabetCodes)
  ];

  alphabetCodes = alphabet.map(char => char.toUpperCase().charCodeAt(0));

  const [A, Z] = [
    Math.min(...alphabetCodes),
    Math.max(...alphabetCodes)
  ];

  if (x >= A && x <= Z) {
    // Alphabet upper case
    buttons[x - A].click();
  }

  if (x >= a && x <= z) {
    // Alphabet lower case
    buttons[x - a].click();
  }
}

if (!window) {
  const msg = 'No window element was detected. This code runs in browser (Node.js is not supported).'
  throw new Error(msg);
}

// Suppose there is no way to remove this listener  
window.addEventListener(eventType, eventTypeHandler);


// block all events of that type
function setEventBlocker(evtType) {
  if (!evtType) {
    throw new TypeError('Expected evtType to be provided');
  }

  const blockerFn = e => {
    e.stopImmediatePropagation();
    console.log("Keydown event blocked.");
  };

  window.addEventListener(evtType, blockerFn, true);

  return blockerFn;
}

// you need blockerFn callback to remove it
// keep it until you remove the blocker
function removeEventBlocker(evtType, blockerFn) {
  if (!evtType) {
    throw new TypeError('Expected evtType to be provided');
  }

  if (!blockerFn instanceof Function) {
    throw new TypeError('Expected blockerFn to be Function');
  }

  window.removeEventListener(evtType, blockerFn, true);
}

let blockerFn;

const inputFields = document.querySelectorAll('input');

if (inputFields && inputFields.length) {
  inputFields.forEach(el => {

    // Set eventBlocker when focused
    el.addEventListener('focus', () => {
      if (!blockerFn) {
        console.log('Setting event blocker.');
        blockerFn = setEventBlocker(eventType);
      }
    });

    // Remove eventBlocker when unfocused
    el.addEventListener('blur', () => {
      if (blockerFn instanceof Function) {
        console.log('Removing event blocker.');
        removeEventBlocker(eventType, blockerFn);
        blockerFn = null;
      }
    });
  });
}

// Utility function
// (boring stuff)

function clamp(val, min, max) {
  if (![val, min, max].every(n => Number.isFinite(n))) {
    throw new TypeError('Expected both val, min and max to be a finite Numbers');
  }

  if (val < min) {
    return min;
  }

  if (val > max) {
    return max;
  }

  return val;
}

function alphabeticClamp(val) {
  return clamp(val, 1, 26);
}