function Feedback (pane,called) {
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
          Timeout["FeedbacksOpen"]=setTimeout("feedbackOpen.getFeedback();",15000);
					}
					else
					{
					Timeout["FeedbacksClosed"]=setTimeout("feedbackClosed.getFeedback();",15000);
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
	
}
