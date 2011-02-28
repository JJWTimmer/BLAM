
var general = {

    // The render method generates the HTML markup 
    // that is needed by the other methods:
    render : function(template,params){
        
        var arr = [];
        switch(template){
            case 'loginTopBar':
                              
                arr = [
                '<div class="Topbar_img"><img src="',params.avatar,'" width="32" height="32" /></div><table class="Topbar_table"><tr><th class="Topbar_headers">username</th><th class="Topbar_headers">Role</th></tr><tr>','<td class="Topbar_username">',params.username,'</td><td class="Topbar_role">',params.role,'</td></tr></table><a href="" class="logoutButton rounded">Logout</a></span>'];
                
            break;
    
            case 'messageLine':
                arr = [
                '<div class="message message-',params.messageid,' rounded">','<div class="avatar-info-div"><table><tr><td class="avatar-td"><img src="',params.avatar,'" width="23" height="23" onload="this.style.visibility=\'visible\'" /> </td><td class=info-td> ',params.username, ':<BR>',params.time,'</td></tr></table></div><div class="text-div"><span class="text-span">',params.text,'</span></div></div>'];
                
            break;
                            
            case 'user':
                arr = [
                    '<div class="user" title="',params.username,'"><img src="',
                    params.avatar,'" width="30" height="30" onload="this.style.visibility=\'visible\'" /></div>'
                ];
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