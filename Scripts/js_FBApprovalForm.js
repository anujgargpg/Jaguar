var ht = 0;
var MonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function GetCurrentDate() {
    var d = new Date();
    var dat = d.getDate();
    var MonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (dat < 10) {
        dat = "0" + dat.toString();
    }
    return (dat + "-" + MonthArr[d.getMonth()] + "-" + d.getFullYear());
}
function AddZero(str) {
    if (str.toString().length == 1)
        return "0" + str;
    else
        return str;
}
function Maxlvl(str) {
    var lvl = "0";
    if (str != "") {
        lvl = str.split("^")[0].split("|")[1];
        for (var i = 0; i < str.split("^").length; i++) {
            if (parseInt(str.split("^")[i].split("|")[1]) < parseInt(lvl))
                lvl = str.split("^")[i].split("|")[1];
        }
    }
    return lvl;
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
        var mousey = ht - (e.pageY + $('.customtooltip').height() + 50) > 0 ? e.pageY : (e.pageY - $('.customtooltip').height() - 40);   //Get Y coordinates
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
    $("#divReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 200));

    $(".clsDate").datepicker({
        dateFormat: 'dd-M-y'
    });

    $("#ddlStatus").html($("#ConatntMatter_hdnProcessGrp").val());

    $("#ddlQuarter").html($("#ConatntMatter_hdnQuarter").val().split("|^|")[0]);
    $("#ddlQuarter").val($("#ConatntMatter_hdnQuarter").val().split("|^|")[1]);
    $("#ConatntMatter_hdnQuarter").val($("#ddlQuarter").val());

    $("#ddlMSMPAlies").html($("#ConatntMatter_hdnMSMPAlies").val());
    $("#ddlMSMPAlies").multiselect({
        noneSelectedText: "--Select--"
    }).multiselectfilter();
    $("#ddlMSMPAlies").next().css({
        "height": "calc(1.5em + .5rem + 2px)",
        "font-size": "0.875rem",
        "font-weight": "400",
        "padding": "0.25rem 0 0 0.5rem",
        "padding-right": "0",
        "border-radius": ".2rem",
        "border-color": "#ced4da",
        "width": "180px"
    });
    $("#ddlMSMPAlies").next().find("span.ui-icon").eq(0).css({
        "margin": ".2rem 0",
        "margin-bottom": "0",
        "background-color": "transparent",
        "border": "none"
    });

    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    fnGetReport(1);
});

function fntypefilter() {
    var flgtr = 0, rowindex = 0;
    var filter = $("#txtfilter").val().toUpperCase().split(",");

    if ($("#txtfilter").val().toUpperCase().length > 2) {
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").css("display", "none");

        var flgValid = 0;
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td").eq(12).html().toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }

            if (flgValid == 1) {
                $(this).css("display", "table-row");
                flgtr = 1;
            }

            rowindex++;
        });

        if (flgtr == 0) {
            $("#divReport").hide();
            $("#divMsg").html("No Records found for selected Filters !");
        }
        else {
            $("#divReport").show();
            $("#divMsg").html('');
        }
    }
    else {
        $("#divReport").show();
        $("#divMsg").html('');

        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").css("display", "table-row");
    }
}
function fnResetFilter() {
    $("#txtProductHierSearch").attr("prodhier", "");
    $("#txtProductHierSearch").attr("prodlvl", "");
    $("#btnClusterFilter").attr("selectedstr", "");
    $("#txtChannelHierSearch").attr("prodhier", "");
    $("#txtChannelHierSearch").attr("prodlvl", "");

    $("#btnInitExpandedCollapseMode").show();
    $("#btnInitExpandedCollapseMode").html("Expanded Mode");
    $("#btnInitExpandedCollapseMode").attr("flgCollapse", "0");

    $("#txtfilter").val("");
    $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").css("display", "table-row");
    $("#tblleftfixed").find("tbody").eq(0).find("tr").css("display", "table-row");
    $("#divReport").show();
    $("#divMsg").html('');

    fnGetReport(0);
}

function fnGetReport(flg) {
    $("#txtfilter").val('');
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var ProdValues = [];
    var PrdString = $("#txtProductHierSearch").attr("prodhier");
    var LocValues = [];
    var LocString = $("#btnClusterFilter").attr("selectedstr");
    var ChannelValues = [];
    var ChannelString = $("#txtChannelHierSearch").attr("prodhier");
    var Qtr = MonthArr.indexOf($("#ddlQuarter").val().split("|")[0].split("-")[1]) + 1;
    var Yr = $("#ddlQuarter").val().split("|")[0].split("-")[2];
    var ProcessGroup = ""; //$("#ddlStatus").val();

    $("#ConatntMatter_hdnQuarter").val($("#ddlQuarter").val());

    if (PrdString != "") {
        for (var i = 0; i < PrdString.split("^").length; i++) {
            ProdValues.push({
                "col1": PrdString.split("^")[i].split("|")[0],
                "col2": PrdString.split("^")[i].split("|")[1],
                "col3": "1"
            });
        }
    }
    else {
        ProdValues.push({ "col1": "0", "col2": "0", "col3": "1" });
    }

    if (LocString != "") {
        for (var i = 0; i < LocString.split("^").length; i++) {
            LocValues.push({
                "col1": LocString.split("^")[i],
                "col2": "0",
                "col3": "5"
            });
        }
    }
    else {
        LocValues.push({ "col1": "0", "col2": "0", "col3": "2" });
    }

    if (ChannelString != "") {
        for (var i = 0; i < ChannelString.split("^").length; i++) {
            ChannelValues.push({
                "col1": ChannelString.split("^")[i].split("|")[0],
                "col2": ChannelString.split("^")[i].split("|")[1],
                "col3": "3"
            });
        }
    }
    else {
        ChannelValues.push({ "col1": "0", "col2": "0", "col3": "3" });
    }

    var ArrUser = [];
    for (var i = 0; i < $("#ddlMSMPAlies option:selected").length; i++) {
        ArrUser.push({ "col1": $("#ddlMSMPAlies option:selected").eq(i).val() });
    }
    if (ArrUser.length == 0)
        ArrUser.push({ "col1": 0 });

    $("#dvloader").show();
    PageMethods.fnGetReport(LoginID, RoleID, UserID, ProdValues, LocValues, ChannelValues, ProcessGroup, ArrUser, Qtr, Yr, fnGetReport_pass, fnfailed, flg);
}
function fnGetReport_pass(res, flg) {
    if (res.split("|^|")[0] == "0") {
        $("#divReport").html(res.split("|^|")[1]);
        if (res.split("|^|")[2] == "") {
            $("#divButtons").html('');
        }
        else {
            $("#divButtons").html(res.split("|^|")[2]);
        }

        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}


function fnBookmarkFilter() {
    var Bookmark = $("#ddlBookmark").val();

    $("#tblleftfixed").find("tbody").eq(0).find("tr").css("display", "table-row");
    $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").css("display", "table-row");
    switch (Bookmark) {
        case "0":
            //
            break;
        case "1":
            var rowindex = 0;
            $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").each(function () {
                if ($(this).attr("flgBookmark") == 0) {
                    $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).css("display", "none");
                    $(this).css("display", "none");
                }
                rowindex++;
            });
            break;
        case "2":
            var rowindex = 0;
            $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").each(function () {
                if ($(this).attr("flgBookmark") == 1) {
                    $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).css("display", "none");
                    $(this).css("display", "none");
                }
                rowindex++;
            });
            break;
    }
}

function fnManageBookMarkAll(ctrl) {
    var flgBookmark = "0";
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var ArrSBD = [];

    if ($(ctrl).attr("flgBookmark") == "0")
        flgBookmark = "1";
    else
        flgBookmark = "0";

    $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").each(function () {
        ArrSBD.push({
            "col1": $(this).attr("SBD")
        });
    });

    $("#dvloader").show();
    PageMethods.fnManageBookMark(flgBookmark, LoginID, UserID, ArrSBD, fnManageBookMarkAll_pass, fnfailed, flgBookmark);
}
function fnManageBookMarkAll_pass(res, flgBookmark) {
    if (res.split("|^|")[0] == "0") {
        var rowindex = 0;
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").each(function () {
            $(this).attr("flgBookmark", flgBookmark);
            $(this).find("td[iden='SBD']").eq(1).find("img").eq(0).attr("flgBookmark", flgBookmark);
            $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).find("td").eq(1).find("img").eq(0).attr("flgBookmark", flgBookmark);

            if (flgBookmark == "1") {
                $(this).find("td[iden='SBD']").eq(1).find("img").eq(0).attr("src", "../../Images/bookmark.png");
                $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).find("td").eq(1).find("img").eq(0).attr("src", "../../Images/bookmark.png");
            }
            else {
                $(this).find("td[iden='SBD']").eq(1).find("img").eq(0).attr("src", "../../Images/bookmark-inactive.png");
                $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).find("td").eq(1).find("img").eq(0).attr("src", "../../Images/bookmark-inactive.png");
            }

            rowindex++;
        });

        if (flgBookmark == "1") {
            $("#tblleftfixedHeader").find("thead").eq(0).find("img[iden='Bookmark']").eq(0).attr("flgBookmark", "1");
            $("#tblleftfixedHeader").find("thead").eq(0).find("img[iden='Bookmark']").eq(0).attr("src", "../../Images/bookmark.png");

        }
        else {
            $("#tblleftfixedHeader").find("thead").eq(0).find("img[iden='Bookmark']").eq(0).attr("flgBookmark", "0");
            $("#tblleftfixedHeader").find("thead").eq(0).find("img[iden='Bookmark']").eq(0).attr("src", "../../Images/bookmark-inactive.png");

        }

        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}

function fnManageBookMark(ctrl) {
    var rowIndex = $(ctrl).closest("tr").index();

    var flgBookmark = "0";
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var ArrSBD = [];

    if ($(ctrl).attr("flgBookmark") == "0")
        flgBookmark = "1";
    else
        flgBookmark = "0";

    ArrSBD.push({
        "col1": $(ctrl).closest("tr").attr("SBD")   //$("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex).attr("SBD")
    });

    $("#dvloader").show();
    PageMethods.fnManageBookMark(flgBookmark, LoginID, UserID, ArrSBD, fnManageBookMark_pass, fnfailed, rowIndex + "|" + flgBookmark);
}
function fnManageBookMark_pass(res, str) {
    if (res.split("|^|")[0] == "0") {
        var rowIndex = str.split("|")[0];
        var flgBookmark = str.split("|")[1];

        if (flgBookmark == "1") {
            $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex).attr("flgBookmark", "1");
            $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex).find("td[iden='SBD']").eq(1).html("<img src='../../Images/bookmark.png' title='Active Bookmark' flgBookmark='1' onclick='fnManageBookMark(this);'/>");
            $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).find("td").eq(1).html("<img src='../../Images/bookmark.png' title='Active Bookmark' flgBookmark='1' onclick='fnManageBookMark(this);'/>");

        }
        else {
            $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex).attr("flgBookmark", "0");
            $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex).find("td[iden='SBD']").eq(1).html("<img src='../../Images/bookmark-inactive.png' title='Active Bookmark' flgBookmark='0' onclick='fnManageBookMark(this);'/>");
            $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).find("td").eq(1).html("<img src='../../Images/bookmark-inactive.png' title='Active Bookmark' flgBookmark='0' onclick='fnManageBookMark(this);'/>");

            $("#tblleftfixedHeader").find("thead").eq(0).find("img[iden='Bookmark']").eq(0).attr("flgBookmark", "0");
            $("#tblleftfixedHeader").find("thead").eq(0).find("img[iden='Bookmark']").eq(0).attr("src", "../../Images/bookmark-inactive.png");

        }

        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}

function fnChkUnchkInitAll(ctrl) {
    if ($(ctrl).is(":checked")) {
        $("#tblReport").find("tbody").eq(0).find("input[type='checkbox']").prop("checked", true);

        if ($("#tblReport").find("tbody").eq(0).find("input[type='checkbox']:checked").length > 0) {
            $("#divButtons").find("a.btn").removeClass("btn-disabled");
            $("#divButtons").find("a.btn").attr("onclick", "fnSaveFinalAction(this);");
        }
    }
    else {
        $("#tblReport").find("tbody").eq(0).find("input[type='checkbox']").removeAttr("checked");

        $("#divButtons").find("a.btn").addClass("btn-disabled");
        $("#divButtons").find("a.btn").removeAttr("onclick");
    }
}
function fnUnchkInitIndividual(ctrl) {
    if (!($(ctrl).is(":checked"))) {
        $("#tblReport").find("thead").eq(0).find("input[type='checkbox']").removeAttr("checked");
    }

    if ($("#tblReport").find("tbody").eq(0).find("input[type='checkbox']:checked").length > 0) {
        $("#divButtons").find("a.btn").each(function () {
            $(this).removeClass("btn-disabled");
            $(this).attr("onclick", "fnSaveFinalAction(this);");
        });
    }
    else {
        $("#divButtons").find("a.btn").each(function () {
            $(this).addClass("btn-disabled");
            $(this).removeAttr("onclick");
        });
    }
}

