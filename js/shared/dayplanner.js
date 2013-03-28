function DayPlanner(pane) {
    //constructor
    var self = this;
    var pane = pane;
    var TimeOut = null;
    var currentDate;
    this.init = function () {

        pane.getContentPane().empty();
        currentDate = new Date();
        var date = currentDate;
        var dateArray = general.convertDateToArray(currentDate);

        var params_date = {date:(dateArray['day'] + "/" + dateArray['month'] + "/" + dateArray['year']), day:dateArray['weekday']};
        var markup_date = general.render('CalendarSelect', params_date);
        //pane.getContentPane().append(markup_date);
        $('#DaySelect').append(markup_date);

        for (var hour = 0; hour < 24; hour++) {
            var params_time = {time:(hour < 10 ? '0' : '' ) + hour + ':00', time_half:(hour < 10 ? '0' : '' ) + hour + ':30', index:hour + 1};
            var markup_time = general.render('CalendarHour', params_time)
            pane.getContentPane().append(markup_time);
        }

        pane.reinitialise();
    };

    this.getCurrentDate = function () {
        return currentDate;
    }

    this.refreshDate = function (selectedDate) {
        pane.getContentPane().empty();
        $('#DaySelect').empty();

        var dateArray = general.convertDateToArray(selectedDate);
        var params_date = {date:(dateArray['day'] + "/" + dateArray['month'] + "/" + dateArray['year']), day:dateArray['weekday']};
        var markup_date = general.render('CalendarSelect', params_date);
        //pane.getContentPane().append(markup_date);
        $('#DaySelect').append(markup_date);


        for (var hour = 0; hour < 24; hour++) {
            var params_time = {time:(hour < 10 ? '0' : '' ) + hour + ':00', time_half:(hour < 10 ? '0' : '' ) + hour + ':30', index:hour + 1};
            var markup_time = general.render('CalendarHour', params_time)
            pane.getContentPane().append(markup_time);
        }

        pane.reinitialise();

        self.getTasks();

        //update the time, but not the date
        var now = new Date();
        currentDate.setHours(now.getHours());
        currentDate.setMinutes(now.getMinutes());
        currentDate.setSeconds(now.getSeconds());

    }

    this.addTask = function () {
        //var markup = general.render('CalendarItem',null)
        //$(".cal-10").prepend(markup);
        //$( ".calendar_item" ).draggable({ axis: "y", snap: ".calendar_empty" });
        //$( ".calendar_item" ).draggable({ axis: "y"});
        //$(".calendar_empty").droppable({accept: ".calendar_item" , tolerance: 'pointer' , over: function( event, ui ) {
        //		$( ".calendar_item" ).find("p").html($(this).attr("id"));
        //		}
        //});
    }


    this.getTasks = function () {

        $.tzPOST('getReminders', {timestamp_day:general.generateTimestamp(currentDate)}, function (r) {
            if (r) {
                if (!r.error) {
                    for (var i = 0; i < r.length; i++) {
                        var strTime = general.stripToTime(r[i].begin).split(":");
                        var time_index = strTime[0] * 2 + 1;
                        if (strTime[1] >= 30) {
                            time_index += 1;
                        }

                        var markup = general.render('CalendarItem', r[i])
                        $(".cal-" + time_index).prepend(markup);
                    }
                }
                else {
                    general.displayError(r.error);
                }
            }
            else {

            }
        });
    };


    this.kill = function () {
        //alert(TimeOut);
        clearTimeout(TimeOut);
    }

}