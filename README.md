# s2cmd
Speech recognition modul to translate a spoken instruction into a device control

On a **Raspberry PI 2/3** this nodejs modul provide a simple speech recognition interface to [Pimatic](https://pimatic.org) or other applications with an open command interface. The module is listening offline for a customizable hotword and use the [Sonus speech recognition](https://github.com/evancohen/sonus) lib as a front end to the Google Cloud Speech API.

<img src="https://github.com/MrSponti/s2cmd/blob/master/Microphone.png" width="300" height="250">

You can use a 2,4 GHz Wireless Remote with a microphone to quickly and easily realize a speech User Interface like Alexa, Google Now or Siri to your software project.

## Requirements
- a Raspberry PI Model 2 or 3 with RASPBIAN JESSIE or STRETCH
- a operating USB or wireless RF microphone (you should test the micro with 'arecord')
- access to the Google Cloud Speech API
   Follow [these instructions](https://cloud.google.com/speech/docs/getting-started) in case you need to setup an account.
- node v6.x (use nvm to run pimatic and s2cmd in parallel)

## Installation

Create a installation folder and navigate into this folder:
```
mkdir ~/s2cmd
cd ~/s2cmd
```

Clone this repository:
```
git clone https://github.com/MrSponti/s2cmd.git
```

Install the node dependencies.
```
npm install
```

Configure the module by editing the configuration file `config.js`.

## Configuration options

The following properties needs to be configured:

|Option|Description|
|---|---|
|``sonusLedGPIO``|You can connect a LED to a GPIO port. The LED is blinking in recording mode and stop blinking when recording mode is stopped. ##Default = 0##  (means ##no## LED connected) |
|``sonusHotword``| The hotword to start recording mode. Default = ##'pimatic'## (see also [sowboy hotword detection](https://github.com/Kitt-AI/snowboy))|
|``googleKeyFilename``|The filename whichinclude the credentials to access the Google Cloud Speech API|
|``sonusHotwordFile``|The keword definition file stored in folder ../resources. ##Default = '/resources/pimatic.pmdl'##|
|``sonusSensitivity``|Sensitivity parameter for hotword detection (see also [sowboy hotword detection](https://github.com/Kitt-AI/snowboy))|
|``sonusAudioGain``|Audio gain parameter for hotword detection (see also [sowboy hotword detection](https://github.com/Kitt-AI/snowboy))|
|``logPrompt``|Acknowlege message for console log if hotword is detected (only used in debug mode)|
|``googleLanguage``|Language parameter for use with Google Cloud Speech API. ##Default = 'de_DE'##|
|``googleProjectId``| Your Google project Id name used to access the Google Cloud Speech API.|
|``googleKeyFilename``|The filename whichinclude the credentials to access the Google Cloud Speech API|
|``pimaticUser``|User login name configured in ``config.json`` of your **pimatic installation**|
|``pimaticPasswd``|Passwd of your specified pimatic user login name|

## Dependencies

This module requires you to install
 [sonus](https://github.com/evancohen/sonus) 
