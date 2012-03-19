function Ticket (pane,status) {
	//constructor
	var self = this;
	var pane = pane;
	//status is used to identify which type of tickets should be displayed (open, closed, new)
	var status = status;
	var firstID = 0;
	var lastTimestamp="";
	var TimeOut = null;  	
  var pane_id;
  	
 		this.getTickets = function(){		
		$.tzPOST('getTicketList',{timestamp_last_update:lastTimestamp,recursive : true, status : status},function(r){
            
            if(r){
            	if(!r.error)
              {
              	if(lastTimestamp=="")
            		{	
            			//pane_id cannot be set in the constructor, so is set here
            			pane_id=pane.getContentPane().parent().parent().attr('id');
            			pane.getContentPane().html('<div class="retrieve_previous_ticket rounded"><p align="center">Haal oudere tickets op...</p></div>');
            			pane.reinitialise();
            		}
            		lastTimestamp=r[0].timestamp;
            		var params = {role : user.getRole()};                
                var markup;
                var markup_child;
                  for(var i=1; i< r.length;i++){
                    if(r[i]){
                    	//alert('parent');
                      self.addTicket(r[i]);
                     
                    	if(r[i].id<firstID)
											{
												firstID=r[i].id;
											}                        
                    }
                  }
                
              	//if new tickets, update firstid
            		if(r.length>1 && firstID==0){
                	firstID=r[1].id;  
              	}

				//empty no tickets
            	if($('#'+pane_id+' .jspContainer .jspPane .ticket').length==0 && $('#'+pane_id+' .jspContainer .jspPane > p').length==0)
				{
                	pane.getContentPane().append('<p class="count">Geen tickets</p>');
                	$('#'+pane_id+' .jspContainer .jspPane .retrieve_previous_ticket').hide();
                	pane.reinitialise();
            	}

				// If this is the first ticket, remove the paragraph saying there aren't any:
            	if($('#'+pane_id+' .jspContainer .jspPane .ticket').length > 0 && $('#'+pane_id+' .jspContainer .jspPane > p').length > 0)
				{	 
						$('#'+pane_id+' .jspContainer .jspPane > p').remove();
						$('#'+pane_id+' .jspContainer .jspPane .retrieve_previous_ticket').show();
					pane.reinitialise();
            	}
                
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
	  
	  this.getOldTickets = function(){
	  	$.tzPOST('getTicketList',{first_id:firstID,recursive : true, status : status},function(r){
				if(r)
          {
            if(!r.error)
            {
            	//alert(r[0].query);
          		for(var i=1;i<r.length;i++){
                self.addTicket(r[i]);
                if(parseInt(r[i].id)<parseInt(firstID))
								{
									firstID=r[i].id;
								}
            	}
          		if(r[0].limit=='false')
          		{
          			$('#'+pane_id+' .retrieve_previous_ticket').remove();
          		}
          	}
          	else
            {
                general.displayError(r.error);
            }
					}
			});		
		};
	  
	  this.searchTicket = function(){
	  	
	  	$.tzPOST('searchTickets',{keyword:$('#search_tickets').val()},function(r){
    		pane.getContentPane().empty();
    		if(r.length>0)
          {
            if(!r.error)
            {
            	$('#search_tickets').val('');
          		for(var i=0;i<r.length;i++){
                self.addTicket(r[i]);
            	}
            	
            	
          	}
          	else
            {
                general.displayError(r.error);
            }
					}
					else
					{
						pane.getContentPane().html('<p class="noMessages">No tickets found</p>');
					}	
      });
	  };
	  
	  this.addTicket = function(params){
		
		var markup='';
		var markup_parent='';
        var markup_child='';
        var role = {role : user.getRole()};
        
        markup=general.render('ticket_container',params);
        markup_parent=general.render('parentticket',$.extend(params,role));
        
       	exists = $('#' + pane_id + ' .ticket-'+params.id)
        
        if (params['children']) {
        	//alert('child');
            extra_params = {parent_id : params.id};
            for (var j = 0; j < params['children'].length ; j++) {
            	markup_child+=general.render('childticket',$.extend(params['children'][j],extra_params));
            	
            	//removes original ticket (before it became child)
            	clone_exists = $('#' + pane_id + ' .ticket-'+params['children'][j].id);
            	if(clone_exists.length)
            	{
            		clone_exists.remove();
            	}
            	//!!append various child tickets here!!
            }
        }
        
        //removes child if it became a parent again
        child_exists = $('#' + pane_id + ' .child-'+params.id)
        if(child_exists.length)
        {
       		child_exists.remove();
        }
        
        markup+=markup_parent;     
        markup+=markup_child;     
        markup+='</div>';     
        
        var match = 0;
        $.each(status[0], function(k,v){
            	if(v==params.status){match=1}
        });
        
        //ticket status matches ticket list
        if(match==1)
        {
					//check if message already exists --> replace
        	if(exists.length){
        		exists.after(markup);
            exists.remove();
            //alert("replacing");
        	}
        	else
        	{
      	 		//is there already a ticket with a id one smaller? --> add after this
      	 		var previous = $('#'+pane_id+ ' .ticket-'+(+params.id - 1));
       	 		if(previous.length){
           		previous.after(markup);
          		//alert("placing after ticket with id-1");
          	}
          	else
          	{
           		var next = $('#'+pane_id+ ' .ticket-'+(+params.id + 1));
       	 			if(next.length){
           			next.before(markup);
           	 		//alert("placing after ticket with id-1");
           		}
           		else {
           			//is this the first ticket? --> append it
           			if(firstID==params.id){
           				pane.getContentPane().append(markup);
           				//alert("first ticket");
            		}
        	 			else
        	 			{
        	 				//has the new ticket an id that is smaller than first id? --> place before lastid
        	 				if(parseInt(params.id) < parseInt(firstID))
        	 				{
		        				var first = $('#'+pane_id+' .ticket-'+(+firstID));
  	      					first.before(markup);
    	    					//alert("adding old ticket");
      	  				}
        					else
        					{
        	 					//go through the entire list and place it somewhere logically
        	 					var closest;
        						$('#'+pane_id+' .ticket').each(function(i) {
        							if(parseInt($(this).attr('id'))<parseInt(params.id))
        							{
	        							closest=$(this);
  	      						}
        						});
        						
        						if(closest){
         	 						closest.after(markup);
         	 						//alert("adding to closest ticket");
         	 					}
         	 					else
         	 					{
         	 					pane.getContentPane().append(markup);
         	 					//alert("adding it to end");
  	       	 				}
           				}
        	 			}
         			}
         		}	
        	}
        }
       	//check to see if status matches fails, but ticket id does exist --> ticket has moved, remove in this list
        else{
        		if(exists.length)
        		{
        			exists.remove();
        			//alert("removing existing");
        		}	 
        }
        				
        // As we added new content, we need to
        // reinitialise the jScrollPane plugin:
        pane.reinitialise();
    };
	  
	  this.fillTicket = function(selectElement,ticket_id,parent_id){
	    //update become child ticket in TicketDetail
      $.tzPOST('getTicketList',{timestamp_last_update:'all', recursive : false, status : status},function(r){
        if(r)
          {
        		if(!r.error)
          	{      		
            		pane=selectElement;
            		pane.empty()
            		
              	var become_Ticket_options = pane.attr('options');
                for(var i=1; i< r.length;i++){
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