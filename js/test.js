$(document).ready(function () {

    // Run the init method on document ready:
    chat.init(5000);

});

var chat = {

    // data holds variables for use in the class:

    data:{
        lastID:0,
        noActivity:0
    },

    // Init binds event listeners and sets up timers:

    init:function (interval) {

        // Using the defaultText jQuery plugin, included at the bottom:
        $('#username').defaultText('Username');
        $('#password').defaultText('Password');

        var api = $('#msgscroll').jScrollPane().data('jsp');
        var api2 = $('#messages-list').jScrollPane().data('jsp');
        var api3 = $('#msgsearchscroll').jScrollPane().data('jsp');
        var api4 = $('#users-list').jScrollPane().data('jsp');
        var api5 = $('#handle-list').jScrollPane().data('jsp');
        var api6 = $('#ticket-list').jScrollPane().data('jsp');
        var api7 = $('#allfeedback-list').jScrollPane().data('jsp');

        // We use the working variable to prevent
        // multiple form submissions:

        var working = false;

        //set the default history used by getChats
        chat.data.date = '01-01-2010 00:00:00';
        chat.data.search = false;

        // Logging a person in the chat:
        $('#loginForm').submit(function () {

            if (working) return false;
            working = true;

            // Using our tzPOST wrapper function
            // (defined in the bottom):
            //$(this).serialize encodes all the name form elements to be used by php
            $.tzPOST('login', $(this).serialize(), function (r) {
                working = false;

                if (r.error) {
                    chat.displayError(r.error);
                }
                else {
                    chat.login(r.id, r.username, r.avatar, r.role);
                }
            });

            return false;
        });

        // searching messages:
        $('#msgsearchform').submit(function () {

            if (working) return false;
            working = true;

            // Using our tzPOST wrapper function
            // (defined in the bottom):
            //$(this).serialize encodes all the name form elements to be used by php
            $.tzPOST('searchMessages', $(this).serialize(), function (r) {
                working = false;
                api3.getContentPane().html('');
                for (var i = 0; i < r.length; i++) {
                    api3.getContentPane().prepend($('<p />').text(r[i].text));
                }

                //if no chats exist yet
                if (!r.length) {
                    api3.getContentPane().html('<p class="no-msg">No messages found</p>');
                }

                api3.reinitialise();
            });

            return false;
        });

        // Logging the user out:
        $('a.logoutButton').live('click', function () {

            $('#chatTopBar > span').fadeOut(function () {
                $(this).remove();

            });

            $('#loginForm').fadeIn();


            $.tzPOST('logout');

            return false;
        });

        // adding a msg
        $('#msgform').submit(function () {

            if (working) return false;
            working = true;

            // Using our tzPOST wrapper function
            // (defined in the bottom):
            //$(this).serialize encodes all the name form elements to be used by php
            $.tzPOST('addMessage', $(this).serialize(), function (r) {
                working = false;

                if (r.error) {
                    chat.displayError(r.error);
                }
                else {
                    api.getContentPane().prepend($('<p />').text(r.id));
                    api.reinitialise();
                }
            });

            return false;
        });

        // Checking whether the user is already logged (browser refresh)
        $.tzGET('checkLogged', function (r) {
            if (!r.error) {
                chat.login(r.id, r.username, r.avatar, r.role);
            }
        });

        // get all logged messages
        setInterval(function () {
            $.tzPOST('getMessages', {last_id:'all'}, function (r) {
                api2.getContentPane().html('');
                for (var i = 0; i < r.length; i++) {
                    api2.getContentPane().prepend($('<p />').text(r[i].text));
                }

                //if no chats exist yet
                if (!r.length) {
                    api2.getContentPane().html('<p class="no-msg">No messages found</p>');
                }

                api2.reinitialise();
            });
        }, interval);

        // get all logged in users
        setInterval(function () {
            $.tzPOST('getUsers', {options:'logged'}, function (r) {
                api4.getContentPane().html('');
                for (var i = 0; i < r.length; i++) {
                    api4.getContentPane().prepend($('<p />').text(r[i].username));
                }

                //if no users are logged in yet
                if (!r.length) {
                    api4.getContentPane().html('<p class="no-users">No users found</p>');
                }

                api4.reinitialise();
            });
        }, interval);

        // get all groups and handles
        setInterval(function () {
            $.tzPOST('getGroups', {recursive:true}, function (r) {
                api5.getContentPane().html('');
                for (var i = 0; i < r.length; i++) {
                    api5.getContentPane().append($('<p />').text(r[i].name));
                    if (!(typeof r[i]['handles'] === 'undefined')) {
                        for (var j = 0; j < r[i]['handles'].length; j++) {
                            api5.getContentPane().append($('<p />').text('-->' + r[i]['handles'][j].handle_name));
                        }
                    }
                }

                if (!r.length) {
                    api5.getContentPane().html('<p class="no-users">No users found</p>');
                }

                api5.reinitialise();
            });
        }, interval);

        // get all tickets with children (recursive)
        setInterval(function () {
            $.tzPOST('getTicketList', {recursive:true, status:[
                {1:'Open', 2:'Nieuw'}
            ]}, function (r) {
                api6.getContentPane().html('');
                for (var i = 0; i < r.length; i++) {
                    api6.getContentPane().append($('<p />').text(r[i].title));
                    if (!(typeof r[i]['children'] === 'undefined')) {
                        for (var j = 0; j < r[i]['children'].length; j++) {
                            api6.getContentPane().append($('<p />').text('-->' + r[i]['children'][j].title));
                        }
                    }
                }

                if (!r.length) {
                    api6.getContentPane().html('<p class="no-tickets">No tickets found</p>');
                }

                api6.reinitialise();
            });
        }, interval);

        // get all feedback requests
        setInterval(function () {
            $.tzPOST('getFeedback', {}, function (r) {
                api7.getContentPane().html('');
                if (r) {
                    for (var i = 0; i < r.length; i++) {
                        api7.getContentPane()
                            .append($('<p />').text(r[i].title)
                            .append($('<a />')
                            .text('[Gemeld]')
                            .attr('href', '')
                            .click(function () {
                                $.tzPOST('closeFeedback', {id:1}, function (rs) {
                                });
                                return false;
                            })
                        )
                        );
                    }
                }
                if (!r.length) {
                    api7.getContentPane().html('<p class="no-feedback">No feedback found</p>');
                }

                api7.reinitialise();
            });
        }, interval);

    },

    // The login method hides displays the
    // user's login data and shows the submit form

    login:function (id, username, avatar, role) {
        chat.data.userid = id;
        chat.data.username = username;
        if (avatar == '') {
            avatar = '/img/unknown24x24.png';
        }
        chat.data.avatar = avatar;
        chat.data.role = role;
        $('#chatTopBar').html(chat.render('loginTopBar', chat.data));
        $('#loginForm').fadeOut();

    },

    // The render method generates the HTML markup
    // that is needed by the other methods:

    render:function (template, params) {

        var arr = [];
        switch (template) {
            case 'loginTopBar':
                arr = [
                    '<span><img src="', params.avatar, '" width="23" height="23" />',
                    '<span class="username">', params.username,
                    '</span><a href="" class="logoutButton rounded">Logout</a></span>'];
                break;

            case 'chatLine':
                arr = [
                    '<div class="chat chat-', params.id, ' rounded"><span class="avatar"><img src="', params.avatar,
                    '" width="23" height="23" onload="this.style.visibility=\'visible\'" />', '</span><span class="author">', params.author,
                    ':</span><span class="text">', params.text, '</span><span class="time">', params.time, '</span></div>'];
                break;

            case 'user':
                arr = [
                    '<div class="user" title="', params.username, '"><img src="',
                    params.avatar, '" width="30" height="30" onload="this.style.visibility=\'visible\'" /></div>'
                ];
                break;

        }

        // A single array join is faster than
        // multiple concatenations

        return arr.join('');

    },

    // The addChatLine method ads a chat entry to the page

    addChatLine:function (params) {

        // All times are displayed in the user's timezone

        var d = new Date();
        if (params.time) {

            // PHP returns the time in UTC (GMT). We use it to feed the date
            // object and later output it in the user's timezone. JavaScript
            // internally converts it for us.

            d.setUTCHours(params.time.hours, params.time.minutes);
        }

        params.time = (d.getHours() < 10 ? '0' : '' ) + d.getHours() + ':' +
            (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

        var markup = chat.render('chatLine', params),
            exists = $('#chatLineHolder .chat-' + params.id);

        if (exists.length) {
            exists.remove();
        }

        if (!chat.data.lastID) {
            // If this is the first chat, remove the
            // paragraph saying there aren't any:

            $('#chatLineHolder p').remove();
        }

        // If this isn't a temporary chat:
        if (params.id.toString().charAt(0) != 't') {
            var previous = $('#chatLineHolder .chat-' + (+params.id - 1));
            if (previous.length) {
                previous.after(markup);
            }
            else chat.data.jspAPI.getContentPane().append(markup);
        }
        else chat.data.jspAPI.getContentPane().append(markup);

        // As we added new content, we need to
        // reinitialise the jScrollPane plugin:

        chat.data.jspAPI.reinitialise();
        //chat.data.jspAPI.scrollToBottom(true);

    },

    // This method requests the latest chats
    // (since lastID), and adds them to the page.
    getChats:function (callback) {
        if (!chat.data.search) {
            $.tzGET('getChats', {last_id:chat.data.lastID, date:chat.data.date}, function (r) {
                //update chats from mysql db

                for (var i = 0; i < r.chats.length; i++) {
                    chat.addChatLine(r.chats[i]);
                }
                //if new chats, update to lastid
                //chat.data.noActivity is reset, so next update in 1 second

                if (r.chats.length) {
                    chat.data.noActivity = 0;
                    chat.data.lastID = r.chats[i - 1].id;
                }
                else {
                    // If no chats were received, increment
                    // the noActivity counter.

                    chat.data.noActivity++;
                }
                //if no chats exist yet
                if (!chat.data.lastID) {
                    chat.data.jspAPI.getContentPane().html('<p class="noChats">No chats yet</p>');
                }

                // Setting a timeout for the next request,
                // depending on the chat activity:

                var nextRequest = 1000;
                // 2 seconds
                if (chat.data.noActivity > 3) {
                    nextRequest = 2000;
                }
                //5 seconds
                if (chat.data.noActivity > 10) {
                    nextRequest = 5000;
                }

                // 15 seconds
                if (chat.data.noActivity > 20) {
                    nextRequest = 15000;
                }
                setTimeout(callback, nextRequest);
            });
        }
        else {
            setTimeout(callback, 1000);
        }

    },


    searchChats:function (callback) {
        $.tzGET('searchChats', {keyword:chat.data.keyword}, function (r) {
            for (var i = 0; i < r.chats.length; i++) {
                chat.addChatLine(r.chats[i]);
            }

            //if no chats exist yet
            if (!r.chats.length) {
                chat.data.jspAPI.getContentPane().html('<p class="noChats">No chats found</p>');
            }
        });
    },


    // Requesting a list with all the users.

    getUsers:function (callback) {

        $.tzGET('getUsers', function (r) {

            var users = [];

            for (var i = 0; i < r.users.length; i++) {
                if (r.users[i]) {
                    users.push(chat.render('user', r.users[i]));
                }
            }
            //empty no one is online variable
            var message = '';

            if (r.total < 1) {
                message = 'No one is online';
            }
            else {
                message = r.total + ' ' + (r.total == 1 ? 'person' : 'people') + ' online';
            }

            users.push('<p class="count">' + message + '</p>');

            $('#chatUsers').html(users.join(''));

            setTimeout(callback, 15000);
        });
    },

    // This method displays an error message on the top of the page:

    displayError:function (msg) {

        var elem = $('<div>', {
            id:'chatErrorMessage',
            html:msg
        });

        elem.click(function () {
            $(this).fadeOut(function () {
                $(this).remove();
            });
        });

        setTimeout(function () {
            elem.click();
        }, 5000);

        elem.hide().appendTo('body').slideDown();

    }
};

// Custom GET & POST wrappers:
//POST also uses some GET functionality with action, rest is transferred invisibly
$.tzPOST = function (action, data, callback) {
    $.post('php/ajax.php?action=' + action, data, callback, 'json');
};

$.tzGET = function (action, data, callback) {
    $.get('php/ajax.php?action=' + action, data, callback, 'json');
};

// A custom jQuery method for placeholder text:
// Can be applied to any textbox
$.fn.defaultText = function (value) {

    var element = this.eq(0);
    element.data('defaultText', value);

    element.focus(function () {
        if (element.val() == value) {
            element.val('').removeClass('defaultText');
        }
    }).blur(function () {
            if (element.val() == '' || element.val() == value) {
                element.addClass('defaultText').val(value);
            }
        });

    return element.blur();
};