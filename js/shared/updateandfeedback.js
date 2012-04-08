function UpdateAndFeedback(pane,called,reverse) {
	//constructor
	var self = this;
	var pane = pane;
	var firstID = 0;
	var lastTimestamp="";
	var called = called;
	var TimeOut = null;	
	var pane_id;
  var reverse = reverse;
  	
  	
 	this.getFeedback = function(){
        $.tzPOST('getUpdateList',{type:'feedback',timestamp_last_update:lastTimestamp,called: called},function(r){
          if(r){
            if(!r.error)
              {
              	if(lastTimestamp=="")
            		{	  	
                	//pane_id cannot be set in the constructor, so is set here
            			pane_id=pane.getContentPane().parent().parent().attr('id');
            			pane.getContentPane().html('<div class="retrieve_previous_feedback rounded"><p align="center">Haal oudere terugmeldingen op...</p></div>');
            			pane.reinitialise();
                }
                
                lastTimestamp=r[0].timestamp;
                
                for(var i=1; i< r.length;i++){
                    if(r[i]){
                      self.addFeedback(r[i]);
                    }
                }
                	
                //if new feedbacks, update firstid
            		if(r.length>1 && firstID==0){
                	firstID=r[1].id;  
              	}

								//empty no feedbacks
            		if($('#'+pane_id+' .jspContainer .jspPane .feedback').length==0 && $('#'+pane_id+' .jspContainer .jspPane > p').length==0)
								{
                	pane.getContentPane().append('<p class="count">Geen terugmeldingen</p>');
                	$('#'+pane_id+' .jspContainer .jspPane .retrieve_previous_feedback').hide();
                	pane.reinitialise();
            		}

								// If this is the first feedback, remove the paragraph saying there aren't any:
            		if($('#'+pane_id+' .jspContainer .jspPane .feedback').length > 0 && $('#'+pane_id+' .jspContainer .jspPane > p').length > 0)
								{	 
									$('#'+pane_id+' .jspContainer .jspPane > p').remove();
									$('#'+pane_id+' .jspContainer .jspPane .retrieve_previous_feedback').show();
									pane.reinitialise();
            		}
              
              }
          		else
          		{
                    general.displayError(r.error);
          		}
          		TimeOut=setTimeout(function(){self.getFeedback();},10000);    	
        	}
        	else
					{
						//No feedbacks available, so empty it
						pane.getContentPane().empty();
						TimeOut=setTimeout(function(){self.getFeedback();},10000);
						pane.reinitialise();
					}
        
	  		});
	};
	
	
	this.getOldFeedbacks = function(){
	  	$.tzPOST('getUpdateList',{first_id:firstID,type:'feedback',called:called},function(r){
				if(r)
          {
            if(!r.error)
            {
            	//alert(r[0].query);
          		for(var i=1;i<r.length;i++){
                self.addFeedback(r[i]);
                if(parseInt(r[i].id)<parseInt(firstID))
								{
									firstID=r[i].id;
								}
            	}
          		if(r[0].limit=='false')
          		{
          			$('#'+pane_id+' .retrieve_previous_feedback').remove();
          		}
          	}
          	else
            {
                general.displayError(r.error);
            }
					}
			});		
		};
	
	
	this.addFeedback = function(params){
		
		var markup='';
	  markup=general.render('feedback',params);
         
    exists = $('#' + pane_id + ' .feedback-'+params.id)
      
    var match = 0;
    //alert('called:'+called);
    //alert('params.called:'+params.called);
    
    if((params.called==null && called=='false') || (params.called!=null && called=='true')){match=1;}  
    //feedback status matches feedback list
    if(match==1)
    {
    	
    	//check if feedback already exists --> replace
      if(exists.length){
      	if(reverse){exists.before(markup);}
        else{exists.after(markup);}
        	exists.remove();
      }
      else
      {
      	//is this the first feedback? --> append it
        var feedbacks=$('#' + pane_id + ' .feedback');
        if(firstID==params.id && feedbacks.length==0){
        	pane.getContentPane().append(markup);
        }
        else
        {
        	//go through the entire list and place it somewhere logically
        	var closest;
        	var best_distance=99;
        	$('#' + pane_id + ' .feedback').each(function(i) {
        		var distance=Math.abs(parseInt($(this).attr('id'))-parseInt(params.id));
        		if(distance<best_distance)
        			{
	        			closest=$(this);	
	        			best_distance=distance;	
  	      		}
        	});
        						
        	if(closest){
         		//alert("adding to closest ticket, ticket:" + params.id);
         	 		if(parseInt(closest.attr('id'))>parseInt(params.id)){
         	 			if(reverse){closest.after(markup);}
         	 			else{closest.before(markup);}
         	 		}
         	 		else
         	 		{
         	 			if(reverse){closest.before(markup);}
         	 			else{closest.after(markup);}
         	 		}		
         	}
         	else
         		{
         			//alert("adding it to end, feedback:"+params.id);
         			if(reverse){pane.getContentPane().prepend(markup);}
         			else{pane.getContentPane().append(markup);}
  	       	}
        }
     	}
    	if(params.id<firstID)
			{
				firstID=params.id;
				//alert("firstID=" + firstID)
			}                
    }
    //check to see if status matches fails, but ticket id does exist --> ticket has moved, remove in this list
    // this is important, because this 'deletes' the moved ticket!
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
	
	
	
	this.closeFeedback = function(feedback_id){
					$.tzPOST('closeFeedback',{id: feedback_id},function(r){
      			display.clearDisplay();
      });
	};
		
	this.fillUpdateFeedback = function(ticket_id,pane){
	$.tzPOST('getUpdates',{ticket_id:ticket_id, type :'all'},function(r){
            if(r)
              {
              if(!r.error)
                {
                  //$('#openmodalbutton').show();
                  var markup;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        if(r[i].type=='feedback'){
                          if(r[i].called==null){
                            markup=general.render('feedbackTBOpen',r[i]);
                          }
                          else
                          {
                            markup=general.render('feedbackTBClosed',r[i]);
                          }
                        pane.getContentPane().append(markup);
                        }
                        else if(r[i].type=='update')
                        	{
                        		markup=general.render('updateTB',r[i]);
                        		pane.getContentPane().append(markup);
                        	}
                        	else if(r[i].type=='addition')
                        		{
                        			markup=general.render('additionTB',r[i]);
                        			pane.getContentPane().append(markup);
                        		}
                        		else if(r[i].type=='answer')
                        			{
                        				markup=general.render('answerTB',r[i]);
                        				pane.getContentPane().append(markup);
                        			}
                    }
                  }
                pane.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }

              }
        });
	};
	
	this.saveUpdate = function(ticketUpdateField){
			if(ticketUpdateField.val()!="" && ticketUpdateField.val()!="Text voor update")
    	{
    		$.tzPOST('createUpdate',{ticket_id:ticketing.data.selectedticket,message:ticketUpdateField.val()},function(r){
  	   		if(r.error){
	       		general.displayError(r.error);
       		}
       		else
       		{
	       		general.displaySaved("Update aangemaakt: " + ticketUpdateField.val());
  	   	    ticketUpdateField.val("");
    	      ticketUpdateField.defaultText('Text voor update');
  	 	      display.showTicketDetail(ticketing.data.selectedticket,ticketing.data.selectedparentticket);
	     	  }
     		});
    	}
    	else
    	{
    		alert("Niet goed ingevuld!");
    	}
  };
  	
  this.saveFeedback = function(ticketFeedbackField){
  		if(ticketFeedbackField.val()!="" && ticketFeedbackField.val()!="Text voor terugmelding")
      {
      	$.tzPOST('createFeedback',{ticket_id:ticketing.data.selectedticket,title:$('#ticket_title').val(),message:ticketFeedbackField.val()},function(r){
        	if(r.error){
             general.displayError(r.error);
          }
          else
          {
          	general.displaySaved("Terugmelding aangemaakt: " + $('#ticket_title').val());
            ticketFeedbackField.val("");
            ticketFeedbackField.defaultText('Text voor terugmelding');
            display.showTicketDetail(ticketing.data.selectedticket,ticketing.data.selectedparentticket);
          }
        });
      }
      else
      {
      	alert("Niet goed ingevuld!");
      }
  };
	
	this.refreshFeedback = function(){
        clearTimeout(TimeOut);
        setTimeout(function(){self.getFeedback();},500);
  };
	
	
	this.kill = function(){
		//alert(TimeOut);
		clearTimeout(TimeOut);
	};
	
}
