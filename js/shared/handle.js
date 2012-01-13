function Handle (pane) {
	//constructor
	var self = this;
	var pane = pane;
  	
 		this.getHandles = function(){
			$.tzPOST('getGroups',{recursive:'true'},function(r){
            if(r){
              if(!r.error)
                {
                //save groups and handles for later use
                logging.data.groups = r;
                logging.data.groupsLoaded = true;

                pane.getContentPane().empty();
                
                var markup_group;
                var markup_handle;
                $('option', $('#autotext_Handle')).remove();
                var autotext_options = $('#autotext_Handle').attr('options');

                for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup_group=general.render('groups',r[i]);
                        pane.getContentPane().append(markup_group);
                        if (!(typeof r[i]['handles'] === 'undefined')) {
                          for (var j = 0; j < r[i]['handles'].length; j++) {
                            r[i]['handles'][j].groupid=r[i].id;
                            markup_handle=general.render('handles',r[i]['handles'][j]);
                            pane.getContentPane().append(markup_handle);
                            autotext_options[autotext_options.length] = new Option(r[i]['handles'][j].handle_name + ' - ' + r[i]['handles'][j].description);

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
            }
            else
            {
            var message = 'Geen voertuigen';
            pane.getContentPane().append('<p class="count">'+message+'</p>');
            pane.reinitialise();
            }
        });
	  };



}
