var ht = 0;
function GetCurrentDate() {
    var d = new Date();
    var dat = d.getDate();
    var MonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (dat < 10) {
        dat = "0" + dat.toString();
    }
    return (dat + "-" + MonthArr[d.getMonth()] + "-" + d.getFullYear());
}
function Tooltip(container) {
    $(container).hover(function () {
        // Hover over code
        var title = $(this).attr('title');
        if (title != '' && title != undefined) {
            $(this).data('tipText', title).removeAttr('title');
            $('<p class="customtooltip"></p>')
                .appendTo('body')
                .css("display", "block")
                .html(title);
        }
    }, function () {
        // Hover out code
        $(this).attr('title', $(this).data('tipText'));
        $('.customtooltip').remove();
    }).mousemove(function (e) {
        var mousex = e.pageX;   //Get X coordinates
        var mousey = ht - (e.pageY + $('.customtooltip').height() - 50) > 0 ? e.pageY : (e.pageY - $('.customtooltip').height() - 40);   //Get Y coordinates
        $('.customtooltip')
            .css({ top: mousey, left: mousex })
    });
}
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
function fnfailed() {
    AutoHideAlertMsg("Due to some technical reasons, we are unable to process your request !");
    $("#dvloader").hide();
}

$(document).ready(function () {
    ht = $(window).height();
    $("#divReport").height(ht - ($("#Heading").height() + $("#Filter").height() + $("#divFooter").height() + 160));

    fnGetReport();
});

function fntypefilter() {
    var flgtr = 0;
    var filter = ($("#txtfilter").val()).toUpperCase();

    $("#tblReport").find("tbody").eq(0).find("tr").css("display", "none");
    $("#tblReport").find("tbody").eq(0).find("tr").each(function () {
        if ($(this)[0].innerText.toUpperCase().indexOf(filter) > -1) {
            $(this).css("display", "table-row");
            flgtr = 1;
        }
    });

    if (flgtr == 0) {
        $("#divHeader").hide();
        $("#divReport").hide();
        $("#divMsg").html("No Records found for selected Filters !");
    }
    else {
        $("#divHeader").show();
        $("#divReport").show();
        $("#divMsg").html('');
    }
}

function fnGetReport() {
    $("#txtfilter").val('');

    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();

    $("#dvloader").show();
    PageMethods.fnGetReport(fnGetReport_pass, fnfailed);
}
function fnGetReport_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divReport").html(res.split("|^|")[1]);

        var wid = $("#tblReport").width();
        var thead = $("#tblReport").find("thead").eq(0).html();
        $("#divHeader").html("<table id='tblReport_header' class='table table-bordered table-sm' style='margin-bottom:0; width:" + (wid - 1) + "px; min-width:" + (wid - 1) + "px;'><thead>" + thead + "</thead></table>");
        $("#tblReport").css("width", wid);
        $("#tblReport").css("min-width", wid);
        for (i = 0; i < $("#tblReport").find("th").length; i++) {
            var th_wid = $("#tblReport").find("th")[i].clientWidth;
            $("#tblReport_header").find("th").eq(i).css("min-width", th_wid);
            $("#tblReport_header").find("th").eq(i).css("width", th_wid);
            $("#tblReport").find("th").eq(i).css("min-width", th_wid);
            $("#tblReport").find("th").eq(i).css("width", th_wid);
        }
        $("#tblReport").css("margin-top", "-" + $("#tblReport_header")[0].offsetHeight + "px");
        Tooltip(".clsInform");

        $("#dvloader").hide();
    }
    else if (res.split("|^|")[0] == "1") {
        $("#dvloader").hide();

        $("#divReport").html("");
        $("#divHeader").html("");
        AutoHideAlertMsg(res.split("|^|")[1]);
    }
    else {
        $("#divReport").html("");
        $("#divHeader").html("");
        fnfailed();
    }
}

function fnSaveMapping() {
    var Arr = [];
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();

    var brand = "";
    $("#tblReport").find("tbody").eq(0).find("input[type='checkbox']:checked").each(function () {
        if (brand == "" && $(this).closest("tr").find("td").eq(2).find("input").eq(0).val() != "") {
            Arr.push({
                "col1": $(this).closest("tr").find("td").eq(2).find("input").eq(0).val(),
                "col2": "",
                "col3": $(this).closest("tr").attr("strid"),
                "col4": "0"
            });
        }
        else
            brand = $(this).closest("tr").find("td").eq(1).html();
    });

    if (brand != "") {
        AutoHideAlertMsg("Please enter the Sector Name for Brand - " + brand + " !");
        return false;
    }
    else if (Arr.length == 0) {
        AutoHideAlertMsg("Please Select the Brand(s) for Mapping  !");
        return false;
    }
    else {
        $("#dvloader").show();
        PageMethods.fnSaveMapping(Arr, LoginID, RoleID, UserID, fnSaveMapping_pass, fnfailed);
    }
}

function fnSaveMapping_pass(res) {
    if (res.split("|^|")[0] == "0") {
        AutoHideAlertMsg("Brand-Sector mapped successfully !");
        fnGetReport();
    }
    else {
        fnfailed();
    }
}

function fnUpdateButtonStatus() {
    if ($("#tblReport").find("tbody").eq(0).find("input[type='checkbox']:checked").length > 0) {
        $("#btnSaveMapping").attr("onclick", "fnSaveMapping();");
        $("#btnSaveMapping").removeClass("btn-secondary").addClass("btn-primary");
    }
    else {
        $("#btnSaveMapping").removeAttr("onclick");
        $("#btnSaveMapping").removeClass("btn-primary").addClass("btn-secondary");
    }
}
function fnChkAll() {
    if ($("#chkAll").is(":checked")) {
        $("#tblReport").find("tbody").eq(0).find("input[type='checkbox']").prop("checked", true);
    }
    else {
        $("#tblReport").find("tbody").eq(0).find("input[type='checkbox']").removeAttr("checked");
    }

    fnUpdateButtonStatus();
}
function fnChk(ctrl) {
    $("#chkAll").removeAttr("checked");
    fnUpdateButtonStatus();
}