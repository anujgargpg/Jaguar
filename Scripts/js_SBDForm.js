
var ht = 0;
var SaveCntr = 0;
var MonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
function fnfailed() {
    AutoHideAlertMsg("Due to some technical reasons, we are unable to process your request !");
    $("#dvloader").hide();
}

$(document).ready(function () {
    $("input:text").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});
$(document).ready(function () {
    ht = $(window).height();
    $("#divRightReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 200));
    $("#divLeftReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 200));

    $(".clsDate").datepicker({
        dateFormat: 'dd-M-y'
    });

    $("#ddlStatus").html($("#ConatntMatter_hdnProcessGrp").val());

    $("#ddlQuarter").html($("#ConatntMatter_hdnQuarter").val().split("|^|")[0]);
    $("#ddlQuarter").val($("#ConatntMatter_hdnQuarter").val().split("|^|")[1]);
    //$("#ddlQuarter").find("option[Qtrtype='2']").remove();

    $("#ddlQuarterPopup").html($("#ConatntMatter_hdnQuarter").val().split("|^|")[0]);
    $("#ddlQuarterPopup").find("option[Qtrtype='0']").remove();
    $("#ddlQuarterPopup").find("option[Qtrtype='3']").remove();

    $("#ConatntMatter_hdnQuarter").val($("#ddlQuarter").val());

    $("#ddlMSMPAlies").html($("#ConatntMatter_hdnMSMPAlies").val());
    $("#ddlMSMPAlies").multiselect({
        noneSelectedText: "--Select--"
    }).multiselectfilter();
    $("#ddlMSMPAlies").next().css({
        "height": "calc(1.5em + .5rem + 2px)",
        "font-size": "0.76rem",
        "font-weight": "400",
        "width": "170px",
        "padding-right": "0",
        "border-radius": ".2rem",
        "border-color": "#ced4da",
        "padding": "0.25rem 0 0 0.5rem"
    });
    $("#ddlMSMPAlies").next().find("span.ui-icon").eq(0).css({
        "border": "none",
        "margin": ".2rem 0",
        "margin-bottom": "0",
        "background-color": "transparent"
    });

    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    if (RoleID == "2") {
        $("#divAddNewFilterBlock").css("display", "none");
        $("#divTypeSearchFilterBlock").css("width", "59%");
    }

    fnGetReport(1);
});

function fnShowHierFilter(ctrl) {
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var flgVisibleHierFilter = $(ctrl).attr("flgVisibleHierFilter");
    if (flgVisibleHierFilter == "0") {
        $(ctrl).css("color", "#0076FF");
        $(ctrl).attr("flgVisibleHierFilter", "1");

        if (RoleID == "1" || RoleID == "2" || RoleID == "4") {
            $("#MSMPFilterBlock").show();
            $("#HierFilterBlock").show();
            $("#HierFilterBlock").attr("class", "col-5");
            $("#BookmarkFilterBlock").attr("class", "col-4");

            $("#divHierFilterBlock").css("width", "56%");
            $("#divTypeSearchFilterBlock").css("width", "7%");
            if (RoleID == "2") {
                $("#divTypeSearchFilterBlock").css("width", "21%");
            }
        }
        else {
            $("#MSMPFilterBlock").hide();
            $("#HierFilterBlock").show();
            $("#HierFilterBlock").attr("class", "col-7");
            $("#BookmarkFilterBlock").attr("class", "col-5");

            $("#divHierFilterBlock").css("width", "43%");
            $("#divTypeSearchFilterBlock").css("width", "20%");
            if (RoleID == "2") {
                $("#divTypeSearchFilterBlock").css("width", "34%");
            }
        }
    }
    else {
        $(ctrl).css("color", "#666666");
        $(ctrl).attr("flgVisibleHierFilter", "0");

        $("#divHierFilterBlock").css("width", "18%");
        $("#divTypeSearchFilterBlock").css("width", "45%");
        if (RoleID == "2") {
            $("#divTypeSearchFilterBlock").css("width", "59%");
        }

        $("#txtProductHierSearch").attr("prodhier", "");
        $("#txtProductHierSearch").attr("prodlvl", "");
        $("#btnClusterFilter").attr("selectedstr", "");
        $("#txtChannelHierSearch").attr("prodhier", "");
        $("#txtChannelHierSearch").attr("prodlvl", "");

        $("#MSMPFilterBlock").hide();
        $("#HierFilterBlock").hide();
        $("#BookmarkFilterBlock").attr("class", "col-12");
    }
}
function fntypefilter() {
    var flgtr = 0, rowindex = 0;
    var filter = $("#txtfilter").val().toUpperCase().split(",");

    if ($("#txtfilter").val().toUpperCase().length > 2) {
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").css("display", "none");
        $("#tblleftfixed").find("tbody").eq(0).find("tr").css("display", "none");

        var flgValid = 0;
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td").eq(12).html().toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }

            if (flgValid == 1) {
                $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).css("display", "table-row");
                $(this).css("display", "table-row");
                flgtr = 1;
            }

            rowindex++;
        });

        if (flgtr == 0) {
            $("#btnInitExpandedCollapseMode").hide();
            $("#divReport").hide();
            $("#divMsg").html("No Records found for selected Filters !");
        }
        else {
            $("#btnInitExpandedCollapseMode").show();
            $("#divReport").show();
            $("#divMsg").html('');
        }
    }
    else {
        $("#btnInitExpandedCollapseMode").show();
        $("#divReport").show();
        $("#divMsg").html('');

        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").css("display", "table-row");
        $("#tblleftfixed").find("tbody").eq(0).find("tr").css("display", "table-row");
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
    var Qtr = $("#ddlQuarter").val().split("|")[2];
    var Yr = $("#ddlQuarter").val().split("|")[3];
    var ProcessGroup = $("#ddlStatus").val();

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

    if (Qtr == $("#btnClusterFilter").attr("mth") && Yr == $("#btnClusterFilter").attr("yr")) {
        if (LocString != "") {
            for (var i = 0; i < LocString.split("^").length; i++) {
                LocValues.push({
                    "col1": LocString.split("^")[i],
                    "col2": "0",
                    "col3": "4"
                });
            }
        }
        else {
            LocValues.push({ "col1": "0", "col2": "0", "col3": "2" });
        }
    }
    else {
        LocValues.push({ "col1": "0", "col2": "0", "col3": "2" });
        $("#btnClusterFilter").attr("selectedstr", "");
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
        $("#divRightReport").html(res.split("|^|")[1]);
        if (res.split("|^|")[2] == "") {
            $("#divButtons").html('');
        }
        else {
            $("#divButtons").html(res.split("|^|")[2]);
        }

        $("#ConatntMatter_hdnIsNewAdditionAllowed").val(res.split("|^|")[3]);
        if (res.split("|^|")[3] == "1") {
            $("#btnAddNewINIT").removeClass("btn-disabled");
            $("#btnAddNewINIT").attr("onclick", "fnAddNew();");

            $("#btnCopyINIT").removeClass("btn-disabled");
            $("#btnCopyINIT").attr("onclick", "fnImportPrevQtrSBDPopup();");
        }
        else {
            $("#btnAddNewINIT").addClass("btn-disabled");
            $("#btnAddNewINIT").removeAttr("onclick");

            $("#btnCopyINIT").addClass("btn-disabled");
            $("#btnCopyINIT").removeAttr("onclick");
        }

        $("#divLegends").html(res.split("|^|")[4]);

        var leftfixed = "";
        trArr = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']");
        leftfixed += "<table id='tblleftfixed' class='table table-striped table-bordered table-sm clsReport' style='width:99.6%;'>";
        leftfixed += "<thead>";
        leftfixed += "<tr>";
        for (var i = 0; i < 3; i++) {
            leftfixed += "<th>" + $("#tblReport").find("thead").eq(0).find("tr").eq(0).find("th").eq(i).html() + "</th>";
        }
        leftfixed += "</tr>";
        leftfixed += "</thead>";
        leftfixed += "<tbody>";
        for (h = 0; h < trArr.length; h++) {
            leftfixed += "<tr SBD='" + trArr.eq(h).attr("SBD") + "' SBDName='" + trArr.eq(h).attr("SBDName") + "' flgEdit='0'>";
            for (var i = 0; i < 3; i++) {
                if (i == 0) {
                    leftfixed += "<td style='background: " + trArr.eq(h).find("td").eq(i).css("background-color") + ";'>" + trArr.eq(h).find("td").eq(i).html() + "</td>";
                }
                else if (i == 1) {
                    leftfixed += "<td>" + trArr.eq(h).find("td").eq(i).html() + "</td>";
                }
                else if (i == 2) {
                    leftfixed += "<td class='clstdAction'>" + trArr.eq(h).find("td").eq(i).html() + "</td>";
                }
                else {
                    leftfixed += "<td>" + trArr.eq(h).find("td").eq(i).html() + "</td>";
                }
            }
            leftfixed += "</tr>";
        }
        leftfixed += "</tbody>";
        leftfixed += "</table>";
        $("#divLeftReport").html(leftfixed);

        var ht = $("#tblReport").find("thead").eq(0).find("tr").eq(0).find("th").eq(0).height();
        $("#tblReport").find("thead").eq(0).find("tr").eq(0).find("th").eq(0).height(ht);
        $("#tblleftfixed").find("thead").eq(0).find("tr").eq(0).find("th").eq(0).height(ht);

        $("#divRightReport").scroll(function () {
            $("#divLeftReport").scrollTop($(this).scrollTop());
        });

        $("#tblReport").css("margin-left", "-229px");

        fnCreateHeader();
        if ($("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(0).attr("Init") == "0") {
            $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(0).remove();
            $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(0).remove();
        }

        if ($("#divLeftReport").find("tbody").eq(0).find("tr").length == 0) {
            var ht = $(window).height();
            $("#divRightReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 200));
            $("#divLeftReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 200));
        }

        $("#btnInitExpandedCollapseMode").html("Collapsed Mode");
        $("#btnInitExpandedCollapseMode").attr("flgCollapse", "1");

        Tooltip(".clsInform");
        $("#dvloader").hide();
        //AutoHideAlertMsg(res.split("|^|")[5]);
    }
    else {
        fnfailed();
    }
}
function fnCreateHeader() {
    var fixedHeader = "";
    fixedHeader += "<table id='tblleftfixedHeader' class='table table-striped table-bordered table-sm clsReport' style='width:99.8%; margin-bottom: 0;'>";
    fixedHeader += "<thead>";
    fixedHeader += "<tr>";
    for (var i = 0; i < 3; i++) {
        fixedHeader += "<th>" + $("#tblReport").find("thead").eq(0).find("tr").eq(0).find("th").eq(i).html() + "</th>";
    }
    fixedHeader += "</tr>";
    fixedHeader += "</thead>";
    fixedHeader += "</table>";
    $("#divLeftReportHeader").html(fixedHeader);

    for (i = 0; i < $("#tblleftfixed").find("th").length; i++) {
        var th_wid = $("#tblleftfixed").find("th")[i].clientWidth;
        $("#tblleftfixedHeader").find("th").eq(i).css("min-width", th_wid);
        $("#tblleftfixedHeader").find("th").eq(i).css("width", th_wid);
        $("#tblleftfixed").find("th").eq(i).css("min-width", th_wid);
        $("#tblleftfixed").find("th").eq(i).css("width", th_wid);
    }

    fixedHeader = "";
    fixedHeader += "<table id='tblRightfixedHeader' class='table table-striped table-bordered table-sm clsReport' style='margin-bottom: 0;'>";
    fixedHeader += "<thead>";
    fixedHeader += $("#tblReport").find("thead").eq(0).html();
    fixedHeader += "</thead>";
    fixedHeader += "</table>";
    $("#divRightReportHeader").html(fixedHeader);
    $("#tblRightfixedHeader").css("margin-left", "-226px");

    var wid = $("#tblReport").width();
    $("#tblReport").css("width", wid);
    $("#tblRightfixedHeader").css("min-width", wid);
    for (i = 0; i < $("#tblReport").find("th").length; i++) {
        var th_wid = $("#tblReport").find("th")[i].clientWidth;
        $("#tblRightfixedHeader").find("th").eq(i).css("min-width", th_wid);
        $("#tblRightfixedHeader").find("th").eq(i).css("width", th_wid);
        $("#tblReport").find("th").eq(i).css("min-width", th_wid);
        $("#tblReport").find("th").eq(i).css("width", th_wid);
    }
    $("#tblleftfixed").css("margin-top", "-" + $("#tblRightfixedHeader")[0].offsetHeight + "px");
    $("#tblReport").css("margin-top", "-" + $("#tblRightfixedHeader")[0].offsetHeight + "px");

    $("#tblleftfixedHeader").find("th").eq(0).height($("#tblRightfixedHeader").find("th").eq(0).height());
    $("#divRightReport").scroll(function () {
        $("#divRightReportHeader").scrollLeft($(this).scrollLeft());
    });

    $("#divRightReport").scrollLeft(0);
    $("#divRightReportHeader").scrollLeft(0);

    $("#divRightReport").scrollTop(0);
    $("#divRightReportHeader").scrollTop(0);
}
function fnAdjustColumnWidth() {
    $("#tblReport").css("width", "auto");
    for (i = 0; i < $("#tblReport").find("tr").eq(0).find("th").length; i++) {
        $("#tblReport").find("tr").eq(0).find("th").eq(i).css("min-width", "auto");
        $("#tblReport").find("tr").eq(0).find("th").eq(i).css("width", "auto");
    }

    var wid = $("#tblReport").width();
    $("#tblReport").css("width", wid);
    $("#tblRightfixedHeader").css("min-width", wid);

    for (i = 0; i < $("#tblReport").find("tr").eq(0).find("th").length; i++) {
        var th_wid = $("#tblReport").find("th")[i].clientWidth;
        $("#tblRightfixedHeader").find("th").eq(i).css("min-width", th_wid);
        $("#tblRightfixedHeader").find("th").eq(i).css("width", th_wid);
        $("#tblReport").find("th").eq(i).css("min-width", th_wid);
        $("#tblReport").find("th").eq(i).css("width", th_wid);

        $("#tblRightfixedHeader").find("th").eq(i).html($("#tblReport").find("th").eq(i).html());
    }
}
function fnAdjustRowHeight(index) {
    leftfixedtr = $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(index);
    tr = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(index);

    tr.css("height", "auto");
    tr.css("min-height", "auto");
    leftfixedtr.css("height", "auto");
    leftfixedtr.css("min-height", "auto");

    if (leftfixedtr[0].offsetHeight != tr[0].offsetHeight) {
        if (leftfixedtr[0].offsetHeight > tr[0].offsetHeight) {
            tr.css("height", leftfixedtr[0].offsetHeight + "px");
            tr.css("min-height", leftfixedtr[0].offsetHeight + "px");
            leftfixedtr.css("height", leftfixedtr[0].offsetHeight + "px");
            leftfixedtr.css("min-height", leftfixedtr[0].offsetHeight + "px");
        }
        else if (leftfixedtr[0].offsetHeight < tr[0].offsetHeight) {
            tr.css("height", tr[0].offsetHeight + "px");
            tr.css("min-height", tr[0].offsetHeight + "px");
            leftfixedtr.css("height", tr[0].offsetHeight + "px");
            leftfixedtr.css("min-height", tr[0].offsetHeight + "px");
        }
    }
}

function fnInitExpandedCollapseMode() {
    if ($("#btnInitExpandedCollapseMode").attr("flgCollapse") == "0") {
        $("#btnInitExpandedCollapseMode").html("Collapsed Mode");
        $("#btnInitExpandedCollapseMode").attr("flgCollapse", "1");
    }
    else {
        $("#btnInitExpandedCollapseMode").html("Expanded Mode");
        $("#btnInitExpandedCollapseMode").attr("flgCollapse", "0");
    }
    fnInitExpandedCollapseModetbl();
}
function fnInitExpandedCollapseModetbl() {
    $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD'][flgEdit='0']").each(function () {
        var rowIndex = $(this).index();

        var SBDName = $(this).attr("SBDName");
        var loc = ExtendContentBody($(this).attr("strloc").split("~")[0]);
        var channel = ExtendContentBody($(this).attr("strchannel").split("~")[0]);
        var strsbd = ExtendContentBody($(this).attr("strsbd").split("~")[0]);

        if ($("#btnInitExpandedCollapseMode").attr("flgCollapse") == "1") {
            SBDName = SBDName.length > 20 ? "<span title='" + SBDName + "' class='clsInform'>" + SBDName.substring(0, 18) + "..</span>" : SBDName;
            loc = "<div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (loc.length > 70 ? "<span title='" + loc + "' class='clsInform'>" + loc.substring(0, 68) + "..</span>" : loc) + "</div>";
            channel = "<div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (channel.length > 70 ? "<span title='" + channel + "' class='clsInform'>" + channel.substring(0, 68) + "..</span>" : channel) + "</div>";
            strsbd = "<div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (strsbd.length > 70 ? "<span title='" + strsbd + "' class='clsInform'>" + strsbd.substring(0, 68) + "..</span>" : strsbd) + "</div>";
        }
        else {
            loc = "<div style='width: 202px; min-width: 202px; font-size: 0.6rem;'>" + ExtendContentBody(loc) + "</div>";
            channel = "<div style='width: 202px; min-width: 202px; font-size: 0.6rem;'>" + ExtendContentBody(channel) + "</div>";
            strsbd = "<div style='width: 202px; min-width: 202px; font-size: 0.6rem;'>" + ExtendContentBody(strsbd) + "</div>";
        }


        $(this).find("td[iden='SBD']").eq(3).html(SBDName);
        //$("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).find("td").eq(3).html(SBDName);

        if ($("#tblReport").attr("IsChannelExpand") == "1")
            $(this).find("td[iden='SBD']").eq(4).html(channel);

        if ($("#tblReport").attr("IsLocExpand") == "1")
            $(this).find("td[iden='SBD']").eq(5).html(loc);

        if ($("#tblReport").attr("IsSBDExpand") == "1")
            $(this).find("td[iden='SBD']").eq(6).html(strsbd);

        fnAdjustRowHeight(rowIndex);
    });
    fnAdjustColumnWidth();

    Tooltip(".clsInform");
}

function fnDownload() {
    var Arr = [];
    $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").each(function () {
        if ($(this).attr("SBD") != "0" && $(this).css("display") != "none") {
            Arr.push({ "SBD": $(this).attr("SBD") });
        }
    });
    if (Arr.length == 0) {
        Arr.push({ "SBDID": 0 });
    }
    $("#ConatntMatter_hdnjsonarr").val(JSON.stringify(Arr));
    $("#ConatntMatter_btnDownload").click();
    return false;
}
function fnChangeLogDownload() {
    var Arr = [];
    $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").each(function () {
        if ($(this).attr("SBD") != "0" && $(this).css("display") != "none") {
            Arr.push({ "SBD": $(this).attr("SBD") });
        }
    });
    if (Arr.length == 0) {
        Arr.push({ "SBDID": 0 });
    }
    $("#ConatntMatter_hdnjsonarr").val(JSON.stringify(Arr));
    $("#ConatntMatter_btnChangeLogDownload").click();
    return false;
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
        $("#tblleftfixed").find("tbody").eq(0).find("input[type='checkbox'][iden='chkInit']").prop("checked", true);

        if ($("#tblleftfixed").find("tbody").eq(0).find("input[type='checkbox'][iden='chkInit']:checked").length > 0) {
            $("#divButtons").find("a.btn").removeClass("btn-disabled");
            $("#divButtons").find("a.btn").attr("onclick", "fnSaveFinalAction(this);");
        }
    }
    else {
        $("#tblleftfixed").find("tbody").eq(0).find("input[type='checkbox'][iden='chkInit']").removeAttr("checked");

        $("#divButtons").find("a.btn").addClass("btn-disabled");
        $("#divButtons").find("a.btn").removeAttr("onclick");
    }

    if ($("#tblleftfixed").find("tbody").eq(0).find("tr[flgEdit='1']").length == 0) {
        $("#divButtons").find("a.btn[flgAction='100']").addClass("btn-disabled").removeAttr("onclick", "fnSaveFinalAction(this);");
    }
}
function fnUnchkInitIndividual(ctrl) {
    if (!($(ctrl).is(":checked"))) {
        $("#tblleftfixedHeader").find("input[type='checkbox']").removeAttr("checked");
    }

    if ($("#tblleftfixed").find("tbody").eq(0).find("input[type='checkbox'][iden='chkInit']:checked").length > 0) {
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

    if ($("#tblleftfixed").find("tbody").eq(0).find("tr[flgEdit='1']").length == 0) {
        $("#divButtons").find("a.btn[flgAction='100']").addClass("btn-disabled").removeAttr("onclick", "fnSaveFinalAction(this);");
    }
}

function fnSaveFinalAction(ctrl) {
    var flgAction = $(ctrl).attr("flgAction");          // 1: Submit, 2: Approve, 3: Reject.

    var RoleID = $("#ConatntMatter_hdnRoleID").val();   // 2: Admin
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var ArrSBD = [];

    var SBDName = "";
    if (flgAction == "100") {
        fnSaveAllOpen(0);
    }
    else if (flgAction == "99") {
        fnDeleteSelected();
    }
    else if (flgAction == "5") {
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
            AutoHideAlertMsg("Please select atleast one SBD for Action !");
    }
    else {
        $("#tblleftfixed").find("tbody").eq(0).find("tr").each(function () {
            if ($(this).find("input[type='checkbox'][iden='chkInit']").length > 0) {
                if ($(this).find("input[type='checkbox'][iden='chkInit']").is(":checked")) {
                    var rowIndex = $(this).closest("tr").index();

                    ArrSBD.push({
                        "col1": $(this).closest("tr").attr("sbd"),
                        "col2": flgAction,
                        "col3": ""
                    });

                }
            }
        });

        if (ArrSBD.length == 0) {
            AutoHideAlertMsg("Please select atleast one SBD for Action !");
        }
        else {
            if (flgAction == "4") {
                $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to Approved <span style='color:#0000ff; font-weight: 700;'>" + ArrSBD.length + "</span> SBD(s).<br/>Do you want to continue ?</div>");
            }
            else {
                $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to Submit <span style='color:#0000ff; font-weight: 700;'>" + ArrSBD.length + "</span> SBD(s) for further Approval.<br/>Do you want to continue ?</div>");
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
}
function fnGetAllRejectComments_pass(res, flgAction) {
    if (res.split("|^|")[0] == "0") {
        var strtbl = "";
        strtbl += "<table class='table table-striped table-bordered table-sm clstbl-Reject'>";
        strtbl += "<thead>";
        strtbl += "<tr><th>#</th><th>SBD Name</th><th>Comments</th></tr>";
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
                AutoHideAlertMsg("Norms has been successfully submitted for further processing !");
                break;
            case "5":
                AutoHideAlertMsg("Change Request submitted successfully !");
                break;
            default:
                AutoHideAlertMsg("SBD(s) submitted successfully !");
                break;
        }
        fnGetReport(0);
    }
    else {
        fnfailed();
    }
}

function fnSBDImportTypeSearch(ctrl) {
    $("#tblClusterChannelMappingforImport").find("tbody").eq(0).find("tr").css("display", "table-row");
    $("#tblClusterChannelMappingforImport").find("tbody").eq(0).find("tr").attr("flgClusterVisible", "1");

    var flgValidate = 0;
    $("#tblClusterChannelMappingforImportHeader").find("thead").find("input[type='text']").each(function () {
        if ($(this).val().trim().length > 1) {
            var ind = $(this).closest("th").index();
            var searchtxt = $(this).val().toUpperCase().trim();
            $("#tblClusterChannelMappingforImport").find("tbody").eq(0).find("tr[flgChannelVisible='1']").each(function () {
                flgValidate = 0;

                $(this).find("td").eq(ind).find("span").each(function () {
                    if ($(this).html().toUpperCase().indexOf(searchtxt) > -1) {
                        flgValidate = 1;
                    }
                });

                if (flgValidate == 0) {
                    $(this).css("display", "none");
                    $(this).attr("flgClusterVisible", "0");
                }
            });
        }
    });
}
function fnNormSelectAll(ctrl) {
    if ($(ctrl).is(":checked")) {
        $(ctrl).closest("table").next().find("input[type='checkbox']").prop("checked", true);
    }
    else {
        $(ctrl).closest("table").next().find("input[type='checkbox']").removeAttr("checked");
    }
}
function fnIndividualNormSelect(ctrl) {
    if ($(ctrl).is(":checked")) {
        $(ctrl).closest("tr").find("input[type='checkbox']").prop("checked", true);
    }
    else {
        $(ctrl).closest("tr").find("input[type='checkbox']").removeAttr("checked");
    }
}
function fnImportPrevQtrSBDPopup() {
    if ($("#ddlQuarterPopup").find("option").length > 0) {
        $("#btnImportProductHierFilter").attr("prodhier", "");
        $("#btnImportClusterHierFilter").attr("selectedstr", "");
        $("#btnImportChannelHierFilter").attr("prodhier", "");

        fnImportPrevQtrSBD();
        $("#dvSBDListforImportBody").html("<div style='text-align: center; padding-top: 20px;'><img src='../../Images/loading.gif'/></div>");

        $("#dvSBDListforImport").dialog({
            "modal": true,
            "width": "600",
            "height": "600",
            "title": "SBD-wise Channel-Cluster Mapping for Import :",
            close: function () {
                $("#dvSBDListforImport").dialog('destroy');
            },
            buttons: [{
                text: 'Import SBD(s)',
                class: 'btn-primary',
                click: function () {
                    if ($("#dvSBDListforImport").find("input[type='checkbox']").length > 0) {
                        var QtrNo = $("#ddlQuarter").val().split("|")[2];
                        var QtrYear = $("#ddlQuarter").val().split("|")[3];
                        var ArrCluster = [];
                        var ArrChannel = [];
                        var UserID = $("#ConatntMatter_hdnUserID").val();
                        var LoginID = $("#ConatntMatter_hdnLoginID").val();
                        var RoleID = $("#ConatntMatter_hdnRoleID").val();
                        var FromDATE = $("#ddlQuarter").val().split("|")[0];
                        var EndDate = $("#ddlQuarter").val().split("|")[1];

                        var flgvalidate = 0;
                        $("#tblClusterChannelMappingforImport").eq(0).find("tbody").eq(0).find("tr").each(function () {
                            if ($(this).find("td").eq(1).find("input[type='checkbox']:checked").length > 0 || $(this).find("td").eq(2).find("input[type='checkbox']:checked").length > 0) {
                                if ($(this).find("td").eq(1).find("input[type='checkbox']:checked").length == 0) {
                                    flgvalidate = 1;
                                    AutoHideAlertMsg("Please select the Cluster for " + $(this).find("td").eq(0).find("span").eq(0).html() + " !");
                                }
                                else if ($(this).find("td").eq(2).find("input[type='checkbox']:checked").length == 0) {
                                    flgvalidate = 1;
                                    AutoHideAlertMsg("Please select the Channel for " + $(this).find("td").eq(0).find("span").eq(0).html() + " !");
                                }
                                else {
                                    $(this).find("input[type='checkbox']:checked").each(function () {

                                        if ($(this).attr("iden") == "cluster") {
                                            ArrCluster.push({
                                                "col1": $(this).closest("tr").attr("sbdId"),
                                                "col2": $(this).closest("div").attr("strId")
                                            });
                                        }
                                        else if ($(this).attr("iden") == "channel") {
                                            ArrChannel.push({
                                                "col1": $(this).closest("tr").attr("sbdId"),
                                                "col2": $(this).closest("div").attr("strId"),
                                                "col3": $(this).closest("div").attr("strType")
                                            });
                                        }
                                    });
                                }
                            }
                        });

                        if (flgvalidate == 0) {
                            if (ArrCluster.length == 0) {
                                AutoHideAlertMsg("Please select Cluster-Channel Mapping for Importing !");
                            }
                            else {
                                $("#dvloader").show();
                                PageMethods.fnImportSBD(QtrNo, QtrYear, ArrCluster, ArrChannel, UserID, LoginID, RoleID, FromDATE, EndDate, 0, fnImportSBD_pass, fnfailed);
                            }
                        }
                    }
                    else {
                        AutoHideAlertMsg("No Norm(s) found for Importing !");
                    }
                }
            },
            {
                text: 'Reset Filter',
                click: function () {
                    $("#btnImportProductHierFilter").attr("prodhier", "");
                    $("#btnImportClusterHierFilter").attr("selectedstr", "");
                    $("#btnImportChannelHierFilter").attr("prodhier", "");

                    fnImportPrevQtrSBD();
                    $("#dvSBDListforImportBody").html("<div style='text-align: center; padding-top: 20px;'><img src='../../Images/loading.gif'/></div>");
                },
                class: 'btn-primary'
            },
            {
                text: 'Cancel',
                click: function () {
                    $("#dvSBDListforImport").dialog('close');
                },
                class: 'btn-primary'
            }]
        });
    }
    else {
        AutoHideAlertMsg("No Past Quarter found for Importing !");
    }
}
function fnImportPrevQtrSBD() {
    $("#txtImportfilter").val('');
    $("#dvSBDListforImportBody").html("<div style='text-align: center; padding-top: 20px;'><img src='../../Images/loading.gif'/></div>");

    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var QtrTo = $("#ddlQuarter").val().split("|")[2];
    var YrTo = $("#ddlQuarter").val().split("|")[3];
    var QtrFrom = $("#ddlQuarterPopup").val().split("|")[2];
    var YrFrom = $("#ddlQuarterPopup").val().split("|")[3];

    var ProdValues = [], LocValues = [], ChannelValues = [];
    var PrdString = $("#btnImportProductHierFilter").attr("prodhier");
    var LocString = $("#btnImportClusterHierFilter").attr("selectedstr");
    var ChannelString = $("#btnImportChannelHierFilter").attr("prodhier");

    //ProdValues.push({ "col1": "0", "col2": "0", "col3": "1" });
    //LocValues.push({ "col1": "0", "col2": "0", "col3": "2" });
    //ChannelValues.push({ "col1": "0", "col2": "0", "col3": "3" });

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


    if (QtrFrom == $("#btnImportClusterHierFilter").attr("mth") && YrFrom == $("#btnImportClusterHierFilter").attr("yr")) {
        if (LocString != "") {
            for (var i = 0; i < LocString.split("^").length; i++) {
                LocValues.push({
                    "col1": LocString.split("^")[i],
                    "col2": "0",
                    "col3": "4"
                });
            }
        }
        else {
            LocValues.push({ "col1": "0", "col2": "0", "col3": "2" });
        }
    }
    else {
        LocValues.push({ "col1": "0", "col2": "0", "col3": "2" });
        $("#btnImportClusterHierFilter").attr("selectedstr", "");
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
    ArrUser.push({ "col1": 0 });

    PageMethods.fnGetSBDListforImport(LoginID, RoleID, UserID, ProdValues, LocValues, ChannelValues, ArrUser, QtrTo, YrTo, QtrFrom, YrFrom, fnImportPrevQtrSBD_pass, fnfailed);
}
function fnImportPrevQtrSBD_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#dvSBDListforImportBody").html(res.split("|^|")[1]);
    }
    else {
        $("#dvSBDListforImportBody").html("<div style='text-align: center; padding-top: 10px; font-size: 0.9rem;'>Due to some technical reasons, we are unable to process your request !</div>");
    }
}

function fnImportSBD_pass(res) {
    if (res.split("|^|")[0] == "0") {
        AutoHideAlertMsg("SBD(s) import successfully !");
        $("#dvSBDListforImport").dialog('close');
        fnGetReport(0);
    }
    else if (res.split("|^|")[0] == "3") {
        $("#dvloader").hide();
        fnExistingCombinationAtImportSBD(res);
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

function fnAddNew() {
    if ($("#ConatntMatter_hdnIsNewAdditionAllowed").val() == "0") {
        AutoHideAlertMsg("Creation of New SBD is not Allowed !");
    }
    else {
        var defdate = $("#ddlQuarter").val();  // GetNxtMonthToFromDate();

        var strleft = "";
        strleft += "<tr SBD='0' flgEdit='1'>";
        strleft += "<td></td>";
        strleft += "<td></td>";
        strleft += "<td class='clstdAction'><img src='../../Images/save.png' title='Save' onclick='fnSave(this, 0);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/></td>";
        str += "</tr>";

        var str = "";
        str += "<tr iden='SBD' SBD='0' flgEdit='1' style='display: table-row;'>";
        str += "<td iden='SBD'></td>";
        str += "<td iden='SBD'></td>";
        str += "<td iden='SBD' class='clstdAction'><img src='../../Images/save.png' title='Save' onclick='fnSave(this, 0);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/></td>";
        str += "<td iden='SBD'><textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='3'></textarea></td>";

        str += "<td iden='SBD'><div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'></div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' buckettype='3' onclick='fnShowCopyBucketPopup(this);'/><br/><img src='../../Images/edit.png' title='Define New Selection' iden='ProductHier' buckettype='3' CopyBucketTD='0' prodlvl='210' prodhier='' onclick='fnShowProdHierPopup(this, 1);'/></div></div></td>";           //Channel
        str += "<td iden='SBD'><div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'></div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' iden='ProductHier' buckettype='4' CopyBucketTD='0' onclick='fnShowCopyBucketPopup(this);'/></div></div></td>";           //Location
        str += "<td iden='SBD'><div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'></div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' iden='ProductHier' buckettype='6' BucketScript='' BrandId='' onclick='fnShowBaseSBFBucketPopup(this);'/></div></div></td>";        //SBF

        //str += "<td iden='SBD'><div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'></div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/edit.png' title='Define Base SBF' iden='BaseSBF' SBFHiier='' onclick='fnShowSBFHierPopup(this);'/></div></div></td>"; //Base SBF
        str += "<td iden='SBD'><input type='text' class='clsDate' style='box-sizing: border-box; width:96%;' value='" + defdate.split("|")[0] + "' placeholder='From Date'/><br/><a herf='#' onclick='fnSetToFromDate(this);' class='btn btn-primary btn-small'>Default Month</a><br/><input type='text' class='clsDate' style='box-sizing: border-box; width:96%;' value='" + defdate.split("|")[1] + "' placeholder='To Date'/></td>";
        str += "<td iden='SBD'><select>" + $("#ConatntMatter_hdnFrequency").val() + "</select></td>";
        str += "<td iden='SBD'></td>";
        str += "<td iden='SBD'></td>";
        str += "<td iden='SBD'></td>";
        str += "</tr>";

        $("#tblReport").find("tbody").eq(0).prepend(str);
        $("#tblleftfixed").find("tbody").eq(0).prepend(strleft);

        $("#tblReport").find("tbody").eq(0).find("tr").eq(0).find("td").eq(8).find("select").eq(0).val("P3M");

        fnAdjustColumnWidth();
        fnAdjustRowHeight(0);

        //$("#tblleftfixed").find("tbody").eq(0).find("tr").eq(0).find("textarea").on('input', function () {
        //    this.style.height = 'auto';
        //    this.style.height = (this.scrollHeight) + 'px';
        //    fnAdjustRowHeight($(this).closest("tr").index());
        //});

        $(".clsDate").datepicker({
            dateFormat: 'dd-M-y'
        });

        $("#divButtons").find("a.btn[flgAction='100']").removeClass("btn-disabled").attr("onclick", "fnSaveFinalAction(this);");
    }
}
function fnEdit(ctrl) {
    var lefttr = $(ctrl).closest("tr");
    var rowIndex = $(ctrl).closest("tr").index();
    var rttr = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex);

    var SBDName = rttr.attr("SBDName");
    var fromdate = rttr.attr("fromdate");
    var todate = rttr.attr("todate");
    var Frequency = rttr.attr("Frequency");

    var locArr = rttr.attr("strloc").split("~");
    var channelArr = rttr.attr("strchannel").split("~");
    channellvl = Maxlvl(channelArr[1]);
    var BaseSBFArr = rttr.attr("strSBD").split("~");

    var strbtn = "";
    var flgRejectComment = rttr.attr("flgRejectComment");
    if (flgRejectComment == "1")
        strbtn = "<img src='../../Images/save.png' title='Save' onclick='fnSave(this, 0);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/><img src='../../Images/comments.png' title='Comments' onclick='fnGetRejectComment(this);'/>";
    else
        strbtn = "<img src='../../Images/save.png' title='Save' onclick='fnSave(this, 0);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/>";

    var tr = rttr;
    tr.attr("flgEdit", "1");
    var lefttr = $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex);
    lefttr.attr("flgEdit", "1");

    lefttr.find("td").eq(0).html("");
    lefttr.find("td").eq(1).html("");
    lefttr.find("td").eq(2).html(strbtn);
    tr.find("td[iden='SBD']").eq(0).html("");
    tr.find("td[iden='SBD']").eq(1).html("");
    tr.find("td[iden='SBD']").eq(2).html(strbtn);

    tr.find("td[iden='SBD']").eq(3).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='3'>" + SBDName + "</textarea>");
    //lefttr.find("td").eq(3).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='3'>" + SBDName + "</textarea>");

    tr.find("td[iden='SBD']").eq(4).html("<div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>" + ExtendContentBody(channelArr[0]) + "</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' buckettype='3' onclick='fnShowCopyBucketPopup(this);'/><br/><img src='../../Images/edit.png' title='Define New Selection' iden='ProductHier' buckettype='3' CopyBucketTD='" + channelArr[2] + "' prodlvl='" + channellvl + "' prodhier='" + channelArr[1] + "' onclick='fnShowProdHierPopup(this, 1);'/></div></div>");

    tr.find("td[iden='SBD']").eq(5).html("<div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>" + ExtendContentBody(locArr[0]) + "</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' iden='ProductHier' buckettype='4' CopyBucketTD='" + locArr[1] + "' onclick='fnShowCopyBucketPopup(this);' /></div></div>");

    tr.find("td[iden='SBD']").eq(6).html("<div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>" + ExtendContentBody(BaseSBFArr[0]) + "</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' iden='ProductHier'  buckettype='6' BucketScript='" + BaseSBFArr[1] + "' BrandId='" + BaseSBFArr[3] + "' onclick='fnShowBaseSBFBucketPopup(this);' /></div></div>");

    //tr.find("td[iden='SBD']").eq(6).html("<div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>" + ExtendContentBody(BaseSBFArr[0]) + "</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/edit.png' title='Define Base SBF' iden='BaseSBF' SBFHiier='" + BaseSBFArr[1] + "' onclick='fnShowSBFHierPopup(this);'/></div></div>");

    tr.find("td[iden='SBD']").eq(7).html("<input type='text' class='clsDate' style='box-sizing: border-box; width:96%;' value='" + fromdate + "' placeholder='From Date'/><br/><a herf='#' onclick='fnSetToFromDate(this);' class='btn btn-primary btn-small'>Default Month</a><br/><input type='text' class='clsDate' style='box-sizing: border-box; width:96%;' value='" + todate + "' placeholder='To Date'/>");
    tr.find("td[iden='SBD']").eq(8).html("<select>" + $("#ConatntMatter_hdnFrequency").val() + "</select>");
    tr.find("td[iden='SBD']").eq(8).find("select").eq(0).val(Frequency);

    //lefttr.find("textarea").eq(0).css("height", "auto");
    //lefttr.find("textarea").eq(0).css("height", lefttr.find("textarea")[0].scrollHeight + "px");

    fnAdjustRowHeight(rowIndex);

    //lefttr.find("textarea").on('input', function () {
    //    this.style.height = 'auto';
    //    this.style.height = (this.scrollHeight) + 'px';
    //    fnAdjustRowHeight($(this).closest("tr").index());
    //});

    tr.find(".clsDate").datepicker({
        dateFormat: 'dd-M-y'
    });

    fnAdjustColumnWidth();

    $("#divButtons").find("a.btn[flgAction='100']").removeClass("btn-disabled").attr("onclick", "fnSaveFinalAction(this);");
}
function fnShowChannelClusterforCopy(ctrl) {
    var rowIndex = $(ctrl).closest("tr").index();
    var rttr = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex);

    $("#divChannelClusterforCopy").dialog({
        "modal": true,
        "width": "60%",
        "height": "560",
        "title": "Channel - Cluster for Copy :",
        open: function () {
            var locArr = rttr.attr("strloc").split("~");
            var channelArr = rttr.attr("strchannel").split("~");

            var str = "<table class='table table-striped table-bordered table-sm'>";
            for (var i = 0; i < locArr[1].split("|").length; i++) {
                str += "<tr strId='" + locArr[1].split("|")[i] + "'><td><input type='checkbox' checked/></td><td>" + locArr[0].split(",")[i].trim() + "</td></tr>";
            }
            str += "</table>";
            $("#divClusterTblforCopy").html(str);

            str = "<table class='table table-striped table-bordered table-sm'>";
            for (var i = 0; i < channelArr[1].split("^").length; i++) {
                str += "<tr strId='" + channelArr[1].split("^")[i] + "'><td><input type='checkbox' checked/></td><td>" + channelArr[0].split(",")[i].trim() + "</td></tr>";
            }
            str += "</table>";
            $("#divChannelTblforCopy").html(str);
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                var strId = "", descr = "";
                var strCluster = "", strChannel = "";

                $("#divClusterTblforCopy").find("input[type='checkbox']:checked").each(function () {
                    strId += "|" + $(this).closest("tr").attr("strId");
                    descr += ", " + $(this).closest("tr").find("td").eq(1).html();
                });
                if (strId != "") {
                    strCluster = descr.substring(2) + "~" + strId.substring(1) + "~0";
                }
                else {
                    strCluster = "~0~0";
                }

                strId = "", descr = "";
                $("#divChannelTblforCopy").find("input[type='checkbox']:checked").each(function () {
                    strId += "^" + $(this).closest("tr").attr("strId");
                    descr += ", " + $(this).closest("tr").find("td").eq(1).html();
                });
                if (strId != "") {
                    strChannel = descr.substring(2) + "~" + strId.substring(1) + "~0";
                }
                else {
                    strChannel = "~~0";
                }

                fnCopy(ctrl, strCluster, strChannel);

                var rowIndex = $(ctrl).closest("tr[iden='SBD']").index();
                fnAdjustRowHeight(rowIndex);
                $("#divChannelClusterforCopy").dialog('close');
            }
        },
        {
            text: 'Reset',
            class: 'btn-primary',
            click: function () {
                $("#divChannelClusterforCopy").find("input[type='checkbox']").removeAttr("checked");
            }
        },
        {
            text: 'Cancel',
            class: 'btn-primary',
            click: function () {
                $("#divChannelClusterforCopy").dialog('close');
            }
        }]
    });
}
function fnCopy(ctrl, strCluster, strChannel) {
    var lefttr = $(ctrl).closest("tr");
    var rowIndex = $(ctrl).closest("tr").index();
    var rttr = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex);

    var defdate = $("#ddlQuarter").val();  //GetNxtMonthToFromDate();
    var fromdate = defdate.split("|")[0];
    var todate = defdate.split("|")[1];
    var SBDName = rttr.attr("SBDName");
    var Frequency = rttr.attr("Frequency");

    var locArr = strCluster.split("~"); //rttr.attr("strloc").split("~");
    var channelArr = strChannel.split("~"); //rttr.attr("strchannel").split("~");
    channellvl = Maxlvl(channelArr[1]);
    var BaseSBFArr = rttr.attr("strSBD").split("~");

    var strbtn = "";
    var flgRejectComment = rttr.attr("flgRejectComment");
    if (flgRejectComment == "1")
        strbtn = "<img src='../../Images/save.png' title='Save' onclick='fnSave(this, 0);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/><img src='../../Images/comments.png' title='Comments' onclick='fnGetRejectComment(this);'/>";
    else
        strbtn = "<img src='../../Images/save.png' title='Save' onclick='fnSave(this, 0);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/>";

    var tr = "", str = "";
    str = "<tr iden='SBD' SBD='0' flgEdit='1' style='display: table-row;'>";
    str += rttr.html();
    str += "</tr>";
    rttr.before(str);

    str = "<tr iden='SBD' SBD='0' flgEdit='1'>";
    str += lefttr.html();
    str += "</tr>";
    lefttr.before(str);

    tr = rttr.prev();
    shortDescr = "";
    lefttr = $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex);

    lefttr.find("td").eq(0).html("");
    lefttr.find("td").eq(1).html("");
    lefttr.find("td").eq(2).html(strbtn);
    tr.find("td[iden='SBD']").eq(0).html("");
    tr.find("td[iden='SBD']").eq(1).html("");
    tr.find("td[iden='SBD']").eq(2).html(strbtn);

    tr.find("td[iden='SBD']").eq(3).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='3'>" + SBDName + "</textarea>");
    //lefttr.find("td").eq(3).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='3'>" + SBDName + "</textarea>");

    tr.find("td[iden='SBD']").eq(4).html("<div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>" + ExtendContentBody(channelArr[0]) + "</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' buckettype='3' onclick='fnShowCopyBucketPopup(this);'/><br/><img src='../../Images/edit.png' title='Define New Selection' iden='ProductHier' buckettype='3' CopyBucketTD='" + channelArr[2] + "' prodlvl='" + channellvl + "' prodhier='" + channelArr[1] + "' onclick='fnShowProdHierPopup(this, 1);'/></div></div>");

    tr.find("td[iden='SBD']").eq(5).html("<div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>" + ExtendContentBody(locArr[0]) + "</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' iden='ProductHier' buckettype='4' CopyBucketTD='" + locArr[1] + "' onclick='fnShowCopyBucketPopup(this);' /></div></div>");

    tr.find("td[iden='SBD']").eq(6).html("<div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>" + ExtendContentBody(BaseSBFArr[0]) + "</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' iden='ProductHier' buckettype='6' BucketScript='" + BaseSBFArr[1] + "' BrandId='" + BaseSBFArr[3] + "' onclick='fnShowBaseSBFBucketPopup(this);' /></div></div>");

    //tr.find("td[iden='SBD']").eq(6).html("<div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>" + ExtendContentBody(BaseSBFArr[0]) + "</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/edit.png' title='Define Base SBF' iden='BaseSBF' SBFHiier='" + BaseSBFArr[1] + "' onclick='fnShowSBFHierPopup(this);'/></div></div>");

    tr.find("td[iden='SBD']").eq(7).html("<input type='text' class='clsDate' style='box-sizing: border-box; width:96%;' value='" + fromdate + "' placeholder='From Date'/><br/><a herf='#' onclick='fnSetToFromDate(this);' class='btn btn-primary btn-small'>Default Month</a><br/><input type='text' class='clsDate' style='box-sizing: border-box; width:96%;' value='" + todate + "' placeholder='To Date'/>");
    tr.find("td[iden='SBD']").eq(8).html("<select>" + $("#ConatntMatter_hdnFrequency").val() + "</select>");
    tr.find("td[iden='SBD']").eq(8).find("select").eq(0).val(Frequency);

    tr.find("td[iden='SBD']").eq(9).html("");
    tr.find("td[iden='SBD']").eq(10).html("");
    tr.find("td[iden='SBD']").eq(11).html("");

    //lefttr.find("textarea").eq(0).css("height", "auto");
    //lefttr.find("textarea").eq(0).css("height", lefttr.find("textarea")[0].scrollHeight + "px");

    fnAdjustRowHeight(rowIndex);

    //lefttr.find("textarea").on('input', function () {
    //    this.style.height = 'auto';
    //    this.style.height = (this.scrollHeight) + 'px';
    //    fnAdjustRowHeight($(this).closest("tr").index());
    //});

    tr.find(".clsDate").datepicker({
        dateFormat: 'dd-M-y'
    });

    fnAdjustColumnWidth();

    $("#divButtons").find("a.btn[flgAction='100']").removeClass("btn-disabled").attr("onclick", "fnSaveFinalAction(this);");
}
function fnCancel(ctrl) {
    var rowIndex = $(ctrl).closest("tr").index();
    var SBD = $(ctrl).closest("tr").attr("SBD");
    if (SBD == "0") {
        $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).remove();
        $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex).remove();
    }
    else {
        var lefttr = $(ctrl).closest("tr");
        var tr = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex);

        var SBDName = tr.attr("SBDName");
        var fromdate = tr.attr("fromdate");
        var todate = tr.attr("todate");
        var Frequency = tr.attr("Frequency");

        var locArr = tr.attr("strloc").split("~");
        var loclvl = Maxlvl(locArr[1]);
        var loc = locArr[0];
        var channelArr = tr.attr("strchannel").split("~");
        channellvl = Maxlvl(channelArr[1]);
        var channel = channelArr[0];
        var BaseSBFArr = tr.attr("strSBD").split("~");
        var baseSBF = BaseSBFArr[0];

        var flgRejectComment = tr.attr("flgRejectComment");
        var flgBookmark = tr.attr("flgBookmark");
        var flgCheckBox = tr.attr("flgCheckBox");

        var strbtns = "";
        if ($("#ConatntMatter_hdnIsNewAdditionAllowed").val() == "1") {
            strbtns += "<img src='../../Images/copy.png' title='Copy Norm' onclick='fnShowChannelClusterforCopy(this);'/>";
        }
        strbtns += "<img src='../../Images/edit.png' title='Edit Norm' onclick='fnEdit(this);'/>";
        strbtns += "<img src='../../Images/delete.png' title='Delete Norm' onclick='fnDelete(this);'/>";
        if (flgRejectComment == "1") {
            strbtns += "<img src='../../Images/comments.png' title='Comments' onclick='fnGetRejectComment(this);'/>";
        }

        if ($("#btnInitExpandedCollapseMode").attr("flgCollapse") == "1") {
            SBDName = SBDName.length > 20 ? "<span title='" + SBDName + "' class='clsInform'>" + SBDName.substring(0, 18) + "..</span>" : SBDName;
            loc = "<div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (loc.length > 70 ? "<span title='" + loc + "' class='clsInform'>" + loc.substring(0, 68) + "..</span>" : loc) + "</div>";
            channel = "<div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (channel.length > 70 ? "<span title='" + channel + "' class='clsInform'>" + channel.substring(0, 68) + "..</span>" : channel) + "</div>";
            baseSBF = "<div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (baseSBF.length > 70 ? "<span title='" + baseSBF + "' class='clsInform'>" + baseSBF.substring(0, 68) + "..</span>" : baseSBF) + "</div>";
        }
        else {
            loc = "<div style='width: 202px; min-width: 202px; font-size: 0.6rem;'>" + loc + "</div>";
            channel = "<div style='width: 202px; min-width: 202px; font-size: 0.6rem;'>" + channel + "</div>";
            baseSBF = "<div style='width: 202px; min-width: 202px; font-size: 0.6rem;'>" + baseSBF + "</div>";
        }

        //-----------------------------------------------------------------------------------------------------------


        if (flgCheckBox == "1")
            lefttr.find("td").eq(0).html("<input iden='chkInit' type='checkbox' onclick='fnUnchkInitIndividual(this);'/>");
        else
            lefttr.find("td").eq(0).html("");

        if (flgBookmark == "1")
            lefttr.find("td").eq(1).html("<img src='../../Images/bookmark.png' title='Active Bookmark' flgBookmark='1' onclick='fnManageBookMark(this);'/>");
        else
            lefttr.find("td").eq(1).html("<img src='../../Images/bookmark-inactive.png' title='InActive Bookmark' flgBookmark='0' onclick='fnManageBookMark(this);'/>");
        lefttr.find("td").eq(2).html(strbtns);
        //lefttr.find("td").eq(3).html(SBDName);

        if (flgCheckBox == "1")
            tr.find("td[iden='SBD']").eq(0).html("<input iden='chkInit' type='checkbox' onclick='fnUnchkInitIndividual(this);'/>");
        else
            tr.find("td[iden='SBD']").eq(0).html("");

        if (flgBookmark == "1")
            tr.find("td[iden='SBD']").eq(1).html("<img src='../../Images/bookmark.png' title='Active Bookmark' flgBookmark='1' onclick='fnManageBookMark(this);'/>");
        else
            tr.find("td[iden='SBD']").eq(1).html("<img src='../../Images/bookmark-inactive.png' title='InActive Bookmark' flgBookmark='0' onclick='fnManageBookMark(this);'/>");
        tr.find("td[iden='SBD']").eq(2).html(strbtns);
        tr.find("td[iden='SBD']").eq(3).html(SBDName);

        if ($("#tblReport").attr("IsChannelExpand") == "0")
            tr.find("td[iden='SBD']").eq(4).html("");
        else
            tr.find("td[iden='SBD']").eq(4).html(channel);

        if ($("#tblReport").attr("IsLocExpand") == "0")
            tr.find("td[iden='SBD']").eq(5).html("");
        else
            tr.find("td[iden='SBD']").eq(5).html(loc);

        if ($("#tblReport").attr("IsSBDExpand") == "0")
            tr.find("td[iden='SBD']").eq(6).html("");
        else
            tr.find("td[iden='SBD']").eq(6).html(baseSBF);

        tr.find("td[iden='SBD']").eq(7).html(fromdate + "<br/>to " + todate);
        tr.find("td[iden='SBD']").eq(8).html(Frequency);

        tr.attr("flgEdit", "0");
        lefttr.attr("flgEdit", "0");
        fnAdjustRowHeight(rowIndex);
    }
    Tooltip(".clsInform");
    fnAdjustColumnWidth();

    if ($("#tblleftfixed").find("tbody").eq(0).find("tr[flgEdit='1']").length == 0) {
        $("#divButtons").find("a.btn[flgAction='100']").addClass("btn-disabled").removeAttr("onclick", "fnSaveFinalAction(this);");
    }
}


