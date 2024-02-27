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

    //---------------------------------------------
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

var ht;
$(document).ready(function () {
    ht = $(window).height();

    if ($("#ConatntMatter_hdnPageType").val() == "1") {                                         // 1: Add,  2: Remove
        $("#btnAddRemoveProxy").html("Add Proxy SBF");
        $("#Heading").html("Add Proxy SBF in Base SBF :");
        $("#lblStep1").html("Select Proxy SBF to be Added, in One or More Base SBF(s)");
    }
    else {
        $("#btnAddRemoveProxy").html("Remove Proxy SBF");
        $("#Heading").html("Remove Proxy SBF from Base SBF :");
        $("#lblStep1").html("Select Proxy SBF to be Removed, in One or More Base SBF(s)");
    }

    $("#txtSBFSelection").next().html($("#ConatntMatter_hdnSBFMstr").val());

    fnGetDetails();
});

function fnGetBaseSBFlist() {
    if ($("#txtSBFSelection").val() == "") {
        AutoHideAlertMsg("Please select the Proxy SBF !");
        return false;
    }

    fnGetDetails();
}
function fnGetDetails() {
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var flgPage = $("#ConatntMatter_hdnPageType").val();                                // 1: Add,   2: Remove

    var SBFNodeID = $("#txtSBFSelection").attr("selectedstr").split("|")[0];
    var SBFNodeType = $("#txtSBFSelection").attr("selectedstr").split("|")[1];

    $("#dvloader").show();
    PageMethods.fnGetDetails(SBFNodeID, SBFNodeType, LoginID, RoleID, UserID, flgPage, fnGetDetails_pass, fnfailed);
}
function fnGetDetails_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#dvloader").hide();
        $("#divReport").html(res.split("|^|")[1]);

        fnUpdateBtnStatus();
    }
    else if (res.split("|^|")[0] == "1") {
        $("#dvloader").hide();
        $("#divReport").html(res.split("|^|")[1]);
    }
    else {
        fnfailed();
    }
}

function fnSBDTypeSearch(ctrl) {
    var flgValid = 0;
    var colcntr = $("#tblSBDHeader").find("th").length;

    //$("#tblSBDBody").find("tbody").eq(0).find("tr").css("display", "none");
    $("#tblSBDBody").find("tbody").eq(0).find("tr").each(function () {
        flgValid = 1;
        for (var i = 1; i < colcntr; i++) {
            var filter = $("#tblSBDHeader").find("th").eq(i).find("input[type='text']").eq(0).val().toString().toUpperCase().trim();
            if (filter != "" && filter.length > 2) {
                if (i > 1) {
                    var proxysbf = "";
                    $(this).find("td").eq(i).find("span").each(function () {
                        proxysbf += $(this).html() + " ";
                    });
                    if (proxysbf.toUpperCase().indexOf(filter) == -1) {
                        flgValid = 0;
                    }
                }
                else {
                    if ($(this).find("td").eq(i).html().toUpperCase().indexOf(filter) == -1) {
                        flgValid = 0;
                    }
                }
            }
        }

        if (flgValid == 1) {
            $(this).attr("flgVisible", "1");
            $(this).css("display", "table-row");
        }
        else {
            $(this).attr("flgVisible", "0");
            $(this).css("display", "none");
            $(this).find("input[type='checkbox']").removeAttr("checked");
        }
    });
}

function fnSBDSelectAll() {
    if ($("#chkSBDSelectAll").is(":checked")) {
        $("#tblSBDBody").find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
            $(this).find("input[type='checkbox']").prop("checked", true);
        });
    }
    else {
        $("#tblSBDBody").find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
            $(this).find("input[type='checkbox']").removeAttr("checked");
        });
    }

    fnUpdateBtnStatus();
}
function fnSelectSBD(ctrl) {
    if (!($(ctrl).is(":checked"))) {
        $("#chkSBDSelectAll").removeAttr("checked");
    }

    fnUpdateBtnStatus();
}

function fnUpdateBtnStatus() {
    if ($("#divReport").find("input[type='checkbox']:checked").length == 0) {
        $("#btnAddRemoveProxy").addClass("btn-disabled");
        $("#btnAddRemoveProxy").removeAttr("onclick");
    }
    else {
        $("#btnAddRemoveProxy").removeClass("btn-disabled");
        $("#btnAddRemoveProxy").attr("onclick", "fnAddRemoveProxy()");
    }
}

function fnSelectAllMapping(ctrl) {
    if ($(ctrl).is(":checked")) {
        $(ctrl).closest("table").find("tbody").eq(0).find("input[type='checkbox']").prop("checked", true);
    }
    else {
        $(ctrl).closest("table").find("tbody").eq(0).find("input[type='checkbox']").removeAttr("checked");
    }
}
function fnSelectIndividualMapping(ctrl) {
    if (!($(ctrl).is(":checked"))) {
        $(ctrl).closest("table").find("thead").eq(0).find("input[type='checkbox']").removeAttr("checked");
    }
}

