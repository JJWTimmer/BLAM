$(document).ready(function () {

    // Run the init method on document ready:

    ticketing.init();

});

var Timeout = new Array();

var ticketing = {

    // data holds variables for use in the class:

    data:{
        HandlelistVisible:1,
        SearchTicketsVisible:0,
        UpdatesVisible:0,
        selectTicketLoaded:false,
    },

    // Init binds event listeners and sets up timers:

    init:function () {

        // Using the defaultText jQuery plugin, included at the bottom:
        $('#name').defaultText('Username');
        $('#password').defaultText('Password');

        // We use the working variable to prevent
        // multiple form submissions:

        var working = false;

        $('#Chattext').elastic();

        // Converting the #MeldingenList, #HandlesList divs into a jScrollPane,
        // and saving the plugin's API in logging.data:

        ticketing.data.jspAPIMeldingen = $('#MeldingenList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        ticketing.data.jspAPIChats = $('#WL-ChatList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        ticketing.data.jspAPIHandles = $('#HandlesList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        ticketing.data.jspAPINewTickets = $('#NewTicketsList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        ticketing.data.jspAPIOpenTickets = $('#OpenTicketsList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        ticketing.data.jspAPIClosedTickets = $('#ClosedTicketsList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        ticketing.data.jspAPISearchTickets = $('#SearchTicketsList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        ticketing.data.jspAPITicketDetails = $('#TicketDetailsList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        ticketing.data.jspAPIUpdates = $('#UpdatesList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        user = new User("TopBar");
        message = new Message(ticketing.data.jspAPIMeldingen, 1);
        chat = new Chat(ticketing.data.jspAPIChats, 1);
        handle = new Handle(ticketing.data.jspAPIHandles);
        ticketNew = new Ticket(ticketing.data.jspAPINewTickets, [
            {1:'Nieuw'}
        ], 1);
        ticketOpen = new Ticket(ticketing.data.jspAPIOpenTickets, [
            {1:'Open'}
        ], 1);
        ticketClosed = new Ticket(ticketing.data.jspAPIClosedTickets, [
            {1:'Gesloten'}
        ], 1);
        ticketSearch = new Ticket(ticketing.data.jspAPISearchTickets, [
            {1:'Open', 2:'Nieuw', 3:'Gesloten'}
        ], 0);
        ticketSelect = new Ticket("", [
            {1:'Open', 2:'Nieuw', 3:'Gesloten'}
        ], 0);
        //display = new Display ($('#TicketDetailsList'));
        display = new Display(ticketing.data.jspAPITicketDetails);
        //updatefeedback = new UpdateAndFeedback(ticketing.data.jspAPIUpdates,"",0);
        updatefeedback = new UpdateAndFeedback(ticketing.data.jspAPITicketDetails, "", 1);


        //function to implement getting previous messages from db
        $('#MeldingenList .retrieve_previous').live('click', function () {
            if (!working) {
                working = true;
                message.getOldMessages();
            }
            working = false;
        });

        //function to implement getting previous messages from db
        $('#WL-ChatList .retrieve_previous').live('click', function () {
            if (!working) {
                working = true;
                chat.getOldChats();
            }
            working = false;
        });

        //function to implement getting previous tickets from db
        $('#NewTicketsList .retrieve_previous_ticket').live('click', function () {
            if (!working) {
                working = true;
                ticketNew.getOldTickets();
            }
            working = false;
        });

        //function to implement getting previous tickets from db
        $('#OpenTicketsList .retrieve_previous_ticket').live('click', function () {
            if (!working) {
                working = true;
                ticketOpen.getOldTickets();
            }
            working = false;
        });

        //function to implement getting previous tickets from db
        $('#ClosedTicketsList .retrieve_previous_ticket').live('click', function () {
            if (!working) {
                working = true;
                ticketClosed.getOldTickets();
            }
            working = false;
        });

        $('#handlelist_toggle_button').live('click', function () {
            if (!working) {
                working = true;
                if (ticketing.data.HandlelistVisible == 1) {
                    //$('#Handles').fadeOut();
                    $('#Handles').css('display', 'none');
                    $('#ChatContainer').css('left', '0%');
                    $('#ChatContainer').css('width', '100%');
                    $('#handlelist_toggle_button').attr('value', 'Roepnamenlijst aan');
                    ticketing.data.HandlelistVisible = 0;
                }
                else {
                    //$('#Handles').fadeIn();
                    $('#Handles').css('display', 'block');
                    $('#ChatContainer').css('left', '33%');
                    $('#ChatContainer').css('width', '65%');
                    $('#handlelist_toggle_button').attr('value', 'Roepnamenlijst uit');
                    ticketing.data.HandlelistVisible = 1;
                }
                ticketing.reInitJSP();
            }
            working = false;
        });

        $('#searchtickets_toggle_button').live('click', function () {
            if (!working) {
                working = true;
                if (ticketing.data.SearchTicketsVisible == 1) {
                    $('#SearchTickets').css('display', 'none');
                    $('#NewTickets').css('display', 'block');
                    $('#OpenTickets').css('display', 'block');
                    $('#ClosedTickets').css('display', 'block');
                    $('#searchtickets_toggle_button').attr('value', 'Tickets zoeken aan');
                    ticketing.data.SearchTicketsVisible = 0;
                }
                else {
                    $('#SearchTickets').css('display', 'block');
                    $('#NewTickets').css('display', 'none');
                    $('#OpenTickets').css('display', 'none');
                    $('#ClosedTickets').css('display', 'none');
                    $('#searchtickets_toggle_button').attr('value', 'Tickets zoeken uit');
                    ticketing.data.SearchTicketsVisible = 1;
                }
                ticketing.reInitJSP();
            }
            working = false;
        });

        $('#updates_toggle_button').live('click', function () {
            if (!working) {
                working = true;
                if (ticketing.data.UpdatesVisible == 1) {
                    $('#Updates').css('display', 'none');
                    $('#Meldingen').css('display', 'block');
                    $('#updates_toggle_button').attr('value', 'Updatelijst aan');
                    ticketing.data.UpdatesVisible = 0;
                    updatefeedback.setPane(ticketing.data.jspAPITicketDetails);

                    if (ticketing.data.selectedticket) {
                        if (ticketing.data.selectedparentticket) {
                            ticketing.data.jspAPIUpdates.getContentPane().empty();
                        }
                        else {
                            display.showTicketDetail(ticketing.data.selectedticket, 0);
                        }
                    }

                    ticketing.reInitJSP();
                }
                else {
                    $('#Updates').css('display', 'block');
                    $('#Meldingen').css('display', 'none');
                    $('#updates_toggle_button').attr('value', 'Meldingen aan');
                    ticketing.data.UpdatesVisible = 1;
                    updatefeedback.setPane(ticketing.data.jspAPIUpdates);

                    if (ticketing.data.selectedticket) {
                        if (ticketing.data.selectedparentticket) {
                            ticketing.data.jspAPIUpdates.getContentPane().empty();
                        }
                        else {
                            display.showTicketDetail(ticketing.data.selectedticket, 0);
                        }
                    }

                    ticketing.reInitJSP();
                }
                //ticketing.reInitJSP();
            }
            working = false;
        });

        //function to implement clicking on dynamic element groups
        $('#Handles .list_item_first').live('click', function () {
            if (!working) {
                working = true;
                var groupid = $(this).attr("id");
                handle.toggleVisibleGroups(groupid);
            }
            working = false;
            ticketing.data.jspAPIHandles.reinitialise();
        });


        $('#search_handles').keyup(function (e) {
            handle.searchHandles($('#search_handles').val());
        });

        // Submitting a new chat entry:
        $('#submitForm').submit(function () {
            var text = $('#Chattext').val();
            if (text.length == 0) {
                return false;
            }
            if (!working) {
                working = true;
                chat.submitChat(text);
                $('#Chattext').css('height', 'auto');
            }

            working = false;
            return false;
        });

        // Search for a certain keyword:
        $('#Searchsubmit').bind('click', function () {
            ticketSearch.searchTicket();
        });

        //function to implement clicking on ticket to get details
        $('div.parent_ticket').live('click', function () {
            if (!working) {
                working = true;
                if ($(this).attr("id") != ticketing.data.selectedticket) {
                    ticketing.data.selectedticket = $(this).attr("id");
                    ticketing.data.selectedparentticket = 0;
                }
                display.showTicketDetail(ticketing.data.selectedticket, 0);
            }
            working = false;
        });

        //function to implement clicking on child ticket to get details
        $('div.child_ticket').live('click', function () {
            if (!working) {
                working = true;
                if ($(this).attr("id") != ticketing.data.selectedticket) {
                    ticketing.data.selectedticket = $(this).attr("id");
                    ticketing.data.selectedparentticket = $(this).attr("title");
                }
                display.showTicketDetail(ticketing.data.selectedticket, $(this).attr("title"));
                //to clear the UpdatesList when clicking on a subticket
                ticketing.data.jspAPIUpdates.getContentPane().empty();
                ticketing.data.jspAPIUpdates.reinitialise();
            }
            working = false;
        });

        //function to implement clicking on claim
        $('div.list_item_parent_ticket_claim').live('click', function () {
            if (!working) {
                working = true;
                $.tzPOST('setTicketOwner', {id:$(this).attr("id")}, function (r) {
                    ticketNew.refreshTickets();
                    ticketOpen.refreshTickets();
                });
                display.showTicketDetail($(this).attr("id"), 0);
            }
            working = false;
        });

        //function to implement filling the ticket selector (for linking to a parent ticket)
        $('#become_Ticket').live('click', function () {
            if (ticketing.data.selectTicketLoaded == false && ticketing.data.selectedparentticket == 0) {
                ticketSelect.fillTicket($('#become_Ticket'), ticketing.data.selectedticket, ticketing.data.selectedparentticket);
                ticketing.data.selectTicketLoaded = true;
            }
        });

        // add listener for this button and change ticket details
        $('#saveticketbutton').live('click', function () {
            $.tzPOST('changeTicketDetails', {id:ticketing.data.selectedticket, title:$('#ticket_title').val(), text:$('#ticket_text').val(), location:$('#ticket_location').val(), solution:$('#ticket_oplossing').val(), handle_id:$('#ticket_Handle').val(), reference:$('#ticket_reference').val()}, function (r) {
                if (r == null) {
                }
                else {
                    general.displayError(r.error);
                }
            });

            if ($('#become_Ticket').val() > 0) {
                $.tzPOST('becomeChildTicket', {id:ticketing.data.selectedticket, parent_id:$('#become_Ticket').val()}, function (r) {
                    if (r == null) {
                        ticketing.data.selectedticket = 0;
                        ticketing.data.selectedparentticket = 0;
                        display.clearDisplay();
                    }
                    else {
                        general.displayError(r.error);
                    }
                });
            }

            if (!($('#ticket_status').val() == "Nieuw") && !($('#ticket_status').val() == "Subticket")) {
                $.tzPOST('changeTicketOwner', {id:ticketing.data.selectedticket, user_id:$('#owner').val()}, function (r) {
                    if (r == null) { //display.clearDisplay();
                    }
                    else {
                        general.displayError(r.error);
                    }
                });
            }
            ticketNew.refreshTickets();
            ticketOpen.refreshTickets();
            ticketClosed.refreshTickets();
            general.displaySaved("Saved Ticket: " + $('#ticket_title').val());
        });

        // add listener for this button and change ticket details
        $('#closeticketbutton').live('click', function () {
            $.tzPOST('changeTicketDetails', {id:ticketing.data.selectedticket, title:$('#ticket_title').val(), text:$('#ticket_text').val(), location:$('#ticket_location').val(), solution:$('#ticket_oplossing').val(), handle_id:$('#ticket_Handle').val(), reference:$('#ticket_reference').val()}, function (r) {
                if (r == null) {
                }
                else {
                    general.displayError(r.error);
                }
            });

            if (!($('#ticket_status').val() == "Nieuw") && !($('#ticket_status').val() == "Subticket")) {
                $.tzPOST('changeTicketOwner', {id:ticketing.data.selectedticket, user_id:$('#owner').val()}, function (r) {
                    if (r == null) {
                    }
                    else {
                        general.displayError(r.error);
                    }
                });
            }


            $.tzPOST('closeTicket', {id:ticketing.data.selectedticket}, function (r) {
                if (r == null) {
                }
                else {
                    general.displayError(r.error);
                }
            });
            ticketOpen.refreshTickets();
            ticketClosed.refreshTickets();
            general.displaySaved("Saved Ticket: " + $('#ticket_title').val());
            display.clearDisplay();
        });

        // add listener for this button and change to childticket of certain parentticket
        $('#childticketbutton').live('click', function () {

            alert("decrapitated");

            //ticketNew.refreshTickets();
            //ticketOpen.refreshTickets();
            //ticketClosed.refreshTickets();
            // display.clearDisplay();
        });

        // add listener for this button and change to parentticket
        $('#becomeparentticketButton').live('click', function () {
            $.tzPOST('becomeParentTicket', {id:ticketing.data.selectedticket}, function (r) {
                if (r == null) {
                }
                else {
                    general.displayError(r.error);
                }
            });
            ticketing.data.selectedticket = 0;
            ticketing.data.selectedparentticket = 0;

            ticketNew.refreshTickets();
            ticketOpen.refreshTickets();
            ticketClosed.refreshTickets();
            display.clearDisplay();
        });

        // add listener for this button and add an update
        $('#saveupdatebutton').live('click', function () {
            if (!working) {
                working = true;
                updatefeedback.saveUpdate($('#ticket_update'));
            }
            working = false;
        });


        $('#savefeedbackbutton').live('click', function () {
            if (!working) {
                working = true;
                updatefeedback.saveFeedback($('#ticket_feedback'));
            }
            working = false;
        });

        $('.ticketdetailmessagenotification').live('click', function () {
            if (!working) {
                working = true;
                $.tzPOST('confirmNotification', {ticket_id:$(this).attr("id"), type:'message'}, function (r) {
                });
                ticketNew.refreshTickets();
                ticketOpen.refreshTickets();
                ticketClosed.refreshTickets();
                display.showTicketDetail($(this).attr("id"), 0);
            }
            working = false;
        });

        $('.ticketdetailadditionnotification').live('click', function () {
            if (!working) {
                working = true;
                $.tzPOST('confirmNotification', {update_id:$(this).attr("id"), ticket_id:$(this).attr("ticket_id"), type:'addition'}, function (r) {
                });
                ticketNew.refreshTickets();
                ticketOpen.refreshTickets();
                ticketClosed.refreshTickets();
                display.showTicketDetail($(this).attr("ticket_id"), 0);
            }
            working = false;
        });

        $('.ticketdetailanswernotification').live('click', function () {
            if (!working) {
                working = true;
                $.tzPOST('confirmNotification', {update_id:$(this).attr("id"), ticket_id:$(this).attr("ticket_id"), type:'answer'}, function (r) {
                });
                ticketNew.refreshTickets();
                ticketOpen.refreshTickets();
                ticketClosed.refreshTickets();
                display.showTicketDetail($(this).attr("ticket_id"), 0);
            }
            working = false;
        });

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
                    ticketing.login(r.username, r.avatar, r.role);
                }
            });

            return false;
        });

        // Checking whether the user is already logged (browser refresh)
        $.tzPOST('checkLogged', function (r) {
            if (!r.error) {
                ticketing.login(r.username, r.avatar, r.role);
            }
        });

        // Logging the user out:
        $('a.logoutButton').live('click', function () {
            ticketing.killTimeouts();
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

        //catching window resizes
        var resizeTimer = null;
        $(window).bind('resize', function () {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(ticketing.reInitJSP, 100);
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
        if ((avatar == "") || (avatar == "NULL") || (avatar == null)) {
            new_avatar = "unknown30x30.png";
        }
        user.setUser(username, new_avatar, role);
        $('#TopContainer').html(general.render('ticketing-loginTopBar', ticketing.data));
        $('#Login').fadeOut(function () {
            $('#MainContainer').fadeIn();
            $('#TopContainer').fadeIn();

            message.getMessages();
            chat.getChats();
            user.getUsers();
            handle.getHandles();
            ticketNew.getTickets();
            ticketOpen.getTickets();
            ticketClosed.getTickets();
            ticketing.data.jspAPITicketDetails.reinitialise();
            ticketing.data.jspAPIUpdates.reinitialise();
        });
    },

    TicketDetailTickets:function (ticketstatus, ticket_id, parent_id) {

    },

    killTimeouts:function () {
        message.kill();
        chat.kill();
        user.kill();
        handle.kill();
        ticketNew.kill();
        ticketOpen.kill();
        ticketClosed.kill();

    },

    reInitJSP:function () {
        ticketing.data.jspAPIMeldingen.reinitialise();
        ticketing.data.jspAPIChats.reinitialise();
        ticketing.data.jspAPIHandles.reinitialise();
        ticketing.data.jspAPINewTickets.reinitialise();
        ticketing.data.jspAPIOpenTickets.reinitialise();
        ticketing.data.jspAPIClosedTickets.reinitialise();
        ticketing.data.jspAPISearchTickets.reinitialise();
        ticketing.data.jspAPITicketDetails.reinitialise();
        ticketing.data.jspAPIUpdates.reinitialise();
    }

};
