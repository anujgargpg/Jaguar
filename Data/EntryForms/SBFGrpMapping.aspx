<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="SBFGrpMapping.aspx.cs" Inherits="_SBFGrpMapping" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <script type="text/javascript">
        function AutoHideAlertMsg(msg) {
            var str = "<div id='divAutoHideAlertMsg' style='width: 100%; background-color: transparent; top: 0; position: fixed; z-index: 9999; text-align: center; opacity: 0;'>";
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


        function fnFailed(result) {
            $("#dvloader").hide();
            AutoHideAlertMsg("Error : " + result);
        }
        $(document).ready(function () {

            fnGetReport();
        });

        function fnTypeFilter() {
            fnHideCtrlPopup();
            var filter = $("#txtfilter").val().toUpperCase().split(",");

            if ($("#txtfilter").val().toUpperCase().length > 2) {
                $("#divReport").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "none");

                var flgValid = 0;
                $("#divReport").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
                    flgValid = 1;
                    for (var t = 0; t < filter.length; t++) {
                        if ($(this).find("td").last().html().toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                            flgValid = 0;
                        }
                    }

                    if (flgValid == 1) {
                        $(this).css("display", "table-row");
                    }
                });
            }
            else {
                $("#divReport").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
            }
        }

        function fnGetReport() {
            fnHideCtrlPopup();

            $("#dvloader").show();

            var LoginID = $("#ConatntMatter_hdnLoginID").val();
            var UserID = $("#ConatntMatter_hdnUserID").val();
            var CategoryID = $("#ConatntMatter_ddlCategoryFilter").val();
            var BrandID = ($("#txtBrandFilter").val() == "" ? "0" : $("#txtBrandFilter").attr("selectedid"));
            var BrandFormID = ($("#txtBrandFormFilter").val() == "" ? "0" : $("#txtBrandFormFilter").attr("selectedid"));
            var flgSBFType = $("#ConatntMatter_ddlSBFType").val();

            PageMethods.GetReport(LoginID, UserID, CategoryID, BrandID, BrandFormID, flgSBFType, GetReport_pass, fnFailed);
        }
        function GetReport_pass(result) {
            $("#dvloader").hide();
            $("#txtfilter").val("");

            if (result.split("|^|")[0] == "0") {
                $("#divReport").html(result.split("|^|")[1]);

                var tbl = $("#divReport").find("table").eq(0).attr("id");
                var wid = $("#divReport").find("table").eq(0).width();
                var thead = $("#divReport").find("table").eq(0).find("thead").eq(0).html();
                $("#divHeader").html("<table id='" + tbl + "_header' class='" + $("#" + tbl).attr("class") + "' style='margin-top:-4px; margin-bottom:0; width:" + (wid - 1) + "px; min-width:" + (wid - 1) + "px;'><thead>" + thead + "</thead></table>");
                $("#" + tbl).css("width", wid);

                $("#" + tbl).css("min-width", wid);
                for (i = 0; i < $("#" + tbl).find("th").length; i++) {
                    var th_wid = $("#" + tbl).find("th")[i].clientWidth;
                    $("#" + tbl + "_header").find("th").eq(i).css("min-width", th_wid);
                    $("#" + tbl + "_header").find("th").eq(i).css("width", th_wid);
                    $("#" + tbl).find("th").eq(i).css("min-width", th_wid);
                    $("#" + tbl).find("th").eq(i).css("width", th_wid);
                }
                $("#" + tbl).css("margin-top", "-" + $("#" + tbl + "_header")[0].offsetHeight + "px");


                $("#divReport").height($(window).height() - ($("#Heading").height() + $("#Filter").height() + 180));
            }
            else {
                $("#divHeader").html("");
                $("#divReport").html(result.split("|^|")[1]);
            }
        }


        function fnCategory() {
            fnHideCtrlPopup();

            $("#txtBrandFilter").val("");
            $("#txtBrandFilter").attr("selectedid", "0");

            $("#txtBrandFormFilter").val("");
            $("#txtBrandFormFilter").attr("selectedid", "0");
        }
        function fnShowBrandPopup(ctrl) {
            fnHideCtrlPopup();

            //$("#ctrlbg").show();
            $(ctrl).next().show();
            var filter = $(ctrl).val().trim().toUpperCase();
            var CategoryId = $("#ConatntMatter_ddlCategoryFilter").val();

            var str = "";
            var jsonTbl = $.parseJSON($("#ConatntMatter_hdnBrandMstr").val());
            for (var i = 0; i < jsonTbl.length; i++) {
                if (jsonTbl[i].Brand.toUpperCase().indexOf(filter) > -1) {
                    if (CategoryId == "0" || CategoryId == jsonTbl[i].CatNOdeID.toString()) {
                        str += "<div strId='" + jsonTbl[i].BrandNodeID + "' strtype='b' onclick='fnSelectPopupContent(this);'>";
                        str += jsonTbl[i].Brand;
                        str += "</div>";
                    }
                }
            }

            $(ctrl).next().find("div.popup-content-body").eq(0).html(str);
        }
        function fnShowBrandFormPopup(ctrl) {
            fnHideCtrlPopup();

            //$("#ctrlbg").show();
            $(ctrl).next().show();
            var filter = $(ctrl).val().trim().toUpperCase();
            var CategoryId = $("#ConatntMatter_ddlCategoryFilter").val();
            var BrandID = $("#txtBrandFilter").val() == "" ? "0" : $("#txtBrandFilter").attr("selectedid");

            var str = "";
            var jsonTbl = $.parseJSON($("#ConatntMatter_hdnBrandFormMstr").val());
            for (var i = 0; i < jsonTbl.length; i++) {
                if (jsonTbl[i].BF.toUpperCase().indexOf(filter) > -1) {
                    if (BrandID != "0") {
                        if (BrandID == jsonTbl[i].BrandNodeID.toString()) {
                            str += "<div strId='" + jsonTbl[i].BFNodeID + "' strtype='bf' onclick='fnSelectPopupContent(this);'>";
                            str += jsonTbl[i].BF;
                            str += "</div>";
                        }
                    }
                    else if (CategoryId != "0") {
                        if (CategoryId == jsonTbl[i].CatNOdeID.toString()) {
                            str += "<div strId='" + jsonTbl[i].BFNodeID + "' strtype='bf' onclick='fnSelectPopupContent(this);'>";
                            str += jsonTbl[i].BF;
                            str += "</div>";
                        }
                    }
                    else {
                        str += "<div strId='" + jsonTbl[i].BFNodeID + "' strtype='bf' onclick='fnSelectPopupContent(this);'>";
                        str += jsonTbl[i].BF;
                        str += "</div>";
                    }
                }
            }

            $(ctrl).next().find("div.popup-content-body").eq(0).html(str);
        }

        function fnShowGroupPopup(ctrl) {
            fnHideCtrlPopup();

            //$("#ctrlbg").show();
            $(ctrl).next().show();
            var filter = $(ctrl).val().trim().toUpperCase();
            var BrandId = $(ctrl).closest("tr").attr("brandid");
            var CatNodeID = $(ctrl).closest("tr").attr("CatNodeID");

            var str = "";
            str += "<div strId='0' onclick='fnNewGroup(this);' style='background: #eaf5ff; font-weight: 700;'>New Group</div>";

            var jsonTbl = $.parseJSON($("#ConatntMatter_hdnGroupMstr").val());
            for (var i = 0; i < jsonTbl.length; i++) {
                if (jsonTbl[i].CatNodeID.toString() == "0" || jsonTbl[i].CatNodeID.toString() == CatNodeID) {
                    if (jsonTbl[i].SBFGroupName.toUpperCase().indexOf(filter) > -1) {
                        str += "<div strId='" + jsonTbl[i].SBFGroupID + "' strtype='grp' onclick='fnSelectPopupContent(this);'>";
                        str += jsonTbl[i].SBFGroupName;
                        str += "</div>";
                    }
                }
            }

            $(ctrl).next().find("div.popup-content-body").eq(0).html(str);
            //if ($(ctrl).closest("tr").index() > 5)
            //    $(ctrl).next().css("top", "-208px");
        }

        function fnSelectPopupContent(ctrl) {
            if ($(ctrl).parent().parent().prev().attr("selectedid") != $(ctrl).attr("strId") && $(ctrl).attr("strtype") == "b") {        // Brand Filter Popup 
                $("#txtBrandFormFilter").val("");
                $("#txtBrandFormFilter").attr("selectedid", "0");
            }

            $(ctrl).parent().parent().prev().val($(ctrl).html());
            $(ctrl).parent().parent().prev().attr("selectedid", $(ctrl).attr("strId"));

            fnHideCtrlPopup();
        }
        function fnHideCtrlPopup() {
            //$("#ctrlbg").hide();
            $("div.popup-content").hide();
        }


        function fnNewGroup(ctrl) {
            fnHideCtrlPopup();            

            $("#divPopup").dialog({
                title: "New Group",
                modal: true,
                width: "50%",
                open: function () {
                    var str = "<div class='p-2'>";
                    str += "<div class='mb-2'>";
                    str += "<div class='d-inline-block font-weight-bold' style='width: 20%; font-size: 1rem;'>Group Code :</div><input type='text' id='txtpopupgrpcode' class='form-control form-control-sm d-inline-block' style='width: 30%;'><span style='font-weight: 500; color: #666; margin-left: 10px;'>(Optional)</span>";
                    str += "</div>";
                    str += "<div>";
                    str += "<div class='d-inline-block font-weight-bold' style='width: 20%; font-size: 1rem;'>Group Name :</div><input type='text' id='txtpopupgrpname' class='form-control form-control-sm d-inline-block' style='width: 80%;'>";
                    str += "</div>";
                    str += "</div>";
                    $("#divPopup").html(str);
                },
                close: function () {
                    $("#divPopup").dialog('destroy');
                },
                buttons: [
                    {
                        text: "Create Group",
                        "class": "btns btn-submit",
                        click: function () {
                            var GroupID = "0";
                            var GroupCode = $("#txtpopupgrpcode").val();
                            var GroupName = $("#txtpopupgrpname").val();
                            var RoleID = $("#ConatntMatter_hdnRoleID").val();
                            var LoginID = $("#ConatntMatter_hdnLoginID").val();

                            if (GroupName == "") {
                                AutoHideAlertMsg("Please enter the Group Name !");
                            }
                            else {
                                $("#dvloader").show();

                                PageMethods.fnAddEditGroup(GroupID, GroupCode, GroupName, RoleID, LoginID, fnAddEditGroup_pass, fnFailed, ctrl);
                                $("#divPopup").dialog('close');
                            }
                        }
                    },
                    {
                        text: "Close",
                        "class": "btns btn-submit",
                        click: function () {
                            $("#divPopup").dialog('close');
                        }
                    }
                ]
            });
        }
        function fnAddEditGroup_pass(result, ctrl) {
            $("#dvloader").hide();

            if (result.split("|^|")[0] == "0") {
                $(ctrl).parent().prev().val(result.split("|^|")[2]);
                $(ctrl).parent().prev().attr("selectedid", result.split("|^|")[1]);

                $("#ConatntMatter_hdnGroupMstr").val(result.split("|^|")[3]);
            }
            else {
                AutoHideAlertMsg("Error : " + result.split("|^|")[1]);
            }
        }


        function fnUpdateMapping(ctrl) {
            fnHideCtrlPopup();

            var SBF = $(ctrl).closest("tr").find("td").eq(3).html();
            if ($(ctrl).closest("tr").find("input[type='text']").eq(0).val() == "" || $(ctrl).closest("tr").find("input[type='text']").eq(0).attr("selectedid") == "0") {
                AutoHideAlertMsg("Please select or create a new Group for mapping with the SBF - " + SBF + " !");
            }
            else {
                var UserID = $("#ConatntMatter_hdnUserID").val();
                var LoginID = $("#ConatntMatter_hdnLoginID").val();
                var strSBFGroiPMapping = $(ctrl).closest("tr").attr("sbfId") + "^" + $(ctrl).closest("tr").find("input[type='text']").eq(0).attr("selectedid") + "|";

                $("#dvloader").show();
                PageMethods.fnUpdateMapping(strSBFGroiPMapping, UserID, LoginID, fnUpdateMapping_pass, fnFailed, ctrl);
            }
        }
        function fnUpdateMapping_pass(result, ctrl) {
            if (result.split("|^|")[0] == "0") {
                var SBF = $(ctrl).closest("tr").find("td").eq(3).html();

                if ($("#ConatntMatter_ddlSBFType").val() == "1") {          // New Mapping
                    AutoHideAlertMsg("SBF Group - " + $(ctrl).closest("tr").find("input[type='text']").eq(0).val() + ", is successfully mapped with the SBF - " + SBF + " !");
                    $(ctrl).closest("tr").remove();
                }
                else {
                    AutoHideAlertMsg("SBF Group - " + $(ctrl).closest("tr").find("input[type='text']").eq(0).val() + ", mapping is successfully updated for the SBF - " + SBF + " !");
                }

                $("#dvloader").hide();
            }
            else {
                $("#dvloader").hide();
                AutoHideAlertMsg("Error : " + result.split("|^|")[1]);
            }
        }




        // ----------------------------------------- Not In Use --------------------------------------------//
        function fnCheckAll(ctrl) {
            if ($(ctrl).is(":checked"))
                $(ctrl).closest("table").find("tbody").eq(0).find("input[type='checkbox']").prop("checked", true);
            else
                $(ctrl).closest("table").find("tbody").eq(0).find("input[type='checkbox']").prop("checked", false);
        }
        function fnCheckIndividual(ctrl) {
            if (!($(ctrl).is(":checked")))
                $(ctrl).closest("table").find("thead").eq(0).find("input[type='checkbox']").prop("checked", false);
        }

        function fnUpdateMultipleMapping() {
            if ($("#divReport").find("table").eq(0).find("tbody").eq(0).find("tr").length > 0) {

                var cntr = 0;
                var strSBFGroiPMapping = "";
                $("#divReport").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
                    if ($(this).find("input[type='text']").eq(0).val() != "" && $(this).find("input[type='text']").eq(0).attr("selectedid") != "0") {
                        strSBFGroiPMapping += $(this).attr("sbfid") + "^" + $(this).find("input[type='text']").eq(0).attr("selectedid") + "|";
                        cntr++;
                    }
                });

                if (cntr == 0) {
                    fnAlert("Please select atleast one SBF-Group mapping for Action !");
                }
                else {
                    $("#divAlert").dialog({
                        title: "Confirmation Alert :",
                        modal: true,
                        width: "50%",
                        open: function () {
                            $("#divAlert").html("Are you sure, you are going to update " + cntr + " SBF-Group(s) mapping ?");
                        },
                        close: function () {
                            $("#divAlert").dialog('destroy');
                        },
                        buttons: [
                            {
                                text: "Update",
                                "class": "btns btn-submit",
                                click: function () {
                                    var UserID = $("#ConatntMatter_hdnUserId").val();
                                    var LoginID = $("#ConatntMatter_hdnLoginId").val();

                                    $("#divloader").show();
                                    PageMethods.fnUpdateMapping(strSBFGroiPMapping, UserID, LoginID, fnUpdateMultipleMapping_pass, fnFailed, cntr);

                                    $("#divAlert").dialog('close');
                                }
                            },
                            {
                                text: "Cancel",
                                "class": "btns btn-submit",
                                click: function () {
                                    $("#divAlert").dialog('close');
                                }
                            }
                        ]
                    });
                }
            }
            else
                fnAlert("No SBF(s) found for Action !");
        }
        function fnUpdateMultipleMapping_pass(result, Cntr) {
            if (result.split("|^|")[0] == "0") {
                fnShowReport();
                fnAlert(Cntr + " SBF-Group(s) mapping updated successfully !");
            }
            else {
                $("#divloader").hide();
                fnAlert("Error : " + result.split("|^|")[1]);
            }
        }
        // ----------------------------------------- Not In Use --------------------------------------------//
    </script>


    <style type="text/css">
        .fixed-top {
            z-index: 99 !important;
        }

        #ctrlbg {
            z-index: 1;
        }

        div.error-msg {
            color: #ff0000;
            padding: 10px 0;
            font-size: 1rem;
            font-weight: 500;
            text-align: center;
        }

        #divReport {
            overflow-y: auto;
            overflow-x: hidden;
        }

        table.cls-SBFGrpMapping th {
            padding: 10px 5px;
        }

        table.cls-SBFGrpMapping tr th:nth-child(1),
        table.cls-SBFGrpMapping tr th:nth-child(6),
        table.cls-SBFGrpMapping tr td:nth-child(1),
        table.cls-SBFGrpMapping tr td:nth-child(6) {
            text-align: center;
        }

        table.cls-SBFGrpMapping tr td.td-action img {
            cursor: pointer;
        }

        table.cls-SBFGrpMapping tr td:nth-child(6) {
            text-align: center;
        }


        input.input-ctrl-txt {
            width: 100%;
            color: #495057;
            font-size: 0.8rem;
            padding: 0.1rem 0.5rem;
            border: 1px solid #ced4da;
            border-radius: 0.2rem;
        }


        div.popup-content {
            z-index: 3;
            display: none;
            min-width: 210px;
            overflow-y: auto;
            position: absolute;
            font-size: 0.76rem;
            background: #fbfdff;
            border: 1px solid #ccc;
        }

        div.popup-content-body {
            padding: 5px 0 0;
            height: 180px;
            overflow-y: auto;
            background: #fbfdff;
        }

            div.popup-content-body > div {
                cursor: pointer;
                text-align: left;
                padding: 1px 8px;
                border-bottom: 1px solid #ddd;
            }

                div.popup-content-body > div:hover {
                    font-size: 0.8rem;
                    font-weight: 700;
                    background: #c6e6ff !important;
                }

        div.popup-content-footer {
            padding: 2px 10px 5px;
            text-align: right;
            background: #e0e0e0;
            border-top: 2px solid #aaa;
        }

            div.popup-content-footer a.btn {
                padding: 0 10px 1px;
                font-size: 0.6rem;
                font-weight: 600;
            }
    </style>
    <style type="text/css">
        .btn-primary {
            background: #F26156 !important;
            border-color: #F26156;
            color: #fff !important;
        }

            .btn-primary:focus {
                box-shadow: 0 0 0 0.2rem rgba(216,31,16,0.2) !important;
            }

            .btn-primary:not(:disabled):not(.disabled).active,
            .btn-primary:not(:disabled):not(.disabled):active,
            .show > .btn-primary.drop,
            .btn-primary:active,
            .btn-primary:hover {
                background: #D81F10 !important;
                border-color: #D81F10;
                color: #fff !important;
            }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <h4 class="middle-title">Group Mapping</h4>

    <div class="no-gutters">
        <div class="fsw" id="Filter">
            <div class="fsw_inner">
                <div id="ctrlbg" class="loader_bg" onclick="fnHideCtrlPopup();"></div>

                <div class="fsw_inputBox col-8">
                    <div class="row">
                        <div class="col-2 pr-0">
                            <div class="fsw-title">Mapping Type</div>
                            <asp:DropDownList ID="ddlSBFType" runat="server" CssClass="form-control form-control-sm" onchange="fnCategory();">
                                <asp:ListItem Text="New Mapping" Value="1"></asp:ListItem>
                                <asp:ListItem Text="Existing Mapping" Value="2"></asp:ListItem>
                            </asp:DropDownList>
                        </div>
                        <div class="col-2 pr-0">
                            <div class="fsw-title">Category</div>
                            <asp:DropDownList ID="ddlCategoryFilter" runat="server" CssClass="form-control form-control-sm" onchange="fnCategory();"></asp:DropDownList>
                        </div>
                        <div class="col-3 pr-0">
                            <div class="fsw-title">Brand</div>
                            <div style="position: relative;">
                                <input id="txtBrandFilter" type="text" class="form-control form-control-sm" selectedid="0" onkeyup="fnShowBrandPopup(this);" onclick="fnShowBrandPopup(this);" />
                                <div class='popup-content popup-content-brand'>
                                    <div class='popup-content-body'></div>
                                    <div class='popup-content-footer'>
                                        <a href="#" class="btn btn-primary" onclick="fnHideCtrlPopup()">Close</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-3 pr-0">
                            <div class="fsw-title">BrandForm</div>
                            <div style="position: relative;">
                                <input id="txtBrandFormFilter" type="text" class="form-control form-control-sm" selectedid="0" onkeyup="fnShowBrandFormPopup(this);" onclick="fnShowBrandFormPopup(this);" />
                                <div class='popup-content popup-content-bf'>
                                    <div class='popup-content-body'></div>
                                    <div class='popup-content-footer'>
                                        <a href="#" class="btn btn-primary" onclick="fnHideCtrlPopup()">Close</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="fsw-title">&nbsp;</div>
                            <a class="btn btn-primary btn-sm" href="#" onclick="fnGetReport();">Get Mapping</a>
                        </div>
                    </div>
                </div>
                <div class="fsw_inputBox col-4">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fnTypeFilter();" placeholder="Search" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div style="width: 80%; margin: 0 auto;">
        <div id="divHeader"></div>
        <div id="divReport"></div>
    </div>

    <div id="divExtandDatePopup" style="display: none; padding: 15px 0 0 30px;">
        <label style="display: inline; font-size: 1.2rem; margin-right: 20px;">Extended Till : </label>
        <input id="txtExtendAll" type='text' class='form-control' style="width: 140px; display: inline;" tabindex="-1" />
    </div>

    <div id="divMsg" class="clsMsg"></div>
    <div id="divPopup" style="display: none;"></div>

    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>


    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />
    <asp:HiddenField ID="hdnMainRoleID" runat="server" />

    <asp:HiddenField ID="hdnGroupMstr" runat="server" />
    <asp:HiddenField ID="hdnBrandMstr" runat="server" />
    <asp:HiddenField ID="hdnBrandFormMstr" runat="server" />
</asp:Content>

