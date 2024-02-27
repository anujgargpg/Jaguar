var MonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fnFBImportPopup(flgCall, flgOldNew, flgFBType) {
    var str = "<div id='dvFBImportPopup' style='display: none;'>";
    str += "<div>";
    str += "<div id='divFBImportPopupFilters'>";
    str += "<div class='fb-filter-lbl'>FB</div>";
    if (flgCall == 0) {
        str += "<select id='ddlImportFBPopupOldNew' class='form-control form-control-sm ml-2 mr-4' style='width: 70px;' disabled><option value='1'>Old</option><option value='2'>New</option></select>";
    }
    else
        str += "<select id='ddlImportFBPopupOldNew' class='form-control form-control-sm ml-2 mr-4' style='width: 70px;'><option value='1'>Old</option><option value='2'>New</option></select>";

    str += "<div class='fb-filter-lbl'>Type</div>";
    str += "<select id='ddlFBTypePopup' class='form-control form-control-sm ml-2 mr-4' style='width: 80px;'><option value='1'>Base</option><option value='2'>Top-Up</option></select>";
    str += "<div class='fb-filter-lbl'>Month</div>";
    str += "<select id='ddlFBImportMonthPopup' class='form-control form-control-sm ml-2 mr-4' style='width: 90px;'>" + $("#ConatntMatter_hdnMonths").val().split("^")[0] + "</select>";

    if (flgCall == 0)
        str += "<input type='checkbox' id='chkImportFBPopupAllChannel' class='mr-1' style='height: 10px;' checked disabled/>";
    else
        str += "<input type='checkbox' id='chkImportFBPopupAllChannel' class='mr-1' style='height: 10px;'/>";

    str += "<div class='fb-filter-lbl'>All Channel</div>";
    str += "<a id='btnFBImportProductHierFilter' class='btn btn-primary btn-sm ml-4 mr-1' href='#' buckettype='1' prodlvl='40' prodhier='' onclick='fnShowProdHierPopup(this, 0);' title='Product Filter' style='font-size: 0.8rem;'>Product</a>";
    str += "<a id='btnFBImportClusterHierFilter' class='btn btn-primary btn-sm mr-1' href='#' onclick='fnFBImportShowClusterPopup(this);' title='Cluster Filter' mth='0' yr='0' selectedstr='' style='font-size: 0.8rem;'>Cluster</a>";
    str += "<a id='btnFBImportChannelHierFilter' class='btn btn-primary btn-sm mr-3' href='#' buckettype='3' prodlvl='210' prodhier='' onclick='fnShowProdHierPopup(this, 0);' title='Channel Filter' style='font-size: 0.8rem;'>Channel</a>";
    str += "<a class='btn btn-primary btn-sm' href='#' onclick='fnGetFBlistforImport();' title='Get FB(s) for Import' style='font-size: 0.8rem;'>Get FB(s) List</a>";
    str += "<input id='txtImportfilter' type='text' class='form-control form-control-sm' onkeyup='fnFBImportTypefilter(this);' placeholder='Type atleast 3 characters to Search ..' />";
    str += "</div>";
    str += "<div id='divFBImportPopuptbl' style='max-height: 424px; overflow-y: auto;'>";
    str += "<div style='text-align: center; padding-top: 20px;'><img src='../../Images/loading.gif'/></div>";
    str += "</div>";
    str += "</div>";
    $("body").append(str);
    $("#ddlImportFBPopupOldNew").val(flgOldNew);
    $("#ddlFBTypePopup").val(flgFBType);

    $("#dvFBImportPopup").dialog({
        "modal": true,
        "width": "94%",
        "height": "600",
        "title": "Import Focus Brand(s) :",
        close: function () {
            $("#dvFBImportPopup").dialog('destroy');
            $("#dvFBImportPopup").remove();
        },
        buttons: [{
            text: 'Import Focus Brand(s)',
            class: 'btn-primary',
            click: function () {
                fnImportFB();
            }
        },
        {
            text: 'Reset Hier Filter(s)',
            class: 'btn-primary',
            click: function () {
                $("#btnFBImportProductHierFilter").attr("prodhier", "");
                $("#btnFBImportClusterHierFilter").attr("selectedstr", "");
                $("#btnFBImportChannelHierFilter").attr("prodhier", "");

                fnGetFBlistforImport();
            }
        },
        {
            text: 'Cancel',
            class: 'btn-primary',
            click: function () {
                $("#dvFBImportPopup").dialog('close');
            }
        }]
    });

    fnGetFBlistforImport();
}

function fnFBImportTypefilter(ctrl) {
    if ($(ctrl).val().length > 2) {
        var flgtr = 0, rowindex = 0, flgValid=0;
        var filter = $(ctrl).val().toUpperCase().split(",");

        $(ctrl).parent().next().find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "none");
        $(ctrl).parent().next().find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
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
        $(ctrl).parent().next().find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    }
}


