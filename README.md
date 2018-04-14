# s2cmd
Speech recognition modul to translate a spoken instruction into a device control

This nodejs modul can be used on a **Raspberry PI 2/3**  to implement a simple speech recognition interface to [Pimatic](https://pimatic.org) or other applications with an open command interface. The module is listening offline for a customizable hotword using the [Sonus speech recognition](https://github.com/evancohen/sonus) lib as a front end to the [Google Cloud Speech API](https://cloud.google.com/speech-to-text).

<img src="https://github.com/MrSponti/s2cmd/blob/master/Microphone.png" width="300" height="250">

You can use a USB mic or a 2,4 GHz Wireless Remote with microphone to quickly and easily realize a speech User Interface like Alexa, Google Now or Siri to your software project.

## Requirements
- a Raspberry PI Model 2 or 3 with RASPBIAN JESSIE or STRETCH
- a operating USB or wireless RF microphone (you should test the micro with 'arecord')
- access to the Google Cloud Speech API<br>   Follow [these instructions](https://cloud.google.com/speech/docs/getting-started) in case you need to setup an account.
- node v6 or higher  (use nvm to run pimatic and s2cmd in parallel)

## Installation
After installing the OS you need to check if your microphone is working under ALSA using the recording program **'arecord'**. The USB or wireless RF mic is seen as an additional audio card. For use of the standard audio (card 0) and the mic (card 1) you need to configure these cards as ALSA default devices in *'/etc/asound.conf'*. 

```
pcm.!default {
    type asym
    playback.pcm "plughw:0"
    capture.pcm  "plughw:1"
}
```
Please consult the internet for more details on "How to configure ALSA default devices?".

If you have verified that the mic is working with *'arecord'*, you can start the installation of the s2cmd modul. Move to your HOME directory and clone the repository.
```
cd ~
git clone https://github.com/MrSponti/s2cmd.git
```

Ensure that you are running node 6.x and higher and move into the installed folder 's2cmd' to install the node dependencies.
```
cd ~/s2cmd
npm install
```

Configure the module by editing the configuration file `config.js`.

## Configuration options

The following properties needs to be configured:

|Option|Description|
|---|---|
|``sonusLedGPIO``|You can connect a LED to a GPIO port. The LED is blinking in recording mode and stop blinking when recording mode is stopped.<br>`Default = 0`  (means *no* LED connected) |
|``sonusHotword``| The hotword to start recording mode.<br>`Default = 'pimatic'` (see also [snowboy hotword detection](https://github.com/Kitt-AI/snowboy))|
|``googleKeyFilename``|The filename whichinclude the credentials to access the Google Cloud Speech API|
|``sonusHotwordFile``|The keword definition file stored in folder ../resources.<br>`Default = '/resources/pimatic.pmdl'`|
|``sonusSensitivity``|Sensitivity parameter for hotword detection.<br>`Default = 0.5`  (see also [snowboy hotword detection](https://github.com/Kitt-AI/snowboy))|
|``sonusAudioGain``|Audio gain parameter for hotword detection.<br>`Default = 2.0`  (see also [snowboy hotword detection](https://github.com/Kitt-AI/snowboy))|
|``logPrompt``|Acknowlege message for console log if hotword is detected (only used in debug mode)|
|``googleLanguage``|Language parameter for use with Google Cloud Speech API.<br>`Default = 'de_DE'`|
|``googleProjectId``| Your Google project Id name used to access the Google Cloud Speech API.|
|``googleKeyFilename``|The filename whichinclude the credentials to access the Google Cloud Speech API|
|``pimaticUser``|User login name configured in ``config.json`` of your **pimatic installation**|
|``pimaticPasswd``|Passwd of your specified pimatic user login name|

## First steps
After you have finished the configuration you can start the module in ``debug mode`` inside your installation folder:
```
pi@phoscon:~/s2cmd $ s2cmd.js debug
               Say: pimatic ...
           pimatic:  Ja, bitte?
      Final Result: >>schalte im Wohnzimmer das Licht ein<<
    filtered words: >>livingroom:light:-:on<<
       Instruction: >>livingroom:light:mainlight:on<<
    mapped command: >>press buttonWZon<<
    send to target: pimatic:80 pimatic press buttonWZon
               
               Say: pimatic ...
```
The example above shows the result of the spoken text `pimatic - schalte im Wohnzimmer das Licht ein`. The spoken text is translated by using the Google Cloud Speech API and afterwards parsed through a filter creating the command `livingroom:light:mainlight:on`. After mapping the instruction to a pimatic action string, by using a mapping table defined in **'config.js'**,  the mapped command is send to the target device defined for the service point `livingroom:light` in the **config.devices** table. The use of the mapping table is optional. In case that there is no entry for the parsed instruction, the modul send a service request to the target device found in the **config.devices** table. This table also defines the protocol to use for the communication to the target device. With this mechanism it would be easy to implement other communication protocols like e.q. MQTT. In the examle the entry in the **config.devices** table include the required information to send a HTTP POST request to the pimatic REST API.

## Dependencies

This module requires you to install
 [sonus](https://github.com/evancohen/sonus) 
