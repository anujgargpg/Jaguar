var ht = 0;
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

function fnfailed() {
    AutoHideAlertMsg("Due to some technical reasons, we are unable to process your request !");
    $("#dvloader").hide();
}

$(document).ready(function () {
    ht = $(window).height();
    $("#divReport").height(ht - ($("#Heading").height() + $("#Filter").height() + $("#ConatntMatter_TabHead").height() + $("#AddNewBtn").height() + 170));

    $("#txtFromDate").datepicker({
        dateFormat: 'dd-M-yy',
        onSelect: function () {
            //$("#txtToDate").datepicker('show');
        }
    });
    $("#txtToDate").datepicker({
        dateFormat: 'dd-M-yy'
    });

    fnBucketType();
});

function fnBucketTypeSel(ctrl) {
    $("#ConatntMatter_TabHead").find("a").removeClass("active");
    $(ctrl).find("a").eq(0).addClass("active");
    $("#ConatntMatter_hdnBucketType").val($(ctrl).attr("BucketTypeID"));

    fnBucketType();
}

function fnResetFilter() {
    $("#txtFromDate").val("");
    $("#txtToDate").val("");
    $("#txtfilter").val("");// Add Code for reset the filter text box.(Abhishek)
    $("#txtProductHierSearch").attr("InSubD", "0");
    $("#txtProductHierSearch").attr("prodhier", "");
    $("#txtProductHierSearch").attr("prodlvl", "");
    $("#txtLocationHierSearch").attr("InSubD", "0");
    $("#txtLocationHierSearch").attr("prodhier", "");
    $("#txtLocationHierSearch").attr("prodlvl", "");
    $("#txtChannelHierSearch").attr("InSubD", "0");
    $("#txtChannelHierSearch").attr("prodhier", "");
    $("#txtChannelHierSearch").attr("prodlvl", "");
    fntypefilterReset(); // Add a new function for reset the filter text box and show the data in table.(Abhishek)
}

function fnBucketType() {
    fnResetFilter();
    if ($("#ConatntMatter_hdnBucketType").val() == "1") {
        $("#txtProductHierSearch").show();
        $("#txtLocationHierSearch").hide();
        $("#txtChannelHierSearch").hide();
        $("#ProdLvl").html($("#ConatntMatter_hdnProductLvl").val());
    }
    else if ($("#ConatntMatter_hdnBucketType").val() == "2") {
        $("#txtProductHierSearch").hide();
        $("#txtLocationHierSearch").show();
        $("#txtChannelHierSearch").hide();
        $("#ProdLvl").html($("#ConatntMatter_hdnLocationLvl").val());
    }
    else {
        $("#txtProductHierSearch").hide();
        $("#txtLocationHierSearch").hide();
        $("#txtChannelHierSearch").show();
        $("#ProdLvl").html($("#ConatntMatter_hdnChannelLvl").val());
    }
    fnGetReport();
}

function fnReset() {
    fnResetFilter();
    fnSearch();
}
function fnSearch() {
    fnGetReport();
}
function fnGetReport() {
    $("#txtfilter").val('');
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var BucketType = $("#ConatntMatter_hdnBucketType").val();
    var BucketValues = [];

    var PrdString = "";
    if (BucketType == "1")
        PrdString = $("#txtProductHierSearch").attr("prodhier");
    else if (BucketType == "2")
        PrdString = $("#txtLocationHierSearch").attr("prodhier");
    else if (BucketType == "3")
        PrdString = $("#txtChannelHierSearch").attr("prodhier");

    var Initiatives = [];
    var FromDate = $("#txtFromDate").val();
    var ToDate = $("#txtToDate").val();
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
    PageMethods.fnGetReport(LoginID, UserID, BucketType, BucketValues, Initiatives, FromDate, ToDate, fnGetReport_pass, fnfailed);
}
function fnGetReport_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divReport").html(res.split("|^|")[1]);

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
        Tooltip(".clsInform");

        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}

