$(document).ready(function(){

  // Run the init method on document ready:
  ticketing.init();

});

var ticketing = {

  // data holds variables for use in the class:

  data : {
    lastID    : 1,
    noActivity  : 0
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

        //function to implement clicking on dynamic element ticket
        $('div.list_item_parent_ticket').live('click', function(){
          if($(this).attr("id")!=ticketing.data.selectedticket)
            {
            ticketing.data.selectedticket=$(this).attr("id");
            }

          ticketing.getTicketDetail(ticketing.data.selectedticket);


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
        if((avatar=="") || (avatar=="NULL"))
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
        $.tzPOST('getMessages',{last_id:ticketing.data.lastID,date_and_time:Math.round(new Date().getTime()/1000-23*3600)},function(r){
        //update messages from mysql db
            if(!r.error)
            {
            for(var i=0;i<r.length;i++){
                ticketing.addMessageLine(r[i]);
            }
            //if new messages, update to lastid
            //message.data.noActivity is reset, so next update in 1 second

            if(r.length){
                ticketing.data.noActivity = 0;
                ticketing.data.lastID = r[i-1].id;
                }
            else{
                // If no messages were received, increment
                // the noActivity counter.

                ticketing.data.noActivity++;
            }
            //if no chats exist yet
            if(!ticketing.data.lastID){
                ticketing.data.jspAPIMeldingen.getContentPane().html('<p class="noMessages">No messages yet</p>');
            }

            // Setting a timeout for the next request,
            // depending on the message activity:

            var nextRequest = 1000;

            // 2 seconds
            if(ticketing.data.noActivity > 3){
                nextRequest = 2000;
            }

            if(ticketing.data.noActivity > 10){
                nextRequest = 5000;
            }

            // 15 seconds
            if(ticketing.data.noActivity > 20){
                nextRequest = 15000;
            }
            }
            else
            {
                general.displayError(r.error);
                var nextRequest = 1000;
            }

            ticketing.data.idMessagesTimeout=setTimeout("ticketing.getMessages();",nextRequest);

        });
    },

// The addMessageLine method ads a message entry to the page

    addMessageLine : function(params){

        if((params.avatar=="") || (params.avatar=="NULL"))
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

        if(!ticketing.data.lastID){
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
                    message = 'No one is online';
                  }
                  else {
                    message = r.length+' '+(r.length == 1 ? 'person':'people')+' online';
                  }

                  ticketing.data.jspAPIUsers.getContentPane().append('<p class="count">'+message+'</p>');

                  ticketing.data.jspAPIUsers.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
                setTimeout("ticketing.getUsers();",15000);

            });
    },

    getHandles : function(){
        $.tzPOST('getGroups',{recursive:'true'},function(r){
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

                //empty no groups
                if(r.length<1){
                    var message = 'No groups exist';
                    ticketing.data.jspAPIHandles.getContentPane().append('<p class="count">'+message+'</p>');
                }
                ticketing.data.jspAPIHandles.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
                setTimeout("ticketing.getHandles();",60000);
            });

    },

  getNewTickets : function(){
        $.tzPOST('getTicketList',{recursive : true, status : [{1: 'Nieuw'}]},function(r){
          if(r){
            if(!r.error)
                {
                ticketing.data.jspAPINewTickets.getContentPane().empty();

                var markup;
                var markup_child;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('parentticket',r[i]);
                        ticketing.data.jspAPINewTickets.getContentPane().append(markup);
                        if (r[i]['children']) {
                            for (var j = 0; j < r[i]['children'].length ; j++) {
                              markup_child=general.render('childticket',r[i]['children'][j]);
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
            ticketing.data.jspAPIOpenTickets.getContentPane().empty();
            var message = 'Geen nieuwe tickets';
            ticketing.data.jspAPIOpenTickets.getContentPane().append('<p class="count">'+message+'</p>');
            ticketing.data.jspAPIOpenTickets.reinitialise();
          }
          ticketing.data.idTicketTimeout=setTimeout("ticketing.getNewTickets();",15000);
        });
    },


  getOpenTickets : function(){
        $.tzPOST('getTicketList',{recursive : true, status : [{1:'Open'}]},function(r){
          if(r){
            if(!r.error)
                {
                ticketing.data.jspAPIOpenTickets.getContentPane().empty();

                var markup;
                var markup_extra;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('parentticket',r[i]);
                        ticketing.data.jspAPIOpenTickets.getContentPane().append(markup);
                        if (r[i]['children']) {
                            for (var j = 0; j < r[i]['children'].length ; j++) {
                              markup_child=general.render('childticket',r[i]['children'][j]);
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
                ticketing.data.idTicketTimeout=setTimeout("ticketing.getOpenTickets();",15000);
        });
    },

    getClosedTickets : function(){
        $.tzPOST('getTicketList',{recursive : true, status : [{1:'Gesloten'}]},function(r){
          if(r){
            if(!r.error)
                {
                ticketing.data.jspAPIClosedTickets.getContentPane().empty();

                var markup;
                var markup_extra;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('parentticket',r[i]);
                        ticketing.data.jspAPIClosedTickets.getContentPane().append(markup);
                        if (r[i]['children']) {
                            for (var j = 0; j < r[i]['children'].length ; j++) {
                              markup_child=general.render('childticket',r[i]['children'][j]);
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
            ticketing.data.idTicketTimeout=setTimeout("ticketing.getClosedTickets();",15000);
        });
    },

    getTicketDetail : function(ticket_id){
        $.tzTESTPOST('getTicketDetail',{id: ticket_id},function(q){
          if(q){
            if(!q.error)
                {
                    $('#TicketDetailsList').empty();
                    $('#TicketDetailsList').html(general.render('ticket_detail',q));
                    //update select owner
                    $.tzPOST('getUsers',{options:'all'},function(r){
                      if(!r.error)
                        {
                          $('option', $('#owner')).remove();
                          var owner_options = $('#owner').attr('options');
                          var index_owner;
                          for(var i=0; i< r.length;i++){
                            if(r[i]){
                              if(r[i].role=='WL' || r[i].role=='Admin')
                                {
                                  if(r[i].username==q.user){
                                  index_owner=operator_options.length;

                                  }
                                  owner_options[owner_options.length] = new Option(r[i].username);
                                }
                              }
                          }
                          if(index_owner)$('#owner option:eq('+index_owner+')' ).attr("selected","selected");


                          $('option', $('#operator')).remove();
                          var operator_options = $('#operator').attr('options');
                          var index_operator;
                          for(var i=0; i< r.length;i++){
                            if(r[i]){
                              if(r[i].role=='RVD' || r[i].role=='Admin'){
                                if(r[i].username==q.user)
                                {
                                index_operator=operator_options.length;
                                }
                                operator_options[operator_options.length] = new Option(r[i].username);
                              }
                            }
                          }
                          if(index_operator)$('#operator option:eq('+index_operator+')' ).attr("selected","selected");
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


  reInitJSP : function(){
            ticketing.data.jspAPIMeldingen.reinitialise();
            ticketing.data.jspAPIUsers.reinitialise();
            ticketing.data.jspAPIHandles.reinitialise();
            ticketing.data.jspAPINewTickets.reinitialise();
            ticketing.data.jspAPIOpenTickets.reinitialise();
            ticketing.data.jspAPIClosedTickets.reinitialise();
  }

};
