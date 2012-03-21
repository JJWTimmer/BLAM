$(document).ready(function(){

  // Run the init method on document ready:

  ticketing.init();

});

var Timeout= new Array();

var ticketing = {

  // data holds variables for use in the class:

  data : {
    HandlelistVisible : 1,
    SearchTicketsVisible : 0,
    selectTicketLoaded : false,
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
    
    ticketing.data.jspAPISearchTickets = $('#SearchTicketsList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
      }).data('jsp');
      
    ticketing.data.jspAPITicketDetails = $('#TicketDetailsList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
    	}).data('jsp');
               
      user = new User("TopBar");
      message = new Message(ticketing.data.jspAPIMeldingen);
      chat = new Chat(ticketing.data.jspAPIChats);
      handle = new Handle(ticketing.data.jspAPIHandles);
      ticketNew = new Ticket(ticketing.data.jspAPINewTickets,[{1: 'Nieuw'}],0);
      ticketOpen = new Ticket(ticketing.data.jspAPIOpenTickets,[{1: 'Open'}],0);
      ticketClosed = new Ticket(ticketing.data.jspAPIClosedTickets,[{1: 'Gesloten'}],1);
      ticketSearch = new Ticket(ticketing.data.jspAPISearchTickets,[{1: 'Open', 2: 'Nieuw', 3: 'Gesloten'}],0);
      ticketSelect = new Ticket("",[{1: 'Open', 2: 'Nieuw', 3: 'Gesloten'}],0);
      //display = new Display ($('#TicketDetailsList'));
      display = new Display (ticketing.data.jspAPITicketDetails);
      updatefeedback = new UpdateAndFeedback("","");
           	
      	//function to implement getting previous messages from db
      	$('#MeldingenList .retrieve_previous').live('click', function(){
          if(!working)
          	{
          		working = true;
          		message.getOldMessages();
          	}
          	working = false;
        });
      
      	//function to implement getting previous messages from db
      	$('#WL-ChatList .retrieve_previous').live('click', function(){
          if(!working)
          	{
          		working = true;
          		chat.getOldChats();
          	}
          	working = false;
         });
         
        //function to implement getting previous tickets from db
      	$('#NewTicketsList .retrieve_previous_ticket').live('click', function(){
          if(!working)
          	{
          		working = true;
          		ticketNew.getOldTickets();
          	}
          	working = false;
        });
      
        //function to implement getting previous tickets from db
      	$('#OpenTicketsList .retrieve_previous_ticket').live('click', function(){
          if(!working)
          	{
          		working = true;
          		ticketOpen.getOldTickets();
          	}
          	working = false;
        });

        //function to implement getting previous tickets from db
      	$('#ClosedTicketsList .retrieve_previous_ticket').live('click', function(){
          if(!working)
          	{
          		working = true;
          		ticketClosed.getOldTickets();
          	}
          	working = false;
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
          }
          working=false;
        });

				$('#searchtickets_toggle_button').live('click', function(){
          if(!working)
          {
              working = true;
              if(ticketing.data.SearchTicketsVisible==1)
              {
              $('#SearchTickets').css('display','none');
              $('#NewTickets').css('display','block');
              $('#OpenTickets').css('display','block');
              $('#ClosedTickets').css('display','block');
              $('#searchtickets_toggle_button').attr('value','Tickets zoeken aan');
              ticketing.data.SearchTicketsVisible=0;
              }
              else
              {
              $('#SearchTickets').css('display','block');
              $('#NewTickets').css('display','none');
              $('#OpenTickets').css('display','none');
              $('#ClosedTickets').css('display','none');
              $('#searchtickets_toggle_button').attr('value','Tickets zoeken uit');
              ticketing.data.SearchTicketsVisible=1;
              }
              ticketing.reInitJSP();
          }
          working=false;
        });

        //function to implement clicking on dynamic element groups
        $('#Handles .list_item_first').live('click', function(){
          if(!working)
          {
            working = true;
            var groupid=$(this).attr("id");
            if($(this).attr('visible')==0){
                $(this).attr('visible','1');
                $(".list_item_second").each(function(i) {
                if($(this).hasClass(groupid))
                  {
                  $(this).fadeIn();

                  }
                });
            }
            else
            {
                $(this).attr('visible','0');
                $(".list_item_second").each(function(i) {
                if($(this).hasClass(groupid))
                  {
                  $(this).fadeOut();
                  }
                });
            }       
          }
          working=false;
          ticketing.data.jspAPIHandles.reinitialise();
        });


        $('#search_handles').keyup(function (e) {
						handle.searchHandles($('#search_handles').val());
        });

        //function to implement clicking on thickbox link
        $('#openmodalbutton').live('click', function(){
          general.tb_open_new('UpdatesAndFeedbacks.html?&KeepThis=true&height=500&width=800');
        });

        // Submitting a new chat entry:
        $('#submitForm').submit(function(){
            var text = $('#Chattext').val();
            if(text.length == 0){
                return false;
            }
            if(!working)
          	{
          		working = true;
	            chat.submitChat(text);
    				}
    				working = false;
    				return false;
        });

				// Search for a certain keyword:
        $('#Searchsubmit').bind('click',function(){
        		ticketSearch.searchTicket();
        });


				//function to implement clicking on ticket to get details
        $('div.parent_ticket').live('click', function(){
          if(!working)
          	{
          		working = true;
          		if($(this).attr("id")!=ticketing.data.selectedticket)
            	{
            		ticketing.data.selectedticket=$(this).attr("id");
            		ticketing.data.selectedparentticket=0;
            	}
          		display.showTicketDetail(ticketing.data.selectedticket,0);
        		}
        		working = false;
        });

        //function to implement clicking on child ticket to get details
        $('div.child_ticket').live('click', function(){
        	  if(!working)
          	{
          		working = true;
          		if($(this).attr("id")!=ticketing.data.selectedticket)
            	{
            		ticketing.data.selectedticket=$(this).attr("id");
            		ticketing.data.selectedparentticket=$(this).attr("title");
            	}
          		display.showTicketDetail(ticketing.data.selectedticket,$(this).attr("title"));
          	}
          	working = false;
        });

				//function to implement clicking on claim
        $('div.list_item_parent_ticket_claim').live('click', function(){
        	 if(!working)
          	{
          		working = true;
          		$.tzPOST('setTicketOwner',{id:$(this).attr("id")},function(r){
          			ticketNew.refreshTickets();
          			ticketOpen.refreshTickets();
          		});
          		display.showTicketDetail($(this).attr("id"),0);
          	}
          	working = false;  	
        });
        
				//function to implement filling the ticket selector (for linking to a parent ticket)
				$('#become_Ticket').live('click', function()
				{
						if(ticketing.data.selectTicketLoaded == false && ticketing.data.selectedparentticket==0)
						{			    	
					  	ticketSelect.fillTicket($('#become_Ticket'),ticketing.data.selectedticket,ticketing.data.selectedparentticket);			
					    ticketing.data.selectTicketLoaded = true;
					  }		
				});

      // add listener for this button and change ticket details
      $('#saveticketbutton').live('click',function(){
            $.tzPOST('changeTicketDetails',{id:ticketing.data.selectedticket,title:$('#ticket_title').val(),text:$('#ticket_text').val(),location:$('#ticket_location').val(),solution:$('#ticket_oplossing').val(),handle_id:$('#ticket_Handle').val(),reference:$('#ticket_reference').val()},function(r){
              if(r==null){}
              else
              {
                general.displayError(r.error);
              }
            });

            if(!($('#ticket_status').val()=="Nieuw") && !($('#ticket_status').val()=="Subticket")){
              $.tzPOST('changeTicketOwner',{id:ticketing.data.selectedticket,user_id:$('#owner').val()},function(r){
                if(r==null){ display.clearDisplay();}
                else
                {
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
      $('#closeticketbutton').live('click',function(){
              $.tzPOST('changeTicketDetails',{id:ticketing.data.selectedticket,title:$('#ticket_title').val(),text:$('#ticket_text').val(),location:$('#ticket_location').val(),solution:$('#ticket_oplossing').val(),handle_id:$('#ticket_Handle').val(),reference:$('#ticket_reference').val()},function(r){
              if(r==null){}
              else
              {
                general.displayError(r.error);
              }
            });

            if(!($('#ticket_status').text()=="Nieuw") && !($('#ticket_status').text()=="Subticket")){
              $.tzPOST('changeTicketOwner',{id:ticketing.data.selectedticket,user_id:$('#owner').val()},function(r){
                if(r==null){}
                else
                {
                  general.displayError(r.error);
                }
              });
            }


            $.tzPOST('closeTicket',{id:ticketing.data.selectedticket},function(r){
              if(r==null){}
              else
              {
                general.displayError(r.error);
              }
            });
      	ticketOpen.refreshTickets();
        ticketClosed.refreshTickets();
        general.displaySaved("Saved Ticket: " + $('#ticket_title').val());
        display.clearDisplay();
      });

      // add listener for this button and change to childticket of certain parentticket
      $('#childticketbutton').live('click',function(){
            $.tzPOST('becomeChildTicket',{id:ticketing.data.selectedticket,parent_id:$('#become_Ticket').val()},function(r){
              if(r==null){}
              else
              {
                general.displayError(r.error);
              }
            });
        ticketing.data.selectedticket=0;
        ticketing.data.selectedparentticket=0;
        
        ticketNew.refreshTickets();
      	ticketOpen.refreshTickets();
        ticketClosed.refreshTickets();
        display.clearDisplay();
      });

      // add listener for this button and change to parentticket
      $('#becomeparentticketButton').live('click',function(){
            $.tzPOST('becomeParentTicket',{id:ticketing.data.selectedticket},function(r){
              if(r==null){}
              else
              {
                general.displayError(r.error);
              }
            });
            ticketing.data.selectedticket=0;
        		ticketing.data.selectedparentticket=0;
        		
            ticketNew.refreshTickets();
          	ticketOpen.refreshTickets();
            ticketClosed.refreshTickets();
            display.clearDisplay();
      });

      // add listener for this button and add an update
      $('#saveupdatebutton').live('click',function(){
        if(!working)
          	{
          		working = true;
        			updatefeedback.saveUpdate($('#ticket_update'));
        		}
        working = false;
      });


        $('#savefeedbackbutton').live('click',function(){
        	if(!working)
          	{
          		working = true;
        			updatefeedback.saveFeedback($('#ticket_feedback'));
        		}
        	working = false;
        });

				// Logging a person into blam:
        $('#loginForm').submit(function(){
            if(!working)
          	{
          	working = true;
            	// Using our tzPOST wrapper function (defined in the bottom):
            	//$(this).serialize encodes all the name form elements to be used by php
            	$.tzPOST('login',$(this).serialize(),function(r){
                if(r.error){
                    general.displayError(r.error);
                }
                else
                {
                    ticketing.login(r.username,r.avatar,r.role);
                }
            	});
          	}
            working = false;
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
        user.setUser(username,new_avatar,role);
        $('#TopContainer').html(general.render('ticketing-loginTopBar',ticketing.data));
        $('#Login').fadeOut(function(){
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
        });
    },

    TicketDetailTickets : function(ticketstatus,ticket_id,parent_id){
    
    },

  killTimeouts : function(){
  					message.kill();
  					chat.kill();
  					user.kill();
  					handle.kill();
  					ticketNew.kill();
          	ticketOpen.kill();
          	ticketClosed.kill();
          	
  },

  reInitJSP : function(){
            ticketing.data.jspAPIMeldingen.reinitialise();
            ticketing.data.jspAPIChats.reinitialise();
            ticketing.data.jspAPIHandles.reinitialise();
            ticketing.data.jspAPINewTickets.reinitialise();
            ticketing.data.jspAPIOpenTickets.reinitialise();
            ticketing.data.jspAPIClosedTickets.reinitialise();
            ticketing.data.jspAPISearchTickets.reinitialise();
            ticketing.data.jspAPITicketDetails.reinitialise();
  }

};