function fnSaveFinalAction(ctrl) {
    var flgAction = $(ctrl).attr("flgAction");

    var RoleID = $("#ConatntMatter_hdnRoleID").val();   // 2: Admin
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var ArrSBD = [];

    var SBDName = "";
    if (flgAction != "5") {
        $("#tblReport").find("tbody").eq(0).find("tr").each(function () {
            if ($(this).find("input[type='checkbox']").length > 0) {
                if ($(this).find("input[type='checkbox']").is(":checked")) {
                    ArrSBD.push({
                        "col1": $(this).closest("tr").attr("sbd"),
                        "col2": flgAction,
                        "col3": ""
                    });

                }
            }
        });

        if (ArrSBD.length == 0) {
            AutoHideAlertMsg("Please select atleast one FB for Action !");
        }
        else {
            switch (flgAction.toString()) {
                case "4":       //Send for Approval
                    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to send <span style='color:#0000ff; font-weight: 700;'>" + ArrSBD.length + "</span> FB(s) for Approval.<br/>Do you want to continue ?</div>");
                    break;
                case "6":       //Approved
                    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to Approved <span style='color:#0000ff; font-weight: 700;'>" + ArrSBD.length + "</span> FB(s).<br/>Do you want to continue ?</div>");
                    break;
                case "7":       //Reject
                    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to Reject <span style='color:#0000ff; font-weight: 700;'>" + ArrSBD.length + "</span> FB(s).<br/>Do you want to continue ?</div>");
                    break;
                case "8":       //Mark as Released
                    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to mark <span style='color:#0000ff; font-weight: 700;'>" + ArrSBD.length + "</span> FB(s) As Released.<br/>Do you want to continue ?</div>");
                    break;
            }

            $("#divConfirm").dialog({
                "modal": true,
                "width": "320",
                "height": "200",
                "title": "Message :",
                close: function () {
                    $("#divConfirm").dialog('destroy');
                },
                buttons: [{
                    text: 'Yes',
                    class: 'btn-primary',
                    click: function () {
                        $("#divConfirm").dialog('close');

                        $("#dvloader").show();
                        PageMethods.fnSaveFinalAction(RoleID, LoginID, UserID, ArrSBD, fnSaveFinalAction_pass, fnfailed, flgAction);
                    }
                },
                {
                    text: 'No',
                    class: 'btn-primary',
                    click: function () {
                        $("#divConfirm").dialog('close');
                    }
                }]
            });

        }

    }
    else {
        $("#tblleftfixed").find("tbody").eq(0).find("tr").each(function () {
            if ($(this).find("input[type='checkbox'][iden='chkInit']").length > 0) {
                if ($(this).find("input[type='checkbox'][iden='chkInit']").is(":checked")) {
                    var rowIndex = $(this).closest("tr").index();

                    ArrSBD.push({
                        "col1": $(this).closest("tr").attr("sbd")
                    });
                }
            }
        });

        if (ArrSBD.length > 0) {
            PageMethods.fnGetAllRejectComments(RoleID, LoginID, UserID, ArrSBD, fnGetAllRejectComments_pass, fnfailed, flgAction);
        }
        else
            AutoHideAlertMsg("Please select atleast one FB for Action !");
    }
}
function fnGetAllRejectComments_pass(res, flgAction) {
    if (res.split("|^|")[0] == "0") {
        var strtbl = "";
        strtbl += "<table class='table table-striped table-bordered table-sm clstbl-Reject'>";
        strtbl += "<thead>";
        strtbl += "<tr><th>#</th><th>FB Name</th><th>Comments</th></tr>";
        strtbl += "</thead>";
        strtbl += "<tbody>";

        var jsonTbl = $.parseJSON(res.split("|^|")[1]).Table;
        for (var i = 0; i < jsonTbl.length; i++) {
            strtbl += "<tr SBD='" + jsonTbl[i].SBDID + "'>";
            strtbl += "<td>" + (i + 1).toString() + "</td>";
            strtbl += "<td>" + jsonTbl[i].SBDName + "</td>";
            strtbl += "<td><textarea style='width:100%; box-sizing: border-box;' rows='2'>" + jsonTbl[i].comments + "</textarea></td>";
            strtbl += "</tr>";
        }
        strtbl += "</tbody>";
        strtbl += "</table>";

        $("#divConfirm").html(strtbl);
        $("#divConfirm").dialog({
            "modal": true,
            "width": "70%",
            "height": "500",
            "title": "Comments :",
            close: function () {
                $("#divConfirm").dialog('destroy');
            },
            buttons: [{
                text: 'Submit Request',
                class: 'btn-primary',
                click: function () {
                    var RoleID = $("#ConatntMatter_hdnRoleID").val();
                    var LoginID = $("#ConatntMatter_hdnLoginID").val();
                    var UserID = $("#ConatntMatter_hdnUserID").val();

                    var SBDName = "", ArrSBD = [];
                    $("#divConfirm").find("tbody").eq(0).find("tr").each(function () {
                        ArrSBD.push({
                            "col1": $(this).attr("SBD"),
                            "col2": flgAction,
                            "col3": $(this).find("td").eq(2).find("textarea").eq(0).val()
                        });

                        if ($(this).find("td").eq(2).find("textarea").eq(0).val() == "" && SBDName == "") {
                            SBDName = $(this).find("td").eq(1).html();
                        }
                    });

                    if (SBDName == "") {
                        $("#divConfirm").dialog('close');

                        $("#dvloader").show();
                        PageMethods.fnSaveFinalAction(RoleID, LoginID, UserID, ArrSBD, fnSaveFinalAction_pass, fnfailed, flgAction);
                    }
                    else {
                        AutoHideAlertMsg("Please enter your Comments for " + SBDName);
                    }
                }
            },
            {
                text: 'Cancel',
                class: 'btn-primary',
                click: function () {
                    $("#divConfirm").dialog('close');
                }
            }]
        });
    }
    else {
        fnfailed();
    }
}
function fnSaveFinalAction_pass(res, flgAction) {
    if (res.split("|^|")[0] == "0") {
        switch (flgAction) {
            case "4":
                AutoHideAlertMsg("FB(s) send for approval !");
                break;
            case "6":
                AutoHideAlertMsg("FB(s) approved successfully !");
                break;
            case "7":
                AutoHideAlertMsg("FB(s) rejected !");
                break;
            case "8":
                AutoHideAlertMsg("FB(s) mark as released !");
                break;
            default:
                AutoHideAlertMsg("FB(s) submitted successfully !");
                break;
        }
        fnGetReport(0);
    }
    else {
        fnfailed();
    }
}

function fnExistingCombinationAtImportSBD(res) {
    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: justify;'>" + res.split("|^|")[1] + "</div>");
    $("#divConfirm").dialog({
        "modal": true,
        "width": "40%",
        "maxheight": "400",
        "title": "Message :",
        close: function () {
            $("#divConfirm").dialog('destroy');
        },
        buttons: [{
            text: 'Yes',
            class: 'btn-primary',
            click: function () {
                var QtrNo = $("#ddlQuarter").val().split("|")[2];
                var QtrYear = $("#ddlQuarter").val().split("|")[3];
                var ArrCluster = [];
                var ArrChannel = [];
                var UserID = $("#ConatntMatter_hdnUserID").val();
                var LoginID = $("#ConatntMatter_hdnLoginID").val();
                var RoleID = $("#ConatntMatter_hdnRoleID").val();
                var FromDATE = $("#ddlQuarter").val().split("|")[0];
                var EndDate = $("#ddlQuarter").val().split("|")[1];

                $("#divSBDWiseChannelClusterforImport").find("input[type='checkbox']:checked").each(function () {
                    if ($(this).closest("tr").attr("iden") == "cluster") {
                        ArrCluster.push({
                            "col1": $(this).closest("tr").attr("SBDID"),
                            "col2": $(this).closest("tr").attr("strId")
                        });
                    }
                    else {
                        ArrChannel.push({
                            "col1": $(this).closest("tr").attr("SBDID"),
                            "col2": $(this).closest("tr").attr("strId").split("|")[0],
                            "col3": $(this).closest("tr").attr("strId").split("|")[1]
                        });
                    }
                });

                $("#dvloader").show();
                PageMethods.fnImportSBD(QtrNo, QtrYear, ArrCluster, ArrChannel, UserID, LoginID, RoleID, FromDATE, EndDate, 1, fnImportSBD_pass, fnfailed);

                $("#divConfirm").dialog('close');
            }
        },
        {
            text: 'No',
            class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');
            }
        }]
    });
}

function fnExpandCollapseClusterChannelTbl(ctrl) {
    if ($(ctrl).attr("flgExpand") == "1") {
        $(ctrl).next().slideUp(1000);
        $(ctrl).attr("flgExpand", "0");
        $(ctrl).find("i").eq(0).addClass("fa-plus-square").removeClass("fa-minus-square");
    }
    else {
        $(ctrl).next().slideDown(1000);
        $(ctrl).attr("flgExpand", "1");
        $(ctrl).find("i").eq(0).addClass("fa-minus-square").removeClass("fa-plus-square");
    }
}

function fnSave(ctrl, flgDuplicate) {
    var lefttr = $(ctrl).closest("tr");
    var rowIndex = $(ctrl).closest("tr").index();
    var rttr = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex);

    var SBDID = lefttr.attr("SBD");
    var SBDName = "";                                           //lefttr.find("td").eq(3).find("textarea").eq(0).val();
    var strChannel = rttr.find("td[iden='SBD']").eq(4).find("img[iden='ProductHier']").eq(0).attr("ProdHier");
    var strLocation = rttr.find("td[iden='SBD']").eq(5).find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
    var strBaseProduct = rttr.find("td[iden='SBD']").eq(6).find("img[iden='BaseSBF']").eq(0).attr("SBFHiier");
    var FromDate = rttr.find("td[iden='SBD']").eq(7).find("input[type='text']").eq(0).val();
    var EndDate = rttr.find("td[iden='SBD']").eq(7).find("input[type='text']").eq(1).val();
    var Frequency = rttr.find("td[iden='SBD']").eq(8).find("select").eq(0).val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var QtrNo = $("#ddlQuarter").val().split("|")[2];
    var QtrYear = $("#ddlQuarter").val().split("|")[3];
    var Buckets = [];
    var BucketValues = [];
    var SBF = [];

    var copyChannelBucketID = rttr.find("td[iden='SBD']").eq(4).find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
    var copyLocationBucketID = rttr.find("td[iden='SBD']").eq(5).find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");

    if (strChannel == "") {
        AutoHideAlertMsg("Please select the Channel(s) !");
        return false;
    }
    else if (copyLocationBucketID == "0") {
        AutoHideAlertMsg("Please select the Cluster(s) !");
        return false;
    }
    else if (strBaseProduct == "") {
        AutoHideAlertMsg("Please select the SBF(s) !");
        return false;
    }
    else if (FromDate == "") {
        AutoHideAlertMsg("Please select the From Date !");
        return false;
    }
    else if (EndDate == "") {
        AutoHideAlertMsg("Please select the To Date !");
        return false;
    }
    else if (Frequency == "0") {
        AutoHideAlertMsg("Please select the Frequency !");
        return false;
    }
    else if (parseInt(FromDate.split("-")[2] + AddZero(MonthArr.indexOf(FromDate.split("-")[1])) + FromDate.split("-")[0]) > parseInt(EndDate.split("-")[2] + AddZero(MonthArr.indexOf(EndDate.split("-")[1])) + EndDate.split("-")[0])) {
        AutoHideAlertMsg("To-Date must be Greater than From-Date !");
        return false;
    }
    else {
        for (var i = 0; i < copyLocationBucketID.split("|").length; i++) {
            Buckets.push({
                "col1": copyLocationBucketID.split("|")[i],
                "col2": "5"
            });
        }
        for (var i = 0; i < copyChannelBucketID.split("|").length; i++) {
            Buckets.push({
                "col1": copyChannelBucketID.split("|")[i],
                "col2": "3"
            });
        }

        for (var i = 0; i < strChannel.split("^").length; i++) {
            BucketValues.push({
                "col1": strChannel.split("^")[i].split("|")[0],
                "col2": strChannel.split("^")[i].split("|")[1],
                "col3": "3"
            });
        }

        for (var i = 0; i < strBaseProduct.split("*").length; i++) {
            var base = strBaseProduct.split("*")[i].split("-")[0];
            var proxy = strBaseProduct.split("*")[i].split("-")[1];

            for (var j = 0; j < proxy.split("^").length; j++) {
                SBF.push({
                    "col1": base.split("|")[0],
                    "col2": base.split("|")[1],
                    "col3": proxy.split("^")[j].split("|")[0],
                    "col4": proxy.split("^")[j].split("|")[1],
                    "col5": base.split("|")[3]
                });
            }
        }

        $("#dvloader").show();
        PageMethods.fnSave(SBDID, SBDName, FromDate, EndDate, strChannel, strLocation, strBaseProduct, UserID, LoginID, RoleID, QtrNo, QtrYear, Buckets, BucketValues, SBF, flgDuplicate, Frequency, fnSave_pass, fnfailed, ctrl);
    }
}
function fnSave_pass(res, ctrl) {
    if (res.split("|^|")[0] == "0") {
        var SBDID = $(ctrl).closest("tr").attr("SBD");
        if (SBDID == "0")
            AutoHideAlertMsg("FB saved successfully !");
        else
            AutoHideAlertMsg("FB details updated successfully !");
        fnGetReport(0);
    }
    else if (res.split("|^|")[0] == "1") {
        AutoHideAlertMsg("FB already exist !");
        $("#dvloader").hide();
    }
    else if (res.split("|^|")[0] == "3") {
        $("#dvloader").hide();
        fnExistingCombinationAtSBD(res, ctrl);
    }
    else {
        fnfailed();
    }
}
function fnExistingCombinationAtSBD(res, ctrl) {
    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: justify;'>" + res.split("|^|")[1] + "</div>");
    $("#divConfirm").dialog({
        "modal": true,
        "width": "40%",
        "maxheight": "400",
        "title": "Message :",
        close: function () {
            $("#divConfirm").dialog('destroy');
        },
        buttons: [{
            text: 'Yes',
            class: 'btn-primary',
            click: function () {
                fnSave(ctrl, 1);
                $("#divConfirm").dialog('close');
            }
        },
        {
            text: 'No',
            class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');
            }
        }]
    });
}

