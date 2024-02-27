<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="frmDashboard.aspx.cs" Inherits="Data_Other_frmDashboard" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../../Styles/Multiselect/jquery.multiselect.css" rel="stylesheet" type="text/css" />
    <link href="../../Styles/Multiselect/jquery.multiselect.filter.css" rel="stylesheet" type="text/css" />

    <script src="../../Scripts/MultiSelect/jquery.multiselect.js" type="text/javascript"></script>
    <script src="../../Scripts/MultiSelect/jquery.multiselect.filter.js" type="text/javascript"></script>
    <script src="../../Scripts/js_DashboardForm.js"></script>
   
    <style type="text/css">
        table.tbl_report {
            width: 100%;
            margin-bottom: 1rem;
            background-color: transparent;
            border-collapse: collapse;
            border: 2px solid #393938;
        }

            table.tbl_report thead th {
                vertical-align: bottom;
                border-bottom: 2px solid #393938;
                color:#FFF;
                text-transform:uppercase;
            }

            table.tbl_report td, 
            table.tbl_report th {
                padding: .35rem;
                vertical-align: top;
                text-align:center;
            }
            table.tbl_report thead th,
            table.tbl_report tbody td{                
                border-left: 1px solid #393938;
                border-right: 1px solid #393938;
            }
            table.tbl_report thead th:nth-child(1){
                background:#A71380;
            }
            table.tbl_report thead th:nth-child(2){
                background:#008AD2;
            }
            table.tbl_report thead th:nth-child(3){
                background:#AECB06;
            }
            
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <div class="fsw" id="Filter">
        <div class="fsw_inner">
            <div class="fsw_inputBox" style="width: 100%;">
                <div class="row">
                    <div class="col-2">
                        <div class="fsw-title">Month</div>
                        <div class="form-row">
                            <select id="ddlMonth" class="form-control form-control-sm" onchange="fnGetReport(0);"></select>
                        </div>
                    </div>
                    <div class="col-3" id="MSMPFilterBlock">
                        <div class="fsw-title">MS&amp;P ALIAS</div>
                        <div class="d-block">
                            <select id="ddlMSMPAlies" multiple="multiple"></select>
                        </div>
                    </div>
                    <div class="col-5">
                        <a class="btn btn-primary btn-sm mt-4" href="#" onclick="fnGetTableData();" title="Show Filtered Bucket(s)">Show Report</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="divReport"></div>
    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>
    <div class="clear"></div>
    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />
    <asp:HiddenField ID="hdnMainRoleID" runat="server" />

    <asp:HiddenField ID="hdnMonths" runat="server" />
    <asp:HiddenField ID="hdnMSMPAlies" runat="server" />
    <asp:HiddenField ID="hdnDashboardData" runat="server" />
</asp:Content>
