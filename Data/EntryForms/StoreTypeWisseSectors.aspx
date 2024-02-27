<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="StoreTypeWisseSectors.aspx.cs" Inherits="_StoreTypeWisseSectors" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <script type="text/javascript">
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
            alert("Due to some technical reasons, we are unable to process your request !");
            $("#dvloader").hide();
        }

        $(document).ready(function () {
            $("#divReport").height($(window).height() - ($("#Heading").height() + $("#Filter").height() + 180));

            fnGetReport();
        });

        function fnGetReport() {
            $("#txtfilter").val('');

            $("#dvloader").show();
            PageMethods.fnGetReport(fnGetReport_pass, fnfailed);
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
                $("#dvloader").hide();
            }
            else {
                fnfailed();
            }
        }

        function fntypefilter() {
            var flgtr = 0;
            var filter = ($("#txtfilter").val()).toUpperCase();

            if (filter.length > 2) {
                $("#tblReport").find("tbody").eq(0).find("tr").css("display", "none");
                $("#tblReport").find("tbody").eq(0).find("tr").each(function () {
                    if ($(this).find("td[iden='search']").html().toUpperCase().indexOf(filter) > -1) {
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

                $("#tblReport").find("tbody").eq(0).find("tr").css("display", "table-row");
            }
        }


        function fnCheckUncheckAll() {
            if ($("#chkAllSector").is(":checked")) {
                $("#ConatntMatter_divSectorPopup").find("input[type='checkbox']").prop("checked", true);
            }
            else {
                $("#ConatntMatter_divSectorPopup").find("input[type='checkbox']").prop("checked", false);
            }
        }
        function fnIndividualSector(ctrl) {
            if (!($(ctrl).is(":checked"))) {
                $("#chkAllSector").prop("checked", false);
            }
        }
        function fnEdit(ctrl) {
            $("#divChannelSectorPopup").dialog({
                "modal": true,
                "width": "490",
                "height": "500",
                "title": "Sector Mapping :",
                close: function () {
                    $("#divChannelSectorPopup").dialog('destroy');
                },
                buttons: [{
                    text: 'Save',
                    class: 'btn-primary',
                    click: function () {
                        $("#divChannelSectorPopup").dialog('close');

                        var LoginID = $("#ConatntMatter_hdnLoginID").val();
                        var ArrMapping = [];
                        $("#ConatntMatter_divSectorPopup").find("input[type='checkbox']").each(function () {
                            if ($(this).is(":checked")) {
                                ArrMapping.push({
                                    "col1": $(ctrl).closest("tr").attr("strId"),
                                    "col2": $(this).attr("sectorId")
                                });
                            }
                        });

                        $("#dvloader").show();
                        PageMethods.fnSave(LoginID, ArrMapping, fnSave_pass, fnfailed);
                    }
                },
                {
                    text: 'Cancel',
                    class: 'btn-primary',
                    click: function () {
                        $("#divChannelSectorPopup").dialog('close');
                    }
                }]
            });

            $("#chkAllSector").prop("checked", false);
            $("#ConatntMatter_divSectorPopup").find("input[type='checkbox']").prop("checked", false);

            var sector = $(ctrl).closest("tr").attr("sector");
            if (sector != "") {
                for (var i = 0; i < sector.split("^").length; i++) {
                    $("#ConatntMatter_divSectorPopup").find("input[type='checkbox'][sectorId='" + sector.split("^")[i] + "']").eq(0).prop("checked", true);
                }
            }
            $("#divChannelPopup").html($(ctrl).closest("tr").find("td").eq(1).html());
            $("#divSTypePopup").html($(ctrl).closest("tr").find("td").eq(3).html());
        }
        function fnSave_pass(res) {
            if (res.split("|^|")[0] == "0") {
                AutoHideAlertMsg("Store Type - Sector mapping updated Successfully !");
                $("#dvloader").hide();
                fnGetReport();
            }
            else {
                AutoHideAlertMsg("Error : " + res.split("|^|")[1]);
                $("#dvloader").hide();
            }
        }


        function fnDownload() {
            $("#ConatntMatter_btnDownload").click();
        }
    </script>

    <style type="text/css">
        #divReport {
            overflow-y: auto;
        }

            #divReport td.clstdAction {
                text-align: center;
            }

            #divReport img {
                cursor: pointer;
            }

        .fixed-top {
            z-index: 99 !important;
        }
    </style>
    <style type="text/css">
        #tblReport_header th {
            text-align: center;
        }

        #tblReport tr td:nth-child(1) {
            width: 5%;
            text-align: center;
        }

        #tblReport tr td:nth-child(2) {
            width: 18%;
        }

        #tblReport tr td:nth-child(3) {
            width: 12%;
        }

        #tblReport tr td:nth-child(4) {
            width: 24%;
        }

        #tblReport tr td:nth-child(6) {
            width: 8%;
            text-align: center;
        }
    </style>
    <style type="text/css">
        .txt-lbl {
            color: #044d91;
            font-weight: 600;
        }

        #divChannelSectorPopup {
            font-size: 0.8rem;
            overflow-x: hidden;
        }

            #divChannelSectorPopup input[type] {
                margin-right: 5px;
                height: 10px;
            }

        #ConatntMatter_divSectorPopup ul {
            list-style: none;
            font-weight: 500;
            overflow-y: auto;
            max-height: 336px;
        }

            #ConatntMatter_divSectorPopup ul li {
                margin-top: 3px;
                font-weight: 500;
                font-size: 0.76rem;
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
    <h4 class="middle-title">Sub channel-Sector Mapping</h4>
    <div class="row no-gutters" style="margin-top: -10px;">
        <div class="fsw col-12" id="Filter">
            <div class="fsw_inner">
                <div class="fsw_inputBox" style="width: 100%;">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Type atleast 3 characters..." />
                    </div>
                </div>
                <%--<div class="fsw_inputBox text-center" style="width: 10%;">
                    <div class="d-block">
                        <a class="btn btn-primary btn-sm" href="#" onclick="fnDownload();">Download</a>
                    </div>
                </div>--%>
            </div>
        </div>
    </div>


    <div id="tab-content" class="tab-content">
        <!-- Tab panes 1-->
        <div role="tabpanel" class="tab-pane fade show active" style="width: 90%; margin: 0 auto;" id="CSTab-1">
            <div id="divHeader"></div>
            <div id="divReport"></div>
        </div>
    </div>


    <div id="divChannelSectorPopup" style="display: none;">
        <div class="row p-3">
            <div class="col-4 txt-lbl">Channel Name</div>
            <div class="col-1 pl-0 txt-lbl">:</div>
            <div class="col-7" id="divChannelPopup"></div>
            <div class="col-4 mt-1 txt-lbl">Store Type</div>
            <div class="col-1 mt-1 pl-0 txt-lbl">:</div>
            <div class="col-7 mt-1" id="divSTypePopup"></div>
            <div class="col-6 mt-2 txt-lbl">Sector(s) :</div>
            <div class="col-6 mt-2 text-right" style="color: #888; font-weight: 600;">
                <input type="checkbox" id="chkAllSector" onclick="fnCheckUncheckAll();" />Check All</div>
            <div class="col-12" id="divSectorPopup" runat="server"></div>
        </div>
    </div>


    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>
    <div id="divMsg" class="clsMsg"></div>
    <asp:Button ID="btnDownload" runat="server" Text="." OnClick="btnDownload_Click" Style="visibility: hidden;" />

    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />
</asp:Content>