function fnDelete(ctrl) {
    var SBDID = $(ctrl).closest("tr").attr("SBD");
    var SBDName = $(ctrl).closest("tr").attr("SBDName");

    //$("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure, you want to delete this SBD <br/><span style='color:#0000ff; font-weight: 700;'>" + SBDName + "</span></div>");
    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure, you want to delete this FB ?</div>");
    $("#divConfirm").dialog({
        "modal": true,
        "width": "260",
        "height": "200",
        "title": "Message :",
        close: function () {
            $("#divConfirm").dialog('destroy');
        },
        buttons: [{
            text: 'Yes',
            class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');

                $("#dvloader").show();
                PageMethods.fnDelete(SBDID, fnDelete_pass, fnfailed);
            }
        },
        {
            text: 'No',
            class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');
            }
        }]
    });
}
function fnDelete_pass(res) {
    if (res.split("|^|")[0] == "0") {
        AutoHideAlertMsg("FB deleted successfully !");
        fnGetReport(0);
    }
    else {
        fnfailed();
    }
}

function fnGetRejectComment(ctrl) {
    var SBDID = $(ctrl).closest("tr").attr("sbd");
    var rowIndex = $(ctrl).closest("tr").index();
    var flgDBEdit = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex).attr("flgDBEdit");

    $("#ConatntMatter_hdnSBDID").val(SBDID);
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();

    $("#dvloader").show();
    PageMethods.fnGetRejectComments(SBDID, RoleID, UserID, fnGetRejectComments_pass, fnfailed, flgDBEdit);
}
function fnGetRejectComments_pass(res, flgDBEdit) {
    if (res.split("|^|")[0] == "0") {
        var NotEditablestr = "", Editablestr = "";
        if (res.split("|^|")[1] == "") {
            NotEditablestr = "No Comment Found !";
            Editablestr = ""
        }
        else {
            var jsonTbl = $.parseJSON(res.split("|^|")[1]).Table;
            for (var i = 0; i < jsonTbl.length; i++) {
                if (jsonTbl[i].flgEdit.toString() == "0") {
                    NotEditablestr += "<span style='font-weight: 700;'>" + jsonTbl[i].CommentsBy.toString() + " :</span>";
                    NotEditablestr += "<div style='padding-bottom: 10px;'>" + jsonTbl[i].comments.toString() + "</div>";
                }
                else {
                    Editablestr = jsonTbl[i].comments.toString();
                }
            }
        }

        $("#dvPrevComment").html(NotEditablestr);

        if (flgDBEdit == "1") {
            $("#dvPrevComment").next().show();
            $("#dvRejectComment").find("textarea").eq(0).show();
            $("#dvRejectComment").find("textarea").eq(0).val(Editablestr);
            $("#dvRejectComment").dialog({
                "modal": true,
                "width": "640",
                "title": "Message :",
                close: function () {
                    $("#dvRejectComment").dialog('destroy');
                },
                buttons: [{
                    text: 'Save',
                    class: 'btn-primary',
                    click: function () {
                        if ($("#dvRejectComment").find("textarea").eq(0).val() != "") {
                            $("#dvRejectComment").dialog('close');

                            var INITID = $("#ConatntMatter_hdnSBDID").val();
                            var RoleID = $("#ConatntMatter_hdnRoleID").val();
                            var UserID = $("#ConatntMatter_hdnUserID").val();
                            var LoginID = $("#ConatntMatter_hdnLoginID").val();

                            $("#dvloader").show();
                            PageMethods.fnSaveRejectComments(INITID, RoleID, UserID, LoginID, $("#dvRejectComment").find("textarea").eq(0).val(), fnSaveRejectComments_pass, fnfailed);
                        }
                        else {
                            AutoHideAlertMsg("Please enter your Comments !");
                        }
                    }
                }, {
                    text: 'Cancel',
                    class: 'btn-primary',
                    click: function () {
                        $("#dvRejectComment").dialog('close');
                    }
                }]
            });
        }
        else {
            $("#dvPrevComment").next().hide();
            $("#dvRejectComment").find("textarea").eq(0).hide();
            $("#dvRejectComment").dialog({
                "modal": true,
                "width": "640",
                "title": "Message :",
                close: function () {
                    $("#dvRejectComment").dialog('destroy');
                }
            });
        }
        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}
function fnSaveRejectComments_pass(res) {
    if (res.split("|^|")[0] == "0") {
        AutoHideAlertMsg("Comment saved successfully !");
    }
    else {
        fnfailed();
    }
    $("#dvloader").hide();
}

function fnExpandContent(cntr) {
    if (cntr == 1) {
        $("#tblReport").attr("IsSBDExpand", "1");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD'][flgEdit='0']").each(function () {
            var sbd = ExtendContentBody($(this).attr("strsbd").split("~")[0]);
            if ($("#btnInitExpandedCollapseMode").attr("flgCollapse") == "0")
                $(this).find("td[iden='SBD']").eq(6).html("<div style='width: 202px; min-width: 202px; font-size:0.6rem;'>" + sbd + "</div>");
            else
                $(this).find("td[iden='SBD']").eq(6).html("<div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (sbd.length > 70 ? "<span title='" + sbd + "' class='clsInform'>" + sbd.substring(0, 68) + "..</span>" : sbd) + "</div>");

        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnSBDExpandCollapse']").eq(0).attr("class", "fa fa-minus-square clsExpandCollapse");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnSBDExpandCollapse']").eq(0).attr("onclick", "fnCollapseContent(" + cntr + ");");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnSBDExpandCollapse']").eq(0).next().html("SubBrandForm");
    }
    else if (cntr == 2) {
        $("#tblReport").attr("IsLocExpand", "1");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD'][flgEdit='0']").each(function () {
            var loc = ExtendContentBody($(this).attr("strloc").split("~")[0]);
            if ($("#btnInitExpandedCollapseMode").attr("flgCollapse") == "0")
                $(this).find("td[iden='SBD']").eq(5).html("<div style='width: 202px; min-width: 202px; font-size:0.6rem;'>" + loc + "</div>");
            else
                $(this).find("td[iden='SBD']").eq(5).html("<div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (loc.length > 70 ? "<span title='" + loc + "' class='clsInform'>" + loc.substring(0, 68) + "..</span>" : loc) + "</div>");

        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).attr("class", "fa fa-minus-square clsExpandCollapse");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).attr("onclick", "fnCollapseContent(" + cntr + ");");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).next().html("Clusters");
    }
    else {
        $("#tblReport").attr("IsChannelExpand", "1");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD'][flgEdit='0']").each(function () {
            var channel = ExtendContentBody($(this).attr("strchannel").split("~")[0]);
            if ($("#btnInitExpandedCollapseMode").attr("flgCollapse") == "0")
                $(this).find("td[iden='SBD']").eq(4).html("<div style='width: 202px; min-width: 202px; font-size:0.6rem;'>" + channel + "</div>");
            else
                $(this).find("td[iden='SBD']").eq(4).html("<div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (channel.length > 70 ? "<span title='" + channel + "' class='clsInform'>" + channel.substring(0, 68) + "..</span>" : channel) + "</div>");
        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).attr("class", "fa fa-minus-square clsExpandCollapse");
        $("#tblReport").find("thead").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).attr("onclick", "fnCollapseContent(" + cntr + ");");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).next().html("Channel");
    }

    Tooltip(".clsInform");
    fnAdjustColumnWidth();
    var trArr = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']");
    for (var i = 0; i < trArr.length; i++) {
        fnAdjustRowHeight(i);
    }
}
function fnCollapseContent(cntr) {
    if (cntr == 1) {
        $("#tblReport").attr("IsSBDExpand", "0");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD'][flgEdit='0']").each(function () {
            $(this).find("td[iden='SBD']").eq(6).html("");
        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnSBDExpandCollapse']").eq(0).attr("class", "fa fa-buysellads clsExpandCollapse");
        $("#tblReport").find("thead").eq(0).find("i[iden='btnSBDExpandCollapse']").eq(0).attr("onclick", "fnExpandContent(" + cntr + ");");
        $("#tblReport").find("thead").eq(0).find("i[iden='btnSBDExpandCollapse']").eq(0).next().html("");
    }
    else if (cntr == 2) {
        $("#tblReport").attr("IsLocExpand", "0");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD'][flgEdit='0']").each(function () {
            $(this).find("td[iden='SBD']").eq(5).html("");
        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).attr("class", "fa fa-map-marker clsExpandCollapse");
        $("#tblReport").find("thead").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).attr("onclick", "fnExpandContent(" + cntr + ");");
        $("#tblReport").find("thead").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).next().html("");
    }
    else {
        $("#tblReport").attr("IsChannelExpand", "0");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD'][flgEdit='0']").each(function () {
            $(this).find("td[iden='SBD']").eq(4).html("");
        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).attr("class", "fa fa-sitemap clsExpandCollapse");
        $("#tblReport").find("thead").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).attr("onclick", "fnExpandContent(" + cntr + ");");
        $("#tblReport").find("thead").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).next().html("");
    }

    fnAdjustColumnWidth();
    var trArr = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']");
    for (var i = 0; i < trArr.length; i++) {
        fnAdjustRowHeight(i);
    }
}
function ExtendContentBody(strfull) {
    return strfull;
}

function fnProdPopuptypefilter(ctrl) {
    var filter = ($(ctrl).val()).toUpperCase().split(",");
    if ($(ctrl).val().length > 2) {
        $("#chkSelectAllProd").removeAttr("checked");
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "0");
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "none");

        var flgValid = 0;
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td")[1].innerText.toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }
            if (flgValid == 1) {
                $(this).attr("flgVisible", "1");
                $(this).css("display", "table-row");
            }
        });
    }
    else {
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    }
}

