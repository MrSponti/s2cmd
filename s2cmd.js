#!/usr/bin/env node
/**
 * Speech recognition modul to translate a spoken instruction into a device control 
 * 
 * This modul use 
 *  -  the Sonus speech recognition lib as a front end to the Google Cloud Speech API
 * The Sonus speech recognition lib use
 *  -  snowboy hotword recognition
 *  -  the Google Cloud Speech API
 *
 * With a wireless remote like the "Zeepin TZ MX6 2,4 GHz", the Google Cloud Speech API
 * can be triggered by pushing the microphone button. In this case the microphone is not permanent listen for 
 * detecting the hotword. 
 *
 * (c) Mr. Sponti       latest update: 22.04.2018
 */

// load config parametervand the word dictionary for word filtering and to build a unique device instruction
var config = require('./config')                       

var lastTarget = {};
lastTarget.device = '-';

//---------------------------------------------------------------------------------------------------------------------
//  text filter to identify keywords for building the final unique device  instruction
//
function textToInstruction(text){

  var instruction = {};
  instruction.command = '-';
  instruction.attribute = '-';
  instruction.d_attribute = '-';
  instruction.object = '-';
  instruction.d_object = '-';
  instruction.zone = '-';
  instruction.d_zone = '-';
  instruction.digit = '-';
 
  var words = text.trim().toLowerCase().split(' '); 

  // filter received words into instruction elements ...
  //
  // every instruction is build by   
  // ==> 4 elements:      zone:object:attribute:command                
  //        example:      livingroom:light:mainlight:on

  for (var i = 0; i < words.length; i++) {
      if( words[i] in config.numbers ){ 
           words[i] = config.numbers[words[i]][1];
      }
      if( !isNaN(words[i]) ){                                               // make note on a spoken number
          instruction.digit = words[i];
          continue;
      }
      if (instruction.command === '-') {                                    // make note on a spoken command
          if (words[i] in config.cmd){
              instruction.command = config.cmd[words[i]];
              continue;
          }  
      }
      if (instruction.attribute === '-') {
          if (words[i] in config.attribute){                                // make note on a spoken attribute
              instruction.attribute = config.attribute[words[i]][0];
              instruction.d_object  = config.attribute[words[i]][1];        // make note on a related default object
              if(config.attribute[words[i]].length > 2){
                  instruction.d_zone =  config.attribute[words[i]][2];      // make note on a related default zone
              }            
              continue;
          }  
      }        
      if (instruction.object === '-') {                                     // make note on a spoken object
          if (words[i] in config.object){
              instruction.object = config.object[words[i]][0];
              if(instruction.d_zone === '-'){
                  instruction.d_zone = config.object[words[i]][1];          // make note on a related default zone
              }                
              instruction.d_attribute = config.object[words[i]][2];         // make note on a related default attribute
              continue;
          }  
      }        
      if (instruction.zone === '-') {                                       // make note on a spoken zone
          if (words[i] in config.zone) {
              instruction.zone = config.zone[words[i]];
              continue;
          }  
      }         
  }
  
  if (DEBUG){
      console.log('    filtered words: >>' + instruction.zone +':'+ instruction.object +':'+ instruction.attribute +':'+ instruction.command + '<<')  
  }
  
  // now, assign defined defaults to missing instruction elements ...
  
  // assign default attribut
  if (instruction.attribute === '-') {
      instruction.attribute = instruction.d_attribute;
  }    
  // assign default object
  if (instruction.object === '-' && instruction.d_object !== '-') {
      instruction.object = config.object[instruction.d_object][0];
      if (instruction.d_zone === '-') {
        instruction.d_zone = config.object[instruction.d_object][1];
      } 
  }
  // assign default zone
  if (instruction.zone === '-' && instruction.d_zone !== '-') {
      instruction.zone = instruction.d_zone;;
  }   
  // build the instruction
  var targetInstruction = instruction.zone +':'+ instruction.object +':'+ instruction.attribute +':'+ instruction.command
  var targetKey         = instruction.zone +':'+ instruction.object
  if (DEBUG) {console.log('       Instruction: >>' + targetInstruction + '<<')}    

  //
  // determine target device and command to send ...
  //
  var target = {};
  target.device = '-';
  target.device.capability = -1;
  target.message = '-';
  target.ok = false; 
  target.attribute = instruction.attribute;
    
  if(targetKey in config.devices){                        // get device address information
      target.device  = config.devices[targetKey];
      if (targetInstruction in config.cmdMap) {           // if a shortcut exist, map instruction to that shortcut command
          instruction.attribute = '-';
          instruction.command = config.cmdMap[targetInstruction];
          if (DEBUG) {console.log('    mapped command: >>' + instruction.command + '<<')}                
      }
  } else if (targetKey === '-:-' && lastTarget.device !== '-') {
      target.device = lastTarget.device;
  }
  if (instruction.command !== '-') {      
      // for devices in category '2' or higher --> add all substantives from received text to the end of the instruction
      var optAttr = '';
      if( target.device ){
        if (target.device.capability === 2) {             
          words = text.split(" ");
          for( var i=0; i<words.length; i++){
            if( words[i] && isNaN(words[i]) && words[i] !== instruction.attribute && words[i][0] === words[i][0].toUpperCase() ){
              optAttr = optAttr + " " + words[i]
            }
          }
        }
      }
      // add spoken numeric value to end of command
      if (instruction.digit !== '-') {
          instruction.command = instruction.command + ' ' + instruction.digit;
      }
      // add optional info to the end of the instruction
      if ( optAttr.length > 0 ) {
          instruction.command = instruction.command + ' ' + optAttr.trim();
      }
      // build final message to send from attribute and command
      if (instruction.attribute !== '-') {
          target.message = instruction.attribute + ' ' + instruction.command;
      } else {
          target.message = instruction.command;
      }
  }
  
  // check if we have a valid address descriptor and a message to send to target
  if ( target.device !== '-' ){
    if ( target.message !== '-') {
      target.ok = true;
    }
    // keep target in mind in case that the next message is a short cut command without a service point
    if ( target.device.capability > 0 ) {
      lastTarget = target
    }
  }
  
  return target
}

