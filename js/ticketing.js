$(document).ready(function(){

  // Run the init method on document ready:

  ticketing.init();

});

var Timeout= new Array();

var ticketing = {

  // data holds variables for use in the class:

  data : {
    lastIDMessages    : 1,
    lastIDChats    : 1,
    noActivity  : 0,
  },

  // Init binds event listeners and sets up timers:

  init : function(){

    // Using the defaultText jQuery plugin, included at the bottom:
    $('#name').defaultText('Username');
    $('#password').defaultText('Password');

    // We use the working variable to prevent
    // multiple form submissions:

    var working = false;

    // Converting the #MeldingenList, #UsersList, #HandlesList divs into a jScrollPane,
    // and saving the plugin's API in logging.data:

    ticketing.data.jspAPIMeldingen = $('#MeldingenList').jScrollPane({
      verticalDragMinHeight: 12,
      verticalDragMaxHeight: 12
    }).data('jsp');

    ticketing.data.jspAPIChats = $('#WL-ChatList').jScrollPane({
      verticalDragMinHeight: 12,
      verticalDragMaxHeight: 12
    }).data('jsp');

    ticketing.data.jspAPIUsers = $('#UsersList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
    }).data('jsp');

    ticketing.data.jspAPIHandles = $('#HandlesList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
    }).data('jsp');

    ticketing.data.jspAPINewTickets = $('#NewTicketsList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
    }).data('jsp');

    ticketing.data.jspAPIOpenTickets = $('#OpenTicketsList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
    }).data('jsp');

    ticketing.data.jspAPIClosedTickets = $('#ClosedTicketsList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
      }).data('jsp');

        //function to implement clicking on ticket to get details
        $('div.list_item_parent_ticket_full').live('click', function(){
          if($(this).attr("id")!=ticketing.data.selectedticket)
            {
            ticketing.data.selectedticket=$(this).attr("id");
            ticketing.data.selectedparentticket=0;
            }
          ticketing.getTicketDetail(ticketing.data.selectedticket,0);
        });

        //function to implement clicking on claim
        $('div.list_item_parent_ticket_claim').live('click', function(){
          $.tzPOST('setTicketOwner',{id:$(this).attr("id")},function(r){
          ticketing.reInitTickets("New")
          ticketing.reInitTickets("Open")
          });
        });

        //function to implement clicking on dynamic element ticket
        $('div.list_item_child_ticket').live('click', function(){
          if($(this).attr("id")!=ticketing.data.selectedticket)
            {
            ticketing.data.selectedticket=$(this).attr("id");
            ticketing.data.selectedparentticket=$(this).attr("title");
            }
          ticketing.getTicketDetail(ticketing.data.selectedticket,$(this).attr("title"));
        });

        //function to implement clicking on Header
        $('#WL-ActieHeader').bind('click',function(){
          ticketing.changeTabview('WL-Actie');
        });

        //function to implement clicking on Header
        $('#FeedbackHeader').bind('click',function(){
          ticketing.changeTabview('Feedback');
        });

        //function to implement clicking on Header
        $('#TimelineHeader').bind('click',function(){
          ticketing.changeTabview('Timeline');
        });

        // Logging a person into rvdlog:

        $('#loginForm').submit(function(){
            if(working) return false;
            working = true;

            // Using our tzPOST wrapper function (defined in the bottom):
            //$(this).serialize encodes all the name form elements to be used by php
            $.tzPOST('login',$(this).serialize(),function(r){
                working = false;

                if(r.error){
                    general.displayError(r.error);
                }
                else
                {
                    ticketing.login(r.username,r.avatar,r.role);
                }
            });

            return false;
        });

        // Checking whether the user is already logged (browser refresh)

        $.tzPOST('checkLogged',function(r){
            if(!r.error)
            {
                ticketing.login(r.username,r.avatar,r.role);
            }
        });

        // Logging the user out:

        $('a.logoutButton').live('click',function(){
            ticketing.killTimeouts();
            $('#TopContainer > span').fadeOut(function(){

                $(this).remove();
            });

            $('#TopContainer').fadeOut();
            $('#MainContainer').fadeOut(function(){
                $('#Login').fadeIn();
            });
            $.tzPOST('logout');
            return false;
        });



        // Submitting a new chat entry:

        $('#submitForm').submit(function(){

            var text = $('#Chattext').val();

            if(text.length == 0){
                return false;
            }

            if(working) return false;
            working = true;

            // Assigning a temporary ID to the chat:
            var tempID = 't'+Math.round(Math.random()*1000000),

            params = {
                    id : tempID,
                    username  : ticketing.data.username,
                    avatar  : ticketing.data.avatar,
                    text    : text.replace(/</g,'&lt;').replace(/>/g,'&gt;')
                };

            // Using our addChatLine method to add the chat
            // to the screen immediately, without waiting for
            // the AJAX request to complete:
            ticketing.addChatLine($.extend({},params));

            // Using our tzPOST wrapper method to send the message
            // via a POST AJAX request:
            $.tzPOST('addChat',$(this).serialize(),function(r){
            if(!r.error){
                working = false;
                //empty input form textbox
                $('#Chattext').val('');

                //remove old temporary chat
                $('div.chat-'+tempID).remove();

                //insert newly received ID
                params['id'] = r.id;
                ticketing.addChatLine($.extend({},params));
                }
            else
                {
                general.displayError(r.error);
                }
            });
            return false;
        });

      // add listener for this button and change ticket details
      $('#saveticketbutton').live('click',function(){
            $.tzPOST('changeTicketDetails',{id:ticketing.data.selectedticket,title:$('#ticket_title').val(),text:$('#ticket_text').val(),location:$('#ticket_location').val(),handle_id:$('#ticket_Handle').val()},function(r){
              if(r==null){

              }
              else
              {
                general.displayError(r.error);
              }
            });

            if(!($('div .list_item_ticketdetail_status').text()=="status: Nieuw") && !($('div .list_item_ticketdetail_status').text()=="status: Subticket")){
              $.tzPOST('changeTicketOwner',{id:ticketing.data.selectedticket,user_id:$('#owner').val()},function(r){
                if(r==null){

                }
                else
                {
                  general.displayError(r.error);
                }
              });
            }
            ticketing.reInitTickets("All");
            $('#TicketDetailsList').empty();
            $('#WL-ActieList').fadeIn();
            $('#FeedbackList').fadeIn();
            $('#TimelineList').fadeIn();
            $('#WL-ActieForm').fadeOut();
            $('#FeedbackForm').fadeOut();
      });

      // add listener for this button and change ticket details
      $('#closeticketbutton').live('click',function(){
            $.tzPOST('closeTicket',{id:ticketing.data.selectedticket},function(r){
              if(r==null){

              }
              else
              {
                general.displayError(r.error);
              }
            });
            ticketing.reInitTickets("Open");
            ticketing.reInitTickets("Closed");

            $('#TicketDetailsList').empty();
            $('#WL-ActieList').fadeIn();
            $('#FeedbackList').fadeIn();
            $('#TimelineList').fadeIn();
            $('#WL-ActieForm').fadeOut();
            $('#FeedbackForm').fadeOut();
      });

      // add listener for this button and change to childticket of certain parentticket
      $('#childticketbutton').live('click',function(){
            $.tzPOST('becomeChildTicket',{id:ticketing.data.selectedticket,parent_id:$('#become_Ticket').val()},function(r){
              if(r==null){

              }
              else
              {
                general.displayError(r.error);
              }
            });
            $('#TicketDetailsList').empty();
            $('#WL-ActieList').fadeIn();
            $('#FeedbackList').fadeIn();
            $('#TimelineList').fadeIn();
            $('#WL-ActieForm').fadeOut();
            $('#FeedbackForm').fadeOut();
      });


      // add listener for this button and change to parentticket
      $('#becomeparentticketbutton').live('click',function(){
            $.tzPOST('becomeParentTicket',{id:ticketing.data.selectedticket},function(r){
              if(r==null){

              }
              else
              {
                general.displayError(r.error);
              }
            });
            ticketing.reInitTickets("All");
            $('#TicketDetailsList').empty();
            $('#WL-ActieList').fadeIn();
            $('#FeedbackList').fadeIn();
            $('#TimelineList').fadeIn();
            $('#WL-ActieForm').fadeOut();
            $('#FeedbackForm').fadeOut();
      });


        $('#WL-ActieForm').submit(function(){
            if(working) return false;
            working = true;

            //check to ensure a childticket doesnt get a childticket
            var ticketid=ticketing.data.selectedticket;
            if(ticketing.data.selectedparentticket!=0){
            ticketid=ticketing.data.selectedparentticket;
            }

            $.tzPOST('createSubTicket',{parent_id:ticketing.data.selectedticket,title:$('#subticket_Title').val(),text:$('#subticket_Text').val(),location:$('#subticket_Location').val(),handle_id:$('#subticket_Handle').val()},function(r){
                working = false;

                if(r.error){
                    general.displayError(r.error);
                }
                else
                {
                    $('#subticket_Title').val("");
                    $('#subticket_Text').val("");
                    $('#subticket_Location').val("");
                }
            });
            ticketing.reInitTickets("All");
            $('#TicketDetailsList').empty();
            $('#WL-ActieList').fadeIn();
            $('#FeedbackList').fadeIn();
            $('#TimelineList').fadeIn();
            $('#WL-ActieForm').fadeOut();
            $('#FeedbackForm').fadeOut();
            return false;
        });

        $('#FeedbackForm').submit(function(){
            if(working) return false;
            working = true;

            $.tzPOST('createFeedback',{ticket_id:ticketing.data.selectedticket,title:$('#feedback_Title').val(),text:$('#feedback_Text').val(),handle_id:$('#feedback_Handle').val()},function(r){
                working = false;

                if(r.error){
                    general.displayError(r.error);
                }
                else
                {
                    $('#feedback_Title').val("");
                    $('#feedback_Text').val("");
                }
            });
            $('#TicketDetailsList').empty();
            $('#WL-ActieList').fadeIn();
            $('#FeedbackList').fadeIn();
            $('#TimelineList').fadeIn();
            $('#WL-ActieForm').fadeOut();
            $('#FeedbackForm').fadeOut();
            return false;
        });

        //catching window resizes
        var resizeTimer = null;
        $(window).bind('resize', function() {
        if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(ticketing.reInitJSP,100);
        });

  },
  /*-------------------------------------*/
  /*             END OF INIT             */
  /*-------------------------------------*/

    // The login method hides displays the
    // user's login data and shows the submit form
    login : function(username,avatar,role){
        //replace empty avatar filed
        var new_avatar=avatar;
        if((avatar=="") || (avatar=="NULL")|| (avatar==null))
        {
        new_avatar="img/unknown30x30.png";
        }

        ticketing.data.username = username;
        ticketing.data.avatar = new_avatar;
        ticketing.data.role = role;

        $('#TopContainer').html(general.render('ticketing-loginTopBar',ticketing.data));
        $('#Login').fadeOut(function(){
          $('#MainContainer').fadeIn();
          $('#TopContainer').fadeIn();
          ticketing.getMessages();
          ticketing.getChats();
          ticketing.getUsers();
          ticketing.getHandles();
          ticketing.getNewTickets();
          ticketing.getOpenTickets();
          ticketing.getClosedTickets();
          ticketing.changeTabview('WL-Actie');
        });
    },

    // This method requests the latest messages
    // (since last_id,timestamp), and adds them to the page. currently 24 hours past messages

    getMessages : function(){
        $.tzPOST('getMessages',{last_id:ticketing.data.lastIDMessages,date_and_time:Math.round(new Date().getTime()/1000-23*3600)},function(r){
        //update messages from mysql db
            if(!r.error)
            {
            for(var i=0;i<r.length;i++){
                ticketing.addMessageLine(r[i]);
            }
            //if new messages, update to lastid
            //message.data.noActivity is reset, so next update in 1 second

            if(r.length){
                ticketing.data.noActivityMessages = 0;
                ticketing.data.lastIDMessages = r[i-1].id;
                }
            else{
                // If no messages were received, increment
                // the noActivity counter.

                ticketing.data.noActivityMessages++;
            }
            //if no chats exist yet
            if(!ticketing.data.lastIDMessages){
                ticketing.data.jspAPIMeldingen.getContentPane().html('<p class="noMessages">Nog geen meldingen</p>');
            }

            // Setting a timeout for the next request,
            // depending on the message activity:

            var nextRequest = 1000;

            // 2 seconds
            if(ticketing.data.noActivityMessages > 3){
                nextRequest = 2000;
            }

            if(ticketing.data.noActivityMessages > 10){
                nextRequest = 5000;
            }

            // 15 seconds
            if(ticketing.data.noActivityMessages > 20){
                nextRequest = 15000;
            }
            }
            else
            {
                general.displayError(r.error);
                var nextRequest = 1000;
            }

            Timeout["Messages"]=setTimeout("ticketing.getMessages();",nextRequest);

        });
    },



    // This method requests the latest chats
    // (since last_id,timestamp), and adds them to the page. currently 24 hours past chats

    getChats : function(){
        $.tzPOST('getChats',{last_id:ticketing.data.lastIDChats,date_and_time:Math.round(new Date().getTime()/1000-23*3600)},function(r){
        //update messages from mysql db
            if(!r.error)
            {
            for(var i=0;i<r.length;i++){
                ticketing.addChatLine(r[i]);
            }
            //if new messages, update to lastid
            //message.data.noActivity is reset, so next update in 1 second

            if(r.length){
                ticketing.data.noActivityChats = 0;
                ticketing.data.lastIDChats = r[i-1].id;
                }
            else{
                // If no messages were received, increment
                // the noActivity counter.
                ticketing.data.noActivityChats++;
            }
            //if no chats exist yet
            if(!ticketing.data.lastIDChats){
                ticketing.data.jspAPIChats.getContentPane().html('<p class="noChats">Nog geen chats</p>');
            }

            // Setting a timeout for the next request,
            // depending on the message activity:

            var nextRequest = 1000;

            // 2 seconds
            if(ticketing.data.noActivityChats > 3){
                nextRequest = 2000;
            }

            if(ticketing.data.noActivityChats > 10){
                nextRequest = 5000;
            }

            // 15 seconds
            if(ticketing.data.noActivityChats > 20){
                nextRequest = 15000;
            }
            }
            else
            {
                general.displayError(r.error);
                var nextRequest = 1000;
            }

            Timeout["Chats"]=setTimeout("ticketing.getChats();",nextRequest);

        });
    },


