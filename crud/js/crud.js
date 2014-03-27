$(document).ready(function () {

    // Run the init method on document ready:
    crud.init();

});

var crud = {

    data: {
        lastID: 1,
        noActivity: 0
    },

    // Init binds event listeners and sets up timers:

    init: function () {

        // Using the defaultText jQuery plugin, included at the bottom:
        $('#name').defaultText('Nickname');
        $('#password').defaultText('Password');

        // We use the working variable to prevent multiple form submissions:
        var working = false;

        // crud a person into blam:
        $('#loginForm').submit(function () {
            if (working) return false;
            working = true;

            // Using our tzPOST wrapper function (defined in the bottom):
            //$(this).serialize encodes all the name form elements to be used by php
            $.tzcPOST('login', $(this).serialize(), function (r) {
                working = false;

                if (r.error) {
                    general.displayError(r.error);
                }
                else {
                    crud.login(r.username, r.avatar, r.role);
                }
            });

            return false;
        });

        // Checking whether the user is already logged (browser refresh)

        $.tzcPOST('checkLogged', function (r) {
            if (!r.error) {
                crud.login(r.username, r.avatar, r.role);

            }
        });

        // log the user out:

        $('a.logoutButton').live('click', function () {
            $('#TopContainer > span').fadeOut(function () {
                $(this).remove();
            });
            $('#TopContainer').fadeOut();
            $('#MainContainer').fadeOut(function () {
                $('#Login').fadeIn();
            });

            $.tzcPOST('logout');

            return false;
        });

        $('#table-selector').change(function () {
            $('.table-div').each(function () {
                $(this).fadeOut();
            })
            $($(this).val()).fadeIn();
        });

    },
    /*-------------------------------------*/
    /*             END OF INIT             */
    /*-------------------------------------*/

    // The login method hides displays the
    // user's login data and shows the submit form
    login: function (username, avatar, role) {
        //replace empty avatar filed
        var new_avatar = avatar;
        if ((avatar == "") || (avatar == "NULL")) {
            new_avatar = "../img/unknown30x30.png";
        }

        crud.data.username = username;
        crud.data.avatar = new_avatar;
        crud.data.role = role;

        $('#TopContainer').html(general.render('admin-loginTopBar', crud.data));
        $('#Login').fadeOut(function () {
            $('#MainContainer').fadeIn();
            $('#TopContainer').fadeIn();
        });
    }
};
//end of crud var

// Custom GET & POST wrappers:
//POST also uses some GET functionality with action, rest is transferred invisibly
$.tzcPOST = function (action, data, callback) {
    $.post('../php/ajax.php?action=' + action, data, callback, 'json');
}

$.tzcTESTPOST = function (action, data, callback) {
    $.post('../php/test.php?action=' + action, data, callback, 'json');
}

$.tzcGET = function (action, data, callback) {
    $.get('../php/ajax.php?action=' + action, data, callback, 'json');
}
