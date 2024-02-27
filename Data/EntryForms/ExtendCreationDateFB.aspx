<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/site.master" AutoEventWireup="true" CodeFile="ExtendCreationDateFB.aspx.cs" Inherits="ExtendCreationDateFB" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="../../Scripts/js_ExtendCreationDateFBForm.js"></script>
    <style type="text/css">
        .fsw .fsw_inner {
            border: none;
        }

        .fsw_inputBox {
            background: #fff;
            border-radius: 3px;
            margin-right: 5px;
            border: solid 1px #b9c8e3;
            min-height: 76px;
        }

        .tab-content {
            padding-left: 0;
        }

        div.cls-Popup {
            width: 50%;
            z-index: 101;
            height: 180px;
            display: none;
            position: fixed;
            overflow-y: auto;
            background: #ffffff;
            border: 1px solid #444;
        }

            div.cls-Popup table td {
                padding: 0.1rem 0.3rem;
            }
    </style>
    <style type="text/css">
        #divReport {
            overflow-y: auto;
        }

        img {
            cursor: pointer;
        }

        select {
            width: 90%;
        }

        input[type='text'] {
            width: 100%;
        }

        .custom-tooltip {
            cursor: pointer;
        }

        table.cls-Report th,
        table.cls-Report td {
            text-align: center;
            vertical-align: middle !important;
        }

        table.cls-Report tr th:nth-child(1) {
            width: 10%;
        }

        table.cls-Report tr th:nth-child(2),
        table.cls-Report tr th:nth-child(4) {
            width: 20%;
        }

        table.cls-Report tr td:nth-child(3) span {
            font-weight: bold;
            margin: 0 10px;
        }

        table.cls-Report tr td:nth-child(3) input[type='text'] {
            width: 120px;
            border: 1px solid #ddd;
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
<asp:Content ID="Content3" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <h4 class="middle-title" id="Heading">EXTEND CREATION DATE - FB</h4>
    <div class="fsw" id="Filter">
        <div class="fsw_inner">
            <div class="fsw_inputBox w-100 text-right" style="min-height: auto;">
                <a href="#" class="btn btn-primary btn-sm" id="btnAddNew" onclick="fnAddNew();" title="Add New Cluster"><i class="fa fa-plus-square"></i>&nbsp; Add New Month</a>
            </div>
        </div>
    </div>

    <div id="tab-content" class="tab-content">
        <div role="tabpanel" class="tab-pane fade show active w-50" style="margin: 0 auto;">
            <div id="divHeader"></div>
            <div id="divReport"></div>
        </div>
    </div>

    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>
    <div id="divMsg" class="clsMsg"></div>
    <div id="divConfirm" style="display: none; font-size: 0.9rem; font-weight: 600; color: #7A7A7A;"></div>

    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />

    <asp:HiddenField ID="hdnMonthMstr" runat="server" />
</asp:Content>
