
$(document).ready(function(){

      var Container = $('#ListTB').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12
      }).data('jsp');


      $.tzPOST('getUpdates',{ticket_id:ticketing.data.selectedticket, type :'all'},function(r){
            if(r)
              {
              if(!r.error)
                {
                  Container.getContentPane().empty();

                  var markup;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        if(r[i].type=='feedback'){
                        markup=general.render('feedbackTB',r[i]);
                        Container.getContentPane().append(markup);
                        }
                        else
                        {
                        markup=general.render('updateTB',r[i]);
                        Container.getContentPane().append(markup);
                        }
                    }
                  }
                Container.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }

              }
              else
              {
                    //empty no groups
                    var message = 'Geen updates/terugmeldingen';
                    Container.getContentPane().append('<p class="count">'+message+'</p>');
                    Container.reinitialise();
              }
        });

});
