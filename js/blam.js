
var general = {

    // The render method generates the HTML markup
    // that is needed by the other methods:
    render : function(template,params){

        var arr = [];

        switch(template){
            case 'logging-loginTopBar':

                arr = [
                '<div class="Topbar_img"><img src="img/',user.getAvatar(),'" width="30" height="30" /></div>',
                '<table class="Topbar_table">',
                '<tr><th class="Topbar_info">username</th>',
                '<th class="Topbar_info">Role</th>',
                '<td rowspan="2"><p valign="middle">Logging</p></td>',
                '<td rowspan="2">&nbsp;<a href="ticketing.html" target="_self" valign="middle">Ticketing</a></td>',
                '<td rowspan="2">&nbsp;<a href="scheduling.html" target="_self" valign="middle">Scheduling</a></td>',
                '<td rowspan="2">&nbsp;<a href="php/archief.php" target="_self" valign="middle"> Archief</a></td>',
                '</tr>',
                '<tr>',
                '<td class="Topbar_info">',user.getUsername(),'</td>',
                '<td class="Topbar_info">',user.getRole(),'</td>',
                '</tr></table>',
                '<a href="" class="logoutButton rounded">Logout</a></span>'];

            break;

            case 'ticketing-loginTopBar':

                arr = [
                '<div class="Topbar_img"><img src="img/',user.getAvatar(),'" width="30" height="30" /></div>',
                '<table class="Topbar_table">',
                '<tr><th class="Topbar_info">username</th>',
                '<th class="Topbar_info">Role</th>',
                '<td rowspan="2"><a href="logging.html" target="_self" valign="middle">Logging</a></td>',
                '<td rowspan="2"><p valign="middle">&nbsp;Ticketing</p></td>',
                '<td rowspan="2">&nbsp;<a href="scheduling.html" target="_self" valign="middle">Scheduling</a></td>',
                '<td rowspan="2">&nbsp;<a href="php/archief.php" target="_self" valign="middle"> Archief</a></td>',
                '<td rowspan="2" valign="middle"><input type="button" id="handlelist_toggle_button" value="Roepnamenlijst uit"/></td>',
                '<td rowspan="2" valign="middle"><input type="button" id="searchtickets_toggle_button" value="Tickets zoeken aan"/></td>',
                '<th rowspan="2" valign="middle"><div class="Topbar_nr_users"></div></th>',
                '</tr>',
                '<tr>','<td class="Topbar_info">',user.getUsername(),'</td>',
                '<td class="Topbar_info">',user.getRole(),'</td>',
                '</tr></table>',
                '<div class="Topbar_users"></div></td>',
                '<a href="" class="logoutButton rounded">Logout</a></span>'];

            break;
            
            case 'scheduling-loginTopBar':

                arr = [
                '<div class="Topbar_img"><img src="img/',user.getAvatar(),'" width="30" height="30" /></div>',
                '<table class="Topbar_table">',
                '<tr><th class="Topbar_info">username</th>',
                '<th class="Topbar_info">Role</th><td rowspan="2"><a href="logging.html" target="_self" valign="middle">Logging</a></td>',
                '<td rowspan="2">&nbsp;<a href="ticketing.html" target="_self" valign="middle">Ticketing</a></td>',
                '<td rowspan="2"><p valign="middle">&nbsp;Scheduling</p></td>',
                '<td rowspan="2">&nbsp;<a href="php/archief.php" target="_self" valign="middle"> Archief</a></td>',
                '<th rowspan="2" valign="middle"><div class="Topbar_nr_users"></div></th>',
                '</tr>',
                '<tr>','<td class="Topbar_info">',user.getUsername(),'</td>',
                '<td class="Topbar_info">',user.getRole(),'</td>',
                '</tr></table>',
                '<div class="Topbar_users"></div></td>',
                '<a href="" class="logoutButton rounded">Logout</a></span>'];

            break;

            case 'admin-loginTopBar':

                arr = [
                '<div class="Topbar_img"><img src="img/',params.avatar,'" width="30" height="30" /></div><table class="Topbar_table"><tr><th class="Topbar_info">username</th><th class="Topbar_info">Role</th><td><a href="../logging.html" target="_self" valign="middle">Logging</a></td><td><a href="../ticketing.html" target="_self" valign="middle">Ticketing</a></td></tr><tr>','<td class="Topbar_info">',params.username,'</td><td class="Topbar_info">',params.role,'</td></tr></table><a href="" class="logoutButton rounded">Logout</a></span>'];

            break;

            case 'messageLine':
            		if(params.ticket_id)
            		{
                arr = ['<div class="message message_hover message_ticket message-',params.id,' rounded" id=',params.id,'>','<div class="msg-avatar"><img src="img/',params.avatar,'" width="23" height="23" onload="this.style.visibility=\'visible\'" /></div><div class="msg-info"><p>',params.username, ':<BR>',params.time,'</p></div><div class="msg-text"><span class="text-span">',params.text,'</span></div></div>'];
              	}
              	else
              	{
              	arr = ['<div class="message message_hover message-',params.id,' rounded" id=',params.id,'>','<div class="msg-avatar"><img src="img/',params.avatar,'" width="23" height="23" onload="this.style.visibility=\'visible\'" /></div><div class="msg-info"><p>',params.username, ':<BR>',params.time,'</p></div><div class="msg-text"><span class="text-span">',params.text,'</span></div></div>'];
              	}
            break;

            case 'user':
                var new_avatar=params.avatar;
                if((params.avatar=="")||(params.avatar=="NULL"))
                {
                var new_avatar="unknown30x30.png";
                }
                arr = [
                    '<div class="user" title="',params.username,'"><img src="img/',
                    new_avatar,'" width="30" height="30" onload="this.style.visibility=\'visible\'" /></div>'
                ];
            break;

            case 'groups':
                arr = [
                    '<div class="list_item_first rounded" id=group-',params.id,' visible="1"><p>',params.name,'</p></div>'
                ];
            break;

            case 'handles':
                arr = [
                    '<div class="list_item_second rounded group-',params.groupid,'"><div class=list_item_handle_name><p>',params.handle_name,'</p></div><div class=list_item_handle_description><p>',params.description,'</p></div></div>'
                ];
            break;

						case 'ticket_container':
								arr = ['<div class="ticket ticket-',params.id,'" id="',params.id,'">'];
						break;

            case 'parentticket':
                if(params.wluser==null && (params.role=="WL" || params.role=="Admin")){
                arr = [
                    '<div class="list_item_first parent_ticket rounded" id="',params.id,'">',
                    '<div class="list_item_parent_ticket_title rounded" id="',params.id,'"><p>',params.id,': ',params.title,'</p></div>',
                    '<div class="list_item_parent_ticket_claim rounded" id="',params.id,'"><p>claim</p></div>',
                    '</div>'
                ];
                }
                else
                {
                arr = [
                    '<div class="list_item_first parent_ticket rounded" id="',params.id,'">',
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
                    '<p><b>Locatie:</b>',params.location,'</p>',
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
                    '<div class="list_item_indent_second child_ticket rounded" id="',params.id,'" title="',params.parent_id,'"><p>',params.id,': ',params.title,'</p></div>'
                ];
            break;

            case 'feedback':
                arr = [
                    '<div class="list_item_first rounded" id="',params.id,'"><p>',params.title,'</p></div>'
                ];
            break;

            case 'openfeedback_expanded':
                arr = [
                    '<div class="list_item_feedback_expanded rounded" id="',params.id,'">',
                    '<p><b>Terugmelding:</b></p><p>',params.message,'</p>',
                    '<p><b>WL contactpersoon: </b>',params.wl_user,'</p>',
                    '<p><b>Ingevoerd op: </b>',params.created,'</p>',
                    '<input type="button" id="closefeedback" class="blueButton" value="Terugmelding sluiten"/>',
                    '</div>'
                ];
            break;

            case 'closedfeedback_expanded':
                arr = [
                    '<div class="list_item_feedback_expanded rounded" id="',params.id,'">',
                    '<p><b>Terugmelding:</b></p><p>',params.message,'</p>',
                    '<p><b>WL contactpersoon: </b>',params.wl_user,'</p>',
                    '<p><b>Ingevoerd op: </b>',params.created,'</p>',
                    '<p><b>Afgehandeld door: </b>',params.called_by,'</p>',
                    '<p><b>Afgehandeld op: </b>',params.called,'</p>',
                    '</div>'
                ];
            break;


            case 'feedbackTBOpen':
                arr = [
                    '<div class="updatefeedback_holder rounded" id="',params.id,'">',
                    '<div class="updatefeedback_header">',
                      '<p text-align="left">Terugmelding:</p>',
                    '</div>',
                      '<div class="feedback_item rounded">',
                        '<p>',params.message,'</p>',
                        '<p class="updatefeedback_time"> gecre&euml;erd op: ',general.stripToTime(params.created),'</p>',
                      '</div>',
                    '</div>'
                ];
            break;

            case 'feedbackTBClosed':
                arr = [
                    '<div class="updatefeedback_holder rounded" id="',params.id,'">',
                    '<div class="updatefeedback_header">',
                      '<p text-align="left">Afgeronde Terugmelding:</p>',
                    '</div>',
                      '<div class="feedback_item rounded">',
                        '<p>',params.message,'</p>',
                        '<p class="updatefeedback_time"> gecre&euml;erd op: ',general.stripToTime(params.created),' afgerond op:',general.stripToTime(params.called),' door:',params.calledby,'</p>',
                      '</div>',
                    '</div>'
                ];
            break;

            case 'updateTB':
                arr = [
                '<div class="updatefeedback_holder rounded" id="',params.id,'">',
                    '<div class="updatefeedback_header">',
                      '<p text-align="left">Update:</p>',
                    '</div>',
                    '<div class="update_item rounded" id="',params.id,'">',
                    '<p>',params.message,'</p>',
                    '<p class="updatefeedback_time"> gecre&euml;erd op: ',general.stripToTime(params.created),'</p>',
                    '</div>',
                '</div>'
                ];
            break;

						case 'ticket_detail_new':
            arr = [
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Titel:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" readonly="readonly" value="',params.id,':" id="ticket_id">',
            '<input type="text" class="rounded" value="',params.title,'" id="ticket_title"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Status:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" readonly="readonly" value="',params.status,'" id="ticket_status"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Bericht:</p></div>',
            '<div class=ticketdetaildescription><textarea rows="1" cols="1" id="ticket_text" name="text" class="rounded" maxlength="700">',params.text,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Locatie:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" value="',params.location,'" id="ticket_location"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Oplossing:</p></div>',
            '<div class=ticketdetaildescription><textarea rows="1" cols="1" id="ticket_oplossing" name="solution" class="rounded" maxlength="500">',params.solution,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><p class="white">gecre&euml;erd op: ',general.stripToTime(params.created),'</p></div>',
            '<div class=ticketdetailright><p class="white">gewijzigd om: ',general.stripToTime(params.modified),'</p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft>',
            '<div class=ticketdetailleft><p class="white">Voertuig:</p></div>',
            '<div class=ticketdetailright><p><select id="ticket_Handle"><option selected></option></select></p></div>',
            '</div>',
            '<div class=ticketdetailright>',
            '<div class=ticketdetailleft><p class="white">Referentie:</p></div>',
            '<div class=ticketdetailright><input type="text" class="rounded" value="',params.reference,'" id="ticket_reference"></div>',
            '</div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Koppel aan: </p></div>',
            '<div class=ticketdetaildescription>',
            '<div class=ticketdetailleft><p><select id="become_Ticket"><option selected> </option></select></p></div>',
            '<div class=ticketdetailright><input type="button" id="childticketbutton" class="blueButton" value="Koppel!"/></div>',
            '</div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><input type="button" id="saveticketbutton" class="blueButton" value="Ticket opslaan"/></div>',
            '<div class=ticketdetailright><input type="button" id="closeticketbutton" class="blueButton" value="Ticket sluiten"/></div>',
            '</div>',
            '<hr id=ticketdetail_line>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><p class="white">Update:</p></div>',
            '<div class=ticketdetailright><p class="white">Terugmelding:</p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><textarea rows="1" cols="1" id="ticket_update" name="update" class="rounded" maxlength="500">',,'</textarea></div>',
            '<div class=ticketdetailright><textarea rows="1" cols="1" id="ticket_feedback" name="feedback" class="rounded" maxlength="500">',,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><input type="button" id="saveupdatebutton" class="blueButton" value="Update opslaan"/></div>',
            '<div class=ticketdetailright><input type="button" id="savefeedbackbutton" class="blueButton" value="Terugmelding opslaan"/></div>',
            '</div>',
            '<div class=ticketdetail>','<input type="button" id="openmodalbutton" class="blueButton" value="Updates en Terugmeldingen Scherm"/>','</div>',
            ];
            break;
						
						case 'ticket_detail_open':
						arr = [
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Titel:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" readonly="readonly" value="',params.id,':" id="ticket_id">',
            '<input type="text" class="rounded" value="',params.title,'" id="ticket_title"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Status:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" readonly="readonly" value="',params.status,'" id="ticket_status"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Bericht:</p></div>',
            '<div class=ticketdetaildescription><textarea rows="1" cols="1" id="ticket_text" name="text" class="rounded" maxlength="700">',params.text,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Locatie:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" value="',params.location,'" id="ticket_location"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Oplossing:</p></div>',
            '<div class=ticketdetaildescription><textarea rows="1" cols="1" id="ticket_oplossing" name="solution" class="rounded" maxlength="500">',params.solution,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><p class="white">gecre&euml;erd op: ',general.stripToTime(params.created),'</p></div>',
            '<div class=ticketdetailright><p class="white">gewijzigd om: ',general.stripToTime(params.modified),'</p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft>',
            '<div class=ticketdetailleft><p class="white">Voertuig:</p></div>',
            '<div class=ticketdetailright><p><select id="ticket_Handle"><option selected></option></select></p></div>',
            '</div>',
            '<div class=ticketdetailright>',
            '<div class=ticketdetailleft><p class="white">Referentie:</p></div>',
            '<div class=ticketdetailright><input type="text" class="rounded" value="',params.reference,'" id="ticket_reference"></div>',
            '</div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft>',
            '<div class=ticketdetailleft><p class="white">WLer:</p></div>',
            '<div class=ticketdetailright><select id="owner"><option selected>',params.wluser,'</option></select></div>',
            '</div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Koppel aan: </p></div>',
            '<div class=ticketdetaildescription>',
            '<div class=ticketdetailleft><p><select id="become_Ticket"><option selected> </option></select></p></div>',
            '<div class=ticketdetailright><input type="button" id="childticketbutton" class="blueButton" value="Koppel!"/></div>',
            '</div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><input type="button" id="saveticketbutton" class="blueButton" value="Ticket opslaan"/></div>',
            '<div class=ticketdetailright><input type="button" id="closeticketbutton" class="blueButton" value="Ticket sluiten"/></div>',
            '</div>',
            '<hr id=ticketdetail_line>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><p class="white">Update:</p></div>',
            '<div class=ticketdetailright><p class="white">Terugmelding:</p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><textarea rows="1" cols="1" id="ticket_update" name="update" class="rounded" maxlength="500">',,'</textarea></div>',
            '<div class=ticketdetailright><textarea rows="1" cols="1" id="ticket_feedback" name="feedback" class="rounded" maxlength="500">',,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><input type="button" id="saveupdatebutton" class="blueButton" value="Update opslaan"/></div>',
            '<div class=ticketdetailright><input type="button" id="savefeedbackbutton" class="blueButton" value="Terugmelding opslaan"/></div>',
            '</div>',
            '<div class=ticketdetail>','<input type="button" id="openmodalbutton" class="blueButton" value="Updates en Terugmeldingen Scherm"/>','</div>',
            ];
						break;
																	
						case 'ticket_detail_closed':
            arr = [
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Titel:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" readonly="readonly" value="',params.id,':" id="ticket_id">',
            '<input type="text" class="rounded" value="',params.title,'" id="ticket_title"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Status:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" readonly="readonly" value="',params.status,'" id="ticket_status"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Bericht:</p></div>',
            '<div class=ticketdetaildescription><textarea rows="1" cols="1" id="ticket_text" name="text" class="rounded" maxlength="700">',params.text,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Locatie:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" value="',params.location,'" id="ticket_location"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Oplossing:</p></div>',
            '<div class=ticketdetaildescription><textarea rows="1" cols="1" id="ticket_oplossing" name="solution" class="rounded" maxlength="500">',params.solution,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><p class="white">gecre&euml;erd op: ',general.stripToTime(params.created),'</p></div>',
            '<div class=ticketdetailright><p class="white">gewijzigd om: ',general.stripToTime(params.modified),'</p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft>',
            '<div class=ticketdetailleft><p class="white">Voertuig:</p></div>',
            '<div class=ticketdetailright><p><select id="ticket_Handle"><option selected></option></select></p></div>',
            '</div>',
            '<div class=ticketdetailright>',
            '<div class=ticketdetailleft><p class="white">Referentie:</p></div>',
            '<div class=ticketdetailright><input type="text" class="rounded" value="',params.reference,'" id="ticket_reference"></div>',
            '</div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft>',
            '<div class=ticketdetailleft><p class="white">WLer:</p></div>',
            '<div class=ticketdetailright><select id="owner"><option selected>',params.wluser,'</option></select></div>',
            '</div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Koppel aan: </p></div>',
            '<div class=ticketdetaildescription>',
            '<div class=ticketdetailleft><p><select id="become_Ticket"><option selected> </option></select></p></div>',
            '<div class=ticketdetailright><input type="button" id="childticketbutton" class="blueButton" value="Koppel!"/></div>',
            '</div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><input type="button" id="saveticketbutton" class="blueButton" value="Heropen Ticket"/></div>',
            '</div>',
            '<hr id=ticketdetail_line>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><p class="white">Update:</p></div>',
            '<div class=ticketdetailright><p class="white">Terugmelding:</p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><textarea rows="1" cols="1" id="ticket_update" name="update" class="rounded" maxlength="500">',,'</textarea></div>',
            '<div class=ticketdetailright><textarea rows="1" cols="1" id="ticket_feedback" name="feedback" class="rounded" maxlength="500">',,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><input type="button" id="saveupdatebutton" class="blueButton" value="Update opslaan"/></div>',
            '<div class=ticketdetailright><input type="button" id="savefeedbackbutton" class="blueButton" value="Terugmelding opslaan"/></div>',
            '</div>',
            '<div class=ticketdetail>','<input type="button" id="openmodalbutton" class="blueButton" value="Updates en Terugmeldingen Scherm"/>','</div>',
            ];
            break;
						
						case 'subticket_detail':
            arr = [
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Titel:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" readonly="readonly" value="',params.id,':" id="ticket_id">',
            '<input type="text" class="rounded" value="',params.title,'" id="ticket_title"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Status:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" readonly="readonly" value="',params.status,'" id="ticket_status"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Bericht:</p></div>',
            '<div class=ticketdetaildescription><textarea rows="1" cols="1" id="ticket_text" name="text" class="rounded" maxlength="700">',params.text,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Locatie:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" value="',params.location,'" id="ticket_location"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Oplossing:</p></div>',
            '<div class=ticketdetaildescription><textarea rows="1" cols="1" id="ticket_oplossing" name="solution" class="rounded" maxlength="500">',params.solution,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><p class="white">gecre&euml;erd op: ',general.stripToTime(params.created),'</p></div>',
            '<div class=ticketdetailright><p class="white">gewijzigd om: ',general.stripToTime(params.modified),'</p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft>',
            '<div class=ticketdetailleft><p class="white">Voertuig:</p></div>',
            '<div class=ticketdetailright><p><select id="ticket_Handle"><option selected></option></select></p></div>',
            '</div>',
            '<div class=ticketdetailright>',
            '<div class=ticketdetailleft><p class="white">Referentie:</p></div>',
            '<div class=ticketdetailright><input type="text" class="rounded" value="',params.reference,'" id="ticket_reference"></div>',
            '</div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">gekoppeld aan: </p></div>',
            '<div class=ticketdetaildescription>',
            '<div class=ticketdetailleft><input type="text" readonly="readonly" class="rounded" value="','" id="become_Ticket"></div>',
            '<div class=ticketdetailright><input type="button" id="becomeparentticketButton" class="blueButton" value="Koppel los!"/></div>',
            '</div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><input type="button" id="saveticketbutton" class="blueButton" value="Ticket opslaan"/></div>',
            '</div>',
            '<hr id=ticketdetail_line>',
            '<div class=ticketdetail>','<input type="button" id="openmodalbutton" class="blueButton" value="Updates en Terugmeldingen Scherm"/>','</div>',
            ];
						break;
						
						
            case 'subticket_detail':
            arr = [
            '<form id="TicketForm" method="post" action="">',
              '<div class="list_item_ticketdetail rounded">',
                '<div class=list_item_ticketdetail_label_title><p>Titel:</p></div>',
                '<div class=list_item_ticketdetail_id><input type="text" class="rounded" value="',params.id,':" id="ticket_id" readonly="readonly"></div>',
                '<div class=list_item_ticketdetail_title><input type="text" class="rounded" value="',params.title,'" id="ticket_title"></div>',
                '<div class="list_item_ticketdetail_status rounded"><p>status: ',params.status,'</p></div>',
                '<div class=list_item_ticketdetail_time><p>gecre&euml;erd op: ',general.stripToTime(params.created),'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; gewijzigd om: ',general.stripToTime(params.modified),'</p></div>',
                '<div class=list_item_ticketdetail_label_ber><p>Bericht:</p></div>',
                '<textarea rows="1" cols="1" id="ticket_text" name="text" class="rounded" maxlength="700">',params.text,'</textarea>',
                '<div class=list_item_ticketdetail_label_loc><p>Locatie:</p></div>',
                '<div class=list_item_ticketdetail_location><input type="text" class="rounded" value="',params.location,'" id="ticket_location"></div>',
                '<div class=list_item_ticketdetail_label_opl><p>Oplossing:</p></div>',
                '<textarea rows="1" cols="1" id="ticket_oplossing" name="solution" class="rounded" maxlength="500">',params.solution,'</textarea>',
                '<div class=list_item_ticketdetail_label_handle><p>Voertuig:</p></div>',
                '<div class=list_item_ticketdetail_handle><select id="ticket_Handle"><option selected></option></select></div>',
                '<p class="list_item_ticketdetail_label_persoon">Referentie:</p>',
                '<div class=list_item_ticketdetail_persoon><input type="text" class="rounded" value="',params.reference,'" id="ticket_reference"></div>',
                '<div class="list_item_ticketdetail_label_becomechild"><p>gekoppeld aan:</p></div>',
                '<div class=list_item_ticketdetail_becomechild><input type="text" readonly="readonly" class="rounded" value="','" id="become_Ticket"></div>',
                '<input type="button" id="becomeparentticketButton" class="blueButton" value="Koppel los!"/>',
                '<input type="button" id="saveticketbutton" class="blueButton" value="Ticket opslaan"/>',
                '<hr id=ticketdetail_line>',
                '</div>',
                '</form>'];
            break;
            
            case 'task_detail':
            arr = [
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Titel:</p></div>',
            '<div class=ticketdetaildescription><input type="text" class="rounded" value="',params.title,'" id="task_title"></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">Taak:</p></div>',
            '<div class=ticketdetaildescription><textarea rows="1" cols="1" id="task_text" name="text" class="rounded" maxlength="700">',params.text,'</textarea></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">gebruiker:</p></div>',
            '<div class=ticketdetaildescription><p class="white"><p><select id="user"><option selected></option></select></p></div>',
            '</div>',            
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">backup gebruiker:</p></div>',
            '<div class=ticketdetaildescription><p class="white"><p><select id="backup_user"><option selected></option></select></p></div>',
            '</div>',            
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">groep:</p></div>',
            '<div class=ticketdetaildescription><p class="white">',params.grp,'</p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">gecre&euml;erd op:</p></div>',
            '<div class=ticketdetaildescription><p class="white">',general.stripToTime(params.created),'</p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">gewijzigd om: </p></div>',
            '<div class=ticketdetaildescription><p class="white">',general.stripToTime(params.modified),'</p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">begintijd:</p></div>',
            '<div class=ticketdetaildescription><p class="white"><p><select id="beginTijdSelect"><option selected></option></select></p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailname><p class="white">eindtijd:</p></div>',
            '<div class=ticketdetaildescription><p><select id="eindTijdSelect"><option selected></option></select></p></div>',
            '</div>',
            '<div class=ticketdetail>',
            '<div class=ticketdetailleft><input type="button" id="newtaskbutton" class="blueButton" value="Nieuwe Taak"/></div>',
            '<div class=ticketdetailright><input type="button" id="savetaskbutton" class="blueButton" value="Taak opslaan"/></div>',
            '</div>'
            ];
            break;
            
            case 'CalendarSelect':
                arr = [
                    '<div class="calendar_selectleft"><p><--</p></div><div class="calendar_selectday"><p>',params.day,' ',params.date,'</p></div><div class="calendar_selectright"><p>--></p></div>'
                ];
            break;
            
            case 'CalendarHour':
                arr = [
                    '<div class="list_item_hour rounded"><table class=""><tr><td rowspan="2" class="calendar_time"><p>',params.time,'</p></td><td class="calendar_empty cal-',params.index*2-1,'" id="',params.time,'"><p>&nbsp</p></td></tr><tr><td class="calendar_empty cal-',params.index*2,'" id="',params.time_half,'"><p>&nbsp</p></td></tr></table></div>'
                ];
            break;
            
            case 'CalendarItem':
                arr = [
                    '<div class="calendar_item rounded" id=',params.id,'><p>',general.stripToTime(params.begin),'-',general.stripToTime(params.end),': ',params.title,'</p></div>'
                ];
            break;

        }
						


        // A single array join is faster than
        // multiple concatenations

        return arr.join('');

    },

    //highlight (add rvdlog.css .highlight)
    highlightHandles : function(elem, groups) {
        elem.removeHighlight();
        //if (logging.data.groupsLoaded) {
            for (i = 0; i < groups.length; i++) {
                var grp = groups[i].handles;
                for (j = 0; j < grp.length; j++) {
                    elem.highlight(grp[j].handle_name);
                    elem.highlight(grp[j].description);
                }
            }
        //}
    },

// This method displays an error message on the top of the page:
    displayError : function(msg){

        var elem = $('<div>',{
            id      : 'ErrorMessage',
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

// This method displays saved message on the top of the page:
    displaySaved : function(msg){

        var elem = $('<div>',{
            id      : 'SavedMessage',
            html    : msg
        });

        elem.click(function(){
            $(this).fadeOut(function(){
                $(this).remove();
            });
        });

				//Changed to 0.5 seconds to reduce annoyance
        setTimeout(function(){
            elem.click();
        },500);

        elem.hide().appendTo('body').slideDown();
    },


    stripToTime : function(date_and_time){
    var strTime="";
        if(date_and_time) {

            // PHP returns the time in UTC (GMT). We use it to feed the date
            // object and later output it in the user's timezone. JavaScript
            // internally converts it for us.
            var date_time=date_and_time.split(" ");
            var time = date_time[1].split(":");
            var strTime=time[0]+':'+time[1];
            //d.setUTCHours(time[0],time[1]);
        }
    return strTime;
    },
    
    convertDateToArray : function(date){
    	var d  = date.getDate();
			var day = (d < 10) ? '0' + d : d;
			var m = date.getMonth() + 1;
			var month = (m < 10) ? '0' + m : m;
			var yy = date.getYear();
			var year = (yy < 1000) ? yy + 1900 : yy;
			
			var weekday=new Array(7);
			weekday[0]="Zondag";
			weekday[1]="Maandag";
			weekday[2]="Dinsdag";
			weekday[3]="Woensdag";
			weekday[4]="Donderdag";
			weekday[5]="Vrijdag";
			weekday[6]="Zaterdag";
			
			var date_array = {day : day, month : month, year : year, weekday : weekday[date.getDay()]};
			return date_array;
		},
			
    tb_open_new : function(jThickboxNewLink){
      tb_show(null,jThickboxNewLink,null);
    },
		
		
    generateTimestamp : function(date){
        if (date)
          {
            //date value is the time in ms from 1970. subtract the amount of ms needed to get a date in the past
            var d=date;
          }
          else
          {
        	  var d=new Date();
        	}
          //generate the timestamp format: YYYY-MM-DD hh:mm:ss
          var strTimestamp= d.getFullYear()+'-'+ ((d.getMonth()+1) < 10 ? '0' : '' )+ (d.getMonth()+1) + '-' + ((d.getDate()) < 10 ? '0' : '' )+ d.getDate() + ' ' + (d.getHours() < 10 ? '0' : '' ) + d.getHours()+':'+(d.getMinutes() < 10 ? '0':'') + d.getMinutes() + ':'+(d.getSeconds() < 10 ? '0':'') + d.getSeconds();
    return strTimestamp;
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