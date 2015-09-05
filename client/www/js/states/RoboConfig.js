/**
 * Created by michael on 05/09/15.
 */
define([
    'states/BaseState'
],function(BaseState){

    function RoboConfig(){
        BaseState.call(this);
    }

    BaseState.prototype = Object.create(BaseState.prototype);
    BaseState.prototype.constructor = RoboConfig;

    RoboConfig.prototype.init = function(){
        BaseState.prototype.init.call(this);
    };

    RoboConfig.prototype.create = function(){

    };

    return new RoboConfig();

});