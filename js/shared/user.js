function User(pane) {
    //constructor
    var self = this;
    var pane = pane;
    var username;
    var avatar;
    var role;
    var TimeOut = null;

    this.setUser = function (username_var, avatar_var, role_var) {
        username = username_var;
        avatar = avatar_var;
        role = role_var;
    };

    this.getUsername = function () {
        return username;
    };

    this.getAvatar = function () {
        return avatar;
    };

    this.getRole = function () {
        return role;
    };

    this.getUsers = function () {
        $.tzPOST('getUsers', {options:'logged'}, function (r) {
            if (!r.error) {
                if (pane == "TopBar") {
                    //Put all the users (name only) in the topbar (in the div's)
                    $('div.Topbar_nr_users').empty();
                    $('div.Topbar_users').empty();
                    var users = [];
                    var markup = '<p>';

                    for (var i = 0; i < r.length; i++) {
                        if (r[i]) {
                            if (i < r.length - 1) {
                                markup = markup + r[i].username + ', ';
                            }
                            else {
                                markup = markup + r[i].username;
                            }
                        }
                    }
                    markup = markup + '</p>';
                    $('div.Topbar_users').append(markup);


                    var message = '';
                    if (r.length < 1) {
                        message = '<p>users online(0)</p>';
                    }
                    else {
                        message = '<p>users online(' + r.length + '):</p>';
                    }
                    $('div.Topbar_nr_users').append(message);

                }
                else {
                    //put users in special pane
                    pane.getContentPane().empty();
                    var users = [];
                    var markup;
                    for (var i = 0; i < r.length; i++) {
                        if (r[i]) {
                            markup = general.render('user', r[i]);
                            pane.getContentPane().append(markup);
                        }
                    }

                    //empty no one is online variable
                    var message = '';

                    if (r.length < 1) {
                        message = 'No one is online';
                    }
                    else {
                        message = r.length + ' ' + (r.length == 1 ? 'person' : 'people') + ' online';
                    }

                    pane.getContentPane().append('<p class="count">' + message + '</p>');

                    pane.reinitialise();
                }
            }
            else {
                general.displayError(r.error);
            }
            TimeOut = setTimeout(function () {
                self.getUsers();
            }, 15000);
        });
    };

    //function to fill select element with all users
    //used in ticketdetail for example
    //specify html select box id and which option to select
    this.fillSelect = function (selectElement, selectOption) {
        $.tzPOST('getUsers', {options:'all'}, function (r) {
            if (!r.error) {
                if (selectOption) {
                    selectElement.empty();
                    var owner_options = selectElement.attr('options');
                    var index_owner;
                    owner_options[0] = new Option("unclaim", -1);
                    for (var i = 0; i < r.length; i++) {
                        if (r[i]) {
                            //only add WL users TODO:may be neater to use php to filter for this
                            if (r[i].role == "WL" || r[i].role == "Admin") {
                                if (r[i].username == selectOption) {
                                    index_owner = owner_options.length;
                                }
                                owner_options[owner_options.length] = new Option(r[i].username, r[i].id);
                            }
                        }
                    }
                    if (index_owner)selectElement[0].selectedIndex = index_owner;
                }
                else {
                    selectElement.empty();
                    var owner_options = selectElement.attr('options');
                    owner_options[0] = new Option("", -1);
                }
            }
            else {
                general.displayError(r.error);
            }
        });
    };

    this.kill = function () {
        //alert(TimeOut);
        clearTimeout(TimeOut);
    }

}
