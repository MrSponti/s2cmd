#!/usr/bin/env node

var InputEvent = require('input-event');

//
// Keycodes of Zeepin TZ MX6 2,4 GHz Wireless Remote
//

KeyCode = {
   28: 'KEY_OK',
  103: 'KEY_UP',
  105: 'KEY_LEFT',
  106: 'KEY_RIGHT',
  108: 'KEY_DOWN',
  114: 'KEY_MINUS',
  115: 'KEY_PLUS',
  116: 'KEY_POWER',
  158: 'KEY_RETURN',
  194: 'KEY_MICRO',
}

const inp0 = new InputEvent('/dev/input/event0');
const inp1 = new InputEvent('/dev/input/event1');
const inp2 = new InputEvent('/dev/input/mice');

inp0.on('data', function(buffer){
  eventReceived(buffer);
});

inp1.on('data', function(buffer){
  eventReceived(buffer);
});

inp2.on('data', function(buffer){
  eventReceived(buffer);
});

function eventReceived(buffer){
  //console.log(buffer)
  if (buffer.code in KeyCode){
    switch(buffer.value) {
      case 0:
          mode = 'You released : ';
          break;
      case 1:
          mode = '\nYou pressed  : ';
          break;
      case 2:
          mode = '      pressing ';
          break; 
    }
    console.log(mode +KeyCode[buffer.code]) 
  }  
}

console.log('Press a key on your -Zeepin TZ MX6-:')