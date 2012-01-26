function Ticket (pane,status) {
	//constructor
	var self = this;
	var pane = pane;
	//status is used to identify which type of tickets should be displayed (open, closed, new)
	var status = status;
  var TimeOut = null;  	
  	
  	
 		this.getTickets = function(){		
		$.tzPOST('getTicketList',{recursive : true, status : status},function(r){
            if(r){
            	if(!r.error)
              {
                pane.getContentPane().empty();
                //!!!Reference to user.getRole() function is not so nice...
                params = {role : user.getRole()};
                var markup;
                //var markup_extra;
                var markup_child;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                      markup=general.render('parentticket',$.extend(r[i],params));
                        pane.getContentPane().append(markup);
                        
                        if (r[i]['children']) {
                            extra_params = {parent_id : r[i].id};
                            for (var j = 0; j < r[i]['children'].length ; j++) {
                              markup_child=general.render('childticket',$.extend(r[i]['children'][j],extra_params));
                              pane.getContentPane().append(markup_child);
                            }

                        }
                        
                    }
                  }
                //empty no tickets

                  if(r.length<1){
                    var message = 'Geen tickets';
                    pane.getContentPane().append('<p class="count">'+message+'</p>');
                    }
                pane.reinitialise();
                
                }
                else
                {
                    general.displayError(r.error);
                }
                //Time out might overwrite for different ticket types
                TimeOut=setTimeout(function(){self.getTickets();},15000);
						}
						else
						{
						//No tickets available, so empty it
						pane.getContentPane().empty();
						TimeOut=setTimeout(function(){self.getTickets();},15000);
						pane.reinitialise();
						}
        });
	  };
	  
	  this.fillTicket = function(selectElement,ticket_id,parent_id){
	    //update become child ticket in TicketDetail
      $.tzPOST('getTicketList',{recursive : false, status : status},function(r){
        if(!r.error)
          {      		
            		pane=selectElement;
            		pane.empty()
            		
              	var become_Ticket_options = pane.attr('options');
                for(var i=0; i< r.length;i++){
                  var maxlength=15;
                    if(r[i]){
                      //don't want to make it a child of its own, that would be weird;-)
                      if(r[i].title.length<maxlength)
                      {
                        maxlength=r[i].title.length;
                      }
                      if(r[i].id!=ticket_id && r[i].id!=parent_id && parent_id==0)
                      {
                        strOption = [r[i].id + ' : ' + r[i].title.substring(0,maxlength)];
                        become_Ticket_options[become_Ticket_options.length] = new Option(strOption,r[i].id);
                      }
                      if(r[i].id==parent_id && parent_id!=0)
                      {
                        strOption = [r[i].id + ' : ' + r[i].title.substring(0,maxlength)];
                        pane.val(strOption);
                      }
                    }
                }
          }
          else
          {
           general.displayError(r.error);
          }
      });
	  }; 
	  
	  this.refreshTickets = function(){
        clearTimeout(TimeOut);
        setTimeout(function(){self.getTickets();},500);
    };
	  
		this.kill = function(){
		//alert(TimeOut);
		clearTimeout(TimeOut);
		}

}