var ht = 0;
$(document).ready(function () {
    ht = $(window).height();

    $('.main-box').css({
        "position": "relative",
        "background": "none",
        "max-width": "1140px"
    });
    $(".txt-middle").css({
        "margin-top": ($(window).height() - ($(".txt-middle").outerHeight() + $("nav.navbar").outerHeight())) / 2 + "px"
    });

    //alert($("#ConatntMatter_hdnRoleID").val());
    $("#ddlMonth").html($("#ConatntMatter_hdnMonths").val().split("^")[0]);
    $("#ddlMonth").val($("#ConatntMatter_hdnMonths").val().split("^")[1]);

    $("#ddlMSMPAlies").html($("#ConatntMatter_hdnMSMPAlies").val());
    if ($("#ConatntMatter_hdnRoleID").val() == "1" || $("#ConatntMatter_hdnRoleID").val() == "2" || $("#ConatntMatter_hdnRoleID").val() == "4") {
        $("#MSMPFilterBlock").show();
        $("#ddlMSMPAlies").multiselect({
            noneSelectedText: "--Select--"
        }).multiselectfilter();

        //$("#ddlMSMPAlies").next().css({
        //    "height": "calc(1.5em + .5rem + 2px)",
        //    "font-size": "0.8rem",
        //    "font-weight": "400",
        //    "width": "260",
        //    "padding": ".25rem .5rem",
        //    "border-radius": ".2rem",
        //    "border-color": "#ced4da"
        //});
        //$("#ddlMSMPAlies").next().find("span.ui-icon").eq(0).css({
        //    "margin": ".2rem",
        //    "margin-bottom": "0",
        //    "background-color": "transparent",
        //    "border": "none"
        //});
    }
    else {
        $("#MSMPFilterBlock").hide();
    }

    fnGetTableData();
});

function fnfailed() {
    alert("Due to some technical reasons, we are unable to process your request !");
    $("#dvloader").hide();
}
function fnGetTableData() {
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var NodeID = $("#ConatntMatter_hdnNodeID").val();
    var NodeType = $("#ConatntMatter_hdnNodeType").val();
    var FromDate = $("#ddlMonth").val().split("|")[0];
    var EndDate = $("#ddlMonth").val().split("|")[1];
    var ArrUser = [];
    if ($("#ConatntMatter_hdnRoleID").val() == "1" || $("#ConatntMatter_hdnRoleID").val() == "2" || $("#ConatntMatter_hdnRoleID").val() == "4") {
        for (var i = 0; i < $("#ddlMSMPAlies option:selected").length; i++) {
            ArrUser.push({ "col1": $("#ddlMSMPAlies option:selected").eq(i).val() });
        }
    }
    if (ArrUser.length == 0)
        ArrUser.push({ "col1": 0 });

    $("#dvloader").show();
    PageMethods.fnGetTableData(LoginID, UserID, RoleID, NodeID, NodeType, FromDate, EndDate, ArrUser, fnGetTableData_pass, fnfailed);
}
function fnGetTableData_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divReport").html(res.split("|^|")[1]);

        //var wid = $("#tblReport").width();
        //var thead = $("#tblReport").find("thead").eq(0).html();
        //$("#divHeader").html("<table id='tblReport_header' class='table table-bordered table-sm' style='margin-top:100px; margin-bottom:0; width:" + (wid - 1) + "px; min-width:" + (wid - 1) + "px;'><thead>" + thead + "</thead></table>");
        //$("#tblReport").css("width", wid);
        //$("#tblReport").css("min-width", wid);
        //for (i = 0; i < $("#tblReport").find("th").length; i++) {
        //    var th_wid = $("#tblReport").find("th")[i].clientWidth;
        //    $("#tblReport_header").find("th").eq(i).css("min-width", th_wid);
        //    $("#tblReport_header").find("th").eq(i).css("width", th_wid);
        //    $("#tblReport").find("th").eq(i).css("min-width", th_wid);
        //    $("#tblReport").find("th").eq(i).css("width", th_wid);
        //}
        //$("#tblReport").css("margin-top", "-" + $("#tblReport_header")[0].offsetHeight + "px");

        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}