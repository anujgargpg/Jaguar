<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/site.master" AutoEventWireup="true" CodeFile="BucketMstr.aspx.cs" Inherits="_BucketMstr" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="../../Scripts/js_BucketMstrForm.js"></script>
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
            width: 560px;
            background: #fff;
            border-radius: 2px;
            border: 1px solid #ddd;
        }

        .clsPopupSec {
            padding: 5px 10px;
            border-bottom: 2px solid #aaa;
        }
        .clsPopupSec table {
            margin-bottom: 0 !important;
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
            background: #f1f1f1;
            text-align: right;
        }

            .clsPopupFooter > .btn {
                line-height: 1;
            }
    </style>
    <style type="text/css">
        table.clsReport tr th:nth-child(1) {
            width: 5%;
        }

        table.clsReport tr th:nth-child(5),
        table.clsReport tr th:nth-child(7) {
            width: 10%;
        }

        table.clsReport tr th:nth-child(2),
        table.clsReport tr th:nth-child(3),
        table.clsReport tr th:nth-child(6) {
            width: 15%;
        }

        table.clsReport tr th:nth-child(4) {
            width: 20%;
        }
    </style>
    <style type="text/css">
        .customtooltip > div {
            text-align: left;
            color: #000;
            font-weight: 400;
            background: #fff;
        }

        .customtooltip > div > span {
            color: #003DA7;
            font-weight: 800;
            padding-left: 0;
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
    <h4 class="middle-title" id="Heading">Bucket Master</h4>
    <div class="fsw" id="Filter">
        <div class="fsw_inner">
            <div class="fsw_inputBox w-75">
                <div class="row">
                    <div class="col-7">
                        <div class="fsw-title">Date Range</div>
                        <div class="form-row">
                            <label class="col-form-label col-form-label-sm">From</label>
                            <div class="col-5">
                                <input id="txtFromDate" type="text" class="form-control form-control-sm clsDate" placeholder="From Date" />
                            </div>
                            <label class="col-form-label col-form-label-sm">To</label>
                            <div class="col-5">
                                <input id="txtToDate" type="text" class="form-control form-control-sm clsDate" placeholder="To Date" />
                            </div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="fsw-title">Filter</div>
                        <div class="d-block">
                            <a id="txtProductHierSearch" class="btn btn-primary btn-sm" href="#" insubd="0" prodlvl="" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Products Filter">Products</a>
                            <a id="txtLocationHierSearch" class="btn btn-primary btn-sm" href="#" insubd="0" prodlvl="" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Location Filter">Location</a>
                            <a id="txtChannelHierSearch" class="btn btn-primary btn-sm" href="#" insubd="0" prodlvl="" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Channel Filter">Channel</a>
                            <%--<a class="btn btn-primary btn-sm" href="#" title="Initiatives Filter">Initiatives</a>--%>
                        </div>
                    </div>
                    <div class="col-2">
                        <a class="btn btn-primary btn-sm mt-4" href="#" onclick="fnReset();" title="Reset All Filters">Reset</a>
                        <a class="btn btn-primary btn-sm mt-4" href="#" onclick="fnSearch();" title="Show Filtered Bucket(s)">Show</a>
                    </div>
                </div>
            </div>
            <div class="fsw_inputBox w-25">
                <div class="fsw-title">Search Box</div>
                <div class="d-block">
                    <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Search" />
                </div>
            </div>
        </div>
    </div>

    <!-- Nav tabs -->
    <ul class="nav nav-tabs" role="tablist" id="TabHead" runat="server">
        <%--<li><a class="nav-link active" href="#">Product Bucket</a></li>--%>
    </ul>
    <!-- Tab panes -->
    <div id="tab-content" class="tab-content">
        <div role="tabpanel" class="tab-pane fade show active">
            <div class="text-right mb-2 mt-1" id="AddNewBtn">
                <a class="btn btn-primary btn-sm" href="#" onclick="fnAddNew();" title="Add New Bucket">Add New Bucket</a>
            </div>
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
                        <a id="btnAddNewNode" class="btns-outline" href="#" onclick="fnAddNewNode();">Add New Node</a>
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

    <div id="divPopupNewNode" style="display: none;">
        <div class="form-row">
            <div class="form-group col-md-3">
                <label>Code</label>
                <input type="text" class="form-control form-control-sm" id="txtNodeCode" />
            </div>
            <div class="form-group col-md-9">
                <label>Name</label>
                <input type="text" class="form-control form-control-sm" id="txtNodeName" />
            </div>
        </div>
        <div class="form-row" id="divPopupNewNodeParentSection">
            <div class="form-group col-md">
                <label>Parent Node</label>
                <div class="position-relative">
                    <input id="txtParentNode" type="text" class="form-control form-control-sm" sel="" autocomplete="off" onclick="fnPopupTypeSearchParentNode(this)" onkeyup="fnPopupTypeSearchParentNode(this);" placeholder="Type atleast 3 character to filter..." />
                    <div class="clsPopup">
                        <div class="clsPopupBody clsPopupSec" style="padding: 0;"></div>
                        <div class="clsPopupFooter clsPopupSec">
                            <a class="btn btn-primary btn-sm" href="#" onclick="fnHidePopupParentNode();">Close</a>
                        </div>
                    </div>
                </div>
            </div>
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

    <asp:HiddenField ID="hdnBucketID" runat="server" />
    <asp:HiddenField ID="hdnBucketName" runat="server" />
    <asp:HiddenField ID="hdnBucketType" runat="server" />
    <asp:HiddenField ID="hdnProductLvl" runat="server" />
    <asp:HiddenField ID="hdnLocationLvl" runat="server" />
    <asp:HiddenField ID="hdnChannelLvl" runat="server" />
    <asp:HiddenField ID="hdnSelectedHier" runat="server" />
    <asp:HiddenField ID="hdnSelectedFrmFilter" runat="server" />
</asp:Content>
