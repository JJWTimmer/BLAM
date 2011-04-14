$(document).ready(function(){

  // Run the init method on document ready:
  usermgr.init();

});

var Timeout= new Array();

var usermgr = {

  // data holds variables for use in the class:

    data : {
        lastID    : 1,
        noActivity  : 0,
        groupsLoaded : false
    },

    // Init binds event listeners and sets up timers:

    init : function(){
        // Using the defaultText jQuery plugin, included at the bottom:
        $('#name').defaultText('Nickname');
        $('#password').defaultText('Password');

        // We use the working variable to prevent multiple form submissions:
        var working = false;

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
        });
    },
	
  killTimeouts : function(){
            for (key in Timeout)
            {
              clearTimeout(Timeout[key]);
            }
  }
};
//end of logging var