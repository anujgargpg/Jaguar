function AutoHideAlertMsg(msg) {
    var str = "<div id='divAutoHideAlertMsg' style='width: 100%; background-color: transparent; top: 0; position: fixed; z-index: 999; text-align: center; opacity: 0;'>";
    str += "<span style='font-size: 0.9rem; font-weight: 700; color: #fff; padding: 6px 16px; border-radius: 4px; background-color: #202020; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.6), 0 6px 20px 0 rgba(0, 0, 0, 0.2)'>";
    str += msg;
    str += "</span>";
    str += "</div>";
    $("body").append(str);

    $("#divAutoHideAlertMsg").animate({
        top: '100px',
        opacity: '1'
    }, "slow");

    //---------------------------------------------
    setTimeout(function () {
        $("#divAutoHideAlertMsg").animate({
            top: '0px',
            opacity: '0'
        }, "slow");
    }, 3000);
    setTimeout(function () {
        $("#divAutoHideAlertMsg").remove();
    }, 3500);

}