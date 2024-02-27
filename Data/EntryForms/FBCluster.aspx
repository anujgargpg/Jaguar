<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/site.master" AutoEventWireup="true" CodeFile="FBCluster.aspx.cs" Inherits="_FBCluster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="../../Scripts/js_FBClusterForm.js"></script>

    <style type="text/css">
        .fsw {
            padding: 0;
        }
        .fsw .fsw_inner {
            border: none;
        }

        .fsw_inputBox {
            background: #fff;
            border-radius: 3px;
            margin-right: 5px;
            border: solid 1px #b9c8e3;
        }


        /* ---------Tabs------------------ */
        .nav-tabs > li {
            font-size: 0.8rem;
            margin: 4px 0 -1px;
            border-bottom: 1px solid #dee2e6;
        }
        .nav-tabs > li > a.nav-link {
            padding: .25rem 0.75rem;
        }
    </style>
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
        #tblReport {
            margin-bottom: 0px;
        }

        #tblReport_header th {
            text-align: center;
        }

        table.clsReport tr td:nth-child(1) {
            width: 5%;
            text-align: center;
        }

        table.clsReport tr td:nth-child(2) {
            width: 30%;
        }

        table.clsReport tr td:nth-child(3) {
            width: 55%;
            font-size: 0.65rem;
        }

            table.clsReport tr td:nth-child(3) span {
                display: inline-block;
                width: 90%;
            }

        table.clsReport tr td:nth-child(4) {
            width: 15%;
            text-align: center;
        }

        #tblPrevQtrCluster th,
        #tblPrevQtrCluster td {
            font-size: 0.8rem;
        }

        #tblPrevQtrCluster tr td:nth-child(1) {
            width: 5%;
            text-align: center;
        }
        #tblPrevQtrCluster tr td:nth-child(2) {
            width: 30%;
        }
        #tblPrevQtrCluster tr td:nth-child(3) {
            font-size: 0.7rem;
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
                    font-size: .62rem;
                    padding: .1rem .3rem;
                    border: 1px solid #dee2e6;
                }

            .customtooltip table > tbody > tr:nth-of-type(2n+1) {
                background-color: rgba(0,61,167,.10);
            }

            .customtooltip table > thead > tr > th:nth-of-type(2n-1),
            .customtooltip table > tbody > tr > td:nth-of-type(2n-1) {
                border-left: 3px solid #4289FF;
            }

            .customtooltip table > tbody > tr > td:nth-of-type(2n-1) {
                color: #003DA7;
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

    <style type="text/css">
        #tblExistingBranchMapping{
            margin-bottom: 0;
        }
        #tblExistingBranchMapping td {
            font-size: 0.76rem;
            font-weight: 500;
        }
        #tblExistingBranchMapping tr th:nth-child(1),
        #tblExistingBranchMapping tr td:nth-child(1) {
            width: 6%;
            text-align: center;
        }
    </style>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <h4 class="middle-title" id="Heading">FB Cluster Master</h4>
    <div class="fsw" id="Filter">
        <div class="fsw_inner">
            <div class="fsw_inputBox" id="divTypeSearchFilterBlock" style="width: 82%;">
                <div class="fsw-title">Search Box</div>
                <div class="d-block">
                    <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Type atleast 3 characters .." />
                </div>
            </div>
            <div class="fsw_inputBox" id="divAddNewCopyBtnBlock" style="width: 18%;">
                <div class="fsw-title">Cluster</div>
                <div class="d-block">
                    <a href="#" class="btn btn-primary btn-sm" id="btnAddNew" onclick="fnAddNew();" title="Add New Cluster"><i class="fa fa-plus-square"></i>&nbsp; Add New</a>
                    <a href="#" class="btn btn-primary btn-sm" id="btnCopy" onclick="fnImportPrevMonthCluster();" title="Import Cluster from Previous Mont(s) to Current Month" style="margin-left: 5%;"><i class="fa fa-clone"></i>&nbsp; Import</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Nav tabs -->
    <ul class="nav nav-tabs" role="tablist" id="TabHead" runat="server">
    </ul>

    <!-- Tab panes -->
    <div id="tab-content" class="tab-content">
        <div role="tabpanel" class="tab-pane fade show active w-75" style="margin: 10px auto 0;">
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
    <div id="divPrevMonthCluster" style="display: none; font-size: 0.9rem; font-weight: 600; color: #7A7A7A;">
        <ul class="nav nav-tabs" id="PopupTab" runat="server"></ul>
        <div id="divExistingCluster" style="height: 360px; overflow-y: auto; margin-top: 10px;"></div>
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

    <asp:HiddenField ID="hdnProductLvl" runat="server" />
    <asp:HiddenField ID="hdnLocationLvl" runat="server" />
    <asp:HiddenField ID="hdnChannelLvl" runat="server" />
    <asp:HiddenField ID="hdnSelectedHier" runat="server" />
    <asp:HiddenField ID="hdnSelectedFrmFilter" runat="server" />
    
    <asp:HiddenField ID="hdnMonth" runat="server" />
    <asp:HiddenField ID="hdnImportPrevMonthtoCurrent" runat="server" />
</asp:Content>
