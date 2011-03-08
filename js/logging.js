$(document).ready(function(){

  // Run the init method on document ready:
  logging.init();

});

var logging = {

  // data holds variables for use in the class:

  data : {
    lastID    : 1,
    noActivity  : 0
  },

  // Init binds event listeners and sets up timers:

  init : function(){

    // add listener for this button
    $('#submitbutton').bind('click',function(){
    $('#submitForm').submit();
    });

    // add listener for this button
    $('#searchbutton').bind('click',function(){
    $('#searchForm').submit();
    });

    $('#messageButton').bind('click',function(){
      logging.data.jspAPIMeldingen.getContentPane().empty();
      logging.data.lastID=1;
      logging.getMessages();
      $('#messageButton').hide();
      return false;
    });

    // Using the defaultText jQuery plugin, included at the bottom:
    $('#name').defaultText('Nickname');
    $('#password').defaultText('Password');

        // We use the working variable to prevent multiple form submissions:
        var working = false;

        // Converting the #MeldingenList, #UsersList, #HandlesList divs into a jScrollPane,
        // and saving the plugin's API in logging.data:

        logging.data.jspAPIMeldingen = $('#MeldingenList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
        }).data('jsp');

        logging.data.jspAPIUsers = $('#UsersList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
        }).data('jsp');

        logging.data.jspAPIHandles = $('#HandlesList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
        }).data('jsp');

        logging.data.jspAPITickets = $('#TicketsList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
        }).data('jsp');

        logging.data.jspAPIFeedback = $('#FeedbackList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
        }).data('jsp');

        //function to implement clicking on dynamic element ticket
        $('div.list_item_parent_ticket').live('click', function(){
          if($(this).attr("id")!=logging.data.selectedticket)
            {
            logging.data.selectedticket=$(this).attr("id");
            }
          else
            {
            logging.data.selectedticket=0;
            }
          window.clearTimeout(logging.data.idTicketTimeout);
          logging.getTickets();
        });

        //function to implement clicking on dynamic element feedback
        $('div.list_item_feedback').live('click', function(){
          if($(this).attr("id")!=logging.data.selectedfeedback)
            {
            logging.data.selectedfeedback=$(this).attr("id");
            }
          else
            {
            logging.data.selectedfeedback=0;
            }
          window.clearTimeout(logging.data.idFeedbackTimeout);
          logging.getFeedback();
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
                else    {
                    logging.login(r.username,r.avatar,r.role);
                    }
            });

            return false;
        });

        // Checking whether the user is already logged (browser refresh)

        $.tzPOST('checkLogged',function(r){
            if(!r.error)
            {
                logging.login(r.username,r.avatar,r.role);

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


        // catching when user presses enter
        $('#keyword').keydown(function(e){
            if(e.which == 13) {
                e.preventDefault();
                $('#searchbutton').trigger('click');
                return false
            }
        })

        // Searching for messages:

        $('#searchForm').submit(function(){
            var keyword = $('#keyword').val();
            if(keyword)
            {
              if(working) return false;
                working = true;

              window.clearTimeout(logging.data.idMessagesTimeout);
              $('#messageButton').show();
              logging.searchMessages(keyword);
              $('#keyword').val('');
              working = false;
            }
            return false;
        });


        // catching when user presses enter
        $('#messagetext').keydown(function(e){
            if(e.which == 13) {
                e.preventDefault();
                $('#submitbutton').trigger('click');
                return false
            }
        })

        // Submitting a new message entry:

        $('#submitForm').submit(function(){

            var text = $('#messagetext').val();

            if(text.length == 0){
                return false;
            }

            if(working) return false;
            working = true;


            // Assigning a temporary ID to the chat:
            var tempID = 't'+Math.round(Math.random()*1000000),

            params = {
                    id : tempID,
                    username  : logging.data.username,
                    avatar  : logging.data.avatar,
                    text    : text.replace(/</g,'&lt;').replace(/>/g,'&gt;')
                };

            // Using our addMessageLine method to add the message
            // to the screen immediately, without waiting for
            // the AJAX request to complete:
            logging.addMessageLine($.extend({},params));

            // Using our tzPOST wrapper method to send the message
            // via a POST AJAX request:
            var inputcheckbox = $('#ticket:checked').val();
            $.tzPOST('addMessage',$(this).serialize(),function(r){
            if(!r.error){
                working = false;
                //empty input form textbox
                $('#messagetext').val('');
                if(inputcheckbox!=undefined)
                {
                $('#ticket').attr('checked',false);
                }
                //remove old temporary message
                $('div.message-'+tempID).remove();

                //insert newly received ID
                params['id'] = r.id;
                logging.addMessageLine($.extend({},params));
                }
            else
                {
                general.displayError(r.error);
                }

            });

            return false;
        });


        //catching window resizes
        var resizeTimer = null;
        $(window).bind('resize', function() {
        if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(logging.reInitJSP,100);
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

        logging.data.username = username;
        logging.data.avatar = new_avatar;
        logging.data.role = role;

        $('#TopContainer').html(general.render('loginTopBar',logging.data));
        $('#Login').fadeOut(function(){
          $('#MainContainer').fadeIn();
          $('#TopContainer').fadeIn();
          logging.getMessages();
          logging.getUsers();
          logging.getHandles();
          logging.getTickets();
          logging.getFeedback();
        });
    },

    // This method requests the latest messages
    // (since last_id,timestamp), and adds them to the page. currently 24 hours past messages

    getMessages : function(){
        $.tzPOST('getMessages',{last_id:logging.data.lastID,date_and_time:Math.round(new Date().getTime()/1000-23*3600)},function(r){
        //update messages from mysql db
            if(!r.error)
            {
            for(var i=0;i<r.length;i++){
                logging.addMessageLine(r[i]);
            }
            //if new messages, update to lastid
            //message.data.noActivity is reset, so next update in 1 second

            if(r.length){
                logging.data.noActivity = 0;
                logging.data.lastID = r[i-1].id;
                }
            else{
                // If no messages were received, increment
                // the noActivity counter.

                logging.data.noActivity++;
            }
            //if no chats exist yet
            if(!logging.data.lastID){
                logging.data.jspAPIMeldingen.getContentPane().html('<p class="noMessages">No messages yet</p>');
            }

            // Setting a timeout for the next request,
            // depending on the message activity:

            var nextRequest = 1000;

            // 2 seconds
            if(logging.data.noActivity > 3){
                nextRequest = 2000;
            }

            if(logging.data.noActivity > 10){
                nextRequest = 5000;
            }

            // 15 seconds
            if(logging.data.noActivity > 20){
                nextRequest = 15000;
            }
            }
            else
            {
                general.displayError(r.error);
                var nextRequest = 1000;
            }

            logging.data.idMessagesTimeout=setTimeout("logging.getMessages();",nextRequest);

        });
    },


    searchMessages : function(keyword){
        $.tzPOST('searchMessages',{keyword:keyword},function(r){
        //update messages from mysql db
          if(r.length>0)
          {
            if(!r.error)
            {
              logging.data.jspAPIMeldingen.getContentPane().empty();
              for(var i=0;i<r.length;i++){
                logging.addMessageLine(r[i]);
              }

            }
            else
            {
                general.displayError(r.error);
            }
          }
          else
          {
            logging.data.jspAPIMeldingen.getContentPane().html('<p class="noMessages">No messages found</p>');
          }

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

        if(!logging.data.lastID){
            // If this is the first chat, remove the
            // paragraph saying there aren't any:

            $('#MeldingenList p').remove();
        }

        //If this isn't a temporary chat:
        if(params.id.toString().charAt(0) != 't'){
            var previous = $('#MeldingenList .message-'+(+params.id - 1));
            if(previous.length){
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

// Requesting a list with all the users.

    getUsers : function(){

        $.tzPOST('getUsers',{options:'logged'},function(r){
            if(!r.error)
                {
                  logging.data.jspAPIUsers.getContentPane().empty();
                  var users = [];
                  var markup;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('user',r[i]);
                        logging.data.jspAPIUsers.getContentPane().append(markup);
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

                  logging.data.jspAPIUsers.getContentPane().append('<p class="count">'+message+'</p>');

                  logging.data.jspAPIUsers.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
                setTimeout("logging.getUsers();",15000);

            });
    },
            // Requesting a list with all the handles

    getHandles : function(){
        $.tzPOST('getGroups',{recursive:'true'},function(r){
            if(!r.error)
                {
                logging.data.jspAPIHandles.getContentPane().empty();

                var markup_group;
                var markup_handle;
                for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup_group=general.render('groups',r[i]);
                        logging.data.jspAPIHandles.getContentPane().append(markup_group);
                        if (!(typeof r[i]['handles'] === 'undefined')) {
                          for (var j = 0; j < r[i]['handles'].length; j++) {
                            markup_handle=general.render('handles',r[i]['handles'][j]);
                            logging.data.jspAPIHandles.getContentPane().append(markup_handle);
                          }
                        }
                    }
                }

                //empty no groups

                if(r.length<1){
                    var message = 'No groups exist';
                    logging.data.jspAPIHandles.getContentPane().append('<p class="count">'+message+'</p>');
                }
                logging.data.jspAPIHandles.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
                setTimeout("logging.getHandles();",60000);
            });

    },

    getTickets : function(){
        $.tzPOST('getTicketList',{recursive : false, status : [{1: 'Open', 2: 'Nieuw'}]},function(r){
            if(!r.error)
                {
                logging.data.jspAPITickets.getContentPane().empty();

                var markup;
                var markup_extra;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('parentticket',r[i]);
                        logging.data.jspAPITickets.getContentPane().append(markup);
                        if (r[i].id == logging.data.selectedticket) {
                            markup_extra=general.render('parentticket_expanded',r[i]);
                            logging.data.jspAPITickets.getContentPane().append(markup_extra);
                          }
                    }
                  }
                //empty no tickets

                  if(r.length<1){
                    var message = 'No tickets exist';
                    logging.data.jspAPITickets.getContentPane().append('<p class="count">'+message+'</p>');
                    }
                logging.data.jspAPITickets.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
                logging.data.idTicketTimeout=setTimeout("logging.getTickets();",15000);

        });

    },

    getFeedback : function(){
        $.tzPOST('getFeedback',function(r){
          if(r){
            if(!r.error)
                {
                logging.data.jspAPIFeedback.getContentPane().empty();

                var markup;
                var markup_extra;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('feedback',r[i]);
                        logging.data.jspAPIFeedback.getContentPane().append(markup);
                        if (r[i].id == logging.data.selectedfeedback) {
                            markup_extra=general.render('feedback_expanded',r[i]);
                            logging.data.jspAPIFeedback.getContentPane().append(markup_extra);
                          }
                    }
                  }
                //empty no feedback

                  if(r.length<1){
                    var message = 'No feedback exist';
                    logging.data.jspAPIFeedback.getContentPane().append('<p class="count">'+message+'</p>');
                    }
                logging.data.jspAPIFeedback.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
          }
          logging.data.idFeedbackTimeout=setTimeout("logging.getFeedback();",15000);

        });

    },

  reInitJSP : function(){
            logging.data.jspAPIMeldingen.reinitialise();
            logging.data.jspAPIUsers.reinitialise();
            logging.data.jspAPIHandles.reinitialise();
            logging.data.jspAPITickets.reinitialise();
            logging.data.jspAPIFeedback.reinitialise();
  }
};
//end of logging var