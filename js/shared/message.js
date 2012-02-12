function Message (pane) {
	//constructor
	var self = this;
	var pane = pane;
	var noActivity = 0;
	var firstID = 0;
	var lastTimestamp="";
	var TimeOut = null;
  
	// function to retrieve new messages from database
	// uses pane to determine where to put messages
		this.getMessages = function(){
        $.tzPOST('getMessages',{timestamp_last_update:lastTimestamp},function(r){
        //update messages from mysql db
          if(r)
          {
            if(!r.error)
            {
            	if(lastTimestamp=="" && r.length>1)
            	{	
            		pane.getContentPane().html('<div class="retrieve_previous rounded"><p align="center">Haal oudere berichten op...</p></div>');
            		pane.reinitialise();
            	}
            	
            	//first record (record 0) is always the timestamp from the server
            	lastTimestamp=r[0].timestamp;
            	for(var i=1;i<r.length;i++){
                self.addMessageLine(r[i]);
								//update first ID if necessary
								if(r[i].id<firstID)
								{
									firstID=r[i].id;
								}
            	}
														
							//general.highlightHandles(pane.getContentPane(), handle.getgroups());
																					
            	//if new messages, update to firstid
            	//message.data.noActivity is reset, so next update in 1 second
            	if(r.length>1){
              	noActivity = 0;
                pane.scrollToBottom(true);
                // bata-123 and arts-1 formats.
                if(firstID==0)
                {
                	firstID=r[1].id;
                }
              }
            	else{
                // If no messages were received, increment the noActivity counter.
                noActivity++;
            	}
							
            	//if no messages exist yet
            	if($("#MeldingenList .jspContainer .jspPane > div").length==0 && $("#MeldingenList .jspContainer .jspPane > p").length==0){
                pane.getContentPane().html('<p class="noMessages">Nog geen meldingen</p>');
                pane.reinitialise();
            	}

							// If this is the first melding, remove the paragraph saying there aren't any:
            	if($("#MeldingenList .jspContainer .jspPane > div").length > 0 && $("#MeldingenList .jspContainer .jspPane > p").length > 0){	 
              	$('#MeldingenList .jspContainer .jspPane > p').remove();
              	pane.reinitialise();
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
            TimeOut=setTimeout(function(){self.getMessages();},nextRequest);
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

		this.getOldMessages = function(){
			$.tzPOST('getMessages',{first_id:firstID},function(r){
				if(r)
          {
            if(!r.error)
            {
            	//alert(r[0].query);
          		for(var i=1;i<r.length;i++){
                self.addMessageLine(r[i]);
                if(parseInt(r[i].id)<parseInt(firstID))
								{
									firstID=r[i].id;
								}
            	}
          		if(r[0].limit=='false')
          		{
          			$('#MeldingenList .retrieve_previous').remove();
          		}
          	}
          	else
            {
                general.displayError(r.error);
            }
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
				
				//check if message already exists --> replace
        if(exists.length){
        		exists.after(markup);
            exists.remove();
        }
        else{
        	 //check for temporary message --> add at end
        	 if(params.id.toString().charAt(0) == 't'){
        	 		pane.getContentPane().append(markup);
        	 }
        	 else
        	 {
        	 		//is there already a message with a id one smaller? --> add after this
        	 		var previous = $('#MeldingenList .message-'+(+params.id - 1));
            	if(previous.length){
            	  	previous.after(markup);
            	} else {
            		//is this the first message? --> append it
            		if(firstID==params.id){
            			pane.getContentPane().append(markup);
            		}
        	 			else
        	 			{
        	 				//has the new message an id that is smaller than first id? --> place before lastid
        	 				if(parseInt(params.id) < parseInt(firstID))
        	 				{
	        					var first = $('#MeldingenList .message-'+(+firstID));
        						first.before(markup);
        	 				}
        	 				else
        	 				{
        	 					//go through the entire list and place it somewhere logically
        	 					var closest;
        						$("#MeldingenList .message").each(function(i) {
        							if(parseInt($(this).attr('id'))<parseInt(params.id))
        								{
        									closest=$(this);
        								}
        						});
        						if(closest){
         	 					closest.after(markup);
         	 					}
         	 					else
         	 					{
         	 						pane.getContentPane().append(markup);
         	 					}
           				}
        	 			}
        	 		}
        	 }	 
        }
        				
        // As we added new content, we need to
        // reinitialise the jScrollPane plugin:
        pane.reinitialise();
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
                	ticket.refreshTickets();
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
  	this.clearMessages = function(){
        firstID = 0;
        pane.getContentPane().empty();
    };
  	
  	this.refreshMessages = function(){
        firstID = 0;
        lastTimestamp="";
        pane.getContentPane().empty();
        self.getMessages();
    };

		this.kill = function(){
		//alert(TimeOut);
		clearTimeout(TimeOut);
		}

}
