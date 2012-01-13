function Ticket (pane,status) {
	//constructor
	var self = this;
	var pane = pane;
	//status is used to identify which type of tickets should be displayed (open, closed, new)
	var status = status;
  	
 		this.getTickets = function(){
		
		$.tzPOST('getTicketList',{recursive : false, status : status},function(r){
            if(!r.error)
                {
                pane.getContentPane().empty();

                var markup;
                var markup_extra;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('parentticket',r[i]);
                        pane.getContentPane().append(markup);
                        /* Move this to different function
                        if (r[i].id == logging.data.selectedticket) {
                            logging.data.jspAPIDisplay.getContentPane().empty();
                            markup_extra=general.render('parentticket_expanded',r[i]);
                            logging.data.jspAPIDisplay.getContentPane().append(markup_extra);
                          }
                       */
                    }
                  }
                //empty no tickets

                  if(r.length<1){
                    var message = 'Geen tickets';
                    pane.getContentPane().append('<p class="count">'+message+'</p>');
                    }
                pane.reinitialise();
                
                //logging.data.jspAPIDisplay.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
                Timeout["Tickets"]=setTimeout("ticket.getTickets();",15000);

        });

		
	  };
}