function fnShowProdHierPopup(ctrl, cntr) {
    $("#ConatntMatter_hdnSelectedFrmFilter").val(cntr);
    $("#divHierPopupTbl").html("<div style='font-size: 0.9rem; font-weight: 600; margin-top: 25%; text-align: center;'>Please Select the Level from Left</div>");
    $("#ConatntMatter_hdnBucketType").val($(ctrl).attr("buckettype"));

    var title = "";
    if ($("#ConatntMatter_hdnBucketType").val() == "1")
        title = "Product";
    else if ($("#ConatntMatter_hdnBucketType").val() == "2")
        title = "Site";
    else
        title = "Channel";

    var strtable = "";
    if ($("#ConatntMatter_hdnBucketType").val() == "1") {
        strtable += "<table class='table table-bordered table-sm table-hover'>";
        strtable += "<thead>";
        strtable += "<tr>";
        strtable += "<th style='width:25%;'>Category</th>";
        strtable += "<th style='width:25%;'>Brand</th>";
        strtable += "<th style='width:25%;'>BrandForm</th>";
        strtable += "<th style='width:25%;'>SubBrandForm</th>";
        strtable += "</tr>";
        strtable += "</thead>";
        strtable += "<tbody>";
        strtable += "</tbody>";
        strtable += "</table>";
        $("#divHierSelectionTbl").html(strtable);

        $("#PopupHierlbl").html("Product Hierarchy");
        $("#ProdLvl").html($("#ConatntMatter_hdnProductLvl").val());
    }
    else if ($("#ConatntMatter_hdnBucketType").val() == "2") {
        strtable += "<table class='table table-bordered table-sm table-hover'>";
        strtable += "<thead>";
        strtable += "<tr>";
        strtable += "<th style='width:15%;'>Country</th>";
        strtable += "<th style='width:20%;'>Region</th>";
        strtable += "<th style='width:20%;'>Site</th>";
        strtable += "<th style='width:25%;'>Distributor</th>";
        strtable += "<th style='width:20%;'>Branch</th>";
        strtable += "</tr>";
        strtable += "</thead>";
        strtable += "<tbody>";
        strtable += "</tbody>";
        strtable += "</table>";
        $("#divHierSelectionTbl").html(strtable);

        $("#PopupHierlbl").html("Location Hierarchy");
        $("#ProdLvl").html($("#ConatntMatter_hdnLocationLvl").val());
    }
    else {
        strtable += "<table class='table table-bordered table-sm table-hover'>";
        strtable += "<thead>";
        strtable += "<tr>";
        strtable += "<th style='width:33%;'>Class</th>";
        strtable += "<th style='width:34%;'>Channel</th>";
        strtable += "<th style='width:33%;'>Store Type</th>";
        strtable += "</tr>";
        strtable += "</thead>";
        strtable += "<tbody>";
        strtable += "</tbody>";
        strtable += "</table>";
        $("#divHierSelectionTbl").html(strtable);

        $("#PopupHierlbl").html("Channel Hierarchy");
        $("#ProdLvl").html($("#ConatntMatter_hdnChannelLvl").val());
    }

    if (cntr == 0) {
        $("#divHierPopup").dialog({
            "modal": true,
            "width": "92%",
            "height": "560",
            "title": title + " :",
            open: function () {
                if ($(ctrl).attr("ProdLvl") != "" && $(ctrl).attr("ProdLvl") != "0") {
                    $("#ConatntMatter_hdnSelectedHier").val($(ctrl).attr("ProdHier"));
                    fnProdLvl($("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("td[ntype='" + $(ctrl).attr("ProdLvl") + "']").eq(0));
                }
                else
                    $("#ConatntMatter_hdnSelectedHier").val("");
            },
            close: function () {
                $("#divHierPopup").dialog('destroy');
            },
            buttons: [{
                text: 'Select',
                class: 'btn-primary',
                click: function () {
                    var SelectedHierValues = fnProdSelected(ctrl).split("||||");

                    $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
                    $(ctrl).attr("ProdHier", SelectedHierValues[1]);
                    $(ctrl).attr("copybuckettd", "0");
                    if ($("#ConatntMatter_hdnSelectedFrmFilter").val() == "1") {
                        $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
                    }

                    if (cntr == 1) {
                        var rowIndex = $(ctrl).closest("tr[iden='SBD']").index();
                        fnAdjustRowHeight(rowIndex);
                    }
                    $("#divHierPopup").dialog('close');
                }
            },
            {
                text: 'Reset',
                class: 'btn-primary',
                click: function () {
                    fnHierPopupReset();
                }
            }, {
                text: 'Cancel',
                class: 'btn-primary',
                click: function () {
                    $("#divHierPopup").dialog('close');
                }
            }]
        });
    }
    else {
        $("#divHierPopup").dialog({
            "modal": true,
            "width": "92%",
            "height": "560",
            "title": title + " :",
            open: function () {
                if ($(ctrl).attr("ProdLvl") != "") {
                    $("#ConatntMatter_hdnSelectedHier").val($(ctrl).attr("ProdHier"));
                    fnProdLvl($("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("td[ntype='" + $(ctrl).attr("ProdLvl") + "']").eq(0));
                }
                else
                    $("#ConatntMatter_hdnSelectedHier").val("");
            },
            close: function () {
                $("#divHierPopup").dialog('destroy');
            },
            buttons: [{
                text: 'Add as New Bucket',
                class: 'btn-primary',
                click: function () {
                    if ($("#divHierSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr").length == 0) {
                        AutoHideAlertMsg("Please make your Selection !");
                    }
                    else {
                        $("#divAddNewBucketPopup").dialog({
                            "modal": true,
                            "width": "60%",
                            "title": title + " Bucket :",
                            open: function () {
                                $("#txtBucketName").val("");
                                $("#txtBucketDescription").val("");
                            },
                            close: function () {
                                $("#divAddNewBucketPopup").dialog('destroy');
                            },
                            buttons: [{
                                text: 'Save',
                                class: 'btn-primary',
                                click: function () {
                                    if ($("#txtBucketName").val() == "") {
                                        AutoHideAlertMsg("Please enter the Bucket Name !");
                                    }
                                    else if ($("#txtBucketDescription").val() == "") {
                                        AutoHideAlertMsg("Please enter the Bucket Description !");
                                    }
                                    else {
                                        fnSaveNewBucket(ctrl, 0);
                                    }
                                }
                            }, {
                                text: 'Cancel',
                                class: 'btn-primary',
                                click: function () {
                                    $("#divAddNewBucketPopup").dialog('close');
                                }
                            }]
                        });
                    }

                }
            }, {
                text: 'Select',
                class: 'btn-primary',
                click: function () {
                    var SelectedHierValues = fnProdSelected(ctrl).split("||||");
                    $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
                    $(ctrl).attr("ProdHier", SelectedHierValues[1]);
                    $(ctrl).attr("copybuckettd", "0");
                    if ($("#ConatntMatter_hdnSelectedFrmFilter").val() == "1") {
                        $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
                    }

                    if (cntr == 1) {
                        var rowIndex = $(ctrl).closest("tr[iden='SBD']").index();
                        fnAdjustRowHeight(rowIndex);
                    }
                    $("#divHierPopup").dialog('close');
                }
            },
            {
                text: 'Reset',
                class: 'btn-primary',
                click: function () {
                    fnHierPopupReset();
                }
            }, {
                text: 'Cancel',
                class: 'btn-primary',
                click: function () {
                    $("#divHierPopup").dialog('close');
                }
            }]
        });
    }
}
function fnProdLvl(ctrl) {
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserNodeID = $("#ConatntMatter_hdnNodeID").val();
    var UserNodeType = $("#ConatntMatter_hdnNodeType").val();
    var ProdLvl = $(ctrl).attr("ntype");

    $(ctrl).closest("tr").addClass("Active").siblings().removeClass("Active");
    $("#divHierPopupTbl").html("<img alt='Loading...' title='Loading...' src='../../Images/loading.gif' style='margin-top: 20%; margin-left: 40%; text-align: center;' />");

    var BucketValues = [];
    if ($("#ConatntMatter_hdnSelectedHier").val() != "") {
        var Selstr = $("#ConatntMatter_hdnSelectedHier").val();
        for (var i = 0; i < Selstr.split("^").length; i++) {
            BucketValues.push({
                "col1": Selstr.split("^")[i].split("|")[0],
                "col2": Selstr.split("^")[i].split("|")[1],
                "col3": $("#ConatntMatter_hdnBucketType").val()
            });
        }
    }

    if ($("#ConatntMatter_hdnBucketType").val() == "1") {
        PageMethods.fnProdHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "0", BucketValues, fnProdHier_pass, fnProdHier_failed);
    }
    else if ($("#ConatntMatter_hdnBucketType").val() == "2") {
        var InSubD = 0;
        PageMethods.fnLocationHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, BucketValues, InSubD, fnProdHier_pass, fnProdHier_failed);
    }
    else {
        PageMethods.fnChannelHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, BucketValues, fnProdHier_pass, fnProdHier_failed);
    }
}
function fnProdHier_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divHierPopupTbl").html(res.split("|^|")[1]);
        if ($("#ConatntMatter_hdnSelectedHier").val() != "") {
            $("#divHierSelectionTbl").html(res.split("|^|")[2]);
            $("#ConatntMatter_hdnSelectedHier").val("");
        }

        if ($("#divHierSelectionTbl").find("tbody").eq(0).find("tr").length > 0) {
            var PrevSelLvl = $("#divHierSelectionTbl").find("tbody").eq(0).find("tr").eq(0).attr("lvl");
            var Lvl = $("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").eq(0).find("td").eq(0).attr("ntype");
            if ((parseInt(PrevSelLvl) > parseInt(Lvl)) && ($("#ConatntMatter_hdnBucketType").val() == "3")) {
                $("#divHierSelectionTbl").find("tbody").eq(0).html("");
            }
            else {
                $("#divHierSelectionTbl").find("tbody").eq(0).find("tr").each(function () {
                    if (Lvl == $(this).attr("lvl")) {
                        var tr = $("#divHierPopupTbl").find("table").eq(0).find("tr[nid='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']");
                        fnSelectHier(tr.eq(0));
                        var trHtml = tr[0].outerHTML;
                        tr.eq(0).remove();
                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                    }
                    else {
                        switch (Lvl) {
                            case "20":
                                if ($(this).attr("lvl") == "10") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[cat='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                break;
                            case "30":
                                if ($(this).attr("lvl") == "10") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[cat='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                else if ($(this).attr("lvl") == "20") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[brand='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                break;
                            case "40":
                                if ($(this).attr("lvl") == "10") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[cat='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                else if ($(this).attr("lvl") == "20") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[brand='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                else if ($(this).attr("lvl") == "30") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[bf='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                break;
                            case "110":
                                if ($(this).attr("lvl") == "100") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[cntry='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                break;
                            case "120":
                                if ($(this).attr("lvl") == "100") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[cntry='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                if ($(this).attr("lvl") == "110") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[reg='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                break;
                            case "130":
                                if ($(this).attr("lvl") == "100") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[cntry='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                if ($(this).attr("lvl") == "110") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[reg='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                if ($(this).attr("lvl") == "120") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[site='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                break;
                            case "140":
                                if ($(this).attr("lvl") == "100") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[cntry='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                if ($(this).attr("lvl") == "110") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[reg='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                if ($(this).attr("lvl") == "120") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[site='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                if ($(this).attr("lvl") == "130") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[dbr='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                break;
                            case "210":
                                if ($(this).attr("lvl") == "200") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[cls='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                break;
                            case "220":
                                if ($(this).attr("lvl") == "200") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[cls='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                else if ($(this).attr("lvl") == "210") {
                                    var tr = $(this).eq(0);
                                    $("#divHierPopupTbl").find("table").eq(0).find("tr[channel='" + $(this).attr("nid") + "'][ntype='" + Lvl + "']").each(function () {
                                        fnSelectHier(this);
                                        var trHtml = $(this)[0].outerHTML;
                                        $(this).eq(0).remove();
                                        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHtml);
                                    });
                                    tr.remove();
                                }
                                break;
                        }
                    }
                });
            }
        }
    }
    else {
        fnProdHier_failed();
    }
}
function fnProdHier_failed() {
    $("#divHierPopupTbl").html("Due to some technical reasons, we are unable to Process your request !");
}

function fnHierPopupReset() {
    $("#divHierSelectionTbl").find("tbody").eq(0).html("");

    $("#divHierPopupTbl").find("table").eq(0).find("thead").eq(0).find("input[type='text']").val("");
    $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
    $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
        $(this).attr("flg", "0");
        $(this).removeClass("Active");
        $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
    });
    $("#chkSelectAllProd").removeAttr("checked");

    //if ($("#ConatntMatter_hdnBucketType").val() == "2")
    //    $("#chkIncludeSubd").prop("checked", true);
}
function fnSelectHier(ctrl) {
    $(ctrl).attr("flg", "1");
    $(ctrl).addClass("Active");
    $(ctrl).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");

    fnAppendSelection(ctrl, 1);
}
function fnSelectAllProd(ctrl) {
    if ($(ctrl).is(":checked")) {
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
            $(this).attr("flg", "1");
            $(this).addClass("Active");
            $(this).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");

            fnAppendSelection(this, 1);
        });
    }
    else {
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
            $(this).attr("flg", "0");
            $(this).removeClass("Active");
            $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

            fnAppendSelection(this, 0);
        });
    }
}
function fnSelectUnSelectProd(ctrl) {
    if ($(ctrl).attr("flg") == "1") {
        $(ctrl).attr("flg", "0");
        $(ctrl).removeClass("Active");
        $(ctrl).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

        fnAppendSelection(ctrl, 0);
        $("#chkSelectAllProd").removeAttr("checked");
    }
    else {
        $(ctrl).attr("flg", "1");
        $(ctrl).addClass("Active");
        $(ctrl).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");

        fnAppendSelection(ctrl, 1);
    }
}
function fnAppendSelection(ctrl, flgSelect) {
    var BucketType = $("#ConatntMatter_hdnBucketType").val();
    var Lvl = $("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").eq(0).find("td").eq(0).attr("ntype");

    if (flgSelect == 1) {
        if ($("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='" + Lvl + "'][nid='" + $(ctrl).attr("nid") + "']").length == 0) {
            var strtr = "";
            if (BucketType == "1") {
                switch (Lvl) {
                    case "10":
                        strtr += "<tr lvl='" + Lvl + "' cat='" + $(ctrl).attr("cat") + "' brand='" + $(ctrl).attr("brand") + "' bf='" + $(ctrl).attr("bf") + "' sbf='" + $(ctrl).attr("sbf") + "' nid='" + $(ctrl).attr("cat") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>All</td><td>All</td><td>All</td>";

                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='20'][cat='" + $(ctrl).attr("nid") + "']").remove();
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='30'][cat='" + $(ctrl).attr("nid") + "']").remove();
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='40'][cat='" + $(ctrl).attr("nid") + "']").remove();
                        break;
                    case "20":
                        strtr += "<tr lvl='" + Lvl + "' cat='" + $(ctrl).attr("cat") + "' brand='" + $(ctrl).attr("brand") + "' bf='" + $(ctrl).attr("bf") + "' sbf='" + $(ctrl).attr("sbf") + "' nid='" + $(ctrl).attr("brand") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>All</td><td>All</td>";

                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='30'][brand='" + $(ctrl).attr("nid") + "']").remove();
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='40'][brand='" + $(ctrl).attr("nid") + "']").remove();
                        break;
                    case "30":
                        strtr += "<tr lvl='" + Lvl + "' cat='" + $(ctrl).attr("cat") + "' brand='" + $(ctrl).attr("brand") + "' bf='" + $(ctrl).attr("bf") + "' sbf='" + $(ctrl).attr("sbf") + "' nid='" + $(ctrl).attr("bf") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>" + $(ctrl).find("td").eq(4).html() + "</td><td>All</td>";

                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='40'][bf='" + $(ctrl).attr("nid") + "']").remove();
                        break;
                    case "40":
                        strtr += "<tr lvl='" + Lvl + "' cat='" + $(ctrl).attr("cat") + "' brand='" + $(ctrl).attr("brand") + "' bf='" + $(ctrl).attr("bf") + "' sbf='" + $(ctrl).attr("sbf") + "' nid='" + $(ctrl).attr("sbf") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>" + $(ctrl).find("td").eq(4).html() + "</td><td>" + $(ctrl).find("td").eq(5).html() + "</td>";
                        break;
                }
                strtr += "</tr>";
            }
            else if (BucketType == "2") {
                switch (Lvl) {
                    case "100":
                        strtr += "<tr lvl='" + Lvl + "' cntry='" + $(ctrl).attr("cntry") + "' reg='" + $(ctrl).attr("reg") + "' site='" + $(ctrl).attr("site") + "' dbr='" + $(ctrl).attr("dbr") + "' branch='" + $(ctrl).attr("branch") + "' nid='" + $(ctrl).attr("cntry") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>All</td><td>All</td><td>All</td><td>All</td>";
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='110'][cntry='" + $(ctrl).attr("nid") + "']").remove();
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='120'][cntry='" + $(ctrl).attr("nid") + "']").remove();
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='130'][cntry='" + $(ctrl).attr("nid") + "']").remove();
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='140'][cntry='" + $(ctrl).attr("nid") + "']").remove();
                        break;
                    case "110":
                        strtr += "<tr lvl='" + Lvl + "' cntry='" + $(ctrl).attr("cntry") + "' reg='" + $(ctrl).attr("reg") + "' site='" + $(ctrl).attr("site") + "' dbr='" + $(ctrl).attr("dbr") + "' branch='" + $(ctrl).attr("branch") + "' nid='" + $(ctrl).attr("reg") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>All</td><td>All</td><td>All</td>";
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='120'][reg='" + $(ctrl).attr("nid") + "']").remove();
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='130'][reg='" + $(ctrl).attr("nid") + "']").remove();
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='140'][reg='" + $(ctrl).attr("nid") + "']").remove();
                        break;
                    case "120":
                        strtr += "<tr lvl='" + Lvl + "' cntry='" + $(ctrl).attr("cntry") + "' reg='" + $(ctrl).attr("reg") + "' site='" + $(ctrl).attr("site") + "' dbr='" + $(ctrl).attr("dbr") + "' branch='" + $(ctrl).attr("branch") + "' nid='" + $(ctrl).attr("site") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>" + $(ctrl).find("td").eq(4).html() + "</td><td>All</td><td>All</td>";
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='130'][site='" + $(ctrl).attr("nid") + "']").remove();
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='140'][site='" + $(ctrl).attr("nid") + "']").remove();
                        break;
                    case "130":
                        strtr += "<tr lvl='" + Lvl + "' cntry='" + $(ctrl).attr("cntry") + "' reg='" + $(ctrl).attr("reg") + "' site='" + $(ctrl).attr("site") + "' dbr='" + $(ctrl).attr("dbr") + "' branch='" + $(ctrl).attr("branch") + "' nid='" + $(ctrl).attr("dbr") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>" + $(ctrl).find("td").eq(4).html() + "</td><td>" + $(ctrl).find("td").eq(5).html() + "</td><td>All</td>";
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='140'][dbr='" + $(ctrl).attr("nid") + "']").remove();
                        break;
                    case "140":
                        strtr += "<tr lvl='" + Lvl + "' cntry='" + $(ctrl).attr("cntry") + "' reg='" + $(ctrl).attr("reg") + "' site='" + $(ctrl).attr("site") + "' dbr='" + $(ctrl).attr("dbr") + "' branch='" + $(ctrl).attr("branch") + "' nid='" + $(ctrl).attr("branch") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>" + $(ctrl).find("td").eq(4).html() + "</td><td>" + $(ctrl).find("td").eq(5).html() + "</td><td>" + $(ctrl).find("td").eq(6).html() + "</td>";
                        break;
                }
                strtr += "</tr>";
            }
            else {
                switch (Lvl) {
                    case "200":
                        strtr += "<tr lvl='" + Lvl + "' cls='" + $(ctrl).attr("cls") + "' channel='" + $(ctrl).attr("channel") + "' storetype='" + $(ctrl).attr("storetype") + "' nid='" + $(ctrl).attr("cls") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>All</td><td>All</td>";

                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='210'][cls='" + $(ctrl).attr("nid") + "']").remove();
                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='220'][cls='" + $(ctrl).attr("nid") + "']").remove();
                        break;
                    case "210":
                        strtr += "<tr lvl='" + Lvl + "' cls='" + $(ctrl).attr("cls") + "' channel='" + $(ctrl).attr("channel") + "' storetype='" + $(ctrl).attr("storetype") + "' nid='" + $(ctrl).attr("channel") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>All</td>";

                        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='220'][channel='" + $(ctrl).attr("nid") + "']").remove();
                        break;
                    case "220":
                        strtr += "<tr lvl='" + Lvl + "' cls='" + $(ctrl).attr("cls") + "' channel='" + $(ctrl).attr("channel") + "' storetype='" + $(ctrl).attr("storetype") + "' nid='" + $(ctrl).attr("storetype") + "'>";
                        strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>" + $(ctrl).find("td").eq(4).html() + "</td>";
                        break;
                }
                strtr += "</tr>";
            }

            if ($("#divHierSelectionTbl").find("tbody").eq(0).find("tr").length == 0) {
                $("#divHierSelectionTbl").find("tbody").eq(0).html(strtr);
            }
            else {
                $("#divHierSelectionTbl").find("tbody").eq(0).prepend(strtr);
            }
        }
    }
    else {
        $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='" + Lvl + "'][nid='" + $(ctrl).attr("nid") + "']").eq(0).remove();
    }
}

