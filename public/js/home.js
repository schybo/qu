$(document).ready(function () {
    $("#questForm").submit(function(e) {
        submitHandler("#questForm", $(this).attr('action'));
        return false;
    });
});