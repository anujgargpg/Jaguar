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
    $("#divReport").height(ht - ($("#Heading").height() + $("#Filter").height() + $("#ConatntMatter_TabHead").height() + $("#AddNewBtn").height() + 150));

    $("#ProdLvl").html($("#ConatntMatter_hdnLocationLvl").val());
    fnGetReport();
});

function fnQuarter(ctrl) {
    $("#ConatntMatter_TabHead").find("a").removeClass("active");
    $(ctrl).find("a").eq(0).addClass("active");
    $("#ConatntMatter_hdnQuarter").val($(ctrl).attr("QtrNo") + "|" + $(ctrl).attr("QtrYear") + "|" + $(ctrl).attr("flgEdit"));

    fnGetReport();
}

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
function fnSearch() {
    fnGetReport();
}
function fnResetFilter() {
    $("#txtLocationHierSearch").attr("selhier", "");
    $("#txtLocationHierSearch").attr("lvl", "");

    fnGetReport();
}

function fnGetReport() {
    $("#txtfilter").val('');

    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var QtrNo = $("#ConatntMatter_hdnQuarter").val().split("|")[0];
    var QtrYear = $("#ConatntMatter_hdnQuarter").val().split("|")[1];
    var FlgEdit = $("#ConatntMatter_hdnQuarter").val().split("|")[2];

    var PrdString = "";    //$("#txtLocationHierSearch").attr("prodhier");
    var BucketValues = [];
    var Initiatives = [];

    if (PrdString != "") {
        for (var i = 0; i < PrdString.split("^").length; i++) {
            BucketValues.push({
                "col1": PrdString.split("^")[i].split("|")[0],
                "col2": PrdString.split("^")[i].split("|")[1],
                "col3": BucketType
            });
        }
    }
    else {
        BucketValues.push({
            "col1": "0",
            "col2": "0",
            "col3": "1"
        });
    }

    Initiatives.push({
        "col1": "0"
    });

    $("#dvloader").show();
    PageMethods.fnGetReport(LoginID, UserID, BucketValues, Initiatives, QtrNo, QtrYear, FlgEdit, fnGetReport_pass, fnfailed);
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

function fnAddNew() {
    var FlgEdit = $("#ConatntMatter_hdnQuarter").val().split("|")[2];
    if (FlgEdit == "1") {
        var str = "";
        str += "<tr strId='0' style='display: table-row;'>";
        str += "<td></td>";
        str += "<td><textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'></textarea></td>";
        str += "<td><span></span><img src='../../Images/edit.png' title='click to select Distributor' selhier='' onclick='fnShowLocHierPopup(this, 1);'  style='float:right;'/></td>";
        str += "<td class='clstdAction'><img src='../../Images/save.png' title='save' onclick='fnSave(this, 0);' style='margin-right: 12px;'/><img src='../../Images/cancel.png' title='cancel' onclick='fnCancel(this);'/></td>";
        str += "</tr>";

        $("#tblReport").find("tbody").eq(0).prepend(str);
        $("#tblReport").find("tbody").eq(0).find("tr").eq(0).find("textarea").eq(0).on('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    else {
        AutoHideAlertMsg("This functionality is not allowed for Selected Quarter !");
    }
}
function fnEdit(ctrl) {
    var str = $(ctrl).closest("tr").attr("str");
    var strDBR = $(ctrl).closest("tr").attr("strDBR");

    $(ctrl).closest("tr").find("td").eq(1).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'>" + str + "</textarea>");
    $(ctrl).closest("tr").find("td").eq(2).html("<span>" + strDBR.split("~")[0] + "</span><img src='../../Images/edit.png' title='click to select Distributor' selhier='" + strDBR.split("~")[1] + "' onclick='fnShowLocHierPopup(this, 1);'  style='float:right;'/>");

    $(ctrl).closest("tr").find("textarea").eq(0).css("height", "auto");
    $(ctrl).closest("tr").find("textarea").eq(0).css("height", $(ctrl).closest("tr").find("textarea")[0].scrollHeight + "px");
    $(ctrl).closest("tr").find("textarea").eq(0).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    $(ctrl).closest("tr").find("td:last").html("<img src='../../Images/save.png' title='save' onclick='fnSave(this, 0);' style='margin-right: 12px;'/><img src='../../Images/cancel.png' title='cancel' onclick='fnCancel(this);'/>");
}
function fnCancel(ctrl) {
    var strId = $(ctrl).closest("tr").attr("strId");
    if (strId == "0") {
        $(ctrl).closest("tr").remove();
    }
    else {
        var str = $(ctrl).closest("tr").attr("str");
        var strDBR = $(ctrl).closest("tr").attr("strDBR");
        var strDBRDsply = strDBR.split("~")[0].length > 70 ? strDBR.split("~")[0].substr(0, 68) + ".." : strDBR.split("~")[0];

        $(ctrl).closest("tr").find("td").eq(1).html(str);
        $(ctrl).closest("tr").find("td").eq(2).html(strDBRDsply);
        $(ctrl).closest("tr").find("td:last").html("<img src='../../Images/edit.png' title='edit' onclick='fnEdit(this);' style='margin-right: 12px;'/><img src='../../Images/delete.png' title='Remove' onclick='fnDelete(this);'/>");
    }
}

function fnDelete(ctrl) {
    var ClusterID = $(ctrl).closest("tr").attr("strId");
    var ClusterName = $(ctrl).closest("tr").attr("str");

    $("#divConfirm").html("Are you sure, you want to remove <span style='color: #00f;'>" + ClusterName + "</span>.");
    $("#divConfirm").dialog({
        "modal": true,
        "width": "20%",
        "maxheight": "400",
        "title": "Message :",
        close: function () {
            $("#divConfirm").dialog('destroy');
        },
        buttons: [{
            text: 'Yes',
            class: 'btn-primary',
            click: function () {
                $("#dvloader").show();
                PageMethods.fnRemoveCluster(ClusterID, fnRemoveCluster_pass, fnfailed);
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
function fnRemoveCluster_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divConfirm").dialog('close');
        AutoHideAlertMsg("Cluster removed successfully !");
        fnGetReport();
    }
    else {
        fnfailed();
    }
}

function fnSave(ctrl, flgOverwrite) {
    var ClusterID = $(ctrl).closest("tr").attr("strId");
    var ClusterName = $(ctrl).closest("tr").find("td").eq(1).find("textarea").eq(0).val();
    var DBRList = [];
    var strDBRList = $(ctrl).closest("tr").find("td").eq(2).find("img").eq(0).attr("selhier");
    var QtrNo = $("#ConatntMatter_hdnQuarter").val().split("|")[0];
    var QtrYear = $("#ConatntMatter_hdnQuarter").val().split("|")[1];
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();

    if (ClusterName == "") {
        AutoHideAlertMsg("Please enter the Cluster Name !");
        return false;
    }
    else if (strDBRList == "") {
        AutoHideAlertMsg("Please select the Distributor(s) !");
        return false;
    }
    else {
        for (var i = 0; i < strDBRList.split("^").length; i++) {
            DBRList.push({
                "col1": ClusterID,
                "col2": strDBRList.split("^")[i].split("|")[0],
                "col3": strDBRList.split("^")[i].split("|")[1]
            });
        }

        $("#dvloader").show();
        PageMethods.fnSave(ClusterID, ClusterName, DBRList, QtrNo, QtrYear, LoginID, UserID, RoleID, flgOverwrite, fnSave_pass, fnfailed, ctrl);
    }
}
function fnDBRInExistingCluster(res, ctrl) {
    $("#divConfirm").html(res.split("|^|")[1]);

    $("#divConfirm").dialog({
        "modal": true,
        "width": "50%",
        "maxheight": "400",
        "title": "Message :",
        close: function () {
            $("#divConfirm").dialog('destroy');
        },
        buttons: [{
            text: 'Yes',
            class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');
                fnSave(ctrl, "1");
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
function fnSave_pass(res, ctrl) {
    if (res.split("|^|")[0] == "0") {
        if ($(ctrl).closest("tr").attr("strId") == "0")
            AutoHideAlertMsg("Cluster saved successfully !");
        else
            AutoHideAlertMsg("Cluster details updated successfully !");

        fnGetReport();
    }
    else if (res.split("|^|")[0] == "1") {
        $("#dvloader").hide();
        fnDBRInExistingCluster(res, ctrl);
    }
    else if (res.split("|^|")[0] == "2") {
        AutoHideAlertMsg("Cluster name already exist !");
        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}

function fnImportPrevQtrCluster() {
    var FlgEdit = $("#ConatntMatter_hdnQuarter").val().split("|")[2];
    if (FlgEdit == "1") {
        if ($("#ConatntMatter_PrevQtr").find("li").length > 0) {
            $("#divPrevQtrCluster").dialog({
                "modal": true,
                "width": "80%",
                "height": "550",
                "title": "Import Cluster(s) from Previous Quarter :",
                close: function () {
                    $("#divPrevQtrCluster").dialog('destroy');
                },
                buttons: [{
                    text: 'Submit',
                    class: 'btn-primary',
                    click: function () {
                        fnSubmitPrevQtrCluster();
                    }
                },
                {
                    text: 'Cancel',
                    class: 'btn-primary',
                    click: function () {
                        $("#divPrevQtrCluster").dialog('close');
                    }
                }]
            });

            fnPrevQuarter($("#ConatntMatter_PrevQtr").find("li"));
        }
        else {
            AutoHideAlertMsg("No Past Quarter found for Importing !");
        }
    }
    else {
        AutoHideAlertMsg("This functionality is not allowed for Selected Quarter !");
    }
}

function fnPrevQuarter(ctrl) {
    $("#ConatntMatter_PrevQtr").find("a").removeClass("active");
    $(ctrl).find("a").eq(0).addClass("active");

    var QtrNo = $(ctrl).attr("QtrNo");
    var QtrYear = $(ctrl).attr("QtrYear");
    $("#ConatntMatter_hdnPrevQuarterforImport").val(QtrNo + "|" + QtrYear);

    $("#dvloader").show();
    PageMethods.fnGetPrevQtrCluster(QtrNo, QtrYear, fnGetPrevQtrCluster_pass, fnfailed);
}
function fnGetPrevQtrCluster_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divExistingCluster").html(res.split("|^|")[1]);
        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}

function fnSubmitPrevQtrCluster() {
    var PrevQtrNo = $("#ConatntMatter_hdnPrevQuarterforImport").val().split("|")[0];
    var PrevQtrYear = $("#ConatntMatter_hdnPrevQuarterforImport").val().split("|")[1];
    var QtrNo = $("#ConatntMatter_hdnQuarter").val().split("|")[0];
    var QtrYear = $("#ConatntMatter_hdnQuarter").val().split("|")[1];
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var Arr = [];

    $("#divExistingCluster").find("input[type='checkbox']:checked").each(function () {
        Arr.push({
            "col1": $(this).closest("tr").attr("strid"),
            "col2": "0",
            "col3": "0"
        });
    });

    if (Arr.length > 0) {
        $("#dvloader").show();
        PageMethods.fnImportPrevQtrCluster(PrevQtrNo, PrevQtrYear, Arr, QtrNo, QtrYear, LoginID, UserID, RoleID, fnImportPrevQtrCluster_pass, fnfailed);
    }
    else
        AutoHideAlertMsg("Please select Cluster(s) for Importing !");
}
function fnImportPrevQtrCluster_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divPrevQtrCluster").dialog('close');
        fnGetReport();
    }
    else {
        fnfailed();
    }
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

function fnShowLocHierPopup(ctrl, cntr) {
    $("#ConatntMatter_hdnSelectedFrmFilter").val(cntr);
    $("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("tr").removeClass("Active");
    $("#divHierPopupTbl").html("<div style='font-size: 0.9rem; font-weight: 600; margin-top: 25%; text-align: center;'>Please Select the Level from Left</div>");

    var title = "Distributor";
    $("#divHierPopup").dialog({
        "modal": true,
        "width": "92%",
        "height": "560",
        "title": title,
        open: function () {
            var strtable = "";
            strtable += "<table class='table table-bordered table-sm table-hover'>";
            strtable += "<thead>";
            strtable += "<tr>";
            strtable += "<th style='width:15%;'>Country</th>";
            strtable += "<th style='width:20%;'>Region</th>";
            strtable += "<th style='width:30%;'>Site</th>";
            strtable += "<th style='width:35%;'>Distributor</th>";
            strtable += "</tr>";
            strtable += "</thead>";
            strtable += "<tbody>";
            strtable += "</tbody>";
            strtable += "</table>";
            $("#divHierSelectionTbl").html(strtable);
            $("#PopupHierlbl").html("Location Hierarchy");

            if ($(ctrl).attr("selhier") != "") {
                $("#ConatntMatter_hdnSelectedHier").val($(ctrl).attr("selhier"));
                fnProdLvl($("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("td[ntype='" + $(ctrl).attr("selhier").split("^")[0].split("|")[1] + "']").eq(0));
            }
            else
                $("#ConatntMatter_hdnSelectedHier").val("");
        },
        close: function () {
            //
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                fnProdSelected(ctrl);
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
                "col3": "2"
            });
        }
    }

    PageMethods.fnLocationHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "1", BucketValues, fnProdHier_pass, fnProdHier_failed);
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
            if ((parseInt(PrevSelLvl) > parseInt(Lvl))) {
                //$("#divHierSelectionTbl").find("tbody").eq(0).html("");
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
    $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']").each(function () {
        $(this).attr("flg", "0");
        $(this).removeClass("Active");
        $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
    });
    $("#chkSelectAllProd").removeAttr("checked");
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
    var Lvl = $("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").eq(0).find("td").eq(0).attr("ntype");

    if (flgSelect == 1) {
        if ($("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='" + Lvl + "'][nid='" + $(ctrl).attr("nid") + "']").length == 0) {
            var strtr = "";
            switch (Lvl) {
                case "100":
                    strtr += "<tr lvl='" + Lvl + "' cntry='" + $(ctrl).attr("cntry") + "' reg='" + $(ctrl).attr("reg") + "' site='" + $(ctrl).attr("site") + "' dbr='" + $(ctrl).attr("dbr") + "' branch='" + $(ctrl).attr("branch") + "' nid='" + $(ctrl).attr("cntry") + "'>";
                    strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>All</td><td>All</td><td>All</td>";
                    $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='110'][cntry='" + $(ctrl).attr("nid") + "']").remove();
                    $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='120'][cntry='" + $(ctrl).attr("nid") + "']").remove();
                    $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='130'][cntry='" + $(ctrl).attr("nid") + "']").remove();
                    break;
                case "110":
                    strtr += "<tr lvl='" + Lvl + "' cntry='" + $(ctrl).attr("cntry") + "' reg='" + $(ctrl).attr("reg") + "' site='" + $(ctrl).attr("site") + "' dbr='" + $(ctrl).attr("dbr") + "' branch='" + $(ctrl).attr("branch") + "' nid='" + $(ctrl).attr("reg") + "'>";
                    strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>All</td><td>All</td>";
                    $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='120'][reg='" + $(ctrl).attr("nid") + "']").remove();
                    $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='130'][reg='" + $(ctrl).attr("nid") + "']").remove();
                    break;
                case "120":
                    strtr += "<tr lvl='" + Lvl + "' cntry='" + $(ctrl).attr("cntry") + "' reg='" + $(ctrl).attr("reg") + "' site='" + $(ctrl).attr("site") + "' dbr='" + $(ctrl).attr("dbr") + "' branch='" + $(ctrl).attr("branch") + "' nid='" + $(ctrl).attr("site") + "'>";
                    strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>" + $(ctrl).find("td").eq(4).html() + "</td><td>All</td>";
                    $("#divHierSelectionTbl").find("tbody").eq(0).find("tr[lvl='130'][site='" + $(ctrl).attr("nid") + "']").remove();
                    break;
                case "130":
                    strtr += "<tr lvl='" + Lvl + "' cntry='" + $(ctrl).attr("cntry") + "' reg='" + $(ctrl).attr("reg") + "' site='" + $(ctrl).attr("site") + "' dbr='" + $(ctrl).attr("dbr") + "' branch='" + $(ctrl).attr("branch") + "' nid='" + $(ctrl).attr("dbr") + "'>";
                    strtr += "<td>" + $(ctrl).find("td").eq(2).html() + "</td><td>" + $(ctrl).find("td").eq(3).html() + "</td><td>" + $(ctrl).find("td").eq(4).html() + "</td><td>" + $(ctrl).find("td").eq(5).html() + "</td>";
                    break;
            }
            strtr += "</tr>";

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

function fnProdSelected(ctrl) {
    var SelectedHier = "", descr = "";
    $("#divHierSelectionTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
        SelectedHier += "^" + $(this).attr("nid") + "|" + $(this).attr("lvl");
        switch ($(this).attr("lvl")) {
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
        }
    });
    if (SelectedHier != "") {
        SelectedHier = SelectedHier.substring(1);
        descr = descr.substring(1);
    }

    $(ctrl).attr("selhier", SelectedHier);
    $(ctrl).prev().html(descr);
}