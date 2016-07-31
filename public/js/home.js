$(document).ready(function () {
    $('.ui.search.dropdown').dropdown();
    $('#calendar').fullCalendar({
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        defaultView: 'agendaWeek',
        eventLimit: true, // for all non-agenda views
        weekends: false,
        defaultDate: '2016-09-11',
        displayEventEnd: true,
        columnFormat: 'dddd',
        eventRender: function(event, element) {
            element.append( "<i class='remove circle icon close'></i>" );
            element.find(".close").click(function() {
               $('#calendar').fullCalendar('removeEvents',event._id);
            });
        }
    })
});

$(document).keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("#submit").click();
    }
});

var ViewModel = function() {
    var LAB = "Lab";
    var TUTORIAL = "Tutorial";
    var TEST = "Test";

    //We can do this after the document.ready to get the term if necessary
    var self = this;

    self.searched = ko.observable(false);
    self.campus = ko.observable('');
    self.days = ko.observable('');
    self.dayTime = ko.observable('');
    self.courses = ko.observableArray();
    self.labs = ko.observableArray();
    self.tutorials = ko.observableArray();
    self.tests = ko.observableArray();
    self.genres = ko.observableArray();
    self.genreMatches = ko.observableArray();
    self.level = ko.observable('');
    self.professor = ko.observable('');
    self.timeRange = ko.observable(false);
    self.startRange = ko.observable('');
    self.endRange = ko.observable('');

    self.courseMatches = ko.observable('Matches');
    self.labMatches = ko.observable('Matches');
    self.tutorialMatches = ko.observable('Matches');
    self.testMatches = ko.observable('Matches');

    self.currentSub = null;

    self.onlineAbroad = ko.pureComputed(function() {
        if (self.campus() == 'ONLN ONLINE' || self.campus() == 'OFF ABROAD') {
            self.days('');
            self.dayTime('');
            return true;
        } else {
            return false;
        }
    }, this);

    self.shortCourse = ko.pureComputed(function() {
        return self.days() == "MWF";
    }, this);

    self.superLongCourse = ko.pureComputed(function() {
        return self.days() == "M" || self.days() == "T" || self.days() == "W" || self.days() == "Th";
    }, this);

    var createCourse = function(course, section, online, abroad) {
        newCourse = {};
        newCourse.titleText = course.subject + " " + course.catalog_number + ' - ' + course.title;

        if (online) {
            section.instructors[0] = section.instructors[0] ? section.instructors[0] : 'TBD';
            newCourse.profLocationText = section.instructors[0] + " | Online";
            newCourse.timeText = 'Online';
        } else if (abroad) {
            newCourse.profLocationText = "Not Applicable | Abroad";
            newCourse.timeText = 'Abroad';
        } else {
            //Calculate the professor and location string
            section.instructors[0] = section.instructors[0] ? section.instructors[0] : 'TBD';
            section.location.building = section.location.building ? section.location.building : 'TBD';
            section.location.room = section.location.room ? section.location.room : '';

            newCourse.profLocationText = section.instructors[0] + " | " + section.location.building + " " + section.location.room;

            //Calculate the time string
            section.date.start_time = section.date.start_time ? section.date.start_time.replace(/^0+/, '') : '';
            section.date.end_time = section.date.end_time ? section.date.end_time.replace(/^0+/, '') : 'TBD';
            section.date.weekdays = section.date.weekdays ? section.date.weekdays : 'TBD';

            newCourse.timeText = section.date.weekdays + " " + section.date.start_time + ' - ' + section.date.end_time;
        }

        newCourse.type = course.section.indexOf("LAB") > -1 ? LAB :
                         course.section.indexOf("TUT") > -1 ? TUTORIAL :
                         course.section.indexOf("TST") > -1 ? TEST : null;
        newCourse.full = course.enrollment_total >= course.enrollment_capacity;
        newCourse.classNumber = course.class_number;
        newCourse.subject = course.subject;
        newCourse.catalogNumber = course.catalog_number
        newCourse.link = course.catalog_number > 500 ?
                         "http://www.ucalendar.uwaterloo.ca/SA/GRAD/1516/GRDcourse-" + course.subject + ".html#" + course.subject + course.catalog_number:
                         "http://www.ucalendar.uwaterloo.ca/1617/COURSE/course-" + course.subject + ".html#" + course.subject + course.catalog_number;


        return newCourse;
    }

    var createCourseList = function (data) {
        var tempCourseList = [];
        var testList = []; var tutorialList = []; var labList = []; var courseList = [];
        var genreList = []; var genreMatchesList = [];

        $.each(data, function (course) {
            course = data[course];
            if (course.campus == 'ONLN ONLINE') {
                tempCourseList.push(createCourse(course, course.classes[0], true));
            } else if (course.campus == 'OFF ABROAD') {
                tempCourseList.push(createCourse(course, course.classes[0], false, true));
            } else {
                $.each(course.filteredClasses, function (section) {
                    section = course.filteredClasses[section];
                    tempCourseList.push(createCourse(course, section));
                });
            }
        })

        $.each(tempCourseList, function (course) {
            course = tempCourseList[course];
            if (course.type == LAB) {
                labList.push(course);
            } else if (course.type == TUTORIAL) {
                tutorialList.push(course);
            } else if (course.type == TEST) {
                testList.push(course)
            } else {
                courseList.push(course);
            }
        })

        self.courses(courseList);
        self.labs(labList);
        self.tutorials(tutorialList);
        self.tests(testList);

        //Add them to the genres
        genreList.push(self.courses);
        genreList.push(self.labs);
        genreList.push(self.tutorials);
        genreList.push(self.tests);

        self.genres(genreList);

        self.courseMatches(courseList.length + ' Course Matches');
        self.labMatches(labList.length + ' Lab Matches');
        self.tutorialMatches(tutorialList.length + ' Tutorial Matches');
        self.testMatches(testList.length + ' Test Matches');

        //Add the matches to the genre matches list
        genreMatchesList.push(self.courseMatches);
        genreMatchesList.push(self.labMatches);
        genreMatchesList.push(self.tutorialMatches);
        genreMatchesList.push(self.testMatches);

        self.genreMatches(genreMatchesList);


        $('.ui.icon.button.compact').popup({
            position: 'top right',
            delay: {
              show: 600,
              hide: 0
            },
        })
    }

    self.like = function(data, event) {
        if (!$(event.currentTarget).hasClass('red')) {
            var data = {
                'catalogNumber': data.catalogNumber,
                'subject': data.subject
            }

            $.post('/like', data)
            .done(function (data) {
                $(event.currentTarget).addClass('red');
                console.log(data);
            })
            .fail(function (err) {
                errorMsg("Sorry, could not like course. Please try again");
                console.log(err);
            })
        } else {
            errorMsg("You've already liked this course");
        }
    }

    var addEvent = function(start, end, title, url, classNumber) {
        var event = {
                id       : classNumber,
                url      : url,
                title    : title,
                start    : start,
                end      : end,
                // editable : true
            }

        $('#calendar').fullCalendar('renderEvent', event, true);
    }

    self.add = function(data, event) {
        // console.log(data);

        if (data.timeText != "Online") {
            //Get start date of term
            var startDate = "2016-09-12"

            //Get the title
            var eventTitle = data.subject + data.catalogNumber;
            var eventUrl = data.url;
            var classNumber = data.classNumber;

            //Get the time
            var res = data.timeText.split(" ");
            var days = res[0];
            var start = res[1];
            start = start.length == 4 ? "0" + start : start;
            var end = res[3];
            end = end.length == 4 ? "0" + end : end;
            console.log(days);
            console.log(start);
            console.log(end);

            var eventStart = $.fullCalendar.moment.utc(startDate + " " + start + ":00");
            var eventEnd = $.fullCalendar.moment.utc(startDate + " " + end + ":00");

            //can probably do an array with underscore and check if its in
            if (days == "M" || days == "MW" || days == "MWF") {

                //could probably make an object and set title and url as attr and make a method to add event
                addEvent(eventStart, eventEnd, eventTitle, eventUrl, classNumber);

                if (days == "MW" || days == "MWF") {

                    eventStart = eventStart.add(2, 'days');
                    eventEnd = eventEnd.add(2, 'days');

                    addEvent(eventStart, eventEnd, eventTitle, eventUrl, classNumber);

                    if (days == "MWF") {
                        eventStart = eventStart.add(2, 'days');
                        eventEnd = eventEnd.add(2, 'days');

                        addEvent(eventStart, eventEnd, eventTitle, eventUrl, classNumber);
                    }
                }
            } else if (days == "T" || days == "TTh") {

                eventStart = eventStart.add(1, 'days');
                eventEnd = eventEnd.add(1, 'days');

                addEvent(eventStart, eventEnd, eventTitle, eventUrl, classNumber);

                if (days == "TTh") {
                    eventStart = eventStart.add(2, 'days');
                    eventEnd = eventEnd.add(2, 'days');

                    addEvent(eventStart, eventEnd, eventTitle, eventUrl, classNumber);
                }

            } else if (days == "W" || days == "WF") {

                eventStart = eventStart.add(2, 'days');
                eventEnd = eventEnd.add(2, 'days');

                addEvent(eventStart, eventEnd, eventTitle, eventUrl, classNumber);

                if (days == "WF") {
                    eventStart = eventStart.add(2, 'days');
                    eventEnd = eventEnd.add(2, 'days');

                    addEvent(eventStart, eventEnd, eventTitle, eventUrl, classNumber);
                }

            } else {
                eventStart = eventStart.add(3, 'days');
                eventEnd = eventEnd.add(3, 'days');

                addEvent(eventStart, eventEnd, eventTitle, eventUrl, classNumber);
            }
            successMsg("Course successfully added to calendar!");
        } else {
            //Should add to the bottom of the calendar?
        }
    }

    self.initTimeRange = function (data, event) {
        var icon = $(event.currentTarget).find("i");
        if (icon.hasClass('resize')) {
            icon.removeClass('resize horizontal');
            icon.addClass('list layout');
            self.timeRange(true);
        } else {
            icon.removeClass('list layout');
            icon.addClass('resize horizontal');
            self.timeRange(false);
        }
    }

    self.toggleTab = function(data, event) {
        $('#courseSearchHeader').toggleClass('active');
        $('#courseCalendarHeader').toggleClass('active');
        $('#courseSearch').toggleClass('active');
        $('#courseCalendar').toggleClass('active');

        //wastefull rendering, should be only on switch to calendar tab
        $('#calendar').fullCalendar('render');
        $('#calendar').fullCalendar('refetchEvents');
    }

    self.closeSuccessModal = function() {
        $('#successModal').modal('hide');
    }

    self.closeFailureModal = function() {
        $('#failureModal').modal('hide');
    }

    self.subscribe = function(data, event) {
        if (data.full) {
            self.currentSub = event.currentTarget;
            $('#subscriptionHeader').text(data.subject + ' ' +  data.catalogNumber + ' ' + 'Class Opening');
            $('#classNumber').val(data.classNumber);
            $('#classTitle').val(data.titleText);
            $('#subscriptionModal').modal('show');
        } else {
            errorMsg("Course is already open");
        }
    }

    function errorMsg(msg) {
        $("#error").text(msg).fadeIn().delay(3000).fadeOut(500);
    }

    function successMsg(msg) {
        $("#success").text(msg).fadeIn().delay(3000).fadeOut(500);
    }

    //Thank you SO: http://stackoverflow.com/questions/15083548/convert-12-hour-hhmm-am-pm-to-24-hour-hhmm
    function convertTo24Hour(time) {
        time = time.toLowerCase();
        var hours = parseInt(time.substr(0, 2));
        if(time.indexOf('am') != -1 && hours == 12) {
            time = time.replace('12', '0');
        }
        if(time.indexOf('pm')  != -1 && hours < 12) {
            time = time.replace(hours, (hours + 12));
        }
        return time.replace(/(am|pm)/, '');
    }

    var parseTime = function () {
        //Error if entered incorrectly?
        self.startRange(self.startRange() ? self.startRange() : "12:00am");
        self.endRange(self.endRange() ? self.endRange() : "11:59pm");

        var startTime = convertTo24Hour(self.startRange());
        var endTime = convertTo24Hour(self.endRange());
        startTime = startTime.length == 4 ? "0" + startTime : startTime;

        console.log(startTime + '-' + endTime);
        return startTime + '-' + endTime;
    }

    self.subscribeSubmit = function(data, event) {
        var form = $("#subscriptionForm");
        var action = form.attr('action');

        $.post(action, $(form).serialize())
        .done(function (data) {
            $(self.currentSub).addClass('green');
            $('#subscriptionModal').modal('hide');
            $('#successModal').modal('show');
            console.log(data);
        })
        .fail(function (err) {
            $('#subscriptionModal').modal('hide');
            $('#failureModal').modal('show');
            console.log(err);
        })
    }

    self.submit = function () {
        var form = $("#questForm");
        var action = form.attr('action');

        //Get correct time depending
        if (self.timeRange()) {
            $('input[name="time"]').remove();
            $('<input>').attr({'type': 'hidden', 'name': 'time'}).val(parseTime()).appendTo(form);
        } else {
            $('input[name="time"]').remove();
        }

        $("form").addClass('loading');
        $.post(action, $(form).serialize())
        .done(function (data) {
            $("form").removeClass('loading');
            self.searched(true);
            createCourseList(data);
        })
        .fail(function (data) {
            $("form").removeClass('loading');
            //Should issue an error here
            createCourseList(data);
        })
    }
};

ko.applyBindings(new ViewModel()); 