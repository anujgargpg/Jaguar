
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
function fnfailed() {
    alert("Due to some technical reasons, we are unable to process your request !");
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
    $("#divReport").height(ht - ($("#dvBanner").height() + $("div.clsfilter").height() + 140));
    $("div.mainpanel").css("margin-top", $("#dvBanner").height());
    fnGetReport();
});
function fnGetReport() {
    $("#txtfilter").val('');
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserNodeID = $("#ConatntMatter_hdnNodeID").val();
    var UserNodeType = $("#ConatntMatter_hdnNodeType").val();

    var ProdLvl = "40";

    $("#dvloader").show();
    PageMethods.fnProdHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, 1, fnGetReport_pass, fnfailed);
}
function fnGetReport_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divReport").html(res.split("|^|")[1]);

        var wid = $("#divReport").find("table").eq(0).width();
        var thead = $("#divReport").find("table").eq(0).find("thead").eq(0).html();
        $("#divHeader").html("<table id='tblReport_header' class='clstable clsReport' style='margin-top:-4px; margin-bottom:0; width:" + (wid - 1) + "px; min-width:" + (wid - 1) + "px;'><thead>" + thead + "</thead></table>");
        $("#divReport").find("table").eq(0).css("width", wid);
        $("#divReport").find("table").eq(0).css("min-width", wid);
        for (i = 0; i < $("#divReport").find("table").eq(0).find("th").length; i++) {
            var th_wid = $("#divReport").find("table").eq(0).find("th")[i].clientWidth;
            $("#tblReport_header").find("th").eq(i).css("min-width", th_wid);
            $("#tblReport_header").find("th").eq(i).css("width", th_wid);
            $("#divReport").find("table").eq(0).find("th").eq(i).css("min-width", th_wid);
            $("#divReport").find("table").eq(0).find("th").eq(i).css("width", th_wid);
        }
        $("#divReport").find("table").eq(0).css("margin-top", "-" + $("#tblReport_header")[0].offsetHeight + "px");

        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}

function fnSave(flg) {
    var ParentId = "";
    var ParentType = "";
    var Code = "";
    var Descr = "";

    if (flg == 1) {         //BF
        if ($("#txtBFCode").val() == "") {
            alert("Please enter the BrandForm code !");
            return false;
        }
        else if ($("#txtBFName").val() == "") {
            alert("Please enter the BrandForm name !");
            return false;
        }
        else if ($("#txtBrand").attr("sel") == "") {
            alert("Please select the Brand !");
            return false;
        }

        ParentId = $("#txtBrand").attr("sel").split("^")[0];
        ParentType = $("#txtBrand").attr("sel").split("^")[1];
        Code = $("#txtBFCode").val();
        Descr = $("#txtBFName").val();
    }
    else {                   //SBF
        if ($("#txtSBFCode").val() == "") {
            alert("Please enter the SubBrandForm code !");
            return false;
        }
        else if ($("#txtSBFName").val() == "") {
            alert("Please enter the SubBrandForm name !");
            return false;
        }
        else if ($("#txtBrandForm").attr("sel") == "") {
            alert("Please select the BrandForm !");
            return false;
        }

        ParentId = $("#txtBrandForm").attr("sel").split("^")[0];
        ParentType = $("#txtBrandForm").attr("sel").split("^")[1];
        Code = $("#txtSBFCode").val();
        Descr = $("#txtSBFName").val();
    }

    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserNodeID = $("#ConatntMatter_hdnNodeID").val();
    var UserNodeType = $("#ConatntMatter_hdnNodeType").val();

    $("#dvloader").show();
    PageMethods.fnSave(ParentId, ParentType, Code, Descr, LoginID, UserID, RoleID, UserNodeID, UserNodeType, fnSave_pass, fnfailed, flg);
}
function fnSave_pass(res, flg) {
    if (res.split("|^|")[0] == "0") {
        if (res.split("|^|")[1].split("^")[0] == "-1") {
            $("#dvloader").hide();
            alert("Code already exist !");
        }
        else {
            if (flg == 1) {
                alert("BrandForm added successfully !");
                $("#divBFPopup").dialog('close');

                $("#txtBrandForm").val(res.split("|^|")[2].toString().substr(0, res.split("|^|")[2].toString().length - 1));
                $("#txtBrandForm").attr("sel", res.split("|^|")[1]);
                $("#ConatntMatter_hdnBrand").val(res.split("|^|")[3]);
                $("#dvloader").hide();
            }
            else {
                alert("SubBrandForm added successfully !");
                $("#divSBFPopup").dialog('close');

                $("#ConatntMatter_hdnBrandForm").val(res.split("|^|")[3]);
                fnGetReport();
            }
        }
    }
    else {
        fnfailed();
    }
}