function fnCopyBucketPopuptypefilter(ctrl) {
    var filter = ($(ctrl).val()).toUpperCase().split(",");
    if ($(ctrl).val().length > 2) {
        $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "0");
        $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "none");

        var flgValid = 0;
        $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td")[1].innerText.toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }
            if (flgValid == 1) {
                $(this).attr("flgVisible", "1");
                $(this).css("display", "table-row");
            }
        });
    }
    else {
        $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
        $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    }
}
function fnShowCopyBucketPopup(ctrl) {
    $("#divCopyBucketPopupTbl").html("<div style='margin-top: 25%; text-align: center;'><img alt='Loading...' title='Loading...' src='../../Images/loading.gif' /></div>");
    $("#ConatntMatter_hdnBucketType").val($(ctrl).attr("buckettype"));

    var title = "";
    if ($("#ConatntMatter_hdnBucketType").val() == "1")
        title = "Product(s) :";
    else if ($("#ConatntMatter_hdnBucketType").val() == "2")
        title = "Site(s) :";
    else if ($("#ConatntMatter_hdnBucketType").val() == "3")
        title = "Channel(s) :";
    else
        title = "Cluster(s) :";

    $("#divCopyBucketPopup").dialog({
        "modal": true,
        "width": "92%",
        "height": "560",
        "title": title,
        open: function () {
            var strtable = "";
            if ($("#ConatntMatter_hdnBucketType").val() == "1") {
                strtable += "<table class='table table-bordered table-sm table-hover'>";
                strtable += "<thead>";
                strtable += "<tr>";
                strtable += "<th style='width:25%;'>Category</th>";
                strtable += "<th style='width:25%;'>Brand</th>";
                strtable += "<th style='width:25%;'>BrandForm</th>";
                strtable += "<th style='width:25%;'>SubBrandForm</th>";
                strtable += "</tr>";
                strtable += "</thead>";
                strtable += "<tbody>";
                strtable += "</tbody>";
                strtable += "</table>";
                $("#divCopyBucketSelectionTbl").html(strtable);

                $("#PopupCopyBucketlbl").html("Product Hierarchy");
            }
            else if ($("#ConatntMatter_hdnBucketType").val() == "2") {
                strtable += "<table class='table table-bordered table-sm table-hover'>";
                strtable += "<thead>";
                strtable += "<tr>";
                strtable += "<th style='width:15%;'>Country</th>";
                strtable += "<th style='width:20%;'>Region</th>";
                strtable += "<th style='width:20%;'>Site</th>";
                strtable += "<th style='width:25%;'>Distributor</th>";
                strtable += "<th style='width:20%;'>Branch</th>";
                strtable += "</tr>";
                strtable += "</thead>";
                strtable += "<tbody>";
                strtable += "</tbody>";
                strtable += "</table>";
                $("#divCopyBucketSelectionTbl").html(strtable);

                $("#PopupCopyBucketlbl").html("Location Hierarchy");
            }
            else if ($("#ConatntMatter_hdnBucketType").val() == "3") {
                strtable += "<table class='table table-bordered table-sm table-hover'>";
                strtable += "<thead>";
                strtable += "<tr>";
                strtable += "<th style='width:33%;'>Class</th>";
                strtable += "<th style='width:34%;'>Channel</th>";
                strtable += "<th style='width:33%;'>Store Type</th>";
                strtable += "</tr>";
                strtable += "</thead>";
                strtable += "<tbody>";
                strtable += "</tbody>";
                strtable += "</table>";
                $("#divCopyBucketSelectionTbl").html(strtable);

                $("#PopupCopyBucketlbl").html("Channel Hierarchy");
            }
            else {
                strtable += "<table class='table table-bordered table-sm table-hover'>";
                strtable += "<thead>";
                strtable += "<tr>";
                strtable += "<th style='width:15%;'>Country</th>";
                strtable += "<th style='width:20%;'>Region</th>";
                strtable += "<th style='width:20%;'>Site</th>";
                strtable += "<th style='width:25%;'>Distributor</th>";
                strtable += "</tr>";
                strtable += "</thead>";
                strtable += "<tbody>";
                strtable += "</tbody>";
                strtable += "</table>";
                $("#divCopyBucketSelectionTbl").html(strtable);

                $("#PopupCopyBucketlbl").html("Cluster Hierarchy");
            }

            var LoginID = $("#ConatntMatter_hdnLoginID").val();
            var RoleID = $("#ConatntMatter_hdnRoleID").val();
            var UserID = $("#ConatntMatter_hdnUserID").val();
            var Qtr = $("#ddlQuarter").val().split("|")[2];
            var Yr = $("#ddlQuarter").val().split("|")[3];

            var CopyBucketTD = $(ctrl).closest("td[iden='SBD']").find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
            PageMethods.GetBucketbasedonType(LoginID, RoleID, UserID, $("#ConatntMatter_hdnBucketType").val(), Qtr, Yr, GetBucketbasedonType_pass, GetBucketbasedonType_failed, CopyBucketTD);
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                if ($("#ConatntMatter_hdnBucketType").val() != "5") {
                    var strCopyBucket = fnCopyBucketSelection();

                    $(ctrl).closest("div").prev().html(strCopyBucket.split("|||")[1]);
                    $(ctrl).closest("td[iden='SBD']").find("img[iden='ProductHier']").eq(0).attr("prodlvl", strCopyBucket.split("|||")[3]);
                    $(ctrl).closest("td[iden='SBD']").find("img[iden='ProductHier']").eq(0).attr("prodhier", strCopyBucket.split("|||")[2]);
                    $(ctrl).closest("td[iden='SBD']").find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD", strCopyBucket.split("|||")[0]);
                }
                else {
                    var CopyBucketTD = "", descr = "";
                    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']").each(function () {
                        CopyBucketTD += "|" + $(this).attr("bucketid");
                        descr += ", " + $(this).find("td").eq(1).html();
                    });
                    if (CopyBucketTD != "") {
                        CopyBucketTD = CopyBucketTD.substring(1);
                        descr = descr.substring(2);
                    }
                    else {
                        CopyBucketTD = "0";
                    }

                    $(ctrl).closest("div").prev().html(descr);
                    $(ctrl).attr("CopyBucketTD", CopyBucketTD);
                }

                var rowIndex = $(ctrl).closest("tr[iden='SBD']").index();
                fnAdjustRowHeight(rowIndex);
                $("#divCopyBucketPopup").dialog('close');
            }
        },
        {
            text: 'Reset',
            class: 'btn-primary',
            click: function () {
                fnCopyBucketPopupReset();
            }
        },
        {
            text: 'Cancel',
            class: 'btn-primary',
            click: function () {
                $("#divCopyBucketPopup").dialog('close');
            }
        }]
    });
}

