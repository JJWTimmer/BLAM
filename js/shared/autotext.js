function Autotext(pane) {
    //constructor
    var self = this;
    var pane = pane;
    var TimeOut = null;


    //could be optimized to cache handles in a variable (make a function loadHandles and a variable HandlesLoaded)
    this.fillAutotext = function () {
        //update select handles in ticketDetails
        $.tzPOST('getAutotext', function (r) {
            if (!r.error) {
                pane.empty()
                var autotext_options = pane.attr('options');
                autotext_options[0] = new Option("selecteer tekst", "");
                for (var i = 0; i < r.length; i++) {
                    if (r[i]) {

                        //add the autotexts to the select
                        autotext_options[autotext_options.length] = new Option(r[i].text, r[i].text);

                    }
                }
            }
            else {
                general.displayError(r.error);
            }
        });
    };


}
