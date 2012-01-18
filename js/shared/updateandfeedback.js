function UpdateAndFeedback(pane,called) {
	//constructor
	var self = this;
	var pane = pane;
	//status is used to identify which type of feedbacks should be displayed (open, closed)
	var called = called;
  	
 	this.getFeedback = function(){
        $.tzPOST('getFeedback',{called: called},function(r){
          if(r){
            if(!r.error)
                {
                	pane.getContentPane().empty();
                		var markup;
                		var markup_extra;
                  	for(var i=0; i< r.length;i++){
                    	if(r[i]){
                          if(called=='false')
                          {
                          markup=general.render('openfeedback',r[i]);
                        	}
                        	else
                        	{
                        	markup=general.render('closedfeedback',r[i]);
                        	}
                          pane.getContentPane().append(markup);
                    	}
                  	}
               	}
                //empty no feedback

                if(r.length<1){
                    var message = 'Geen terugmeldingen';
                    pane.getContentPane().append('<p class="count">'+message+'</p>');
                    }
                pane.reinitialise();
                
                //logging.data.jspAPIDisplay.reinitialise();
          }
          else
          {
                    general.displayError(r.error);
          }
        	if(called=='false')
        	{
          Timeout["FeedbacksOpen"]=setTimeout(function(){self.getFeedback();},15000);
					}
					else
					{
					Timeout["FeedbacksClosed"]=setTimeout(function(){self.getFeedback();},15000);
					}
  		});
	};
	
	this.closeFeedback = function(feedback_id){
					$.tzPOST('closeFeedback',{id: feedback_id},function(r){
      			display.clearDisplay();
      			window.clearTimeout(Timeout["FeedbackOpen"]);
      			window.clearTimeout(Timeout["FeedbackClosed"]);
      			feedbackOpen.getFeedback();
          	feedbackClosed.getFeedback();
      		
      });
	};
	
	this.fillUpdate = function(ticket_id,label_id,last_update_id){
	//update the last update box in ticketdetails
      $.tzPOST('getUpdates',{ticket_id:ticket_id,type:'update'},function(r){
      	if(!r.error)
      	{
          if(r && r.length>0){
              label_id.show();
              last_update_id.show();
              $('#openmodalbutton').show();
              var length_updates=r.length-1;
              var markup=r[length_updates].message;
              //update time
              label_id.text('Laatste update('+general.stripToTime(r[length_updates].created)+'):');
              //update text field
              last_update_id.val(markup);
          }
      	}
      	else
        {
          general.displayError(r.error);
        }
      });
		
	};
	
	this.fillFeedback = function(ticket_id,label_id,last_feedback_id){
	//update the last feedback box in ticketdetails
      $.tzPOST('getUpdates',{ticket_id:ticket_id,type:'feedback'},function(r){
      if(!r.error)
      {
          if(r && r.length>0){
            label_id.show();
            last_feedback_id.show();
            $('#openmodalbutton').show();
            var length_feedback=r.length-1;
            var markup=r[length_feedback].message;
            //update time
            label_id.text('Laatste terugmelding('+general.stripToTime(r[length_feedback].created)+'):');
            //update text field
            last_feedback_id.val(markup);
          }
      }
      else
        {
          general.displayError(r.error);
        }
      });
		
	};
}
