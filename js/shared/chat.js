function Chat (pane) {
	//constructor
	var self = this;
	var pane = pane;
	var noActivity = 0;
	var lastID = 1;
		
	
	// This method requests the latest chats
  // (since last_id,timestamp), and adds them to the page. currently 2 hours past chats

		this.getChats = function(){
				var d=new Date();
        //timestamp uses 2 hours (120 min)
        $.tzPOST('getChats',{last_id:lastID,since:general.generateTimestamp(120)},function(r){
        	
        		//update chats from mysql db
            if(!r.error)
            {
            	for(var i=0;i<r.length;i++){
               self.addChatLine(r[i]);
            }
            //if new chat, update to lastid
            if(r.length){
                noActivity = 0;
                lastID = r[i-1].id;
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

            Timeout["Chats"]=setTimeout(function(){self.getChats();},nextRequest);
            
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


        var markup = general.render('chatLine',params),
        exists = $('#WL-ChatList .chat-'+params.id);

        if(exists.length){
            exists.remove();
        }

        if(!lastID){
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
            else pane.getContentPane().append(markup);
        }
        else pane.getContentPane().append(markup);

        // As we added new content, we need to
        // reinitialise the jScrollPane plugin:
        pane.reinitialise();
        pane.scrollToBottom(true);
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
                $('div.chat-'+tempID).remove();
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
		
}