function fnSelectUnSelectBucket(ctrl) {
    if ($(ctrl).attr("flg") == "1") {
        $(ctrl).attr("flg", "0");
        $(ctrl).removeClass("Active");
        $(ctrl).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
        //$("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
    }
    else {
        //var tr = $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active");
        //tr.eq(0).attr("flg", "0");
        //tr.eq(0).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
        //tr.eq(0).removeClass("Active");
        //$("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("<tr><td colspan='3' style='text-align: center; padding: 50px 10px 0 10px;'><img alt='Loading...' title='Loading...' src='../../Images/loading.gif'/></td></tr>");

        $(ctrl).attr("flg", "1");
        $(ctrl).addClass("Active");
        $(ctrl).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");
    }
    fnGetCopySelHierTbl();
}
function fnGetCopySelHierTbl() {
    var BucketValues = [];
    if ($("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").length > 0)
        $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").each(function () {
            var Selstr = $(this).attr("strvalue");
            for (var i = 0; i < Selstr.split("^").length; i++) {
                BucketValues.push({
                    "col1": Selstr.split("^")[i].split("|")[0],
                    "col2": Selstr.split("^")[i].split("|")[1],
                    "col3": $("#ConatntMatter_hdnBucketType").val() == "5" ? "2" : $("#ConatntMatter_hdnBucketType").val()
                });
            }
        });

    if (BucketValues.length > 0) {
        $("#dvloader").show();
        PageMethods.GetSelHierTbl(BucketValues, $("#ConatntMatter_hdnBucketType").val(), "0", GetCopySelHierTbl_pass, GetCopySelHierTbl_failed);
    }
    else {
        $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
    }
}
function GetCopySelHierTbl_pass(res) {
    $("#dvloader").hide();
    $("#divCopyBucketSelectionTbl").html(res);
}
function GetCopySelHierTbl_failed() {
    $("#dvloader").hide();
    $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("<tr><td colspan='3' style='text-align: center; padding: 50px 10px 0 10px;'>Due to some technical reasons, we are unable to Process your request !</td></tr>");
}

function fnCopyBucketPopupReset() {
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("thead").eq(0).find("input[type='text']").val("");
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    var tr = $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active");
    tr.eq(0).attr("flg", "0");
    tr.eq(0).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
    tr.eq(0).removeClass("Active");

    $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
}

function fnResetBaseSBFPopupAction() {
    $("#divProxySBFTbl").html($("#ConatntMatter_hdnSBFHierforBasePopup").val());
    $("#divProxySBFTbl").find("table").eq(0).addClass("clsBaseSBFDisable");
    $("#chkSelectAllProd").hide();

    $("#divBaseSBFTbl").show();
    $("#divBaseSBFlbl").show();
    $("#divBaseProxySBFTbl").show();
    $("#divBaseProxySBFlbl").show();
    $("#divBaseSBFTbl").css("height", "190px");
    $("#divBaseProxySBFTbl").css("height", "190px");
    $("#divBaseSBFTbl").find("table").eq(0).find("tbody").eq(0).html("");
    $("#divBaseProxySBFTbl").find("table").eq(0).find("tbody").eq(0).html("");
}
function fnSBFTypefilter(ctrl) {
    var filter = ($(ctrl).val()).toUpperCase().split(",");
    if ($(ctrl).val().length > 2) {
        $("#chkSelectAllProd").removeAttr("checked");
        $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "0");
        $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "none");

        var flgValid = 0;
        $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td")[1].innerText.toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }
            if (flgValid == 1) {
                $(this).attr("flgVisible", "1");
                $(this).css("display", "table-row");
            }
        });
    }
    else {
        $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
        $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    }
}
function fnCombi(ctrl, cntr) {
    $("#ConatntMatter_hdnBaseSBFAction").val(cntr);
    $(ctrl).addClass("active").siblings().removeClass("active");

    fnResetBaseSBFPopupAction();
    switch (cntr.toString()) {
        case "1":
            $("#divProxySBFTbl").find("table").eq(0).removeClass("clsBaseSBFDisable");
            $("#divBaseSBFTbl").css("height", "80px");
            $("#divBaseProxySBFTbl").css("height", "300px");

            $("#chkSelectAllProd").show();
            $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
                $(this).find("td").eq(0).attr("onclick", "fnMarkProxy(this)");
                $(this).find("td").eq(2).attr("onclick", "fnMarkProxy(this)");
                $(this).find("td").eq(3).attr("onclick", "fnMarkProxy(this)");
                $(this).find("td").eq(4).attr("onclick", "fnMarkProxy(this)");
                $(this).find("td").eq(5).attr("onclick", "fnMarkProxy(this)");

                if ($("#divSelectedBaseSBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr[nid='" + $(this).attr("nid") + "'][ntype='" + $(this).attr("ntype") + "']").length > 0) {

                    $(this).find("td").eq(6).attr("onclick", "fnMarkProxy(this)");
                    $(this).find("td").eq(6).html("");
                }
                else {
                    $(this).find("td").eq(6).attr("onclick", "fnMarkBaseSBF(this)");
                }
            });
            break;
        case "2":
            if ($("#divSelectedBaseSBFTbl").find("tbody").eq(0).find("tr").length > 0) {
                $("#divBaseSBFTbl").find("tbody").eq(0).html($("#divSelectedBaseSBFTbl").find("tbody").eq(0).html());

                $("#divBaseSBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
                    $(this).find("td").eq(0).attr("onclick", "fnEditBaseSBF(this)");
                    $(this).find("td").eq(1).attr("onclick", "fnEditBaseSBF(this)");
                    $(this).find("td").eq(3).html("<img src='../../Images/cancel.png' title='Remove' onclick='fnRemoveBaseSBF(this);'/>");
                });

                $("#chkSelectAllProd").show();
                $("#divProxySBFTbl").find("table").eq(0).find("thead").eq(0).find("tr").eq(1).find("th").eq(6).hide();
                $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
                    $(this).find("td").eq(6).hide();

                    $(this).find("td").eq(0).attr("onclick", "fnMarkProxy(this)");
                    $(this).find("td").eq(2).attr("onclick", "fnMarkProxy(this)");
                    $(this).find("td").eq(3).attr("onclick", "fnMarkProxy(this)");
                    $(this).find("td").eq(4).attr("onclick", "fnMarkProxy(this)");
                    $(this).find("td").eq(5).attr("onclick", "fnMarkProxy(this)");
                });
            }
            else
                AutoHideAlertMsg("No Base-SBF found for Editing !");
            break;
        case "3":
            $("#divProxySBFTbl").find("table").eq(0).removeClass("clsBaseSBFDisable");
            $("#divBaseSBFTbl").css("height", "380px");
            $("#divBaseProxySBFTbl").hide();
            $("#divBaseProxySBFlbl").hide();

            $("#divProxySBFTbl").find("table").eq(0).find("thead").eq(0).find("tr").eq(1).find("th").eq(0).hide();
            $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
                $(this).find("td").eq(0).hide();

                if ($("#divSelectedBaseSBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr[nid='" + $(this).attr("nid") + "'][ntype='" + $(this).attr("ntype") + "']").length > 0) {
                    $(this).find("td").eq(6).html("");
                }
                else {
                    $(this).find("td").eq(2).attr("onclick", "fnMarkBaseSBF(this)");
                    $(this).find("td").eq(3).attr("onclick", "fnMarkBaseSBF(this)");
                    $(this).find("td").eq(4).attr("onclick", "fnMarkBaseSBF(this)");
                    $(this).find("td").eq(5).attr("onclick", "fnMarkBaseSBF(this)");
                    $(this).find("td").eq(6).attr("onclick", "fnMarkBaseSBF(this)");
                }
            });
            break;
    }
}

function fnSelectAllSBF(ctrl) {
    var IsActive = false;
    if ($("#ConatntMatter_hdnBaseSBFAction").val() == "1")
        IsActive = true;
    else if ($("#ConatntMatter_hdnBaseSBFAction").val() == "2" && $("#divBaseSBFTbl").find("tbody").eq(0).find("tr[flgActive='1']").length > 0)
        IsActive = true;

    if (IsActive) {
        if ($(ctrl).is(":checked")) {
            $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
                $(this).attr("flg", "1");
                $(this).addClass("Active");
                $(this).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");
            });
        }
        else {
            $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
                $(this).attr("flg", "0");
                $(this).removeClass("Active");
                $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

                if ($(this).attr("flgBase") == "1") {
                    $(this).attr("flgBase", "0");
                    $(this).removeClass("ActiveBase");
                    $(this).find("td").eq(6).html("<i class='fa fa-circle-o'></i>");
                }
            });
        }

        fnAddUpdateBaseProxySBF();
    }
}
function fnMarkProxy(ctrl) {
    var IsActive = false;
    if ($("#ConatntMatter_hdnBaseSBFAction").val() == "1")
        IsActive = true;
    else if ($("#ConatntMatter_hdnBaseSBFAction").val() == "2" && $("#divBaseSBFTbl").find("tbody").eq(0).find("tr[flgActive='1']").length > 0)
        IsActive = true;

    if (IsActive) {
        if ($(ctrl).closest("tr").attr("flg") == "1") {
            $(ctrl).closest("tr").attr("flg", "0");
            $(ctrl).closest("tr").removeClass("Active");
            $(ctrl).closest("tr").find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

            if ($(ctrl).closest("tr").attr("flgBase") == "1") {
                $(ctrl).closest("tr").attr("flgBase", "0");
                $(ctrl).closest("tr").removeClass("ActiveBase");
                $(ctrl).closest("tr").find("td").eq(6).html("<i class='fa fa-circle-o'></i>");
            }

            $("#chkSelectAllProd").removeAttr("checked");
        }
        else {
            $(ctrl).closest("tr").attr("flg", "1");
            $(ctrl).closest("tr").addClass("Active");
            $(ctrl).closest("tr").find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");
        }

        fnAddUpdateBaseProxySBF();
    }
}
function fnMarkBaseSBF(ctrl) {
    var nid = $(ctrl).closest("tr").attr("nid");
    var ntype = $(ctrl).closest("tr").attr("ntype");

    if ($(ctrl).closest("tr").attr("flgBase") == "1") {
        $(ctrl).closest("tr").attr("flgBase", "0");
        $(ctrl).closest("tr").removeClass("ActiveBase");
        $(ctrl).closest("tr").find("td").eq(6).html("<i class='fa fa-circle-o'></i>");

        switch ($("#ConatntMatter_hdnBaseSBFAction").val()) {
            case "1":
                fnAddUpdateBaseProxySBF();
                break;
            case "3":
                $(ctrl).closest("tr").attr("flg", "0");
                $(ctrl).closest("tr").removeClass("Active");
                $(ctrl).closest("tr").find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

                $("#divBaseSBFTbl").find("tbody").eq(0).find("tr[nid='" + nid + "'][ntype='" + ntype + "']").remove();
                break;
        }
    }
    else {
        var trBase = $(ctrl).closest("tbody").find("tr[flgBase='1']");

        $(ctrl).closest("tr").attr("flg", "1");
        $(ctrl).closest("tr").addClass("Active");
        $(ctrl).closest("tr").find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");
        $(ctrl).closest("tr").attr("flgBase", "1");
        $(ctrl).closest("tr").addClass("ActiveBase");
        $(ctrl).closest("tr").find("td").eq(6).html("<i class='fa fa-circle' style='color: #0000C4;'></i>");

        switch ($("#ConatntMatter_hdnBaseSBFAction").val()) {
            case "1":
                if (trBase.length > 0) {
                    trBase.eq(0).attr("flgBase", "0");
                    trBase.eq(0).removeClass("ActiveBase");
                    trBase.eq(0).find("td").eq(6).html("<i class='fa fa-circle-o'></i>");
                    $("#divBaseSBFTbl").find("tbody").eq(0).find("tr[nid='" + trBase.eq(0).attr("nid") + "'][ntype='" + trBase.eq(0).attr("ntype") + "']").remove();
                }

                fnAddUpdateBaseProxySBF();
                break;
            case "3":
                fnAddBaseSBFtr($(ctrl).closest("tr"), $(ctrl).closest("tr"), "1");
                break;
        }
    }
}

