
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
    ht = $(window).height();
    $("#divRightReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 220));
    $("#divLeftReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 220));

    $(".clsDate").datepicker({
        dateFormat: 'dd-M-y'
    });

    $("#ddlMonth").html($("#ConatntMatter_hdnMonths").val().split("^")[0]);
    $("#ddlMonth").val($("#ConatntMatter_hdnMonths").val().split("^")[1]);

    $("#ddlStatus").html($("#ConatntMatter_hdnProcessGrp").val().split("^")[0]);
    $("#divLegends").html($("#ConatntMatter_hdnProcessGrp").val().split("^")[1]);

    $("#ddlMonthPopup").html($("#ConatntMatter_hdnMonths").val().split("^")[0]);
    $("#ddlMonthPopup").val($("#ConatntMatter_hdnMonths").val().split("^")[1]);

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
        "width": "210px"
    });
    $("#ddlMSMPAlies").next().find("span.ui-icon").eq(0).css({
        "margin": ".2rem 0",
        "margin-bottom": "0",
        "background-color": "transparent",
        "border": "none"
    });

    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    if (RoleID == "2") {
        $("#divAddNewFilterBlock").css("display", "none");
        $("#divTypeSearchFilterBlock").css("width", "68%");
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
            $("#BookmarkFilterBlock").attr("class", "col-3");

            $("#divHierFilterBlock").css("width", "54%");
            $("#divTypeSearchFilterBlock").css("width", "13%");
            if (RoleID == "2") {
                $("#divTypeSearchFilterBlock").css("width", "26%");
            }
        }
        else {
            $("#MSMPFilterBlock").hide();
            $("#HierFilterBlock").show();
            $("#HierFilterBlock").attr("class", "col-7");
            $("#BookmarkFilterBlock").attr("class", "col-5");

            $("#divHierFilterBlock").css("width", "39%");
            $("#divTypeSearchFilterBlock").css("width", "28%");
            if (RoleID == "2") {
                $("#divTypeSearchFilterBlock").css("width", "41%");
            }
        }
    }
    else {
        $(ctrl).css("color", "#666666");
        $(ctrl).attr("flgVisibleHierFilter", "0");

        $("#divHierFilterBlock").css("width", "12%");
        $("#divTypeSearchFilterBlock").css("width", "55%");
        if (RoleID == "2") {
            $("#divTypeSearchFilterBlock").css("width", "68%");
        }

        $("#txtProductHierSearch").attr("InSubD", "0");
        $("#txtProductHierSearch").attr("prodhier", "");
        $("#txtProductHierSearch").attr("prodlvl", "");
        $("#txtLocationHierSearch").attr("InSubD", "0");
        $("#txtLocationHierSearch").attr("prodhier", "");
        $("#txtLocationHierSearch").attr("prodlvl", "");
        $("#txtChannelHierSearch").attr("InSubD", "0");
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
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").attr("flgVisible", "0");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").css("display", "none");
        $("#tblleftfixed").find("tbody").eq(0).find("tr").attr("flgVisible", "0");
        $("#tblleftfixed").find("tbody").eq(0).find("tr").css("display", "none");

        var flgValid = 0;
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td[iden_td='search']").eq(0).html().toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }

            if (flgValid == 1) {
                $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).css("display", "table-row");
                $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).attr("flgVisible", "1");
                $(this).css("display", "table-row");
                $(this).attr("flgVisible", "1");
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

        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").css("display", "table-row");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").attr("flgVisible", "1");
        $("#tblleftfixed").find("tbody").eq(0).find("tr").css("display", "table-row");
        $("#tblleftfixed").find("tbody").eq(0).find("tr").attr("flgVisible", "1");
    }
}
function fnResetFilter() {
    //$("#txtFromDate").val("");
    //$("#txtToDate").val("");
    $("#txtProductHierSearch").attr("InSubD", "0");
    $("#txtProductHierSearch").attr("prodhier", "");
    $("#txtProductHierSearch").attr("prodlvl", "");
    $("#txtLocationHierSearch").attr("InSubD", "0");
    $("#txtLocationHierSearch").attr("prodhier", "");
    $("#txtLocationHierSearch").attr("prodlvl", "");
    $("#txtChannelHierSearch").attr("InSubD", "0");
    $("#txtChannelHierSearch").attr("prodhier", "");
    $("#txtChannelHierSearch").attr("prodlvl", "");

    $("#btnInitExpandedCollapseMode").show();
    $("#btnInitExpandedCollapseMode").html("Expanded Mode");
    $("#btnInitExpandedCollapseMode").attr("flgCollapse", "0");

    $("#txtfilter").val("");
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
    var LocString = $("#txtLocationHierSearch").attr("prodhier");
    var ChannelValues = [];
    var ChannelString = $("#txtChannelHierSearch").attr("prodhier");
    var FromDate = $("#ddlMonth").val().split("|")[0]; //$("#txtFromDate").val();
    var ToDate = $("#ddlMonth").val().split("|")[1]; //$("#txtToDate").val();
    var ProcessGroup = $("#ddlStatus").val();

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
                "col1": LocString.split("^")[i].split("|")[0],
                "col2": LocString.split("^")[i].split("|")[1],
                "col3": "2"
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
    PageMethods.fnGetReport(LoginID, RoleID, UserID, FromDate, ToDate, ProdValues, LocValues, ChannelValues, ProcessGroup, ArrUser, fnGetReport_pass, fnfailed, flg);
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
            $("#btnCopyINIT").attr("onclick", "fnCopyMultiInitiativePopup();");
        }
        else {
            $("#btnAddNewINIT").addClass("btn-disabled");
            $("#btnAddNewINIT").removeAttr("onclick");

            $("#btnCopyINIT").addClass("btn-disabled");
            $("#btnCopyINIT").removeAttr("onclick");
        }

        $("#divLegends").html(res.split("|^|")[4]);

        var leftfixed = "";
        trArr = $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']");
        leftfixed += "<table id='tblleftfixed' class='table table-striped table-bordered table-sm clsReport' style='width:99.8%;'>";
        leftfixed += "<thead>";
        leftfixed += "<tr>";
        for (var i = 0; i < 5; i++) {
            leftfixed += "<th>" + $("#tblReport").find("thead").eq(0).find("tr").eq(0).find("th").eq(i).html() + "</th>";
        }
        leftfixed += "</tr>";
        leftfixed += "</thead>";
        leftfixed += "<tbody>";
        for (h = 0; h < trArr.length; h++) {
            leftfixed += "<tr Init='" + trArr.eq(h).attr("Init") + "' INITName='" + trArr.eq(h).attr("INITName") + "' flgEdit='0' flgVisible='1'>";
            for (var i = 0; i < 5; i++) {
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
                    leftfixed += "<td style='font-size: 0.7rem;'>" + trArr.eq(h).find("td").eq(i).html() + "</td>";
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

        $("#tblReport").css("margin-left", "-424px");

        fnCreateHeader();
        if ($("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(0).attr("Init") == "0") {
            $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(0).remove();
            $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(0).remove();
        }

        if ($("#divLeftReport").find("tbody").eq(0).find("tr").length == 0) {
            var ht = $(window).height();
            $("#divRightReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 240));
            $("#divLeftReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 240));
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
    for (var i = 0; i < 5; i++) {
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
    fixedHeader += "<table id='tblRightfixedHeader' class='table table-striped table-bordered table-sm clsReport' style='width:99.8%; margin-bottom: 0;'>";
    fixedHeader += "<thead>";
    fixedHeader += $("#tblReport").find("thead").eq(0).html();
    fixedHeader += "</thead>";
    fixedHeader += "</table>";
    $("#divRightReportHeader").html(fixedHeader);
    $("#tblRightfixedHeader").css("margin-left", "-420px");

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
    for (i = 5; i < $("#tblReport").find("tr").eq(0).find("th").length; i++) {
        $("#tblReport").find("tr").eq(0).find("th").eq(i).css("min-width", "auto");
        $("#tblReport").find("tr").eq(0).find("th").eq(i).css("width", "auto");
    }

    var wid = $("#tblReport").width();
    $("#tblReport").css("width", wid);
    $("#tblRightfixedHeader").css("min-width", wid);

    for (i = 5; i < $("#tblReport").find("tr").eq(0).find("th").length; i++) {
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
    tr = $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(index);

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
    $("#tblReport").find("tbody").eq(0).find("tr[iden='Init'][flgEdit='0']").each(function () {
        var rowIndex = $(this).index();

        var InitName = $(this).attr("initname");
        var shortDescr = $(this).attr("ShortDescr");
        var Descr = $(this).attr("Descr");
        var loc = ExtendContentBody($(this).attr("loc"));
        var channel = ExtendContentBody($(this).attr("channel"));

        if ($("#btnInitExpandedCollapseMode").attr("flgCollapse") == "1") {
            InitName = InitName.length > 17 ? "<span title='" + InitName + "' class='clsInform'>" + InitName.substring(0, 15) + "..</span>" : InitName;
            shortDescr = shortDescr.length > 17 ? "<span title='" + shortDescr + "' class='clsInform'>" + shortDescr.substring(0, 15) + "..</span>" : shortDescr;
            Descr = Descr.length > 50 ? "<span title='" + Descr + "' class='clsInform'>" + Descr.substring(0, 48) + "..</span>" : Descr;
            loc = "<div style='width: 202px; min-width: 202px;'>" + (loc.length > 70 ? "<span title='" + loc + "' class='clsInform'>" + loc.substring(0, 68) + "..</span>" : loc) + "</div>";
            channel = "<div style='width: 202px; min-width: 202px;'>" + (channel.length > 70 ? "<span title='" + channel + "' class='clsInform'>" + channel.substring(0, 68) + "..</span>" : channel) + "</div>";
        }
        else {
            loc = "<div style='width: 202px; min-width: 202px; font-size: 0.6rem;'>" + ExtendContentBody($(this).attr("loc")) + "</div>";
            channel = "<div style='width: 202px; min-width: 202px; font-size: 0.6rem;'>" + ExtendContentBody($(this).attr("channel")) + "</div>";
        }

        if ($("#ConatntMatter_hdnRoleID").val() != "3" && $("#ConatntMatter_hdnRoleID").val() != "1015" && $("#ConatntMatter_hdnRoleID").val() != "4") {
            $(this).find("td[iden='Init']").eq(3).html(InitName + "<br/>" + shortDescr);
        }
        else {
            $(this).find("td[iden='Init']").eq(3).html(InitName);
        }
        $(this).find("td[iden='Init']").eq(4).html(Descr);

        if ($("#ConatntMatter_hdnRoleID").val() != "3" && $("#ConatntMatter_hdnRoleID").val() != "1015" && $("#ConatntMatter_hdnRoleID").val() != "4") {
            $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).find("td").eq(3).html(InitName + "<br/>" + shortDescr);
        }
        else {
            $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).find("td").eq(3).html(InitName);
        }
        $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).find("td").eq(4).html(Descr);

        if ($("#tblReport").attr("IsChannelExpand") == "1")
            $(this).find("td[iden='Init']").eq(6).html(channel);

        if ($("#tblReport").attr("IsLocExpand") == "1")
            $(this).find("td[iden='Init']").eq(7).html(loc);

        fnAdjustRowHeight(rowIndex);
    });
    fnAdjustColumnWidth();

    Tooltip(".clsInform");
}

function fnDownload() {
    var Arr = [];
    $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").each(function () {
        if ($(this).attr("Init") != "0" && $(this).css("display") != "none") {
            Arr.push({ "INITID": $(this).attr("Init") });
        }
    });

    if (Arr.length == 0) {
        Arr.push({ "INITID": 0 });
    }


    $("#ConatntMatter_hdnjsonarr").val(JSON.stringify(Arr));
    var MonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var month = parseInt(MonthArr.indexOf($("#ddlMonth").val().split("|")[0].split('-')[1]) + 1);
    var year = "20" + $("#ddlMonth").val().split("|")[0].split('-')[2];

    $("#ConatntMatter_hdnmonthyearexceltext").val($("#ddlMonth option:selected").text());
    $("#ConatntMatter_hdnmonthyearexcel").val(month + "^" + year);
    $("#ConatntMatter_btnDownload").click();
    return false;
}

function fnBookmarkFilter() {
    var Bookmark = $("#ddlBookmark").val();

    $("#divButtons").find("a.btn").addClass("btn-disabled");
    $("#divButtons").find("a.btn").removeAttr("onclick");
    $("#tblleftfixedHeader").find("thead").eq(0).find("input[type='checkbox']:checked").removeAttr("checked");
    $("#tblleftfixed").find("tbody").eq(0).find("input[type='checkbox'][iden='chkInit']:checked").removeAttr("checked");

    $("#tblleftfixed").find("tbody").eq(0).find("tr").attr("flgVisible", "1");
    $("#tblleftfixed").find("tbody").eq(0).find("tr").css("display", "table-row");
    $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").attr("flgVisible", "1");
    $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").css("display", "table-row");
    switch (Bookmark) {
        case "0":
            //
            break;
        case "1":
            var rowindex = 0;
            $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").each(function () {
                if ($(this).attr("flgBookmark") == 0) {
                    $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).css("display", "none");
                    $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).attr("flgVisible", "0");
                    $(this).css("display", "none");
                    $(this).attr("flgVisible", "0");
                }
                rowindex++;
            });
            break;
        case "2":
            var rowindex = 0;
            $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").each(function () {
                if ($(this).attr("flgBookmark") == 1) {
                    $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).css("display", "none");
                    $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).attr("flgVisible", "0");
                    $(this).css("display", "none");
                    $(this).attr("flgVisible", "0");
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
    var ArrINIT = [];

    if ($(ctrl).attr("flgBookmark") == "0")
        flgBookmark = "1";
    else
        flgBookmark = "0";

    $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").each(function () {
        ArrINIT.push({
            "col1": $(this).attr("Init")
        });
    });

    $("#dvloader").show();
    PageMethods.fnManageBookMark(flgBookmark, LoginID, UserID, ArrINIT, fnManageBookMarkAll_pass, fnfailed, flgBookmark);
}
function fnManageBookMarkAll_pass(res, flgBookmark) {
    if (res.split("|^|")[0] == "0") {
        var rowindex = 0;
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").each(function () {
            $(this).attr("flgBookmark", flgBookmark);
            $(this).find("td[iden='Init']").eq(1).find("img").eq(0).attr("flgBookmark", flgBookmark);
            $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).find("td").eq(1).find("img").eq(0).attr("flgBookmark", flgBookmark);

            if (flgBookmark == "1") {
                $(this).find("td[iden='Init']").eq(1).find("img").eq(0).attr("src", "../../Images/bookmark.png");
                $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowindex).find("td").eq(1).find("img").eq(0).attr("src", "../../Images/bookmark.png");
            }
            else {
                $(this).find("td[iden='Init']").eq(1).find("img").eq(0).attr("src", "../../Images/bookmark-inactive.png");
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
    var ArrINIT = [];

    if ($(ctrl).attr("flgBookmark") == "0")
        flgBookmark = "1";
    else
        flgBookmark = "0";

    ArrINIT.push({
        "col1": $(ctrl).closest("tr").attr("Init")   //$("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("Init")
    });

    $("#dvloader").show();
    PageMethods.fnManageBookMark(flgBookmark, LoginID, UserID, ArrINIT, fnManageBookMark_pass, fnfailed, rowIndex + "|" + flgBookmark);
}
function fnManageBookMark_pass(res, str) {
    if (res.split("|^|")[0] == "0") {
        var rowIndex = str.split("|")[0];
        var flgBookmark = str.split("|")[1];

        if (flgBookmark == "1") {
            $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("flgBookmark", "1");
            $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).find("td[iden='Init']").eq(1).html("<img src='../../Images/bookmark.png' title='Active Bookmark' flgBookmark='1' onclick='fnManageBookMark(this);'/>");
            $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).find("td").eq(1).html("<img src='../../Images/bookmark.png' title='Active Bookmark' flgBookmark='1' onclick='fnManageBookMark(this);'/>");

        }
        else {
            $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("flgBookmark", "0");
            $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).find("td[iden='Init']").eq(1).html("<img src='../../Images/bookmark-inactive.png' title='Active Bookmark' flgBookmark='0' onclick='fnManageBookMark(this);'/>");
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
    $("#tblleftfixed").find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
        if ($(ctrl).is(":checked")) {
            $(this).find("input[type='checkbox'][iden='chkInit']").prop("checked", true);
        }
        else {
            $(this).find("input[type='checkbox'][iden='chkInit']").removeAttr("checked");
        }
    });

    if ($("#tblleftfixed").find("tbody").eq(0).find("input[type='checkbox'][iden='chkInit']:checked").length > 0) {
        $("#divButtons").find("a.btn").removeClass("btn-disabled");
        $("#divButtons").find("a.btn").attr("onclick", "fnSaveFinalAction(this);");
    }
    else {
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
    var ArrINIT = [];

    var InitName = "", flgShortDetail = 0, flgInitAppRule = 0;
    if (flgAction == "100") {
        fnSaveAllOpen(0);
    }
    else if (flgAction == "99") {
        fnDeleteSelected();
    }
    else if (flgAction == "3") {
        $("#tblleftfixed").find("tbody").eq(0).find("tr").each(function () {
            if ($(this).find("input[type='checkbox'][iden='chkInit']").length > 0) {
                if ($(this).find("input[type='checkbox'][iden='chkInit']").is(":checked")) {
                    var rowIndex = $(this).closest("tr").index();

                    ArrINIT.push({
                        "col1": $(this).closest("tr").attr("Init"), //$("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("Init")
                    });
                }
            }
        });

        if (ArrINIT.length > 0) {
            PageMethods.fnGetAllRejectComments(RoleID, LoginID, UserID, ArrINIT, fnGetAllRejectComments_pass, fnfailed, flgAction);
        }
        else
            AutoHideAlertMsg("Please select atleast one Initiative for Action !");
    }
    else {
        $("#tblleftfixed").find("tbody").eq(0).find("tr").each(function () {
            if ($(this).find("input[type='checkbox'][iden='chkInit']").length > 0) {
                if ($(this).find("input[type='checkbox'][iden='chkInit']").is(":checked")) {
                    var rowIndex = $(this).closest("tr").index();

                    ArrINIT.push({
                        "col1": $(this).closest("tr").attr("Init"), //$("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("Init"),
                        "col2": flgAction,
                        "col3": ""
                    });

                    if (RoleID == "2" && flgAction == "2" && $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("shortdescr") == "" && InitName == "") {
                        flgShortDetail = 1;
                        InitName = $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("initname");
                    }
                    if (((RoleID == "2" && flgAction == "2") || (RoleID == "4" && flgAction == "1")) && $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("baseprod") == "" && InitName == "") {
                        flgInitAppRule = 1;
                        InitName = $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("initname");
                    }
                }
            }
        });

        if (ArrINIT.length == 0) {
            AutoHideAlertMsg("Please select atleast one Initiative for Action !");
        }
        else if (flgShortDetail == 1) {
            AutoHideAlertMsg("Please enter Initiative Short Details for Recom. Trade Plan :  " + InitName + " !");
        }
        else if (flgInitAppRule == 1) {
            AutoHideAlertMsg("Please define Initiative Application Rules for Recom. Trade Plan :  " + InitName + " !");
        }
        else {
            if (flgAction == "1") {
                $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to Submit <span style='color:#0000ff; font-weight: 700;'>" + ArrINIT.length + "</span> Initiative(s) for further Approval.<br/>Do you want to continue ?</div>");
            }
            else {
                $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to Approved <span style='color:#0000ff; font-weight: 700;'>" + ArrINIT.length + "</span> Initiative(s).<br/>Do you want to continue ?</div>");
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
                        PageMethods.fnSaveFinalAction(RoleID, LoginID, UserID, ArrINIT, fnSaveFinalAction_pass, fnfailed, flgAction);
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
        strtbl += "<tr><th>#</th><th>Rec. Trade Plan</th><th>Comments</th></tr>";
        strtbl += "</thead>";
        strtbl += "<tbody>";

        var jsonTbl = $.parseJSON(res.split("|^|")[1]).Table;
        for (var i = 0; i < jsonTbl.length; i++) {
            strtbl += "<tr init='" + jsonTbl[i].INITID + "'>";
            strtbl += "<td>" + (i + 1).toString() + "</td>";
            strtbl += "<td>" + jsonTbl[i].INITName + "</td>";
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

                    var InitName = "", ArrINIT = [];
                    $("#divConfirm").find("tbody").eq(0).find("tr").each(function () {
                        ArrINIT.push({
                            "col1": $(this).attr("Init"),
                            "col2": flgAction,
                            "col3": $(this).find("td").eq(2).find("textarea").eq(0).val()
                        });

                        if ($(this).find("td").eq(2).find("textarea").eq(0).val() == "" && InitName == "") {
                            InitName = $(this).find("td").eq(1).html();
                        }
                    });

                    if (InitName == "") {
                        $("#divConfirm").dialog('close');

                        $("#dvloader").show();
                        PageMethods.fnSaveFinalAction(RoleID, LoginID, UserID, ArrINIT, fnSaveFinalAction_pass, fnfailed, flgAction);
                    }
                    else {
                        AutoHideAlertMsg("Please enter your Comments for " + InitName);
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
            case "1":
                AutoHideAlertMsg("Initiative(s) submitted successfully !");
                break;
            case "2":
                AutoHideAlertMsg("Initiative(s) approved successfully !");
                break;
            case "3":
                AutoHideAlertMsg("Change Request submitted successfully !");
                break;
        }
        fnGetReport(0);
    }
    else {
        fnfailed();
    }
}

function fnImportTypefilter() {
    var flgtr = 0, rowindex = 0;
    var filter = $("#txtImportfilter").val().toUpperCase().split(",");

    if ($("#txtImportfilter").val().toUpperCase().length > 2) {
        $("#tblInitiativeLst").find("tbody").eq(0).find("tr").css("display", "none");

        var flgValid = 0;
        $("#tblInitiativeLst").find("tbody").eq(0).find("tr").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this)[0].innerText.toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }

            if (flgValid == 1) {
                $(this).css("display", "table-row");
                flgtr = 1;
            }

            rowindex++;
        });
    }
    else {
        $("#tblInitiativeLst").find("tbody").eq(0).find("tr").css("display", "table-row");
    }
}

