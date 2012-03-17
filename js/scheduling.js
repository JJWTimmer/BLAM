$(document).ready(function(){

  // Run the init method on document ready:
  scheduling.init();

});

var scheduling = {

  // data holds variables for use in the class:

    data : {
        //groupsLoaded : false
    },

    // Init binds event listeners and sets up timers:

    init : function(){
        
        // Using the defaultText jQuery plugin, included at the bottom:
        $('#name').defaultText('Nickname');
        $('#password').defaultText('Password');

        // We use the working variable to prevent multiple form submissions:
        var working = false;

        // Converting the #MeldingenList, #UsersList, #HandlesList divs into a jScrollPane,
        // and saving the plugin's API in logging.data:

        scheduling.data.jspAPISchedule = $('#DayScheduleList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
        }).data('jsp');
				
				scheduling.data.jspAPITaskDetails = $('#TaskDetailsList').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
    	}).data('jsp');
				
				//setting up message 'class'
				//message = new Message(logging.data.jspAPIMeldingen);
				user = new User("TopBar");		    
				dayplanner = new DayPlanner(scheduling.data.jspAPISchedule);
				display = new Display (scheduling.data.jspAPITaskDetails);
				
				$('#DaySelect .calendar_selectleft').live('click', function(){
						var selectedDate = dayplanner.getCurrentDate();
						selectedDate.setDate(selectedDate.getDate() - 1);
						dayplanner.refreshDate(selectedDate);
				});
				
				$('#DaySelect .calendar_selectright').live('click', function(){
						var selectedDate = dayplanner.getCurrentDate();
						selectedDate.setDate(selectedDate.getDate() + 1);
						dayplanner.refreshDate(selectedDate);
				});
				
				$('.calendar_item').live('click', function(){
					if(!working)
          {
            working = true;
            var taskid=$(this).attr("id");
					display.showTask(taskid);
					}
					
          working=false;
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
                    scheduling.login(r.username,r.avatar,r.role);
                }
            });

            return false;
        });

        // Checking whether the user is already logged (browser refresh)

        $.tzPOST('checkLogged',function(r){
            if(!r.error)
            {
                scheduling.login(r.username,r.avatar,r.role);
            }
        });
                
        // Logging the user out:
        $('a.logoutButton').live('click',function(){
            scheduling.killTimeouts();
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
            resizeTimer = setTimeout(scheduling.reInitJSP,100);
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
       
        $('#TopContainer').html(general.render('scheduling-loginTopBar',scheduling.data));
        $('#Login').fadeOut(function(){
          $('#MainContainer').fadeIn();
          $('#TopContainer').fadeIn();
          
          dayplanner.init();
          dayplanner.addTask();
          dayplanner.getTasks();
          //message.getMessages();
        });
    },

   killTimeouts : function(){
            //message.kill();
  	},  

  reInitJSP : function(){
            scheduling.data.jspAPISchedule.reinitialise();
            scheduling.data.jspAPITaskDetails.reinitialise();
  }
};
//end of scheduling var