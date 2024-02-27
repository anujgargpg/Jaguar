<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="FBINITMapExtract.aspx.cs" Inherits="_UserCounter" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <script type="text/javascript">
        function fnfailed() {
            alert("Due to some technical reasons, we are unable to process your request !");
            $("#dvloader").hide();
        }
        $(document).ready(function () {
            $("#divReport").height($(window).height() - ($("#Heading").height() + $("#Filter").height() + 180));

            $("#ddlMonthYrFilter").html($("#ConatntMatter_hdnMonthMstr").val().split("|^|")[0]);
            $("#ddlMonthYrFilter").val($("#ConatntMatter_hdnMonthMstr").val().split("|^|")[1]);
            fnGetReport();
        });


        function fnTypeFilter(ctrl) {
            if ($(ctrl).val().length > 2) {
                var flgtr = 0, flgValid = 0;
                var filter = $(ctrl).val().toUpperCase().split(",");

                $("#tblReport").find("tbody").eq(0).find("tr").css("display", "none");
                $("#tblReport").find("tbody").eq(0).find("tr").each(function () {
                    flgValid = 1;
                    for (var t = 0; t < filter.length; t++) {
                        if ($(this).find("td[iden='search']").html().toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
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
                $("#tblReport").find("tbody").eq(0).find("tr").css("display", "table-row");
            }
        }

        function fnGetReport() {
            $("#txtfilter").val('');
            var sdate = $("#ddlMonthYrFilter").val().split("|")[0];
            var edate = $("#ddlMonthYrFilter").val().split("|")[1];
            var RoleID = $("#ConatntMatter_hdnRoleID").val();
            var UserID = $("#ConatntMatter_hdnUserID").val();
            var LoginID = $("#ConatntMatter_hdnLoginID").val();

            $("#dvloader").show();
            PageMethods.fnGetTableData(sdate, edate, RoleID, UserID, LoginID, fnGetTableData_pass, fnfailed);
        }
        function fnGetTableData_pass(res) {
            if (res.split("|^|")[0] == "0") {
                $("#divReport").html(res.split("|^|")[1]);

                var wid = $("#tblReport").width();
                $("#divHeader").html("<table id='tblReport_header' class='" + $("#tblReport").attr("class") + "' style='margin-top:-4px; margin-bottom:0; width:" + (wid - 1) + "px; min-width:" + (wid - 1) + "px;'><thead>" + $("#tblReport").find("thead").eq(0).html() + "</thead></table>");
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



        function fnDownload() {
            $("#ConatntMatter_hdnMonthMstr").val($("#ddlMonthYrFilter").val());
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
        table.clsReport th:nth-child(1) {
            width: 4%;
        }        
        table.clsReport th:nth-child(2),
        table.clsReport th:nth-child(5) {
            width: 10%;
        }
        table.clsReport th:nth-child(3),
        table.clsReport th:nth-child(6) {
            width: 23%;
        }
        table.clsReport th:nth-child(4),
        table.clsReport th:nth-child(7) {
            width: 15%;
        }

        table.clsReport th:nth-child(1),
        #tblReport tr td:nth-child(1) {
            text-align: center;
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
    <h4 class="middle-title">FB-INIT Mapping Extract</h4>
    <div class="row no-gutters" style="margin-top: -10px;">
        <div class="fsw col-12" id="Filter">
            <div class="fsw_inner">
                <div class="fsw_inputBox pt-2 pb-2 pl-4">
                    <div class="d-block">
                        <span style="color:#666; font-size: 1rem; font-weight: 700;">Month :</span>
                        <select id="ddlMonthYrFilter" class="form-control form-control-sm d-inline" onchange="fnGetReport();" style="width: 120px;"></select>
                    </div>
                </div>
                <div class="fsw_inputBox" style="width: 100%;">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fnTypeFilter(this);" placeholder="Type atleast 3 characters..." />
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
        <div role="tabpanel" class="tab-pane fade show active" style="width: 90%; margin: 0 auto;">
            <div id="divHeader"></div>
            <div id="divReport"></div>
        </div>
    </div>


    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>
    <div id="divMsg" class="clsMsg"></div>

    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />

    <asp:HiddenField ID="hdnMonthMstr" runat="server" />
    <asp:Button ID="btnDownload" runat="server" Text="." OnClick="btnDownload_Click" Style="visibility: hidden;" />
</asp:Content>

