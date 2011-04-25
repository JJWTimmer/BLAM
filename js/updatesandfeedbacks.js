
$(document).ready(function(){
      var bla= $('#HandlesListTB').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
      }).data('jsp');

      $.tzPOST('getGroups',{recursive:'true'},function(r){
            if(r)
              {
              if(!r.error)
                {
                  bla.getContentPane().empty();
                  bla.getContentPane().append('<input type="text" class="rounded" value="" id="search_handles">');
                  var markup_group;
                  var markup_handle;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup_group=general.render('groups',r[i]);
                        ticketing.data.jspAPIHandles.getContentPane().append(markup_group);
                        if (!(typeof r[i]['handles'] === 'undefined')) {
                          for (var j = 0; j < r[i]['handles'].length; j++) {
                            r[i]['handles'][j].groupid=r[i].id;
                            markup_handle=general.render('handles',r[i]['handles'][j]);
                            bla.getContentPane().append(markup_handle);
                          }
                        }
                    }
                  }
                bla.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }

              }
              else
              {
                    //empty no groups
                    var message = 'Geen voertuigen';
                    bla.getContentPane().append('<p class="count">'+message+'</p>');
                    bla.reinitialise();
              }
        });
});
