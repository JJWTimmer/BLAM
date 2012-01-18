$(document).ready(function(){

  // Run the init method on document ready:
  logging.init();

});

var Timeout= new Array();

var logging = {

  // data holds variables for use in the class:

    data : {
        groupsLoaded : false
    },

    // Init binds event listeners and sets up timers:

    init : function(){

        // add listener for message submitbutton
        $('#submitbutton').bind('click',function(){
        $('#submitForm').submit();
        });
        
        // add listener for search button
        $('#searchbutton').bind('click',function(){
        $('#searchForm').submit();
        });

				// add listener for restart getMessages button
        $('#messageButton').bind('click',function(){
          message.refreshMessages();       
          
          $('#messageButton').hide();
          return false;
        });
        
        $('#autotextbutton').bind('click',function(){
          $('#messagetext').val($('#messagetext').val()+$('#autotext_Handle').val()+ ' ');
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
				
				//setting up message 'class'
				message = new Message(logging.data.jspAPIMeldingen);
				user = new User(logging.data.jspAPIUsers);
				handle = new Handle(logging.data.jspAPIHandles);
				ticket = new Ticket(logging.data.jspAPITickets,[{1: 'Open', 2: 'Nieuw'}]);
				feedbackOpen = new UpdateAndFeedback(logging.data.jspAPIOpenFeedback,'false');
				feedbackClosed = new UpdateAndFeedback(logging.data.jspAPIClosedFeedback,'true');
				display = new Display(logging.data.jspAPIDisplay);
				
				//function to implement clicking on message
        $('div.message').live('click', function(){
          $('#messagetext').val($(this).find("span").text());
          $('#submitbutton').hide();
          $('p.label_checkbox_pair').hide();
          $('#updatebutton').show();
          $('#cancelbutton').show();
          logging.data.selectedmessage=$(this).attr("id");
        });

        $('#cancelbutton').bind('click',function(){
          $('#messagetext').val('');
          $('#submitbutton').show();
          $('p.label_checkbox_pair').show();
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
                  $('#messagetext').val('');
                  $('#submitbutton').show();
                  $('p.label_checkbox_pair').show();
                  $('#updatebutton').hide();
                  $('#cancelbutton').hide();
                  logging.data.selectedmessage=0;
                  message.refreshMessages();
                }
              });
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
        
				//function to search through handles
        $('#search_handles').keyup(function (e) {
            handle.searchHandles($('#search_handles').val());
        });
        
        //function to implement clicking on dynamic element ticket
        $('div.list_item_parent_ticket_full').live('click', function(){
				display.showTicket($(this).attr("id"));				
				});

				//function to implement clicking on dynamic element openfeedback
        $('div.list_item_openfeedback').live('click', function(){
				display.showOpenFeedback($(this).attr("id"));				
				});
				
				//function to implement clicking on dynamic element closedfeedback
        $('div.list_item_closedfeedback').live('click', function(){
				display.showClosedFeedback($(this).attr("id"));				
				});
				
				//function to implement clicking on close feedback
        $('#closefeedback').live('click', function(){
          feedbackOpen.closeFeedback($(this).closest("div").attr("id"));
        });

				// Searching for messages:
        $('#searchForm').submit(function(){
            var keyword = $('#keyword').val();
            if(keyword)
            {
              if(working) return false;
                working = true;
              window.clearTimeout(Timeout["Messages"]);
              $('#messageButton').show();
              message.searchMessages(keyword);
              $('#keyword').val('');
              working = false;
            }
            return false;
        });
        
         // Submitting a new message entry:
        $('#submitForm').submit(function(){
            var text = $('#messagetext').val();
            if(text.length == 0){
                return false;
            }
            if(working) return false;
            working = true;
						message.submitMessage(text);
            working = false;
            return false;
        });

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

    // The login function is called when the user succesfully logs in
        login : function(username,avatar,role){
        //replace empty avatar field
        var new_avatar=avatar;
        if((avatar=="") || (avatar=="NULL"))
        {
        new_avatar="unknown30x30.png";
        }
       
        user.setUser(username,new_avatar,role);
       
        $('#TopContainer').html(general.render('logging-loginTopBar',logging.data));
        $('#Login').fadeOut(function(){
          $('#MainContainer').fadeIn();
          $('#TopContainer').fadeIn();
          
          message.getMessages();
          user.getUsers();
          handle.getHandles();
          ticket.getTickets();
          feedbackOpen.getFeedback();
          feedbackClosed.getFeedback();
          //get rid of ugly startdisplay
          logging.data.jspAPIDisplay.reinitialise();
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
            logging.data.jspAPIDisplay.reinitialise();
  }
};
//end of logging var