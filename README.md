# debouncing-buttons

A possible solution, when you want to avoid firing some event, but have no control of it.

The core of this project is:

```JavaScript
const blockerFn = e => {
  e.stopImmediatePropagation();
  console.log("Keydown event blocked.");
};

window.addEventListener(evtType, blockerFn, true);
```

Which stops event of specified type from propagating across whole DOM. This may broke some stuff on your page, if you didn't constrain the blocker. So for that let's remove the handler if we don't need it:

```JavaScript
window.removeEventListener(evtType, blockerFn, true);
```

This logic is composed inside two functions: `setEventBlocker(evtType)` and `removeEventBlocker(evtType)`

Finally, every input element, which suffers from that event, can block it:

```JavaScript
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
```
