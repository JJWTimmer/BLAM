$(document).ready(function(){

  // Run the init method on document ready:
  logging.init();

});

var Timeout= new Array();

var logging = {

  // data holds variables for use in the class:

    data : {
        lastID    : 1,
        noActivity  : 0,
        groupsLoaded : false
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

        $('#autotextbutton').bind('click',function(){
          $('#messagetext').val($('#messagetext').val()+$('#autotext_Handle').val()+ ' ');
        });

        //function to implement clicking on close feedback
        $('#closefeedback').live('click', function(){
          $.tzPOST('closeFeedback',{id:$(this).closest("div").attr("id")},function(r){
            window.clearTimeout(Timeout["Feedbacks"]);
            Timeout["Feedbacks"]=setTimeout("logging.getFeedback();",1000);
          });
        });

        //function to implement clicking on message
        $('div.message').live('click', function(){
          $('#messagetext').val($(this).find("span").text());
          $('#submitbutton').hide();
          $('#updatebutton').show();
          $('#cancelbutton').show();
          logging.data.selectedmessage=$(this).attr("id");
        });

        $('#cancelbutton').bind('click',function(){
          $('#messagetext').val('');
          $('#submitbutton').show();
          $('#updatebutton').hide();
          $('#cancelbutton').hide();
          logging.data.selectedmessage=0;
        });

        $('#updatebutton').bind('click',function(){
          $.tzPOST('updateMessage',{id:logging.data.selectedmessage,text:$('#messagetext').val()},function(r){
              if(r.error){
                    general.displayError(r.error);
                }
                else    {
                  $('#messagetext').val()="";
                  $('#submitbutton').show();
                  $('#updatebutton').hide();
                  $('#cancelbutton').hide();
                  logging.data.selectedmessage=0;
                }
              });
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

        logging.data.jspAPIOpenFeedback = $('#OpenFeedbackList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
        }).data('jsp');

        logging.data.jspAPIClosedFeedback = $('#ClosedFeedbackList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
        }).data('jsp');

        logging.data.jspAPIDisplay = $('#DisplayList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
        }).data('jsp');



        //function to implement clicking on dynamic element ticket
        $('div.list_item_parent_ticket_full').live('click', function(){
          if($(this).attr("id")!=logging.data.selectedticket)
            {
            logging.data.selectedticket=$(this).attr("id");
            }
          else
            {
            logging.data.selectedticket=0;
            }
          window.clearTimeout(Timeout["Tickets"]);
          logging.getTickets();
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
          logging.data.jspAPIHandles.reinitialise();
        });

        //function to implement clicking on dynamic element handle
        $('div.list_item_handle').live('click', function(){
          $('#messagetext').val($('#messagetext').val()+$(this).children('.list_item_handle_name').text() + '-' + $(this).children('.list_item_handle_description').text());
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


        //function to implement clicking on dynamic element feedback
        $('div.list_item_openfeedback').live('click', function(){
          if($(this).attr("id")!=logging.data.selectedopenfeedback)
            {
            logging.data.selectedopenfeedback=$(this).attr("id");
            }
          else
            {
            logging.data.selectedopenfeedback=0;
            }
          window.clearTimeout(Timeout["Feedbacks"]);
          logging.getFeedback();
        });


        //function to implement clicking on dynamic element feedback
        $('div.list_item_closedfeedback').live('click', function(){
          if($(this).attr("id")!=logging.data.selectedclosedfeedback)
            {
            logging.data.selectedclosedfeedback=$(this).attr("id");
            }
          else
            {
            logging.data.selectedclosedfeedback=0;
            }
          window.clearTimeout(Timeout["Feedbacks"]);
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
            logging.killTimeouts();
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
              window.clearTimeout(Timeout["Messages"]);
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
                //empty input form textbox
                $('#messagetext').val('');
                if(inputcheckbox!=undefined)
                {
                $('#ticket').attr('checked',false);
                window.clearTimeout(Timeout["Tickets"]);
                logging.getTickets();
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
            working = false;
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

        $('#TopContainer').html(general.render('logging-loginTopBar',logging.data));
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
        //timestamp uses 2 hours (120 min)
        $.tzPOST('getMessages',{last_id:logging.data.lastID,date_and_time:general.generateTimestamp(120)},function(r){
        //update messages from mysql db
          if(r)
          {
            if(!r.error)
            {
            for(var i=0;i<r.length;i++){
                logging.addMessageLine(r[i]);
            }

            // bata-123 and arts-1 formats.
            general.highlightHandles(logging.data.jspAPIMeldingen.getContentPane(), logging.data.groups);

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

            //if no messages exist yet
            if($("#MeldingenList .jspContainer .jspPane > div").length==0 && $("#MeldingenList .jspContainer .jspPane > p").length==0){
                logging.data.jspAPIMeldingen.getContentPane().html('<p class="noMessages">Nog geen meldingen</p>');
                logging.data.jspAPIMeldingen.reinitialise();
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


            Timeout["Messages"]=setTimeout("logging.getMessages();",nextRequest);
          }
          else
          {
          logging.data.jspAPIMeldingen.getContentPane().html('<p class="noMessages">Nog geen meldingen</p>');
          }
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

        if((params.avatar=="") || (params.avatar=="NULL") || (params.avatar==null))
        {
        params.avatar="img/unknown24x24.png"
        }

        var d = new Date();

        if(params.created) {
          params.time = general.stripToTime(params.created);
        }
        else
        {
          params.time=(d.getHours() < 10 ? '0' : '' ) + d.getHours()+':'+(d.getMinutes() < 10 ? '0':'') + d.getMinutes();
        }

        var markup = general.render('messageLine',params),
            exists = $('#MeldingenList .message-'+params.id);

        if(exists.length){
            exists.remove();
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
                Timeout["Users"]=setTimeout("logging.getUsers();",15000);

            });
    },
            // Requesting a list with all the handles

    getHandles : function(){
        $.tzPOST('getGroups',{recursive:'true'},function(r){
            if(r){
              if(!r.error)
                {
                //save groups and handles for later use
                logging.data.groups = r;
                logging.data.groupsLoaded = true;

                logging.data.jspAPIHandles.getContentPane().empty();
                //logging.data.jspAPIHandles.getContentPane().append('<input type="text" class="rounded" value="" id="search_handles">');

                var markup_group;
                var markup_handle;
                $('option', $('#autotext_Handle')).remove();
                var autotext_options = $('#autotext_Handle').attr('options');

                for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup_group=general.render('groups',r[i]);
                        logging.data.jspAPIHandles.getContentPane().append(markup_group);
                        if (!(typeof r[i]['handles'] === 'undefined')) {
                          for (var j = 0; j < r[i]['handles'].length; j++) {
                            r[i]['handles'][j].groupid=r[i].id;
                            markup_handle=general.render('handles',r[i]['handles'][j]);
                            logging.data.jspAPIHandles.getContentPane().append(markup_handle);
                            autotext_options[autotext_options.length] = new Option(r[i]['handles'][j].handle_name + ' - ' + r[i]['handles'][j].description);

                          }
                        }
                    }
                }

                //empty no groups

                logging.data.jspAPIHandles.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
            }
            else
            {
            var message = 'Geen voertuigen';
            logging.data.jspAPIHandles.getContentPane().append('<p class="count">'+message+'</p>');
            logging.data.jspAPIHandles.reinitialise();
            }
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
                            logging.data.jspAPIDisplay.getContentPane().empty();
                            markup_extra=general.render('parentticket_expanded',r[i]);
                            logging.data.jspAPIDisplay.getContentPane().append(markup_extra);
                          }
                    }
                  }
                //empty no tickets

                  if(r.length<1){
                    var message = 'Geen tickets';
                    logging.data.jspAPITickets.getContentPane().append('<p class="count">'+message+'</p>');
                    }
                logging.data.jspAPITickets.reinitialise();
                logging.data.jspAPIDisplay.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
                Timeout["Tickets"]=setTimeout("logging.getTickets();",15000);

        });

    },

    getFeedback : function(){
        $.tzPOST('getFeedback',{},function(r){
          if(r){
            if(!r.error)
                {
                logging.data.jspAPIOpenFeedback.getContentPane().empty();
                logging.data.jspAPIClosedFeedback.getContentPane().empty();

                var markup;
                var markup_extra;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                      if(r[i].called==null)
                        {
                          markup=general.render('openfeedback',r[i]);
                          logging.data.jspAPIOpenFeedback.getContentPane().append(markup);
                          if (r[i].id == logging.data.selectedopenfeedback) {
                            logging.data.jspAPIDisplay.getContentPane().empty();
                            markup_extra=general.render('openfeedback_expanded',r[i]);
                            logging.data.jspAPIDisplay.getContentPane().append(markup_extra);
                          }
                        }
                      else
                        {
                          markup=general.render('closedfeedback',r[i]);
                          logging.data.jspAPIClosedFeedback.getContentPane().append(markup);
                          if (r[i].id == logging.data.selectedclosedfeedback) {
                            logging.data.jspAPIDisplay.getContentPane().empty();
                            markup_extra=general.render('closedfeedback_expanded',r[i]);
                            logging.data.jspAPIDisplay.getContentPane().append(markup_extra);
                          }
                        }
                    }
                  }
                //empty no feedback

                  if(r.length<1){
                    var message = 'Geen terugmeldingen';
                    logging.data.jspAPIOpenFeedback.getContentPane().append('<p class="count">'+message+'</p>');
                    logging.data.jspAPIClosedFeedback.getContentPane().append('<p class="count">'+message+'</p>');
                    }
                logging.data.jspAPIOpenFeedback.reinitialise();
                logging.data.jspAPIClosedFeedback.reinitialise();
                logging.data.jspAPIDisplay.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
          }
          Timeout["Feedbacks"]=setTimeout("logging.getFeedback();",15000);

        });

    },

  killTimeouts : function(){
            for (key in Timeout)
            {
              clearTimeout(Timeout[key]);
            }
  },


  reInitJSP : function(){
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