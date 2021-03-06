# s2cmd
Speech recognition modul to translate a spoken instruction into a device control

This nodejs modul can be used on a **Raspberry PI 2/3**  to implement a simple speech recognition interface to [Pimatic](https://pimatic.org) or other applications with an open command interface. The module is listening offline for a customizable hotword using the [Sonus speech recognition](https://github.com/evancohen/sonus) lib as a front end to the [Google Cloud Speech API](https://cloud.google.com/speech-to-text). Sonus uses [Snowboy](https://snowboy.kitt.ai) for offline hotword recognition. You can use their website or API to define and train a new hotword `(default = 'pimatic')`.

<img src="https://github.com/MrSponti/s2cmd/blob/master/Microphone.png" width="300" height="250">

You can use a USB mic or a 2,4 GHz Wireless Remote with microphone to quickly and easily realize a speech User Interface like Alexa, Google Now or Siri to your software project. With a wireless RF remote like the ["Zeepin TZ MX6 2,4 GHz"](https://de.aliexpress.com/item/Zeepin-TZ-MX6-A-2-4GHz-Wireless-Intelligent-Wireless-Romote-Control-Voice-Control-for-smart-TV/32796526519.html), the microphone is only active if you push the related button and **not permanent listening** for a hotword. If you push the microphon button you don't need to say the hotword as the Google Cloud Speech API is triggered by this button and your speech is then directly streamed to the recognition service.

## Requirements
- a Raspberry PI Model 2 or 3 with RASPBIAN JESSIE or STRETCH
- a operating USB or wireless RF microphone (you should test the micro with 'arecord')
- access to the Google Cloud Speech API<br>   Follow [these instructions](https://cloud.google.com/speech/docs/getting-started) in case you need to setup an account.
- node v6 or higher  (use nvm to run pimatic v0.9 and s2cmd in parallel)

## Installation
After installing the OS you need to check if your microphone is working under ALSA using the recording program **'arecord'**. The USB or wireless RF mic is handled by the OS as an additional audio card. For use of the standard audio (card 0) for playback and the mic (card 1) for recording, you need to configure these cards as ALSA default devices in *'/etc/asound.conf'*. 

```
pcm.!default {
    type asym
    playback.pcm "plughw:0"
    capture.pcm  "plughw:1"
}
```
Please consult the internet for more details on "How to configure ALSA default devices?".

If you have verified that the mic is working with *'arecord'*, you need to ensure that node v6.x or higher is available. If you have already installed pimatic and node v4.x, visit the [Node Version Manager](https://github.com/creationix/nvm) on github to install **nvm** and a node version 6 or higher (e.q. node v8.x (lts)).<br> Now you can start the installation of the s2cmd modul. Move to your HOME directory and clone the repository.
```
cd ~
git clone https://github.com/MrSponti/s2cmd.git
```

Ensure that node 6.x or higher is used in your current environment and move into the installed folder 's2cmd' to install the node dependencies.
```
cd ~/s2cmd
npm install
```

Before you start further configuration steps, ensure that you have your Google API credentials (Project ID, Key file) available.
Configure the module by editing the configuration file `config.js`. 

## Configuration options

The following properties needs to be configured:

|Option|Description|
|---|---|
|``sonusLedGPIO``|You can connect a LED to a Raspberry GPIO port (BCM). The LED is blinking in recording mode and stop blinking when recording mode is stopped.<br>`Default = 0`  (means *no* LED connected) |
|``sonusHotword``| The hotword to start recording mode.<br>`Default = 'pimatic'` (see also [snowboy hotword detection](https://github.com/Kitt-AI/snowboy))|
|``sonusHotwordFile``|The keword definition file stored in folder ../resources.<br>`Default = '/resources/pimatic.pmdl'`|
|``sonusSensitivity``|Sensitivity parameter for hotword detection.<br>`Default = 0.5`  (see also [snowboy hotword detection](https://github.com/Kitt-AI/snowboy))|
|``sonusAudioGain``|Audio gain parameter for hotword detection.<br>`Default = 2.0`  (see also [snowboy hotword detection](https://github.com/Kitt-AI/snowboy))|
|``logPrompt``|Acknowlege message for console log if hotword is detected (only used in debug mode)|
|``googleLanguage``|Language parameter for use with Google Cloud Speech API.<br>`Default = 'de_DE'`|
|``googleProjectId``| Your Google project Id name used to access the Google Cloud Speech API.|
|``googleKeyFilename``|The name of the file providing the credentials to access the Google Cloud Speech API. This file has to be stored in folder  **~/s2cmd/resources** and specified with *`'/resources/xxxxxxxxxxxxxx.json'`*|
|``pimaticUser``|User login name configured in ``config.json`` of your **pimatic installation**|
|``pimaticPasswd``|Passwd of your specified pimatic user login name|

## First steps
After you have finished the configuration you can start the module in ``debug mode`` inside your installation folder:
```
pi@phoscon:~/s2cmd $ s2cmd.js debug noaction
               Say: pimatic or press button microphone ...
           pimatic:  Ja, bitte?
      Final Result: >>schalte im Wohnzimmer das Licht ein<<
    filtered words: >>livingroom:light:-:on<<
       Instruction: >>livingroom:light:mainlight:on<<
    mapped command: >>press buttonWZon<<
    send to target: pimatic:80 pimatic press buttonWZon
               
               Say: pimatic or press button microphone ...
```
The example above shows the result of the spoken text `pimatic - schalte im Wohnzimmer das Licht ein`. The spoken text is translated by using the Google Cloud Speech API and afterwards parsed through a filter creating the command `livingroom:light:mainlight:on`. After mapping the instruction to a pimatic action string, by using a mapping table defined in **'config.js'**,  the mapped command is send to the target device defined for the service point `livingroom:light` in the **config.devices** table. The use of the mapping table is optional. In case that there is no entry for the parsed instruction, the modul send a service request to the target device found in the **config.devices** table. This table also defines the protocol to use for the communication to the target device. With this mechanism it would be easy to implement other communication protocols like e.q. MQTT. In the examle the entry in the **config.devices** table include the required information to send a HTTP POST request to the pimatic REST API.

## Customizing
For a programmer it should be easy to implement new commands and protocols. To shorten the spoken instructions, default values for objects and attributes can be defined in the `config.js` file.<br>
Example:  The spoken words *'schalte das Radio ein'* will expand to the instruction *dinningroom: radio:-on* as the object *radio* has assigned the default zone *dinningroom*. Additionally, in case a zone is not specified in the spoken text, the recognized command will send to the previous service point (target device),  if the parameter capability for that service point is defined >0 in the config file.

Using s2cmd in debug mode and a closer look to the `config.js` file should make the approch more transparent.

## Dependencies

This module requires you to install<br>
 [sonus](https://github.com/evancohen/sonus)           - Voice User Interface<br>
 [onoff](https://github.com/fivdi/onoff)               - GPIO access with Node.js<br>
 [input-event](https://github.com/song940/input-event) - Read and parse input device(like mouse, keyboard and IR-Remote)'s event data<br>
 [request](https://github.com/request/request)         - Simplified HTTP client<br>
