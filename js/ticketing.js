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
    HandlelistVisible : 1,
  },

  // Init binds event listeners and sets up timers:

  init : function(){

    // Using the defaultText jQuery plugin, included at the bottom:
    $('#name').defaultText('Username');
    $('#password').defaultText('Password');

    // We use the working variable to prevent
    // multiple form submissions:

    var working = false;

    // Converting the #MeldingenList, #HandlesList divs into a jScrollPane,
    // and saving the plugin's API in logging.data:

    ticketing.data.jspAPIMeldingen = $('#MeldingenList').jScrollPane({
      verticalDragMinHeight: 12,
      verticalDragMaxHeight: 12
    }).data('jsp');

    ticketing.data.jspAPIChats = $('#WL-ChatList').jScrollPane({
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

        $('#handlelist_toggle_button').live('click', function(){
          if(!working)
          {
              working = true;
              if(ticketing.data.HandlelistVisible==1)
              {
              //$('#Handles').fadeOut();
              $('#Handles').css('display','none');
              $('#ChatContainer').css('left','0%');
              $('#ChatContainer').css('width','100%');
              $('#handlelist_toggle_button').attr('value','Roepnamenlijst aan');
              ticketing.data.HandlelistVisible=0;
              }
              else
              {
              //$('#Handles').fadeIn();
              $('#Handles').css('display','block');
              $('#ChatContainer').css('left','33%');
              $('#ChatContainer').css('width','65%');
              $('#handlelist_toggle_button').attr('value','Roepnamenlijst uit');
              ticketing.data.HandlelistVisible=1;
              }
              ticketing.reInitJSP();
              working=false;
          }
        });


        //function to implement clicking on dynamic element groups
        $('div.list_item_group').live('click', function(){
          if(!working)
          {
            working = true;
            var groupid=$(this).attr("id");
            if($(this).attr('visible')==0){
                $(this).attr('visible','1');
                $(".list_item_handle").each(function(i) {
                if($(this).hasClass(groupid))
                  {
                  $(this).fadeIn();

                  }
                });
            }
            else
            {
                $(this).attr('visible','0');
                $(".list_item_handle").each(function(i) {
                if($(this).hasClass(groupid))
                  {
                  $(this).fadeOut();
                  }
                });
            }

            working=false;
          }
          //ticketing.data.jspAPIHandles.getContentPane().append('<div class=test></div>');
          //ticketing.data.jspAPIHandles.reinitialise();
          //$('#HandlesList .test').remove();
          ticketing.data.jspAPIHandles.reinitialise();
        });

        $('#search_handles').keyup(function (e) {

            $(".list_item_group").each(function(i) {
              $(this).attr('visible','1');
            });

            if($('#search_handles').val()=="")
            {
              $(".list_item_handle").each(function(i) {
                $(this).fadeIn();
              });
            }
            else
            {
                var keyword=$('#search_handles').val().toLowerCase();
                $(".list_item_handle").each(function(i) {
                  var handle_name=$(this).children('.list_item_handle_name').text().toLowerCase();
                  var handle_description=$(this).children('.list_item_handle_description').text().toLowerCase();
                  if((handle_name.search(keyword) < 0) && (handle_description.search(keyword) < 0))
                    {
                    $(this).fadeOut();
                    }
                  else
                    {
                    $(this).fadeIn();
                    }
                });
            }
        })

        //function to implement clicking on thickbox link
        $('#openmodalbutton').live('click', function(){
          general.tb_open_new('UpdatesAndFeedbacks.html?&KeepThis=true&height=500&width=800');
        });

        // Logging a person into blam:

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
            working = false;
            return false;
        });

      // add listener for this button and change ticket details
      $('#saveticketbutton').live('click',function(){
            $.tzPOST('changeTicketDetails',{id:ticketing.data.selectedticket,title:$('#ticket_title').val(),text:$('#ticket_text').val(),location:$('#ticket_location').val(),solution:$('#ticket_oplossing').val(),handle_id:$('#ticket_Handle').val(),reference:$('#ticket_reference').val()},function(r){
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
            general.displaySaved("Saved Ticket: " + $('#ticket_title').val());
            setTimeout("ticketing.getTicketDetail(ticketing.data.selectedticket,0);",500);
      });

      // add listener for this button and change ticket details
      $('#closeticketbutton').live('click',function(){
              $.tzPOST('changeTicketDetails',{id:ticketing.data.selectedticket,title:$('#ticket_title').val(),text:$('#ticket_text').val(),location:$('#ticket_location').val(),solution:$('#ticket_oplossing').val(),handle_id:$('#ticket_Handle').val(),reference:$('#ticket_reference').val()},function(r){
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
            general.displaySaved("Saved Ticket: " + $('#ticket_title').val());
            $('#TicketDetailsList').empty();
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
            ticketing.reInitTickets("All");
            $('#TicketDetailsList').empty();
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
      });

      // add listener for this button and add an update
      $('#saveupdatebutton').live('click',function(){
        if(working) return false;
        working = true;
        if($('#ticket_update').val()!="" && $('#ticket_update').val()!="Text voor update")
          {
            $.tzPOST('createUpdate',{ticket_id:ticketing.data.selectedticket,message:$('#ticket_update').val()},function(r){
              working = false;
              if(r.error){
                    general.displayError(r.error);
                  }
                  else
                  {
                    general.displaySaved("Update aangemaakt: " + $('#ticket_title').val());
                    $('#ticket_update').val("");
                    $('#ticket_update').defaultText('Text voor update');
                    ticketing.TicketDetailUpdates(ticketing.data.selectedticket);
                  }

            });
          }
          else
                {
                alert("Niet goed ingevuld!");
                working = false;
                }
          return false;
      });


        $('#savefeedbackbutton').live('click',function(){
            if(working) return false;
            working = true;
                if($('#ticket_feedback').val()!="" && $('#ticket_feedback').val()!="Text voor terugmelding")
                {
                  $.tzPOST('createFeedback',{ticket_id:ticketing.data.selectedticket,title:$('#ticket_title').val(),message:$('#ticket_feedback').val()},function(r){
                    working = false;
                    if(r.error){
                        general.displayError(r.error);
                    }
                    else
                    {
                        general.displaySaved("Terugmelding aangemaakt: " + $('#ticket_title').val());
                        $('#ticket_feedback').val("");
                        $('#ticket_feedback').defaultText('Text voor terugmelding');
                        ticketing.TicketDetailUpdates(ticketing.data.selectedticket);
                    }
                  });
                }
                else
                {
                alert("Niet goed ingevuld!");
                working = false;
                }
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
        new_avatar="unknown30x30.png";
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
        });
    },

    // This method requests the latest messages
    // (since last_id,timestamp), and adds them to the page. currently 24 hours past messages

    getMessages : function(){
        //timestamp uses 2 hours (120 min)
        $.tzPOST('getMessages',{last_id:ticketing.data.lastIDMessages,date_and_time:general.generateTimestamp(120)},function(r){
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

            //if no messages exist yet
            if($("#MeldingenList .jspContainer .jspPane > div").length==0 && $("#MeldingenList .jspContainer .jspPane > p").length==0){
                ticketing.data.jspAPIMeldingen.getContentPane().html('<p class="noMessages">Nog geen meldingen</p>');
                ticketing.data.jspAPIMeldingen.reinitialise();
            }

            if($("#MeldingenList .jspContainer .jspPane > div").length > 0 && $("#MeldingenList .jspContainer .jspPane > p").length > 0){
              // If this is the first melding, remove the
              // paragraph saying there aren't any:
              $('#MeldingenList .jspContainer .jspPane > p').remove();
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
        var d=new Date();
        //timestamp uses 2 hours (120 min)
        $.tzPOST('getChats',{last_id:ticketing.data.lastIDChats,since:general.generateTimestamp(120)},function(r){
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

            //if no messages exist yet
            if($("#WL-ChatList .jspContainer .jspPane > div").length==0 && $("#WL-ChatList .jspContainer .jspPane > p").length==0){
                ticketing.data.jspAPIChats.getContentPane().html('<p class="noMessages">Nog geen chats</p>');
                ticketing.data.jspAPIChats.reinitialise();
            }

            if($("#WL-ChatList .jspContainer .jspPane > div").length > 0 && $("#WL-ChatList .jspContainer .jspPane > p").length > 0){
              // If this is the first melding, remove the
              // paragraph saying there aren't any:
              $('#WL-ChatList .jspContainer .jspPane > p').remove();
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
        params.avatar="unknown24x24.png"
        }

        var d = new Date();

        if(params.created){
        params.time = general.stripToTime(params.created);
        }
        else
        {
        params.time = (d.getHours() < 10 ? '0' : '' ) + d.getHours()+':'+(d.getMinutes() < 10 ? '0':'') + d.getMinutes();
        }

        var markup = general.render('messageLine',params),
          exists = $('#MeldingenList .message-'+params.id);

        if(exists.length){
            exists.remove();
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
        params.avatar="unknown24x24.png"
        }

        var d = new Date();

        if(params.created) {
        params.time = general.stripToTime(params.created);
        }
        else {
        params.time = (d.getHours() < 10 ? '0' : '' ) + d.getHours()+':'+(d.getMinutes() < 10 ? '0':'') + d.getMinutes();
        }


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
                  $('div.Topbar_nr_users').empty();
                  $('div.Topbar_users').empty();
                  var users = [];
                  var markup='<p>';

                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        if(i<r.length-1)
                          {
                          markup=markup+r[i].username+', ';
                        }
                        else
                        {
                        markup=markup+r[i].username;
                        }
                    }
                  }
                  markup=markup+'</p>';
                  $('div.Topbar_users').append(markup);


                  var message = '';
                  if(r.length<1){
                    message = '<p>users online(0)</p>';
                  }
                  else {
                    message = '<p>users online('+r.length+'):</p>';
                  }
                  $('div.Topbar_nr_users').append(message);
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
                  //ticketing.data.jspAPIHandles.getContentPane().append('<input type="text" class="rounded" value="" id="search_handles">');
                  var markup_group;
                  var markup_handle;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup_group=general.render('groups',r[i]);
                        ticketing.data.jspAPIHandles.getContentPane().append(markup_group);
                        if (!(typeof r[i]['handles'] === 'undefined')) {
                          for (var j = 0; j < r[i]['handles'].length; j++) {
                            r[i]['handles'][j].groupid=r[i].id;
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
                  for(var i=0; i<r.length;i++){
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
        //main function that displays the ticketdetails
        $.tzPOST('getTicketDetail',{id: ticket_id},function(r){
          if(r){
            if(!r.error)
                {
                    $('#TicketDetailsList').empty();
                    if(parent_id==0){

                      switch(r[0].status){
                        case 'Nieuw':
                          $('#TicketDetailsList').html(general.render('ticket_detail_new',r[0]));
                        break;
                        case 'Open':
                          $('#TicketDetailsList').html(general.render('ticket_detail_open',r[0]));
                        break;
                        case 'Gesloten':
                          $('#TicketDetailsList').html(general.render('ticket_detail_closed',r[0]));
                        break;

                      }
                    }
                    else
                    {
                          r[0].status="Subticket";
                          $('#TicketDetailsList').html(general.render('subticket_detail',r[0]));
                    }

                    $('#ticket_update').defaultText('Text voor update');
                    $('#ticket_feedback').defaultText('Text voor terugmelding');

                    ticketing.TicketDetailUsers(r[0].wluser);
                    ticketing.TicketDetailTickets(r[0].status,ticket_id,parent_id);
                    ticketing.TicketDetailHandles(r[0].handle_id,r[0].status);
                    if(r[0].status!='Subticket'){
                    ticketing.TicketDetailUpdates(ticket_id);
                    }
                }
            else
                {
                    general.displayError(r.error);
                }
          }
          else
          {
            $('#TicketDetailsList').html('<p>Invalid ticket selected, please contact your local admin!</p>');
          }
        });
    },

    TicketDetailUsers : function(wl_user){
      //update select owner in ticketdetails
      $.tzPOST('getUsers',{options:'all'},function(r){
      if(!r.error)
      {
        if(wl_user){
          $('option', $('#owner')).remove();
          var owner_options = $('#owner').attr('options');
          var index_owner;
          /*owner_options[0] = new Option("");*/
            for(var i=0; i< r.length;i++){
              if(r[i]){
                if(r[i].role=='WL' || r[i].role=='Admin')
                  {
                    if(r[i].username==wl_user){
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
    },

    TicketDetailTickets : function(ticketstatus,ticket_id,parent_id){
      //update become child ticket in TicketDetail
      $.tzPOST('getTicketList',{recursive : false, status : [{1: 'Open', 2: 'Nieuw', 3: 'Gesloten'}]},function(r){
        if(!r.error)
          {
            $('option', $('#become_Ticket')).remove();
              var become_Ticket_options = $('#become_Ticket').attr('options');
                for(var i=0; i< r.length;i++){
                  var maxlength=15;
                    if(r[i]){
                      //don't want to make it a child of its own, that would be weird;-)
                      if(r[i].title.length<maxlength)
                      {
                        maxlength=r[i].title.length;
                      }
                      if(r[i].id!=ticket_id && r[i].id!=parent_id && ticketstatus!="Subticket")
                      {
                        strOption = [r[i].id + ' : ' + r[i].title.substring(0,maxlength)];
                        become_Ticket_options[become_Ticket_options.length] = new Option(strOption,r[i].id);
                      }
                      if(ticketstatus=="Subticket")
                      {
                        strOption = [r[i].id + ' : ' + r[i].title.substring(0,maxlength)];
                        $('#become_Ticket').val(strOption);
                      }
                    }
                }
          }
          else
          {
           general.displayError(r.error);
          }
      });
    },

    TicketDetailHandles : function(handle_id,ticketstatus){
    //update select handles in ticketDetails
      $.tzPOST('getHandles',{},function(r){
        if(!r.error)
          {
            $('option', $('#ticket_Handle')).remove();

            var tickethandles_options = $('#ticket_Handle').attr('options');

            var index_handle;
            tickethandles_options[0] = new Option("");
              for(var i=0; i< r.length;i++){
                if(r[i]){
                    //check whether the ticket handle is in this list, if it is, store the index
                    if(r[i].id==handle_id){
                      index_handle=tickethandles_options.length;
                    }
                    //add the handles to the select
                    tickethandles_options[tickethandles_options.length] = new Option(r[i].description,r[i].id);

                }
                //if the index was stored, use it to select this item
                if(index_handle)
                {
                  $('#ticket_Handle option:eq('+index_handle+')' ).attr("selected","selected");

                }
              }
          }
          else
          {
            general.displayError(r.error);
          }
      });
    },

    TicketDetailUpdates : function(ticket_id){
      //update the last update box in ticketdetails
      $.tzPOST('getUpdates',{ticket_id:ticket_id,type:'update'},function(r){
      if(!r.error)
      {
          if(r && r.length>0){
              $('p.list_item_ticketdetail_label_last_update').show();
              $('#ticket_last_update').show();
              $('#openmodalbutton').show();
              var length_updates=r.length-1;
              var markup=r[length_updates].message;
              //update time
              $('p.list_item_ticketdetail_label_last_update').text('Laatste update('+general.stripToTime(r[length_updates].created)+'):');
              //update text field
              $('#ticket_last_update').val(markup);
          }
      }
      else
        {
          general.displayError(r.error);
        }
      });

      $.tzPOST('getUpdates',{ticket_id:ticket_id,type:'feedback'},function(r){
      if(!r.error)
      {
          if(r && r.length>0){
            $('p.list_item_ticketdetail_label_last_feedback').show();
            $('#ticket_last_feedback').show();
            $('#openmodalbutton').show();
            var length_feedback=r.length-1;
            var markup=r[length_feedback].message;
            //update time
            $('p.list_item_ticketdetail_label_last_feedback').text('Laatste terugmelding('+general.stripToTime(r[length_feedback].created)+'):');
            //update text field
            $('#ticket_last_feedback').val(markup);
          }
      }
      else
        {
          general.displayError(r.error);
        }
      });

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
            ticketing.data.jspAPIHandles.reinitialise();
            ticketing.data.jspAPINewTickets.reinitialise();
            ticketing.data.jspAPIOpenTickets.reinitialise();
            ticketing.data.jspAPIClosedTickets.reinitialise();
  }

};