// The addMessageLine method ads a message entry to the page

    addMessageLine : function(params){

        if((params.avatar=="") || (params.avatar=="NULL") || (params.avatar==null))
        {
        params.avatar="img/unknown24x24.png"
        }

        var d = new Date();
        var strTime="";
        if(params.created) {

            // PHP returns the time in UTC (GMT). We use it to feed the date
            // object and later output it in the user's timezone. JavaScript
            // internally converts it for us.
            var date_time=params.created.split(" ");
            var time = date_time[1].split(":");
            var strTime=time[0]+':'+time[1];
            //d.setUTCHours(time[0],time[1]);
        }

        //params.time = (d.getHours() < 10 ? '0' : '' ) + d.getHours()+':'+(d.getMinutes() < 10 ? '0':'') + d.getMinutes();
        params.time = strTime;
        var markup = general.render('messageLine',params),
            exists = $('#MeldingenList .message-'+params.id);

        if(exists.length){
            exists.remove();
        }

        if(!ticketing.data.lastIDMessages){
            // If this is the first message, remove the
            // paragraph saying there aren't any:

            $('#MeldingenList p').remove();
        }

        //If this isn't a temporary message:
        if(params.id.toString().charAt(0) != 't'){
            var previous = $('#MeldingenList .message-'+(+params.id - 1));
            if(previous.length){
                previous.after(markup);
            }
            else ticketing.data.jspAPIMeldingen.getContentPane().append(markup);
        }
        else ticketing.data.jspAPIMeldingen.getContentPane().append(markup);

        // As we added new content, we need to
        // reinitialise the jScrollPane plugin:
        ticketing.data.jspAPIMeldingen.reinitialise();
        ticketing.data.jspAPIMeldingen.scrollToBottom(true);

    },