function fnFBImportShowClusterPopup(ctrl) {
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
            var Qtr = MonthArr.indexOf($("#ddlFBImportMonthPopup").val().split("|")[0].split("-")[1]) + 1;
            var Yr = "20" + $("#ddlFBImportMonthPopup").val().split("|")[0].split("-")[2];
            var BucketType = 5;
            if ($("#ddlImportFBPopupOldNew").val() == "2")
                BucketType = 6;

            $(ctrl).attr("mth", Qtr);
            $(ctrl).attr("yr", Yr);
            PageMethods.GetClusters(LoginID, RoleID, UserID, BucketType, Qtr, Yr, GetClusters_pass, GetClusters_failed, selectedstr);
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                var selectedstr = "", descr = "";
                $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flg='1']").each(function () {
                    selectedstr += "^" + $(this).attr("clusterid") + "|" + $(this).find("td").eq(1).html();
                    descr += ", " + $(this).find("td").eq(1).html();
                });
                if (selectedstr != "") {
                    selectedstr = selectedstr.substring(1);
                    descr = descr.substring(2);
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
            var tr = $("#divClusterPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[clusterid='" + selectedstr.split("^")[i].split("|")[0] + "']");
            tr.eq(0).attr("flg", "1");
            tr.eq(0).addClass("Active");
            tr.eq(0).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");
        }
        fnGetSelClusterHierTbl();
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
    fnGetSelClusterHierTbl();
}
function fnGetSelClusterHierTbl() {
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
        PageMethods.GetSelHierTbl(BucketValues, "2", "0", GetSelHierClusterTbl_pass, GetSelHierClusterTbl_failed);
    }
    else {
        $("#divClusterSelectionTbl").find("table").eq(0).find("tbody").eq(0).html("");
    }
}
function GetSelHierClusterTbl_pass(res) {
    $("#dvloader").hide();
    $("#divClusterSelectionTbl").html(res);
}
function GetSelHierClusterTbl_failed() {
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



function fnGetFBlistforImport() {
    $("#txtImportfilter").val('');
    $("#divFBImportPopuptbl").html("<div style='text-align: center; padding-top: 20px;'><img src='../../Images/loading.gif'/></div>");

    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var FBOldNew = $("#ddlImportFBPopupOldNew").val();
    var FBType = $("#ddlFBTypePopup").val();
    var FromDate = $("#ddlFBImportMonthPopup").val().split("|")[0];
    var ToDate = $("#ddlFBImportMonthPopup").val().split("|")[1];
    var QtrFrom = MonthArr.indexOf($("#ddlFBImportMonthPopup").val().split("|")[0].split("-")[1]) + 1;
    var YrFrom = $("#ddlFBImportMonthPopup").val().split("|")[0].split("-")[2];

    var flgChannel = 1;     //Small Channel
    if ($("#chkImportFBPopupAllChannel").is(":checked"))
        flgChannel = 0; 

    var ProdValues = [], LocValues = [], ChannelValues = [];
    var PrdString = $("#btnFBImportProductHierFilter").attr("prodhier");
    var LocString = $("#btnFBImportClusterHierFilter").attr("selectedstr");
    var ChannelString = $("#btnFBImportChannelHierFilter").attr("prodhier");

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
                "col2": "0",
                "col3": "4"
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

    PageMethods.fnGetFBforImport(RoleID, UserID, LoginID, FromDate, ToDate, FBOldNew, FBType, flgChannel, ProdValues, LocValues, ChannelValues, fnGetFBforImport_pass, fnfailed);
}
function fnGetFBforImport_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divFBImportPopuptbl").html(res.split("|^|")[1]);
    }
    else {
        $("#divFBImportPopuptbl").html("<div style='text-align: center; padding-top: 10px; font-size: 0.9rem;'>Due to some technical reasons, we are unable to process your request !</div>");
    }
}

function fnImportFB() {
    if ($("#divFBImportPopuptbl").find("table").length > 0) {
        var RoleID = $("#ConatntMatter_hdnRoleID").val();
        var LoginID = $("#ConatntMatter_hdnLoginID").val();
        var UserID = $("#ConatntMatter_hdnUserID").val();
        var FBOldNew = $("#ddlImportFBPopupOldNew").val();
        var FBType = $("#ddlFBTypePopup").val();
        var FromDate = $("#ddlMonth").val().split("|")[0];
        var ToDate = $("#ddlMonth").val().split("|")[1];
        var ArrINIT = [];

        $("#divFBImportPopuptbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            if ($(this).find("input[type='checkbox']").is(":checked")) {
                ArrINIT.push({
                    "col1": $(this).attr("Init")
                });
            }
        });

        if (ArrINIT.length > 0) {
            $("#dvloader").show();
            PageMethods.fnImportFB(RoleID, UserID, LoginID, FromDate, ToDate, ArrINIT, FBOldNew, FBType, fnImportFb_pass, fnfailed);
        }
        else {
            AutoHideAlertMsg("Please select Focus Brand(s) for Copy !");
        }
    }
}
function fnImportFb_pass(res) {
    if (res.split("|^|")[0] == "0") {
        fnGetReport(0);

        AutoHideAlertMsg("Focus Brand(s) imported successfully !");
        $("#dvFBImportPopup").dialog('close');
    }
    else {
        fnfailed();
    }
}