function fnCopyMultiInitiativePopup() {
    if ($("#ddlMonthPopup").find("option").length > 0) {
        $("#btnImportProductHierFilter").attr("prodhier", "");
        $("#btnImportLocationHierFilter").attr("prodhier", "");
        $("#btnImportChannelHierFilter").attr("prodhier", "");

        fnCopyMultiInitiative();
        $("#dvInitiativeListBody").html("<div style='text-align: center; padding-top: 20px;'><img src='../../Images/loading.gif'/></div>");

        $("#dvInitiativeList").dialog({
            "modal": true,
            "width": "96%",
            "height": "600",
            "title": "Copy Initiative(s) :",
            close: function () {
                $("#dvInitiativeList").dialog('destroy');
            },
            buttons: [{
                text: 'Paste Initiative(s)',
                click: function () {
                    fnPasteInitiative();
                },
                class: 'btn-primary'
            },
            {
                text: 'Reset Filter',
                click: function () {
                    $("#btnImportProductHierFilter").attr("prodhier", "");
                    $("#btnImportLocationHierFilter").attr("prodhier", "");
                    $("#btnImportChannelHierFilter").attr("prodhier", "");

                    fnCopyMultiInitiative();
                    $("#dvInitiativeListBody").html("<div style='text-align: center; padding-top: 20px;'><img src='../../Images/loading.gif'/></div>");
                },
                class: 'btn-primary'
            },
            {
                text: 'Cancel',
                click: function () {
                    $("#dvInitiativeList").dialog('close');
                },
                class: 'btn-primary'
            }]
        });
    }
    else {
        AutoHideAlertMsg("No Month(s) found for Importing !");
    }
}
function fnCopyMultiInitiative() {
    $("#txtImportfilter").val('');
    $("#dvInitiativeListBody").html("<div style='text-align: center; padding-top: 20px;'><img src='../../Images/loading.gif'/></div>");

    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var FromDate = $("#ddlMonthPopup").val().split("|")[0];
    var ToDate = $("#ddlMonthPopup").val().split("|")[1];

    //var ProdValues = [], LocValues = [], ChannelValues = [];
    //ProdValues.push({ "col1": "0", "col2": "0", "col3": "1" });
    //LocValues.push({ "col1": "0", "col2": "0", "col3": "2" });
    //ChannelValues.push({ "col1": "0", "col2": "0", "col3": "3" });

    var ProdValues = [], LocValues = [], ChannelValues = [];
    var PrdString = $("#btnImportProductHierFilter").attr("prodhier");
    var LocString = $("#btnImportLocationHierFilter").attr("prodhier");
    var ChannelString = $("#btnImportChannelHierFilter").attr("prodhier");

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
                "col1": LocString.split("^")[i].split("|")[0],
                "col2": LocString.split("^")[i].split("|")[1],
                "col3": "2"
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

    PageMethods.fnGetInitiativeList(LoginID, RoleID, UserID, FromDate, ToDate, ProdValues, LocValues, ChannelValues, fnCopyMultiInitiative_pass, fnfailed);
}
function fnCopyMultiInitiative_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#dvInitiativeListBody").html(res.split("|^|")[1]);
    }
    else {
        $("#dvInitiativeListBody").html("<div style='text-align: center; padding-top: 10px; font-size: 0.9rem;'>Due to some technical reasons, we are unable to process your request !</div>");
    }
}

function fnChkUnchkInitAllPopup(ctrl) {
    if ($(ctrl).is(":checked")) {
        $(ctrl).closest("table").find("tbody").eq(0).find("input[type='checkbox']").prop("checked", true);
    }
    else {
        $(ctrl).closest("table").find("tbody").eq(0).find("input[type='checkbox']").removeAttr("checked");
    }
}

function fnPasteInitiative() {
    if ($("#dvInitiativeListBody").find("table").length > 0) {
        var RoleID = $("#ConatntMatter_hdnRoleID").val();
        var LoginID = $("#ConatntMatter_hdnLoginID").val();
        var UserID = $("#ConatntMatter_hdnUserID").val();
        var FromDate = $("#ddlMonth").val().split("|")[0];
        var ToDate = $("#ddlMonth").val().split("|")[1];
        var ArrINIT = [];

        $("#dvInitiativeListBody").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            if ($(this).find("input[type='checkbox']").is(":checked")) {
                ArrINIT.push({
                    "col1": $(this).attr("Init")
                });
            }
        });

        if (ArrINIT.length > 0) {
            $("#dvloader").show();
            PageMethods.fnPasteInitiative(RoleID, LoginID, UserID, FromDate, ToDate, ArrINIT, fnPasteInitiative_pass, fnfailed);
        }
        else {
            AutoHideAlertMsg("Please select Initiative(s) for Copy !");
        }
    }
}
function fnPasteInitiative_pass(res) {
    if (res.split("|^|")[0] == "0") {
        AutoHideAlertMsg("Initiative(s) copied successfully !");
        $("#dvInitiativeList").dialog('close');
        fnGetReport(0);
    }
    else {
        fnfailed();
    }
}

