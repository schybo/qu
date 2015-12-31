$(document).ready(function () {
    $("#questForm").submit(function(e) {
        submitHandler("#questForm", $(this).attr('action'));
        return false;
    });
    $('.ui.search.dropdown').dropdown();
});

var ViewModel = function() {
    //We can do this after the document.ready to get the term if necessary
    this.campus = ko.observable('');
    this.days = ko.observable('');
    this.dayTime = ko.observable('');

    this.onlineAbroad = ko.pureComputed(function() {
        if (this.campus() == 'ONLN ONLINE' || this.campus() == 'OFF ABROAD') {
            this.days('');
            this.dayTime('');
            return true;
        } else {
            return false;
        }
    }, this);

    this.shortCourse = ko.pureComputed(function() {
        return this.days() == "MWF";
    }, this);

    this.superLongCourse = ko.pureComputed(function() {
        return this.days() == "W" || this.days() == "T";
    }, this);
};

ko.applyBindings(new ViewModel()); 