//---------------------------------------------------------------------------------------------------------------------
// "sendDeviceRequest" - send an instruction to the target device
//
function sendDeviceRequest(target,targetMessage){  
  
  if (typeof(target) === 'string') {                              
    var targetKey = target
    var target = {}
    target.device  = config.devices[targetKey];
    target.message = targetMessage
  }
  if (target.device.capability > 0) {
    lastTarget  = target;
  }
  if (DEBUG) {
      console.log('    send to target: ' + target.device.host+':'+target.device.port+' '+target.device.service+' '+target.message+'  capability: '+target.device.capability);
      if (NOACTION) {return}
  }
  if ( target.device.service === 'pimatic' ){
    target.pimaticUser = config.pimaticUser;
    target.pimaticPasswd = config.pimaticPasswd;
    
    sendToPimatic(target);
  }
  else {
    sendToNSH(target);
  }
}
//---------------------------------------------------------------------------------------------------------------------
// send instruction to pimatic to trigger action
//
const request = require('request');

function sendToPimatic(target) {

  const options = {  
    url: 'http://'+ target.pimaticUser+':'+target.pimaticPasswd+'@'+target.device.host+':'+target.device.port+'/api/execute-action/',
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    json: true,
    body: {
        'actionString': target.message
    }
  };

  request(options, function(err, res, body) {  
    if (err){
      console.log('       *** ERROR triggering pimatic action ***');
    }
  });
}

//---------------------------------------------------------------------------------------------------------------------
// use socket client to send an instruction to a (target device) 
//
var net = require('net');

function sendToNSH(target){
  // socket client to send an instruction to a network service handler (target device)  
  var client = new net.Socket();
  client.connect(target.device.port, target.device.host, function() {
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client     
    client.write(target.device.service + ' ' + target.message);
  });    
  // data event handler for receiving data from the server 
  client.on('data', function(data) {      
    if(DEBUG){console.log('   socket received: ' + data)};                  
    // Close the client socket
    client.end();
  });        
  // event handler for closing the client socket by the server
  client.on('close', function() {
    client.destroy();
  });
  // error handler on connection problems
  client.on('error',  function() {
    console.log('       *** socket ERROR ***');
  });
}
//---------------------------------------------------------------------------------------------------------------------
//  initialize use of GPIO connected LED
//
var Gpio = require('onoff').Gpio