function fnAddNew() {
    if ($("#ConatntMatter_hdnIsNewAdditionAllowed").val() == "0") {
        AutoHideAlertMsg("Creation of New Initiative is not Allowed !");
    }
    else {
        var defdate = GetNxtMonthToFromDate();

        var strleft = "";
        strleft += "<tr Init='0' flgEdit='1'>";
        strleft += "<td></td>";
        strleft += "<td></td>";
        strleft += "<td class='clstdAction'><img src='../../Images/save.png' title='Save' onclick='fnSave(this, 2);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/></td>";
        if ($("#ConatntMatter_hdnRoleID").val() != "3" && $("#ConatntMatter_hdnRoleID").val() != "1015" && $("#ConatntMatter_hdnRoleID").val() != "4") {
            strleft += "<td><textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'></textarea><br/><textarea style='width:100%; box-sizing: border-box; overflow-y: hidden; margin-top:5px;' rows='1'></textarea></td>";
        }
        else {
            strleft += "<td><textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'></textarea><textarea style='width:100%; box-sizing: border-box; overflow-y: hidden; display: none;' rows='2'></textarea></td>";
        }
        strleft += "<td><textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='2' ></textarea></td>";
        str += "</tr>";



        var str = "";
        str += "<tr iden='Init' Init='0' ApplicablePer='' ApplicableNewPer='' flgEdit='1' style='display: table-row;'>";
        str += "<td iden='Init'></td>";
        str += "<td iden='Init'></td>";
        str += "<td iden='Init' class='clstdAction'><img src='../../Images/save.png' title='Save' onclick='fnSave(this, 2);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/></td>";
        if ($("#ConatntMatter_hdnRoleID").val() != "3" && $("#ConatntMatter_hdnRoleID").val() != "1015" && $("#ConatntMatter_hdnRoleID").val() != "4") {
            str += "<td iden='Init'><input type='text' style='box-sizing: border-box;' value='' placeholder='Name'/><br/><textarea style='width:100%; box-sizing: border-box; overflow-y: hidden; margin-top:5px;' rows='1'></textarea></td>";
        }
        else {
            str += "<td iden='Init'><input type='text' style='box-sizing: border-box;' value='' placeholder='Name'/><textarea style='width:100%; box-sizing: border-box; overflow-y: hidden; display: none;' rows='2'></textarea></td>";
        }
        str += "<td iden='Init'><textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='2' ></textarea></td>";


        str += "<td iden='Init'>";
        str += "<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='2' maxlength='100' onkeyup='fncallength(this, 1);' ></textarea>";
        str += "<div class='text-right' style='margin: -5px 5px 0 0; font-size: 0.6rem;'>Length : <span id='lbltxtChannelSummarylength' style='font-weight: 700;'>0/100</span></div>";
        str += "</td>";

        str += "<td iden='Init'><div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'></div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' buckettype='3' onclick='fnShowCopyBucketPopup(this);'/><br/><img src='../../Images/edit.png' title='Define New Selection' iden='ProductHier' buckettype='3' CopyBucketTD='0' InSubD='0' prodlvl='' prodhier='' onclick='fnShowProdHierPopup(this, 1);'/></div></div></td>";
        str += "<td iden='Init'><div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>India</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' buckettype='2' onclick='fnShowCopyBucketPopup(this);'/><br/><img src='../../Images/edit.png' title='Define New Selection' iden='ProductHier' buckettype='2' CopyBucketTD='0' InSubD='0' prodlvl='100' prodhier='1|100' onclick='fnShowProdHierPopup(this, 1);'/></div></div></td>";

        //Mixed Case & App Rule
        str += "<td iden='Init'><input type='checkbox' onclick='fnMixedCases(this);'/></td>";
        str += "<td iden='Init'>";
        str += "<div style='width: 120px; min-width: 120px; text-align: center;'><a href='#' class='btn btn-primary btn-small' base='' init='' onclick='fnShowApplicationRules(this, 1);'>Edit Details</a><div>";
        str += "</td>";


        str += "<td iden='Init'><input type='text' style='box-sizing: border-box;' value='0'/></td>";
        str += "<td iden='Init'><input type='text' style='box-sizing: border-box;' value='0'/></td>";
        str += "<td iden='Init'><input type='text' class='clsDate' style='box-sizing: border-box; width:96%;' value='" + defdate.split("|")[0] + "' placeholder='From Date'/><br/><a herf='#' onclick='fnSetToFromDate(this);' class='btn btn-primary btn-small'>Default Month</a><br/><input type='text' class='clsDate' style='box-sizing: border-box; width:96%;' value='" + defdate.split("|")[1] + "' placeholder='To Date'/></td>";
        str += "<td iden='Init'><select>" + $("#ConatntMatter_hdnDisburshmentType").val() + "</select></td>";
        str += "<td iden='Init'><select>" + $("#ConatntMatter_hdnIncentiveType").val() + "</select></td>";
        str += "<td iden='Init'><select>" + $("#ConatntMatter_hdnMultiplicationType").val() + "</select></td>";

        str += "<td iden='Init'><a href='#' class='btn btn-primary btn-small' selectedIds='' flgEdit='1' onclick='fnMRAccountPopup(this);'>Click to Select</a></td>";

        str += "<td iden='Init'><select onchange='fnCOHbasedOnInitType(this);'>" + $("#ConatntMatter_hdnINITType").val().split("^")[0] + "</select></td>";
        str += "<td iden='Init'><select>" + $("#ConatntMatter_hdnCOHType").val().split("^")[0] + "</select></td>";
        str += "<td iden='Init'></td>";
        str += "<td iden='Init'></td>";
        str += "<td iden='Init'></td>";
        str += "</tr>";

        if ($("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").length == 0) {
            $("#tblReport").find("tbody").eq(0).html(str);
            $("#tblleftfixed").find("tbody").eq(0).html(strleft);
        }
        else {
            $("#tblReport").find("tbody").eq(0).prepend(str);
            $("#tblleftfixed").find("tbody").eq(0).prepend(strleft);
        }
        fnAdjustColumnWidth();
        fnAdjustRowHeight(0);

        $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(0).find("textarea").on('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            fnAdjustRowHeight($(this).closest("tr").index());
        });

        $(".clsDate").datepicker({
            dateFormat: 'dd-M-y'
        });

        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(0).find("td[iden='Init']").eq(13).find("select").eq(0).val("1");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(0).find("td[iden='Init']").eq(15).find("select").eq(0).val("2");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(0).find("td[iden='Init']").eq(17).find("select").eq(0).val($("#ConatntMatter_hdnINITType").val().split("^")[1]);
        fnCOHbasedOnInitType($("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(0).find("td[iden='Init']").eq(17).find("select")[0]);

        $("#divButtons").find("a.btn[flgAction='100']").removeClass("btn-disabled").attr("onclick", "fnSaveFinalAction(this);");
    }
}
function fnEditCopy(ctrl, cntr) {
    var lefttr = $(ctrl).closest("tr");
    var rowIndex = $(ctrl).closest("tr").index();
    var rttr = $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex);

    var InitName = rttr.attr("initname");
    var shortDescr = rttr.attr("ShortDescr");
    var Descr = rttr.attr("Descr");
    var ChannelSummaryDescr = rttr.attr("ChannelSummaryDescr");
    var lmlamt = rttr.attr("lmlamt");
    var lmlcntr = rttr.attr("lmlcntr");
    var fromdate = rttr.attr("fromdate");
    var todate = rttr.attr("todate");
    if (cntr == 2) {
        var defdate = GetNxtMonthToFromDate();
        fromdate = defdate.split("|")[0];
        todate = defdate.split("|")[1];
    }
    var applicableper = rttr.attr("applicableper");
    var Distribution = rttr.attr("Distribution");
    var IncentiveType = rttr.attr("IncentiveType");
    var Multiplication = rttr.attr("Multiplication");
    var MRAccounts = rttr.attr("IncludeAccounts");
    var InitType = rttr.attr("InitType");
    var COHType = rttr.attr("COHType");
    var MixedCases = rttr.attr("MixedCases");
    var strBase = rttr.attr("BaseProd");
    var strInit = rttr.attr("InitProd");
    var loc = rttr.attr("loc");
    var locBucketstr = "0";
    var locstr = rttr.attr("locstr").split("|||")[0];
    if (rttr.attr("locstr").split("|||").length > 1) {
        locBucketstr = rttr.attr("locstr").split("|||")[1];
    }
    var loclvl = "";
    if (locstr != "")
        loclvl = Maxlvl(locstr);

    var channel = rttr.attr("channel");
    var channelBucketstr = "0";
    var channelstr = rttr.attr("channelstr").split("|||")[0];
    if (rttr.attr("channelstr").split("|||").length > 1) {
        channelBucketstr = rttr.attr("channelstr").split("|||")[1];
    }
    var channellvl = "";
    if (channelstr != "")
        channellvl = Maxlvl(channelstr);

    var InSubD = rttr.attr("InSubD");

    var strbtn = "";
    var flgRejectComment = rttr.attr("flgRejectComment");
    if (flgRejectComment == "1")
        strbtn = "<img src='../../Images/save.png' title='Save' onclick='fnSave(this, 2);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/><img src='../../Images/comments.png' title='Comments' onclick='fnGetRejectComment(this);'/>";
    else
        strbtn = "<img src='../../Images/save.png' title='Save' onclick='fnSave(this, 2);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/>";

    var tr = "", str = "";
    if (cntr == 2) {      // 1:Edit, 2:Copy
        str = "<tr iden='Init' Init='0' flgEdit='1' ApplicablePer='" + applicableper + "' ApplicableNewPer='" + applicableper + "' style='display: table-row;'>";
        str += rttr.html();
        str += "</tr>";
        rttr.before(str);

        str = "<tr iden='Init' Init='0' flgEdit='1'>";
        str += lefttr.html();
        str += "</tr>";
        lefttr.before(str);

        tr = rttr.prev();
        shortDescr = "";
    }
    else {
        tr = rttr;
        tr.attr("flgEdit", "1");
    }
    lefttr = $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex);
    lefttr.attr("flgEdit", "1");


    tr.find("td[iden='Init']").eq(0).html("");
    tr.find("td[iden='Init']").eq(1).html("");
    tr.find("td[iden='Init']").eq(2).html(strbtn);
    lefttr.find("td").eq(0).html("");
    lefttr.find("td").eq(1).html("");
    lefttr.find("td").eq(2).html(strbtn);

    if ($("#ConatntMatter_hdnRoleID").val() != "3" && $("#ConatntMatter_hdnRoleID").val() != "1015" && $("#ConatntMatter_hdnRoleID").val() != "4") {
        tr.find("td[iden='Init']").eq(3).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'>" + InitName + "</textarea><br/><textarea style='width:100%; box-sizing: border-box; overflow-y: hidden; margin-top:5px;' rows='1'>" + shortDescr + "</textarea>");
    }
    else {
        tr.find("td[iden='Init']").eq(3).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'>" + InitName + "</textarea><textarea style='width:100%; box-sizing: border-box; overflow-y: hidden; display: none;' rows='2'>" + shortDescr + "</textarea>");
    }
    tr.find("td[iden='Init']").eq(4).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='2' >" + Descr + "</textarea>");

    if ($("#ConatntMatter_hdnRoleID").val() != "3" && $("#ConatntMatter_hdnRoleID").val() != "1015" && $("#ConatntMatter_hdnRoleID").val() != "4") {
        lefttr.find("td").eq(3).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'>" + InitName + "</textarea><br/><textarea style='width:100%; box-sizing: border-box; overflow-y: hidden; margin-top:5px;' rows='1'>" + shortDescr + "</textarea>");
    }
    else {
        lefttr.find("td").eq(3).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'>" + InitName + "</textarea><textarea style='width:100%; box-sizing: border-box; overflow-y: hidden; display: none;' rows='2'>" + shortDescr + "</textarea>");
    }
    lefttr.find("td").eq(4).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='2' >" + Descr + "</textarea>");

    tr.find("td[iden='Init']").eq(5).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='2' maxlength='100' onkeyup='fncallength(this, 1);'>" + ChannelSummaryDescr + "</textarea><div class='text-right' style='margin: -5px 5px 0 0; font-size: 0.6rem;'>Length : <span id='lbltxtChannelSummarylength' style='font-weight: 700;'>" + ChannelSummaryDescr.length + "/100</span></div>");

    tr.find("td[iden='Init']").eq(6).html("<div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>" + ExtendContentBody(channel) + "</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' buckettype='3' onclick='fnShowCopyBucketPopup(this);'/><br/><img src='../../Images/edit.png' title='Define New Selection' iden='ProductHier' buckettype='3' CopyBucketTD='" + channelBucketstr + "' InSubD='0' prodlvl='" + channellvl + "' prodhier='" + channelstr + "' onclick='fnShowProdHierPopup(this, 1);'/></div></div>");
    tr.find("td[iden='Init']").eq(7).html("<div style='position: relative; width: 202px; min-width: 202px; box-sizing: border-box;'><div iden='content' style='font-size:0.6rem; width: 100%; padding-right: 30px;'>" + ExtendContentBody(loc) + "</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' buckettype='2' onclick='fnShowCopyBucketPopup(this);'/><br/><img src='../../Images/edit.png' title='Define New Selection' iden='ProductHier' buckettype='2' CopyBucketTD='" + locBucketstr + "' InSubD='" + InSubD + "' prodlvl='" + loclvl + "' prodhier='" + locstr + "' onclick='fnShowProdHierPopup(this, 1);'/></div></div>");


    if (MixedCases == "1")
        tr.find("td[iden='Init']").eq(8).html("<input type='checkbox' checked  onclick='fnMixedCases(this);'/>");
    else
        tr.find("td[iden='Init']").eq(8).html("<input type='checkbox' onclick='fnMixedCases(this);'/>");

    tr.find("td[iden='Init']").eq(9).html("<div style='width: 120px; min-width: 120px; text-align: center;'><a href='#' class='btn btn-primary btn-small'  base='" + strBase + "' init='" + strInit + "'  onclick='fnShowApplicationRules(this, 1);'>Edit Details</a><div>");


    tr.find("td[iden='Init']").eq(10).html("<input type='text' style='box-sizing: border-box;' value='" + lmlamt + "' />");
    tr.find("td[iden='Init']").eq(11).html("<input type='text' style='box-sizing: border-box;' value='" + lmlcntr + "' />");
    tr.find("td[iden='Init']").eq(12).html("<input type='text' class='clsDate' style='box-sizing: border-box; width:96%;' value='" + fromdate + "' placeholder='From Date'/><br/><a herf='#' onclick='fnSetToFromDate(this);' class='btn btn-primary btn-small'>Default Month</a><br/><input type='text' class='clsDate' style='box-sizing: border-box; width:96%;' value='" + todate + "' placeholder='To Date'/>");
    tr.find("td[iden='Init']").eq(13).html("<select>" + $("#ConatntMatter_hdnDisburshmentType").val() + "</select>");
    tr.find("td[iden='Init']").eq(13).find("select").eq(0).val(Distribution.split("^")[0]);
    tr.find("td[iden='Init']").eq(14).html("<select>" + $("#ConatntMatter_hdnIncentiveType").val() + "</select>");
    tr.find("td[iden='Init']").eq(14).find("select").eq(0).val(IncentiveType.split("^")[0]);
    tr.find("td[iden='Init']").eq(15).html("<select>" + $("#ConatntMatter_hdnMultiplicationType").val() + "</select>");
    tr.find("td[iden='Init']").eq(15).find("select").eq(0).val(Multiplication.split("^")[0]);

    tr.find("td[iden='Init']").eq(16).html("<a href='#' class='btn btn-primary btn-small' selectedIds='" + MRAccounts + "' flgEdit='1' onclick='fnMRAccountPopup(this);'>Edit Details</a>");

    tr.find("td[iden='Init']").eq(17).html("<select onchange='fnCOHbasedOnInitType(this);'>" + $("#ConatntMatter_hdnINITType").val().split("^")[0] + "</select>");
    tr.find("td[iden='Init']").eq(17).find("select").eq(0).val(InitType.split("^")[0]);

    tr.find("td[iden='Init']").eq(18).html("<select>" + $("#ConatntMatter_hdnCOHType").val().split("^")[0] + "</select>");
    fnCOHbasedOnInitType(tr.find("td[iden='Init']").eq(17).find("select")[0]);
    tr.find("td[iden='Init']").eq(18).find("select").eq(0).val(COHType.split("^")[0]);

    if (cntr == 2) {
        tr.find("td[iden='Init']").eq(19).html("");
        tr.find("td[iden='Init']").eq(20).html("");
        tr.find("td[iden='Init']").eq(21).html("");
    }

    lefttr.find("textarea").eq(0).css("height", "auto");
    lefttr.find("textarea").eq(1).css("height", "auto");
    lefttr.find("textarea").eq(0).css("height", lefttr.find("textarea")[0].scrollHeight + "px");
    lefttr.find("textarea").eq(1).css("height", lefttr.find("textarea")[1].scrollHeight + "px");

    fnAdjustRowHeight(rowIndex);

    lefttr.find("textarea").on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        fnAdjustRowHeight($(this).closest("tr").index());
    });

    tr.find(".clsDate").datepicker({
        dateFormat: 'dd-M-y'
    });

    fnAdjustColumnWidth();

    $("#divButtons").find("a.btn[flgAction='100']").removeClass("btn-disabled").attr("onclick", "fnSaveFinalAction(this);");
}
function fnCancel(ctrl) {
    var rowIndex = $(ctrl).closest("tr").index();
    var Init = $(ctrl).closest("tr").attr("Init");
    if (Init == "0") {
        $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).remove();
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).remove();
    }
    else {
        var lefttr = $(ctrl).closest("tr");
        var tr = $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex);

        var InitCode = tr.attr("initcode");
        var InitName = tr.attr("initname");
        var shortDescr = tr.attr("ShortDescr");
        var Descr = tr.attr("Descr");
        var ChannelSummaryDescr = tr.attr("ChannelSummaryDescr");
        var lmlamt = tr.attr("lmlamt");
        var lmlcntr = tr.attr("lmlcntr");
        var fromdate = tr.attr("fromdate");
        var todate = tr.attr("todate");
        var Distribution = tr.attr("Distribution");
        var IncentiveType = tr.attr("IncentiveType");
        var Multiplication = tr.attr("Multiplication");
        var MRAccounts = tr.attr("IncludeAccounts");
        var InitType = tr.attr("InitType");
        var COHType = tr.attr("COHType");
        var MixedCases = tr.attr("MixedCases");
        var flgRejectComment = tr.attr("flgRejectComment");
        var flgBookmark = tr.attr("flgBookmark");
        var flgCheckBox = tr.attr("flgCheckBox");
        var flgSettle = tr.attr("flgSettle");


        var strAppRule = "";
        if (tr.attr("BaseProd") == "") {
            strAppRule = "<div style='width: 120px; min-width: 120px; text-align: center;'><a href='#' class='btn btn-danger btn-small' style='cursor: default;'>No Rule Defined</a><div>";
        }
        else {
            strAppRule = "<div style='width: 120px; min-width: 120px; text-align: center;'><a href='#' class='btn btn-primary btn-small' onclick='fnShowApplicationRules(this, 0);'>View Details</a><div>";
        }


        var loc = ExtendContentBody(tr.attr("loc"));
        var channel = ExtendContentBody(tr.attr("channel"));

        var strbtns = "";
        if ($("#ConatntMatter_hdnIsNewAdditionAllowed").val() == "1") {
            strbtns += "<img src='../../Images/copy.png' title='Copy Initiative' onclick='fnEditCopy(this, 2);'/>";
        }
        strbtns += "<img src='../../Images/edit.png' title='Edit Initiative' onclick='fnEditCopy(this, 1);'/>";
        strbtns += "<img src='../../Images/delete.png' title='Delete Initiative' onclick='fnDelete(this);'/>";
        if (flgSettle == "1") {
            strbtns += "<img src='../../Images/settle.png' title='Settle Initiative' onclick='fnSettle(this);'/>";
        }
        if (flgRejectComment == "1") {
            strbtns += "<img src='../../Images/comments.png' title='Comments' onclick='fnGetRejectComment(this);'/>";
        }

        if ($("#btnInitExpandedCollapseMode").attr("flgCollapse") == "1") {
            InitName = InitName.length > 20 ? "<span title='" + InitName + "' class='clsInform'>" + InitName.substring(0, 18) + "..</span>" : InitName;
            shortDescr = shortDescr.length > 20 ? "<span title='" + shortDescr + "' class='clsInform'>" + shortDescr.substring(0, 18) + "..</span>" : shortDescr;
            Descr = Descr.length > 50 ? "<span title='" + Descr + "' class='clsInform'>" + Descr.substring(0, 48) + "..</span>" : Descr;
            loc = "<div style='width: 202px; min-width: 202px;'>" + (loc.length > 70 ? "<span title='" + loc + "' class='clsInform'>" + loc.substring(0, 68) + "..</span>" : loc) + "</div>";
            channel = "<div style='width: 202px; min-width: 202px;'>" + (channel.length > 70 ? "<span title='" + channel + "' class='clsInform'>" + channel.substring(0, 68) + "..</span>" : channel) + "</div>";
        }
        else {
            loc = "<div style='width: 202px; min-width: 202px; font-size: 0.6rem;'>" + loc + "</div>";
            channel = "<div style='width: 202px; min-width: 202px; font-size: 0.6rem;'>" + channel + "</div>";
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

        if ($("#ConatntMatter_hdnRoleID").val() != "3" && $("#ConatntMatter_hdnRoleID").val() != "1015" && $("#ConatntMatter_hdnRoleID").val() != "4") {
            lefttr.find("td").eq(3).html(InitName + "<br/>" + shortDescr);
        }
        else {
            lefttr.find("td").eq(3).html(InitName);
        }
        lefttr.find("td").eq(4).html(Descr);



        if (flgCheckBox == "1")
            tr.find("td[iden='Init']").eq(0).html("<input iden='chkInit' type='checkbox' onclick='fnUnchkInitIndividual(this);'/>");
        else
            tr.find("td[iden='Init']").eq(0).html("");

        if (flgBookmark == "1")
            tr.find("td[iden='Init']").eq(1).html("<img src='../../Images/bookmark.png' title='Active Bookmark' flgBookmark='1' onclick='fnManageBookMark(this);'/>");
        else
            tr.find("td[iden='Init']").eq(1).html("<img src='../../Images/bookmark-inactive.png' title='InActive Bookmark' flgBookmark='0' onclick='fnManageBookMark(this);'/>");
        tr.find("td[iden='Init']").eq(2).html(strbtns);

        if ($("#ConatntMatter_hdnRoleID").val() != "3" && $("#ConatntMatter_hdnRoleID").val() != "1015" && $("#ConatntMatter_hdnRoleID").val() != "4") {
            tr.find("td[iden='Init']").eq(3).html(InitName + "<br/>" + shortDescr);
        }
        else {
            tr.find("td[iden='Init']").eq(3).html(InitName);
        }
        tr.find("td[iden='Init']").eq(4).html(Descr);



        tr.find("td[iden='Init']").eq(5).html(ChannelSummaryDescr);

        if ($("#tblReport").attr("IsChannelExpand") == "0")
            tr.find("td[iden='Init']").eq(6).html("");
        else
            tr.find("td[iden='Init']").eq(6).html(channel);

        if ($("#tblReport").attr("IsLocExpand") == "0")
            tr.find("td[iden='Init']").eq(7).html("");
        else
            tr.find("td[iden='Init']").eq(7).html(loc);


        if (MixedCases == "1")
            tr.find("td[iden='Init']").eq(8).html("Yes");
        else
            tr.find("td[iden='Init']").eq(8).html("No");

        if ($("#tblReport").attr("IsSchemeAppRule") == "0")
            tr.find("td[iden='Init']").eq(9).html("");
        else
            tr.find("td[iden='Init']").eq(9).html(strAppRule);

        tr.find("td[iden='Init']").eq(10).html(lmlamt);
        tr.find("td[iden='Init']").eq(11).html(lmlcntr);
        tr.find("td[iden='Init']").eq(12).html(fromdate + "<br/>to " + todate);
        tr.find("td[iden='Init']").eq(13).html(Distribution.split("^")[1]);
        tr.find("td[iden='Init']").eq(14).html(IncentiveType.split("^")[1]);
        tr.find("td[iden='Init']").eq(15).html(Multiplication.split("^")[1]);

        if (MRAccounts == "")
            tr.find("td[iden='Init']").eq(16).html("<a href='#' class='btn btn-primary btn-small' style='cursor: default;'>No Account Defined</a>");
        else
            tr.find("td[iden='Init']").eq(16).html("<a href='#' class='btn btn-primary btn-small' selectedIds='" + MRAccounts + "' flgEdit='0' onclick='fnMRAccountPopup(this);'>View Details</a>");

        tr.find("td[iden='Init']").eq(17).html(InitType.split("^")[1]);
        tr.find("td[iden='Init']").eq(18).html(COHType.split("^")[1]);

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
        var flgSave = "1";
        var ctrl = $("#tblleftfixed").find("tbody").eq(0).find("tr[flgEdit='1']").eq(cntr - 1).find("td.clstdAction").eq(0).find("img[title='Save']").eq(0);
        if (tr.attr("init") == "0") {
            flgSave = "2";
        }
        fnSaveInitiative(ctrl, flgSave, cntr);
    }
    else {
        AutoHideAlertMsg("No Initiative details found for updation !");
    }
}
function fnSave(ctrl, flgSave) {
    SaveCntr = 1;
    fnSaveInitiative(ctrl, flgSave, 0);
}

