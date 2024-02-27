<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="UserCounter.aspx.cs" Inherits="_UserCounter" %>

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


        function fnGetReport() {
            $("#txtfilter").val('');
            var mth = $("#ddlMonthYrFilter").val().split("|")[0];
            var yr = $("#ddlMonthYrFilter").val().split("|")[1];

            $("#dvloader").show();
            PageMethods.fnGetTableData(mth, yr, fnGetTableData_pass, fnfailed);
        }
        function fnGetTableData_pass(res) {
            if (res.split("|^|")[0] == "0") {
                $("#divReport").html(res.split("|^|")[1]);

                //var wid = $("#tblReport").width();
                //var thead = $("#tblReport").find("thead").eq(0).html();

                //$("#divHeader").html("<table id='tblReport_header' class='table table-bordered table-sm' style='margin-top:-4px; margin-bottom:0; width:" + (wid - 1) + "px; min-width:" + (wid - 1) + "px;'><thead>" + thead + "</thead></table>");
                //$("#tblReport").css("width", wid);

                //$("#tblReport").css("min-width", wid);
                //for (i = 0; i < $("#tblReport").find("th").length; i++) {
                //    var th_wid = $("#tblReport").find("th")[i].clientWidth;
                //    $("#tblReport_header").find("th").eq(i).css("min-width", th_wid);
                //    $("#tblReport_header").find("th").eq(i).css("width", th_wid);
                //    $("#tblReport").find("th").eq(i).css("min-width", th_wid);
                //    $("#tblReport").find("th").eq(i).css("width", th_wid);
                //}
                //$("#tblReport").css("margin-top", "-" + $("#tblReport_header")[0].offsetHeight + "px");
                $("#dvloader").hide();
            }
            else {
                fnfailed();
            }
        }
    </script>



    <%------------------------------- Not In Use -----------------------------%>
    <script type="text/javascript">
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
        #tblReport th {
            text-align: center;
        }

        #tblReport tr td:nth-child(1) {
            width: 50px;
        }

        #tblReport tr td:nth-child(2) {
            font-weight: 600;
        }

        #tblReport tr td:nth-child(3) {
            width: 30%;
            font-weight: 500;
        }

        #tblReport tr td:nth-child(1),
        #tblReport tr td:nth-child(3) {
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
    <h4 class="middle-title">User Count</h4>
    <div class="row no-gutters" style="margin-top: -10px;">
        <div class="fsw col-12" id="Filter">
            <div class="fsw_inner">
                <div class="fsw_inputBox pt-2 pb-2 pl-4">
                    <div class="d-block">
                        <span style="color:#666; font-size: 1rem; font-weight: 700;">Month :</span>
                        <select id="ddlMonthYrFilter" class="form-control form-control-sm d-inline ml-4" onchange="fnGetReport();" style="width: 200px;"></select>
                    </div>
                </div>
                <%--<div class="fsw_inputBox" style="width: 90%;">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Type atleast 3 characters..." />
                    </div>
                </div>
                <div class="fsw_inputBox text-center" style="width: 10%;">
                    <div class="d-block">
                        <a class="btn btn-primary btn-sm" href="#" onclick="fnDownload();">Download</a>
                    </div>
                </div>--%>
            </div>
        </div>
    </div>


    <div id="tab-content" class="tab-content">
        <!-- Tab panes 1-->
        <div role="tabpanel" class="tab-pane fade show active" style="width: 40%; margin: 0 auto;">
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
</asp:Content>

