
var general = {

    // The render method generates the HTML markup 
    // that is needed by the other methods:
    render : function(template,params){
        
        var arr = [];
        switch(template){
            case 'loginTopBar':
                arr = [
                '<span><img src="',params.avatar,'" width="23" height="23" />',
                '<span class="name">username=',params.username,
                ' </span><spanclass="role">Role=',params.role,'</span><a href="" class="logoutButton rounded">Logout</a></span>'];
            break;
    
            case 'chatLine':
                arr = [
/*'<div class="message message-',params.messageid,' rounded">','<div class="avatar-info-div"><span class="avatar-span"> <img src="',params.avatar,'" width="23" height="23" onload="this.style.visibility=\'visible\'" /> </span><span class="info-span"> ',params.username,':<BR>',params.time,'</span></div><div class="text-div"><span class="text-span">',params.text,'</span></div></div>'];*/
'<div class="message message-',params.messageid,' rounded">','<div class="avatar-info-div"><table  style="padding-top:0; padding-bottom:0;"><tr><td class="avatar-td"><img src="',params.avatar,'" width="23" height="23" onload="this.style.visibility=\'visible\'" /> </td><td class=info-td> ',params.username, ':<BR>',params.time,'</td></tr></table></div><div class="text-div"><span class="text-span">',params.text,'</span></div></div>'];

            break;
                            
            case 'user':
                arr = [
                    '<div class="user" title="',params.name,'"><img src="',
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