function fnSaveInitiative(ctrl, flgSave, cntr) {
    var lefttr = $(ctrl).closest("tr");
    var rowIndex = $(ctrl).closest("tr").index();
    var rttr = $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex);

    var INITID = lefttr.attr("Init");
    var INITCode = "";
    var INITName = lefttr.find("td").eq(3).find("textarea").eq(0).val();
    var INITShortDescr = lefttr.find("td").eq(3).find("textarea").eq(1).val();
    var INITDescription = lefttr.find("td").eq(4).find("textarea").eq(0).val();
    var ChannelSummaryDescr = rttr.find("td[iden='Init']").eq(5).find("textarea").eq(0).val();

    var MixedCases = 0;
    if (rttr.find("td[iden='Init']").eq(8).find("input[type='checkbox']").eq(0).is(":checked"))
        MixedCases = 1;

    var strBase = rttr.find("td[iden='Init']").eq(9).find("a").eq(0).attr("base");
    var strInit = rttr.find("td[iden='Init']").eq(9).find("a").eq(0).attr("init");

    var AmtLimit = rttr.find("td[iden='Init']").eq(10).find("input[type='text']").eq(0).val();
    var CountLimit = rttr.find("td[iden='Init']").eq(11).find("input[type='text']").eq(0).val();
    var FromDate = rttr.find("td[iden='Init']").eq(12).find("input[type='text']").eq(0).val();
    var ToDate = rttr.find("td[iden='Init']").eq(12).find("input[type='text']").eq(1).val();
    var Disburshment = rttr.find("td[iden='Init']").eq(13).find("select").eq(0).val();
    var IncentiveType = rttr.find("td[iden='Init']").eq(14).find("select").eq(0).val();
    var Multiplication = rttr.find("td[iden='Init']").eq(15).find("select").eq(0).val();

    var IncudeLeap = 0;
    var IncudeSubD = 0;
    var MRAccounts = rttr.find("td[iden='Init']").eq(16).find("a").eq(0).attr("selectedIds");

    var InitType = rttr.find("td[iden='Init']").eq(17).find("select").eq(0).val();
    var COH = rttr.find("td[iden='Init']").eq(18).find("select").eq(0).val();

    var Bucket = [];
    var BucketValues = [];
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var strLocation = rttr.find("td[iden='Init']").eq(7).find("img[iden='ProductHier']").eq(0).attr("ProdHier");
    var strChannel = rttr.find("td[iden='Init']").eq(6).find("img[iden='ProductHier']").eq(0).attr("ProdHier");
    var copyLocationBucketID = rttr.find("td[iden='Init']").eq(7).find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
    var copyChannelBucketID = rttr.find("td[iden='Init']").eq(6).find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
    var ApplicableNewPer = rttr.attr("ApplicableNewPer");

    var BasePrdMain = [];
    var BasePrdDetail = [];
    var BenefitPrdMain = [];
    var BenefitPrdDetail = [];

    if (INITName == "") {
        AutoHideAlertMsg("Please enter the Initiative Name !");
        return false;
    }
    //else if (INITShortDescr == "" && ($("#ConatntMatter_hdnRoleID").val() != "3" && $("#ConatntMatter_hdnRoleID").val() != "1015" && $("#ConatntMatter_hdnRoleID").val() != "4")) {
    //    alert("Please enter the Initiative Short Description !");
    //    return false;
    //}
    else if (INITDescription == "") {
        AutoHideAlertMsg("Please enter the Initiative Description !");
        return false;
    }
    else if (strChannel == "") {
        AutoHideAlertMsg("Please select the Channel/s !");
        return false;
    }
    else if (strLocation == "") {
        AutoHideAlertMsg("Please select the Location/s !");
        return false;
    }
    else if (AmtLimit == "") {
        AutoHideAlertMsg("Please enter the Disburshment Limit Amount !");
        return false;
    }
    else if (CountLimit == "") {
        AutoHideAlertMsg("Please enter the Disburshment Limit Count !");
        return false;
    }
    else if (FromDate == "") {
        AutoHideAlertMsg("Please select the From Date !");
        return false;
    }
    else if (ToDate == "") {
        AutoHideAlertMsg("Please select the To Date !");
        return false;
    }
    else if (parseInt(FromDate.split("-")[2] + AddZero(MonthArr.indexOf(FromDate.split("-")[1])) + FromDate.split("-")[0]) > parseInt(ToDate.split("-")[2] + AddZero(MonthArr.indexOf(ToDate.split("-")[1])) + ToDate.split("-")[0])) {
        AutoHideAlertMsg("To-Date must be Greater than From-Date !");
        return false;
    }
    else if (Disburshment == "0") {
        AutoHideAlertMsg("Please select the Method of Disburshment !");
        return false;
    }
    else if (IncentiveType == "0") {
        AutoHideAlertMsg("Please select the Incentive Type !");
        return false;
    }
    else if (Multiplication == "0") {
        AutoHideAlertMsg("Please select the Multiplication Type !");
        return false;
    }
    else if (MRAccounts == "") {
        AutoHideAlertMsg("Please select the Account(s) !");
        return false;
    }
    else if (InitType == "0") {
        AutoHideAlertMsg("Please select the Initiative Type !");
        return false;
    }
    else if (COH == "0" && (InitType == "2" || InitType == "3")) {
        AutoHideAlertMsg("Please select the COH Type !");
        return false;
    }
    else {
        for (var i = 0; i < copyLocationBucketID.split("|").length; i++) {
            Bucket.push({
                "col1": copyLocationBucketID.split("|")[i],
                "col2": "2"
            });
        }
        for (var i = 0; i < copyChannelBucketID.split("|").length; i++) {
            Bucket.push({
                "col1": copyChannelBucketID.split("|")[i],
                "col2": "3"
            });
        }

        for (var i = 0; i < strLocation.split("^").length; i++) {
            BucketValues.push({
                "col1": strLocation.split("^")[i].split("|")[0],
                "col2": strLocation.split("^")[i].split("|")[1],
                "col3": "2"
            });
        }

        for (var i = 0; i < strChannel.split("^").length; i++) {
            BucketValues.push({
                "col1": strChannel.split("^")[i].split("|")[0],
                "col2": strChannel.split("^")[i].split("|")[1],
                "col3": "3"
            });
        }

        if (strBase != "") {
            var ArrSlab = strBase.split("$$$");
            for (i = 1; i < ArrSlab.length; i++) {
                var ArrGrp = ArrSlab[i].split("***");
                for (j = 1; j < ArrGrp.length; j++) {
                    for (k = 0; k < ArrGrp[j].split("*$*")[6].split("|").length; k++) {
                        BasePrdMain.push({
                            "col1": ArrGrp[0],                      //Slab No
                            "col2": ArrGrp[j].split("*$*")[5],      //Grp No
                            "col3": "Group " + j,                   //Group Name
                            "col4": ArrGrp[j].split("*$*")[6].split("|")[k],    //BucketID
                            "col5": ArrGrp[j].split("*$*")[0],      //Base Prod Type
                            "col6": ArrGrp[j].split("*$*")[1],      //Min
                            "col7": ArrGrp[j].split("*$*")[2],      //Max
                            "col8": ArrGrp[j].split("*$*")[3],      //UOM
                            "col9": ArrGrp[j].split("*$*")[7],      //IsNewSlab"
                            "col10": ArrGrp[j].split("*$*")[8]      //IsNewGrp
                        });
                    }

                    for (var m = 0; m < ArrGrp[j].split("*$*")[4].split("^").length; m++) {
                        BasePrdDetail.push({
                            "col1": ArrGrp[j].split("*$*")[5],      //Grp No
                            "col2": ArrGrp[j].split("*$*")[4].split("^")[m].split("|")[0],
                            "col3": ArrGrp[j].split("*$*")[4].split("^")[m].split("|")[1],
                            "col4": ArrGrp[0]                      //Slab No
                        });
                    }

                }
            }
        }

        if (strInit != "") {
            var ArrGrp = strInit.split("***");
            for (i = 1; i < ArrGrp.length; i++) {
                BenefitPrdMain.push({
                    "col1": ArrGrp[i].split("*$*")[3],                  //Slab No
                    "col2": ArrGrp[i].split("*$*")[5],                  //Grp No
                    "col3": ArrGrp[i].split("*$*")[6],                  //bucket
                    "col4": ArrGrp[i].split("*$*")[0],                  //type
                    "col5": ArrGrp[i].split("*$*")[1],                  //applied
                    "col6": ArrGrp[i].split("*$*")[2],                  //value
                    "col7": ArrGrp[i].split("*$*")[8],                  //IsNewGrp
                });


                for (var m = 0; m < ArrGrp[i].split("*$*")[4].split("^").length; m++) {
                    BenefitPrdDetail.push({
                        "col1": ArrGrp[i].split("*$*")[5],      //Grp No
                        "col2": ArrGrp[i].split("*$*")[4].split("^")[m].split("|")[0],
                        "col3": ArrGrp[i].split("*$*")[4].split("^")[m].split("|")[1],
                        "col4": ArrGrp[i].split("*$*")[3]       //Slab No
                    });
                }
            }
        }

        if (BasePrdMain.length == 0) {
            BasePrdMain.push({ "col1": "0", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "" });
        }
        if (BasePrdDetail.length == 0) {
            BasePrdDetail.push({ "col1": "0", "col2": "", "col3": "", "col4": "" });
        }
        if (BenefitPrdMain.length == 0) {
            BenefitPrdMain.push({ "col1": "0", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "" });
        }
        if (BenefitPrdDetail.length == 0) {
            BenefitPrdDetail.push({ "col1": "0", "col2": "", "col3": "", "col4": "" });
        }

        strLocation = "";
        strChannel = ""

        $("#dvloader").show();
        PageMethods.fnSave(INITID, INITCode, INITName, INITShortDescr, INITDescription, ChannelSummaryDescr, AmtLimit, CountLimit, FromDate, ToDate, Bucket, BucketValues, LoginID, strLocation + "|||" + copyLocationBucketID, strChannel + "|||" + copyChannelBucketID, Disburshment, Multiplication, IncudeLeap, IncudeSubD, BasePrdMain, BasePrdDetail, BenefitPrdMain, BenefitPrdDetail, UserID, MixedCases, flgSave, ApplicableNewPer, IncentiveType, InitType, COH, MRAccounts, fnSave_pass, fnfailed, cntr)
    }
}
function fnSave_pass(res, cntr) {
    if (res.split("|^|")[0] == "0") {
        if (SaveCntr == (cntr + 1)) {
            AutoHideAlertMsg("Initiative details saved/updated successfully !");
            fnGetReport(0);
        }
        else {
            fnSaveAllOpen(cntr + 1);
        }
    }
    else if (res.split("|^|")[0] == "1") {
        AutoHideAlertMsg("Initiative name already exist !");
        $("#dvloader").hide();
    }
    else if (res.split("|^|")[0] == "3") {
        AutoHideAlertMsg("Configuration is not allowed only on Secondary Product/s !");
        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}


function fnDeleteSelected() {
    var InitIds = "";
    $("#tblleftfixed").find("tbody").eq(0).find("tr").each(function () {
        if ($(this).find("input[type='checkbox'][iden='chkInit']").length > 0) {
            if ($(this).find("input[type='checkbox'][iden='chkInit']").is(":checked")) {
                InitIds += "^" + $(this).closest("tr").attr("Init");
            }
        }
    });

    if (InitIds == "") {
        AutoHideAlertMsg("Please select atleast one Initiative for Action !");
    }
    else {
        InitIds = InitIds.substring(1);

        $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are going to Delete <span style='color:#0000ff; font-weight: 700;'>" + InitIds.split("^").length + "</span> Initiative(s).<br/>Do you want to continue ?</div>");

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
                    var UserID = $("#ConatntMatter_hdnUserID").val();

                    $("#dvloader").show();
                    PageMethods.fnDeleteInitiative(InitIds, UserID, fnDeleteInitiative_pass, fnfailed);
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
    var INITID = $(ctrl).closest("tr").attr("Init");
    var initname = $(ctrl).closest("tr").attr("initname");

    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure, you want to delete this Initiative <br/><span style='color:#0000ff; font-weight: 700;'>" + initname + "</span></div>");
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
                var UserID = $("#ConatntMatter_hdnUserID").val();

                $("#dvloader").show();
                PageMethods.fnDeleteInitiative(INITID, UserID, fnDeleteInitiative_pass, fnfailed);
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
function fnDeleteInitiative_pass(res) {
    if (res.split("|^|")[0] == "0") {
        AutoHideAlertMsg("Initiative deleted successfully !");
        fnGetReport(0);
    }
    else {
        fnfailed();
    }
}

function fnSettle(ctrl) {
    var INITID = $(ctrl).closest("tr").attr("Init");
    var initname = $(ctrl).closest("tr").attr("initname");

    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure, you want to Settle this Initiative <br/><span style='color:#0000ff; font-weight: 700;'>" + initname + "</span></div>");
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

                var UserID = $("#ConatntMatter_hdnUserID").val();
                var LoginID = $("#ConatntMatter_hdnLoginID").val();

                $("#dvloader").show();
                PageMethods.fnSettle(INITID, UserID, LoginID, fnSettle_pass, fnfailed);
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
function fnSettle_pass(res) {
    if (res.split("|^|")[0] == "0") {
        AutoHideAlertMsg("Initiative settled successfully !");
        fnGetReport(0);
    }
    else {
        fnfailed();
    }
}

function fnGetRejectComment(ctrl) {
    var INITID = $(ctrl).closest("tr").attr("Init");
    var rowIndex = $(ctrl).closest("tr").index();
    var flgDBEdit = $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("flgDBEdit");

    $("#ConatntMatter_hdnInitID").val(INITID);
    var RoleID = $("#ConatntMatter_hdnRoleID").val();

    $("#dvloader").show();
    PageMethods.fnGetRejectComments(INITID, RoleID, fnGetRejectComments_pass, fnfailed, flgDBEdit);
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

                            var INITID = $("#ConatntMatter_hdnInitID").val();
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
        $("#tblReport").attr("IsSchemeAppRule", "1");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init'][flgEdit='0']").each(function () {
            if ($(this).attr("BaseProd") == "") {
                $(this).find("td[iden='Init']").eq(9).html("<div style='width: 120px; min-width: 120px; text-align: center;'><a href='#' class='btn btn-danger btn-small' style='cursor: default;'>No Rule Defined</a><div>");
            }
            else {
                $(this).find("td[iden='Init']").eq(9).html("<div style='width: 120px; min-width: 120px; text-align: center;'><a href='#' class='btn btn-primary btn-small' onclick='fnShowApplicationRules(this, 0);'>View Details</a><div>");
            }
        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnAppRuleExpandCollapse']").eq(0).attr("class", "fa fa-minus-square clsExpandCollapse");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnAppRuleExpandCollapse']").eq(0).attr("onclick", "fnCollapseContent(" + cntr + ");");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnAppRuleExpandCollapse']").eq(0).next().html("Initiatives Application Rules");
    }
    else if (cntr == 2) {
        $("#tblReport").attr("IsLocExpand", "1");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init'][flgEdit='0']").each(function () {
            var loc = ExtendContentBody($(this).attr("loc"));
            if ($("#btnInitExpandedCollapseMode").attr("flgCollapse") == "0")
                $(this).find("td[iden='Init']").eq(7).html("<div style='width: 202px; min-width: 202px; font-size:0.6rem;'>" + loc + "</div>");
            else
                $(this).find("td[iden='Init']").eq(7).html("<div style='width: 202px; min-width: 202px;'>" + (loc.length > 70 ? "<span title='" + loc + "' class='clsInform'>" + loc.substring(0, 68) + "..</span>" : loc) + "</div>");

        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).attr("class", "fa fa-minus-square clsExpandCollapse");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).attr("onclick", "fnCollapseContent(" + cntr + ");");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).next().html("Location");
        Tooltip(".clsInform");
    }
    else {
        $("#tblReport").attr("IsChannelExpand", "1");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init'][flgEdit='0']").each(function () {
            var channel = ExtendContentBody($(this).attr("channel"));
            if ($("#btnInitExpandedCollapseMode").attr("flgCollapse") == "0")
                $(this).find("td[iden='Init']").eq(6).html("<div style='width: 202px; min-width: 202px; font-size:0.6rem;'>" + channel + "</div>");
            else
                $(this).find("td[iden='Init']").eq(6).html("<div style='width: 202px; min-width: 202px;'>" + (channel.length > 70 ? "<span title='" + channel + "' class='clsInform'>" + channel.substring(0, 68) + "..</span>" : channel) + "</div>");
        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).attr("class", "fa fa-minus-square clsExpandCollapse");
        $("#tblReport").find("thead").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).attr("onclick", "fnCollapseContent(" + cntr + ");");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).next().html("Channel");
        Tooltip(".clsInform");
    }

    fnAdjustColumnWidth();
    var trArr = $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']");
    for (var i = 0; i < trArr.length; i++) {
        fnAdjustRowHeight(i);
    }
}
function ExtendContentBody(strfull) {
    var str = "";
    for (i = 0; i < strfull.split(",").length; i++) {
        //str += "<span class='clstdExpandedContent'>" + strfull.split(",")[i] + "</span>";
        if (i != 0)
            str += ", ";
        str += strfull.split(",")[i];
    }
    return str;
}
function fnCollapseContent(cntr) {
    if (cntr == 1) {
        $("#tblReport").attr("IsSchemeAppRule", "0");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init'][flgEdit='0']").each(function () {
            $(this).find("td[iden='Init']").eq(9).html("");
        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnAppRuleExpandCollapse']").eq(0).attr("class", "fa fa-buysellads clsExpandCollapse");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnAppRuleExpandCollapse']").eq(0).attr("onclick", "fnExpandContent(" + cntr + ");");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnAppRuleExpandCollapse']").eq(0).next().html("");
    }
    else if (cntr == 2) {
        $("#tblReport").attr("IsLocExpand", "0");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init'][flgEdit='0']").each(function () {
            $(this).find("td[iden='Init']").eq(7).html("");
        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).attr("class", "fa fa-map-marker clsExpandCollapse");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).attr("onclick", "fnExpandContent(" + cntr + ");");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnlocExpandCollapse']").eq(0).next().html("");
    }
    else {
        $("#tblReport").attr("IsChannelExpand", "0");
        $("#tblReport").find("tbody").eq(0).find("tr[iden='Init'][flgEdit='0']").each(function () {
            $(this).find("td[iden='Init']").eq(6).html("");
        });
        $("#tblReport").find("thead").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).attr("class", "fa fa-sitemap clsExpandCollapse");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).attr("onclick", "fnExpandContent(" + cntr + ");");
        $("#tblReport").find("thead ").eq(0).find("i[iden='btnChannelExpandCollapse']").eq(0).next().html("");
    }

    fnAdjustColumnWidth();
    var trArr = $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']");
    for (var i = 0; i < trArr.length; i++) {
        fnAdjustRowHeight(i);
    }
}

function GetNxtMonthToFromDate() {
    var d = new Date();
    var NxtMnth = new Date(d.getFullYear(), d.getMonth() + 2, 0);
    return "01-" + MonthArr[NxtMnth.getMonth()] + "-" + NxtMnth.getFullYear() + "|" + NxtMnth.getDate() + "-" + MonthArr[NxtMnth.getMonth()] + "-" + NxtMnth.getFullYear();
}
function fnSetToFromDate(ctrl) {
    $(ctrl).closest("td[iden='Init']").find("input").eq(0).val($("#ddlMonth").val().split("|")[0]);
    $(ctrl).closest("td[iden='Init']").find("input").eq(1).val($("#ddlMonth").val().split("|")[1]);
}


