function Handle (pane) {
	//constructor
	var self = this;
	var pane = pane;
  var groups;
  var groupsLoaded;	
  var TimeOut = null;
  	
  	this.getgroups = function(){
  	return groups;	
  	};
 		
 		this.getHandles = function(){
			$.tzPOST('getGroups',{recursive:'true'},function(r){
            if(r){
              if(!r.error)
                {
                //save groups and handles for later use
                groups = r;
                groupsLoaded = true;

                pane.getContentPane().empty();
                
                var markup_group;
                var markup_handle;
                $('option', $('#autotext_Handle')).remove();
                //check to see if this select actually exists (only exists in logging)
                //Maybe make new function for this? (load handles (from memory?) for select?)
                if($('#autotext_Handle').length != 0)
                {
                	var autotext_options = $('#autotext_Handle').attr('options');
                }

                for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup_group=general.render('groups',r[i]);
                        pane.getContentPane().append(markup_group);
                        if (!(typeof r[i]['handles'] === 'undefined')) {
                          for (var j = 0; j < r[i]['handles'].length; j++) {
                            r[i]['handles'][j].groupid=r[i].id;
                            markup_handle=general.render('handles',r[i]['handles'][j]);
                            pane.getContentPane().append(markup_handle);
                            if($('#autotext_Handle').length != 0)
                						{
                            	autotext_options[autotext_options.length] = new Option(r[i]['handles'][j].handle_name + ' - ' + r[i]['handles'][j].description);
														}
                          }
                        }
                    }
                }

                //empty no groups

                pane.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
            TimeOut=setTimeout(function(){self.getHandles();},30000);
            }
            else
            {
            var message = 'Geen voertuigen';
            pane.getContentPane().append('<p class="count">'+message+'</p>');
            pane.reinitialise();
            TimeOut=setTimeout(function(){self.getHandles();},30000);
            }
        });
	  };

	this.searchHandles = function(keyword){
		$(".list_item_first").each(function(i) {
              //make every group visible again
              $(this).attr('visible','1');
            });
						//if field is empty show every handle
            if(keyword=="")
            {
              $(".list_item_second").each(function(i) {
                $(this).fadeIn();
              });
            }
            else
            {
                var keyword_LC=keyword.toLowerCase();
                $(".list_item_second").each(function(i) {
                  var handle_name=$(this).children('.list_item_handle_name').text().toLowerCase();
                  var handle_description=$(this).children('.list_item_handle_description').text().toLowerCase();
                  if((handle_name.search(keyword_LC) < 0) && (handle_description.search(keyword_LC) < 0))
                    {
                    $(this).fadeOut();
                    }
                  else
                    {
                    $(this).fadeIn();
                    }
                });
            }
            pane.reinitialise();
	};

	//could be optimized to cache handles in a variable (make a function loadHandles and a variable HandlesLoaded)
	this.fillHandle = function(handle_id,selectElement){
		//update select handles in ticketDetails
      $.tzPOST('getHandles',{},function(r){
        if(!r.error)
          {         
            selectElement.empty()
            var tickethandles_options = selectElement.attr('options');
            var index_handle;
            tickethandles_options[0] = new Option("");
              for(var i=0; i< r.length;i++){
                if(r[i]){
                    //check whether the ticket handle is in this list, if it is, store the index
                    if(r[i].id==handle_id){
                      index_handle=tickethandles_options.length;
                    }
                    //add the handles to the select
                    tickethandles_options[tickethandles_options.length] = new Option(r[i].description,r[i].id);

                }
                //if the index was stored, use it to select this item
                if(index_handle)
                {
									selectElement[0].selectedIndex=index_handle;
                }
              }
          }
          else
          {
            general.displayError(r.error);
          }
      });
	};
	
	this.kill = function(){
		//alert(TimeOut);
		clearTimeout(TimeOut);
	}

	
}
