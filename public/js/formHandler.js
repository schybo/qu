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
            console.log(data);
            $("#response").text(data);
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