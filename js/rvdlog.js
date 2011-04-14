
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

            case 'chatLine':
                arr = [
                '<div class="chat chat-',params.id,' rounded">','<div class="avatar-info-div"><table><tr><td class="avatar-td"><img src="',params.avatar,'" width="23" height="23" onload="this.style.visibility=\'visible\'" /> </td><td class=info-td> ',params.username, ':<BR>',params.time,'</td></tr></table></div><div class="text-div"><span class="text-span">',params.text,'</span></div></div>'];
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
                if(params.wluser==null && (params.role=="WL" || params.role=="Admin")){
                arr = [
                    '<div class="list_item_parent_ticket_full rounded" id="',params.id,'">',
                    '<div class="list_item_parent_ticket_title rounded" id="',params.id,'"><p>',params.id,': ',params.title,'</p></div>',
                    '<div class="list_item_parent_ticket_claim rounded" id="',params.id,'"><p>claim</p></div>',
                    '</div>'
                ];
                }
                else
                {
                arr = [
                    '<div class="list_item_parent_ticket_full rounded" id="',params.id,'">',
                    '<div class="list_item_parent_ticket_title rounded" id="',params.id,'"><p>',params.id,': ',params.title,'</p></div>',
                    '<div class="list_item_parent_ticket_user rounded" id="',params.id,'"><p>',params.wluser,'</p></div>',
                    '</div>'
                      ];
                }
                break;

            case 'parentticket_expanded':
                arr = [
                    '<div class="list_item_parent_ticket_expanded rounded">',
                    '<p><b>Melding:</b></p><p>',params.text,'</p>',
                    '<p><b>Operator: </b>',params.rvduser,'</p>',
                    '<p><b>Status: </b>',params.status,'</p>',
                    '<p><b>WL contactpersoon: </b>',params.wluser,'</p>',
                    '<p><b>tijd melding: </b>',params.created,'</p>',
                    '<p><b>laatste wijziging: </b>',params.modified,'</p>',
                    '</div>'
                ];
            break;

            case 'childticket':
                arr = [
                    '<div class="list_item_child_ticket rounded" id="',params.id,'" title="',params.parent_id,'"><p>',params.title,'</p></div>'
                ];
            break;

            case 'openfeedback':
                arr = [
                    '<div class="list_item_openfeedback rounded" id="',params.id,'"><p>',params.title,'</p></div>'
                ];
            break;

            case 'closedfeedback':
                arr = [
                    '<div class="list_item_closedfeedback rounded" id="',params.id,'"><p>',params.title,'</p></div>'
                ];
            break;

            case 'openfeedback_expanded':
                arr = [
                    '<div class="list_item_feedback_expanded rounded" id="',params.id,'">',
                    '<p><b>Voertuig: </b>',params.handle,'</p>',
                    '<p><b>Ingevoerd op: </b>',params.created,'</p>',
                    '<p><b>Terugmelding:</b></p><p>',params.message,'</p>',
                    '<p><b>WL contactpersoon: </b>',params.wl_user,'</p>',
                    '<input type="button" id="closefeedback" class="blueButton" value="Terugmelding sluiten"/>',
                    '</div>'
                ];
            break;

            case 'closedfeedback_expanded':
                arr = [
                    '<div class="list_item_feedback_expanded rounded" id="',params.id,'">',
                    '<p><b>Voertuig: </b>',params.handle,'</p>',
                    '<p><b>Ingevoerd op: </b>',params.created,'</p>',
                    '<p><b>Terugmelding:</b></p><p>',params.message,'</p>',
                    '<p><b>WL contactpersoon: </b>',params.wl_user,'</p>',
                    '<p><b>Afgehandeld door: </b>',params.called_by,'</p>',
                    '<p><b>Afgehandeld op: </b>',params.called,'</p>',
                    '</div>'
                ];
            break;

            case 'ticket_detail_new':
            arr = [
            '<form id="TicketForm" method="post" action="">',
              '<div class="list_item_ticketdetail rounded">',
                '<div class=list_item_ticketdetail_title><input type="text" class="rounded" value="',params.title,'" id="ticket_title"></div>',
                '<div class="list_item_ticketdetail_status rounded"><p>status: ',params.status,'</p></div>',
                '<div class="list_item_ticketdetail_label_created rounded">',
                  '<div class=list_item_ticketdetail_label><p>bericht:</p></div>',
                  '<div class=list_item_ticketdetail_created><p>tijd bericht: ',params.created,'</p></div>',
                '</div>',
                '<textarea rows="1" cols="1" id="ticket_text" name="text" class="rounded" maxlength="700">',params.text,'</textarea>',
                '<div class=list_item_ticketdetail_label_loc><p>Locatie:</p></div>',
                '<div class=list_item_ticketdetail_location><input type="text" class="rounded" value="',params.location,'" id="ticket_location"></div>',
                '<p class="list_item_ticketdetail_label_handle">Voertuig:</p>',
                '<div class=list_item_ticketdetail_handle><p><select id="ticket_Handle"><option selected> </option></select></p></div>',
                '<div class="list_item_ticketdetail_label_becomechild"><p>Koppel aan <BR> ticket:</p></div>',
                '<div class=list_item_ticketdetail_becomechild><p><select id="become_Ticket"><option selected> </option></select></p></div>',
                '<input type="button" id="childticketbutton" class="blueButton" value="Koppel!"/>',
                '<div class=list_item_ticketdetail_label_modified><p>Laatst gewijzigd:</p></div>',
                '<div class=list_item_ticketdetail_message_modified><p>',params.modified,'</p></div>',
                '<input type="button" id="closeticketbutton" class="blueButton" value="Ticket sluiten"/>',
                '<input type="button" id="saveticketbutton" class="blueButton" value="Ticket opslaan"/>',
                '</div>',
                '</form>'];
            break;

            case 'ticket_detail_open':
            arr = [
            '<form id="TicketForm" method="post" action="">',
              '<div class="list_item_ticketdetail rounded">',
                '<div class=list_item_ticketdetail_title><input type="text" class="rounded" value="',params.title,'" id="ticket_title"></div>',
                '<div class="list_item_ticketdetail_status rounded"><p>status: ',params.status,'</p></div>',
                '<div class="list_item_ticketdetail_label_created rounded">',
                  '<div class=list_item_ticketdetail_label><p>bericht:</p></div>',
                  '<div class=list_item_ticketdetail_created><p>tijd bericht: ',params.created,'</p></div>',
                '</div>',
                '<textarea rows="1" cols="1" id="ticket_text" name="text" class="rounded" maxlength="700">',params.text,'</textarea>',
                '<div class=list_item_ticketdetail_label_loc><p>Locatie:</p></div>',
                '<div class=list_item_ticketdetail_location><input type="text" class="rounded" value="',params.location,'" id="ticket_location"></div>',
                '<div class=list_item_ticketdetail_label_handle><p>Voertuig:</p></div>',
                '<div class=list_item_ticketdetail_handle><select id="ticket_Handle"><option selected></option></select></div>',
                '<div class=list_item_ticketdetail_label_owner><p>WLer:</p></div>',
                '<div class=list_item_ticketdetail_owner><select id="owner"><option selected>',params.wluser,'</option></select></div>',
                '<div class="list_item_ticketdetail_label_becomechild"><p>Koppel aan <BR> ticket:</p></div>',
                '<div class=list_item_ticketdetail_becomechild><p><select id="become_Ticket"><option selected> </option></select></p></div>',
                '<input type="button" id="childticketbutton" class="blueButton" value="Koppel!"/>',
                '<div class=list_item_ticketdetail_label_modified><p>Laatst gewijzigd:</p></div>',
                '<div class=list_item_ticketdetail_message_modified><p>',params.modified,'</p></div>',
                '<input type="button" id="closeticketbutton" class="blueButton" value="Ticket sluiten"/>',
                '<input type="button" id="saveticketbutton" class="blueButton" value="Ticket opslaan"/>',
                '</div>',
                '</form>'];
            break;

            case 'ticket_detail_closed':
            arr = [
            '<form id="TicketForm" method="post" action="">',
              '<div class="list_item_ticketdetail rounded">',
                '<div class=list_item_ticketdetail_title><input type="text" class="rounded" value="',params.title,'" id="ticket_title"></div>',
                '<div class="list_item_ticketdetail_status rounded"><p>status: ',params.status,'</p></div>',
                '<div class="list_item_ticketdetail_label_created rounded">',
                  '<div class=list_item_ticketdetail_label><p>bericht:</p></div>',
                  '<div class=list_item_ticketdetail_created><p>tijd bericht: ',params.created,'</p></div>',
                '</div>',
                '<textarea rows="1" cols="1" id="ticket_text" name="text" class="rounded" maxlength="700">',params.text,'</textarea>',
                '<div class=list_item_ticketdetail_label_loc><p>Locatie:</p></div>',
                '<div class=list_item_ticketdetail_location><input type="text" class="rounded" value="',params.location,'" id="ticket_location"></div>',
                '<p class="list_item_ticketdetail_label_handle">Voertuig:</p>',
                '<div class=list_item_ticketdetail_handle><p><select id="ticket_Handle"><option selected> </option></select></p></div>',
                '<div class="list_item_ticketdetail_label_owner"><p>WLer:</p></div>',
                '<div class="list_item_ticketdetail_owner"><select id="owner"><option selected>',params.wluser,'</option></select></div>',
                '<div class="list_item_ticketdetail_label_becomechild"><p>Koppel aan <BR> ticket:</p></div>',
                '<div class=list_item_ticketdetail_becomechild><p><select id="become_Ticket"><option selected> </option></select></p></div>',
                '<input type="button" id="childticketbutton" class="blueButton" value="Koppel!"/>',
                '<div class=list_item_ticketdetail_label_modified><p>Laatst gewijzigd:</p></div>',
                '<div class=list_item_ticketdetail_message_modified><p>',params.modified,'</p></div>',
                '<input type="button" id="saveticketbutton" class="blueButton" value="Heropen Ticket"/>',
                '</div>',
                '</form>'];
            break;

            case 'subticket_detail':
            arr = [
            '<form id="TicketForm" method="post" action="">',
              '<div class="list_item_ticketdetail rounded">',
                '<div class=list_item_ticketdetail_title><input type="text" class="rounded" value="',params.title,'" id="ticket_title"></div>',
                '<div class="list_item_ticketdetail_status rounded"><p>status: ',params.status,'</p></div>',
                '<div class="list_item_ticketdetail_label_created rounded">',
                  '<div class=list_item_ticketdetail_label><p>bericht:</p></div>',
                  '<div class=list_item_ticketdetail_created><p>tijd bericht: ',params.created,'</p></div>',
                '</div>',
                '<textarea rows="1" cols="1" id="ticket_text" name="text" class="rounded" maxlength="700">',params.text,'</textarea>',
                '<div class=list_item_ticketdetail_label_loc><p>Locatie:</p></div>',
                '<div class=list_item_ticketdetail_location><input type="text" class="rounded" value="',params.location,'" id="ticket_location"></div>',
                '<div class=list_item_ticketdetail_label_handle><p>Voertuig:</p></div>',
                '<div class=list_item_ticketdetail_handle><select id="ticket_Handle"><option selected></option></select></div>',
                '<div class="list_item_ticketdetail_label_becomechild"><p>Koppel aan <BR> ticket:</p></div>',
                '<div class=list_item_ticketdetail_becomechild><p><select id="become_Ticket"><option selected> </option></select></p></div>',
                '<input type="button" id="childticketbutton" class="blueButton" value="Koppel!"/>',
                '<input type="button" id="becomeparentticketbutton" class="blueButton" value="Koppel los!"/>',
                '<div class=list_item_ticketdetail_label_modified><p>Laatst gewijzigd:</p></div>',
                '<div class=list_item_ticketdetail_message_modified><p>',params.modified,'</p></div>',
                '<input type="button" id="saveticketbutton" class="blueButton" value="Ticket opslaan"/>',
                '</div>',
                '</form>'];
            break;

        }


        // A single array join is faster than
        // multiple concatenations

        return arr.join('');

    },

    //highlight (add rvdlog.css .highlight)
    highlightHandles : function(elem, groups) {
        elem.removeHighlight();
        if (logging.data.groupsLoaded) {
            for (i = 0; i < groups.length; i++) {
                var grp = groups[i].handles;
                for (j = 0; j < grp.length; j++) {
                    elem.highlight(grp[j].handle_name);
                    elem.highlight(grp[j].description);
                }
            }
        }
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