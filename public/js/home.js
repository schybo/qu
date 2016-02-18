$(document).ready(function () {
    $('.ui.search.dropdown').dropdown();
});

var ViewModel = function() {
    //We can do this after the document.ready to get the term if necessary
    var self = this;
    self.campus = ko.observable('');
    self.days = ko.observable('');
    self.dayTime = ko.observable('');
    self.courses = ko.observableArray();
    self.level = ko.observable('');

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
        return self.days() == "W" || self.days() == "T";
    }, this);

    var createCourse = function(course, section, online, abroad) {
        newCourse = {};
        newCourse.titleText = course.subject + " " + course.catalog_number + ' - ' + course.title;

        if (online) {
            newCourse.profLocationText = section.instructors[0] + " | Online";
            newCourse.timeText = 'Online';
        } else if (abroad) {
            newCourse.profLocationText = "Not Applicable | Abroad";
            newCourse.timeText = 'Abroad';
        } else {
            newCourse.profLocationText = section.instructors[0] + " | " + section.location.building + " " + section.location.room;

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

            newCourse.timeText = section.date.weekdays + " " +
                   section.date.start_time + ' - ' +
                   section.date.end_time;
        }

        newCourse.full = course.enrollment_total >= course.enrollment_capacity;

        return newCourse;
    }

    var createCourseList = function (data) {
        var tempCourseList = [];
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
        self.courses(tempCourseList);
    }

    self.submit = function () {
        console.log("Hello");
        var form = $("#questForm");
        var action = form.attr('action');

        $("form").addClass('loading');
        $.post(action, $(form).serialize())
        .done(function (data) {
            $("form").removeClass('loading');
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