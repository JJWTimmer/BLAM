function Message (pane) {
	//constructor
	var self = this;
	var pane = pane;
	var noActivity = 0;
	var lastID = 1;
  
	// function to retrieve new messages from database
	// (since last_id,timestamp) currently 2 hours past messages		
	// uses pane to determine where to put messages
		this.getMessages = function(){
				//timestamp uses 2 hours (120 min)
        $.tzPOST('getMessages',{last_id:lastID,date_and_time:general.generateTimestamp(120)},function(r){
        //update messages from mysql db
          if(r)
          {
            if(!r.error)
            {
            	for(var i=0;i<r.length;i++){
                self.addMessageLine(r[i]);
            	}
									
            	// bata-123 and arts-1 formats.
            	//general.highlightHandles(this.pane.getContentPane(), logging.data.groups);

            	//if new messages, update to lastid
            	//message.data.noActivity is reset, so next update in 1 second
            	if(r.length){
              	noActivity = 0;
                lastID = r[i-1].id;
              }
            	else{
                // If no messages were received, increment
                // the noActivity counter.
                noActivity++;
            	}
							
            	//if no messages exist yet
            	if($("#MeldingenList .jspContainer .jspPane > div").length==0 && $("#MeldingenList .jspContainer .jspPane > p").length==0){
                pane.getContentPane().html('<p class="noMessages">Nog geen meldingen</p>');
                pane.reinitialise();
            	}

            	if($("#MeldingenList .jspContainer .jspPane > div").length > 0 && $("#MeldingenList .jspContainer .jspPane > p").length > 0){
              	// If this is the first melding, remove the
              	// paragraph saying there aren't any:
              	$('#MeldingenList .jspContainer .jspPane > p').remove();
            	}

            	// Setting a timeout for the next request,
            	// depending on the message activity:

            	var nextRequest = 1000;

            	if(noActivity > 3){
                nextRequest = 2000;
            	}

            	if(noActivity > 10){
                nextRequest = 5000;
            	}

	           	if(noActivity > 20){
                nextRequest = 15000;
            	}
            }
            else
            {
                general.displayError(r.error);
                var nextRequest = 1000;
            }
            Timeout["Messages"]=setTimeout("message.getMessages();",nextRequest);
          }
          else
          {
          pane.getContentPane().html('<p class="noMessages">Nog geen meldingen</p>');
          }
        });
  	};

		this.searchMessages = function(keyword){
        $.tzPOST('searchMessages',{keyword:keyword},function(r){
        //update messages from mysql db
          if(r.length>0)
          {
            if(!r.error)
            {
              pane.getContentPane().empty();
              for(var i=0;i<r.length;i++){
                self.addMessageLine(r[i]);
              }

            }
            else
            {
                general.displayError(r.error);
            }
          }
          else
          {
            pane.getContentPane().html('<p class="noMessages">No messages found</p>');
          }

        });
    };

		

		// The addMessageLine function adds a message entry to the page
		// uses pane to determine where to put messages
    this.addMessageLine = function(params){

        if((params.avatar=="") || (params.avatar=="NULL") || (params.avatar==null))
        {
        params.avatar="unknown24x24.png"
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
                previous.before(markup);
            }
            else pane.getContentPane().prepend(markup);
        }
        else pane.getContentPane().prepend(markup);

        // As we added new content, we need to
        // reinitialise the jScrollPane plugin:
        pane.reinitialise();
        pane.scrollToBottom(true);

    };
    
    this.submitMessage = function(messagetext){
            // Assigning a temporary ID to the chat:
            var tempID = 't'+Math.round(Math.random()*1000000),

            params = {
                    id : tempID,
                    username: user.getUsername(),
                    avatar  : user.getAvatar(),
                    text    : messagetext.replace(/</g,'&lt;').replace(/>/g,'&gt;')
                };

            // Using our addMessageLine method to add the message
            // to the screen immediately, without waiting for
            // the AJAX request to complete:
            self.addMessageLine($.extend({},params));
						var inputcheckbox = $('#ticket:checked').val();

            // Using our tzPOST wrapper method to send the message
            // via a POST AJAX request:
            
            if(inputcheckbox!=undefined)
                {
              		var ticket_en='on';
              	}
            else
            		{
            			var ticket_en='';
            		}
                        
            $.tzPOST('addMessage',{text:messagetext,ticket:ticket_en},function(r){
            if(!r.error){
                //empty input form textbox
                $('#messagetext').val('');
                if(inputcheckbox!=undefined)
                {
                	$('#ticket').attr('checked',false);
                	window.clearTimeout(Timeout["Tickets"]);
                
                	//temporarily not available
                	ticket.getTickets();
                }
                
                //remove old temporary message
                $('div.message-'+tempID).remove();
                //insert newly received ID
                params['id'] = r.id;
                self.addMessageLine($.extend({},params));
            }
            
            else
                {
                	general.displayError(r.error);
                }
            });
  	
  	
  	};
  	
  	this.refreshMessages = function(){
        lastID=1;
        pane.getContentPane().empty();
        self.getMessages();
    };


}