function fnAddUpdateBaseProxySBF() {
    $("#divBaseProxySBFTbl").find("table").eq(0).find("tbody").eq(0).html("");
    var ProxySBF = $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']");
    var BaseSBF = $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flgBase='1']");

    if (BaseSBF.length > 0) {
        var MOQ = "1";
        if ($("#divBaseSBFTbl").find("tbody").eq(0).find("tr[nid='" + BaseSBF.eq(0).attr("nid") + "'][ntype='" + BaseSBF.eq(0).attr("ntype") + "']").length > 0) {
            MOQ = $("#divBaseSBFTbl").find("tbody").eq(0).find("tr[nid='" + BaseSBF.eq(0).attr("nid") + "'][ntype='" + BaseSBF.eq(0).attr("ntype") + "']").find("input[type='text']").val();
        }

        switch ($("#ConatntMatter_hdnBaseSBFAction").val()) {
            case "1":
                $("#divBaseSBFTbl").find("tbody").eq(0).html("");
                break;
            case "2":
                $("#divBaseSBFTbl").find("tbody").eq(0).find("tr[flgActive='1']").remove();
                break;
        }
        fnAddBaseSBFtr(BaseSBF, ProxySBF, MOQ);
    }
    if (ProxySBF.length > 0) {
        fnUpdateProxyList(ProxySBF);
    }
}
function fnUpdateProxyList(ProxySBF) {
    var str = "";
    ProxySBF.each(function () {
        str = "";
        if ($(this).attr("flgBase") == "1") {
            str += "<tr class='ActiveBase'>";
        }
        else {
            str += "<tr>";
        }
        str += "<td>" + $(this).find("td").eq(3).html() + "</td>";
        str += "<td>" + $(this).find("td").eq(4).html() + "</td>";
        str += "<td>" + $(this).find("td").eq(5).html() + "</td>";
        str += "<tr>";

        if ($(this).attr("flgBase") == "1") {
            $("#divBaseProxySBFTbl").find("table").eq(0).find("tbody").eq(0).prepend(str);
        }
        else {
            $("#divBaseProxySBFTbl").find("table").eq(0).find("tbody").eq(0).append(str);
        }
    });
}
function fnAddBaseSBFtr(BaseSBF, ProxySBF, MOQ) {
    var strProxySBF = "";
    for (var i = 0; i < ProxySBF.length; i++) {
        strProxySBF += "^" + ProxySBF.eq(i).attr("nid") + "|" + ProxySBF.eq(i).attr("ntype");
    }

    var strBaseSBF = "";
    if ($("#ConatntMatter_hdnBaseSBFAction").val() != "2") {
        strBaseSBF += "<tr strbase='" + BaseSBF.eq(0).find("td").eq(5).html() + "' nid='" + BaseSBF.eq(0).attr("nid") + "' ntype='" + BaseSBF.eq(0).attr("ntype") + "' proxy='" + strProxySBF.substring(1) + "' flgActive='1' class='clsActve'>";
        strBaseSBF += "<td>" + BaseSBF.eq(0).find("td").eq(5).html() + "</td>";
        strBaseSBF += "<td>" + ProxySBF.length + "</td>";
        strBaseSBF += "<td><input type='text' value='" + MOQ + "' onfocus='fnMOQFocus(this);' onblur='fnMOQBlur(this);'/></td>";
    }
    else {
        strBaseSBF += "<tr strbase='" + BaseSBF.eq(0).find("td").eq(5).html() + "' nid='" + BaseSBF.eq(0).attr("nid") + "' ntype='" + BaseSBF.eq(0).attr("ntype") + "' proxy='" + strProxySBF.substring(1) + "' flgActive='1' class='clsActve'>";
        strBaseSBF += "<td onclick='fnEditBaseSBF(this);'>" + BaseSBF.eq(0).find("td").eq(5).html() + "</td>";
        strBaseSBF += "<td onclick='fnEditBaseSBF(this);'>" + ProxySBF.length + "</td>";
        strBaseSBF += "<td><input type='text' value='" + MOQ + "' onfocus='fnMOQFocus(this);' onblur='fnMOQBlur(this);'/></td>";
    }
    strBaseSBF += "<td><img src='../../Images/cancel.png' title='Remove' onclick='fnRemoveBaseSBF(this);'></td>";
    strBaseSBF += "</tr>";

    $("#divBaseSBFTbl").find("tbody").eq(0).prepend(strBaseSBF);
}
function fnEditBaseSBF(ctrl) {
    fnClearProxySBFSel();
    $("#divProxySBFTbl").find("table").eq(0).removeClass("clsBaseSBFDisable");
    $("#divBaseProxySBFTbl").find("table").eq(0).find("tbody").eq(0).html("");

    $(ctrl).closest("tr").attr("flgActive", "1").siblings().attr("flgActive", "0");
    $(ctrl).closest("tr").addClass("clsActve").siblings().removeClass("clsActve");


    var nid = $(ctrl).closest("tr").attr("nid");
    var proxy = $(ctrl).closest("tr").attr("proxy");
    for (var i = 0; i < proxy.split("^").length; i++) {
        var sbftr = $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr[nid='" + proxy.split("^")[i].split("|")[0] + "'][ntype='" + proxy.split("^")[i].split("|")[1] + "']");

        var str = "";
        if (nid == proxy.split("^")[i].split("|")[0])
            str += "<tr class='ActiveBase'>";
        else
            str += "<tr>";
        str += "<td>" + sbftr.eq(0).find("td").eq(3).html() + "</td>";
        str += "<td>" + sbftr.eq(0).find("td").eq(4).html() + "</td>";
        str += "<td>" + sbftr.eq(0).find("td").eq(5).html() + "</td>";
        str += "<tr>";
        if (nid == proxy.split("^")[i].split("|")[0])
            $("#divBaseProxySBFTbl").find("table").eq(0).find("tbody").eq(0).prepend(str);
        else
            $("#divBaseProxySBFTbl").find("table").eq(0).find("tbody").eq(0).append(str);

        // ------------------------------------------------------------------------------------------
        sbftr.eq(0).attr("flg", "1");
        sbftr.eq(0).addClass("Active");
        sbftr.eq(0).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");

        if (nid == proxy.split("^")[i].split("|")[0]) {
            sbftr.eq(0).attr("flgBase", "1");
            sbftr.eq(0).addClass("ActiveBase");
            sbftr.eq(0).find("td").eq(6).html("<i class='fa fa-circle' style='color: #0000C4;'></i>");
        }

        var trHTML = sbftr[0].outerHTML;
        sbftr.eq(0).remove();
        $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).prepend(trHTML);
    }
}
function fnClearProxySBFSel() {
    $("#divProxySBFTbl").find("table").eq(0).addClass("clsBaseSBFDisable");
    $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
        $(this).attr("flg", "0");
        $(this).removeClass("Active");
        $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

        if ($(this).attr("flgBase") == "1") {
            $(this).attr("flgBase", "0");
            $(this).removeClass("ActiveBase");
            $(this).find("td").eq(6).html("<i class='fa fa-circle-o'></i>");
        }
    });
}
function fnRemoveBaseSBF(ctrl) {
    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to remove Base SBF - <span style='color:#0000ff; font-weight: 700;'>" + $(ctrl).closest("tr").attr("strBase") + "</span>.<br/>Do you want to continue ?</div>");

    $("#divConfirm").dialog({
        "modal": true,
        "width": "320",
        "height": "200",
        "title": "Message :",
        close: function () {
            $("#divConfirm").dialog('destroy');
        },
        buttons: [{
            text: 'Yes',
            class: 'btn-primary',
            click: function () {
                fnClearProxySBFSel();
                $(ctrl).closest("tr").remove();
                $("#divBaseProxySBFTbl").find("table").eq(0).find("tbody").eq(0).html("");

                $("#divConfirm").dialog('close');
            }
        },
        {
            text: 'No',
            class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');
            }
        }]
    });
}

function fnMOQFocus(ctrl) {

    if ($(ctrl).val() == "0")
        $(ctrl).val("");
}
function fnMOQBlur(ctrl) {
    if ($(ctrl).val() == "")
        $(ctrl).val("0");
}

function fnClusterPopuptypefilter(ctrl) {
    var filter = ($(ctrl).val()).toUpperCase().split(",");
    if ($(ctrl).val().length > 2) {
        $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "0");
        $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "none");

        var flgValid = 0;
        $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td")[1].innerText.toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }
            if (flgValid == 1) {
                $(this).attr("flgVisible", "1");
                $(this).css("display", "table-row");
            }
        });
    }
    else {
        $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
        $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    }
}
function fnShowClusterPopup(ctrl, flg) {   // 1: filter, 2: In Tbl
    $("#divClusterPopupTbl").html("<div style='margin-top: 25%; text-align: center;'><img alt='Loading...' title='Loading...' src='../../Images/loading.gif' /></div>");

    $("#divClusterPopup").dialog({
        "modal": true,
        "width": "92%",
        "height": "560",
        "title": "Cluster(s) :",
        open: function () {
            var strtable = "";
            strtable += "<table class='table table-bordered table-sm table-hover'>";
            strtable += "<thead>";
            strtable += "<tr>";
            strtable += "<th style='width:15%;'>Country</th>";
            strtable += "<th style='width:15%;'>Region</th>";
            strtable += "<th style='width:20%;'>Site</th>";
            strtable += "<th style='width:35%;'>Distributor</th>";
            strtable += "<th style='width:15%;'>Branch</th>";
            strtable += "</tr>";
            strtable += "</thead>";
            strtable += "<tbody>";
            strtable += "</tbody>";
            strtable += "</table>";
            $("#divClusterSelectionTbl").html(strtable);

            var selectedstr = $(ctrl).attr("selectedstr");

            var LoginID = $("#ConatntMatter_hdnLoginID").val();
            var RoleID = $("#ConatntMatter_hdnRoleID").val();
            var UserID = $("#ConatntMatter_hdnUserID").val();
            var Qtr = MonthArr.indexOf($("#ddlQuarter").val().split("|")[0].split("-")[1]) + 1;
            var Yr = $("#ddlQuarter").val().split("|")[0].split("-")[2];

            PageMethods.GetClusters(LoginID, RoleID, UserID, "5", Qtr, Yr, GetClusters_pass, GetClusters_failed, selectedstr);
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                var selectedstr = "", descr = "";
                $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']").each(function () {
                    selectedstr += "^" + $(this).attr("clusterid");
                    descr += ", " + $(this).find("td").eq(1).html();
                });
                if (selectedstr != "") {
                    selectedstr = selectedstr.substring(1);
                    descr = descr.substring(2);
                }

                $(ctrl).attr("selectedstr", selectedstr);
                if (flg == 2) {
                    $(ctrl).closest("div").prev().html(descr);
                }
                $("#divClusterPopup").dialog('close');
            }
        },
        {
            text: 'Reset',
            class: 'btn-primary',
            click: function () {
                fnClusterPopupReset();
            }
        },
        {
            text: 'Cancel',
            class: 'btn-primary',
            click: function () {
                $("#divClusterPopup").dialog('close');
            }
        }]
    });
}
function GetClusters_pass(res, selectedstr) {
    $("#divClusterPopupTbl").html(res)

    if (selectedstr != "") {
        for (var i = 0; i < selectedstr.split("^").length; i++) {
            var tr = $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[clusterid='" + selectedstr.split("^")[i] + "']");
            tr.eq(0).attr("flg", "1");
            tr.eq(0).addClass("Active");
            tr.eq(0).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");
        }
        fnGetSelHierTbl();
    }
}
function GetClusters_failed() {
    $("#divClusterPopupTbl").html("Due to some technical reasons, we are unable to Process your request !");
}