function fnAddNewSBF() {
    $("#txtBrandForm").attr("sel", "");
    $("#txtBrandForm").val("");
    $("#txtSBFCode").val("");
    $("#txtSBFName").val("");

    fnShowSBFPopup();
}
function fnShowSBFPopup() {
    $("#divSBFPopup").dialog({
        "modal": true,
        "width": "50%",
        "height": "420",
        "title": "SubBrandForm :",
        buttons: {
            "Add New SubBrandForm": function () {
                fnSave(2);
            },
            "Cancel": function () {
                $("#divSBFPopup").dialog('close');
            }
        }
    });
}

function fnAddNewBrandForm() {
    $("#txtBrand").attr("sel", "");
    $("#txtBrand").val("");
    $("#txtBFCode").val("");
    $("#txtBFName").val("");

    fnShowBFPopup();
}
function fnShowBFPopup() {
    $("#divBFPopup").dialog({
        "modal": true,
        "width": "46%",
        "height": "420",
        "title": "SubBrandForm :",
        buttons: {
            "Add New BrandForm": function () {
                fnSave(1);
            },
            "Cancel": function () {
                $("#divBFPopup").dialog('close');
            }
        }
    });
}

function fntypefilter() {
    var flgtr = 0;
    var filter = $("#txtfilter").val().toUpperCase().split(",");
    if ($("#txtfilter").val().length > 2) {
        $("#divReport").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "none");
        $("#divReport").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td")[1].innerText.toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }
            if (flgValid == 1) {
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
    else {
        $("#divHeader").show();
        $("#divReport").show();
        $("#divMsg").html('');
        $("#divReport").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    }
}
function fnPopupTypeSearch(ctrl) {
    var filter = $(ctrl).val().toUpperCase().split(",");
    if ($(ctrl).val().length > 2) {
        $(ctrl).next().find("div.clsPopupBody").eq(0).find("tbody").eq(0).find("tr").css("display", "none");
        $(ctrl).next().find("div.clsPopupBody").eq(0).find("tbody").eq(0).find("tr").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td")[1].innerText.toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }
            if (flgValid == 1) {
                $(this).css("display", "table-row");
            }
        });
    }
    else {
        $(ctrl).next().find("div.clsPopupBody").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    }
}

function fnRemoveSelection(ctrl) {
    $(ctrl).attr("sel", "");
}

function fnSelectProd(ctrl) {
    var nid = $(ctrl).attr("nid");
    var ntype = $(ctrl).attr("ntype");
    var str = $(ctrl).find("td:last").html();

    $(ctrl).closest("div.clsPopup").prev().val(str);
    $(ctrl).closest("div.clsPopup").prev().attr("sel", nid + "^" + ntype);
    fnHidePopup();
}

function fnShowPopup(ctrl, cntr) {
    $("#bg").show();
    $(ctrl).next("div.clsPopup").eq(0).show();

    if (cntr == 1) {
        $(ctrl).next().find("div.clsPopupBody").html($("#ConatntMatter_hdnBrand").val().split("|^|")[1]);
    }
    else {
        $(ctrl).next().find("div.clsPopupBody").html($("#ConatntMatter_hdnBrandForm").val().split("|^|")[1]);
    }

    if ($(ctrl).val() != "")
        fnPopupTypeSearch(ctrl);
}
function fnHidePopup() {
    $("#bg").hide();
    $("div.clsPopup").hide();
}