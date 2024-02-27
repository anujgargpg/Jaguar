var ht = 0;
function fnfailed() {
    alert("Due to some technical reasons, we are unable to process your request !");
    $("#dvloader").hide();
}

$(document).ready(function () {
    ht = $(window).height();
    $("#divReport").height(ht - ($("#Heading").height() + $("#Filter").height() + 160));

    fnGetTableData();
});
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

function fnGetTableData() {
    $("#txtfilter").val('');
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();

    $("#dvloader").show();
    PageMethods.fnGetTableData(LoginID, fnGetTableData_pass, fnfailed);
}
function fnGetTableData_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divReport").html(res.split("|^|")[1]);
        // ------------- Fixed Header -------------------------
        var wid = $("#tblReport").width();
        var thead = $("#tblReport").find("thead").eq(0).html();
        $("#divHeader").html("<table id='tblReport_header' class='table table-bordered table-sm' style='margin-top:-4px; margin-bottom:0; width:" + (wid - 1) + "px; min-width:" + (wid - 1) + "px;'><thead>" + thead + "</thead></table>");
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
        // -------------- Custom Tooltip ------------------------
        Tooltip(".clsInform");

        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}

function fnAddNew() {
    var str = "";
    str += "<tr UserID='0'>";
    str += "<td></td>";
    str += "<td><input type='text' style='width:98%; box-sizing: border-box;' value=''/></td>";
    str += "<td><input type='text' style='width:98%; box-sizing: border-box;' value=''/></td>";
    str += "<td><input id='chkUserActive' type='checkbox' checked='true'/></td>";
    str += "<td><select style='width:90%; box-sizing: border-box; margin-right: 1%;' onchange='fnCheckRole(this);'>" + $("#ConatntMatter_ddlRole").html() + "</select></td>";
    str += "<td><input id='chkCorpUser' type='checkbox' disabled onclick='fnSelectCorpUser(this);'/></td>";

    str += "<td><input type='checkbox' disabled onclick='fnSelectAll(this,1);'/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..'/></td>";
    str += "<td><input type='checkbox' disabled onclick='fnSelectAll(this,2);'/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 2);' placeholder='Click to select Location..'/></td>";
    str += "<td><input type='checkbox' disabled onclick='fnSelectAll(this,3);'/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 3);' placeholder='Click to select Channel..'/></td>";
    str += "<td><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 1);' placeholder=''/></td>";

    str += "<td><input type='text' style='width:98%; box-sizing: border-box;' value=''/></td>";
    str += "<td class='clstdAction'><img src='../../Images/save.png' title='save' onclick='fnSave(this);' style='margin-right: 12px;'/><img src='../../Images/cancel.png' title='cancel' onclick='fnCancel(this);'/></td>";
    str += "</tr>";

    if ($("#tblReport").find("tbody").eq(0).find("tr").length == 0) {
        $("#tblReport").find("tbody").eq(0).html(str);
    }
    else {
        $("#tblReport").find("tbody").eq(0).prepend(str);
    }
}
function fnEdit(ctrl) {
    var UserID = $(ctrl).closest("tr").attr("UserID");
    var Name = $(ctrl).closest("tr").attr("Name");
    var EmailID = $(ctrl).closest("tr").attr("EmailID");
    var Active = $(ctrl).closest("tr").attr("Active");
    var RoleId = $(ctrl).closest("tr").attr("RoleId");
    var CorpUser = $(ctrl).closest("tr").attr("CorpUser");
    var MSMPAlies = $(ctrl).closest("tr").attr("MSMPAlies");
    var Prodstr = $(ctrl).closest("tr").attr("Prodstr");
    var Prodselstr = $(ctrl).closest("tr").attr("Prodselstr");
    var ProdLvl = Prodselstr.split('^')[0].split('|');
    if (Prodselstr == "" || Prodselstr == "0|0")
        ProdLvl = "";
    else
        ProdLvl = ProdLvl[1];

    var Locstr = $(ctrl).closest("tr").attr("Locationstr");
    var Locselstr = $(ctrl).closest("tr").attr("Locationselstr");
    var LocLvl = Locselstr.split('^')[0].split('|');
    if (Locselstr == "" || Locselstr == "0|0")
        LocLvl = "";
    else
        LocLvl = LocLvl[1];

    var Chanstr = $(ctrl).closest("tr").attr("Channelstr");
    var Chanselstr = $(ctrl).closest("tr").attr("Channelselstr");
    var ChanLvl = Chanselstr.split('^')[0].split('|');
    if (Chanselstr == "" || Chanselstr == "0|0")
        ChanLvl = "";
    else
        ChanLvl = ChanLvl[1];

    var ExtraProdstr = $(ctrl).closest("tr").attr("ExtraProdstr");
    var ExtraProdselstr = $(ctrl).closest("tr").attr("ExtraProdselstr");
    var ExtraProdLvl = ExtraProdselstr.split('^')[0].split('|');
    if (ExtraProdselstr == "" || ExtraProdselstr == "0|0")
        ExtraProdLvl = "";
    else
        ExtraProdLvl = ExtraProdLvl[1];

    $(ctrl).closest("tr").attr("Prodtooltip", $(ctrl).closest("tr").find("td").eq(6).find("span").eq(0).attr("title"));
    $(ctrl).closest("tr").attr("Locationtooltip", $(ctrl).closest("tr").find("td").eq(7).find("span").eq(0).attr("title"));
    $(ctrl).closest("tr").attr("Channeltooltip", $(ctrl).closest("tr").find("td").eq(8).find("span").eq(0).attr("title"));
    $(ctrl).closest("tr").attr("ExtraProdtooltip", $(ctrl).closest("tr").find("td").eq(9).find("span").eq(0).attr("title"));

    $(ctrl).closest("tr").find("td").eq(1).html("<input type='text' style='width:98%; box-sizing: border-box;' value='" + Name + "' />");
    $(ctrl).closest("tr").find("td").eq(2).html("<input type='text' style='width:98%; box-sizing: border-box;' value='" + EmailID + "' />");
    if (Active == "Yes") {
        $(ctrl).closest("tr").find("td").eq(3).html("<input id='chkUserActive' type='checkbox' checked='true'/>");
    }
    else {
        $(ctrl).closest("tr").find("td").eq(3).html("<input id='chkUserActive' type='checkbox'/>");
    }

    $(ctrl).closest("tr").find("td").eq(4).html("<select style='width:98%; box-sizing: border-box; margin-right: 1%;' onchange='fnCheckRole(this);'>" + $("#ConatntMatter_ddlRole").html() + "</select>");
    $(ctrl).closest("tr").find("td").eq(4).find("select").eq(0).val(RoleId);

    if (CorpUser == "1") {
        $(ctrl).closest("tr").find("td").eq(5).html("<input id='chkCorpUser' type='checkbox' onclick='fnSelectCorpUser(this);' checked/>");
    }
    else {
        $(ctrl).closest("tr").find("td").eq(5).html("<input id='chkCorpUser' type='checkbox' onclick='fnSelectCorpUser(this);'/>");
    }
    fnEnableDisableAccess(ctrl);

    if ((RoleId == "3" || RoleId == "1015" || RoleId == "4" || RoleId == "1012") && CorpUser != "1") {

        if (Prodselstr == "") { }           //Primary Product Access
        else if (Prodselstr == "0|0") {
            $(ctrl).closest("tr").find("td").eq(6).find("input[type='checkbox']").eq(0).prop("checked", true);
            fnSelectAll($(ctrl).closest("tr").find("td").eq(6).find("input[type='checkbox']").eq(0), 1);
        }
        else {
            $(ctrl).closest("tr").find("td").eq(6).find("input[type='text']").eq(0).val(Prodstr);
            $(ctrl).closest("tr").find("td").eq(6).find("input[type='text']").eq(0).attr("ProdLvl", ProdLvl);
            $(ctrl).closest("tr").find("td").eq(6).find("input[type='text']").eq(0).attr("ProdHier", Prodselstr);
        }

        if (Locselstr == "") { }           //Location Access
        else if (Locselstr == "0|0") {
            $(ctrl).closest("tr").find("td").eq(7).find("input[type='checkbox']").eq(0).prop("checked", true);
            fnSelectAll($(ctrl).closest("tr").find("td").eq(7).find("input[type='checkbox']").eq(0), 2);
        }
        else {
            $(ctrl).closest("tr").find("td").eq(7).find("input[type='text']").eq(0).val(Locstr);
            $(ctrl).closest("tr").find("td").eq(7).find("input[type='text']").eq(0).attr("ProdLvl", LocLvl);
            $(ctrl).closest("tr").find("td").eq(7).find("input[type='text']").eq(0).attr("ProdHier", Locselstr);
        }


        if (Chanselstr == "") { }           //Channel Access
        else if (Chanselstr == "0|0") {
            $(ctrl).closest("tr").find("td").eq(8).find("input[type='checkbox']").eq(0).prop("checked", true);
            fnSelectAll($(ctrl).closest("tr").find("td").eq(8).find("input[type='checkbox']").eq(0), 3);
        }
        else {
            $(ctrl).closest("tr").find("td").eq(8).find("input[type='text']").eq(0).val(Chanstr);
            $(ctrl).closest("tr").find("td").eq(8).find("input[type='text']").eq(0).attr("ProdLvl", ChanLvl);
            $(ctrl).closest("tr").find("td").eq(8).find("input[type='text']").eq(0).attr("ProdHier", Chanselstr);
        }

        if (ExtraProdselstr != "") {    //Sec Product Access
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").eq(0).val(ExtraProdstr);
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").eq(0).attr("ProdLvl", ExtraProdLvl);
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").eq(0).attr("ProdHier", ExtraProdselstr);
        }

    }

    $(ctrl).closest("tr").find("td").eq(10).html("<input type='text' style='width:98%; box-sizing: border-box;' value='" + MSMPAlies + "' />");
    $(ctrl).closest("tr").find("td:last").html("<img src='../../Images/save.png' title='save' onclick='fnSave(this);' style='margin-right: 12px;'/><img src='../../Images/cancel.png' title='cancel' onclick='fnCancel(this);'/>");
}
function fnCancel(ctrl) {
    var UserID = $(ctrl).closest("tr").attr("UserID");
    if (UserID == "0") {
        $(ctrl).closest("tr").remove();
    }
    else {
        var Name = $(ctrl).closest("tr").attr("Name");
        var EmailID = $(ctrl).closest("tr").attr("EmailID");
        var Active = $(ctrl).closest("tr").attr("Active");
        var Role = $(ctrl).closest("tr").attr("Role");
        var RoleId = $(ctrl).closest("tr").attr("RoleId");
        var CorpUser = $(ctrl).closest("tr").attr("CorpUser");
        var MSMPAlies = $(ctrl).closest("tr").attr("MSMPAlies");

        var Prodstr = $(ctrl).closest("tr").attr("Prodstr");
        var Prodtooltip = $(ctrl).closest("tr").attr("Prodtooltip");
        var Locstr = $(ctrl).closest("tr").attr("Locationstr");
        var Locationtooltip = $(ctrl).closest("tr").attr("Locationtooltip");
        var Chanstr = $(ctrl).closest("tr").attr("Channelstr");
        var Channeltooltip = $(ctrl).closest("tr").attr("Channeltooltip");
        var ExtraProdstr = $(ctrl).closest("tr").attr("ExtraProdstr");
        var ExtraProdtooltip = $(ctrl).closest("tr").attr("ExtraProdtooltip");

        $(ctrl).closest("tr").find("td").eq(1).html(Name);
        $(ctrl).closest("tr").find("td").eq(2).html(EmailID);
        $(ctrl).closest("tr").find("td").eq(3).html(Active);
        $(ctrl).closest("tr").find("td").eq(4).html(Role);
        if (CorpUser == 1) {
            $(ctrl).closest("tr").find("td").eq(5).html("<span>Yes</span>");
        }
        else {
            $(ctrl).closest("tr").find("td").eq(5).html("<span>No</span>");
        }

        if (Prodtooltip != "")
            $(ctrl).closest("tr").find("td").eq(6).html("<span title='" + Prodtooltip + "' class='clsInform'>" + Prodstr + "</span>");
        else
            $(ctrl).closest("tr").find("td").eq(6).html("<span>" + Prodstr + "</span>");

        if (Locationtooltip != "")
            $(ctrl).closest("tr").find("td").eq(7).html("<span title='" + Locationtooltip + "' class='clsInform'>" + Locstr + "</span>");
        else
            $(ctrl).closest("tr").find("td").eq(7).html("<span>" + Locstr + "</span>");

        if (Channeltooltip != "")
            $(ctrl).closest("tr").find("td").eq(8).html("<span title='" + Channeltooltip + "' class='clsInform'>" + Chanstr + "</span>");
        else
            $(ctrl).closest("tr").find("td").eq(8).html("<span>" + Chanstr + "</span>");

        if (ExtraProdtooltip != "")
            $(ctrl).closest("tr").find("td").eq(9).html("<span title='" + ExtraProdtooltip + "' class='clsInform'>" + ExtraProdstr + "</span>");
        else
            $(ctrl).closest("tr").find("td").eq(9).html("<span>" + ExtraProdstr + "</span>");

        $(ctrl).closest("tr").find("td").eq(10).html(MSMPAlies);
        $(ctrl).closest("tr").find("td:last").html("<img src='../../Images/edit.png' onclick='fnEdit(this);'/>");

        Tooltip(".clsInform");
    }
}

