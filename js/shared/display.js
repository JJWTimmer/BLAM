function Display (pane) {
	//constructor
	var self = this;
	var pane = pane;
		
 		this.showTicket = function(ticket_id){
		
				$.tzPOST('getTicketDetail',{id: ticket_id},function(r){
            if(!r.error)
                {
                	pane.getContentPane().empty();
                	markup_extra=general.render('parentticket_expanded',r[0]);
                  pane.getContentPane().append(markup_extra);
                  pane.reinitialise();
              	}
        });	
	  };
	  
	  this.showOpenFeedback = function(feedback_id){
				$.tzPOST('getFeedback',{id:feedback_id,called: 'false'},function(r){
            if(!r.error)
                {
                	pane.getContentPane().empty();
                	markup_extra=general.render('openfeedback_expanded',r[0]);
                	pane.getContentPane().append(markup_extra);
                	pane.reinitialise();
              	}
        });	
	  };
	  
	  this.showClosedFeedback = function(feedback_id){
				$.tzPOST('getFeedback',{id:feedback_id,called: 'true'},function(r){
            if(!r.error)
                {
                	pane.getContentPane().empty();
                	markup_extra=general.render('closedfeedback_expanded',r[0]);
                	pane.getContentPane().append(markup_extra);
                	pane.reinitialise();
              	}
        });	
	  };
	  
	  this.clearDisplay = function(){
				pane.getContentPane().empty();
				pane.reinitialise();
	  };
	  
}
