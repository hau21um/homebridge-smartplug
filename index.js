var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerPlatform("homebridge-smartplug", "smartPlug", smartPlugPlatform);
}

function smartPlugPlatform(log, config){
  function stringGen(length) {
    var text = "";
    var charset = "0123456789";
    for( var i=0; i < length; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  }

  this.log = log;
  this.airos_sessionid = config["airos_sessionid"] || stringGen(32);
  this.outlets = config["outlets"];
}

smartPlugPlatform.prototype = {
  accessories: function(callback){
    var foundAccessories = [];

    var count = this.outlets.length;

    for(index=0; index< count; ++index){
      var accessory  = new smartPlugAccessory(
        this.log,
        this.airos_sessionid,
        this.outlets[index]);

      foundAccessories.push(accessory);
    }

    callback(foundAccessories);
  }
};

function smartPlugAccessory(log, airos_sessionid, outlet) {
  this.log = log;
  this.airos_sessionid = airos_sessionid;
  this.name = outlet["name"];
  this.username = outlet["username"];
  this.password = outlet["password"];
  this.url = outlet["url"];
  this.id = outlet["id"];

  this.services = [];

  this.outletService = new Service.Outlet(this.name);

  this.outletService
    .getCharacteristic(Characteristic.On)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));

  /*Power consumption in Watt*/
  this.outletService
    .getCharacteristic(Characteristic.OutletInUse)
    .on('get', this.getOutletInUse.bind(this));

  this.services.push(this.outletService);
}

smartPlugAccessory.prototype.setState = function(state, callback) {
  var exec = require('child_process').exec;
  state = (state == true || state == 1) ? 1 : 0;
  var cmdUpdate = 'sshpass -p' + this.password + ' ssh -o StrictHostKeyChecking=no ' + this.username + '@' + this.url + ' "echo ' + state + ' > /sys/class/leds/tp-link\:blue\:relay/brightness"';
  var stateName = (state == 1) ? 'on' : 'off';
  this.log("Turning " + this.name + " outlet " + stateName + ".");
      exec(cmdUpdate, function(error, stdout, stderr) {
        if (!error) {
            var response = stdout;
            if("success" == "success") {
              callback(null);
            } else {
              callback(error);
            }
        }
      });
}

smartPlugAccessory.prototype.getState = function(callback) {
  var exec = require('child_process').exec;
  var cmdStatus = 'sshpass -p' + this.password + ' ssh -o StrictHostKeyChecking=no ' + this.username + '@' + this.url + ' "cat /sys/class/leds/tp-link\:blue\:relay/brightness"';
      exec(cmdStatus, function(error, stdout, stderr) {
        if (!error) {
          if (stdout != "") {
            var state = stdout;
            if(state == 1) {
              callback(null, true);
            } else if(state == 0) {
              callback(null, false);
            }
            else {
              callback(error);
            }
          } else {
            console.log("Failed to communicate with smartPlug accessory");
          }
        } else {
          console.log("Failed with error: " + error);
        }
      });
}

smartPlugAccessory.prototype.getOutletInUse = function(callback) {
  return callback(null, true);
}

smartPlugAccessory.prototype.getDefaultValue = function(callback) {
  callback(null, this.value);
}

smartPlugAccessory.prototype.setCurrentValue = function(value, callback) {
  this.log("Value: " + value);

  callback(null, value);
}

smartPlugAccessory.prototype.getServices = function() {
  return this.services;
}
