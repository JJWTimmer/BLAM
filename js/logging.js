$(document).ready(function(){
	
	// Run the init method on document ready:
	logging.init();
	
});

var logging = {
	
	// data holds variables for use in the class:
	
	data : {
		lastID 		: 0,
		noActivity	: 0
	},
	
	// Init binds event listeners and sets up timers:
	
	init : function(){
        
        // add listener for this button
        $('#submitbutton').bind('click',function(){
        $('#submitForm').submit();
        });
        	
		// Using the defaultText jQuery plugin, included at the bottom:
		$('#name').defaultText('Nickname');
		$('#password').defaultText('Password');
		
        // We use the working variable to prevent multiple form submissions:
        var working = false;

        // Logging a person in the chat:
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
                    logging.getMessages();
                    //chat.getUsers();
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
            $('#LoggingTopContainer > span').fadeOut(function(){
                $(this).remove();
            });
            $('#LoggingTopContainer').fadeOut();
            $('#LoggingMainContainer').fadeOut(function(){
                $('#LoggingLogin').fadeIn();
            });
            
            $.tzPOST('logout');
            
            return false;
        });
        
        
        // Converting the #chatLineHolder div into a jScrollPane,
        // and saving the plugin's API in chat.data:
        
        logging.data.jspAPI = $('#MeldingenList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
        }).data('jsp');
        
        (function getMessagesTimeoutFunction(){
            logging.getMessages(getMessagesTimeoutFunction);
        })();
        
        // catching when user presses enter
        $('#messageText').keydown(function(e){
            if(e.which == 13) {
                e.preventDefault();
                //$('submitForm.#submit').trigger('click');
                //$('submitForm').submit();
                //document.getElementById('bla').click();
                $('#submitbutton').trigger('click');
                //
                return false
            }
        })


        // Submitting a new message entry:
        
        $('#submitForm').submit(function(){
            
            var text = $('#messageText').val();
            
            if(text.length == 0){
                return false;
            }
            
            if(working) return false;
            working = true;
            
            
            // Assigning a temporary ID to the chat:
            var tempID = 't'+Math.round(Math.random()*1000000),
                params = {
                    messageid  : tempID,
                    username  : logging.data.username,
                    avatar  : logging.data.avatar,
                    text    : text.replace(/</g,'&lt;').replace(/>/g,'&gt;')
                };
            
            // Using our addChatLine method to add the chat
            // to the screen immediately, without waiting for
            // the AJAX request to complete:
            
            //logging.addMessageLine($.extend({},params));
            logging.addMessageLine($.extend({},params));
            
            // Using our tzPOST wrapper method to send the chat
            // via a POST AJAX request:
            
            //$.tztestPOST('addMessage',$(this).serialize(),function(r){
                
                working = false;
                
                //empty input form textbox
                $('#messageText').val('');
                //remove old temporary message
                $('div.message-'+tempID).remove();
                
                //insert newly received ID
                //params['id'] = r.insertID;
                //temporary fix to avoid php
                var insertID=100;
                params['id'] = insertID;
                logging.addMessageLine($.extend({},params));
            //});
            
            return false;
        });
    },
    //end of init function

    // The login method hides displays the
    // user's login data and shows the submit form
    login : function(username,avatar,role){
 
        logging.data.username = username;
        logging.data.avatar = avatar;
        logging.data.role = role;
        $('#LoggingTopContainer').html(general.render('loginTopBar',logging.data));
        $('#LoggingLogin').fadeOut(function(){
        $('#LoggingMainContainer').fadeIn();
        $('#LoggingTopContainer').fadeIn();
        });
    },


// This method requests the latest chats
    // (since lastID), and adds them to the page.
    
    getMessages : function(callback){
            
        $.tzTESTPOST('getMessages',{last_id: logging.data.lastID,date_and_time: '2:0:0'},function(r){
            //update chats from mysql db
            for(var i=0;i<r.messages.length;i++){
                
                logging.addMessageLine(r.messages[i]);
                        
            }
            //if new chats, update to lastid
            //chat.data.noActivity is reset, so next update in 1 second
            
            if(r.messages.length){
                logging.data.noActivity = 0;
                logging.data.lastID = r.messages[i-1].messageid;
                }
            else{
                // If no chats were received, increment
                // the noActivity counter.
                
                logging.data.noActivity++;
            }
            //if no chats exist yet
            if(!logging.data.lastID){
                logging.data.jspAPI.getContentPane().html('<p class="noMessages">No messages yet</p>');
            }
            
            // Setting a timeout for the next request,
            // depending on the message activity:
            
            var nextRequest = 1000;
            
            // 2 seconds
            //if(logging.data.noActivity > 3){
            //    nextRequest = 2000;
            //}
            
            //if(logging.data.noActivity > 10){
            //    nextRequest = 5000;
            //}
            
            // 15 seconds
            //if(logging.data.noActivity > 20){
            //    nextRequest = 15000;
            //}
        
            setTimeout(callback,nextRequest);
        });
    },


// The addMessageLine method ads a chat entry to the page
    
    addMessageLine : function(params){
               
        var arr;
            arr=['id=',params.messageid,' name=',params.username,' text=',params.text,' created=',params.created];
            var messagestring=arr.join('');
            //general.displayError(messagestring);        
            // All times are displayed in the user's timezone
        
        var d = new Date();
       
        if(params.time) {
            
            // PHP returns the time in UTC (GMT). We use it to feed the date
            // object and later output it in the user's timezone. JavaScript
            // internally converts it for us.
            
            d.setUTCHours(params.time.hours,params.time.minutes);
        }
        
        params.time = (d.getHours() < 10 ? '0' : '' ) + d.getHours()+':'+
                      (d.getMinutes() < 10 ? '0':'') + d.getMinutes();
         
        var markup = general.render('messageLine',params),
            exists = $('#MeldingenList .message-'+params.messageid);
        
        if(exists.length){
            exists.remove();
        }
        
        if(!logging.data.lastID){
            // If this is the first chat, remove the
            // paragraph saying there aren't any:
            
            $('#MeldingenList p').remove();
        }
        
        //If this isn't a temporary chat:
        if(params.messageid.toString().charAt(0) != 't'){
            var previous = $('#MeldingenList .message-'+(+params.messageid - 1));
            if(previous.length){
                previous.after(markup);
            }
            else logging.data.jspAPI.getContentPane().append(markup);
        }
        else logging.data.jspAPI.getContentPane().append(markup);
        
        // As we added new content, we need to
        // reinitialise the jScrollPane plugin:
        logging.data.jspAPI.reinitialise();
        logging.data.jspAPI.scrollToBottom(true);

    },
    
    

        /*		
				
				
				
					
		// Self executing timeout functions


		
		
		
		(function getUsersTimeoutFunction(){
			chat.getUsers(getUsersTimeoutFunction);
		})();
		
		
	},
	
		
	
	
	
	// Requesting a list with all the users.
	
	getUsers : function(callback){
	
		$.tzGET('getUsers',function(r){
			
			var users = [];
			
			for(var i=0; i< r.users.length;i++){
				if(r.users[i]){
					users.push(chat.render('user',r.users[i]));
				}
			}
			//empty no one is online variable
			var message = '';
			
			if(r.total<1){
				message = 'No one is online';
			}
			else {
				message = r.total+' '+(r.total == 1 ? 'person':'people')+' online';
			}
			
			users.push('<p class="count">'+message+'</p>');
			
			$('#chatUsers').html(users.join(''));
			
			setTimeout(callback,15000);
		});
	*/
};
//end of logging var