function initLed(pin){
  var led = {}
  
  if (pin>0){
    ledPin = new Gpio(pin, 'out');
    
    led.on    = function(){ledPin.writeSync(1)}
    led.off   = function(){ledPin.writeSync(0)}
    led.blink = function(count){
        if (count <= 0) {
            ledPin.writeSync(0);
            return
        }
        ledPin.writeSync(ledPin.readSync() === 0 ? 1 : 0) 
        setTimeout(function () {
            led.blink(count - 1);
        }, 250);       
    }
  }
  else {
    led.on    = function(){}
    led.off   = function(){}
    led.blink = function(count){}
  }
  return led
}

//------------------------------------------------------------------------------------------------------------------
//  Sonus speech recognition modul
//
var args = process.argv.slice(2)

DEBUG = false
NOACTION = false
if(args[0] === 'debug'){DEBUG = true}
if(args[1] === 'noaction'){NOACTION = true}

var led = initLed(config.sonusLedGPIO)                                // initialize GPIO for use of LED 

const Sonus = require(__dirname + '/node_modules/sonus/index.js')
const speech = require('@google-cloud/speech')({
    projectId: config.googleProjectId ,
    keyFilename: config.googleKeyFilename
})

const hotwords = [{ file: __dirname + config.sonusHotwordFile, hotword: config.sonusHotword }]
const language  = config.googleLanguage
const audioGain = config.sonusAudioGain

const sonus = Sonus.init({ hotwords, language, audioGain, recordProgram: "arecord" }, speech)
Sonus.start(sonus)                                                    // start waiting on a hotword
led.blink(4)                                                          // notify user by blinking LED                                                         // notify user by blinking LED

if(DEBUG){console.log('               Say: ' + hotwords[0].hotword +' or press button microphone ...')}

// event: hotword detected ...
sonus.on('hotword', (index, keyword) => {
  led.on()                                                            // switch LED on to indicate recording mode
  if(DEBUG){console.log('         triggered:  '+ config.logPrompt)}
})

// event: final result from Google speech API received ...
sonus.on('final-result', result => {
  if(DEBUG){console.log("      Final Result: >>" + result +"<<")}
  target = textToInstruction(result)                                  // filter device instruction from recognized text  
  if( target.ok ){                                                    // in case we have a valid instruction 
    led.blink(4)                                                      // acknowledge by LED blinking and
    sendDeviceRequest(target);                                        // send command to target device 
  }
  cleanup();
})

// event: an error occured ...
sonus.on('error', error => {
 // output error message
  Sonus.stop();
  var dt = new Date();
  timestamp = dt.getDate()+'.'+(dt.getMonth()+1)+'.'+dt.getFullYear()+'  '+dt.getHours()+':'+dt.getMinutes()
  console.log(timestamp +': Sonus error')
  console.log(error)
  Sonus.start(sonus)
  cleanup();
})

function cleanup(){
  led.off()                                                             // switch LED off and wait on next instruction
  if(DEBUG){console.log('               Say: ' + hotwords[0].hotword +' or press button microphone ...')}
}

//---------------------------------------------------------------------------------------------------------------------
// Input event handler for Zeepin TZ MX6 2,4 GHz Wireless Remote
//
var InputEvent = require('input-event');

const event0 = new InputEvent('/dev/input/'+config.eventFiles['kbd']);
const event1 = new InputEvent('/dev/input/'+config.eventFiles['mouse']);

event0.on('data', function(buffer){
  eventReceived(buffer)
});

event1.on('data', function(buffer){
  eventReceived(buffer)
});

function eventReceived(buffer){
  //console.log('Key : ', config.KeyCode[buffer.code],'  value: ',buffer.value) 
  if (buffer.code in config.KeyCode){
    if(buffer.value === 1){
      if(config.KeyCode[buffer.code] === 'micro'){
        // on button "microphone" pressed, we start streaming to Google Cloud Speech API
        Sonus.trigger(sonus, 0, 'triggered')
      }
      else {
        // all other buttons will be send as short cut to the last used device
        var target = {};
        if (lastTarget.device !== '-'){
          target.device  = lastTarget.device;
          target.attribute = lastTarget.attribute;
          //target.message = target.attribute + ' ' + config.RFkeyCode[buffer.code]              # to implement in next version
          target.message = config.KeyCode[buffer.code]
          if(DEBUG){console.log(' button on key pad: ' + config.KeyCode[buffer.code])};
          sendDeviceRequest(target)
          if(DEBUG){console.log('               Say: ' + hotwords[0].hotword +' or press button microphone ...')}
        }
      }
    }
  }
}
