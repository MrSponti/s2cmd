# s2cmd
Speech recognition modul to translate a spoken instruction into a device control

This nodejs modul provide a simple speech recognition interface to [Pimatic](https://pimatic.org) or other applications with an open command interface.The module is listening offline for a customizable hotword and use the [Sonus speech recognition](https://github.com/evancohen/sonus) lib as a front end to the Google Cloud Speech API.

You can use a 2,4 GHz Wireless Remote with a microphone to quickly and easily realize a speech User Interface like Alexa, Google Now or Siri to your software project.

## Installation

```
npm install s2cmd
```

## Dependencies

This module requires you to install
 [sonus](https://github.com/evancohen/sonus) 
