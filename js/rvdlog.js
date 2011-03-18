
var general = {

    // The render method generates the HTML markup
    // that is needed by the other methods:
    render : function(template,params){

        var arr = [];
        switch(template){
            case 'logging-loginTopBar':

                arr = [
                '<div class="Topbar_img"><img src="',params.avatar,'" width="30" height="30" /></div><table class="Topbar_table"><tr><th class="Topbar_info">username</th><th class="Topbar_info">Role</th><td rowspan="2"><a href="ticketing.html" target="_self" valign="middle">Ticketing</a></td></tr><tr>','<td class="Topbar_info">',params.username,'</td><td class="Topbar_info">',params.role,'</td></tr></table><a href="" class="logoutButton rounded">Logout</a></span>'];

            break;

            case 'ticketing-loginTopBar':

                arr = [
                '<div class="Topbar_img"><img src="',params.avatar,'" width="30" height="30" /></div><table class="Topbar_table"><tr><th class="Topbar_info">username</th><th class="Topbar_info">Role</th><td rowspan="2"><a href="logging.html" target="_self" valign="middle">Logging</a></td></tr><tr>','<td class="Topbar_info">',params.username,'</td><td class="Topbar_info">',params.role,'</td></tr></table><a href="" class="logoutButton rounded">Logout</a></span>'];

            break;
            
            case 'admin-loginTopBar':

                arr = [
                '<div class="Topbar_img"><img src="',params.avatar,'" width="30" height="30" /></div><table class="Topbar_table"><tr><th class="Topbar_info">username</th><th class="Topbar_info">Role</th><td><a href="../logging.html" target="_self" valign="middle">Logging</a></td><td><a href="../ticketing.html" target="_self" valign="middle">Ticketing</a></td></tr><tr>','<td class="Topbar_info">',params.username,'</td><td class="Topbar_info">',params.role,'</td></tr></table><a href="" class="logoutButton rounded">Logout</a></span>'];

            break;

            case 'messageLine':
                arr = [
                '<div class="message message-',params.id,' rounded">','<div class="avatar-info-div"><table><tr><td class="avatar-td"><img src="',params.avatar,'" width="23" height="23" onload="this.style.visibility=\'visible\'" /> </td><td class=info-td> ',params.username, ':<BR>',params.time,'</td></tr></table></div><div class="text-div"><span class="text-span">',params.text,'</span></div></div>'];

            break;

            case 'user':
                var new_avatar=params.avatar;
                if((params.avatar=="")||(params.avatar=="NULL"))
                {
                var new_avatar="img/unknown30x30.png";
                }
                arr = [
                    '<div class="user" title="',params.username,'"><img src="',
                    new_avatar,'" width="30" height="30" onload="this.style.visibility=\'visible\'" /></div>'
                ];
            break;

            case 'groups':
                arr = [
                    '<div class="list_item_group rounded"><p>',params.name,'</p></div>'
                ];
            break;

            case 'handles':
                arr = [
                    '<div class="list_item_handle rounded"><div class=list_item_handle_name><p>',params.handle_name,'</p></div><div class=list_item_handle_description><p>',params.description,'</p></div></div>'
                ];

            break;

            case 'parentticket':
                arr = [
                    '<div class="list_item_parent_ticket rounded" id="',params.id,'"><p>',params.title,'</p></div>'
                ];
            break;

            case 'parentticket_expanded':
                arr = [
                    '<div class="list_item_parent_ticket_expanded rounded"><p>Melding:</p><p>',params.text,'</p><p>Status:</p><p>',params.status,'</p><p>WL contactpersoon:</p><p>',params.user,'</p><p>tijd melding:</p><p>',params.created,'</p><p>laatste wijziging:</p><p>',params.modified,'</p></div>'
                ];
            break;

            case 'childticket':
                arr = [
                    '<div class="list_item_child_ticket rounded" id="',params.id,'"><p>',params.title,'</p></div>'
                ];
            break;

            case 'feedback':
                arr = [
                    '<div class="list_item_feedback rounded" id="',params.id,'"><p>',params.title,'</p></div>'
                ];
            break;

            case 'feedback_expanded':
                arr = [
                    '<div class="list_item_feedback_expanded rounded"><p>Melding:</p><p>',params.message,'</p><p>WL contactpersoon:</p><p>',params.username,'</p><p>tijd melding:</p><p>',params.created,'</p></div>'
                ];
            break;

            case 'ticket_detail':
            arr = ['<form id="TicketForm" method="post" action="">',
            '<div class="list_item_ticketdetail rounded">',
            '<div class="list_item_ticketdetail_title_status rounded">',
              '<div class=list_item_ticketdetail_title><p>',params.title,'</p></div>',
              '<div class=list_item_ticketdetail_status><p>status: ',params.status,'</p></div>',
            '</div>',
            '<div class="list_item_ticketdetail_label_created rounded">',
              '<div class=list_item_ticketdetail_label><p>bericht:</p></div>',
              '<div class=list_item_ticketdetail_created><p>tijd bericht: ',params.created,'</p></div>',
            '</div>',
            '<textarea rows="1" cols="1" id="tickettext" name="text" class="rounded" maxlength="700">',params.text,'</textarea>',
            '<div class="list_item_ticketdetail_handle_person rounded">',
              '<div class=list_item_ticketdetail_handle><p>Voertuig: <select id="handle"></select></p></div>',
              '<div class=list_item_ticketdetail_person><p>Persoon: <input id="person" name="persoon" class="rounded" maxlength="16" /></p></div>',
            '</div>',
            '<div class=list_item_ticketdetail_location><p>Locatie: <input id="location" name="location" class="rounded" maxlength="16" /></p></div>',
            '<div class="list_item_ticketdetail_owner_operator rounded">',
              '<div class=list_item_ticketdetail_owner><p>WLer: <select id="owner"><option selected>',params.user,'</option></select></p></div>',
              '<div class=list_item_ticketdetail_operator><p>Operator: <select id="operator"><option selected>',params.user,'</option></select></p></div>',
            '</div>',
            '<div class=list_item_ticketdetail_message_modified><p>Laatst gewijzigd:',params.modified,'</p></div>',
            '<input type="button" id="saveticketbutton" class="blueButton" value="Save Ticket"/>',
            '</div>',
            '</form>'];
             break;
        }

        // A single array join is faster than
        // multiple concatenations

        return arr.join('');

    },

// This method displays an error message on the top of the page:
    displayError : function(msg){

        var elem = $('<div>',{
            id      : 'chatErrorMessage',
            html    : msg
        });

        elem.click(function(){
            $(this).fadeOut(function(){
                $(this).remove();
            });
        });

        setTimeout(function(){
            elem.click();
        },5000);

        elem.hide().appendTo('body').slideDown();
    },

}
//end of var general

// Custom GET & POST wrappers:
//POST also uses some GET functionality with action, rest is transferred invisibly
$.tzPOST = function(action,data,callback){
    $.post('php/ajax.php?action='+action,data,callback,'json');
}

$.tzTESTPOST = function(action,data,callback){
    $.post('php/test.php?action='+action,data,callback,'json');
}

$.tzGET = function(action,data,callback){
    $.get('php/ajax.php?action='+action,data,callback,'json');
}

// A custom jQuery method for placeholder text:
// Can be applied to any textbox
$.fn.defaultText = function(value){

    var element = this.eq(0);
    element.data('defaultText',value);

    element.focus(function(){
        if(element.val() == value){
            element.val('').removeClass('defaultText');
        }
    }).blur(function(){
        if(element.val() == '' || element.val() == value){
            element.addClass('defaultText').val(value);
        }
    });

    return element.blur();
}