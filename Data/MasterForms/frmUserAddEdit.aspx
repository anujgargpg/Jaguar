<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/site.master" AutoEventWireup="true" CodeFile="frmUserAddEdit.aspx.cs" Inherits="MasterForms_frmUserAddEdit" ValidateRequest="true" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="../../Scripts/js_UserAddEditForm.js"></script>
    <script src="../../Scripts/js_Utilities.js"></script>

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

        #divHierPopupTbl table tr.Active {
            background: #C0C0C0;
        }

        .fixed-top {
            z-index: 99 !important;
        }

        #divHierSelectionTbl td,
        #divHierPopupTbl td {
            font-size: 0.7rem !important;
        }
    </style>
    <style type="text/css">
        .clsPopup {
            position: absolute;
            display: none;
            z-index: 11;
            left: 0;
            width: 400px;
            background: #fff;
            border-radius: 2px;
            border: 1px solid #ddd;
        }

        .clsPopupSec {
            padding: 5px 10px;
            border-bottom: 2px solid #aaa;
        }

        .clsPopupFilter {
            background: #ccc;
        }

        .clsPopupTypeSearch {
            background: #eee;
        }

        .clsPopupBody {
            padding: 0 10px;
            height: 180px;
            overflow-y: auto;
            border-bottom: 3px solid #eee;
        }

            .clsPopupBody table th {
                font-size: 0.7rem;
                padding: 0.4rem;
            }

            .clsPopupBody table td {
                font-size: 0.6rem;
                padding: 0.2rem;
            }

            .clsPopupBody table tbody tr {
                cursor: pointer;
            }

                .clsPopupBody table tbody tr:hover {
                    background-color: #ccc;
                }

        .clsPopupFooter {
            text-align: right;
        }

            .clsPopupFooter .button1 {
                border-radius: 4px;
                font-weight: 700;
                float: none;
                color: #fff;
            }
    </style>
    <style type="text/css">
        table.table > thead > tr > th {
            text-align: center;
            vertical-align: middle;
        }

        table.clsReport tr th:nth-child(1) {
            width: 3%;
        }

        table.clsReport tr th:nth-child(2),
        table.clsReport tr th:nth-child(3) {
            width: 9%;
        }

        table.clsReport tr th:nth-child(4),
        table.clsReport tr th:nth-child(6) {
            width: 5%;
        }

        table.clsReport tr th:nth-child(5) {
            width: 6%;
        }

        table.clsReport tr th:nth-child(7),
        table.clsReport tr th:nth-child(8),
        table.clsReport tr th:nth-child(9),
        table.clsReport tr th:nth-child(10) {
            width: 12%;
        }

        table.clsReport tr th:nth-child(11) {
            width: 10%;
        }

        table.clsReport tr th:nth-child(12) {
            width: 5%;
            white-space: nowrap;
        }

        table.clsReport tr td {
            font-size: 0.70rem !important;
        }

            table.clsReport tr td:nth-child(1),
            table.clsReport tr td:nth-child(4),
            table.clsReport tr td:nth-child(5),
            table.clsReport tr td:nth-child(6),
            table.clsReport tr td:nth-child(12) {
                text-align: center;
            }

            table.clsReport tr td:nth-child(7) > span input[type='text'],
            table.clsReport tr td:nth-child(8) > span input[type='text'],
            table.clsReport tr td:nth-child(9) > span input[type='text'],
            table.clsReport tr td:nth-child(10) > span input[type='text'],
            table.clsReport tr td:nth-child(7) > input[type='text'],
            table.clsReport tr td:nth-child(8) > input[type='text'],
            table.clsReport tr td:nth-child(9) > input[type='text'],
            table.clsReport tr td:nth-child(10) > input[type='text'] {
                width: 80%;
                margin-left: 3%;
                font-size: 0.6rem;
            }
    </style>
    <style type="text/css">
        .customtooltip table {
            border-collapse: collapse;
            border-spacing: 0;
            width: 100%;
        }

            .customtooltip table > thead {
                background: #EDEEEE;
                text-align: left;
                border-bottom: 2px solid #003DA7 !important;
            }

                .customtooltip table > thead > tr > th,
                .customtooltip table > tbody > tr > td {
                    padding: .2rem .4rem;
                    font-size: 0.66rem;
                    border: 1px solid #dee2e6;
                }

            .customtooltip table > tbody > tr:nth-of-type(2n+1) {
                background-color: rgba(0,61,167,.10);
            }

            /*.customtooltip table > thead > tr > th:nth-of-type(2n-1),
            .customtooltip table > tbody > tr > td:nth-of-type(2n-1) {
                border-left: 3px solid #4289FF;
            }*/

            .customtooltip table > tbody > tr > td:nth-of-type(2n-1) {
                color: #003DA7;
            }
    </style>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <h4 class="middle-title" id="Heading" style="margin-bottom: 0;">User Management</h4>
    <div class="row no-gutters" id="Filter">
        <div class="fsw col-10">
            <div class="fsw_inner">
                <div class="fsw_inputBox" style="width: 100%;">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Search" />
                    </div>
                </div>
            </div>
        </div>
        <div class="fsw col-2" style="padding-left: 1%;">
            <div class="fsw_inner">
                <div class="fsw_inputBox">
                    <div class="fsw-title">User</div>
                    <div class="d-block">
                        <a class="btn btn-primary btn-sm" href="#" onclick="fnAddNew();">Add New User Inform.</a>                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="tab-content" class="tab-content">
        <!-- Tab panes 1-->
        <div role="tabpanel" class="tab-pane fade show active" id="CSTab-1">
            <div id="divHeader"></div>
            <div id="divReport"></div>
        </div>
    </div>

    <div id="divHierPopup" style="display: none;">
        <div class="row no-gutters">
            <div class="col-2">
                <div id="ProdLvl" class="prodLvl"></div>
            </div>
            <div class="col-6">
                <div class="pl-2">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        <div id="PopupHierlbl" class="d-block"></div>
                    </div>
                    <div id="divHierPopupTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
            <div class="col-4">
                <div class="prodLvl" style="margin-left: 1%;">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        Your Selection
                    </div>
                    <div id="divHierSelectionTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>
    <div id="divMsg" class="clsMsg"></div>
    <div id="dvUserDetail" style="display: none; font-size: 8.5pt">
    </div>

    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />
    <asp:HiddenField ID="hdnMainRoleID" runat="server" />

    <asp:HiddenField ID="hdnBucketID" runat="server" />
    <asp:HiddenField ID="hdnBucketName" runat="server" />
    <asp:HiddenField ID="hdnBucketType" runat="server" />
    <asp:HiddenField ID="hdnProductLvl" runat="server" />
    <asp:HiddenField ID="hdnLocationLvl" runat="server" />
    <asp:HiddenField ID="hdnChannelLvl" runat="server" />
    <asp:HiddenField ID="hdnSelectedHier" runat="server" />
    <asp:HiddenField ID="hdnSelectedFrmFilter" runat="server" />
    <asp:HiddenField ID="hdnBrand" runat="server" />
    <asp:HiddenField ID="hdnBrandForm" runat="server" />

    <asp:DropDownList ID="ddlRole" runat="server" style="visibility: hidden;"></asp:DropDownList>
</asp:Content>

