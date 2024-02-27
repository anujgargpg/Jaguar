<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="UpdateSBFCode.aspx.cs" Inherits="_UpdateSBFCode" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <script type="text/javascript">

        function fnfailed() {
            alert("Due to some technical reasons, we are unable to process your request !");
            $("#dvloader").hide();
        }

        $(document).ready(function () {
            $("#divReport").height($(window).height() - ($("#Heading").height() + $("#Filter").height() + 180));

            fnGetTableData();
        });

        function fnGetTableData() {
            $("#txtfilter").val('');

            $("#dvloader").show();
            PageMethods.fnGetTableData(fnGetTableData_pass, fnfailed);
        }
        function fnGetTableData_pass(res) {
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
                $("#tblReport").find("tbody").eq(0).find("tr").css("display", "table-row");
            }
        }

        function fnEdit(ctrl) {
            var SBFCode = $(ctrl).closest("tr").attr("sbfcode");
            $(ctrl).closest("tr").find("td").eq(5).html("<input type='text' value='" + SBFCode + "' />");
            $(ctrl).closest("td").html("<img class='mr-2' src='../../Images/save.png' title='Save' onclick='fnSave(this);'/><img src='../../Images/cancel.png' title='Cancel' onclick='fnCancel(this);'/>");
        }
        function fnCancel(ctrl) {
            var SBFCode = $(ctrl).closest("tr").attr("sbfcode");
            $(ctrl).closest("tr").find("td").eq(5).html(SBFCode);
            $(ctrl).closest("td").html("<img src='../../Images/edit.png' onclick='fnEdit(this);'/>");
        }
        function fnSave(ctrl) {
            var SBFNOdeID = $(ctrl).closest("tr").attr("nid");
            var SBFCode = $(ctrl).closest("tr").find("td").eq(5).find("input").eq(0).val();
            var LoginID = $("#ConatntMatter_hdnLoginID").val();

            $("#dvloader").show();
            PageMethods.fnSave(SBFNOdeID, SBFCode, LoginID, fnSave_pass, fnfailed, ctrl);
        }

        function fnSave_pass(res, ctrl) {
            if (res.split("|^|")[0] == "0") {
                var SBFCode = $(ctrl).closest("tr").find("td").eq(5).find("input").eq(0).val();
                $(ctrl).closest("tr").find("td").eq(5).html(SBFCode);
                $(ctrl).closest("td").html("<img src='../../Images/edit.png' onclick='fnEdit(this);'/>");

                alert("SBF Code updated Successfully !");
                $("#dvloader").hide();

                //fnGetTableData();
            }
            else
                fnfailed();
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

        #tblReport tr td:nth-child(2),
        #tblReport tr td:nth-child(3) {
            width: 15%;
        }

        #tblReport tr td:nth-child(4) {
            width: 20%;
        }

        #tblReport tr td:nth-child(6) {
            width: 15%;
            text-align: center;
        }

        #tblReport tr td:nth-child(7) {
            width: 8%;
            text-align: center;
            white-space: nowrap;
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
    <h4 class="middle-title">SBF Code Updation</h4>
    <div class="row no-gutters" style="margin-top: -10px;">
        <div class="fsw col-12" id="Filter">
            <div class="fsw_inner">
                <div class="fsw_inputBox" style="width: 90%;">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Type atleast 3 characters..." />
                    </div>
                </div>
                <div class="fsw_inputBox text-center" style="width: 10%;">
                    <div class="d-block">
                        <a class="btn btn-primary btn-sm" href="#" onclick="fnDownload();">Download</a>
                    </div>
                </div>
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


    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>
    <div id="divMsg" class="clsMsg"></div>
    <asp:Button ID="btnDownload" runat="server" Text="." OnClick="btnDownload_Click"  Style="visibility: hidden;" />

    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />
</asp:Content>

