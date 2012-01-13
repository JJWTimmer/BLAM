function User (pane) {
	//constructor
	var self = this;
	var pane = pane;
	var username;
	var avatar;
	var role;
  	
  	this.setUser = function(username,avatar,role){
  		self.username=username;
  		self.avatar=avatar;
  		self.role=role;
  	};
  	
  	this.getUsername = function(){
  		return self.username;
  	};
  	
  	this.getAvatar = function(){
  		return self.avatar;
  	};
  	
  	this.getRole = function(){
  		return self.role;
  	};
  
		this.getUsers = function(){
			$.tzPOST('getUsers',{options:'logged'},function(r){
            if(!r.error)
                {
                  pane.getContentPane().empty();
                  var users = [];
                  var markup;
                  for(var i=0; i< r.length;i++){
                    if(r[i]){
                        markup=general.render('user',r[i]);
                        pane.getContentPane().append(markup);
                    }
                  }

                  //empty no one is online variable
                  var message = '';

                  if(r.length<1){
                    message = 'No one is online';
                  }
                  else {
                    message = r.length+' '+(r.length == 1 ? 'person':'people')+' online';
                  }

                  pane.getContentPane().append('<p class="count">'+message+'</p>');

                  pane.reinitialise();
                }
                else
                {
                    general.displayError(r.error);
                }
                Timeout["Users"]=setTimeout("user.getUsers();",15000);
      });
	  };
}
