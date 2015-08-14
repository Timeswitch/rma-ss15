/**
 * Created by michael on 12/08/15.
 */
define(function() {
    'use strict';

    function RobotPart(store) {

        return store.defineResource({
            name: 'RobotPart',
            methods: {
                getImage: function(back,side){
                    var path = 'robo_' + this.slot;

                    if(this.slot == 'arms' || this.slot == 'legs'){
                        if(side != 'left' && side != 'right'){
                            return {
                                left: this.getImageLeft(back),
                                right: this.getImageRight(back)
                            };
                        }

                        path = path.substring(0,path.length) + '_' + side;
                    }

                    if(back === true){
                        path += '_back';
                    }

                    path += '_' + this.image;

                    return path;
                },
                getImageLeft: function(back){
                    return this.getImage(back,'left');
                },
                getImageRight: function(back){
                    return this.getImage(back,'right');
                }
            }
        });

    };

    return RobotPart;

});