function fnSelectUnSelectCluster(ctrl) {
    if ($(ctrl).attr("flg") == "1") {
        $(ctrl).attr("flg", "0");
        $(ctrl).removeClass("Active");
        $(ctrl).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
    }
    else {
        $(ctrl).attr("flg", "1");
        $(ctrl).addClass("Active");
        $(ctrl).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");
    }
    fnGetSelHierTbl();
}
function fnGetSelHierTbl() {
    var BucketValues = [];
    if ($("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").length > 0)
        $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").each(function () {
            var Selstr = $(this).attr("strvalue");
            for (var i = 0; i < Selstr.split("^").length; i++) {
                BucketValues.push({
                    "col1": Selstr.split("^")[i].split("|")[0],
                    "col2": Selstr.split("^")[i].split("|")[1],
                    "col3": "2"
                });
            }
        });

    if (BucketValues.length > 0) {
        $("#dvloader").show();
        PageMethods.GetSelHierTbl(BucketValues, "2", "0", GetSelHierTbl_pass, GetSelHierTbl_failed);
    }
    else {
        $("#divClusterSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
    }
}
function GetSelHierTbl_pass(res) {
    $("#dvloader").hide();
    $("#divClusterSelectionTbl").html(res);
}
function GetSelHierTbl_failed() {
    $("#dvloader").hide();
    $("#divClusterSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("<tr><td colspan='4' style='text-align: center; padding: 50px 10px 0 10px;'>Due to some technical reasons, we are unable to Process your request !</td></tr>");
}

function fnClusterPopupReset() {
    $("#divClusterPopupTbl").find("table").eq(0).find("thead").eq(0).find("input[type='text']").val("");
    $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
    $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");

    $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").each(function () {
        $(this).attr("flg", "0");
        $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
        $(this).removeClass("Active");
    });

    $("#divClusterSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
}

function fnCollapsefilter(ctrl) {
    $("#Filter").hide();
    $("#divRightReport").height(ht - ($("#Heading").height() + 200));
    $("#divLeftReport").height(ht - ($("#Heading").height() + 200));

    $(ctrl).attr("class", "fa fa-arrow-circle-up");
    $(ctrl).attr("onclick", "fnExpandfilter(this);");
}
function fnExpandfilter(ctrl) {
    $("#Filter").show();
    $("#divRightReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 200));
    $("#divLeftReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 200));

    $(ctrl).attr("class", "fa fa-arrow-circle-down");
    $(ctrl).attr("onclick", "fnCollapsefilter(this);");
}


function GetBucketbasedonType_pass(res, CopyBucketTD) {
    $("#divCopyBucketPopupTbl").html(res)

    if (CopyBucketTD != "0") {
        for (var i = 0; i < CopyBucketTD.split("|").length; i++) {
            var tr = $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[bucketid='" + CopyBucketTD.split("|")[i] + "']");
            tr.eq(0).attr("flg", "1");
            tr.eq(0).addClass("Active");
            tr.eq(0).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");
        }
        fnGetCopySelHierTbl();
    }
}
function GetBucketbasedonType_failed() {
    $("#divCopyBucketPopupTbl").html("Due to some technical reasons, we are unable to Process your request !");
}
function fnCopyBucketSelection() {
    var IsFirst = true;
    var CopyBucketTD = "0", descr = "", SelectedHier = "", SelectedLvl = "0";

    var trArr = $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active");
    if (trArr.length > 0) {
        trArr.each(function () {
            if (IsFirst) {
                IsFirst = false;
                CopyBucketTD = $(this).attr("bucketid");
            }
            else
                CopyBucketTD += "|" + $(this).attr("bucketid");
        });

        if ($("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr").length > 0) {
            SelectedLvl = $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr").eq(0).attr("lvl");
        }

        $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            if (parseInt($(this).attr("lvl")) < parseInt(SelectedLvl)) {
                SelectedLvl = $(this).attr("lvl");
            }

            SelectedHier += "^" + $(this).attr("nid") + "|" + $(this).attr("lvl");
            switch ($(this).attr("lvl")) {
                case "10":
                    descr += ", " + $(this).find("td").eq(0).html();
                    break;
                case "20":
                    descr += ", " + $(this).find("td").eq(1).html();
                    break;
                case "30":
                    descr += ", " + $(this).find("td").eq(2).html();
                    break;
                case "40":
                    descr += ", " + $(this).find("td").eq(3).html();
                    break;
                case "100":
                    descr += ", " + $(this).find("td").eq(0).html();
                    break;
                case "110":
                    descr += ", " + $(this).find("td").eq(1).html();
                    break;
                case "120":
                    descr += ", " + $(this).find("td").eq(2).html();
                    break;
                case "130":
                    descr += ", " + $(this).find("td").eq(3).html();
                    break;
                case "140":
                    descr += ", " + $(this).find("td").eq(4).html();
                    break;
                case "145":
                    descr += ", " + $(this).find("td").eq(5).html();
                    break;
                case "200":
                    descr += ", " + $(this).find("td").eq(0).html();
                    break;
                case "210":
                    descr += ", " + $(this).find("td").eq(1).html();
                    break;
                case "220":
                    descr += ", " + $(this).find("td").eq(2).html();
                    break;
            }
        });

        descr = descr.substring(2);
        SelectedHier = SelectedHier.substring(1);
    }

    return CopyBucketTD + "|||" + descr + "|||" + SelectedHier + "|||" + SelectedLvl;
}
function fnProdSelected(ctrl) {
    var SelectedLvl = "0", SelectedHier = "", descr = "";
    if ($("#divHierSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr").length > 0) {
        SelectedLvl = $("#divHierSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr").eq(0).attr("lvl");
    }

    $("#divHierSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
        if (parseInt($(this).attr("lvl")) < parseInt(SelectedLvl)) {
            SelectedLvl = $(this).attr("lvl");
        }

        SelectedHier += "^" + $(this).attr("nid") + "|" + $(this).attr("lvl");
        switch ($(this).attr("lvl")) {
            case "10":
                descr += ", " + $(this).find("td").eq(0).html();
                break;
            case "20":
                descr += ", " + $(this).find("td").eq(1).html();
                break;
            case "30":
                descr += ", " + $(this).find("td").eq(2).html();
                break;
            case "40":
                descr += ", " + $(this).find("td").eq(3).html();
                break;
            case "100":
                descr += ", " + $(this).find("td").eq(0).html();
                break;
            case "110":
                descr += ", " + $(this).find("td").eq(1).html();
                break;
            case "120":
                descr += ", " + $(this).find("td").eq(2).html();
                break;
            case "130":
                descr += ", " + $(this).find("td").eq(3).html();
                break;
            case "140":
                descr += ", " + $(this).find("td").eq(4).html();
                break;
            case "145":
                descr += ", " + $(this).find("td").eq(5).html();
                break;
            case "200":
                descr += ", " + $(this).find("td").eq(0).html();
                break;
            case "210":
                descr += ", " + $(this).find("td").eq(1).html();
                break;
            case "220":
                descr += ", " + $(this).find("td").eq(2).html();
                break;
        }
    });

    if (SelectedHier != "") {
        SelectedHier = SelectedHier.substring(1);
        descr = descr.substring(2);
    }

    return SelectedLvl + "||||" + SelectedHier + "||||" + descr;
}

function fnSaveNewBucket(ctrl, cntr) {
    var SelectedHierValues = fnProdSelected(ctrl).split("||||");

    var BucketType = $("#ConatntMatter_hdnBucketType").val();
    var BucketName = $("#txtBucketName").val();
    var BucketDescr = $("#txtBucketDescription").val();
    var BucketValues = [];
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var PrdLvl = SelectedHierValues[0];
    var PrdString = SelectedHierValues[1];

    for (var i = 0; i < PrdString.split("^").length; i++) {
        BucketValues.push({
            "col1": PrdString.split("^")[i].split("|")[0],
            "col2": PrdString.split("^")[i].split("|")[1],
            "col3": BucketType
        });
    }

    switch (cntr.toString()) {
        case "0":
            $("#dvloader").show();
            PageMethods.fnSaveAsNewBucket(BucketName, BucketDescr, BucketType, BucketValues, LoginID, PrdLvl, PrdString, fnSaveAsNewBucket_pass, fnfailed, ctrl);
            break;
        case "1":
            $("#dvloader").show();
            PageMethods.fnSaveAsNewBucket(BucketName, BucketDescr, BucketType, BucketValues, LoginID, PrdLvl, PrdString, fnSaveAsNewBucketBaseProd_pass, fnfailed, ctrl);
            break;
        case "2":
            $("#dvloader").show();
            PageMethods.fnSaveAsNewBucket(BucketName, BucketDescr, BucketType, BucketValues, LoginID, PrdLvl, PrdString, fnSaveAsNewBucketInitProd_pass, fnfailed, ctrl);
            break;
    }
}
function fnSaveAsNewBucket_pass(res, ctrl) {
    if (res.split("|^|")[0] == "0") {
        $(ctrl).attr("copybuckettd", res.split("|^|")[1]);

        var SelectedHierValues = fnProdSelected(ctrl).split("||||");
        $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
        $(ctrl).attr("ProdHier", SelectedHierValues[1]);
        if ($("#ConatntMatter_hdnSelectedFrmFilter").val() == "1") {
            $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
        }

        $("#divAddNewBucketPopup").dialog('close');
        $("#divHierPopup").dialog('close');
    }
    else if (res.split("|^|")[0] == "1") {
        AutoHideAlertMsg("Bucket name already exist !");
    }
    else {
        AutoHideAlertMsg("Due to some technical reasons, we are unable to create new Bucket !");
    }
    $("#dvloader").hide();
}
function fnSaveAsNewBucketBaseProd_pass(res, ctrl) {
    if (res.split("|^|")[0] == "0") {
        $(ctrl).attr("copybuckettd", res.split("|^|")[1]);

        var rowIndex = $(ctrl).closest("tr[iden='SBD']").index();
        var SelectedHierValues = fnProdSelected(ctrl).split("||||");

        $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
        $(ctrl).attr("ProdHier", SelectedHierValues[1]);
        if (SelectedHierValues[2] != "") {
            $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
            fnUpdateInitProdSel(ctrl, 2);

            fnUpdateOtherSlabAndInitProdSel(ctrl, 2, "0||||" + SelectedHierValues[0] + "||||" + SelectedHierValues[1] + "||||" + SelectedHierValues[2]);
        }
        else {
            $(ctrl).closest("div").prev().html("Select Products Applicable in Group");
        }

        fnAdjustRowHeight(rowIndex);

        $("#divAddNewBucketPopup").dialog('close');
        $("#divHierPopup").dialog('close');
    }
    else if (res.split("|^|")[0] == "1") {
        AutoHideAlertMsg("Bucket name already exist !");
    }
    else {
        AutoHideAlertMsg("Due to some technical reasons, we are unable to create new Bucket !");
    }
    $("#dvloader").hide();
}
function fnSaveAsNewBucketInitProd_pass(res, ctrl) {
    if (res.split("|^|")[0] == "0") {
        $(ctrl).attr("copybuckettd", res.split("|^|")[1]);

        var rowIndex = $(ctrl).closest("tr[iden='SBD']").index();
        var SelectedHierValues = fnProdSelected(ctrl).split("||||");

        $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
        $(ctrl).attr("ProdHier", SelectedHierValues[1]);
        if (SelectedHierValues[2] != "") {
            $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
        }
        else {
            $(ctrl).closest("div").prev().html("Select Products");
        }
        fnAdjustRowHeight(rowIndex);

        $("#divAddNewBucketPopup").dialog('close');
        $("#divHierPopup").dialog('close');
    }
    else if (res.split("|^|")[0] == "1") {
        AutoHideAlertMsg("Bucket name already exist !");
    }
    else {
        AutoHideAlertMsg("Due to some technical reasons, we are unable to create new Bucket !");
    }
    $("#dvloader").hide();
}