function fnCOHbasedOnInitType(ctrl) {
    $(ctrl).closest("td").next().find("select").eq(0).val("0");
    if ($(ctrl).val() == "2" || $(ctrl).val() == "3") {
        $(ctrl).closest("td").next().find("select").eq(0).removeAttr("disabled");
        $(ctrl).closest("td").next().find("select").eq(0).val($("#ConatntMatter_hdnCOHType").val().split("^")[1]);
    }
    else
        $(ctrl).closest("td").next().find("select").eq(0).prop("disabled", true);
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
    if ($("#ConatntMatter_hdnBucketType").val() == "1") {
        title = "Product";
        $("#PopupHierlbl").html("Product Hierarchy");
        $("#ProdLvl").html($("#ConatntMatter_hdnProductLvl").val());
    }
    else if ($("#ConatntMatter_hdnBucketType").val() == "2") {
        title = "Site";
        $("#PopupHierlbl").html("Location Hierarchy");
        $("#ProdLvl").html($("#ConatntMatter_hdnLocationLvl").val());
    }
    else {
        title = "Channel";
        $("#PopupHierlbl").html("Channel Hierarchy");
        $("#ProdLvl").html($("#ConatntMatter_hdnChannelLvl").val());
    }

    $("#divHierSelectionTbl").html(GetHierTblFormat($("#ConatntMatter_hdnBucketType").val()));

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
                $("#btnAddNewNode").hide();
                $("#divHierPopup").dialog('destroy');
            },
            buttons: [{
                text: 'Select',
                class: 'btn-primary',
                click: function () {
                    var SelectedHierValues = fnProdSelected().split("||||");
                    $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
                    $(ctrl).attr("ProdHier", SelectedHierValues[1]);
                    $(ctrl).attr("copybuckettd", "0");
                    if ($("#ConatntMatter_hdnSelectedFrmFilter").val() == "1") {
                        $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
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
                $("#btnAddNewNode").hide();
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
                    var SelectedHierValues = fnProdSelected().split("||||");
                    $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
                    $(ctrl).attr("ProdHier", SelectedHierValues[1]);
                    $(ctrl).attr("copybuckettd", "0");
                    if ($("#ConatntMatter_hdnSelectedFrmFilter").val() == "1") {
                        $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
                    }

                    if (cntr == 1) {
                        var rowIndex = $(ctrl).closest("tr[iden='Init']").index();
                        fnAdjustRowHeight(rowIndex);

                        if ($("#ConatntMatter_hdnBucketType").val() == "3") {
                            $(ctrl).closest("tr[iden='Init']").find("td[iden='Init']").eq(16).find("a").eq(0).attr("selectedIds", "");
                        }
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

    if (parseInt(ProdLvl) > 20 && parseInt(ProdLvl) < 50) {
        $("#btnAddNewNode").show();

        $("body").append("<div id='divTemp'>" + $("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").eq(0).find("td").eq(0).html() + "</div>");
        $("#divTemp").find("img").eq(0).remove();
        $("#btnAddNewNode").html("Add New " + $("#divTemp").html());
        $("#divTemp").remove();
    }
    else {
        $("#btnAddNewNode").hide();
    }


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
        PageMethods.fnProdHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "1", BucketValues, fnProdHier_pass, fnProdHier_failed);
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
        title = "Product/s :";
    else if ($("#ConatntMatter_hdnBucketType").val() == "2")
        title = "Site/s :";
    else
        title = "Channel/s :";

    $("#divCopyBucketPopup").dialog({
        "modal": true,
        "width": "92%",
        "height": "560",
        "title": title,
        open: function () {
            $("#divCopyBucketSelectionTbl").html(GetHierTblFormat($("#ConatntMatter_hdnBucketType").val()));
            if ($("#ConatntMatter_hdnBucketType").val() == "1") {
                $("#PopupCopyBucketlbl").html("Product Hierarchy");
            }
            else if ($("#ConatntMatter_hdnBucketType").val() == "2") {
                $("#PopupCopyBucketlbl").html("Location Hierarchy");
            }
            else {
                $("#PopupCopyBucketlbl").html("Channel Hierarchy");
            }


            var LoginID = $("#ConatntMatter_hdnLoginID").val();
            var RoleID = $("#ConatntMatter_hdnRoleID").val();
            var UserID = $("#ConatntMatter_hdnUserID").val();

            var CopyBucketTD = $(ctrl).closest("td[iden='Init']").find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
            PageMethods.GetBucketbasedonType(LoginID, RoleID, UserID, $("#ConatntMatter_hdnBucketType").val(), GetBucketbasedonType_pass, GetBucketbasedonType_failed, CopyBucketTD);
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                var strCopyBucket = fnCopyBucketSelection();

                $(ctrl).closest("div").prev().html(strCopyBucket.split("|||")[1]);
                $(ctrl).closest("td[iden='Init']").find("img[iden='ProductHier']").eq(0).attr("prodlvl", strCopyBucket.split("|||")[3]);
                $(ctrl).closest("td[iden='Init']").find("img[iden='ProductHier']").eq(0).attr("prodhier", strCopyBucket.split("|||")[2]);
                $(ctrl).closest("td[iden='Init']").find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD", strCopyBucket.split("|||")[0]);

                var rowIndex = $(ctrl).closest("tr[iden='Init']").index();
                fnAdjustRowHeight(rowIndex);

                if ($("#ConatntMatter_hdnBucketType").val() == "3") {
                    $(ctrl).closest("tr[iden='Init']").find("td[iden='Init']").eq(16).find("a").eq(0).attr("selectedIds", "");
                }

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
    fnGetSelHierTbl();
}
function fnGetSelHierTbl() {
    var BucketValues = [];
    if ($("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").length > 0)
        $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").each(function () {
            var Selstr = $(this).attr("strvalue");
            for (var i = 0; i < Selstr.split("^").length; i++) {
                BucketValues.push({
                    "col1": Selstr.split("^")[i].split("|")[0],
                    "col2": Selstr.split("^")[i].split("|")[1],
                    "col3": $("#ConatntMatter_hdnBucketType").val()
                });
            }
        });

    if (BucketValues.length > 0) {
        $("#dvloader").show();
        PageMethods.GetSelHierTbl(BucketValues, $("#ConatntMatter_hdnBucketType").val(), "0", GetSelHierTbl_pass, GetSelHierTbl_failed);
    }
    else {
        $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
    }
}
function GetSelHierTbl_pass(res) {
    $("#dvloader").hide();
    $("#divCopyBucketSelectionTbl").html(res);
}
function GetSelHierTbl_failed() {
    $("#dvloader").hide();
    $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("<tr><td colspan='3' style='text-align: center; padding: 50px 10px 0 10px;'>Due to some technical reasons, we are unable to Process your request !</td></tr>");
}

function fnCopyBucketPopupReset() {
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("thead").eq(0).find("input[type='text']").val("");
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");

    $("#divCopyBucketPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").each(function () {
        $(this).attr("flg", "0");
        $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
        $(this).removeClass("Active");
    });

    $("#divCopyBucketSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
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

function fnAppRuleUpdateGrpNo(tbody, lbl) {
    var cntr = 1;
    $(tbody).find("tr").each(function () {
        $(this).find("td").eq(0).html(lbl + " " + cntr);
        cntr++;
    });
}
function fnAppRuleUpdateSlabNo(container) {
    var cntr = 1;
    $(container).find("div.clsAppRuleSubHeader").each(function () {
        $(this).find("span").html("Slab " + cntr);
        cntr++;
    });
}
function fnAppRuleExpandCollapseSlab(ctrl) {
    var flgExpandCollapse = $(ctrl).closest("div.clsAppRuleSubHeader").attr("flgExpandCollapse");
    if (flgExpandCollapse == "1") {
        $(ctrl).closest("div.clsAppRuleSubHeader").attr("flgExpandCollapse", "0");
        $(ctrl).closest("div.clsAppRuleSubHeader").next().hide();
    }
    else {
        $(ctrl).closest("div.clsAppRuleSubHeader").attr("flgExpandCollapse", "1");
        $(ctrl).closest("div.clsAppRuleSubHeader").next().show();
    }
}
function fnAppRuleReomveInitiativetr(ctrl, cntr) {
    var slabno = $(ctrl).closest("tr").attr("slabno");
    var trArr = $(ctrl).closest("tbody").find("tr[slabno='" + slabno + "']");
    if (trArr.length > 1) {
        $(ctrl).closest("tr").remove();
    }
    else {
        var slabblock = "";
        if (cntr == 1) {
            slabblock = $(ctrl).closest("div.clsInitProd").prev();
        }
        else {
            slabblock = $(ctrl).closest("div.clsInitProd").prev().prev();
        }
        var lblSlabNo = slabblock.find("div[iden='AppRuleSlabWiseContainer'][slabno='" + slabno + "']").find("div.clsAppRuleSubHeader").eq(0).find("span").eq(0).html();

        $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Deletion of this row, leads the deletion of <span style='color:#0000ff; font-weight: 700;'>" + lblSlabNo + "</span> in Base Products. Do you want to continue ?</div>");
        $("#divConfirm").dialog({
            "modal": true,
            "width": "300",
            "height": "200",
            "title": "Message :",
            close: function () {
                $("#divConfirm").dialog('destroy');
            },
            buttons: [{
                text: 'Yes',
                class: 'btn-primary',
                click: function () {
                    slabblock.find("div[iden='AppRuleSlabWiseContainer'][slabno='" + slabno + "']").remove();
                    $(ctrl).closest("tr").remove();
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
}



//----
function fnAppRuleShowCopyBucketPopup(ctrl, Callingbyflg) {
    $("#divCopyBucketPopupTbl").html("<div style='margin-top: 25%; text-align: center;'><img alt='Loading...' title='Loading...' src='../../Images/loading.gif' /></div>");
    $("#ConatntMatter_hdnBucketType").val("1");

    var title = "Product/s :";
    $("#divCopyBucketPopup").dialog({
        "modal": true,
        "width": "92%",
        "height": "560",
        "title": title,
        open: function () {
            $("#divCopyBucketSelectionTbl").html(GetHierTblFormat("1"));
            $("#PopupCopyBucketlbl").html("Product Hierarchy");

            var LoginID = $("#ConatntMatter_hdnLoginID").val();
            var RoleID = $("#ConatntMatter_hdnRoleID").val();
            var UserID = $("#ConatntMatter_hdnUserID").val();

            var CopyBucketTD = $(ctrl).closest("td").find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD");
            PageMethods.GetBucketbasedonType(LoginID, RoleID, UserID, $("#ConatntMatter_hdnBucketType").val(), GetBucketbasedonType_pass, GetBucketbasedonType_failed, CopyBucketTD);
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                var strCopyBucket = fnCopyBucketSelection();

                $(ctrl).closest("div").prev().html(strCopyBucket.split("|||")[1]);
                $(ctrl).closest("td").find("img[iden='ProductHier']").eq(0).attr("prodlvl", strCopyBucket.split("|||")[3]);
                $(ctrl).closest("td").find("img[iden='ProductHier']").eq(0).attr("prodhier", strCopyBucket.split("|||")[2]);
                $(ctrl).closest("td").find("img[iden='ProductHier']").eq(0).attr("CopyBucketTD", strCopyBucket.split("|||")[0]);

                fnUpdateInitProdSel(ctrl, Callingbyflg);
                fnUpdateOtherSlabAndInitProdSel(ctrl, Callingbyflg, strCopyBucket.split("|||")[0] + "||||" + strCopyBucket.split("|||")[3] + "||||" + strCopyBucket.split("|||")[2] + "||||" + strCopyBucket.split("|||")[1]);

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

function fnSelectUnSelectSBF(ctrl) {
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
}

function fnAppRuleShowProdHierPopup(ctrl, cntr, Callingbyflg) {
    $("#ConatntMatter_hdnSelectedFrmFilter").val("1");
    $("#divHierPopupTbl").html("<div style='font-size: 0.9rem; font-weight: 600; margin-top: 25%; text-align: center;'>Please Select the Level from Left</div>");
    $("#ConatntMatter_hdnBucketType").val("1");

    var title = "Product";
    $("#divHierSelectionTbl").html(GetHierTblFormat("1"));

    $("#PopupHierlbl").html("Product Hierarchy");
    $("#ProdLvl").html($("#ConatntMatter_hdnProductLvl").val());

    if (Callingbyflg == "1") {
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
                $("#btnAddNewNode").hide();
                $("#divHierPopup").dialog('destroy');
            },
            buttons: [{
                text: 'Submit',
                class: 'btn-primary',
                click: function () {
                    var rowIndex = $(ctrl).closest("tr[iden='Init']").index();
                    var SelectedHierValues = fnProdSelected().split("||||");
                    if (cntr == 1) {
                        $(ctrl).attr("copybuckettd", "0");
                        $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
                        $(ctrl).attr("ProdHier", SelectedHierValues[1]);
                        if (SelectedHierValues[2] != "") {
                            $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
                            fnUpdateInitProdSel(ctrl, Callingbyflg);

                            fnUpdateOtherSlabAndInitProdSel(ctrl, Callingbyflg, "0||||" + SelectedHierValues[0] + "||||" + SelectedHierValues[1] + "||||" + SelectedHierValues[2]);
                        }
                        else {
                            $(ctrl).closest("div").prev().html("Select Products Applicable in Group");
                        }
                    }
                    else {
                        $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
                        $(ctrl).attr("ProdHier", SelectedHierValues[1]);
                        if (SelectedHierValues[2] != "") {
                            $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
                        }
                        else {
                            $(ctrl).closest("div").prev().html("Select Products");
                        }
                    }
                    fnAdjustRowHeight(rowIndex);
                    $("#divHierPopup").dialog('close');
                }
            },
            {
                text: 'Reset',
                class: 'btn-primary',
                click: function () {
                    fnHierPopupReset();
                }
            },
            {
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
                $("#btnAddNewNode").hide();
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
                                        fnSaveNewBucket(ctrl, cntr);
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
                    var rowIndex = $(ctrl).closest("tr[iden='Init']").index();
                    var SelectedHierValues = fnProdSelected().split("||||");
                    if (cntr == 1) {
                        $(ctrl).attr("copybuckettd", "0");
                        $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
                        $(ctrl).attr("ProdHier", SelectedHierValues[1]);
                        if (SelectedHierValues[2] != "") {
                            $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
                            fnUpdateInitProdSel(ctrl, Callingbyflg);

                            fnUpdateOtherSlabAndInitProdSel(ctrl, Callingbyflg, "0||||" + SelectedHierValues[0] + "||||" + SelectedHierValues[1] + "||||" + SelectedHierValues[2]);
                        }
                        else {
                            $(ctrl).closest("div").prev().html("Select Products Applicable in Group");
                        }
                    }
                    else {
                        $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
                        $(ctrl).attr("ProdHier", SelectedHierValues[1]);
                        if (SelectedHierValues[2] != "") {
                            $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
                        }
                        else {
                            $(ctrl).closest("div").prev().html("Select Products");
                        }
                    }
                    fnAdjustRowHeight(rowIndex);
                    $("#divHierPopup").dialog('close');
                }
            },
            {
                text: 'Reset',
                class: 'btn-primary',
                click: function () {
                    fnHierPopupReset();
                }
            },
            {
                text: 'Cancel',
                class: 'btn-primary',
                click: function () {
                    $("#divHierPopup").dialog('close');
                }
            }]
        });
    }
}

function fnUpdateInitProdSel(ctrl, Callingbyflg) {
    var SelectedHier = "", prodlvl = 10, descr = "", rowIndex = "0";
    var slabNo = $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").eq(0).attr("slabno");


    var SelectionArr = [];
    $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").find("img[iden='ProductHier']").each(function () {
        if ($(this).attr("prodhier") != "") {
            var tempArr = $(this).attr("prodhier").split("^");
            for (var i = 0; i < tempArr.length; i++) {
                if (SelectionArr.indexOf(tempArr[i]) == -1) {
                    SelectionArr.push(tempArr[i]);
                    SelectedHier += "^" + tempArr[i];
                    descr += ", " + $(this).closest("div").prev().html().split(", ")[i];
                }
            }
        }
    });
    if (SelectedHier != "") {
        SelectedHier = SelectedHier.substring(1);
        descr = descr.substring(2);
        for (var i = 0; i < SelectedHier.split("^").length; i++) {
            if (parseInt(SelectedHier.split("^")[i].split("|")[1]) > prodlvl) {
                prodlvl = parseInt(SelectedHier.split("^")[i].split("|")[1]);
            }
        }
    }

    if (Callingbyflg == 1) {
        rowIndex = $(ctrl).closest("tr[iden='Init']").index();

        $(ctrl).closest("div.clsBaseProd").next().find("tr[slabno='" + slabNo + "']").each(function () {
            $(this).find("img[iden='ProductHier']").attr("prodhier", SelectedHier);
            $(this).find("img[iden='ProductHier']").closest("div").prev().html(descr);
            $(this).find("img[iden='ProductHier']").attr("prodlvl", prodlvl);
        });
        fnAdjustRowHeight(rowIndex);
    }
    else {
        $(ctrl).closest("div.clsBaseProd").next().next().find("tr[slabno='" + slabNo + "']").each(function () {
            $(this).find("img[iden='ProductHier']").attr("prodhier", SelectedHier);
            $(this).find("img[iden='ProductHier']").closest("div").prev().html(descr);
            $(this).find("img[iden='ProductHier']").attr("prodlvl", prodlvl);
        });
    }
}

function fnUpdateOtherSlabAndInitProdSel(ctrl, Callingbyflg, SelectedHierValues) {
    var grpno = $(ctrl).closest("tr").index();   // $(ctrl).closest("tr").attr("grpno");
    var slabno = $(ctrl).closest("tr").closest("div").attr("slabno");
    var SelectedHierValuesArr = SelectedHierValues.split("||||");

    $("#divAppRuleBaseProdSec").find("div[iden='AppRuleSlabWiseContainer']").each(function () {
        if ($(this).attr("slabno") != slabno) {
            if ($(this).find("table").eq(0).find("tbody").eq(0).find("tr").length >= (grpno + 1)) {
                var btnProdSel = $(this).find("table").eq(0).find("tbody").eq(0).find("tr").eq(grpno).find("img[iden='ProductHier']").eq(0);

                $(btnProdSel).attr("copybuckettd", SelectedHierValuesArr[0]);
                $(btnProdSel).attr("ProdLvl", SelectedHierValuesArr[1]);
                $(btnProdSel).attr("ProdHier", SelectedHierValuesArr[2]);
                $(btnProdSel).closest("div").prev().html(SelectedHierValuesArr[3]);

                fnUpdateInitProdSel(btnProdSel, Callingbyflg);
            }
        }
    });
}

//------ Popup
function fnActivateSlab(ctrl, cntr) {
    var slabno = $(ctrl).attr("slabno");

    if (cntr == 1) {
        $(ctrl).addClass("slab-active").siblings().removeClass("slab-active");

        $("#divAppRuleBenefitSec").find("tbody").eq(0).find("tr").removeClass("slab-active");
        $("#divAppRuleBenefitSec").find("tbody").eq(0).find("tr[slabno='" + slabno + "']").addClass("slab-active");
    }
    else {
        $(ctrl).closest("tbody").find("tr").removeClass("slab-active");
        $(ctrl).closest("tbody").find("tr[slabno='" + slabno + "']").addClass("slab-active");

        $("#divAppRuleBaseProdSec").find("div[iden='AppRuleSlabWiseContainer'][slabno='" + slabno + "']").eq(0).addClass("slab-active").siblings().removeClass("slab-active")
    }
}

function fnConditionChkDropdown(ctrl) {
    var Inittype = $(ctrl).val();
    if ($("#divApplicationRulePopup").attr("flgMixedCases") == "1") {
        fnUOMbasedonType(ctrl);
    }
    else {
        $(ctrl).closest("tbody").find("tr").each(function () {
            var ddl = $(this).find("select[iden='condition']").eq(0);

            ddl.val(Inittype);
            fnUOMbasedonType(ddl);
        });
    }
}
function fnUOMbasedonType(ctrl) {
    var Inittype = $(ctrl).val();
    switch (Inittype) {
        case "0":
            $(ctrl).closest("tr").find("input[type='text'][iden='min']").eq(0).val("0");
            $(ctrl).closest("tr").find("input[type='text'][iden='max']").eq(0).val("0");
            $(ctrl).closest("tr").find("select[iden='uom']").eq(0).val("0");
            break;
        case "1":
            var UOM = $(ctrl).closest("select").find("option[value='" + Inittype + "']").attr("uom");

            $(ctrl).closest("tr").find("input[type='text'][iden='min']").eq(0).val("0");
            $(ctrl).closest("tr").find("input[type='text'][iden='max']").eq(0).val("9999999.99");
            $(ctrl).closest("tr").find("select[iden='uom']").eq(0).val(UOM);
            break;
        default:
            var UOM = $(ctrl).closest("select").find("option[value='" + Inittype + "']").attr("uom");

            $(ctrl).closest("tr").find("input[type='text'][iden='min']").eq(0).val("0");
            $(ctrl).closest("tr").find("input[type='text'][iden='max']").eq(0).val("9999999");
            $(ctrl).closest("tr").find("select[iden='uom']").eq(0).val(UOM);
            break;
    }
}

function fnInitiativeTypeDropdown(ctrl) {
    var InitiativeType = $(ctrl).val();
    var slabno = $(ctrl).closest("tr").attr("slabno");

    if ($("#divApplicationRulePopup").attr("flgMixedCases") == "0") {
        $(ctrl).closest("tbody").find("tr[slabno='" + slabno + "']").each(function () {
            $(this).find("select[iden='inittype']").eq(0).val(InitiativeType);
        });
    }
}
function fnAppliedOnDropdown(ctrl) {
    var AppliedOn = $(ctrl).val();
    var slabno = $(ctrl).closest("tr").attr("slabno");

    if ($("#divApplicationRulePopup").attr("flgMixedCases") == "0") {
        $(ctrl).closest("tbody").find("tr[slabno='" + slabno + "']").each(function () {
            $(this).find("select[iden='initappliedon']").eq(0).val(AppliedOn);
        });
    }
}

function fnAppRuleAddNewSlab(slabno, IsNewSlab) {
    var str = "";
    str += "<div iden='AppRuleSlabWiseContainer' slabno='" + slabno + "' IsNewSlab='" + IsNewSlab + "' onclick='fnActivateSlab(this, 1);'>";
    str += "<div class='clsAppRuleSubHeader' flgExpandCollapse='1' style='margin-top: 5px;'><span onclick='fnAppRuleExpandCollapseSlab(this);' style='cursor: pointer; width: 88%;'></span><i class='fa fa-minus-square' onclick='fnAppRuleRemoveSlab(this);' style='font-size: 1rem;'></i><i class='fa fa-plus-square' onclick='fnAppRuleAddNewSlabbtnAction(this);' style='font-size: 1rem;'></i></div>";
    str += "<table class='table table-bordered table-sm' style='margin-bottom: 0;'><thead><tr><th style='width: 80px; text-align: center;'>#</th><th style='text-align: center;'>Product</th><th style='width: 100px; text-align: center;'>Condition Check</th><th style='width: 100px; text-align: center;'>Minimum</th><th style='width: 100px; text-align: center;'>Maximum</th><th style='width: 100px; text-align: center;'>UOM</th><th iden='Action' style='width: 80px; text-align: center;'>Action</th></tr></thead><tbody>";
    str += "<tr grpno='1' IsNewGrp='1'>";
    str += "<td style='text-align: center; font-weight: 700;'>Group 1</td>";
    str += "<td><div style='position: relative; box-sizing: border-box;'><div iden='content' style='width: 100%; padding-right: 50px;'>Select Products Applicable in Group</div><div style='position: absolute; right:5px; top:-3px;'><img src='../../Images/favBucket.png' title='Favourite Bucket' onclick='fnAppRuleShowCopyBucketPopup(this, 2);'/><img src='../../Images/edit.png' title='Define New Selection' iden='ProductHier' copybuckettd='0' prodlvl='' prodhier='' onclick='fnAppRuleShowProdHierPopup(this, 1, 2);' style='margin-left:5px;'/></div></div></td>";
    str += "<td><select iden='condition' style='padding: 2px;' onchange='fnConditionChkDropdown(this);'>" + $("#ConatntMatter_hdnUnitType").val() + "</select></td>";
    str += "<td><input iden='min' type='text'/></td>";
    str += "<td><input iden='max' type='text'/></td>";
    str += "<td><select iden='uom' style='padding: 2px;' disabled>" + $("#ConatntMatter_hdnUOM").val() + "</select></td>";
    str += "<td iden='Action' style='text-align: center;'><i class='fa fa-plus clsExpandCollapse' onclick='fnAppRuleAddNewBasetr(this);'></i><i class='fa fa-minus clsExpandCollapse' onclick='fnAppRuleRemoveBasetr(this);'></i></td>";
    str += "</tr>";
    str += "</tbody></table>";
    str += "</div>";

    var container = $("#divAppRuleBaseProdSec");
    container.append(str);
    fnAppRuleUpdateSlabNo(container);
}
function fnAppRuleAddNewInitiativetr(slabno) {
    var str = "<tr slabno='" + slabno + "' grpno='1' IsNewSlab='1' IsNewGrp='1' onclick='fnActivateSlab(this, 2);'>";
    str += "<td><div style='position: relative; box-sizing: border-box;'><div iden='content' style='width: 100%; padding-right: 30px;'>Select Products</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/edit.png' title='Define New Selection' iden='ProductHier' copybuckettd='0' prodlvl='' prodhier='' onclick='fnAppRuleShowProdHierPopup(this, 2, 2);'/></div></div></td>";
    str += "<td><select iden='inittype' style='padding: 2px;' onchange='fnInitiativeTypeDropdown(this);'>" + $("#ConatntMatter_hdnBenefit").val() + "</select></td>";
    str += "<td><select iden='initappliedon' style='padding: 2px;' onchange='fnAppliedOnDropdown(this);'>" + $("#ConatntMatter_hdnAppliedOn").val() + "</select></td>";
    str += "<td><input iden='initvalue' type='text' value='0'/></td>";
    str += "<td iden='Action' style='text-align: center;'><i class='fa fa-plus clsExpandCollapse' onclick='fnAppRuleAddNewInitiativetrbtnAction(this);'></i><i class='fa fa-minus clsExpandCollapse' onclick='fnAppRuleReomveInitiativetr(this, 2);'></i></td>";
    str += "</tr>";
    $("#divAppRuleBenefitSec").find("tbody").eq(0).append(str);
}


function fnMixedCases(ctrl) {
    $(ctrl).closest("td").next().find("a").attr("base", "");
    $(ctrl).closest("td").next().find("a").attr("init", "");
}

function fnAppRuleAddNewforMixedCases() {
    var lstBaseGrpNo = 0, lstInitGrpNo = 0;
    if ($("#divAppRuleMixedCases").find("tbody").eq(0).find("tr").length > 0) {
        $("#divAppRuleMixedCases").find("tbody").eq(0).find("tr").each(function () {
            if (parseInt($(this).attr("basegrpno")) > lstBaseGrpNo) {
                lstBaseGrpNo = parseInt($(this).attr("basegrpno"));
            }

            if (parseInt($(this).attr("initgrpno")) > lstInitGrpNo) {
                lstInitGrpNo = parseInt($(this).attr("initgrpno"));
            }
        });
    }

    var str = "<tr slabno='1' basegrpno='" + (parseInt(lstBaseGrpNo) + 1) + "' initgrpno='" + (parseInt(lstInitGrpNo) + 1) + "' IsNewSlab='1' IsNewGrp='1' onclick='fnActivateSlab(this, 2);'>";
    str += "<td><div style='position: relative; box-sizing: border-box;'><div iden='content' style='width: 100%; padding-right: 30px;'>Select Products</div><div style='position: absolute; right:5px; top:0px;'><img src='../../Images/edit.png' title='Define New Selection' iden='ProductHier' copybuckettd='0' prodlvl='' prodhier='' onclick='fnShowPopupHierAtSpecificlvl(this, 40);'/></div></div></td>";
    str += "<td><select iden='condition' style='padding: 2px;' onchange='fnConditionChkDropdown(this);'>" + $("#ConatntMatter_hdnUnitType").val() + "</select></td>";
    str += "<td><input iden='min' type='text'/></td>";
    str += "<td><input iden='max' type='text'/></td>";
    str += "<td><select iden='uom' style='padding: 2px;' disabled>" + $("#ConatntMatter_hdnUOM").val() + "</select></td>";
    str += "<td><select iden='inittype' style='padding: 2px;' onchange='fnInitiativeTypeDropdown(this);'>" + $("#ConatntMatter_hdnBenefit").val() + "</select></td>";
    str += "<td><select iden='initappliedon' style='padding: 2px;' onchange='fnAppliedOnDropdown(this);'>" + $("#ConatntMatter_hdnAppliedOn").val() + "</select></td>";
    str += "<td><input iden='initvalue' type='text' value='0'/></td>";
    str += "<td iden='Action' style='text-align: center;'><i class='fa fa-plus clsExpandCollapse' onclick='fnAppRuleAddNewforMixedCases();'></i><i class='fa fa-minus clsExpandCollapse' onclick='fnAppRuleReomveInitiativetr(this, 2);'></i></td>";
    str += "</tr>";

    $("#divAppRuleMixedCases").find("tbody").eq(0).append(str);
}

function fncallength(ctrl, cntr) {
    if (cntr == 1)
        $("#lbltxtChannelSummarylength").html($(ctrl).val().length + "/100");
    else
        $("#lbltxtChannelSummarylengthPopup").html($(ctrl).val().length + "/100");
}
function fnShowApplicationRules(ctrl, flgEdit) {
    var IsMixed = false;
    if (flgEdit == 0) {
        if ($(ctrl).closest("tr[iden='Init']").attr("MixedCases") == "1")
            IsMixed = true;
        else
            IsMixed = false;
    }
    else {
        IsMixed = $(ctrl).closest("td").prev().find("input[type='checkbox']").eq(0).is(":checked");
    }


    $("#divAppRuleBaseProdSec").html("");
    $("#divAppRuleBenefitSec").find("tbody").eq(0).html("");
    $("#divAppRuleMixedCases").find("tbody").eq(0).html("");

    $("#divAppRuleBaseProdSec").parent().hide();
    $("#divAppRuleBenefitSec").parent().hide();
    $("#divAppRuleMixedCases").parent().hide();

    if (IsMixed) {
        $("#divAppRuleMixedCases").parent().show();
        $("#divApplicationRulePopup").attr("flgMixedCases", "1");

        fnShowApplicationRulesPopup(ctrl, flgEdit);
    }
    else {
        $("#divAppRuleBaseProdSec").parent().show();
        $("#divAppRuleBenefitSec").parent().show();
        $("#divApplicationRulePopup").attr("flgMixedCases", "0");

        fnShowApplicationRulesPopupWithoutMixedCases(ctrl, flgEdit);
    }
}
function fnShowApplicationRulesPopup(ctrl, flgEdit) {
    if (flgEdit == 0) {
        $("#divApplicationRulePopup").dialog({
            "modal": true,
            "width": "96%",
            "height": "540",
            "title": "Initiatives Application Rules",
            close: function () {
                $("#divApplicationRulePopup").dialog('destroy');
            }
        });
    }
    else {
        $("#divApplicationRulePopup").dialog({
            "modal": true,
            "width": "96%",
            "height": "540",
            "title": "Initiatives Application Rules",
            open: function () {
                //
            },
            close: function () {
                $("#divApplicationRulePopup").dialog('destroy');
            },
            buttons: [{
                text: 'Submit',
                class: 'btn-primary',
                click: function () {
                    if (fnValidateAppRule()) {
                        if ($("#txtArChannelSummaryDescription").val() == "") {
                            AutoHideAlertMsg("Kindly retrivie or enter the Channel Summary Description !");
                        }
                        else {
                            var strAppRule = GenerateAppRuleScript();
                            $(ctrl).attr("base", strAppRule.split("|||")[0]);
                            $(ctrl).attr("init", strAppRule.split("|||")[1]);
                            $(ctrl).closest("tr[iden='Init']").attr("ApplicableNewPer", $("#txtApplicablePer").val());
                            $(ctrl).closest("tr[iden='Init']").find("td[iden='Init']").eq(5).find("textarea").eq(0).val($("#txtArChannelSummaryDescription").val());
                            $("#lbltxtChannelSummarylength").html($("#txtArChannelSummaryDescription").val().length + "/100");

                            $("#divApplicationRulePopup").dialog('close');
                        }
                    }
                }
            },
            {
                text: 'Cancel',
                class: 'btn-primary',
                click: function () {
                    $("#divApplicationRulePopup").dialog('close');
                }
            }]
        });
    }

    
    var rowIndex = $(ctrl).closest("tr[iden='Init']").index();
    var INITDescription = "", ChannelSummaryDescription = "", Applicablity = "";

    if (flgEdit == 0) {
        INITDescription = $(ctrl).closest("tr[iden='Init']").attr("Descr");
        ChannelSummaryDescription = $(ctrl).closest("tr[iden='Init']").attr("ChannelSummaryDescr");
        Applicablity = $(ctrl).closest("tr[iden='Init']").attr("ApplicablePer");
    }
    else {
        INITDescription = $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).find("td").eq(4).find("textarea").eq(0).val();
        ChannelSummaryDescription = $(ctrl).closest("tr[iden='Init']").find("td").eq(5).find("textarea").eq(0).val();
        Applicablity = $(ctrl).closest("tr[iden='Init']").attr("ApplicableNewPer");
    }

    $("#txtArINITDescription").val(INITDescription);
    $("#txtArChannelSummaryDescription").val(ChannelSummaryDescription);
    $("#lbltxtChannelSummarylengthPopup").html(ChannelSummaryDescription.length + "/100");
    $("#txtApplicablePer").val(Applicablity);

    // ---------------------------------------------------------------------------------------------------------------------------- //

    $("#divAppRuleMixedCases").find("tbody").eq(0).html("");

    var strBase = "", strInit = "";
    if (flgEdit == 0) {
        strInit = $(ctrl).closest("tr[iden='Init']").attr("InitProd");
        strBase = $(ctrl).closest("tr[iden='Init']").attr("BaseProd");
    }
    else {
        strInit = $(ctrl).attr("init");
        strBase = $(ctrl).attr("base");
    }

    fnAppRuleAddNewforMixedCases("1");
    if (strInit != "") {
        var ArrGrp = strInit.split("***");
        for (i = 1; i < ArrGrp.length; i++) {
            if (i > 1)
                fnAppRuleAddNewforMixedCases("1");

            var active_grp_tr = $("#divAppRuleMixedCases").find("table").eq(0).find("tbody").eq(0).find("tr:last");
            active_grp_tr.attr("IsNewGrp", "0");
            active_grp_tr.attr("IsNewSlab", "0");
            active_grp_tr.attr("slabno", ArrGrp[i].split("*$*")[3]);
            active_grp_tr.attr("initgrpno", ArrGrp[i].split("*$*")[5]);
            active_grp_tr.attr("basegrpno", ArrGrp[i].split("*$*")[9]);
            active_grp_tr.find("td").eq(5).find("select").eq(0).val(ArrGrp[i].split("*$*")[0]);
            active_grp_tr.find("td").eq(6).find("select").eq(0).val(ArrGrp[i].split("*$*")[1]);
            active_grp_tr.find("td").eq(7).find("input[type='text']").eq(0).val(ArrGrp[i].split("*$*")[2]);

            var prod = "", prodlvl = 0, prodhier = "";
            var ArrPrd = ArrGrp[i].split("*$*")[4].split("^");
            for (k = 0; k < ArrPrd.length; k++) {
                if (parseInt(ArrPrd[k].split("|")[1]) > prodlvl)
                    prodlvl = parseInt(ArrPrd[k].split("|")[1]);

                if (k > 0) {
                    prodhier += "^";
                    prod += ", ";
                }
                prodhier += ArrPrd[k].split("|")[0] + "|" + ArrPrd[k].split("|")[1] + "|" + ArrPrd[k].split("|")[2];
                prod += ArrPrd[k].split("|")[2];
            }
            active_grp_tr.find("td").eq(0).find("div[iden='content']").eq(0).html(prod);
            active_grp_tr.find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("copybuckettd", ArrGrp[i].split("*$*")[6]);
            active_grp_tr.find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("prodlvl", prodlvl);
            active_grp_tr.find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("prodhier", prodhier);
        }
    }
    if (strBase != "") {
        var ArrSlab = strBase.split("$$$");
        for (i = 1; i < ArrSlab.length; i++) {
            var ArrGrp = ArrSlab[i].split("***");
            for (j = 1; j < ArrGrp.length; j++) {
                var active_grp = $("#divAppRuleMixedCases").find("table").eq(0).find("tbody").eq(0).find("tr[slabno='" + ArrGrp[0] + "'][basegrpno='" + ArrGrp[j].split("*$*")[5] + "']");

                active_grp.find("td").eq(1).find("select").eq(0).val(ArrGrp[j].split("*$*")[0]);
                active_grp.find("td").eq(2).find("input[type='text']").eq(0).val(ArrGrp[j].split("*$*")[1]);
                active_grp.find("td").eq(3).find("input[type='text']").eq(0).val(ArrGrp[j].split("*$*")[2]);
                active_grp.find("td").eq(4).find("select").eq(0).val(ArrGrp[j].split("*$*")[3]);
            }
        }
    }

    // ---------------------------------------------------------------------------------------------------------------------------- //

    if (flgEdit == 0) {
        $("#divApplicationRulePopup").find("i").remove();
        $("#divApplicationRulePopup").find("img").remove();
        $("#divApplicationRulePopup").find("th[iden='Action']").hide();
        $("#divApplicationRulePopup").find("td[iden='Action']").hide();
        $("#btnArChannelSummaryDescriptionSuggestion").hide();
        $("#txtArChannelSummaryDescription").prop("disabled", true);
        $("#divApplicationRulePopup").find("input").prop("disabled", true);
        $("#divApplicationRulePopup").find("select").prop("disabled", true);
    }
    else {
        $("#txtApplicablePer").prop("disabled", false);
        $("#btnArChannelSummaryDescriptionSuggestion").show();
        $("#txtArChannelSummaryDescription").prop("disabled", false);
        $("#divApplicationRulePopup").find("th[iden='Action']").show();
        $("#divApplicationRulePopup").find("td[iden='Action']").show();
    }
}
function fnShowApplicationRulesPopupWithoutMixedCases(ctrl, flgEdit) {
    if (flgEdit == 0) {
        $("#divApplicationRulePopup").dialog({
            "modal": true,
            "width": "70%",
            "height": "540",
            "title": "Initiatives Application Rules",
            close: function () {
                $("#divApplicationRulePopup").dialog('destroy');
            }
        });
    }
    else {
        $("#divApplicationRulePopup").dialog({
            "modal": true,
            "width": "70%",
            "height": "540",
            "title": "Initiatives Application Rules",
            open: function () {
                //
            },
            close: function () {
                $("#divApplicationRulePopup").dialog('destroy');
            },
            buttons: [{
                text: 'Submit',
                class: 'btn-primary',
                click: function () {
                    if (fnValidateAppRule()) {
                        if ($("#txtArChannelSummaryDescription").val() == "") {
                            AutoHideAlertMsg("Kindly retrivie or enter the Channel Summary Description !");
                        }
                        else {
                            var strAppRule = GenerateAppRuleScript();
                            $(ctrl).attr("base", strAppRule.split("|||")[0]);
                            $(ctrl).attr("init", strAppRule.split("|||")[1]);
                            $(ctrl).closest("tr[iden='Init']").attr("ApplicableNewPer", $("#txtApplicablePer").val());
                            $(ctrl).closest("tr[iden='Init']").find("td[iden='Init']").eq(5).find("textarea").eq(0).val($("#txtArChannelSummaryDescription").val());
                            $("#lbltxtChannelSummarylength").html($("#txtArChannelSummaryDescription").val().length + "/100");

                            $("#divApplicationRulePopup").dialog('close');
                        }
                    }
                }
            },
            {
                text: 'Cancel',
                class: 'btn-primary',
                click: function () {
                    $("#divApplicationRulePopup").dialog('close');
                }
            }]
        });
    }


    var rowIndex = $(ctrl).closest("tr[iden='Init']").index();
    var INITDescription = "", ChannelSummaryDescription = "", Applicablity = "";

    if (flgEdit == 0) {
        INITDescription = $(ctrl).closest("tr[iden='Init']").attr("Descr");
        ChannelSummaryDescription = $(ctrl).closest("tr[iden='Init']").attr("ChannelSummaryDescr");
        Applicablity = $(ctrl).closest("tr[iden='Init']").attr("ApplicablePer");
    }
    else {
        INITDescription = $("#tblleftfixed").find("tbody").eq(0).find("tr").eq(rowIndex).find("td").eq(4).find("textarea").eq(0).val();
        ChannelSummaryDescription = $(ctrl).closest("tr[iden='Init']").find("td").eq(5).find("textarea").eq(0).val();
        Applicablity = $(ctrl).closest("tr[iden='Init']").attr("ApplicableNewPer");
    }

    $("#txtArINITDescription").val(INITDescription);
    $("#txtArChannelSummaryDescription").val(ChannelSummaryDescription);
    $("#lbltxtChannelSummarylengthPopup").html(ChannelSummaryDescription.length + "/100");
    $("#txtApplicablePer").val(Applicablity);

    // ---------------------------------------------------------------------------------------------------------------------------- //

    $("#divAppRuleBaseProdSec").html("");

    var strBase = "";
    if (flgEdit == 0) {
        strBase = $(ctrl).closest("tr[iden='Init']").attr("BaseProd");
    }
    else {
        strBase = $(ctrl).attr("base");
    }

    fnAppRuleAddNewSlab("1", "1");
    if (strBase != "") {
        var ArrSlab = strBase.split("$$$");
        for (i = 1; i < ArrSlab.length; i++) {
            if (i > 1)
                fnAppRuleAddNewSlab("1", "1");

            var active_slab = $("#divAppRuleBaseProdSec").find("div[iden='AppRuleSlabWiseContainer']:last");
            active_slab.attr("slabno", ArrSlab[i].split("***")[0]);
            active_slab.attr("IsNewSlab", "0");
            active_slab.find("div.clsAppRuleSubHeader").eq(0).find("span").eq(0).html("Slab " + i);

            var ArrGrp = ArrSlab[i].split("***");
            for (j = 1; j < ArrGrp.length; j++) {
                if (j > 1)
                    fnAppRuleAddNewBasetr(active_slab.find("table").eq(0).find("tbody").eq(0).find("tr").eq(0));

                var active_grp = active_slab.find("table").eq(0).find("tbody").eq(0).find("tr:last");
                active_grp.attr("grpno", ArrGrp[j].split("*$*")[5]);
                active_grp.attr("IsNewGrp", "0");
                active_grp.find("td").eq(0).html("Group " + j);
                active_grp.find("td").eq(2).find("select").eq(0).val(ArrGrp[j].split("*$*")[0]);
                active_grp.find("td").eq(3).find("input[type='text']").eq(0).val(ArrGrp[j].split("*$*")[1]);
                active_grp.find("td").eq(4).find("input[type='text']").eq(0).val(ArrGrp[j].split("*$*")[2]);
                active_grp.find("td").eq(5).find("select").eq(0).val(ArrGrp[j].split("*$*")[3]);

                var prod = "", prodlvl = 0, prodhier = "";
                var ArrPrd = ArrGrp[j].split("*$*")[4].split("^");
                for (k = 0; k < ArrPrd.length; k++) {
                    if (parseInt(ArrPrd[k].split("|")[1]) > prodlvl)
                        prodlvl = parseInt(ArrPrd[k].split("|")[1]);

                    if (k > 0) {
                        prodhier += "^";
                        prod += ", ";
                    }
                    prodhier += ArrPrd[k].split("|")[0] + "|" + ArrPrd[k].split("|")[1] + "|" + ArrPrd[k].split("|")[2];
                    prod += ArrPrd[k].split("|")[2];
                }
                active_grp.find("td").eq(1).find("div[iden='content']").eq(0).html(prod);
                active_grp.find("td").eq(1).find("img[iden='ProductHier']").eq(0).attr("copybuckettd", ArrGrp[j].split("*$*")[6]);
                active_grp.find("td").eq(1).find("img[iden='ProductHier']").eq(0).attr("prodlvl", prodlvl);
                active_grp.find("td").eq(1).find("img[iden='ProductHier']").eq(0).attr("prodhier", prodhier);
            }
        }
    }


    // ---------------------------------------------------------------------------------------------------------------------------- //

    $("#divAppRuleBenefitSec").find("tbody").eq(0).html("");

    var strInit = "";
    if (flgEdit == 0) {
        strInit = $(ctrl).closest("tr[iden='Init']").attr("InitProd");
    }
    else {
        strInit = $(ctrl).attr("init");
    }

    fnAppRuleAddNewInitiativetr("1");
    if (strInit != "") {
        var ArrGrp = strInit.split("***");
        for (i = 1; i < ArrGrp.length; i++) {
            if (i > 1)
                fnAppRuleAddNewInitiativetr("1");

            var active_grp_tr = $("#divAppRuleBenefitSec").find("table").eq(0).find("tbody").eq(0).find("tr:last");
            active_grp_tr.attr("IsNewGrp", "0");
            active_grp_tr.attr("IsNewSlab", "0");
            active_grp_tr.attr("slabno", ArrGrp[i].split("*$*")[3]);
            active_grp_tr.attr("grpno", ArrGrp[i].split("*$*")[5]);
            active_grp_tr.find("td").eq(1).find("select").eq(0).val(ArrGrp[i].split("*$*")[0]);
            active_grp_tr.find("td").eq(2).find("select").eq(0).val(ArrGrp[i].split("*$*")[1]);
            active_grp_tr.find("td").eq(3).find("input[type='text']").eq(0).val(ArrGrp[i].split("*$*")[2]);

            var prod = "", prodlvl = 0, prodhier = "";
            var ArrPrd = ArrGrp[i].split("*$*")[4].split("^");
            for (k = 0; k < ArrPrd.length; k++) {
                if (parseInt(ArrPrd[k].split("|")[1]) > prodlvl)
                    prodlvl = parseInt(ArrPrd[k].split("|")[1]);

                if (k > 0) {
                    prodhier += "^";
                    prod += ", ";
                }
                prodhier += ArrPrd[k].split("|")[0] + "|" + ArrPrd[k].split("|")[1] + "|" + ArrPrd[k].split("|")[2];
                prod += ArrPrd[k].split("|")[2];
            }
            active_grp_tr.find("td").eq(0).find("div[iden='content']").eq(0).html(prod);
            active_grp_tr.find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("copybuckettd", ArrGrp[i].split("*$*")[6]);
            active_grp_tr.find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("prodlvl", prodlvl);
            active_grp_tr.find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("prodhier", prodhier);
        }

    }

    // ---------------------------------------------------------------------------------------------------------------------------- //

    if (flgEdit == 0) {
        $("#divApplicationRulePopup").find("i").remove();
        $("#divApplicationRulePopup").find("img").remove();
        $("#divApplicationRulePopup").find("th[iden='Action']").hide();
        $("#divApplicationRulePopup").find("td[iden='Action']").hide();
        $("#btnArChannelSummaryDescriptionSuggestion").hide();
        $("#txtArChannelSummaryDescription").prop("disabled", true);
        $("#divApplicationRulePopup").find("input").prop("disabled", true);
        $("#divApplicationRulePopup").find("select").prop("disabled", true);
    }
    else {
        $("#txtApplicablePer").prop("disabled", false);
        $("#btnArChannelSummaryDescriptionSuggestion").show();
        $("#txtArChannelSummaryDescription").prop("disabled", false);
        $("#divApplicationRulePopup").find("th[iden='Action']").show();
        $("#divApplicationRulePopup").find("td[iden='Action']").show();
    }
}

function fnCopyfrmDescr(ctrl) {
    var descr = $("#txtArINITDescription").val();
    if (descr.length > 100)
        descr = descr.substring(0, 100);

    $("#txtArChannelSummaryDescription").val(descr);
    $("#lbltxtChannelSummarylengthPopup").html(descr.length + "/100");
}


function fnGetSKUlstforSuggestion() {
    if (fnValidateAppRule()) {

        var Arr = [];
        var strAppRule = GenerateAppRuleScript();
        strBase = strAppRule.split("|||")[0];
        strInit = strAppRule.split("|||")[1];

        if (strBase != "") {
            var ArrSlab = strBase.split("$$$");
            for (i = 1; i < ArrSlab.length; i++) {
                var ArrGrp = ArrSlab[i].split("***");
                for (j = 1; j < ArrGrp.length; j++) {
                    for (var m = 0; m < ArrGrp[j].split("*$*")[4].split("^").length; m++) {
                        Arr.push({
                            "col1": ArrGrp[j].split("*$*")[4].split("^")[m].split("|")[0],
                            "col2": ArrGrp[j].split("*$*")[4].split("^")[m].split("|")[1]
                        });
                    }

                }
            }
        }

        if (strInit != "") {
            var ArrGrp = strInit.split("***");
            for (i = 1; i < ArrGrp.length; i++) {
                for (var m = 0; m < ArrGrp[i].split("*$*")[4].split("^").length; m++) {
                    Arr.push({
                        "col1": ArrGrp[i].split("*$*")[4].split("^")[m].split("|")[0],
                        "col2": ArrGrp[i].split("*$*")[4].split("^")[m].split("|")[1]
                    });
                }
            }
        }

        $("#dvloader").show();
        PageMethods.GetSKUList(Arr, GetSKUList_pass, fnfailed);
    }
}
function GetSKUList_pass(res) {
    $("#dvloader").hide();
    if (res.split("|^|")[0] == "0") {
        $("#divPopupHierTbl").dialog({
            "modal": true,
            "width": "60%",
            "height": "560",
            "title": "",
            open: function () {
                //
            },
            close: function () {
                $("#divPopupHierTbl").dialog('destroy');
            },
            buttons: [{
                text: 'Submit',
                class: 'btn-primary',
                click: function () {
                    var prodhier = "", prod = "";
                    $("#divPopupHierTblBody").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']").each(function () {
                        if (prodhier != "") {
                            prod += ",";
                            prodhier += "^";
                        }

                        prod += $(this).find("td:last").html();
                        prodhier += $(this).attr("nid") + "|" + $(this).attr("ntype") + "|" + $(this).find("td:last").html();
                    });
                    fnGetSuggestionforChannelSummary(prod);
                }
            },
            {
                text: 'Cancel',
                class: 'btn-primary',
                click: function () {
                    $("#divPopupHierTbl").dialog('close');
                }
            }]
        });

        $("#divPopupHierTblBody").html(res.split("|^|")[1]);
    }
    else {
        PopupAlertMsg("Error : " + res.split("|^|")[1], 2);
    }
}
function fnGetSuggestionforChannelSummary(strSBF) {
    var LoginID = $("#ConatntMatter_hdnLoginID").val();

    var BasePrdMain = [];
    var BasePrdDetail = [];
    var BenefitPrdMain = [];
    var BenefitPrdDetail = [];

    var strAppRule = GenerateAppRuleScript();
    strBase = strAppRule.split("|||")[0];
    strInit = strAppRule.split("|||")[1];

    if (strBase != "") {
        var ArrSlab = strBase.split("$$$");
        for (i = 1; i < ArrSlab.length; i++) {
            var ArrGrp = ArrSlab[i].split("***");
            for (j = 1; j < ArrGrp.length; j++) {
                for (k = 0; k < ArrGrp[j].split("*$*")[6].split("|").length; k++) {
                    BasePrdMain.push({
                        "col1": ArrGrp[0],                      //Slab No
                        "col2": ArrGrp[j].split("*$*")[5],      //Grp No
                        "col3": "Group " + j,                   //Group Name
                        "col4": ArrGrp[j].split("*$*")[6].split("|")[k],    //BucketID
                        "col5": ArrGrp[j].split("*$*")[0],      //Base Prod Type
                        "col6": ArrGrp[j].split("*$*")[1],      //Min
                        "col7": ArrGrp[j].split("*$*")[2],      //Max
                        "col8": ArrGrp[j].split("*$*")[3],      //UOM
                        "col9": ArrGrp[j].split("*$*")[7],      //IsNewSlab"
                        "col10": ArrGrp[j].split("*$*")[8]      //IsNewGrp
                    });
                }

                for (var m = 0; m < ArrGrp[j].split("*$*")[4].split("^").length; m++) {
                    BasePrdDetail.push({
                        "col1": ArrGrp[j].split("*$*")[5],      //Grp No
                        "col2": ArrGrp[j].split("*$*")[4].split("^")[m].split("|")[0],
                        "col3": ArrGrp[j].split("*$*")[4].split("^")[m].split("|")[1],
                        "col4": ArrGrp[0]                      //Slab No
                    });
                }

            }
        }
    }

    if (strInit != "") {
        var ArrGrp = strInit.split("***");
        for (i = 1; i < ArrGrp.length; i++) {
            BenefitPrdMain.push({
                "col1": ArrGrp[i].split("*$*")[3],                  //Slab No
                "col2": ArrGrp[i].split("*$*")[5],                  //Grp No
                "col3": ArrGrp[i].split("*$*")[6],                  //bucket
                "col4": ArrGrp[i].split("*$*")[0],                  //type
                "col5": ArrGrp[i].split("*$*")[1],                  //applied
                "col6": ArrGrp[i].split("*$*")[2],                  //value
                "col7": ArrGrp[i].split("*$*")[8],                  //IsNewGrp
            });


            for (var m = 0; m < ArrGrp[i].split("*$*")[4].split("^").length; m++) {
                BenefitPrdDetail.push({
                    "col1": ArrGrp[i].split("*$*")[5],      //Grp No
                    "col2": ArrGrp[i].split("*$*")[4].split("^")[m].split("|")[0],
                    "col3": ArrGrp[i].split("*$*")[4].split("^")[m].split("|")[1],
                    "col4": ArrGrp[i].split("*$*")[3]       //Slab No
                });
            }
        }
    }

    if (BasePrdMain.length == 0) {
        BasePrdMain.push({ "col1": "0", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "" });
    }
    if (BasePrdDetail.length == 0) {
        BasePrdDetail.push({ "col1": "0", "col2": "", "col3": "", "col4": "" });
    }
    if (BenefitPrdMain.length == 0) {
        BenefitPrdMain.push({ "col1": "0", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "" });
    }
    if (BenefitPrdDetail.length == 0) {
        BenefitPrdDetail.push({ "col1": "0", "col2": "", "col3": "", "col4": "" });
    }

    $("#dvloader").show();
    PageMethods.fnGetChannelSummaryDescr(LoginID, BasePrdMain, BasePrdDetail, BenefitPrdMain, BenefitPrdDetail, strSBF, fnGetChannelSummaryDescr_pass, fnfailed)
}
function fnGetChannelSummaryDescr_pass(res) {
    if (res.split("|^|")[0] == "0") {
        if (res.split("|^|")[1].length > 100) {
            AutoHideAlertMsg("Channel Summary Description length exceeds 100 characters. Please select few less SBF(s) !");
        }
        else {
            $("#txtArChannelSummaryDescription").val(res.split("|^|")[1]);
            $("#lbltxtChannelSummarylengthPopup").html(res.split("|^|")[1].length + "/100");

            $("#divPopupHierTbl").dialog('close');
        }
    }
    else {
        AutoHideAlertMsg("Due to some technical reasons, we are unable to suggest Channel Summary Description !");
    }
    $("#dvloader").hide();
}


function fnValidateAppRule() {

    var cntrtr = 1;
    var flgValidate = true;
    if ($("#txtApplicablePer").val() == "") {
        AutoHideAlertMsg("Please enter the Applicable (%) !");
        flgValidate = false;
    }

    if ($("#divApplicationRulePopup").attr("flgMixedCases") == "1") {
        $("#divAppRuleMixedCases").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            if (flgValidate) {
                if ($(this).find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("prodhier") == "") {
                    AutoHideAlertMsg("Please select the Products in row no. - " + cntrtr + " !");
                    flgValidate = false;
                }
                else if ($(this).find("select[iden='condition']").eq(0).val() == "0") {
                    AutoHideAlertMsg("Please select the Condition in row no. - " + cntrtr + " !");
                    flgValidate = false;
                }
                else if ($(this).find("input[iden='min']").eq(0).val() == "") {
                    AutoHideAlertMsg("Please enter the Minimum in row no. - " + cntrtr + " !");
                    flgValidate = false;
                }
                else if ($(this).find("input[iden='max']").eq(0).val() == "") {
                    AutoHideAlertMsg("Please enter the Maximum in row no. - " + cntrtr + " !");
                    flgValidate = false;
                }
                else if ($(this).find("select[iden='inittype']").eq(0).val() == "0") {
                    AutoHideAlertMsg("Please select the Discount Type in row no. - " + cntrtr + " !");
                    flgValidate = false;
                }
                else if ($(this).find("select[iden='initappliedon']").eq(0).val() == "0") {
                    AutoHideAlertMsg("Please select the Discount Applied On in row no. - " + cntrtr + " !");
                    flgValidate = false;
                }
                else if ($(this).find("input[iden='initvalue']").eq(0).val() == "") {
                    AutoHideAlertMsg("Please enter the Discount Value/Percentage in row no. - " + cntrtr + " !");
                    flgValidate = false;
                }

                cntrtr++;
            }
        });
    }
    else {
        var cntrslab = 1;
        $("#divAppRuleBaseProdSec").find("div[iden='AppRuleSlabWiseContainer']").each(function () {
            if (flgValidate) {
                cntrtr = 1;
                $(this).find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
                    if ($(this).find("td").eq(1).find("img[iden='ProductHier']").eq(0).attr("prodhier") == "") {
                        AutoHideAlertMsg("Please select the Products in row no. - " + cntrtr + ", slab no - " + cntrslab + ", in Base Product Section !");
                        flgValidate = false;
                    }
                    else if ($(this).find("select[iden='condition']").eq(0).val() == "0") {
                        AutoHideAlertMsg("Please select the Condition in row no. - " + cntrtr + ", slab no - " + cntrslab + ", in Base Product Section !");
                        flgValidate = false;
                    }
                    else if ($(this).find("input[iden='min']").eq(0).val() == "") {
                        AutoHideAlertMsg("Please enter the Minimum in row no. - " + cntrtr + ", slab no - " + cntrslab + ", in Base Product Section !");
                        flgValidate = false;
                    }
                    else if ($(this).find("input[iden='max']").eq(0).val() == "") {
                        AutoHideAlertMsg("Please enter the Maximum in row no. - " + cntrtr + ", slab no - " + cntrslab + ", in Base Product Section !");
                        flgValidate = false;
                    }

                    cntrtr++;
                });

                cntrslab++;
            }
        });


        cntrtr = 1;
        $("#divAppRuleBenefitSec").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            if (flgValidate) {
                if ($(this).find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("prodhier") == "") {
                    AutoHideAlertMsg("Please select the Products in row no. - " + cntrtr + ", in Initiative Product Section !");
                    flgValidate = false;
                }
                else if ($(this).find("select[iden='inittype']").eq(0).val() == "0") {
                    AutoHideAlertMsg("Please select the Discount Type in row no. - " + cntrtr + ", in Initiative Product Section !");
                    flgValidate = false;
                }
                else if ($(this).find("select[iden='initappliedon']").eq(0).val() == "0") {
                    AutoHideAlertMsg("Please select the Discount Applied On in row no. - " + cntrtr + ", in Initiative Product Section !");
                    flgValidate = false;
                }
                else if ($(this).find("input[iden='initvalue']").eq(0).val() == "") {
                    AutoHideAlertMsg("Please enter the Discount Value/Percentage in row no. - " + cntrtr + ", in Initiative Product Section !");
                    flgValidate = false;
                }

                cntrtr++;
            }
        });
    }

    return flgValidate;
}
function GenerateAppRuleScript(ctrl) {
    var strBase = ""; strInit = "";
    if ($("#divApplicationRulePopup").attr("flgMixedCases") == "1") {
        if ($("#divAppRuleMixedCases").find("table").eq(0).find("tbody").eq(0).find("tr").length > 0) {
            var slabno = $("#divAppRuleMixedCases").find("table").eq(0).find("tbody").eq(0).find("tr").eq(0).attr("slabno");

            strBase += "$$$" + slabno;
            $("#divAppRuleMixedCases").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
                strBase += "***" + $(this).find("select[iden='condition']").eq(0).val() + "*$*" + $(this).find("input[iden='min']").eq(0).val() + "*$*" + $(this).find("input[iden='max']").eq(0).val() + "*$*" + $(this).find("select[iden='uom']").eq(0).val() + "*$*" + $(this).find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("prodhier") + "*$*" + $(this).attr("basegrpno") + "*$*" + $(this).find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("copybuckettd") + "*$*" + $(this).attr("IsNewSlab") + "*$*" + $(this).attr("IsNewGrp");

                strInit += "***" + $(this).find("select[iden='inittype']").eq(0).val() + "*$*" + $(this).find("select[iden='initappliedon']").eq(0).val() + "*$*" + $(this).find("input[iden='initvalue']").eq(0).val() + "*$*" + slabno + "*$*" + $(this).find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("prodhier") + "*$*" + $(this).attr("initgrpno") + "*$*" + $(this).find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("copybuckettd") + "*$*" + $(this).attr("IsNewSlab") + "*$*" + $(this).attr("IsNewGrp") + "*$*" + $(this).attr("basegrpno");
            });
        }
    }
    else {
        var IsNewSlab = "";
        $("#divAppRuleBaseProdSec").find("div[iden='AppRuleSlabWiseContainer']").each(function () {
            IsNewSlab = $(this).attr("isnewslab");
            strBase += "$$$" + $(this).attr("slabno");
            $(this).find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
                strBase += "***" + $(this).find("select[iden='condition']").eq(0).val() + "*$*" + $(this).find("input[iden='min']").eq(0).val() + "*$*" + $(this).find("input[iden='max']").eq(0).val() + "*$*" + $(this).find("select[iden='uom']").eq(0).val() + "*$*" + $(this).find("td").eq(1).find("img[iden='ProductHier']").eq(0).attr("prodhier") + "*$*" + $(this).attr("grpno") + "*$*" + $(this).find("td").eq(1).find("img[iden='ProductHier']").eq(0).attr("copybuckettd") + "*$*" + IsNewSlab + "*$*" + $(this).attr("isnewgrp");
            });
        });

        $("#divAppRuleBenefitSec").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            strInit += "***" + $(this).find("select[iden='inittype']").eq(0).val() + "*$*" + $(this).find("select[iden='initappliedon']").eq(0).val() + "*$*" + $(this).find("input[iden='initvalue']").eq(0).val() + "*$*" + $(this).attr("slabno") + "*$*" + $(this).find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("prodhier") + "*$*" + $(this).attr("grpno") + "*$*" + $(this).find("td").eq(0).find("img[iden='ProductHier']").eq(0).attr("copybuckettd") + "*$*" + $(this).attr("isnewslab") + "*$*" + $(this).attr("isnewgrp") + "*$*0";
        });
    }

    return strBase + "|||" + strInit;
}