function fnSave(ctrl) {
    var BucketValues = [];
    var BucketExtraBucket = [];
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $(ctrl).closest("tr").attr("UserID");

    var Name = $(ctrl).closest("tr").find("td").eq(1).find("input[type='text']").eq(0).val();
    var EmailID = $(ctrl).closest("tr").find("td").eq(2).find("input[type='text']").eq(0).val();
    var Status = 0;
    if ($(ctrl).closest("tr").find("td").eq(3).find("input[type='checkbox']").is(':checked')) {
        Status = 1;
    }
    var Role = $(ctrl).closest("tr").find("td").eq(4).find("Select").eq(0).val();
    var CorpUser = 0;
    if ($(ctrl).closest("tr").find("td").eq(5).find("input[type='checkbox']").is(':checked')) {
        CorpUser = 1;
    }

    var SelectAllProduct = 0;
    var ProductString = $(ctrl).closest("tr").find("td").eq(6).find("input[type='text'][iden='ProductHier']").eq(0).attr("ProdHier");
    if ($(ctrl).closest("tr").find("td").eq(6).find("input[type='checkbox']").is(':checked')) {
        SelectAllProduct = 1;
        ProductString = "";
    }
    else {
        if (ProductString === undefined || ProductString === null) {
            ProductString = "";
        }
    }

    var SelectAllLocation = 0;
    var LocationString = $(ctrl).closest("tr").find("td").eq(7).find("input[type='text'][iden='ProductHier']").eq(0).attr("ProdHier");
    if ($(ctrl).closest("tr").find("td").eq(7).find("input[type='checkbox']").is(':checked')) {
        SelectAllLocation = 1;
        LocationString = "";
    }
    else {
        if (LocationString === undefined || LocationString === null) {
            LocationString = "";
        }
    }

    var SelectAllChannel = 0;
    var ChannelString = $(ctrl).closest("tr").find("td").eq(8).find("input[type='text'][iden='ProductHier']").eq(0).attr("ProdHier");
    if ($(ctrl).closest("tr").find("td").eq(8).find("input[type='checkbox']").is(':checked')) {
        SelectAllChannel = 1;
        ChannelString = "";
    }
    else {
        if (ChannelString === undefined || ChannelString === null) {
            ChannelString = "";
        }
    }

    var ExtraProductString = $(ctrl).closest("tr").find("td").eq(9).find("input[type='text'][iden='ProductHier']").eq(0).attr("ProdHier");
    if (ExtraProductString === undefined || ExtraProductString === null) {
        ExtraProductString = "";
    }

    if (Name == "") {
        alert("Please enter the Name !");
        return false;
    }
    else if (EmailID == "") {
        alert("Please enter the EmailID !");
        return false;
    }
    else if (Role == "0") {
        alert("Please select the Role !");
        return false;
    }
    else if ((Role == "3" || Role == "1015" || Role == "4" || Role == "1012") && SelectAllProduct == "0" && ProductString == "") {
        alert("Please select the Accessible Product/s !");
        return false;
    }
    else if ((Role == "3" || Role == "1015" || Role == "4" || Role == "1012") && SelectAllLocation == "0" && LocationString == "") {
        alert("Please select the Accessible Location/s !");
        return false;
    }
    else if ((Role == "3" || Role == "1015" || Role == "4" || Role == "1012") && SelectAllChannel == "0" && ChannelString == "") {
        alert("Please select the Accessible Channel/s !");
        return false;
    }

    if (Role == "3" || Role == "1015" || Role == "4" || Role == "1012") {
        if (SelectAllProduct == "0") {
            for (var i = 0; i < ProductString.split("^").length; i++) {
                BucketValues.push({
                    "col1": ProductString.split("^")[i].split("|")[0],
                    "col2": ProductString.split("^")[i].split("|")[1],
                    "col3": 1
                });
            }
        }
        else {
            ProductString = "0|0";
            BucketValues.push({ "col1": 0, "col2": 0, "col3": 1 });
        }

        if (SelectAllLocation == "0") {
            for (var i = 0; i < LocationString.split("^").length; i++) {
                BucketValues.push({
                    "col1": LocationString.split("^")[i].split("|")[0],
                    "col2": LocationString.split("^")[i].split("|")[1],
                    "col3": 2
                });
            }
        }
        else {
            LocationString = "0|0";
            BucketValues.push({ "col1": 0, "col2": 0, "col3": 2 });
        }

        if (SelectAllChannel == "0") {
            for (var i = 0; i < ChannelString.split("^").length; i++) {
                BucketValues.push({
                    "col1": ChannelString.split("^")[i].split("|")[0],
                    "col2": ChannelString.split("^")[i].split("|")[1],
                    "col3": 3
                });
            }
        }
        else {
            ChannelString = "0|0";
            BucketValues.push({ "col1": 0, "col2": 0, "col3": 3 });
        }

        if (ExtraProductString != "") {
            for (var i = 0; i < ExtraProductString.split("^").length; i++) {
                BucketExtraBucket.push({
                    "col1": ExtraProductString.split("^")[i].split("|")[0],
                    "col2": ExtraProductString.split("^")[i].split("|")[1],
                    "col3": 4
                });
            }
        }
        else {
            BucketExtraBucket.push({ "col1": 0, "col2": 0, "col3": 0 });
        }

    }
    else {
        BucketValues.push({ "col1": 0, "col2": 0, "col3": 0 });
        BucketExtraBucket.push({ "col1": 0, "col2": 0, "col3": 0 });
    }

    var MSMPAlies = $(ctrl).closest("tr").find("td").eq(10).find("input[type='text']").eq(0).val();

    var flg = 0;
    if (UserID != "0")
        flg = 1;

    $("#dvloader").show();
    PageMethods.fnSave(LoginID, UserID, Name, EmailID, Status, Role, BucketValues, CorpUser, ProductString, LocationString, ChannelString, BucketExtraBucket, ExtraProductString, MSMPAlies, fnSave_pass, fnfailed, flg);
}
function fnSave_pass(res, flg) {
    if (res.split("|^|")[0] == "-1") {
        alert("User already exist !");
        $("#dvloader").hide();
    }
    else if (res.split("|^|")[0] == "-2") {
        alert("Please Contact the Administrator !");
        $("#dvloader").hide();
    }
    else if (res.split("|^|")[0] == "-3") {
        if (flg == 0) {
            alert("User saved successfully !");
        }
        else {
            alert("User updated successfully !");
        }
        fnGetTableData();
    }
    else {
        fnfailed();
    }
}

