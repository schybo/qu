function printResults(data) {
    var list = $("#courseList");
    list.empty();
    $.each(data, function (course) {
        course = data[course];
        $.each(course.filteredClasses, function (section) {
            section = course.filteredClasses[section];
            console.log(section);

            var li = $('<div/>')
            .addClass('item')
            .appendTo(list);

            var i = $('<i/>')
            .addClass('large github middle aligned icon')
            .appendTo(li);

            var content = $('<div/>')
            .addClass('content')
            .appendTo(li);

            var header = $('<a/>')
            .addClass('header')
            .text(course.subject + " " + course.catalog_number + ' - ' + course.title)
            .appendTo(content);

            var time = description = '';
            if (course.campus == 'ONLN ONLINE') {
                description = section.instructors[0] + " | Online";
                time = 'Online';
            } else {
                description = section.instructors[0] + " | " + section.location.building + " " + section.location.room;

                if (section.date.start_time) {
                    section.date.start_time = section.date.start_time.replace(/^0+/, '');
                } else {
                    section.date.start_time = 'Unknown';
                }

                if (section.date.end_time) {
                    section.date.end_time = section.date.end_time.replace(/^0+/, '');
                } else {
                    section.date.end_time = 'Unknown';
                }

                time = section.date.weekdays + " " +
                       section.date.start_time + ' - ' +
                       section.date.end_time;
            }

            var description = $('<div/>')
            .addClass('description')
            .text(description)
            .appendTo(content);

            var time = $('<div/>')
            .addClass('description')
            .text(time)
            .appendTo(content);
        });
    })
}

function submitHandler(form, action, msgClass, msg) {
    var isFormValid = true;

    $(form + " .required input").each(function(){
        if ($.trim($(this).val()).length == 0){
            $(this).closest( ".form-group" ).addClass("highlight");
            isFormValid = false;
        }
        else{
            $(this).closest( ".form-group" ).removeClass("highlight");
        }
    });

    if (isFormValid) {
        // $("#loading").fadeIn(500);
        $.post(action, $(form).serialize())
        .done(function (data) {
            // $("#loading").fadeOut(500);
            printResults(data);
            // if (data == "Success") {
            //     successMsg(msg, msgClass);
            // } else {
            //     window.location.replace(data);
            // }
        })
        .fail(function (data) {
            console.log(data);
            // $("#loading").fadeOut(500);
            // errorMsg(data.responseText, msgClass || "white");
        })
    }
}