function fnAppRuleAddNewSlabbtnAction(ctrl) {
    var container = $("#divAppRuleBaseProdSec");
    var lstSlabNo = 0;
    container.find("div[iden='AppRuleSlabWiseContainer']").each(function () {
        if (parseInt($(this).attr("slabno")) > lstSlabNo) {
            lstSlabNo = parseInt($(this).attr("slabno"));
        }
    });
    var newSlabNo = lstSlabNo + 1;

    var str = "";
    str += "<div iden='AppRuleSlabWiseContainer' slabno='" + newSlabNo + "' IsNewSlab='1' onclick='fnActivateSlab(this, 1);'>";
    str += "<div class='clsAppRuleSubHeader' flgExpandCollapse='1' style='margin-top: 5px;'>" + $(ctrl).closest("div").html() + "</div>";
    str += "<table class='table table-bordered table-sm' style='margin-bottom: 0;'>";
    str += "<thead>" + $(ctrl).closest("div").next().find("thead").eq(0).html() + "</thead>";
    str += "<tbody>";
    var cntr = 0;
    $(ctrl).closest("div").next().find("tbody").eq(0).find("tr").each(function () {
        cntr++;
        str += "<tr grpno='" + cntr + "' IsNewGrp='1'>" + $(this).html() + "</tr>";
    });
    str += "</tbody>";
    str += "</table>";
    str += "</div>";
    $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").after(str);
    //container.append(str);

    var cntr = 0;
    $(ctrl).closest("div").next().find("tbody").eq(0).find("tr").each(function () {
        var type = $(this).find("td").eq(2).find("select").eq(0).val();
        var Max = $(this).find("td").eq(3).find("input[type='text']").eq(0).val();
        var Min = $(this).find("td").eq(4).find("input[type='text']").eq(0).val();
        var UOM = $(this).find("td").eq(5).find("select").eq(0).val();

        $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").next().find("tbody").eq(0).find("tr").eq(cntr).find("td").eq(2).find("select").eq(0).val(type);
        $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").next().find("tbody").eq(0).find("tr").eq(cntr).find("td").eq(3).find("input[type='text']").eq(0).val("0");
        switch (type.toString()) {
            case "0":
                $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").next().find("tbody").eq(0).find("tr").eq(cntr).find("td").eq(4).find("input[type='text']").eq(0).val("0");
                break;
            case "1":
                $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").next().find("tbody").eq(0).find("tr").eq(cntr).find("td").eq(4).find("input[type='text']").eq(0).val("9999999.99");
                break;
            default:
                $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").next().find("tbody").eq(0).find("tr").eq(cntr).find("td").eq(4).find("input[type='text']").eq(0).val("9999999");
                break;
        }
        $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").next().find("tbody").eq(0).find("tr").eq(cntr).find("td").eq(5).find("select").eq(0).val(UOM);
        cntr++;
    });


    //fnAppRuleAddNewInitiativetr(newSlabNo);
    var Inittr = "";
    str = "", cntr = 1;
    var SlabNo = $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").attr("slabno");
    var PrevSlabInittr = $("#divAppRuleBenefitSec").find("tbody").eq(0).find("tr[slabno='" + SlabNo + "']");
    PrevSlabInittr.each(function () {
        str += "<tr slabno='" + newSlabNo + "' grpno='" + cntr + "' IsNewSlab='1' IsNewGrp='1' onclick='fnActivateSlab(this, 2);'>";
        str += $(this).html();
        str += "</tr>";
        cntr++;
    });
    PrevSlabInittr.eq(PrevSlabInittr.length - 1).after(str);
    var PrevSlabInittr_Inittype = PrevSlabInittr.eq(0).find("td").eq(1).find("select").eq(0).val();
    var PrevSlabInittr_AppliedOn = PrevSlabInittr.eq(0).find("td").eq(2).find("select").eq(0).val();
    $("#divAppRuleBenefitSec").find("tbody").eq(0).find("tr[slabno='" + newSlabNo + "']").each(function () {
        $(this).find("td").eq(1).find("select").eq(0).val(PrevSlabInittr_Inittype);
        $(this).find("td").eq(2).find("select").eq(0).val(PrevSlabInittr_AppliedOn);
    });

    fnAppRuleUpdateSlabNo(container);
    fnUpdateInitProdSel($(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").next().find("img[iden='ProductHier']").eq(0), 2);
    //fnActivateSlab($(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").next(), 1);
}
function fnAppRuleRemoveSlab(ctrl) {
    var SlabNo = $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").attr("slabno");

    $(ctrl).closest("div.clsBaseProd").next().next().find("table").eq(0).find("tr[slabno='" + SlabNo + "']").remove();
    $(ctrl).closest("div[iden='AppRuleSlabWiseContainer']").remove();

    var container = $("#divAppRuleBaseProdSec");
    fnAppRuleUpdateSlabNo(container);
}

function fnAppRuleAddNewBasetr(ctrl) {
    var type = $(ctrl).closest("tr").find("td").eq(2).find("select").eq(0).val();
    var Max = $(ctrl).closest("tr").find("td").eq(3).find("input[type='text']").eq(0).val();
    var Min = $(ctrl).closest("tr").find("td").eq(4).find("input[type='text']").eq(0).val();
    var UOM = $(ctrl).closest("tr").find("td").eq(5).find("select").eq(0).val();

    var tbody = $(ctrl).closest("tbody");
    var lstGrpNo = 0;
    tbody.find("tr").each(function () {
        if (parseInt($(this).attr("grpno")) > lstGrpNo) {
            lstGrpNo = parseInt($(this).attr("grpno"));
        }
    });
    var newgrpno = lstGrpNo + 1;

    var str = "<tr grpno='" + newgrpno + "' IsNewGrp='1'>" + $(ctrl).closest("tr").html() + "</tr>";
    $(ctrl).closest("tr").after(str);
    $(ctrl).closest("tr").next().find("td").eq(2).find("select").eq(0).val(type);
    $(ctrl).closest("tr").next().find("td").eq(3).find("input[type='text']").eq(0).val("0");
    switch (type.toString()) {
        case "0":
            $(ctrl).closest("tr").next().find("td").eq(4).find("input[type='text']").eq(0).val("0");
            break;
        case "1":
            $(ctrl).closest("tr").next().find("td").eq(4).find("input[type='text']").eq(0).val("9999999.99");
            break;
        default:
            $(ctrl).closest("tr").next().find("td").eq(4).find("input[type='text']").eq(0).val("9999999");
            break;
    }
    $(ctrl).closest("tr").next().find("td").eq(5).find("select").eq(0).val(UOM);

    fnAppRuleUpdateGrpNo(tbody, "Group");
}
function fnAppRuleRemoveBasetr(ctrl) {
    var tbody = $(ctrl).closest("tbody");
    if ($(ctrl).closest("tbody").find("tr").length > 1) {
        $(ctrl).closest("tr").remove();
        fnAppRuleUpdateGrpNo(tbody, "Group");
    }
    else {
        $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Slab must have atleast one row. </div>");
        $("#divConfirm").dialog({
            "modal": true,
            "width": "300",
            "height": "120",
            "title": "Message :"
        });
    }
}

function fnAppRuleAddNewInitiativetrbtnAction(ctrl) {
    var Benefittype = $(ctrl).closest("tr").find("td").eq(1).find("select").eq(0).val();
    var Applied = $(ctrl).closest("tr").find("td").eq(2).find("select").eq(0).val();
    var Val = $(ctrl).closest("tr").find("td").eq(3).find("input[type='text']").eq(0).val();

    var slabno = $(ctrl).closest("tr").attr("slabno");
    var tbody = $(ctrl).closest("tbody");
    var lstGrpNo = 0;
    tbody.find("tr").each(function () {
        if (parseInt($(this).attr("grpno")) > lstGrpNo) {
            lstGrpNo = parseInt($(this).attr("grpno"));
        }
    });
    var newgrpno = lstGrpNo + 1;

    var str = "<tr slabno='" + slabno + "' grpno='" + newgrpno + "' IsNewSlab='" + $(ctrl).closest("tr").attr("IsNewSlab") + "' IsNewGrp='1' onclick='fnActivateSlab(this, 2);'>" + $(ctrl).closest("tr").html() + "</tr>";
    $(ctrl).closest("tr").after(str);

    $(ctrl).closest("tr").next().find("td").eq(1).find("select").eq(0).val(Benefittype);
    $(ctrl).closest("tr").next().find("td").eq(2).find("select").eq(0).val(Applied);
    $(ctrl).closest("tr").next().find("td").eq(3).find("input[type='text']").eq(0).val("0");

    //fnActivateSlab($(ctrl).closest("tr").next(), 2);
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
        fnGetSelHierTbl();
    }
}
function GetBucketbasedonType_failed() {
    $("#divCopyBucketPopupTbl").html("Due to some technical reasons, we are unable to Process your request !");
}


function fnSaveNewBucket(ctrl, cntr) {
    var SelectedHierValues = fnProdSelected().split("||||");

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

        var SelectedHierValues = fnProdSelected().split("||||");
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

        var rowIndex = $(ctrl).closest("tr[iden='Init']").index();
        var SelectedHierValues = fnProdSelected().split("||||");

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

        var rowIndex = $(ctrl).closest("tr[iden='Init']").index();
        var SelectedHierValues = fnProdSelected().split("||||");

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



function fnMRAccountPopup(ctrl) {
    var LoginID = $("#ConatntMatter_hdnLoginID").val();

    var strChannel = "";
    if ($(ctrl).attr("flgEdit") == "0")
        strChannel = $(ctrl).closest("tr[iden='Init']").attr("channelstr").split("|||")[0];
    else
        strChannel = $(ctrl).closest("tr[iden='Init']").find("td[iden='Init']").eq(6).find("img[iden='ProductHier']").eq(0).attr("ProdHier");

    if (strChannel == "") {
        $("#divPopup").dialog({
            "modal": true,
            "width": "490",
            "height": "300",
            "title": "MR Account(s) :",
            open: function () {
                $("#divPopup").html("<h4 style='color: #f00; padding: 10px;'>Please select the Channel first !</h4>");
            },
            close: function () {
                $("#divPopup").dialog('destroy');
            },
            buttons: [{
                text: 'Close',
                class: 'btn-primary',
                click: function () {
                    $("#divPopup").dialog('close');
                }
            }]
        });
    }
    else {
        var Arr = [];
        for (var i = 0; i < strChannel.split("^").length; i++) {
            Arr.push({
                "col1": strChannel.split("^")[i].split("|")[0],
                "col2": strChannel.split("^")[i].split("|")[1]
            });
        }

        $("#dvloader").show();
        PageMethods.fnGetMRAccounts(Arr, LoginID, fnGetMRAccount_pass, fnGetMRAccount_fail, ctrl);
    }
}
function fnGetMRAccount_pass(res, ctrl) {
    $("#dvloader").hide();
    if (res.split("|^|")[0] != "0") {
        $("#divPopup").dialog({
            "modal": true,
            "width": "490",
            "height": "300",
            "title": "MR Account(s) :",
            open: function () {
                $("#divPopup").html("<h4 style='color: #f00; padding: 10px;'>" + res.split("|^|")[1] + "</h4>");
            },
            close: function () {
                $("#divPopup").dialog('destroy');
            },
            buttons: [{
                text: 'Close',
                class: 'btn-primary',
                click: function () {
                    $("#divPopup").dialog('close');
                }
            }]
        });
    }
    else {
        if ($(ctrl).attr("flgEdit") == "0") {
            $("#divPopup").dialog({
                "modal": true,
                "width": "490",
                "height": "500",
                "title": "MR Account(s) :",
                close: function () {
                    $("#divPopup").dialog('destroy');
                },
                buttons: [{
                    text: 'Close',
                    class: 'btn-primary',
                    click: function () {
                        $("#divPopup").dialog('close');
                    }
                }]
            });
        }
        else {
            $("#divPopup").dialog({
                "modal": true,
                "width": "490",
                "height": "500",
                "title": "MR Account(s) :",
                close: function () {
                    $("#divPopup").dialog('destroy');
                },
                buttons: [{
                    text: 'Submit',
                    class: 'btn-primary',
                    click: function () {
                        var selectedstr = "";
                        $("#divPopup").find("ul").eq(0).find("input[type='checkbox']:checked").each(function () {
                            selectedstr += $(this).parent().attr("strId") + "^";
                        });
                        $(ctrl).attr("selectedIds", selectedstr);
                        $("#divPopup").dialog('close');
                    }
                },
                {
                    text: 'Close',
                    class: 'btn-primary',
                    click: function () {
                        $("#divPopup").dialog('close');
                    }
                }]
            });
        }


        // ---------------------------- Bind Mstr -------------------------------------------
        var str = "<div>";
        str += "<div class='lbl-header' style='color: #f07c00; width: 70%; display: inline-block;'>Please select the MR Account(s) :</div>";
        //str += "<div class='lbl-header' style='color: #4291df; width: 30%; display: inline-block; text-align: right;'><input type='checkbox' onclick='fnSelectAll(this);' />Select All</div>";
        str += "</div>";
        str += "<ul>";
        var json = $.parseJSON(res.split("|^|")[1]);
        for (var i = 0; i < json.length; i++) {
            str += "<li strId='" + json[i].MRAccountID + "'><input type='checkbox' /><span>" + json[i].MRAccountName + "</span></option>";
        }
        str += "</ul>";
        $("#divPopup").html(str);


        // ---------------------------- Existing Selections ------------------------------------
        if ($(ctrl).attr("selectedIds") != "") {
            var Arr = $(ctrl).attr("selectedIds").split("^");
            for (var i = 0; i < (Arr.length - 1); i++) {
                $("#divPopup").find("ul").eq(0).find("li[strId='" + Arr[i] + "']").eq(0).find("input[type='checkbox']").prop("checked", true);
            }
        }


        // --------------------------------- View only -----------------------------------------
        if ($(ctrl).attr("flgEdit") == "0") {
            $("#divPopup").find("ul").eq(0).find("input[type='checkbox']").prop("disabled", true);
            $("#divPopup").find("ul").eq(0).find("li").hide();

            $("#divPopup").find("ul").eq(0).find("input[type='checkbox']:checked").each(function () {
                $(this).parent().show();
            });
        }
    }
}
function fnGetMRAccount_fail(res) {
    $("#dvloader").hide();
    $("#divPopup").dialog({
        "modal": true,
        "width": "490",
        "height": "300",
        "title": "MR Account(s) :",
        open: function () {
            $("#divPopup").html("<h4 style='color: #f00; padding: 10px;'>Error : " + res + "</h4>");
        },
        close: function () {
            $("#divPopup").dialog('destroy');
        },
        buttons: [{
            text: 'Close',
            class: 'btn-primary',
            click: function () {
                $("#divPopup").dialog('close');
            }
        }]
    });
}

function fnSelectAll(ctrl) {
    if ($(ctrl).is(":checked")) {
        $(ctrl).parent().parent().next().find("input[type='checkbox']").prop("checked", true);
    }
    else {
        $(ctrl).parent().parent().next().find("input[type='checkbox']").prop("checked", false);
    }
}





