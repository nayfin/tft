# interact

This is an angular wrapper for the interactjs library.  We aim to build a versatile API that will all deep customization of drag behavior while also simplifying common usage of common behaviors.

## Running unit tests

Run `nx test interact` to execute the unit tests.

Upcoming Features
- performance testing
    - look into using Cypress for this
    - ngZone runOutsideAngular
    - round coordinates and filter duplicates
    - performing drag behavior when listening to output vs. passing callback through the config
- method of cloning/replacing drag item
- method of correlating and passing data between drag item and drop zone
- sort drag registry by DragZones
- way to eject all drag registry state to end-developer
    - move dragRegistry into a BehaviorSubject? (wait until can test performance impact)
- use zones to run outside angular? (if it improves performance)
- move all effects to tap (add deltaX, deltaY parameters to resize subject, decide on update strategy i.e. remove update functions?, )