function fnAddRemoveProxy() {
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var flgAddRemove = $("#ConatntMatter_hdnPageType").val();                           // 1: Add, 2: Remove

    var ProxyNodeID = $("#txtSBFSelection").attr("selectedstr").split("|")[0];
    if (ProxyNodeID != "0") {
        var ProxyNodeType = $("#txtSBFSelection").attr("selectedstr").split("|")[1];

        var ArrBucket = [];
        $("#tblSBDBody").find("input[iden='SBD']:checked").each(function () {
            ArrBucket.push({
                "col1": $(this).closest("tr").attr("strId"),
                "col2": "6"
            });
        });

        if (ArrBucket.length > 0) {
            if (flgAddRemove == "1")
                $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure, you want to Add <span style='color: #044d91;'>" + $("#txtSBFSelection").val() + "</span> in <span style='color: #044d91;'>" + ArrBucket.length + " Selected Buckets </span> ? </div>");
            else
                $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure, you want to Remove <span style='color: #044d91;'>" + $("#txtSBFSelection").val() + "</span> from <span style='color: #044d91;'>" + ArrBucket.length + " Selected Buckets </span> ? </div>");

            $("#divConfirm").dialog({
                "modal": true,
                "width": "400",
                "height": "200",
                "title": "Message :",
                close: function () {
                    $("#divConfirm").dialog('destroy');
                },
                buttons: [{
                    text: 'Yes',
                    class: 'btn-primary',
                    click: function () {
                        var ApplyToNorms = "0";
                        var ArrCluster = [{ "col1": "0", "col2": "0" }];

                        $("#dvloader").show();
                        PageMethods.fnAddRemoveProxySBF(UserID, RoleID, LoginID, flgAddRemove, ProxyNodeID, ProxyNodeType, ApplyToNorms, ArrBucket, ArrCluster, fnAddRemoveProxySBF_pass, fnfailed);

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
        else {
            fnAlertPopup("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Please select the Base SBF Bucket for Action ! </div>");
        }
    }
    else {
        fnAlertPopup("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Please select the Proxy SBF ! </div>");
    }
}
function fnAddRemoveProxySBF_pass(res) {
    if (res.split("|^|")[0] == "0") {
        if ($("#ConatntMatter_hdnPageType").val() == "1")
            AutoHideAlertMsg($("#txtSBFSelection").val() + " successfully added in selected Base SBF(s) !");
        else
            AutoHideAlertMsg($("#txtSBFSelection").val() + " successfully removed from the selected Base SBF(s) !");

        $("#txtSBFSelection").attr("selectedstr", "0|0");
        $("#txtSBFSelection").val("");
        fnGetDetails();
    }
    else if (res.split("|^|")[0] == "1") {
        $("#dvloader").hide();
        AutoHideAlertMsg(res.split("|^|")[1]);
    }
    else if (res.split("|^|")[0] == "2") {
        $("#dvloader").hide();
        fnGetClusterlst(res.split("|^|")[1], 1, '');
    }
    else {
        fnfailed();
    }
}

function fnRemoveProxySBFInIndividualBaseBucket(ctrl) {
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var flgAddRemove = "2";

    var ProxyNodeID = $(ctrl).closest("div").attr("strId");
    var ProxyNodeType = $(ctrl).closest("div").attr("strType");

    var ArrBucket = [];
    ArrBucket.push({
        "col1": $(ctrl).closest("tr").attr("strId"),
        "col2": "6"
    });

    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure, you want to remove <span style='color: #044d91;'>" + $(ctrl).closest("div").find("span").eq(0).html() + "</span> from <span style='color: #044d91;'>" + $(ctrl).closest("tr").find("td").eq(1).html() + "</span> ? </div>");
    $("#divConfirm").dialog({
        "modal": true,
        "width": "400",
        "height": "200",
        "title": "Message :",
        close: function () {
            $("#divConfirm").dialog('destroy');
        },
        buttons: [{
            text: 'Yes',
            class: 'btn-primary',
            click: function () {
                var ApplyToNorms = "0";
                var ArrCluster = [{ "col1": "0", "col2": "0" }];

                $("#dvloader").show();
                PageMethods.fnAddRemoveProxySBF(UserID, RoleID, LoginID, flgAddRemove, ProxyNodeID, ProxyNodeType, ApplyToNorms, ArrBucket, ArrCluster, fnRemoveProxySBFInIndividualBaseBucket_pass, fnfailed, ctrl);

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
function fnRemoveProxySBFInIndividualBaseBucket_pass(res, ctrl) {
    if (res.split("|^|")[0] == "0") {
        $("#dvloader").hide();
        $(ctrl).closest("div").remove();
    }
    else if (res.split("|^|")[0] == "1") {
        $("#dvloader").hide();
        AutoHideAlertMsg(res.split("|^|")[1]);
    }
    else if (res.split("|^|")[0] == "2") {
        $("#dvloader").hide();
        fnGetClusterlst(res.split("|^|")[1], 2, ctrl);
    }
    else {
        fnfailed();
    }
}

function fnGetClusterlst(str, flgCalling, ctrl) {      // 1: Add Proxy, 2: Remove Proxy, 3: Remove Proxy from Inidividual BaseSBF.
    $("#divMsg").html(str);

    $("#divMsg").dialog({
        "modal": true,
        "width": "50%",
        "title": "SBF-Cluster(s) :",
        open: function () {
            //
        },
        close: function () {
            $("#divMsg").dialog('destroy');
        },
        buttons: [{
            text: 'Submit',
            class: 'btn-primary',
            click: function () {
                var SBFClusterMapIds = "";
                $("#tblSBFClusterMapping").find("tbody").eq(0).find("input[type='checkbox']:checked").each(function () {
                    if (SBFClusterMapIds != "")
                        SBFClusterMapIds += "^";
                    SBFClusterMapIds += $(this).attr("mapids");
                });

                fnfinalAction(1, SBFClusterMapIds, flgCalling, ctrl);
                $("#divMsg").dialog('close');
            }
        },
        {
            text: 'Not Reflect',
            class: 'btn-primary',
            click: function () {
                var SBFClusterMapIds = "";
                $("#tblSBFClusterMapping").find("tbody").eq(0).find("input[type='checkbox']:checked").each(function () {
                    if (SBFClusterMapIds != "")
                        SBFClusterMapIds += "^";
                    SBFClusterMapIds += $(this).attr("mapids");
                });

                fnfinalAction(2, SBFClusterMapIds, flgCalling, ctrl);
                $("#divMsg").dialog('close');
            }
        }]

    });
}
function fnfinalAction(ApplyToNorms, SBFClusterMapIds, flgCalling, ctrl) {
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var flgAddRemove = $("#ConatntMatter_hdnPageType").val();
    if (flgCalling == 2)
        flgAddRemove = "2";

    var ProxyNodeID = "";
    var ProxyNodeType = "";
    if (flgCalling == 1) {
        var ProxyNodeID = $("#txtSBFSelection").attr("selectedstr").split("|")[0];
        var ProxyNodeType = $("#txtSBFSelection").attr("selectedstr").split("|")[1];
    }
    else {
        var ProxyNodeID = $(ctrl).closest("div").attr("strId");
        var ProxyNodeType = $(ctrl).closest("div").attr("strType");
    }

    var ArrBucket = [];
    var ArrCluster = [];

    if (flgCalling == 1) {
        $("#tblSBDBody").find("input[iden='SBD']:checked").each(function () {
            ArrBucket.push({
                "col1": $(this).closest("tr").attr("strId"),
                "col2": "6"
            });
        });
    }
    else {
        ArrBucket.push({
            "col1": $(ctrl).closest("tr").attr("strId"),
            "col2": "6"
        });
    }

    for (var i = 0; i < SBFClusterMapIds.split("^").length; i++) {
        ArrCluster.push({
            "col1": SBFClusterMapIds.split("^")[i].split("|")[0],
            "col2": SBFClusterMapIds.split("^")[i].split("|")[1]
        });
    }

    $("#dvloader").show();
    if (flgCalling == 1) {
        PageMethods.fnAddRemoveProxySBF(UserID, RoleID, LoginID, flgAddRemove, ProxyNodeID, ProxyNodeType, ApplyToNorms, ArrBucket, ArrCluster, fnAddRemoveProxySBF_pass, fnfailed);
    }
    else {
        PageMethods.fnAddRemoveProxySBF(UserID, RoleID, LoginID, flgAddRemove, ProxyNodeID, ProxyNodeType, ApplyToNorms, ArrBucket, ArrCluster, fnRemoveProxySBFInIndividualBaseBucket_pass, fnfailed, ctrl);
    }
}

function fnAlertPopup(msg) {
    $("#divMsg").html(msg);
    $("#divMsg").dialog({
        "modal": true,
        "width": "400",
        "height": "160",
        "title": "Message :",
        close: function () {
            $("#divMsg").dialog('destroy');
        },
        buttons: [{
            text: 'Close',
            class: 'btn-primary',
            click: function () {
                $("#divMsg").dialog('close');
            }
        }]
    });
}

function fnSBFPopuptypefilter(ctrl) {
    if ($(ctrl).attr("id") == "txtSBFSelection") {
        $("#divbtnblock").find("a").removeClass("active");
    }

    var filter = ($(ctrl).val()).toUpperCase().split(",");
    if ($(ctrl).val().length > 2) {
        $(ctrl).next().show();

        $(ctrl).next().find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "0");
        $(ctrl).next().find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "none");

        var flgValid = 0;
        $(ctrl).next().find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td")[0].innerText.toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
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
        $(ctrl).next().find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
        $(ctrl).next().find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
        $(ctrl).next().hide();
    }
}
function fnSelectSBF(ctrl) {
    $(ctrl).closest("div").prev().val($(ctrl).find("td").eq(4).html().split("amp;").join(""));
    $(ctrl).closest("div").prev().attr("selectedstr", $(ctrl).attr("nid") + "|" + $(ctrl).attr("ntype"));

    $("#divReport").find("input[type='checkbox']").prop("disabled", true);
    $("#divReport").find("input[type='checkbox']").removeAttr("checked");
    $(ctrl).closest("div").hide();
}