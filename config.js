/**
 * Config file for speech recognition modul 's2cmd.js'
 *
 * (c) Mr. Sponti           latest update: 22.04.2018
 *
 * This file contains the configuration parameter for the module as well as the word defintions
 * to build a formated and unique instruction from a spoken text.
 * The words of the spoken instruction will be filtered to build a unique command consisting of
 *  
 * ==> 4 elements:      zone:object:attribute:command                
 *        example:      livingroom:light:mainlight:on
 *
 *  The combination of zone and object is seen as a service point and has a assigned target device address and 
 *  communication protocol parameter used to send the final command to that device. 
 *  Example:
 *                         spoken text:    "pimatic, schalte im Esszimmer das Licht ein"
 * 
 *       will generate the instruction:     livingroom:light:mainlight:on
 *     and mapped to the short command:     'press buttonFLon'
 *     the service point 'livingroom:light' from the config.devices table is than used to get the communication protocol 
 *     which is used to send the short command to the device
 *
 * ==>  'livingroom:light': {'host': 'pimatic',   'port': 80,   'service': 'pimatic', 'capability': 0},
 *
 *      for a better understanding of the used approach you can start the s2cmd.js in debug mode:
 *
 * ==>  s2cmd.js debug noaction
 *
 */
var config ={}
config.cmd = {}           // shortcut commands e.q 'ein', 'aus','öffne', ...
config.attribute = {}     // object attributes e.q 'sender', 
config.object = {}        // objects to control e.q 'radio', 'licht'
config.zone = {}          // zone (room) where the object is located
config.cmdMap = {}        // mapping table to map a full instruction (zone:object:attribute:command) to a shortcut command (eq. forward)
config.devices = {}       // object device address parameters, used to send a instruction to an object
config.numbers = {}

// basic config parameter 
config = {
    'sonusLedGPIO':       21,                                           // recording indication LED connected to GPIO17
    'sonusHotword':       'pimatic',                                    // hotword to start recording
    'sonusHotwordFile':   '/resources/pimatic.pmdl',
    'sonusSensitivity':   '0.5',                                        // hotword recording sensitivity
    'sonusAudioGain':     2.0,                                          // hotword recording audio gain
    'logPrompt':          'Ja, bitte?',                                 // prompt to display on MagicMirror
    'googleLanguage':     'de_DE',
    'googleProjectId':    'yourGoogleProjectID',                        // google authorization credentials
    'googleKeyFilename':  'resources/yourGoogleKeyfileName.json',       
    'pimaticUser':        'yourPimaticUser',                            // pimatic user credentials
    'pimaticPasswd':      'yourPimaticUserPassword'                 
}        

/**********************************************************************************************************************
 *  German dictionary of words used to define final instruction by filtering spoken text
 **/
//
// The following definitions cover only the german language.
// For another language the german keywords need to be translated and substituted.
//
// German dictionary:
//
//  ==>  commands
//
config.cmd = {
    'ein' : 'on',
    'einschalten': 'on',
    'aus': 'off',
    'ausschalten': 'off',
    'zeige': 'show',
    'vorwärts': 'forward',
    'weiter': 'play',
    'rückwärts': 'previous',
    'zurück': 'previous',
    'vorhergehendes': 'previous',
    'vorhergehenden': 'previous',
    'vorhergehender': 'previous',
    'pause': 'pause',
    'stopp': 'stop',
    'nächstes': 'next',
    'nächsten': 'next',
    'nächster': 'next',
    'anfang': 'start',
    'ende': 'end',
    'runter': 'down',
    'dunkler': 'down',
    'hoch': 'up',
    'heller': 'up',
    'öffne': 'open',
    'schließe': 'close',
    'lade': 'load',
    'lösche': 'delete',
    'lauter': 'set_volume +10',
    'leiser': 'set_volume -10',
    'vollbild': 'fullscreen',
    'swr3': 'swr3',
    'wdr2': 'wdr',
    'wdr': 'wdr',
    '1live': '1live',
    'bestes': 'bestes',
    'berg': 'berg',
    'antenne': 'antenne'
}
//        
// ==> service object attributes
//
//     spoken word : [ translation to attribute, default object, (optional - default zone)]
//
config.attribute =   {
    'mitteilungen': ['message', 'postit','diningroom'],
    'kanal':        ['channel','fernseher'],
    'sender':       ['channel','-'],
    'osten':        ['ost','rolladen'],
    'norden':       ['nord','rolladen'],
    'infoboard':    ['Infoboard','photos'],
    'urlaub':       ['Urlaub','photos'],
    'hausbau':      ['Hausbau','photos'],
    'familie':      ['Familie','photos'],
    'wohnen':       ['Wohnen','photos'],
    'kinder':       ['Kinder','photos'],
    'aktuell':      ['Aktuell','photos'],
    'album':        ['album','photos'],
    'nacheinander': ['serial', 'photos'],
    'zufällig':     ['random', 'photos'],   
    'auf':          ['channel','-']
}
//
//  ==> service objects
//
//     spoken word : [ translation to object, default zone, default attribute]     
config.object = {
    'stehlampe':   ['lightPlus','livingroom','floorlamp'],
    'licht':       ['light', 'diningroom', 'mainlight'],
    'fernseher':   ['tv','livingroom','channel'],
    'radio':       ['radio','diningroom', '-'],
    'amadeus':     ['radio','office', '-'],
    'monitor':     ['monitor', 'diningroom', '-'],
    'rolladen':    ['shutter','bedroom', 'direction'],
    'photos':      ['picture','diningroom', 'vacation'],
    'garage':      ['garage', 'garage', 'door'],
    'kamera':      ['camera', 'outdoor', 'channel'],
    'postit':      ['postit', 'diningroom', 'message']
}
//
// ==> service zones
//
config.zone = {
    'wohnzimmer': 'livingroom',
    'schlafzimmer': 'bedroom',
    'esszimmer': 'diningroom',
    'büro': 'office',
    'aussen': 'outdoor',
    'garage': 'garage'
}

