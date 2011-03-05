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

        $('#TopContainer').html(general.render('loginTopBar',ticketing.data));
        $('#Login').fadeOut(function(){
          $('#MainContainer').fadeIn();
          $('#TopContainer').fadeIn();
          ticketing.getMessages();
          //ticketing.getUsers();
          //ticketing.getHandles();

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

  reInitJSP : function(){
            ticketing.data.jspAPIMeldingen.reinitialise();

  }

};
