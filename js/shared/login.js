var Login = {
		checkLogged: function () {
			// Checking whether the user is already logged (browser refresh)
        $.tzPOST('checkLogged',function(r){
            if(!r.error)
            {
                logging.login(r.username,r.avatar,r.role);
            }
        });
    },
   
    submitLogin: function (username,password) {
						// Using our tzPOST wrapper function (defined in the bottom):
            //$(this).serialize encodes all the name form elements to be used by php
            $.tzPOST('login',{username:username,password:password},function(r){
                
                if(r.error){
                    general.displayError(r.error);
                }
                else    {
                    logging.login(r.username,r.avatar,r.role);
                    }
            });
    }
    
}