# homebridge-smartplug
This is a plugin for [homebridge](https://github.com/nfarina/homebridge). It allows you to control your Kankun Smartplug outlets with HomeKit.

# Installation

1. Install homebridge (if not already installed) using: `npm install -g homebridge`
2. Install plugin - npm install -g homebridge-smartplug
3. Update your configuration file. See below for a sample.
4. ensure sshpass is installed

# Configuration

```
"platforms": [
  {
    "platform": "smartPlug",
    "name": "smartPlug",
    "outlets": [
      {
        "name": "Chrismass Light 3",
        "username": "root",
        "password": "p9z34c",
        "url": "192.168.88.111",
        "id": "1"
      }
    ]
  }
]
```

| Parameter | Description |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name` | The human-readable name of the device plugged into your outlet |
| `username` | Your Kankun SmartPlug Controller username |
| `password` | Your Kankun Controller password |
| `url` | May be either a hostname or an IP address |
| `id` | So far one one outlet controler is supported ( ==> id=1 )  |


# How it works
This plugin is basically a homebridge-compatible implementation of on/off status hacking found  on [Hacking Kankun Smart Wifi Plug](http://www.anites.com/2015/01/hacking-kankun-smart-wifi-plug.html). It reads/writes from /sys filesystem of SmartPlug device via ssh and utilising sshpass to toggle the device `on` or `off`.

# Acknowledgements
This work was inspired/based by/on [homebridge-mpower](git+https://github.com/wr/homebridge-mpower.git) 