function fnAddNew() {
    var str = "";
    str += "<tr bucket='0' style='display: table-row;'>";
    str += "<td></td>";
    str += "<td><input type='text' style='box-sizing: border-box;' value=''/></td>";
    str += "<td><textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'></textarea></td>";
    if ($("#ConatntMatter_hdnBucketType").val() == "1")
        str += "<td><span><input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='0' prodlvl='' prodhier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..'/></span><img src='../../Images/paste.png' title='paste' onclick='fnpasteprod(this);' style='float:right;'/></td>";
    else if ($("#ConatntMatter_hdnBucketType").val() == "2")
        str += "<td><span><input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='1' prodlvl='' prodhier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Site..'/></span><img src='../../Images/paste.png' title='paste' onclick='fnpasteprod(this);' style='float:right;'/></td>";
    else
        str += "<td><span><input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='0' prodlvl='' prodhier='' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Channel..'/></span><img src='../../Images/paste.png' title='paste' onclick='fnpasteprod(this);' style='float:right;'/></td>";
    str += "<td></td>";
    str += "<td></td>";
    str += "<td class='clstdAction'><img src='../../Images/save.png' title='save' onclick='fnSave(this, 0);' style='margin-right: 12px;'/><img src='../../Images/cancel.png' title='cancel' onclick='fnCancel(this);'/></td>";
    str += "</tr>";
    if ($("#tblReport").find("tbody").eq(0).find("tr").length == 0) {
        $("#tblReport").find("tbody").eq(0).html(str);
    }
    else {
        $("#tblReport").find("tbody").eq(0).prepend(str);
    }

    $("#tblReport").find("tbody").eq(0).find("tr").eq(0).find("textarea").eq(0).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}
