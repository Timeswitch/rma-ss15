/**
 * Created by michael on 31/08/15.
 */

define([
    'states/BaseState'
],function(BaseState){

    function Friendlist(){
        this.app = null;
    }

    Friendlist.prototype = Object.create(BaseState.prototype);
    Friendlist.prototype.constructor = Friendlist;

    Friendlist.prototype.create = function(){

    };

    return new Friendlist();
});