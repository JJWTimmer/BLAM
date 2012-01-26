function Chat (pane) {
	//constructor
	var self = this;
	var pane = pane;
	var noActivity = 0;
	var firstID = 0;
	var lastTimestamp="";
	var TimeOut = null;
		
	
	// This method requests the latest chats
  // (since last_id,timestamp), and adds them to the page. currently 2 hours past chats

		this.getChats = function(){
        $.tzPOST('getChats',{timestamp_last_update:lastTimestamp},function(r){
        	
        		//update chats from mysql db
            if(!r.error)
            {
            	//alert(r[0].query);
            	if(lastTimestamp=="" && r.length>1)
            	{	
            		pane.getContentPane().html('<div class="retrieve_previous rounded"><p align="center">Haal oudere berichten op...</p></div>');
            		pane.reinitialise();
            	}
            	
            	lastTimestamp=r[0].timestamp;
            	for(var i=1;i<r.length;i++){
               self.addChatLine(r[i]);
               if(r[i].id<firstID)
								{
									firstID=r[i].id;
								}
            	}
            	//if new chat, update to lastid
            	if(r.length>1){
                noActivity = 0;
                pane.scrollToBottom(true);
                lastID = r[i-1].id;
                if(firstID==0)
                {
                	firstID=r[1].id;
                }
            	}
            	else{
                // If no chats were received, increment
                // the noActivity counter.
                noActivity++;
            	}

            	//if no chats exist yet
            	if($("#WL-ChatList .jspContainer .jspPane > div").length==0 && $("#WL-ChatList .jspContainer .jspPane > p").length==0){
                pane.getContentPane().html('<p class="noMessages">Nog geen chats</p>');
                pane.reinitialise();
            	}

            	if($("#WL-ChatList .jspContainer .jspPane > div").length > 0 && $("#WL-ChatList .jspContainer .jspPane > p").length > 0){
              	// If this is the first chat, remove the
              	// paragraph saying there aren't any:
              	$('#WL-ChatList .jspContainer .jspPane > p').remove();
              	pane.reinitialise();
            	}

            	// Setting a timeout for the next request,
            	// depending on the chat activity:

            	var nextRequest = 1000;

            	// 2 seconds
            	if(noActivity > 3){
                nextRequest = 2000;
            	}

            	if(noActivity > 10){
                nextRequest = 5000;
            	}

            	// 15 seconds
            	if(noActivity > 20){
                nextRequest = 15000;
            	}
            }
            else
            {
                general.displayError(r.error);
                var nextRequest = 1000;
            }

            TimeOut=setTimeout(function(){self.getChats();},nextRequest);
            
        });
    };

		this.getOldChats = function(){
			$.tzPOST('getChats',{first_id:firstID},function(r){
				if(r)
          {
            if(!r.error)
            {
            	//alert(r[0].query);
          		for(var i=1;i<r.length;i++){
                self.addChatLine(r[i]);
                if(parseInt(r[i].id)<parseInt(firstID))
								{
									firstID=r[i].id;
								}
            	}
          		if(r[0].limit=='false')
          		{
          			$('#WL-ChatList .retrieve_previous').remove();
          			pane.reinitialise();
          		}
          	}
          	else
            {
                general.displayError(r.error);
            }
					}
			});		
		};

	
		// The addChatLine method adds a chat entry to the page
    this.addChatLine = function(params){
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


        var markup = general.render('messageLine',params),
        exists = $('#WL-ChatList .message-'+params.id);

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
        	 		var previous = $('#WL-ChatList .message-'+(+params.id - 1));
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
	        					var first = $('#WL-ChatList .message-'+(+firstID));
        						first.before(markup);
        	 				}
        	 				else
        	 				{
        	 					//go through the entire list and place it somewhere logically
        	 					var closest;
        						$("#WL-ChatList .message").each(function(i) {
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
    
    this.submitChat = function(chatText){
    	// Assigning a temporary ID to the chat:
      var tempID = 't'+Math.round(Math.random()*1000000),

      params = {
      	id : tempID,
        username: user.getUsername(),
        avatar  : user.getAvatar(),
        text    : chatText.replace(/</g,'&lt;').replace(/>/g,'&gt;')
      };
			      // Using our addChatLine method to add the chat
            // to the screen immediately, without waiting for
            // the AJAX request to complete:
            self.addChatLine($.extend({},params));

            // Using our tzPOST wrapper method to send the message
            // via a POST AJAX request:
            $.tzPOST('addChat',{text:chatText},function(r){
            if(!r.error){
                //empty input form textbox
                $('#Chattext').val('');
                //remove old temporary chat
                $('div.message-'+tempID).remove();
                //insert newly received ID
                params['id'] = r.id;
                self.addChatLine($.extend({},params));
                }
            else
                {
                general.displayError(r.error);
                }
            });
    };
    
    this.kill = function(){
		//alert(TimeOut);
		clearTimeout(TimeOut);
		}
		
}