function fnCheckRole(ctrl) {
    $(ctrl).closest("tr").find("td").eq(5).html("<input id='chkCorpUser' type='checkbox' onclick='fnSelectCorpUser(this);'/>");
    fnEnableDisableAccess(ctrl);
}
function fnSelectCorpUser(ctrl) {
    fnEnableDisableAccess(ctrl);
}
function fnSelectAll(ctrl, cntr) {
    var colIndex = 0;
    var txt = "", txt2 = "";
    var RoleID = $(ctrl).closest("tr").find("td").eq(4).find("select").eq(0).val();

    switch (cntr) {
        case 1:
            colIndex = 6;
            txt = "Product";
            txt2 = "All Products";
            break;
        case 2:
            colIndex = 7;
            txt = "Location";
            txt2 = "All India";
            break;
        case 3:
            colIndex = 8;
            txt = "Channel";
            txt2 = "All Channels";
            break;
    }

    if ($(ctrl).is(':checked')) {
        $(ctrl).closest("td").find("input[type='text']").val(txt2);
        $(ctrl).closest("td").find("input[type='text']").attr("ProdLvl", "");
        $(ctrl).closest("td").find("input[type='text']").attr("ProdHier", "");
        $(ctrl).closest("td").find("input[type='text']").prop("disabled", true);

        if (cntr == 1 && (RoleID == "3" || RoleID == "1015")) {
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").val("");
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").attr("ProdLvl", "");
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").attr("ProdHier", "");
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").prop("disabled", true);
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").attr("placeholder", "");
        }
    }
    else {
        $(ctrl).closest("td").find("input[type='text']").val("");
        $(ctrl).closest("td").find("input[type='text']").attr("ProdLvl", "");
        $(ctrl).closest("td").find("input[type='text']").attr("ProdHier", "");
        $(ctrl).closest("td").find("input[type='text']").prop("disabled", false);

        if (cntr == 1 && (RoleID == "3" || RoleID == "1015")) {
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").val("");
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").attr("ProdLvl", "");
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").attr("ProdHier", "");
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").prop("disabled", false);
            $(ctrl).closest("tr").find("td").eq(9).find("input[type='text']").attr("placeholder", "Click to select Product..");
        }
    }
}
function fnEnableDisableAccess(ctrl) {
    var RoleID = $(ctrl).closest("tr").find("td").eq(4).find("select").eq(0).val();
    var IsCorpUser = $(ctrl).closest("tr").find("td").eq(5).find("input[type='checkbox']").eq(0).is(":checked");

    if ((RoleID == "3" || RoleID == "1015") && !IsCorpUser) {
        $(ctrl).closest("tr").find("td").eq(9).html("<input type='text' iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..'/>");
    }
    else {
        $(ctrl).closest("tr").find("td").eq(9).html("<input type='text' iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='' disabled/>");
    }

    if (IsCorpUser) {
        $(ctrl).closest("tr").find("td").eq(6).html("<input type='checkbox' onclick='fnSelectAll(this,1);' disabled checked/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..' value='All Products'/>");
        $(ctrl).closest("tr").find("td").eq(7).html("<input type='checkbox' onclick='fnSelectAll(this,2);' disabled checked/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 2);' placeholder='Click to select Location..' value='All India'/>");
        $(ctrl).closest("tr").find("td").eq(8).html("<input type='checkbox' onclick='fnSelectAll(this,3);' disabled checked/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 3);' placeholder='Click to select Channel..' value='All Channels'/>");
    }
    else {
        switch (RoleID) {
            case "3":
                $(ctrl).closest("tr").find("td").eq(6).html("<input type='checkbox' onclick='fnSelectAll(this,1);'/><input type='text'  iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..'/>");
                $(ctrl).closest("tr").find("td").eq(7).html("<input type='checkbox' onclick='fnSelectAll(this,2);'/><input type='text'  iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 2);' placeholder='Click to select Location..'/>");
                $(ctrl).closest("tr").find("td").eq(8).html("<input type='checkbox' onclick='fnSelectAll(this,3);'/><input type='text'  iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 3);' placeholder='Click to select Channel..'/>");
                break;
            case "1015":
                $(ctrl).closest("tr").find("td").eq(6).html("<input type='checkbox' onclick='fnSelectAll(this,1);'/><input type='text'  iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..'/>");
                $(ctrl).closest("tr").find("td").eq(7).html("<input type='checkbox' onclick='fnSelectAll(this,2);'/><input type='text'  iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 2);' placeholder='Click to select Location..'/>");
                $(ctrl).closest("tr").find("td").eq(8).html("<input type='checkbox' onclick='fnSelectAll(this,3);'/><input type='text'  iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 3);' placeholder='Click to select Channel..'/>");
                break;
            case "4":
                $(ctrl).closest("tr").find("td").eq(6).html("<input type='checkbox' onclick='fnSelectAll(this,1);'/><input type='text'  iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..'/>");
                $(ctrl).closest("tr").find("td").eq(7).html("<input type='checkbox' onclick='fnSelectAll(this,2);'/><input type='text'  iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 2);' placeholder='Click to select Location..'/>");
                $(ctrl).closest("tr").find("td").eq(8).html("<input type='checkbox' onclick='fnSelectAll(this,3);'/><input type='text'  iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 3);' placeholder='Click to select Channel..'/>");
                break;
            case "1012":
                $(ctrl).closest("tr").find("td").eq(6).html("<input type='checkbox' onclick='fnSelectAll(this,1);'/><input type='text'  iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..'/>");
                $(ctrl).closest("tr").find("td").eq(7).html("<input type='checkbox' onclick='fnSelectAll(this,2);' disabled checked/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 2);' placeholder='Click to select Location..' value='All India'/>");
                $(ctrl).closest("tr").find("td").eq(8).html("<input type='checkbox' onclick='fnSelectAll(this,3);' disabled checked/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 3);' placeholder='Click to select Channel..' value='All Channels'/>");
                break;
            default:
                $(ctrl).closest("tr").find("td").eq(5).html("<input id='chkCorpUser' type='checkbox' disabled onclick='fnSelectCorpUser(this);'/>");
                $(ctrl).closest("tr").find("td").eq(6).html("<input type='checkbox' disabled onclick='fnSelectAll(this,1);'/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 1);' placeholder=''/>");
                $(ctrl).closest("tr").find("td").eq(7).html("<input type='checkbox' disabled onclick='fnSelectAll(this,2);'/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 2);' placeholder=''/>");
                $(ctrl).closest("tr").find("td").eq(8).html("<input type='checkbox' disabled onclick='fnSelectAll(this,3);'/><input type='text' disabled iden='ProductHier' ProdLvl='' ProdHier='' onclick='fnShowProdHierPopup(this, 3);' placeholder=''/>");
                break;
        }
    }
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
    $("#ConatntMatter_hdnBucketType").val(cntr);
    $("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("tr").removeClass("Active");
    $("#divHierPopupTbl").html("<div style='font-size: 0.9rem; font-weight: 600; margin-top: 25%; text-align: center;'>Please Select the Level from Left</div>");
    

    var title = "";
    if (cntr == "1") {
        title = "Product/s :";
        $("#ProdLvl").html($("#ConatntMatter_hdnProductLvl").val());
    }
    else if (cntr == "2") {
        title = "Site/s :";
        $("#ProdLvl").html($("#ConatntMatter_hdnLocationLvl").val());
    }
    else {
        title = "Channel/s :";
        $("#ProdLvl").html($("#ConatntMatter_hdnChannelLvl").val());
    }
    $("#divHierPopup").dialog({
        "modal": true,
        "width": "92%",
        "height": "560",
        "title": title,
        open: function () {
            if (cntr == "1") {
                $("#divHierSelectionTbl").html(GetHierTblFormat("1"));
                $("#PopupHierlbl").html("Product Hierarchy");
            }
            else if (cntr == "2") {
                $("#divHierSelectionTbl").html(GetHierTblFormat("2"));
                $("#PopupHierlbl").html("Location Hierarchy");
            }
            else {
                $("#divHierSelectionTbl").html(GetHierTblFormat("3"));
                $("#PopupHierlbl").html("Channel Hierarchy");
            }

            if ($(ctrl).attr("ProdLvl") != "") {
                $("#ConatntMatter_hdnSelectedHier").val($(ctrl).attr("ProdHier"));
                fnProdLvl($("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("td[ntype='" + $(ctrl).attr("ProdLvl") + "']").eq(0));
            }
            else
                $("#ConatntMatter_hdnSelectedHier").val("");

        },
        close: function () {
            //
        },
        buttons: {
            "Select": function () {
                var SelectedHierValues = fnProdSelected().split("||||");
                if (SelectedHierValues[2] != "") {
                    var descr = SelectedHierValues[2];
                    if (descr.length > 15) {
                        descr = descr.substring(0, 12) + "...";
                    }
                    $(ctrl).val(descr);
                    $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
                    $(ctrl).attr("ProdHier", SelectedHierValues[1]);
                }
                else {
                    $(ctrl).val("");
                    $(ctrl).attr("ProdLvl", "");
                    $(ctrl).attr("ProdHier", "");
                }

                $("#divHierPopup").dialog('close');
            },
            "Reset": function () {
                fnHierPopupReset();
            },
            "Cancel": function () {
                $("#divHierPopup").dialog('close');
            }
        }
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
                "col3": $("#ConatntMatter_hdnBucketType").val()
            });
        }
    }

    if ($("#ConatntMatter_hdnBucketType").val() == "1") {
        PageMethods.fnProdHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "1", BucketValues, fnProdHier_pass, fnProdHier_failed);
    }
    else if ($("#ConatntMatter_hdnBucketType").val() == "2") {
        PageMethods.fnLocationHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "1", BucketValues, "0", fnProdHier_pass, fnProdHier_failed);
    }
    else {
        PageMethods.fnChannelHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "1", BucketValues, fnProdHier_pass, fnProdHier_failed);
    }
}

function fnHierPopupReset() {
    $("#divHierSelectionTbl").find("tbody").eq(0).html("");
    $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
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

