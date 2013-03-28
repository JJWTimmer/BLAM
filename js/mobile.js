$(document).ready(function () {

    // Run the init method on document ready:
    logging.init();

});

var Timeout = new Array();

var logging = {

    // data holds variables for use in the class:

    data:{
        lastID:1,
        noActivity:0,
    },

    // Init binds event listeners and sets up timers:

    init:function () {

        // add listener for this button
        $('#submitbutton').bind('click', function () {
            $('#submitForm').submit();
        });

        $('#autotextbutton').bind('click', function () {
            $('#messagetext').val($('#messagetext').val() + $('#autotext_Handle').val() + ' ');
        });

        // Using the defaultText jQuery plugin, included at the bottom:
        $('#name').defaultText('Nickname');
        $('#password').defaultText('Password');

        // We use the working variable to prevent multiple form submissions:
        var working = false;

        // Converting the #MeldingenList, #UsersList, #HandlesList divs into a jScrollPane,
        // and saving the plugin's API in logging.data:

        logging.data.jspAPIMeldingen = $('#MeldingenList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        // Logging a person into blam:
        $('#loginForm').submit(function () {
            if (working) return false;
            working = true;

            // Using our tzPOST wrapper function (defined in the bottom):
            //$(this).serialize encodes all the name form elements to be used by php
            $.tzPOST('login', $(this).serialize(), function (r) {
                working = false;

                if (r.error) {
                    general.displayError(r.error);
                }
                else {
                    logging.login(r.username, r.avatar, r.role);
                }
            });

            return false;
        });

        // Checking whether the user is already logged (browser refresh)

        $.tzPOST('checkLogged', function (r) {
            if (!r.error) {
                logging.login(r.username, r.avatar, r.role);

            }
        });

        // Logging the user out:

        $('a.logoutButton').live('click', function () {
            logging.killTimeouts();
            $('#TopContainer > span').fadeOut(function () {
                $(this).remove();
            });
            $('#TopContainer').fadeOut();
            $('#MainContainer').fadeOut(function () {
                $('#Login').fadeIn();
            });

            $.tzPOST('logout');

            return false;
        });


        // Submitting a new message entry:

        $('#submitForm').submit(function () {

            var text = $('#messagetext').val();

            if (text.length == 0) {
                return false;
            }

            if (working) return false;
            working = true;

            // Assigning a temporary ID to the chat:
            var tempID = 't' + Math.round(Math.random() * 1000000),

                params = {
                    id:tempID,
                    username:logging.data.username,
                    avatar:logging.data.avatar,
                    text:text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                };

            // Using our addMessageLine method to add the message
            // to the screen immediately, without waiting for
            // the AJAX request to complete:
            logging.addMessageLine($.extend({}, params));

            // Using our tzPOST wrapper method to send the message
            // via a POST AJAX request:
            var inputcheckbox = $('#ticket:checked').val();
            $.tzPOST('addMessage', $(this).serialize(), function (r) {
                if (!r.error) {
                    //empty input form textbox
                    $('#messagetext').val('');
                    if (inputcheckbox != undefined) {
                        $('#ticket').attr('checked', false);
                        window.clearTimeout(Timeout["Tickets"]);
                        logging.getTickets();
                    }
                    //remove old temporary message
                    $('div.message-' + tempID).remove();

                    //insert newly received ID
                    params['id'] = r.id;
                    logging.addMessageLine($.extend({}, params));
                }
                else {
                    general.displayError(r.error);
                }

            });
            working = false;
            return false;
        });

        //catching window resizes
        var resizeTimer = null;
        $(window).bind('resize', function () {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(logging.reInitJSP, 100);
        });


    },
    /*-------------------------------------*/
    /*             END OF INIT             */
    /*-------------------------------------*/

    // The login method hides displays the
    // user's login data and shows the submit form
    login:function (username, avatar, role) {
        //replace empty avatar filed
        var new_avatar = avatar;
        if ((avatar == "") || (avatar == "NULL")) {
            new_avatar = "img/unknown30x30.png";
        }

        logging.data.username = username;
        logging.data.avatar = new_avatar;
        logging.data.role = role;

        $('#TopContainer').html(general.render('logging-loginTopBar', logging.data));
        $('#Login').fadeOut(function () {
            $('#MainContainer').fadeIn();
            $('#TopContainer').fadeIn();
            logging.getMessages();
        });
    },

    // This method requests the latest messages
    // (since last_id,timestamp), and adds them to the page. currently 24 hours past messages

    getMessages:function () {
        //timestamp uses 2 hours (120 min)
        $.tzPOST('getMessages', {last_id:logging.data.lastID, date_and_time:general.generateTimestamp(120)}, function (r) {
            //update messages from mysql db
            if (r) {
                if (!r.error) {
                    for (var i = 0; i < r.length; i++) {
                        logging.addMessageLine(r[i]);
                    }

                    // bata-123 and arts-1 formats.
                    general.highlightHandles(logging.data.jspAPIMeldingen.getContentPane(), logging.data.groups);

                    //if new messages, update to lastid
                    //message.data.noActivity is reset, so next update in 1 second

                    if (r.length) {
                        logging.data.noActivity = 0;
                        logging.data.lastID = r[i - 1].id;
                    }
                    else {
                        // If no messages were received, increment
                        // the noActivity counter.

                        logging.data.noActivity++;
                    }

                    //if no messages exist yet
                    if ($("#MeldingenList .jspContainer .jspPane > div").length == 0 && $("#MeldingenList .jspContainer .jspPane > p").length == 0) {
                        logging.data.jspAPIMeldingen.getContentPane().html('<p class="noMessages">Nog geen meldingen</p>');
                        logging.data.jspAPIMeldingen.reinitialise();
                    }

                    if ($("#MeldingenList .jspContainer .jspPane > div").length > 0 && $("#MeldingenList .jspContainer .jspPane > p").length > 0) {
                        // If this is the first melding, remove the
                        // paragraph saying there aren't any:
                        $('#MeldingenList .jspContainer .jspPane > p').remove();
                    }


                    // Setting a timeout for the next request,
                    // depending on the message activity:

                    var nextRequest = 10000;

                    // 2 seconds
                    if (logging.data.noActivity > 3) {
                        nextRequest = 20000;
                    }

                    if (logging.data.noActivity > 10) {
                        nextRequest = 30000;
                    }

                    // 15 seconds
                    if (logging.data.noActivity > 20) {
                        nextRequest = 60000;
                    }
                }
                else {
                    general.displayError(r.error);
                    var nextRequest = 10000;
                }


                Timeout["Messages"] = setTimeout("logging.getMessages();", nextRequest);
            }
            else {
                logging.data.jspAPIMeldingen.getContentPane().html('<p class="noMessages">Nog geen meldingen</p>');
            }
        });

    },


// The addMessageLine method ads a message entry to the page

    addMessageLine:function (params) {

        if ((params.avatar == "") || (params.avatar == "NULL") || (params.avatar == null)) {
            params.avatar = "img/unknown24x24.png"
        }

        var d = new Date();

        if (params.created) {
            params.time = general.stripToTime(params.created);
        }
        else {
            params.time = (d.getHours() < 10 ? '0' : '' ) + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        }

        var markup = general.render('messageLine', params),
            exists = $('#MeldingenList .message-' + params.id);

        if (exists.length) {
            exists.remove();
        }

        //If this isn't a temporary chat:
        if (params.id.toString().charAt(0) != 't') {
            var previous = $('#MeldingenList .message-' + (+params.id - 1));
            if (previous.length) {
                previous.after(markup);
            }
            else logging.data.jspAPIMeldingen.getContentPane().append(markup);
        }
        else logging.data.jspAPIMeldingen.getContentPane().append(markup);

        // As we added new content, we need to
        // reinitialise the jScrollPane plugin:
        logging.data.jspAPIMeldingen.reinitialise();
        logging.data.jspAPIMeldingen.scrollToBottom(true);

    },


    killTimeouts:function () {
        for (key in Timeout) {
            clearTimeout(Timeout[key]);
        }
    },


    reInitJSP:function () {
        logging.data.jspAPIMeldingen.reinitialise();
        logging.data.jspAPIUsers.reinitialise();
        logging.data.jspAPIHandles.reinitialise();
        logging.data.jspAPITickets.reinitialise();
        logging.data.jspAPIOpenFeedback.reinitialise();
        logging.data.jspAPIClosedFeedback.reinitialise();
        logging.data.jspAPIDisplay.reinitialise()
    }
};
//end of logging var