function fnSaveAllOpen(cntr) {
    SaveCntr = $("#tblleftfixed").find("tbody").eq(0).find("tr[flgEdit='1']").length;
    if (SaveCntr != 0) {
        var ctrl = $("#tblleftfixed").find("tbody").eq(0).find("tr[flgEdit='1']").eq(cntr - 1).find("td.clstdAction").eq(0).find("img[title='Save']").eq(0);
        fnSaveSBD(ctrl, 0, cntr);
    }
    else {
        AutoHideAlertMsg("No SBD details found for updation !");
    }
}
function fnSave(ctrl, flgDuplicate) {
    SaveCntr = 1;
    fnSaveSBD(ctrl, flgDuplicate, 0);
}

function fnSaveSBD(ctrl, flgDuplicate, cntr) {
    var lefttr = $(ctrl).closest("tr");
    var rowIndex = $(ctrl).closest("tr").index();
    var rttr = $("#tblReport").find("tbody").eq(0).find("tr[iden='SBD']").eq(rowIndex);

    var SBDID = lefttr.attr("SBD");
    var SBDName = "";                                           //lefttr.find("td").eq(3).find("textarea").eq(0).val();
    var strChannel = rttr.find("td[iden='SBD']").eq(4).find("img[iden='ProductHier']").eq(0).attr("ProdHier");
    var strLocation = rttr.find("td[iden='SBD']").eq(5).find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
    var strBrand = rttr.find("td[iden='SBD']").eq(6).find("img[iden='ProductHier']").eq(0).attr("BrandId");
    var FromDate = rttr.find("td[iden='SBD']").eq(7).find("input[type='text']").eq(0).val();
    var EndDate = rttr.find("td[iden='SBD']").eq(7).find("input[type='text']").eq(1).val();
    var Frequency = rttr.find("td[iden='SBD']").eq(8).find("select").eq(0).val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var QtrNo = $("#ddlQuarter").val().split("|")[2];
    var QtrYear = $("#ddlQuarter").val().split("|")[3];
    var Products = [];
    var Buckets = [];
    var BucketValues = [];

    var copyChannelBucketID = rttr.find("td[iden='SBD']").eq(4).find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
    var copyLocationBucketID = rttr.find("td[iden='SBD']").eq(5).find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
    var BaseSBFBucket = rttr.find("td[iden='SBD']").eq(6).find("img[iden='ProductHier']").eq(0).attr("BucketScript");

    if (strChannel == "") {
        AutoHideAlertMsg("Please select the Channel(s) !");
        return false;
    }
    else if (copyLocationBucketID == "0") {
        AutoHideAlertMsg("Please select the Cluster(s) !");
        return false;
    }
    else if (BaseSBFBucket == "") {
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
                "col2": "4"
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

        if (BaseSBFBucket.split("^").length == "1" && BaseSBFBucket.split("^")[0].split("!")[0] == "0|All Cluster") {
            for (var i = 0; i < copyLocationBucketID.split("|").length; i++) {
                var BaseSBFBucket_clusterId = copyLocationBucketID.split("|")[i];

                for (var j = 0; j < BaseSBFBucket.split("^")[0].split("!")[1].split("#").length; j++) {
                    var BaseSBFBucket_baseNodeId = BaseSBFBucket.split("^")[0].split("!")[1].split("#")[j].split("$")[0].split("|")[2];
                    var BaseSBFBucket_baseNodeType = BaseSBFBucket.split("^")[0].split("!")[1].split("#")[j].split("$")[0].split("|")[3];
                    var BaseSBFBucket_MOQ = BaseSBFBucket.split("^")[0].split("!")[1].split("#")[j].split("$")[0].split("|")[1];
                    var BaseSBFBucket_bucketId = BaseSBFBucket.split("^")[0].split("!")[1].split("#")[j].split("$")[0].split("|")[0];

                    for (var k = 0; k < BaseSBFBucket.split("^")[0].split("!")[1].split("#")[j].split("$")[1].split("*").length; k++) {
                        var BaseSBFBucket_proxyNodeId = BaseSBFBucket.split("^")[0].split("!")[1].split("#")[j].split("$")[1].split("*")[k].split("|")[0];
                        var BaseSBFBucket_proxyNodeType = BaseSBFBucket.split("^")[0].split("!")[1].split("#")[j].split("$")[1].split("*")[k].split("|")[1];

                        Products.push({
                            "col1": BaseSBFBucket_clusterId,
                            "col2": BaseSBFBucket_baseNodeId,
                            "col3": BaseSBFBucket_baseNodeType,
                            "col4": BaseSBFBucket_MOQ,
                            "col5": BaseSBFBucket_proxyNodeId,
                            "col6": BaseSBFBucket_proxyNodeType,
                            "col7": BaseSBFBucket_bucketId
                        });
                    }
                }

                //Buckets.push({
                //    "col1": BaseSBFBucket.split("|")[i].split("^")[0],
                //    "col2": "6"
                //});
            }
        }
        else {
            for (var i = 0; i < BaseSBFBucket.split("^").length; i++) {
                var BaseSBFBucket_clusterId = BaseSBFBucket.split("^")[i].split("!")[0].split("|")[0];

                for (var j = 0; j < BaseSBFBucket.split("^")[i].split("!")[1].split("#").length; j++) {
                    var BaseSBFBucket_baseNodeId = BaseSBFBucket.split("^")[i].split("!")[1].split("#")[j].split("$")[0].split("|")[2];
                    var BaseSBFBucket_baseNodeType = BaseSBFBucket.split("^")[i].split("!")[1].split("#")[j].split("$")[0].split("|")[3];
                    var BaseSBFBucket_MOQ = BaseSBFBucket.split("^")[i].split("!")[1].split("#")[j].split("$")[0].split("|")[1];
                    var BaseSBFBucket_bucketId = BaseSBFBucket.split("^")[i].split("!")[1].split("#")[j].split("$")[0].split("|")[0];

                    for (var k = 0; k < BaseSBFBucket.split("^")[i].split("!")[1].split("#")[j].split("$")[1].split("*").length; k++) {
                        var BaseSBFBucket_proxyNodeId = BaseSBFBucket.split("^")[i].split("!")[1].split("#")[j].split("$")[1].split("*")[k].split("|")[0];
                        var BaseSBFBucket_proxyNodeType = BaseSBFBucket.split("^")[i].split("!")[1].split("#")[j].split("$")[1].split("*")[k].split("|")[1];

                        Products.push({
                            "col1": BaseSBFBucket_clusterId,
                            "col2": BaseSBFBucket_baseNodeId,
                            "col3": BaseSBFBucket_baseNodeType,
                            "col4": BaseSBFBucket_MOQ,
                            "col5": BaseSBFBucket_proxyNodeId,
                            "col6": BaseSBFBucket_proxyNodeType,
                            "col7": BaseSBFBucket_bucketId
                        });
                    }
                }

                //Buckets.push({
                //    "col1": BaseSBFBucket.split("|")[i].split("^")[0],
                //    "col2": "6"
                //});
            }
        }


        var flgValidateBaseBucketforAllChannels = 1;
        for (var i = 0; i < copyLocationBucketID.split("|").length; i++) {
            flgValidateBaseBucketforAllChannels = 0;
            for (var j = 0; j < Products.length; j++) {
                if (copyLocationBucketID.split("|")[i] == Products[j].col1)
                    flgValidateBaseBucketforAllChannels = 1;
            }
            if (flgValidateBaseBucketforAllChannels == 0)
                break;
        }

        if (flgValidateBaseBucketforAllChannels == 1) {
            $("#dvloader").show();
            PageMethods.fnSave(SBDID, SBDName, FromDate, EndDate, strChannel, strLocation, UserID, LoginID, RoleID, QtrNo, QtrYear, Buckets, BucketValues, Products, flgDuplicate, Frequency, strBrand, cntr, fnSave_pass, fnfailed, ctrl);
        }
        else {
            AutoHideAlertMsg("Base Bucket is not selected against all the defined Cluster(s) !");
        }
    }
}
function fnSave_pass(res, ctrl) {
    if (res.split("|^|")[0] == "0") {
        if (SaveCntr == (parseInt(res.split("|^|")[1]) + 1)) {
            AutoHideAlertMsg("SBD details saved/updated successfully !");
            fnGetReport(0);
        }
        else {
            fnSaveAllOpen(parseInt(res.split("|^|")[1]) + 1);
        }
    }
    else if (res.split("|^|")[0] == "1") {
        AutoHideAlertMsg("SBD already exist !");
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
    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: justify;'>" + res.split("|^|")[2] + "</div>");
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
                fnSaveSBD(ctrl, 1, parseInt(res.split("|^|")[1]));
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


function fnDeleteSelected() {
    var SBDIds = "";
    $("#tblleftfixed").find("tbody").eq(0).find("tr").each(function () {
        if ($(this).find("input[type='checkbox'][iden='chkInit']").length > 0) {
            if ($(this).find("input[type='checkbox'][iden='chkInit']").is(":checked")) {
                SBDIds += "^" + $(this).closest("tr").attr("sbd");
            }
        }
    });

    if (SBDIds == "") {
        AutoHideAlertMsg("Please select atleast one SBD for Action !");
    }
    else {
        SBDIds = SBDIds.substring(1);

        $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to Delete <span style='color:#0000ff; font-weight: 700;'>" + SBDIds.split("^").length + "</span> SBD(s).<br/>Do you want to continue ?</div>");

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

                    var RoleID = $("#ConatntMatter_hdnRoleID").val();
                    var LoginID = $("#ConatntMatter_hdnLoginID").val();
                    var UserID = $("#ConatntMatter_hdnUserID").val();

                    $("#dvloader").show();
                    PageMethods.fnDelete(RoleID, LoginID, UserID, SBDIds, fnDelete_pass, fnfailed);
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
function fnDelete(ctrl) {
    var SBDID = $(ctrl).closest("tr").attr("SBD");
    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure, you want to delete this SBD ?</div>");

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

                var RoleID = $("#ConatntMatter_hdnRoleID").val();
                var LoginID = $("#ConatntMatter_hdnLoginID").val();
                var UserID = $("#ConatntMatter_hdnUserID").val();

                $("#dvloader").show();
                PageMethods.fnDelete(RoleID, LoginID, UserID, SBDID, fnDelete_pass, fnfailed);
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
        AutoHideAlertMsg("SBD(s) deleted successfully !");
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

function GetNxtMonthToFromDate() {
    var d = new Date();
    var NxtMnth = new Date(d.getFullYear(), d.getMonth() + 2, 0);
    return "01-" + MonthArr[NxtMnth.getMonth()] + "-" + NxtMnth.getFullYear() + "|" + NxtMnth.getDate() + "-" + MonthArr[NxtMnth.getMonth()] + "-" + NxtMnth.getFullYear();
}
function fnSetToFromDate(ctrl) {
    $(ctrl).closest("td[iden='SBD']").find("input").eq(0).val($("#ddlQuarter").val().split("|")[0]);
    $(ctrl).closest("td[iden='SBD']").find("input").eq(1).val($("#ddlQuarter").val().split("|")[1]);
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
        strtable += "<th style='width:23%;'>Category</th>";
        strtable += "<th style='width:20%;'>Brand</th>";
        strtable += "<th style='width:22%;'>BrandForm</th>";
        strtable += "<th style='width:35%;'>SubBrandForm</th>";
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
                strtable += "<th style='width:23%;'>Category</th>";
                strtable += "<th style='width:20%;'>Brand</th>";
                strtable += "<th style='width:22%;'>BrandForm</th>";
                strtable += "<th style='width:35%;'>SubBrandForm</th>";
                strtable += "</tr>";
                strtable += "</thead>";
                strtable += "<tbody>";
                strtable += "</tbody>";
                strtable += "</table>";
                $("#divCopyBucketSelectionTbl").html(strtable);

                $("#PopupCopyBucketlbl").html("Product Hierarchy");
                $("#PopupCopyClusterddl").hide();
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
                $("#PopupCopyClusterddl").hide();
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
                $("#PopupCopyClusterddl").hide();
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
                $("#PopupCopyClusterddl").hide();
            }

            var LoginID = $("#ConatntMatter_hdnLoginID").val();
            var RoleID = $("#ConatntMatter_hdnRoleID").val();
            var UserID = $("#ConatntMatter_hdnUserID").val();
            var Qtr = $("#ddlQuarter").val().split("|")[2];
            var Yr = $("#ddlQuarter").val().split("|")[3];

            var CopyBucketTD = $(ctrl).closest("td[iden='SBD']").find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
            PageMethods.GetBucketbasedonType(LoginID, RoleID, UserID, $("#ConatntMatter_hdnBucketType").val(), Qtr, Yr, $(ctrl).closest("tr").attr("sbd"), GetBucketbasedonType_pass, GetBucketbasedonType_failed, CopyBucketTD);
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                if ($("#ConatntMatter_hdnBucketType").val() != "4") {
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

                    fnResetBaseSBFSelectionBasedOnCluster(CopyBucketTD, $(ctrl).parent("div").closest("td").next().find("img[iden='ProductHier']").eq(0));
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

function fnResetBaseSBFSelectionBasedOnCluster(ClusterIds, btnBaseSBF) {

    var strIDs = "", strBaseSBF = "";
    var prevSelection = btnBaseSBF.attr("BucketScript");
    for (var i = 0; i < ClusterIds.split("|").length; i++) {
        for (var j = 0; j < prevSelection.split("^").length; j++) {
            if (ClusterIds.split("|")[i] == prevSelection.split("^")[j].split("!")[0].split("|")[0]) {
                if (strIDs != "") {
                    strIDs += "^";
                    strBaseSBF += " ";
                }
                strIDs += prevSelection.split("^")[j];
                strBaseSBF += prevSelection.split("^")[j].split("!")[0].split("|")[1] + "-";
                for (var k = 0; k < prevSelection.split("^")[j].split("!")[1].split("#").length; k++) {
                    if (k > 0)
                        strBaseSBF += ",";

                    strBaseSBF += prevSelection.split("^")[j].split("!")[1].split("#")[k].split("|")[4].split("$")[0];
                }
            }
        }
    }

    btnBaseSBF.attr("BucketScript", strIDs);
    btnBaseSBF.closest("div").prev().html(strBaseSBF);
}

function fnSelectUnSelectBucket(ctrl) {
    if ($(ctrl).closest("tr").attr("flg") == "1") {
        $(ctrl).closest("tr").attr("flg", "0");
        $(ctrl).closest("tr").removeClass("Active");
        $(ctrl).closest("tr").find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

        if ($("#ConatntMatter_hdnBucketType").val() == "6") {
            $(ctrl).closest("tr").find("input[type='text']").eq(0).val($(ctrl).closest("tr").attr("MOQ"));
            $(ctrl).closest("tr").find("input[type='text']").eq(0).prop("disabled", true);
        }
    }
    else {
        $(ctrl).closest("tr").attr("flg", "1");
        $(ctrl).closest("tr").addClass("Active");
        $(ctrl).closest("tr").find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");

        if ($("#ConatntMatter_hdnBucketType").val() == "6") {
            $(ctrl).closest("tr").find("input[type='text']").eq(0).removeAttr("disabled");
        }
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
                    "col3": $("#ConatntMatter_hdnBucketType").val() == "4" ? "2" : $("#ConatntMatter_hdnBucketType").val()
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

    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").each(function () {
        $(this).eq(0).attr("flg", "0");
        $(this).eq(0).removeClass("Active");
        $(this).eq(0).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
    });

    $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
}

function fnShowBaseSBFBucketPopup(ctrl) {
    if ($(ctrl).closest("td").prev().find("img[iden='ProductHier']").eq(0).attr("copybuckettd") != "0") {
        if ($(ctrl).attr("BucketId") == "0") {
            var LoginID = $("#ConatntMatter_hdnLoginID").val();
            var RoleID = $("#ConatntMatter_hdnRoleID").val();
            var UserID = $("#ConatntMatter_hdnUserID").val();

            if (RoleID == "4") {
                $("#dvloader").show();
                PageMethods.fnGetBrandlst(LoginID, RoleID, UserID, fnGetBrandlst_pass, fnfailed, ctrl);
            }
            else {
                fnBaseProxySBFBucketPopup(ctrl, $(ctrl).attr("BrandId"));
            }
        }
        else {
            fnBaseProxySBFBucketPopup(ctrl, $(ctrl).attr("BrandId"));
        }
    }
    else {
        $("#divConfirm").html("<div style='color: #ff0000; font-weight: 600; font-size: 1rem;'>Please select the Cluster(s) !</div>");
        $("#divConfirm").dialog({
            "modal": true,
            "width": "320",
            "height": "200",
            "title": "Message :",
            close: function () {
                $("#divConfirm").dialog('destroy');
            },
            buttons: [{
                text: 'close',
                class: 'btn-primary',
                click: function () {
                    $("#divConfirm").dialog('close');
                }
            }]
        });
    }
}
function fnGetBrandlst_pass(res, ctrl) {
    $("#dvloader").hide();
    if (res.split("|^|")[0] == "0") {
        if (res.split("|^|")[1] != "") {
            $("#divConfirm").html(res.split("|^|")[1]);

            $("#divConfirm").dialog({
                "modal": true,
                "width": "50%",
                "title": "Select Brand :",
                close: function () {
                    $("#divConfirm").dialog('destroy');
                },
                buttons: [{
                    text: 'Submit',
                    class: 'btn-primary',
                    click: function () {
                        if ($("#divConfirm").find("input[type='radio']:checked").length > 0) {
                            fnBaseProxySBFBucketPopup(ctrl, $("#divConfirm").find("input[type='radio']:checked").eq(0).closest("tr").attr("brand"));
                            $(ctrl).attr("BrandId", $("#divConfirm").find("input[type='radio']:checked").eq(0).closest("tr").attr("brand"));
                            $("#divConfirm").dialog('close');
                        }
                        else {
                            AutoHideAlertMsg("Please select the MS&P - Brand Mapping !");
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
            AutoHideAlertMsg("No MS&P - Brand Mapping Found !");
        }
    }
    else {
        fnfailed();
    }
}
function fnBaseProxySBFBucketPopup(ctrl, strBrand) {
    $("#divCopyBucketPopupTbl").html("<div style='margin-top: 25%; text-align: center;'><img alt='Loading...' title='Loading...' src='../../Images/loading.gif' /></div>");

    $("#ConatntMatter_hdnBucketType").val($(ctrl).attr("buckettype"));
    var selectedCluster = $(ctrl).closest("td").prev().find("div[iden='content']").eq(0).html();
    var selectedClusterIds = $(ctrl).closest("td").prev().find("img[iden='ProductHier']").eq(0).attr("copybuckettd");

    var title = "Base Proxy SBF Combi-bucket(s) :";
    $("#divCopyBucketPopup").dialog({
        "modal": true,
        "width": "92%",
        "height": "560",
        "title": title,
        open: function () {
            $("#PopupCopyClusterddl").show();

            var strtable = "";
            strtable += "<table class='table table-bordered table-sm table-hover'>";
            strtable += "<thead>";
            strtable += "<tr>";
            strtable += "<th style='width:23%;'>Category</th>";
            strtable += "<th style='width:20%;'>Brand</th>";
            strtable += "<th style='width:22%;'>BrandForm</th>";
            strtable += "<th style='width:35%;'>SubBrandForm</th>";
            strtable += "</tr>";
            strtable += "</thead>";
            strtable += "<tbody>";
            strtable += "</tbody>";
            strtable += "</table>";
            $("#divCopyBucketSelectionTbl").html(strtable);
            $("#PopupCopyBucketlbl").html("Base SBF");

            var selectedClusterOptions = "";
            if (selectedClusterIds.split("|").length > 1)
                selectedClusterOptions += "<option value='0'>All Cluster</option>";
            for (var i = 0; i < selectedClusterIds.split("|").length; i++) {
                selectedClusterOptions += "<option value='" + selectedClusterIds.split("|")[i] + "'>" + selectedCluster.split(",")[i].trim() + "</option>";
            }
            $("#ddlSelectedCluster").html(selectedClusterOptions);

            if ($(ctrl).attr("BucketScript") == "") {
                $("#PopupCopyClusterddl").attr("selectedIds", "");
                $("#PopupCopyClusterddl").attr("currentnode", "0");
                $("#PopupCopyClusterddl").attr("IsSameforAllCluster", "0");
                $("#PopupCopyClusterddl").attr("IsClusterDetailsUnchanged", "1");
            }
            else {
                var selectedchannelid = $(ctrl).attr("BucketScript").split("^")[0].split("!")[0].split("|")[0];

                $("#ddlSelectedCluster").val(selectedchannelid);
                $("#PopupCopyClusterddl").attr("currentnode", selectedchannelid);
                $("#PopupCopyClusterddl").attr("selectedIds", $(ctrl).attr("BucketScript"));

                if (selectedchannelid == "0")
                    $("#PopupCopyClusterddl").attr("IsSameforAllCluster", "1");
                $("#PopupCopyClusterddl").attr("IsClusterDetailsUnchanged", "1");
            }

            var LoginID = $("#ConatntMatter_hdnLoginID").val();
            var RoleID = $("#ConatntMatter_hdnRoleID").val();
            var UserID = $("#ConatntMatter_hdnUserID").val();
            var Qtr = $("#ddlQuarter").val().split("|")[2];
            var Yr = $("#ddlQuarter").val().split("|")[3];

            PageMethods.GetBaseSBFBucket(LoginID, RoleID, UserID, $("#ConatntMatter_hdnBucketType").val(), Qtr, Yr, strBrand, $(ctrl).closest("tr").attr("sbd"), GetBaseSBFBucket_pass, GetBaseSBFBucket_failed);
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                $("#PopupCopyClusterddl").attr("selectedIds", GenerateBaseProxySBFScriptforAllChannel($("#ddlSelectedCluster").val()));
                $("#PopupCopyClusterddl").attr("currentnode", $("#ddlSelectedCluster").val());

                var descr = "";
                var BucketScript = $("#PopupCopyClusterddl").attr("selectedIds");
                for (var i = 0; i < BucketScript.split("^").length; i++) {
                    if (i != 0)
                        descr += "  ";
                    descr += BucketScript.split("^")[i].split("!")[0].split("|")[1] + "-";  //Channel Name

                    for (var j = 0; j < BucketScript.split("^")[i].split("!")[1].split("#").length; j++) {
                        if (j != 0)
                            descr += ",";
                        descr += BucketScript.split("^")[i].split("!")[1].split("#")[j].split("|")[4].split("$")[0];   //Base SBF Name
                    }
                }

                $(ctrl).closest("div").prev().html(descr);
                $(ctrl).attr("BucketScript", BucketScript);

                var rowIndex = $(ctrl).closest("tr[iden='SBD']").index();
                fnAdjustRowHeight(rowIndex);
                $("#divCopyBucketPopup").dialog('close');
            }
        },
        {
            text: 'Reset',
            class: 'btn-primary',
            click: function () {
                fnResetBaseProxyPopup();
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
function GetBaseSBFBucket_pass(res) {
    $("#divCopyBucketPopupTbl").html(res)

    if ($("#PopupCopyClusterddl").attr("selectedIds") != "") {
        SetBaseProxybasedOnSelectedCluster();
    }
}
function GetBaseSBFBucket_failed() {
    $("#divCopyBucketPopupTbl").html("Due to some technical reasons, we are unable to Process your request !");
}

function fnResetBaseProxyPopup() {
    $("#PopupCopyClusterddl").attr("selectedIds", "");
    $("#PopupCopyClusterddl").attr("currentnode", "0");
    $("#PopupCopyClusterddl").attr("IsSameforAllCluster", "0");
    $("#PopupCopyClusterddl").attr("IsClusterDetailsUnchanged", "1");

    $("#divCopyBucketPopupTbl").find("table").eq(0).find("thead").eq(0).find("input[type='text']").val("");
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");

    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").each(function () {
        $(this).attr("flg", "0");
        $(this).removeClass("Active");
        $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

        $(this).find("input[type='text']").eq(0).prop("disabled", true);
        $(this).find("input[type='text']").eq(0).val($(this).attr("MOQ"));
    });

    $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
}
function fnResetBaseProxyPopupforSpecificCluster() {
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("thead").eq(0).find("input[type='text']").val("");
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");

    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").each(function () {
        $(this).attr("flg", "0");
        $(this).removeClass("Active");
        $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

        $(this).find("input[type='text']").eq(0).prop("disabled", true);
        $(this).find("input[type='text']").eq(0).val($(this).attr("MOQ"));
        $(this).find("td[iden='proxy']").eq(0).html("");
    });

    $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
}

function fnClusterwiseBaseProxySBFSelection() {
    var channelId = $("#PopupCopyClusterddl").attr("currentnode");
    var IsSameforAllCluster = $("#PopupCopyClusterddl").attr("IsSameforAllCluster");
    var IsClusterDetailsUnchanged = $("#PopupCopyClusterddl").attr("IsClusterDetailsUnchanged");

    if (IsClusterDetailsUnchanged == "0") {
        $("#PopupCopyClusterddl").attr("selectedIds", GenerateBaseProxySBFScriptforAllChannel(channelId));
        if (channelId == "0") {
            $("#PopupCopyClusterddl").attr("IsSameforAllCluster", "1");
        }
    }

    var strbucketScriptforNewCluster = "";
    var selectedIds = $("#PopupCopyClusterddl").attr("selectedIds");
    for (var i = 0; i < selectedIds.split("^").length; i++) {
        if ((selectedIds.split("^")[i].split("!")[0].split("|")[0] == $("#ddlSelectedCluster").val())) {
            strbucketScriptforNewCluster = selectedIds.split("^")[i].split("!")[1];
        }
    }

    if (strbucketScriptforNewCluster != "") {
        fnResetBaseProxyPopupforSpecificCluster();
        SetBaseProxybasedOnSelectedCluster();
    }
    else if (selectedIds.split("^")[0].split("!")[0].split("|")[0] != "0") {
        if ($("#ddlSelectedCluster").val() == "0") {
            fnResetBaseProxyPopupforSpecificCluster();
        }
        else {
            $("#PopupCopyClusterddl").attr("IsClusterDetailsUnchanged", "0");
        }
    }

    $("#PopupCopyClusterddl").attr("currentnode", $("#ddlSelectedCluster").val());
}
function GenerateBaseProxySBFScriptforAllChannel(ChannelId) {
    var updatedselectedIds = "";
    if ($("#PopupCopyClusterddl").attr("IsClusterDetailsUnchanged") == "0") {
        if ($("#PopupCopyClusterddl").attr("selectedIds") != "") {
            var selectedIds = $("#PopupCopyClusterddl").attr("selectedIds");
            if (selectedIds.split("^").length == "1" && selectedIds.split("^")[0].split("!")[0] == "0|All Cluster") {
                $("#PopupCopyClusterddl").find("option").each(function () {
                    if ($(this).attr("value") != "0" && $(this).attr("value") != ChannelId) {
                        if (updatedselectedIds != "")
                            updatedselectedIds += "^";
                        updatedselectedIds += $(this).attr("value") + "|" + $(this).html() + "!" + selectedIds.split("^")[0].split("!")[1];
                    }
                });
            }
            else {
                for (var i = 0; i < selectedIds.split("^").length; i++) {
                    if (ChannelId != selectedIds.split("^")[i].split("!")[0].split("|")[0]) {
                        if (updatedselectedIds != "")
                            updatedselectedIds += "^";
                        updatedselectedIds += selectedIds.split("^")[i];
                    }
                }
            }
        }

        if (ChannelId == "0")
            updatedselectedIds = "";

        if ($("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']").length > 0) {
            if (updatedselectedIds != "")
                updatedselectedIds += "^";
            updatedselectedIds += ChannelId + "|" + $("#ddlSelectedCluster").find("option[value='" + ChannelId + "']").eq(0).html() + "!" + GenerateBaseProxySBFScriptforSpecificChannel();
        }
    }
    else
        updatedselectedIds = $("#PopupCopyClusterddl").attr("selectedIds");

    $("#PopupCopyClusterddl").attr("IsClusterDetailsUnchanged", "1");
    return updatedselectedIds;
}
function GenerateBaseProxySBFScriptforSpecificChannel() {
    var baseBucket = "";
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']").each(function () {
        baseBucket += "#" + $(this).attr("bucketid") + "|" + $(this).find("input[type='text']").eq(0).val() + "|" + $(this).attr("basesbfnodeid") + "|" + $(this).attr("basesbfnodetype") + "|" + $(this).find("td").eq(1).html() + "$";

        var ProxySBF = "";
        $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr[basebucketid='" + $(this).attr("bucketid") + "']").each(function () {
            ProxySBF += "*" + $(this).attr("nid") + "|" + $(this).attr("ntype");
        });

        baseBucket += ProxySBF.substring(1);
    });

    return baseBucket.substring(1);
}


function SetBaseProxybasedOnSelectedCluster() {
    var selectedIds = $("#PopupCopyClusterddl").attr("selectedIds");

    var selectedstr = "";
    for (var i = 0; i < selectedIds.split("^").length; i++) {
        if ((selectedIds.split("^")[i].split("!")[0].split("|")[0] == $("#ddlSelectedCluster").val()) || (selectedIds.split("^")[i].split("!")[0].split("|")[0] == "0")) {
            selectedstr = selectedIds.split("^")[i].split("!")[1];
        }
    }

    if (selectedstr != "") {
        var BaseBucketId = "";
        var BucketValues = [];
        for (var i = 0; i < selectedstr.split("#").length; i++) {
            var buckettr = $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[bucketid='" + selectedstr.split("#")[i].split("|")[0] + "']");

            if (buckettr.length > 0) {
                if (BaseBucketId != "")
                    BaseBucketId += "^";
                BaseBucketId += selectedstr.split("#")[i].split("|")[0]

                buckettr.attr("flg", "1");
                buckettr.addClass("Active");
                buckettr.find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");

                buckettr.find("input[type='text']").eq(0).removeAttr("disabled");
                buckettr.find("input[type='text']").eq(0).val(selectedstr.split("#")[i].split("|")[1]);
                buckettr.find("td[iden='proxy']").eq(0).html("<img src='../../Images/edit.png' title='Edit Proxy Selection' onclick='fnEditProxy(this);'/>");

                for (var j = 0; j < selectedstr.split("#")[i].split("$")[1].split("*").length; j++) {
                    BucketValues.push({
                        "col1": selectedstr.split("#")[i].split("$")[1].split("*")[j].split("|")[0],
                        "col2": selectedstr.split("#")[i].split("$")[1].split("*")[j].split("|")[1],
                        "col3": $("#ConatntMatter_hdnBucketType").val(),
                        "col4": selectedstr.split("#")[i].split("|")[0],        //BaseSBF BucketID
                        "col5": selectedstr.split("#")[i].split("|")[2],        //BaseSBF NodeID
                        "col6": selectedstr.split("#")[i].split("|")[3]         //BaseSBF NodeType
                    });
                }

            }
        }

        if (BucketValues.length > 0) {
            $("#dvloader").show();
            PageMethods.GetProxyBasedOnBase(BucketValues, BaseBucketId, GetProxyBasedOnBase_pass, GetProxyBasedOnBase_failed, 0);
        }
    }
}

function fnResetBaseSBFPopupClusterddlflg() {
    $("#PopupCopyClusterddl").attr("IsSameforAllCluster", "0");
    $("#PopupCopyClusterddl").attr("IsClusterDetailsUnchanged", "0");
}
function fnSelectUnSelectBaseSBFBucket(ctrl) {
    $("#PopupCopyClusterddl").attr("IsSameforAllCluster", "0");
    $("#PopupCopyClusterddl").attr("IsClusterDetailsUnchanged", "0");

    var ProxySBFs = $(ctrl).closest("tr").attr("strvalue");
    var BaseBucketId = $(ctrl).closest("tr").attr("bucketid");
    if ($(ctrl).closest("tr").attr("flg") == "1") {
        $(ctrl).closest("tr").attr("flg", "0");
        $(ctrl).closest("tr").removeClass("Active");
        $(ctrl).closest("tr").find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

        $(ctrl).closest("tr").find("input[type='text']").eq(0).prop("disabled", true);
        $(ctrl).closest("tr").find("input[type='text']").eq(0).val($(ctrl).closest("tr").attr("MOQ"));
        $(ctrl).closest("tr").find("td[iden='proxy']").eq(0).html("");

        $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr[basebucketid='" + BaseBucketId + "']").remove();
    }
    else {
        $(ctrl).closest("tr").attr("flg", "1");
        $(ctrl).closest("tr").addClass("Active");
        $(ctrl).closest("tr").find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");

        $(ctrl).closest("tr").find("input[type='text']").eq(0).removeAttr("disabled");
        $(ctrl).closest("tr").find("td[iden='proxy']").eq(0).html("<img src='../../Images/edit.png' title='Edit Proxy Selection' onclick='fnEditProxy(this);'/>");

        var BucketValues = [];
        for (var i = 0; i < ProxySBFs.split("^").length; i++) {
            BucketValues.push({
                "col1": ProxySBFs.split("^")[i].split("|")[0],
                "col2": ProxySBFs.split("^")[i].split("|")[1],
                "col3": $("#ConatntMatter_hdnBucketType").val(),
                "col4": BaseBucketId,                                       //BaseSBF BucketID
                "col5": $(ctrl).closest("tr").attr("basesbfnodeid"),        //BaseSBF NodeID
                "col6": $(ctrl).closest("tr").attr("basesbfnodetype")       //BaseSBF NodeType
            });
        }

        $("#dvloader").show();
        PageMethods.GetProxyBasedOnBase(BucketValues, BaseBucketId, GetProxyBasedOnBase_pass, GetProxyBasedOnBase_failed, BaseBucketId);
    }
}
function GetProxyBasedOnBase_pass(result, BaseBucketId) {
    $("#dvloader").hide();

    if (BaseBucketId.toString() == "0") {
        $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html(result);
    }
    else {
        $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr[basebucketid='" + BaseBucketId + "']").remove();
        $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).append(result);
    }
}
function GetProxyBasedOnBase_failed(result) {
    $("#dvloader").hide();
    $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("<tr><td colspan='4' style='color: #666666; font-weight: 600; font-size: 1rem;'>Due to some technical reasons, we are unable to Process your request !</td></tr><tr><td colspan='4' style='color: #ff0000; font-size: 0.9rem;'>Error : " + result + "</td></tr>");
}


function fnEditProxy(ctrl) {
    var BaseSBFIds = $(ctrl).closest("tr").attr("bucketid") + "|" + $(ctrl).closest("tr").attr("basesbfnodeid") + "|" + $(ctrl).closest("tr").attr("basesbfnodetype");
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserNodeID = $("#ConatntMatter_hdnNodeID").val();
    var UserNodeType = $("#ConatntMatter_hdnNodeType").val();
    var ProdLvl = "40";

    $("#dvloader").show();
    PageMethods.GetAllSBFforProxyUpdation(BaseSBFIds.split("|")[0], LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, GetAllSBFforProxyUpdation_pass, GetAllSBFforProxyUpdation_failed, BaseSBFIds);
}
function GetAllSBFforProxyUpdation_pass(res, BaseSBFIds) {
    $("#dvloader").hide();

    var BaseBucketId = BaseSBFIds.split("|")[0];
    $("#divProxySBFPopup").dialog({
        "modal": true,
        "width": "50%",
        "height": "500",
        "title": "Proxy SBF(s) :",
        open: function () {
            $("#divProxySBFPopup").html(res);

            var trhtml = "", trProxySBF = "";
            $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr[basebucketid='" + BaseBucketId + "']").each(function () {
                var nid = $(this).attr("nid");
                var ntype = $(this).attr("ntype");
                trProxySBF = $("#divProxySBFPopup").find("table").eq(0).find("tbody").eq(0).find("tr[nid='" + nid + "'][ntype='" + ntype + "']");

                fnSelectUnSelectProxySBF(trProxySBF.eq(0));

                trhtml = trProxySBF[0].outerHTML;
                trProxySBF.eq(0).remove();
                $("#divProxySBFPopup").find("table").eq(0).find("tbody").eq(0).prepend(trhtml);
            });

            trProxySBF = $("#divProxySBFPopup").find("table").eq(0).find("tbody").eq(0).find("tr[nid='" + BaseSBFIds.split("|")[1] + "'][ntype='" + BaseSBFIds.split("|")[2] + "']");
            trProxySBF.eq(0).attr("flg", "1");
            trProxySBF.eq(0).removeAttr("onclick");
            trProxySBF.eq(0).addClass("ActiveBase");
            trProxySBF.eq(0).find("td").eq(0).html("");

            trhtml = trProxySBF[0].outerHTML;
            trProxySBF.eq(0).remove();
            $("#divProxySBFPopup").find("table").eq(0).find("tbody").eq(0).prepend(trhtml);
        },
        close: function () {
            $("#divProxySBFPopup").dialog('destroy');
        },
        buttons: [{
            text: 'Submit',
            class: 'btn-primary',
            click: function () {
                if ($("#divProxySBFPopup").find("table").eq(0).find("tbody").eq(0).find("tr").length > 0) {
                    if ($("#divProxySBFPopup").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']").length > 0) {
                        $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr[basebucketid='" + BaseBucketId + "']").remove();

                        $("#divProxySBFPopup").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']").each(function () {
                            $(this).removeAttr("onclick");
                            $(this).find("td").eq(0).remove();
                            $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).append($(this)[0].outerHTML);
                        });

                        $("#PopupCopyClusterddl").attr("IsSameforAllCluster", "0");
                        $("#PopupCopyClusterddl").attr("IsClusterDetailsUnchanged", "0");
                        $("#divProxySBFPopup").dialog('close');
                    }
                    else {
                        AutoHideAlertMsg("Please select the SBF Proxy !");
                    }
                }
            }
        }, {
            text: 'Cancel',
            class: 'btn-primary',
            click: function () {
                if ($("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr[basebucketid='" + BaseBucketId + "']").length == 0) {
                    var basetr = $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[bucketid='" + BaseBucketId + "']").eq(0);
                    basetr.attr("flg", "0");
                    basetr.removeClass("Active");
                    basetr.find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

                    basetr.find("input[type='text']").eq(0).prop("disabled", true);
                    basetr.find("input[type='text']").eq(0).val(basetr.attr("MOQ"));
                }
                $("#divProxySBFPopup").dialog('close');
            }
        }]
    });
}
function GetAllSBFforProxyUpdation_failed(res, BaseBucketId) {
    $("#dvloader").hide();
    $("#divProxySBFPopup").dialog({
        "modal": true,
        "width": "50%",
        "height": "200",
        "title": "Proxy SBF(s) :",
        open: function () {
            $("#divProxySBFPopup").html("<div style='color: #666666; font-weight: 600; font-size: 1rem; padding-top: 10px;'>Due to some technical reasons, we are unable to Process your request !</div>");
        },
        close: function () {
            if ($("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr[basebucketid='" + BaseBucketId + "']").length == 0) {
                var basetr = $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[bucketid='" + BaseBucketId + "']").eq(0);
                basetr.attr("flg", "0");
                basetr.removeClass("Active");
                basetr.find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

                basetr.find("input[type='text']").eq(0).prop("disabled", true);
                basetr.find("input[type='text']").eq(0).val(basetr.attr("MOQ"));
            }

            $("#divProxySBFPopup").dialog('destroy');
        },
        buttons: [{
            text: 'Cancel',
            class: 'btn-primary',
            click: function () {
                $("#divProxySBFPopup").dialog('close');
            }
        }]
    });
}


function fnSelectUnSelectProxySBF(ctrl) {
    if ($(ctrl).closest("tr").attr("flg") == "1") {
        $(ctrl).closest("tr").attr("flg", "0");
        $(ctrl).closest("tr").removeClass("Active");
        $(ctrl).closest("tr").find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
    }
    else {
        $(ctrl).closest("tr").attr("flg", "1");
        $(ctrl).closest("tr").addClass("Active");
        $(ctrl).closest("tr").find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");
    }
}

function fnResetBaseSBFPopupAction() {
    $("#divProxySBFTbl").html($("#ConatntMatter_hdnSBFHierforBasePopup").val());
    $("#divProxySBFTbl").find("table").eq(0).addClass("clsBaseSBFDisable");

    var brand = $("#divProxySBFTbl").attr("brand");
    if (brand != "") {
        var trbrandwise = "";
        for (var i = 0; i < brand.split("^").length; i++) {
            $("#divProxySBFTbl").find("tbody").eq(0).find("tr[brand='" + brand.split("^")[i] + "']").each(function () {
                trbrandwise += $(this)[0].outerHTML;
            });
        }
        $("#divProxySBFTbl").find("tbody").eq(0).html(trbrandwise);
    }
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

function fnSBFHierPopup(ctrl) {
    var strtable = "<table class='table table-bordered table-sm table-hover clstbl-baseSBF'>";
    strtable += "<thead>";
    strtable += "<tr>";
    strtable += "<th style='width:50%;'>Base SBF</th>";
    strtable += "<th style='width:15%;'>Proxy SBF</th>";
    strtable += "<th style='width:15%;'>MOQ</th>";
    strtable += "<th style='width:20%;'>Action</th>";
    strtable += "</tr>";
    strtable += "</thead>";
    strtable += "<tbody>";
    strtable += "</tbody>";
    strtable += "</table>";
    $("#divBaseSBFTbl").html(strtable);
    $("#divSelectedBaseSBFTbl").html(strtable);

    strtable = "<table class='table table-bordered table-sm table-hover clstbl-baseProxySBF'>";
    strtable += "<thead>";
    strtable += "<tr>";
    strtable += "<th style='width:20%;'>Brand</th>";
    strtable += "<th style='width:35%;'>BrandForm</th>";
    strtable += "<th style='width:45%;'>SubBrandForm</th>";
    strtable += "</tr>";
    strtable += "</thead>";
    strtable += "<tbody>";
    strtable += "</tbody>";
    strtable += "</table>";
    $("#divBaseProxySBFTbl").html(strtable);

    if ($(ctrl).attr("sbfhiier") != "") {
        var strID = $(ctrl).attr("sbfhiier");
        var strDescr = $(ctrl).closest("div").prev().html();

        for (i = 0; i < strID.split("*").length; i++) {
            var strBaseSBF = "";
            strBaseSBF += "<tr strbase='" + strDescr.split(",")[i].trim() + "' nid='" + strID.split("*")[i].split("-")[0].split("|")[0] + "' ntype='" + strID.split("*")[i].split("-")[0].split("|")[1] + "' proxy='" + strID.split("*")[i].split("-")[1] + "' flgActive='0'>";
            strBaseSBF += "<td>" + strDescr.split(",")[i].trim() + "</td>";
            strBaseSBF += "<td>" + strID.split("*")[i].split("-")[0].split("|")[2] + "</td>";
            strBaseSBF += "<td><input type='text' value='" + strID.split("*")[i].split("-")[0].split("|")[3] + "' onfocus='fnMOQFocus(this);' onblur='fnMOQBlur(this);'/></td>";
            strBaseSBF += "<td><img src='../../Images/cancel.png' title='Remove' onclick='fnRemoveBaseSBF(this);' style='margin-left: 5px;'></td>";
            strBaseSBF += "</tr>";

            $("#divSelectedBaseSBFTbl").find("tbody").eq(0).append(strBaseSBF);
        }
    }

    $("#divBaseProxySBFPopup").dialog({
        "modal": true,
        "width": "92%",
        "height": "600",
        "title": "Base & Proxy SBF :",
        open: function () {
            fnResetBaseSBFPopupAction();
            $("#ConatntMatter_hdnBaseSBFAction").val("0");
            $("#divBaseSBFActionbtns").find("a").removeClass("active");

            if ($("#divSelectedBaseSBFTbl").find("tbody").eq(0).find("tr").length > 0) {
                fnCombi($("#divBaseSBFActionbtns").find("a").eq(1), 2);
            }

            $("#divBaseProxySBFPopup").next().css("width", "100%");
            $("#divBaseProxySBFPopup").next().prepend("<i class='fa fa-file-excel-o' onclick='fnSBDDownload();' style='font-size: 2.5em; color: #EF3A2C; vertical-align: top; margin-top: 12px; margin-left: 2%;'></i><fieldset style='display: inline-block; margin-left: 26px; padding: 0px 20px  6px; border: 1px solid #ddd;'><Legend style='width: auto; padding: 0 5px; font-size: .9rem; font-weight: 500;   margin-bottom: 0;'>Legend</Legend><div style='color: #000; font-weight: 400;'><i class='fa fa-square' style='margin-right: 10px; color: #0000C4;'></i>Base SBF <i class='fa fa-square' style='margin:0 10px 0 30px; color: #C0C0C0;'></i>Combi SBF</div></fieldset>");
        },
        close: function () {
            $("#divBaseProxySBFPopup").dialog('destroy');
        },
        buttons: [{
            text: 'Next ',
            class: 'btn-primary',
            click: function () {
                if ($("#divBaseSBFTbl").find("tbody").eq(0).find("tr").length > 0) {
                    if ($("#ConatntMatter_hdnBaseSBFAction").val() == "2")
                        $("#divSelectedBaseSBFTbl").find("tbody").eq(0).html("");

                    $("#divBaseSBFTbl").find("tbody").eq(0).find("tr").each(function () {
                        var MOQ = $(this).find("td").eq(2).find("input[type='text']").eq(0).val();
                        $("#divSelectedBaseSBFTbl").find("tbody").eq(0).append($(this)[0].outerHTML);
                        $("#divSelectedBaseSBFTbl").find("tbody").eq(0).find("tr:last").find("td").eq(2).html("<input type='text' value='" + MOQ + "' onfocus='fnMOQFocus(this);' onblur='fnMOQBlur(this);'/>");
                    });

                    $("#divSelectedBaseSBFTbl").find("tbody").eq(0).find("tr").attr("flgActive", "0");
                    $("#divSelectedBaseSBFTbl").find("tbody").eq(0).find("tr").removeClass("clsActve");

                    fnResetBaseSBFPopupAction();
                    $("#ConatntMatter_hdnBaseSBFAction").val("0");
                    $("#divBaseSBFActionbtns").find("a").removeClass("active");
                }
                else
                    AutoHideAlertMsg("Please select the Base-SBF !");
            }
        },
        {
            text: 'Final Submit',
            class: 'btn-primary',
            click: function () {
                if ($("#ConatntMatter_hdnBaseSBFAction").val() == "2")
                    $("#divSelectedBaseSBFTbl").find("tbody").eq(0).html("");

                $("#divBaseSBFTbl").find("tbody").eq(0).find("tr").each(function () {
                    var MOQ = $(this).find("td").eq(2).find("input[type='text']").eq(0).val();
                    $("#divSelectedBaseSBFTbl").find("tbody").eq(0).append($(this)[0].outerHTML);
                    $("#divSelectedBaseSBFTbl").find("tbody").eq(0).find("tr:last").find("td").eq(2).html("<input type='text' value='" + MOQ + "' onfocus='fnMOQFocus(this);' onblur='fnMOQBlur(this);'/>");
                });

                if ($("#divSelectedBaseSBFTbl").find("tbody").eq(0).find("tr").length > 0) {
                    var strID = "";
                    var strDescr = "";
                    $("#divSelectedBaseSBFTbl").find("tbody").eq(0).find("tr").each(function () {
                        strID += "*" + $(this).attr("nid") + "|" + $(this).attr("ntype") + "|" + $(this).find("td").eq(1).html() + "|" + $(this).find("td").eq(2).find("input[type='text']").eq(0).val() + "-" + $(this).attr("proxy");
                        strDescr += ", " + $(this).find("td").eq(0).html();
                    });
                    $(ctrl).attr("sbfhiier", strID.substring(1) + "||||" + $("#divProxySBFTbl").attr("brand"));
                    $(ctrl).closest("div").prev().html(strDescr.substring(2));

                    var rowIndex = $(ctrl).closest("tr[iden='SBD']").index();
                    fnAdjustRowHeight(rowIndex);
                }
                else {
                    $(ctrl).attr("sbfhiier", "||||" + $("#divProxySBFTbl").attr("brand"));
                    $(ctrl).closest("div").prev().html("");
                }
                $("#divBaseProxySBFPopup").dialog('close');
            }
        }, {
            text: 'Cancel',
            class: 'btn-primary',
            click: function () {
                $("#divBaseProxySBFPopup").dialog('close');
            }
        }]
    });
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

function fnSBDDownload() {
    $("#dvloader").show();

    var Arr = [];

    if ($("#ConatntMatter_hdnBaseSBFAction").val() == "2") {
        $("#divBaseSBFTbl").find("tbody").eq(0).find("tr").each(function () {
            var strBase = $(this).attr("strbase");
            var proxy = $(this).closest("tr").attr("proxy");
            var MOQ = $(this).closest("tr").find("input").eq(0).val();

            Arr.push({ "Base SBF": strBase, "MOQ": MOQ, "Proxy SBF": strBase });

            for (var i = 0; i < proxy.split("^").length; i++) {
                if ($(this).attr("nid") != proxy.split("^")[i].split("|")[0]) {
                    var proxySbf = $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr[nid='" + proxy.split("^")[i].split("|")[0] + "'][ntype='" + proxy.split("^")[i].split("|")[1] + "']").eq(0).find("td").eq(5).html();

                    Arr.push({ "Base SBF": strBase, "MOQ": MOQ, "Proxy SBF": proxySbf });
                }
            }
        });
    }
    else {
        $("#divSelectedBaseSBFTbl").find("tbody").eq(0).find("tr").each(function () {
            var strBase = $(this).attr("strbase");
            var proxy = $(this).closest("tr").attr("proxy");
            var MOQ = $(this).closest("tr").find("input").eq(0).val();

            Arr.push({ "Base SBF": strBase, "MOQ": MOQ, "Proxy SBF": strBase });

            for (var i = 0; i < proxy.split("^").length; i++) {
                if ($(this).attr("nid") != proxy.split("^")[i].split("|")[0]) {
                    var proxySbf = $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr[nid='" + proxy.split("^")[i].split("|")[0] + "'][ntype='" + proxy.split("^")[i].split("|")[1] + "']").eq(0).find("td").eq(5).html();

                    Arr.push({ "Base SBF": strBase, "MOQ": MOQ, "Proxy SBF": proxySbf });
                }
            }
        });

        $("#divBaseSBFTbl").find("tbody").eq(0).find("tr").each(function () {
            var strBase = $(this).attr("strbase");
            var proxy = $(this).closest("tr").attr("proxy");
            var MOQ = $(this).closest("tr").find("input").eq(0).val();

            Arr.push({ "Base SBF": strBase, "MOQ": MOQ, "Proxy SBF": strBase });

            for (var i = 0; i < proxy.split("^").length; i++) {
                if ($(this).attr("nid") != proxy.split("^")[i].split("|")[0]) {
                    var proxySbf = $("#divProxySBFTbl").find("table").eq(0).find("tbody").eq(0).find("tr[nid='" + proxy.split("^")[i].split("|")[0] + "'][ntype='" + proxy.split("^")[i].split("|")[1] + "']").eq(0).find("td").eq(5).html();

                    Arr.push({ "Base SBF": strBase, "MOQ": MOQ, "Proxy SBF": proxySbf });
                }
            }
        });
    }

    setTimeout(function () {
        $("#dvloader").hide();
    }, 1000);

    if (Arr.length == 0) {
        AutoHideAlertMsg("No Base-Proxy SBF Mapping Found !");
    }
    else {
        $("#ConatntMatter_hdnjsonarr").val(JSON.stringify(Arr));
        $("#ConatntMatter_btnSBDDownload").click();
    }

    return false;
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
function fnShowClusterPopup(ctrl, IsMain) {
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
            strtable += "<th style='width:25%;'>Region</th>";
            strtable += "<th style='width:20%;'>Site</th>";
            strtable += "<th style='width:35%;'>Distributor</th>";
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

            var Qtr = $("#ddlQuarter").val().split("|")[2];
            var Yr = $("#ddlQuarter").val().split("|")[3];
            if (!IsMain) {
                Qtr = $("#ddlQuarterPopup").val().split("|")[2];
                Yr = $("#ddlQuarterPopup").val().split("|")[3];
            }

            $(ctrl).attr("mth", Qtr);
            $(ctrl).attr("yr", Yr);
            PageMethods.GetClusters(LoginID, RoleID, UserID, "4", Qtr, Yr, GetClusters_pass, GetClusters_failed, selectedstr);
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                var selectedstr = "";
                $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']").each(function () {
                    selectedstr += "^" + $(this).attr("clusterid");
                });
                if (selectedstr != "") {
                    selectedstr = selectedstr.substring(1);
                }

                $(ctrl).attr("selectedstr", selectedstr);
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
        PageMethods.GetSelHierTbl(BucketValues, "4", "0", GetSelHierTbl_pass, GetSelHierTbl_failed);
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

            var tr = "";
            if ($("#ConatntMatter_hdnBucketType").val() == "6") {
                tr = $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[bucketid='" + CopyBucketTD.split("|")[i].split("^")[0] + "']");
                tr.find("input[type='text']").eq(0).removeAttr("disabled");
                tr.find("input[type='text']").eq(0).val(CopyBucketTD.split("|")[i].split("^")[1]);
            }
            else {
                tr = $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[bucketid='" + CopyBucketTD.split("|")[i] + "']");
            }
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