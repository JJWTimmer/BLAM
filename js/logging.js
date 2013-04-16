$(document).ready(function () {

    // Run the init method on document ready:
    logging.init();

});

var logging = {

    // data holds variables for use in the class:

    data:{
        groupsLoaded:false,
        MessageEditMode:0,
        TicketUpdateMode:0,
        FeedbackUpdateMode:0,
				OpenFeedbackVisible:1,
				OpenAutomatedVisible:1,
				ChatVisible:0,				
    },

    // Init binds event listeners and sets up timers:

    init:function () {

				$('#Chattext').elastic();

        // add listener for message submitbutton
        $('#submitbutton').bind('click', function () {
            var text = $('#messagetext').val();
            if (text.length == 0) {
                return false;
            }
            if (working) return false;
            working = true;
            message.submitMessage(text, false);
            working = false;
            return false;
        });

        //add listener for message submitbutton, also generates ticket
        $('#submit_ticketbutton').bind('click', function () {
            var text = $('#messagetext').val();
            if (text.length == 0) {
                return false;
            }
            if (working) return false;
            working = true;
            message.submitMessage(text, true);
            ticket.refreshTickets();
            working = false;
            return false;
        });

        // add listener for search button
        $('#searchbutton').bind('click', function () {
            $('#searchForm').submit();
        });

        // add listener for restart getMessages button
        $('#messageButton').bind('click', function () {
            message.refreshMessages();

            $('#messageButton').hide();
            return false;
        });

        $('#autotextbutton').bind('click', function () {
            $('#messagetext').insertAtCaret($('#autotext').val());
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

				logging.data.jspAPIChats = $('#RVD-ChatList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        logging.data.jspAPIHandles = $('#HandlesList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        logging.data.jspAPITickets = $('#TicketsList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        logging.data.jspAPIOpenFeedback = $('#OpenFeedbackList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        logging.data.jspAPIClosedFeedback = $('#ClosedFeedbackList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

				logging.data.jspAPIOpenSMS = $('#OpenAutomatedList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        logging.data.jspAPIClosedSMS = $('#ClosedAutomatedList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');


        logging.data.jspAPIDisplay = $('#DisplayList').jScrollPane({
            verticalDragMinHeight:12,
            verticalDragMaxHeight:12
        }).data('jsp');

        //setting up message 'class'
        message = new Message(logging.data.jspAPIMeldingen, 1);
        chat = new Chat(logging.data.jspAPIChats,'RVD',1);
        user = new User("TopBar");
        //user = new User(logging.data.jspAPIUsers);
        handle = new Handle(logging.data.jspAPIHandles);
        ticket = new Ticket(logging.data.jspAPITickets, [
            {1:'Open', 2:'Nieuw'}
        ], 1);
        feedbackOpen = new UpdateAndFeedback(logging.data.jspAPIOpenFeedback, 'false', 1);
        feedbackClosed = new UpdateAndFeedback(logging.data.jspAPIClosedFeedback, 'true', 1);
        smsOpen = new SMS(logging.data.jspAPIOpenSMS, 'false', 1);
        smsClosed = new SMS(logging.data.jspAPIClosedSMS, 'true', 1);
        display = new Display(logging.data.jspAPIDisplay);
        autotext = new Autotext($('#autotext'));


        $('#automated_toggle_button').live('click', function () {
            if (!working) {
                working = true;
                if (logging.data.OpenAutomatedVisible == 1) {
                    $('#OpenAutomated').css('display', 'none');
                    $('#ClosedAutomated').css('display', 'block');
		    						$('#automated_toggle_button').attr('value', ' Open automatische meldingen tonen ');
                    logging.data.OpenAutomatedVisible = 0;
                }
                else {
                    $('#OpenAutomated').css('display', 'block');
		    						$('#ClosedAutomated').css('display', 'none');
                    $('#automated_toggle_button').attr('value', ' Gesloten automatische meldingen tonen ');
                    logging.data.OpenAutomatedVisible = 1;
                }
                logging.reInitJSP();
            }
            working = false;
        });


        $('#feedback_toggle_button').live('click', function () {
            if (!working) {
                working = true;
                if (logging.data.OpenFeedbackVisible == 1) {
                    $('#OpenFeedback').css('display', 'none');
                    $('#ClosedFeedback').css('display', 'block');
		    						$('#feedback_toggle_button').attr('value', ' Open terugmeldingen tonen ');
                    logging.data.OpenFeedbackVisible = 0;
                }
                else {
                    $('#OpenFeedback').css('display', 'block');
		    						$('#ClosedFeedback').css('display', 'none');
                    $('#feedback_toggle_button').attr('value', ' Gesloten terugmeldingen tonen ');
                    logging.data.OpenFeedbackVisible = 1;
                }
                logging.reInitJSP();
            }
            working = false;
        });

				$('#rvdchat_toggle_button').live('click', function () {
            if (!working) {
                working = true;
                if (logging.data.ChatVisible == 1) {
                    $('#RVD-Chat').css('display', 'none');
                    $('#Display').css('display', 'block');
		    						$('#rvdchat_toggle_button').attr('value', ' RVD-chat tonen ');
                    logging.data.ChatVisible = 0;
                }
                else {
                    $('#RVD-Chat').css('display', 'block');
		    						$('#Display').css('display', 'none');
                    $('#rvdchat_toggle_button').attr('value', ' Display tonen ');
                    logging.data.ChatVisible = 1;
                }
                logging.reInitJSP();
            }
            working = false;
        });



        //function to implement clicking on message
        $('#MeldingenList .message').live('click', function () {
            if (logging.data.TicketUpdateMode == 0 && logging.data.FeedbackUpdateMode == 0) {
                logging.data.MessageEditMode = 1;
                if ($(this).hasClass("message_ticket")) {
                    $('#update_ticketbutton').hide();
                }
                else {
                    $('#update_ticketbutton').show();
                }

                $('#messagetext').val($(this).find("span").text());
                $('#submitbutton').hide();
                $('#submit_ticketbutton').hide();
                $('#updatebutton').show();
                $('#cancelbutton').show();
                logging.data.selectedmessage = $(this).attr("id");
            }
        });

        $('#MeldingenList .retrieve_previous').live('click', function () {
            if (!working) {
                working = true;
                message.getOldMessages();
                working = false;
            }
        });

				//function to implement getting previous messages from db
        $('#RVD-ChatList .retrieve_previous').live('click', function () {
            if (!working) {
                working = true;
                chat.getOldChats();
            }
            working = false;
        });

        //function to implement getting previous tickets from db
        $('#TicketsList .retrieve_previous_ticket').live('click', function () {
            if (!working) {
                working = true;
                ticket.getOldTickets();
            }
            working = false;
        });

        //function to implement getting previous feedbacks from db
        $('#OpenFeedbackList .retrieve_previous_feedback').live('click', function () {
            if (!working) {
                working = true;
                feedbackOpen.getOldFeedbacks();
            }
            working = false;
        });

        //function to implement getting previous feedbacks from db
        $('#ClosedFeedbackList .retrieve_previous_feedback').live('click', function () {
            if (!working) {
                working = true;
                feedbackClosed.getOldFeedbacks();
            }
            working = false;
        });

				//function to implement getting previous feedbacks from db
        $('#OpenAutomatedList .retrieve_previous_sms').live('click', function () {
            if (!working) {
                working = true;
                smsOpen.getOldSMS();
            }
            working = false;
        });

        //function to implement getting previous feedbacks from db
        $('#ClosedAutomatedList .retrieve_previous_sms').live('click', function () {
            if (!working) {
                working = true;
                smsClosed.getOldSMS();
            }
            working = false;
        });


        $('#cancelbutton').bind('click', function () {
            if (logging.data.MessageEditMode == 1) {
                $('#messagetext').val('');
            }
            $('#submitbutton').show();
            $('#submit_ticketbutton').show();
            $('#updatebutton').hide();
            $('#update_ticketbutton').hide();
            $('#add_ticket_additionbutton').hide();
            $('#answer_feedbackbutton').hide();
            $('#cancelbutton').hide();

            logging.data.selectedmessage = 0;
            logging.data.MessageEditMode = 0;
            logging.data.TicketUpdateMode = 0;
            logging.data.FeedbackUpdateMode = 0;
        });

        $('#updatebutton').bind('click', function () {
            $.tzPOST('updateMessage', {id:logging.data.selectedmessage, text:$('#messagetext').val()}, function (r) {
                if (r.error) {
                    general.displayError(r.error);
                }
                else {
                    $('#messagetext').val('');
                    $('#submitbutton').show();
                    $('#submit_ticketbutton').show();
                    $('#updatebutton').hide();
                    $('#update_ticketbutton').hide();
                    $('#cancelbutton').hide();
                    logging.data.selectedmessage = 0;
                    logging.data.MessageEditMode = 0;
                    message.refreshMessages();
                    ticket.refreshTickets();
                }
            });
        });

        $('#update_ticketbutton').bind('click', function () {
            $.tzPOST('updateMessage', {id:logging.data.selectedmessage, text:$('#messagetext').val(), ticket:'True'}, function (r) {
                if (r.error) {
                    general.displayError(r.error);
                }
                else {
                    $('#messagetext').val('');
                    $('#submitbutton').show();
                    $('#submit_ticketbutton').show();
                    $('#updatebutton').hide();
                    $('#update_ticketbutton').hide();
                    $('#cancelbutton').hide();
                    logging.data.selectedmessage = 0;
                    logging.data.MessageEditMode = 0;
                    message.refreshMessages();
                    ticket.refreshTickets();
                }
            });
        });

        //function to implement clicking on addtoticket
        $('#addtoticket').live('click', function () {
            if (logging.data.MessageEditMode == 0 && logging.data.FeedbackUpdateMode == 0) {
                logging.data.TicketUpdateMode = 1;
                $('#submitbutton').hide();
                $('#submit_ticketbutton').hide();
                $('#add_ticket_additionbutton').show();
                $('#cancelbutton').show();
            }
        });

        $('#add_ticket_additionbutton').bind('click', function () {
            if ($('#messagetext').val().length > 0) {
                $.tzPOST('createAddition', {ticket_id:logging.data.selectedticket, message:$('#messagetext').val()}, function (r) {
                    if (r.error) {
                        general.displayError(r.error);
                    }
                    else {
                        message.submitMessage($('#messagetext').val(), false, logging.data.selectedticket);
                        $('#messagetext').val('');
                        $('#submitbutton').show();
                        $('#submit_ticketbutton').show();
                        $('#add_ticket_additionbutton').hide();
                        $('#cancelbutton').hide();
                        logging.data.selectedticket = 0;
                        logging.data.TicketUpdateMode = 0;
                        ticket.refreshTickets();
                    }
                });
            }
            else {
                alert("geen tekst ingevuld");
            }
        });

        //function to implement clicking on close feedback
        $('#answerfeedback').live('click', function () {
            if (logging.data.MessageEditMode == 0 && logging.data.TicketUpdateMode == 0) {
                logging.data.FeedbackUpdateMode = 1;
                $('#submitbutton').hide();
                $('#submit_ticketbutton').hide();
                $('#answer_feedbackbutton').show();
                $('#cancelbutton').show();
            }
        });

        $('#answer_feedbackbutton').bind('click', function () {
            if ($('#messagetext').val().length > 0) {
                $.tzPOST('createAnswer', {ticket_id:logging.data.selectedticket, message:$('#messagetext').val()}, function (r) {
                    if (r.error) {
                        general.displayError(r.error);
                    }
                    else {
                        message.submitMessage($('#messagetext').val(), false, logging.data.selectedticket);
                        $('#messagetext').val('');
                        $('#submitbutton').show();
                        $('#submit_ticketbutton').show();
                        $('#answer_feedbackbutton').hide();
                        $('#cancelbutton').hide();
                        //feedbackOpen.closeFeedback($(this).closest("div").attr("id"));
                        feedbackOpen.closeFeedback(logging.data.selectedfeedback);
                        feedbackOpen.refreshFeedback();
                        feedbackClosed.refreshFeedback();
                        logging.data.selectedticket = 0;
                        logging.data.selectedfeedback = 0;
                        logging.data.FeedbackUpdateMode = 0;
                    }
                });
            }
            else {
                alert("geen tekst ingevuld");
            }
        });

				$('#answersms').live('click', function () {
                $.tzPOST('handleSMS', {id:logging.data.selectedsms}, function (r) {
                    if (r.error) {
                        general.displayError(r.error);
                    }
                    else {
                        smsOpen.refreshSMS();
                        smsClosed.refreshSMS();
                        display.clearDisplay();
                        logging.data.selectedticket = 0;
                        logging.data.selectedfeedback = 0;
                        logging.data.selectedsms = 0;
                    }
                });
        });

        //function to implement clicking on dynamic element groups
        $('#HandlesList div.list_item_first').live('click', function () {
            if (!working) {
                working = true;
                var groupid = $(this).attr("id");
                handle.toggleVisibleGroups(groupid);
                working = false;
            }
            logging.data.jspAPIHandles.reinitialise();
        });

        //function to implement clicking on dynamic element handle
        $('#HandlesList div.list_item_second').live('click', function () {
            //$('#messagetext').val($('#messagetext').val()+$(this).children('.list_item_handle_name').text() + '-' + $(this).children('.list_item_handle_description').text());
            $('#messagetext').insertAtCaret($(this).children('.list_item_handle_name').text() + '-' + $(this).children('.list_item_handle_description').text() + ' ');
        });

        //function to search through handles
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

        //function to implement clicking on dynamic element ticket
        $('#TicketsList .list_item_first').live('click', function () {
            display.showTicket($(this).attr("id"));
            logging.data.selectedticket = $(this).attr("id");
            logging.data.selectedfeedback = 0;
            logging.data.selectedsms = 0;
        });

        //function to implement clicking on dynamic element openfeedback
        $('#OpenFeedbackList .list_item_first').live('click', function () {
            display.showOpenFeedback($(this).attr("id"));
            logging.data.selectedticket = $(this).attr("ticket_id");
            logging.data.selectedfeedback = $(this).attr("id");
            logging.data.selectedsms = 0;
        });

        //function to implement clicking on dynamic element closedfeedback
        $('#ClosedFeedbackList .list_item_first').live('click', function () {
            display.showClosedFeedback($(this).attr("id"));
            logging.data.selectedticket = 0;
            logging.data.selectedfeedback = 0;
            logging.data.selectedsms = 0;
        });

 				//function to implement clicking on dynamic element opensms
        $('#OpenAutomatedList .list_item_first').live('click', function () {
            display.showOpenSMS($(this).attr("id"));
            logging.data.selectedticket = 0;
            logging.data.selectedfeedback = 0;
            logging.data.selectedsms = $(this).attr("id");
        });

        //function to implement clicking on dynamic element closedsms
        $('#ClosedAutomatedList .list_item_first').live('click', function () {
            display.showClosedSMS($(this).attr("id"));
            logging.data.selectedticket = 0;
            logging.data.selectedfeedback = 0;
            logging.data.selectedsms = 0;
        });

        // Searching for messages:
        $('#searchForm').submit(function () {
            var keyword = $('#keyword').val();
            if (keyword) {
                if (working) return false;
                working = true;
                message.kill();
                $('#messageButton').show();
                message.clearMessages();
                message.searchMessages(keyword);
                $('#keyword').val('');
                working = false;
            }
            return false;
        });


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

    // The login function is called when the user succesfully logs in
    login:function (username, avatar, role) {
        //replace empty avatar field
        var new_avatar = avatar;
        if ((avatar == "") || (avatar == "NULL")) {
            new_avatar = "unknown30x30.png";
        }

        user.setUser(username, new_avatar, role);

        $('#TopContainer').html(general.render('logging-loginTopBar', logging.data));
        $('#Login').fadeOut(function () {
            $('#MainContainer').fadeIn();
            $('#TopContainer').fadeIn();

            message.getMessages();
            chat.getChats();
            user.getUsers();
            handle.getHandles();
            ticket.getTickets();
            feedbackOpen.getFeedback();
            feedbackClosed.getFeedback();
            smsOpen.getSMS();
            smsClosed.getSMS();
            autotext.fillAutotext();
            //get rid of ugly startdisplay
            logging.data.jspAPIDisplay.reinitialise();
        });
    },

    killTimeouts:function () {
        message.kill();
        chat.kill();
        user.kill();
        handle.kill();
        ticket.kill();
        feedbackOpen.kill();
        feedbackClosed.kill();
        smsOpen.kill();
        smsClosed.kill();
    },

    reInitJSP:function () {
        logging.data.jspAPIMeldingen.reinitialise();
        logging.data.jspAPIChats.reinitialise();
        //logging.data.jspAPIUsers.reinitialise();
        logging.data.jspAPIHandles.reinitialise();
        logging.data.jspAPITickets.reinitialise();
        logging.data.jspAPIOpenFeedback.reinitialise();
        logging.data.jspAPIClosedFeedback.reinitialise();
        logging.data.jspAPIOpenSMS.reinitialise();
        logging.data.jspAPIClosedSMS.reinitialise();
        logging.data.jspAPIDisplay.reinitialise();
    }
};
//end of logging var
