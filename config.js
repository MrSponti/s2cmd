/**
 * Config file for speech recognition modul 'srpimatic.js'
 *
 * (c) Mr. Sponti           latest update: 13.04.2018
 *
 * This file contains the configuration parameter for module as well as the word defintions
 * to build a formated and unique instruction from a spoken text.
 * The words of the spoken instruction will be filtered to build a unique command consisting of
 *  
 * ==> 4 elements:      zone:object:attribute:command                
 *        example:      livingroom:light:mainlight:on
 *
 *  The combination of zone and object is seen as a device and has a assigned host address and communication parameter
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
    'sonusLedGPIO':       0,                                            // recording indication LED connected to GPIO17
    'sonusHotword':       'pimatic',                                    // hotwords to start recording
    'sonusHotwordFile':  '/resources/pimatic.pmdl',                     // snowboy hotword file
    'sonusSensitivity':   '0.6',                                        // hotword recording sensitivity
    'sonusAudioGain':     2.0,                                          // hotword recording audio gain
    'logPrompt':          'Ja, bitte?',                                 // prompt to display on MagicMirror
    'googleLanguage':     'de_DE',
    'googleProjectId':    'yourGoogleProjecId',                         // google authorization credentials
    'googleKeyFilename':  'yourGoogleKeyFilename',
    'pimaticUser':        'yourPimaticUser',                            // pimatic user credentials
    'pimaticPasswd':      'yourPimaticUserPassword'                 
}        

/**
 *  dictionary of words used to define final instruction by filtering spoken text
 **/
//  ==>  commands
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
// ==> object attributes
//
//     spoken word : [ translation to attribute, default object, (optional - default zone)]
config.attribute =   {
    'stehlampe':    ['floorlamp', 'licht', 'livingroom'],
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
//  ==> object
//
//     spoken word : [ translation to object, default zone, default attribute]     
config.object = {
    'licht':       ['light', 'diningroom', 'mainlight'],
    'fernseher':   ['tv','livingroom','power'],
    'radio':       ['radio','diningroom', '-'],
    'monitor':     ['monitor', 'diningroom', '-'],
    'rolladen':    ['shutter','bedroom', 'direction'],
    'photos':      ['picture','diningroom', 'vacation'],
    'garage':      ['garage', 'garage', 'door'],
    'kamera':      ['camera', 'outdoor', 'channel'],
    'postit':      ['postit', 'diningroom', 'message']
}
//
// ==> object zones            
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
// ==>  mapping table: map full instruction to short instruction            
config.cmdMap = {  
    'diningroom:postit:message:delete':         'delete',
//  
    'diningroom:light:mainlight:on':            'press buttonFLon',
    'diningroom:light:mainlight:off':           'press buttonFLon',
//   
    'livingroom:light:mainlight:on':            'press buttonWZon',
    'livingroom:light:mainlight:off':           'press buttonWZon',
    'livingroom:light:floorlamp:on':            'press onoff',
    'livingroom:light:floorlamp:off':           'press onoff',
    'livingroom:light:floorlamp:up':            'press dim-plus',
    'livingroom:light:floorlamp:down':          'press dim-min',
//
    'garage:garage:door:open':                  'press open-garage',
    'garage:garage:door:close':                 'press close-garage',
}

//  capability = 0 --> a short instruction will not send to the last used target device (must be greater 0)
//              >0 --> a short instruction will be send to the last used target device
//               2 --> device accept optional words for detailing the attribute information
config.devices =   {
    'diningroom:speechlog': {'host': 'Infoboard', 'port': 5588, 'service': 'SPEECHLOG', 'capability': 0},
    'diningroom:postit':    {'host': 'Infoboard', 'port': 5588, 'service': 'POSTIT', 'capability': 0},
    'diningroom:picture':   {'host': 'Infoboard', 'port': 5588, 'service': 'PHOTOSHOW', 'capability': 2},
    'diningroom:monitor':   {'host': 'Infoboard', 'port': 5577, 'service': 'mm motion', 'capability': 0},
    'diningroom:radio':     {'host': 'fidelio',   'port': 5577, 'service': 'audio', 'capability': 1},
    'diningroom:light':     {'host': 'pimatic',   'port': 80,   'service': 'pimatic', 'capability': 0},    
    'livingroom:radio':     {'host': 'pimatic',   'port': 5577, 'service': 'audio', 'capability': 1},
    'livingroom:tv':        {'host': 'pimatic',   'port': 5577, 'service': 'tv', 'capability': 1},
    'livingroom:light':     {'host': 'pimatic',   'port': 80,   'service': 'pimatic', 'capability': 0},
    'office:radio':         {'host': 'cms',       'port': 5577, 'service': 'audio', 'capability': 1},
    'bedroom:shutter':      {'host': 'pimatic',   'port': 5577, 'service': 'jarolift', 'capability': 0},  
    'garage:garage':        {'host': 'pimatic',   'port': 80,   'service': 'pimatic', 'capability': 0},
    'outdoor:camera':       {'host': 'Infoboard', 'port': 5588, 'service': 'RTSP', 'capability': 1}
}           
module.exports = config