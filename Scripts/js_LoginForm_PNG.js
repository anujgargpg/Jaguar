$(window).on("load resize", function (e) {
    $("img.bg-img").hide();
    var $url = $("img.bg-img").attr("src");
    $('.full-background').css('backgroundImage', 'url(' + $url + ')');
    $(".login-img").css({
        "margin-top": ($(window).height() - $(".login-img").outerHeight()) / 2 + "px"
    });
    $('.loginfrm').css({
        "margin": ($(window).height() - $(".loginfrm").outerHeight()) / 2 + "px auto 0"
        //"margin-left": ($(window).width() - $(".loginfrm").outerWidth()) * 3 / 4 + "px"
    });
    $('input[type="text"], input[type="password"]').focus(function () {
        $(this).data('placeholder', $(this).attr('placeholder')).attr('placeholder', '');
    }).blur(function () {
        $(this).attr('placeholder', $(this).data('placeholder'));
    });
});

function fnReset() {
    document.getElementById("txtUserName").value = "";
    document.getElementById("txtPassword").value = "";
    document.getElementById("txtUserName").focus();
    return false;
}
function fnValidate() {
    if (document.getElementById("txtUserName").value == "") {
        alert("User name can't be left blank");
        document.getElementById("txtUserName").focus();
        return false;
    }
    //else if (document.getElementById("txtPassword").value == "") {
    //    alert("Password can't be left blank");
    //    document.getElementById("txtPassword").focus();
    //    return false;
    //}
    else
        return true;
}
function fnSetFocus() {
    //
}