config.numbers = {
    'eins':   ['one','1'],
    'zwei':   ['two','2'],
    'drei':   ['three','3'],
    'vier':   ['four','4'],
    'fünf':   ['five','5'],
    'sechs':  ['six','6'],
    'sieben': ['seven','7'],
    'acht':   ['eight','8'],
    'neun':   ['nine','9'],
    'zehn':   ['ten','10']
}
//      
// Instruction to short command mapping table: ==> map full instruction to a short command
//
config.cmdMap = {  
    'diningroom:postit:message:delete':         'delete',
//  
    'diningroom:light:mainlight:on':            'press buttonFLon',
    'diningroom:light:mainlight:off':           'press buttonFLon',
//   
    'livingroom:light:mainlight:on':            'press buttonWZon',
    'livingroom:light:mainlight:off':           'press buttonWZon',
//
    'garage:garage:door:open':                  'press open-garage',
    'garage:garage:door:close':                 'press close-garage',
}

//  Service Points (target network devices and related protocols)
//  -------------------------------------------------------------
//  capability = 0 --> a short instruction will not send to the last used service point (must be greater 0)
//              >0 --> a short instruction can be send to the last used service point
//               2 --> service point (target device) accepts optional words for detailing the attribute information
//
//   service point          | hostname           | port        | service name            device capability |
//
config.devices =   {
    'diningroom:speechlog': {'host': 'Infoboard', 'port': 5588, 'service': 'SPEECHLOG', 'capability': 0},
    'diningroom:postit':    {'host': 'Infoboard', 'port': 5588, 'service': 'POSTIT',    'capability': 0},
    'diningroom:picture':   {'host': 'Infoboard', 'port': 5588, 'service': 'PHOTOSHOW', 'capability': 2},
    'diningroom:monitor':   {'host': 'Infoboard', 'port': 5577, 'service': 'mm motion', 'capability': 0},
    'diningroom:radio':     {'host': 'fidelio',   'port': 5577, 'service': 'audio',     'capability': 1},
    'diningroom:light':     {'host': 'pimatic',   'port': 80,   'service': 'pimatic',   'capability': 0},    
    'livingroom:radio':     {'host': 'pimatic',   'port': 5577, 'service': 'audio',     'capability': 1},
    'livingroom:tv':        {'host': 'pimatic',   'port': 5577, 'service': 'tv',        'capability': 1},
    'livingroom:light':     {'host': 'pimatic',   'port': 80,   'service': 'pimatic',   'capability': 1},
    'livingroom:lightPlus': {'host': 'pimatic',   'port': 5577, 'service': 'tradfri',   'capability': 1},
    'office:radio':         {'host': 'amadeus',   'port': 5577, 'service': 'audio',     'capability': 1},
    'bedroom:shutter':      {'host': 'pimatic',   'port': 5577, 'service': 'jarolift',  'capability': 0},  
    'garage:garage':        {'host': 'pimatic',   'port': 80,   'service': 'pimatic',   'capability': 0},
    'outdoor:camera':       {'host': 'Infoboard', 'port': 5588, 'service': 'RTSP',      'capability': 1}
}
/**********************************************************************************************************************
 *  Wireless remote device: Zeepin TZ MX6 2,4 GHz Wireless Remote
 **/
//
// keycodes: 
//
config.KeyCode = {
   28: 'ok',
  103: 'up',
  105: 'previous',
  106: 'next',
  108: 'down',
  114: 'minus',
  115: 'plus',
  116: 'power',
  158: 'return',
  194: 'micro',
}
// input device files:  use 'ls -al /dev/input/by-path' to identify device files of your wireless remote
//
config.eventFiles = {
  'kbd':   'event0',
  'mouse': 'event1',
}
//*********************************************************************************************************************     
module.exports = config