// The addMessageLine method ads a message entry to the page

    addChatLine : function(params){

        if((params.avatar=="") || (params.avatar=="NULL") || (params.avatar==null))
        {
        params.avatar="img/unknown24x24.png"
        }

        var d = new Date();
        var strTime="";
        if(params.created) {

            // PHP returns the time in UTC (GMT). We use it to feed the date
            // object and later output it in the user's timezone. JavaScript
            // internally converts it for us.
            var date_time=params.created.split(" ");
            var time = date_time[1].split(":");
            var strTime=time[0]+':'+time[1];
            //d.setUTCHours(time[0],time[1]);
        }

        //params.time = (d.getHours() < 10 ? '0' : '' ) + d.getHours()+':'+(d.getMinutes() < 10 ? '0':'') + d.getMinutes();
        params.time = strTime;
        var markup = general.render('chatLine',params),
            exists = $('#WL-ChatList .chat-'+params.id);

        if(exists.length){
            exists.remove();
        }

        if(!ticketing.data.lastIDChats){
            // If this is the first chat, remove the
            // paragraph saying there aren't any:

            $('#WL-ChatList p').remove();
        }

        //If this isn't a temporary chat:
        if(params.id.toString().charAt(0) != 't'){
            var previous = $('#WL-ChatList .chat-'+(+params.id - 1));
            if(previous.length){
                previous.after(markup);
            }
            else ticketing.data.jspAPIChats.getContentPane().append(markup);
        }
        else ticketing.data.jspAPIChats.getContentPane().append(markup);

        // As we added new content, we need to
        // reinitialise the jScrollPane plugin:
        ticketing.data.jspAPIChats.reinitialise();
        ticketing.data.jspAPIChats.scrollToBottom(true);

    },

