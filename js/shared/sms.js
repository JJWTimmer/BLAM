function SMS(pane, handled, reverse) {
    //constructor
    var self = this;
    var pane = pane;
    var firstID = 0;
    var lastTimestamp = "";
    var handled = handled;
    var TimeOut = null;
    var pane_id = '';
    var reverse = reverse;

//TODO: update ajax reference
    this.getSMS = function () {
        $.tzPOST('getSMSList', {timestamp_last_update:lastTimestamp, handled:handled}, function (r) {
            if (r) {
                if (r.error) {
                    general.displayError(r.error);
                } else {
                    if (lastTimestamp == "") {
                        //pane_id cannot be set in the constructor, so is set here
                        pane_id = pane.getContentPane().parent().parent().attr('id');
                        pane.getContentPane().html('<div class="retrieve_previous_sms rounded"><p align="center">Haal oudere sms op...</p></div>');
                        pane.reinitialise();
                    }

                    lastTimestamp = r[0].timestamp;

                    for (var i = 1; i < r.length; i++) {
                        if (r[i]) {
                            self.addSMS(r[i]);
                        }
                    }

                    //if new sms, update firstid
                    if (r.length > 1 && firstID == 0) {
                        firstID = r[1].id;
                    }

                    //empty no sms
                    if ($('#' + pane_id + ' .jspContainer .jspPane .sms').length == 0 && $('#' + pane_id + ' .jspContainer .jspPane > p').length == 0) {
                        pane.getContentPane().append('<p class="count">Geen SMS</p>');
                        $('#' + pane_id + ' .jspContainer .jspPane .retrieve_previous_sms').hide();
                        pane.reinitialise();
                    }

                    // If this is the first sms, remove the paragraph saying there aren't any:
                    if ($('#' + pane_id + ' .jspContainer .jspPane .sms').length > 0 && $('#' + pane_id + ' .jspContainer .jspPane > p').length > 0) {
                        $('#' + pane_id + ' .jspContainer .jspPane > p').remove();
                        $('#' + pane_id + ' .jspContainer .jspPane .retrieve_previous_sms').show();
                        pane.reinitialise();
                    }

                }
                TimeOut = setTimeout(function () {
                    self.getSMS();
                }, 10000);
            }
            else {
                //No sms available, so empty it
                pane.getContentPane().empty();
                TimeOut = setTimeout(function () {
                    self.getSMS();
                }, 1000);
                pane.reinitialise();
            }

        });
    };

//TODO:update ajax reference
    this.getOldSMS = function () {
        $.tzPOST('getSMSList', {first_id:firstID, handled:handled}, function (r) {
            if (r) {
                if (!r.error) {
                    //alert(r[0].query);
                    for (var i = 1; i < r.length; i++) {
                        self.addSMS(r[i]);
                        if (parseInt(r[i].id) < parseInt(firstID)) {
                            firstID = r[i].id;
                        }
                    }
                    if (r[0].limit == 'false') {
                        $('#' + pane_id + ' .retrieve_previous_sms').remove();
                    }
                }
                else {
                    general.displayError(r.error);
                }
            }
        });
    };


    this.addSMS = function (my_sms) {
        var markup = '';
        markup = general.render('sms', my_sms);

        var exists = $('#' + pane_id + ' .sms-' + my_sms.id);

        var match = 0;
        //alert('called:'+called);
        //alert('params.called:'+params.called);

        if ((my_sms.handled_at == null && handled == 'false') || (my_sms.handled_at != null && handled == 'true')) {
            match = 1;
        }
        //sms status matches sms list
        if (match == 1) {

            //check if sms already exists --> replace
            if (exists.length) {
                if (reverse) {
                    exists.before(markup);
                }
                else {
                    exists.after(markup);
                }
                exists.remove();
            }
            else {
                //is this the first sms? --> append it
                var smsen = $('#' + pane_id + ' .sms');
                if (firstID == my_sms.id && smsen.length == 0) {
                    pane.getContentPane().append(markup);
                }
                else {
                    //go through the entire list and place it somewhere logically
                    var closest;
                    var best_distance = 99;
                    $('#' + pane_id + ' .sms').each(function (i) {
                        var distance = Math.abs(parseInt($(this).attr('id')) - parseInt(my_sms.id));
                        if (distance < best_distance) {
                            closest = $(this);
                            best_distance = distance;
                        }
                    });

                    if (closest) {
                        //alert("adding to closest ticket, ticket:" + params.id);
                        if (parseInt(closest.attr('id')) > parseInt(my_sms.id)) {
                            if (reverse) {
                                closest.after(markup);
                            }
                            else {
                                closest.before(markup);
                            }
                        }
                        else {
                            if (reverse) {
                                closest.before(markup);
                            }
                            else {
                                closest.after(markup);
                            }
                        }
                    }
                    else {
                        if (reverse) {
                            pane.getContentPane().prepend(markup);
                        }
                        else {
                            pane.getContentPane().append(markup);
                        }
                    }
                }
            }
            if (my_sms.id < firstID) {
                firstID = my_sms.id;
                //alert("firstID=" + firstID)
            }
        }
        //check to see if status matches fails, but ticket id does exist --> ticket has moved, remove in this list
        // this is important, because this 'deletes' the moved ticket!
        else {
            if (exists.length) {
                exists.remove();
                //alert("removing existing");
            }
        }
        // As we added new content, we need to
        // reinitialise the jScrollPane plugin:
        pane.reinitialise();
    };

		//TODO change ajax reference to actual reference
    this.closeSMS = function (sms_id) {
        $.tzPOST('handleSMS', {id:sms_id}, function (r) {
            //TODO: what does this line below do?
            display.clearDisplay();
            $('.sms-'+sms_id).remove();
        });
    };
    
    this.refreshSMS = function () {

        clearTimeout(TimeOut);
        TimeOut = setTimeout(function () {
            self.getSMS();
        }, 500);
    };

    this.setPane = function (newpane) {
        pane = newpane;
    };

    this.kill = function () {
        //alert(TimeOut);
        clearTimeout(TimeOut);
    };

}
