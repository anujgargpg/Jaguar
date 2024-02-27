<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="GrpNameSBFMngt.aspx.cs" Inherits="_GrpNameSBFMngt" %>

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

            fnGetReport(0, "");
        });

        function fnTypeFilter() {
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

        function fnSBFlst(ctrl) {
            var GroupID = $(ctrl).closest("tr").attr("SBFGroupID");
            var GroupName = $(ctrl).closest("tr").find("td").eq(5).find("input").eq(0).val();

            fnGetReport(GroupID, GroupName);
        }

        function fnGetReport(GroupID, GroupName) {
            var LoginID = $("#ConatntMatter_hdnLoginID").val();
            var UserID = $("#ConatntMatter_hdnUserID").val();

            $("#dvloader").show();
            PageMethods.GetReport(LoginID, UserID, GroupID, GroupName, GetReport_pass, fnFailed, GroupID);
        }
        function GetReport_pass(result, GroupID) {
            $("#dvloader").hide();
            $("#txtfilter").val("");

            if (result.split("|^|")[0] == "0") {
                if (GroupID.toString() == "0") {
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
                    $("#divPopup").dialog({
                        title: result.split("|^|")[2] + " :",
                        modal: true,
                        width: "400",
                        height: 'auto',
                        position: {
                            my: "top+100px",
                            at: "top+100px",
                            of: window,
                            collision: "none"
                        },
                        open: function () {
                            var str = "<div class='cls-mapped-sbf'>";
                            str += "<span>Mapped SBF(s) : </span>";
                            str += result.split("|^|")[1];
                            str += "</div>";

                            $("#divPopup").html(str);
                        },
                        close: function () {
                            $("#divPopup").dialog('destroy');
                        },
                        buttons: [
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
            }
            else {
                $("#divHeader").html("");
                $("#divReport").html(result.split("|^|")[1]);
            }
        }

        function fnEdit(ctrl) {
            $(ctrl).closest("tr").find("input").prop("disabled", false);
            $(ctrl).closest("td").html("<img src='../../Images/save.png' alt='save' title='save' onclick='fnSave(this);'/><img src='../../Images/cancel.png' alt='cancel' title='cancel' onclick='fnCancel(this);'/>");
        }
        function fnCancel(ctrl) {
            $(ctrl).closest("tr").find("td").eq(4).find("input").eq(0).val($(ctrl).closest("tr").attr("grpcode"));
            $(ctrl).closest("tr").find("td").eq(5).find("input").eq(0).val($(ctrl).closest("tr").attr("grpname"));
            $(ctrl).closest("tr").find("input").prop("disabled", true);
            $(ctrl).closest("td").html("<img src='../../Images/edit.png' alt='edit' title='edit' onclick='fnEdit(this);'/>");
        }
        function fnSave(ctrl) {
            var GroupID = $(ctrl).closest("tr").attr("SBFGroupID");
            var GroupCode = $(ctrl).closest("tr").find("td").eq(4).find("input").eq(0).val();
            var GroupName = $(ctrl).closest("tr").find("td").eq(5).find("input").eq(0).val();
            var RoleID = $("#ConatntMatter_hdnRoleID").val();
            var LoginID = $("#ConatntMatter_hdnLoginID").val();

            if (GroupName == "") {
                AutoHideAlertMsg("Please enter the Group Name !");
            }
            else {
                $("#dvloader").show();

                PageMethods.fnAddEditGrpDetails(GroupID, GroupCode, GroupName, RoleID, LoginID, fnAddEditGrpDetails_pass, fnFailed, ctrl);
            }
        }
        function fnAddEditGrpDetails_pass(result, ctrl) {
            $("#dvloader").hide();
            if (result.split("|^|")[0] == "0") {
                AutoHideAlertMsg("SBF Group details for the BrandForm : " + $(ctrl).closest("tr").find("td").eq(3).html() + ", is updated successfully !");

                var GroupCode = $(ctrl).closest("tr").find("td").eq(4).find("input").eq(0).val();
                var GroupName = $(ctrl).closest("tr").find("td").eq(5).find("input").eq(0).val();
                $(ctrl).closest("tr").attr("grpcode", GroupCode);
                $(ctrl).closest("tr").attr("grpname", GroupName);

                $(ctrl).closest("tr").find("input").prop("disabled", true);
                $(ctrl).closest("td").html("<img src='../../Images/edit.png' alt='edit' title='edit' onclick='fnEdit(this);'/>");
            }
            else {
                AutoHideAlertMsg("Error : " + result.split("|^|")[1]);
            }
        }

    </script>


    <style type="text/css">
        .fixed-top {
            z-index: 99 !important;
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

        table.cls-SBFGrp th {
            padding: 8px 5px;
        }

        table.cls-SBFGrp tr th:nth-child(1),
        table.cls-SBFGrp tr th:nth-child(7),
        table.cls-SBFGrp tr th:nth-child(8),
        table.cls-SBFGrp tr td:nth-child(1),
        table.cls-SBFGrp tr td:nth-child(7),
        table.cls-SBFGrp tr td:nth-child(8) {
            text-align: center;
        }

        table.cls-SBFGrp tr th:nth-child(1) {
            width: 5%;
        }

        table.cls-SBFGrp tr th:nth-child(7),
        table.cls-SBFGrp tr th:nth-child(8) {
            width: 7%;
        }

        table.cls-SBFGrp tr th:nth-child(2),
        table.cls-SBFGrp tr th:nth-child(3),
        table.cls-SBFGrp tr th:nth-child(4) {
            width: 14%;
        }

        table.cls-SBFGrp tr th:nth-child(5) {
            width: 16%;
        }

        table.cls-SBFGrp tr td.td-action img {
            cursor: pointer;
            margin: 0 2px;
            height: 14px;
            white-space: nowrap;
        }


        input.input-ctrl-txt {
            width: 100%;
            color: #495057;
            font-size: 0.8rem;
            padding: 0.1rem 0.5rem;
            border: 1px solid #ced4da;
            border-radius: 0.2rem;
        }

        div.cls-mapped-sbf {
            padding: 10px;
        }

            div.cls-mapped-sbf ul {
                padding-top: 6px;
            }

            div.cls-mapped-sbf span {
                color: #0080c0;
                font-size: 0.9rem;
                font-weight: 500;
                padding-bottom: 10px;
            }

            div.cls-mapped-sbf li {
                font-size: 0.86rem;
                font-weight: 400;
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
    <h4 class="middle-title">SBF Grouping</h4>

    <div class="no-gutters">
        <div class="fsw" id="Filter">
            <div class="fsw_inner">
                <div id="ctrlbg" class="loader_bg" onclick="fnHideCtrlPopup();"></div>

                <div class="fsw_inputBox col-12">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fnTypeFilter();" placeholder="Search" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div style="width: 90%; margin: 0 auto;">
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
</asp:Content>