// Requesting a list with all the users.

    getUsers : function(){

        $.tzPOST('getUsers',{options:'logged'},function(r){
            if(!r.error)
                {
                  ticketing.data.jspAPIUsers.getContentPane().empty();
                  var users = [];
                  var markup;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('user',r[i]);
                        ticketing.data.jspAPIUsers.getContentPane().append(markup);
                    }
                  }

                  //empty no one is online variable
                  var message = '';

                  if(r.length<1){
                    message = 'Niemand is online';
                  }
                  else {
                    message = r.length+' '+(r.length == 1 ? 'persoon':'personen')+' online';
                  }

                  ticketing.data.jspAPIUsers.getContentPane().append('<p class="count">'+message+'</p>');

                  ticketing.data.jspAPIUsers.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
                Timeout["Users"]=setTimeout("ticketing.getUsers();",15000);

            });
    },

    getHandles : function(){
        $.tzPOST('getGroups',{recursive:'true'},function(r){
            if(r)
              {
              if(!r.error)
                {
                  ticketing.data.jspAPIHandles.getContentPane().empty();
                  var markup_group;
                  var markup_handle;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup_group=general.render('groups',r[i]);
                        ticketing.data.jspAPIHandles.getContentPane().append(markup_group);
                        if (!(typeof r[i]['handles'] === 'undefined')) {
                          for (var j = 0; j < r[i]['handles'].length; j++) {
                            markup_handle=general.render('handles',r[i]['handles'][j]);
                            ticketing.data.jspAPIHandles.getContentPane().append(markup_handle);
                          }
                        }
                    }
                  }
                ticketing.data.jspAPIHandles.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }

              }
              else
              {
                    //empty no groups
                    var message = 'Geen voertuigen';
                    ticketing.data.jspAPIHandles.getContentPane().append('<p class="count">'+message+'</p>');
                    ticketing.data.jspAPIHandles.reinitialise();
              }
        });

    },

  getNewTickets : function(){
        $.tzPOST('getTicketList',{recursive : true, status : [{1: 'Nieuw'}]},function(r){
          if(r){
            if(!r.error)
                {
                ticketing.data.jspAPINewTickets.getContentPane().empty();
                params = {role : ticketing.data.role};
                var markup;
                var markup_child;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('parentticket',$.extend(r[i],params));
                        ticketing.data.jspAPINewTickets.getContentPane().append(markup);
                        if (r[i]['children']) {
                            extra_params = {parent_id : r[i].id};
                            for (var j = 0; j < r[i]['children'].length ; j++) {
                              markup_child=general.render('childticket',$.extend(r[i]['children'][j],extra_params));
                              ticketing.data.jspAPINewTickets.getContentPane().append(markup_child);
                            }

                        }
                    }
                  }

                ticketing.data.jspAPINewTickets.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
          }
          else
          {
            ticketing.data.jspAPINewTickets.getContentPane().empty();
            var message = 'Geen nieuwe tickets';
            ticketing.data.jspAPINewTickets.getContentPane().append('<p class="count">'+message+'</p>');
            ticketing.data.jspAPINewTickets.reinitialise();
          }
          Timeout["NewTickets"]=setTimeout("ticketing.getNewTickets();",15000);
        });
    },


  getOpenTickets : function(){
        $.tzPOST('getTicketList',{recursive : true, status : [{1:'Open'}]},function(r){
          if(r){
            if(!r.error)
                {
                ticketing.data.jspAPIOpenTickets.getContentPane().empty();
                params = {role : ticketing.data.role};
                var markup;
                var markup_extra;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('parentticket',$.extend(r[i],params));
                        ticketing.data.jspAPIOpenTickets.getContentPane().append(markup);
                        if (r[i]['children']) {
                            extra_params = {parent_id : r[i].id};
                            for (var j = 0; j < r[i]['children'].length ; j++) {
                              markup_child=general.render('childticket',$.extend(r[i]['children'][j],extra_params));
                              ticketing.data.jspAPIOpenTickets.getContentPane().append(markup_child);
                            }

                        }
                    }
                  }
                ticketing.data.jspAPIOpenTickets.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
          }
          else
          {
            ticketing.data.jspAPIOpenTickets.getContentPane().empty();
            var message = 'Geen open tickets';
            ticketing.data.jspAPIOpenTickets.getContentPane().append('<p class="count">'+message+'</p>');
            ticketing.data.jspAPIOpenTickets.reinitialise();
          }
          Timeout["OpenTickets"]=setTimeout("ticketing.getOpenTickets();",15000);
        });
    },

    getClosedTickets : function(){
        $.tzPOST('getTicketList',{recursive : true, status : [{1:'Gesloten'}]},function(r){
          if(r){
            if(!r.error)
                {
                ticketing.data.jspAPIClosedTickets.getContentPane().empty();
                params = {role : ticketing.data.role};
                var markup;
                var markup_extra;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        r[i].role=ticketing.data.role;
                        markup=general.render('parentticket',$.extend(r[i],params));
                        ticketing.data.jspAPIClosedTickets.getContentPane().append(markup);
                        if (r[i]['children']) {
                            extra_params = {parent_id : r[i].id};
                            for (var j = 0; j < r[i]['children'].length ; j++) {
                              markup_child=general.render('childticket',$.extend(r[i]['children'][j],extra_params));
                              ticketing.data.jspAPIClosedTickets.getContentPane().append(markup_child);
                            }

                        }
                    }
                  }
                ticketing.data.jspAPIClosedTickets.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
          }
          else
          {
            ticketing.data.jspAPIClosedTickets.getContentPane().empty();
            var message = 'Geen gesloten tickets';
            ticketing.data.jspAPIClosedTickets.getContentPane().append('<p class="count">'+message+'</p>');
            ticketing.data.jspAPIClosedTickets.reinitialise();
          }
          Timeout["ClosedTickets"]=setTimeout("ticketing.getClosedTickets();",15000);
        });
    },

    getTicketDetail : function(ticket_id,parent_id){
        $.tzPOST('getTicketDetail',{id: ticket_id},function(q){
          if(q){
            if(!q.error)
                {
                    $('#TicketDetailsList').empty();
                    if(parent_id==0){

                      switch(q[0].status){
                        case 'Nieuw':
                          $('#TicketDetailsList').html(general.render('ticket_detail_new',q[0]));
                        break;
                        case 'Open':
                          $('#TicketDetailsList').html(general.render('ticket_detail_open',q[0]));
                        break;
                        case 'Gesloten':
                          $('#TicketDetailsList').html(general.render('ticket_detail_closed',q[0]));
                        break;

                      }
                    }
                    else
                    {
                          q[0].status="Subticket";
                          $('#TicketDetailsList').html(general.render('subticket_detail',q[0]));
                    }

                    $('#WL-ActieForm').fadeIn();
                    $('#FeedbackForm').fadeIn();
                    //update select owner
                    $.tzPOST('getUsers',{options:'all'},function(r){
                      if(!r.error)
                        {
                          if(q[0].wluser){
                            $('option', $('#owner')).remove();
                            var owner_options = $('#owner').attr('options');
                            var index_owner;
                            /*owner_options[0] = new Option("");*/
                            for(var i=0; i< r.length;i++){
                              if(r[i]){
                                if(r[i].role=='WL' || r[i].role=='Admin')
                                  {
                                    if(r[i].username==q[0].wluser){
                                      index_owner=owner_options.length;
                                    }
                                  owner_options[owner_options.length] = new Option(r[i].username,r[i].id);
                                  }
                                }
                            }
                          if(index_owner)$('#owner option:eq('+index_owner+')' ).attr("selected","selected");
                          }
                        }
                      else
                        {
                          general.displayError(r.error);
                        }
                    });


                    //update become child ticket
                    $.tzPOST('getTicketList',{recursive : false, status : [{1: 'Open', 2: 'Nieuw', 3: 'Gesloten'}]},function(r){
                      if(!r.error)
                        {
                            $('option', $('#become_Ticket')).remove();
                            var become_Ticket_options = $('#become_Ticket').attr('options');

                            for(var i=0; i< r.length;i++){
                              var maxlength=20;
                              if(r[i]){
                                //don't want to make it a child of its own, that would be weird;-)
                                if(r[i].title.length<maxlength)
                                {
                                maxlength=r[i].title.length;
                                }

                                if(r[i].id!=ticket_id && r[i].id!=parent_id){
                                  become_Ticket_options[become_Ticket_options.length] = new Option(r[i].title.substring(0,maxlength),r[i].id);
                                }
                              }

                            }
                        }
                      else
                        {
                          general.displayError(r.error);
                        }
                    });


                    //update select handles
                    $.tzPOST('getHandles',{},function(r){
                      if(!r.error)
                        {

                            $('option', $('#ticket_Handle')).remove();
                            $('option', $('#subticket_Handle')).remove();
                            $('option', $('#feedback_Handle')).remove();
                            var tickethandles_options = $('#ticket_Handle').attr('options');
                            var subtickethandles_options = $('#subticket_Handle').attr('options');
                            var feedbackhandles_options = $('#feedback_Handle').attr('options');
                            var index_handle;
                            tickethandles_options[0] = new Option("");
                            subtickethandles_options[0] = new Option("");
                            feedbackhandles_options[0] = new Option("");
                            for(var i=0; i< r.length;i++){
                              if(r[i]){
                                    //current handle?
                                    if(r[i].id==q[0].handle_id){
                                      index_handle=tickethandles_options.length;
                                    }
                                  tickethandles_options[tickethandles_options.length] = new Option(r[i].description,r[i].id);
                                  subtickethandles_options[subtickethandles_options.length] = new Option(r[i].description,r[i].id);
                                  feedbackhandles_options[feedbackhandles_options.length] = new Option(r[i].description,r[i].id);

                              }
                              if(index_handle)
                              {
                                $('#ticket_Handle option:eq('+index_handle+')' ).attr("selected","selected");
                                $('#subticket_Handle option:eq('+index_handle+')' ).attr("selected","selected");
                                $('#feedback_Handle option:eq('+index_handle+')' ).attr("selected","selected");
                              }
                            }
                        }
                      else
                        {
                          general.displayError(r.error);
                        }
                  });

                }
            else
                {
                    general.displayError(q.error);
                }
          }
          else
          {

          }
        });
    },

    changeTabview : function(window){
        switch(window){

        case 'WL-Actie':
        $('#WL-ActieHeader').css("background-image", "url(img/solid_blue.jpg)");
        $('#FeedbackHeader').css("background-image", "url(img/solid_grey.jpg)");
        $('#TimelineHeader').css("background-image", "url(img/solid_grey.jpg)");
        $('#FeedbackList').fadeOut();
        $('#TimelineList').fadeOut();
        $('#WL-ActieList').fadeIn();
        $('#WL-Actie').css('z-index',"1");
        $('#Feedback').css('z-index',"");
        $('#Timeline').css('z-index',"");
        break;

        case 'Feedback':
        $('#WL-ActieHeader').css("background-image", "url(img/solid_grey.jpg)");
        $('#FeedbackHeader').css("background-image", "url(img/solid_blue.jpg)");
        $('#TimelineHeader').css("background-image", "url(img/solid_grey.jpg)");
        $('#TimelineList').fadeOut();
        $('#WL-ActieList').fadeOut();
        $('#FeedbackList').fadeIn();
        $('#WL-Actie').css('z-index',"");
        $('#Feedback').css('z-index',"1");
        $('#Timeline').css('z-index',"");
        break;

        case 'Timeline':
        $('#WL-ActieHeader').css("background-image", "url(img/solid_grey.jpg)");
        $('#FeedbackHeader').css("background-image", "url(img/solid_grey.jpg)");
        $('#TimelineHeader').css("background-image", "url(img/solid_blue.jpg)");
        $('#WL-ActieList').fadeOut();
        $('#FeedbackList').fadeOut();
        $('#TimelineList').fadeIn();
        $('#WL-Actie').css('z-index',"");
        $('#Feedback').css('z-index',"");
        $('#Timeline').css('z-index',"1");
        break;
        }
    },

  killTimeouts : function(){
            for (key in Timeout)
            {
              clearTimeout(Timeout[key]);
            }
  },

  reInitTickets : function(type){

      switch(type){

        case 'New':
          window.clearTimeout(Timeout["NewTickets"]);
          setTimeout("ticketing.getNewTickets();",500);
        break;

        case 'Open':
          window.clearTimeout(Timeout["OpenTickets"]);
          setTimeout("ticketing.getOpenTickets();",500);
        break;

        case 'Closed':
          window.clearTimeout(Timeout["ClosedTickets"]);
          setTimeout("ticketing.getClosedTickets();",500);
        break;

        case 'All':
          window.clearTimeout(Timeout["NewTickets"]);
          setTimeout("ticketing.getNewTickets();",500);
          window.clearTimeout(Timeout["OpenTickets"]);
          setTimeout("ticketing.getOpenTickets();",500);
          window.clearTimeout(Timeout["ClosedTickets"]);
          setTimeout("ticketing.getClosedTickets();",500);
        break;
      }
  },

  reInitJSP : function(){
            ticketing.data.jspAPIMeldingen.reinitialise();
            ticketing.data.jspAPIChats.reinitialise();
            ticketing.data.jspAPIUsers.reinitialise();
            ticketing.data.jspAPIHandles.reinitialise();
            ticketing.data.jspAPINewTickets.reinitialise();
            ticketing.data.jspAPIOpenTickets.reinitialise();
            ticketing.data.jspAPIClosedTickets.reinitialise();
  }

};