function fnEdit(ctrl) {
    var Descr = $(ctrl).closest("tr").find("td").eq(2).attr("title");
    var InSubD = $(ctrl).closest("tr").attr("InSubD");
    var ProdLvl = $(ctrl).closest("tr").attr("ProdLvl");
    var Prodstr = $(ctrl).closest("tr").attr("Prodstr");
    var Bucketstr = $(ctrl).closest("tr").attr("Bucketstr");
    var Prodselstr = $(ctrl).closest("tr").attr("Prodselstr");

    $(ctrl).closest("tr").find("td").eq(1).html("<input type='text'  style='box-sizing: border-box;' value='" + Bucketstr + "' />");
    $(ctrl).closest("tr").find("td").eq(2).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'>" + Descr + "</textarea>");
    if ($("#ConatntMatter_hdnBucketType").val() == "1")
        $(ctrl).closest("tr").find("td").eq(3).find("span").eq(0).html("<input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='" + InSubD + "' ProdLvl='" + ProdLvl + "' ProdHier='" + Prodselstr + "' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..' value='" + Prodstr + "'/>");
    else if ($("#ConatntMatter_hdnBucketType").val() == "2")
        $(ctrl).closest("tr").find("td").eq(3).find("span").eq(0).html("<input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='" + InSubD + "' ProdLvl='" + ProdLvl + "' ProdHier='" + Prodselstr + "' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Site..' value='" + Prodstr + "'/>");
    else
        $(ctrl).closest("tr").find("td").eq(3).find("span").eq(0).html("<input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='" + InSubD + "' ProdLvl='" + ProdLvl + "' ProdHier='" + Prodselstr + "' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Channel..' value='" + Prodstr + "'/>");
    $(ctrl).closest("tr").find("td").eq(3).find("img").eq(0).attr("title", "paste");
    $(ctrl).closest("tr").find("td").eq(3).find("img").eq(0).attr("src", "../../Images/paste.png");
    $(ctrl).closest("tr").find("td").eq(3).find("img").eq(0).attr("onclick", "fnpasteprod(this);");

    $(ctrl).closest("tr").find("textarea").eq(0).css("height", "auto");
    $(ctrl).closest("tr").find("textarea").eq(0).css("height", $(ctrl).closest("tr").find("textarea")[0].scrollHeight + "px");
    $(ctrl).closest("tr").find("textarea").eq(0).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    $(ctrl).closest("tr").find("td:last").html("<img src='../../Images/save.png' title='save' onclick='fnSave(this, 1);' style='margin-right: 12px;'/><img src='../../Images/cancel.png' title='cancel' onclick='fnCancel(this);'/>");
}
function fnCopy(ctrl) {
    var Descr = $(ctrl).closest("tr").find("td").eq(2).attr("title");
    var InSubD = $(ctrl).closest("tr").attr("InSubD");
    var ProdLvl = $(ctrl).closest("tr").attr("ProdLvl");
    var Prodstr = $(ctrl).closest("tr").attr("Prodstr");
    var Bucketstr = $(ctrl).closest("tr").attr("Bucketstr");
    var Prodselstr = $(ctrl).closest("tr").attr("Prodselstr");

    var str = "";
    str += "<tr bucket='0' style='display: table-row;'>";
    str += $(ctrl).closest("tr").html();
    str += "</tr>";
    $(ctrl).closest("tr").before(str);

    var tr = $(ctrl).closest("tr").prev();
    tr.find("td").eq(0).html("");
    tr.find("td").eq(1).html("<input type='text'  style='box-sizing: border-box;' value='" + Bucketstr + "' />");
    tr.find("td").eq(2).html("<textarea style='width:98%; box-sizing: border-box; overflow-y: hidden;' rows='1'>" + Descr + "</textarea>");
    if ($("#ConatntMatter_hdnBucketType").val() == "1")
        tr.find("td").eq(3).find("span").eq(0).html("<input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='" + InSubD + "' ProdLvl='" + ProdLvl + "' ProdHier='" + Prodselstr + "' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..' value='" + Prodstr + "'/>");
    else if ($("#ConatntMatter_hdnBucketType").val() == "2")
        tr.find("td").eq(3).find("span").eq(0).html("<input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='" + InSubD + "' ProdLvl='" + ProdLvl + "' ProdHier='" + Prodselstr + "' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Site..' value='" + Prodstr + "'/>");
    else
        tr.find("td").eq(3).find("span").eq(0).html("<input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='" + InSubD + "' ProdLvl='" + ProdLvl + "' ProdHier='" + Prodselstr + "' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Channel..' value='" + Prodstr + "'/>");
    tr.find("td").eq(3).find("img").eq(0).attr("title", "paste");
    tr.find("td").eq(3).find("img").eq(0).attr("src", "../../Images/paste.png");
    tr.find("td").eq(3).find("img").eq(0).attr("onclick", "fnpasteprod(this);");

    tr.find("textarea").eq(0).css("height", "auto");
    tr.find("textarea").eq(0).css("height", tr.find("textarea")[0].scrollHeight + "px");
    tr.find("textarea").eq(0).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    tr.find("td:last").html("<img src='../../Images/save.png' title='save' onclick='fnSave(this, 0);' style='margin-right: 12px;'/><img src='../../Images/cancel.png' title='cancel' onclick='fnCancel(this);'/>");
}
function fnCancel(ctrl) {
    var BucketID = $(ctrl).closest("tr").attr("bucket");
    if (BucketID == "0") {
        $(ctrl).closest("tr").remove();
    }
    else {
        var Descr = $(ctrl).closest("tr").attr("Descr");
        var Prodstr = $(ctrl).closest("tr").attr("Prodstr");
        var Bucketstr = $(ctrl).closest("tr").attr("Bucketstr");

        $(ctrl).closest("tr").find("td").eq(1).html(Bucketstr);
        $(ctrl).closest("tr").find("td").eq(2).html(Descr);
        $(ctrl).closest("tr").find("td").eq(3).find("span").eq(0).html(Prodstr);
        $(ctrl).closest("tr").find("td").eq(3).find("img").eq(0).attr("title", "copy");
        $(ctrl).closest("tr").find("td").eq(3).find("img").eq(0).attr("src", "../../Images/copy.png");
        $(ctrl).closest("tr").find("td").eq(3).find("img").eq(0).attr("onclick", "fncopyprod(this);");
        $(ctrl).closest("tr").find("td:last").html("<img src='../../Images/copy.png' title='copy' onclick='fnCopy(this);' style='margin-right: 12px;'/><img src='../../Images/edit.png' title='edit' onclick='fnEdit(this);'/>");
    }
}
function fnSave(ctrl, flg) {
    var BucketID = $(ctrl).closest("tr").attr("bucket");
    var BucketType = $("#ConatntMatter_hdnBucketType").val();
    var BucketName = $(ctrl).closest("tr").find("td").eq(1).find("input[type='text']").eq(0).val();
    var BucketDescr = $(ctrl).closest("tr").find("td").eq(2).find("textarea").eq(0).val();
    var BucketValues = [];
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var flgActive = "1";
    var InSubD = $(ctrl).closest("tr").find("td").eq(3).find("input[type='text'][iden='ProductHier']").eq(0).attr("InSubD");
    var PrdLvl = $(ctrl).closest("tr").find("td").eq(3).find("input[type='text'][iden='ProductHier']").eq(0).attr("ProdLvl");
    var PrdString = $(ctrl).closest("tr").find("td").eq(3).find("input[type='text'][iden='ProductHier']").eq(0).attr("ProdHier");
    var INITArr = [];

    if (BucketType == "0") {
        AutoHideAlertMsg("Please select the Bucket Type !");
        return false;
    }
    else if (BucketName == "") {
        AutoHideAlertMsg("Please enter the Bucket Name !");
        return false;
    }
    else if (BucketDescr == "") {
        AutoHideAlertMsg("Please enter the Bucket Description !");
        return false;
    }
    else if (PrdString == "") {
        if ($("#ConatntMatter_hdnBucketType").val() == "1")
            AutoHideAlertMsg("Please select the Product/s !");
        else if ($("#ConatntMatter_hdnBucketType").val() == "2")
            AutoHideAlertMsg("Please select the Site/s !");
        else
            AutoHideAlertMsg("Please select the Channel/s !");
        return false;
    }
    else {
        for (var i = 0; i < PrdString.split("^").length; i++) {
            BucketValues.push({
                "col1": PrdString.split("^")[i].split("|")[0],
                "col2": PrdString.split("^")[i].split("|")[1],
                "col3": $("#ConatntMatter_hdnBucketType").val()
            });
        }

        if (BucketID != "0" && flg == 1) {
            $("#dvloader").show();
            PageMethods.fnGetInitiativelst(BucketID, BucketType, fnGetInitiativelst_pass, fnfailed, ctrl);
        }
        else {
            INITArr.push({
                "col1": "0"
            });

            var flgExisting = 0
            if (BucketID != "0")
                flgExisting = 1;

            $("#dvloader").show();
            PageMethods.fnSave(BucketID, BucketName, BucketDescr, BucketType, flgActive, BucketValues, LoginID, PrdLvl, PrdString, InSubD, INITArr, fnSave_pass, fnfailed, flgExisting);
        }
    }
}
function fnGetInitiativelst_pass(res, ctrl) {
    if (res.split("|^|")[0] == "0") {
        if (res.split("|^|")[1] != "") {
            $("#dvloader").hide();
            $("#divConfirm").html(res.split("|^|")[1]);
            $("#divConfirm").dialog({
                "modal": true,
                "width": "340",
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

                        var BucketID = $(ctrl).closest("tr").attr("bucket");
                        var BucketType = $("#ConatntMatter_hdnBucketType").val();
                        var BucketName = $(ctrl).closest("tr").find("td").eq(1).find("input[type='text']").eq(0).val();
                        var BucketDescr = $(ctrl).closest("tr").find("td").eq(2).find("textarea").eq(0).val();
                        var BucketValues = [];
                        var LoginID = $("#ConatntMatter_hdnLoginID").val();
                        var flgActive = "1";
                        var InSubD = $(ctrl).closest("tr").find("td").eq(3).find("input[type='text'][iden='ProductHier']").eq(0).attr("InSubD");
                        var PrdLvl = $(ctrl).closest("tr").find("td").eq(3).find("input[type='text'][iden='ProductHier']").eq(0).attr("ProdLvl");
                        var PrdString = $(ctrl).closest("tr").find("td").eq(3).find("input[type='text'][iden='ProductHier']").eq(0).attr("ProdHier");
                        var INITArr = [];

                        for (var i = 0; i < PrdString.split("^").length; i++) {
                            BucketValues.push({
                                "col1": PrdString.split("^")[i].split("|")[0],
                                "col2": PrdString.split("^")[i].split("|")[1],
                                "col3": $("#ConatntMatter_hdnBucketType").val()
                            });
                        }

                        $("#divConfirm").find("li").each(function () {
                            INITArr.push({
                                "col1": $(this).attr("strId")
                            });
                        });

                        $("#dvloader").show();
                        PageMethods.fnSave(BucketID, BucketName, BucketDescr, BucketType, flgActive, BucketValues, LoginID, PrdLvl, PrdString, InSubD, INITArr, fnSave_pass, fnfailed, 1);
                    }
                },
                {
                    text: 'No',
                    class: 'btn-primary',
                    click: function () {
                        $("#divConfirm").dialog('close');
                        fnSave(ctrl, 0);
                    }
                }]
            });
        }
        else {
            fnSave(ctrl, 0);
        }
    }
    else {
        fnfailed();
    }
}
function fnSave_pass(res, flg) {
    if (res.split("|^|")[0] == "0") {
        if (flg == 0)
            AutoHideAlertMsg("Bucket saved successfully !");
        else
            AutoHideAlertMsg("Bucket details updated successfully !");
        fnGetReport();
    }
    else if (res.split("|^|")[0] == "1") {
        AutoHideAlertMsg("Bucket name already exist !");
        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}

function fncopyprod(ctrl) {
    $(ctrl).closest("tbody").find("tr").attr("flgcopyprod", "0");
    $(ctrl).closest("tr").attr("flgcopyprod", "1");
}
function fnpasteprod(ctrl) {
    if ($(ctrl).closest("tbody").find("tr[flgcopyprod='1']").length > 0) {
        var tr = $(ctrl).closest("tbody").find("tr[flgcopyprod='1']").eq(0);

        var InSubD = tr.attr("InSubD");
        var ProdLvl = tr.attr("ProdLvl");
        var Prodstr = tr.attr("Prodstr");
        var Prodselstr = tr.attr("Prodselstr");
        if ($("#ConatntMatter_hdnBucketType").val() == "1")
            $(ctrl).closest("td").find("span").eq(0).html("<input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='" + InSubD + "' ProdLvl='" + ProdLvl + "' ProdHier='" + Prodselstr + "' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Product..' value='" + Prodstr + "'/>");
        else if ($("#ConatntMatter_hdnBucketType").val() == "2")
            $(ctrl).closest("td").find("span").eq(0).html("<input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='" + InSubD + "' ProdLvl='" + ProdLvl + "' ProdHier='" + Prodselstr + "' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Site..' value='" + Prodstr + "'/>");
        else
            $(ctrl).closest("td").find("span").eq(0).html("<input type='text' iden='ProductHier' style='width:90%; box-sizing: border-box;' InSubD='" + InSubD + "' ProdLvl='" + ProdLvl + "' ProdHier='" + Prodselstr + "' onclick='fnShowProdHierPopup(this, 1);' placeholder='Click to select Channel..' value='" + Prodstr + "'/>");
    }
    else {
        var BucketType = $("#ConatntMatter_hdnBucketType").val();
        if (BucketType == "1")
            AutoHideAlertMsg("Please select the Product/s for Mapping !");
        else if (BucketType == "2")
            AutoHideAlertMsg("Please select the Site/s for Mapping !");
        else if (BucketType == "3")
            AutoHideAlertMsg("Please select the Channel/s for Mapping !");

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

function fntypefilterReset() {
    var flgtr = 0;
    var filter = ($("#txtfilter").val()).toUpperCase();

    $("#tblReport").find("tbody").eq(0).find("tr").css("display", "none");
    $("#tblReport").find("tbody").eq(0).find("tr").each(function () {
        if ($(this)[0].innerText.toUpperCase().indexOf(filter) > -1) {
            $(this).css("display", "table-row");
            flgtr = 1;
        }
    });

    $("#divHeader").show();
    $("#divReport").show();
    $("#divMsg").html('');
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
    $("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("tr").removeClass("Active");
    $("#divHierPopupTbl").html("<div style='font-size: 0.9rem; font-weight: 600; margin-top: 25%; text-align: center;'>Please Select the Level from Left</div>");

    var title = "";
    if ($("#ConatntMatter_hdnBucketType").val() == "1")
        title = "Product/s :";
    else if ($("#ConatntMatter_hdnBucketType").val() == "2")
        title = "Site/s :";
    else
        title = "Channel/s :";

    $("#divHierPopup").dialog({
        "modal": true,
        "width": "92%",
        "height": "560",
        "title": title,
        open: function () {
            var strtable = "";
            if ($("#ConatntMatter_hdnBucketType").val() == "1") {
                $("#divHierSelectionTbl").html(GetHierTblFormat("1"));
                $("#PopupHierlbl").html("Product Hierarchy");
            }
            else if ($("#ConatntMatter_hdnBucketType").val() == "2") {
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
            $("#btnAddNewNode").hide();
            $("#divHierPopup").dialog('destroy');
        },
        buttons: [{
            text: 'Select',
            class: 'btn-primary',
            click: function () {
                var SelectedHierValues = fnProdSelected().split("||||");
                if (SelectedHierValues[2] != "") {
                    var descr = SelectedHierValues[2];
                    if (descr.length > 30) {
                        descr = descr.substring(0, 28) + "...";
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

    $("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("tr").removeClass("Active");
    $(ctrl).closest("tr").addClass("Active");

    if ($("#ConatntMatter_hdnSelectedFrmFilter").val() == "1") {
        if ($("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("tr.Active").length > 0) {
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
        }
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
        PageMethods.fnLocationHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "1", BucketValues, InSubD, fnProdHier_pass, fnProdHier_failed);
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




