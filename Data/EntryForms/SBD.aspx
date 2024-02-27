<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/site.master" AutoEventWireup="true" CodeFile="SBD.aspx.cs" Inherits="_SBDMstr" ValidateRequest="false" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../../Styles/Multiselect/jquery.multiselect.css" rel="stylesheet" type="text/css" />
    <link href="../../Styles/Multiselect/jquery.multiselect.filter.css" rel="stylesheet" type="text/css" />

    <script src="../../Scripts/MultiSelect/jquery.multiselect.js" type="text/javascript"></script>
    <script src="../../Scripts/MultiSelect/jquery.multiselect.filter.js" type="text/javascript"></script>

    <script src="../../Scripts/js_SBDForm.js"></script>
    <script src="../../Scripts/js_Utilities.js"></script>
    
    <style type="text/css">
        table.clsBaseSBFDisable tbody tr {
            background: #ECECEC;
        }

        tr.clsActve {
            background-color: #FFD2A6;
        }
    </style>
    <style type="text/css">
        .clsInform {
            word-break: break-all;
            white-space: inherit;
        }

        i {
            cursor: pointer;
        }

        .d-block-none {
            display: none !important;
        }

        textarea,
        input[type="text"],
        input[type="number"] {
            outline: none;
            border: 1px solid #b5b5b5;
        }

        .fsw_inner {
            border: none !important;
            background: transparent !important;
        }

        .fsw_inputBox {
            background: #fff;
            border-radius: 3px;
            margin-right: 5px;
            border: solid 1px #b9c8e3;
            min-height: 76px;
        }

        .fsw .fsw_inputBox:last-child {
            border-right: solid 1px #b9c8e3;
        }

        .clsExpandCollapse {
            margin-right: 5px;
            margin-left: 5px;
            font-size: 0.8rem;
        }

        .producthrchy {
            background: #F07C00;
        }

        #divProxySBFTbl th {
            white-space: nowrap;
        }

        #divProxySBFTbl table tr.Active,
        #divProxySBFPopup table tr.Active,
        #divCopyBucketPopupTbl table tr.Active,
        #divHierPopupTbl table tr.Active {
            background: #C0C0C0;
        }

        /*#divProxySBFTbl table tr.ActiveBase,
        #divBaseProxySBFTbl table tr.ActiveBase {
            background: #AEAEFF !important;
        }*/
        tr.ActiveBase {
            background: #AEAEFF !important;
        }

        .fixed-top {
            z-index: 99 !important;
        }

        #divProxySBFTbl td,
        #divHierSelectionTbl td,
        #divHierPopupTbl td {
            font-size: 0.7rem !important;
        }

        #divProxySBFTbl table tr td:nth-child(1),
        #divProxySBFTbl table tr td:nth-child(7) {
            text-align: center;
        }

        #divBaseSBFTbl table.clstbl-baseSBF th:nth-child(2),
        #divBaseSBFTbl table.clstbl-baseSBF th:nth-child(3),
        #divBaseSBFTbl table.clstbl-baseSBF th:nth-child(4) {
            text-align: center;
        }

        #divBaseSBFTbl table.clstbl-baseSBF tr td:nth-child(2),
        #divBaseSBFTbl table.clstbl-baseSBF tr td:nth-child(4) {
            text-align: center;
        }

        #divBaseSBFTbl table.clstbl-baseSBF tr td:nth-child(3) input {
            text-align: center;
            border-radius: 3px;
            border-color: transparent;
        }

        #divBaseSBFTbl table.clstbl-baseSBF tr td:nth-child(3) img {
            height: 12px;
        }

        input[type='text'] {
            width: 100%;
        }

        .btn-inactive {
            color: #F26156 !important;
            background: transparent !important;
        }

        .btn-disabled {
            cursor: not-allowed;
            color: #000 !important;
            box-shadow: none !important;
            background: #888 !important;
            border-color: #888 !important;
        }

        .btn-primary {
            background: #F26156;
            border-color: #F26156;
            color: #fff;
        }

            .btn-primary:focus {
                box-shadow: 0 0 0 0.2rem rgba(216,31,16,0.2) !important;
            }

            .btn-primary:not(:disabled):not(.disabled):active,
            .show > .btn-primary.drop,
            .btn-primary:active,
            .btn-primary:hover {
                background: #D81F10 !important;
                border-color: #D81F10;
                color: #fff !important;
            }

            .btn-primary:not(:disabled):not(.disabled).active {
                background: #AA180D !important;
            }

        a.btn-small {
            cursor: pointer;
            font-size: 0.6rem;
            margin: 0.2rem 0;
            padding: 0 0.4rem 0.1rem;
            color: #ffffff !important;
        }

        .btns-outline.active {
            background: #003da7;
            color: #ffffff !important;
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
        #divReport img {
            cursor: pointer;
        }

        #tblleftfixed tr td:nth-child(1) {
            text-align: center;
        }

        table.clsReport tr td {
            height: 50px;
            min-height: 50px;
        }

        table.clsReport tr th {
            text-align: center;
            vertical-align: middle;
            box-sizing: border-box;
            white-space: nowrap;
        }

        table.clsReport tr td {
            width: 100px;
            min-width: 100px;
        }

            table.clsReport tr td:nth-child(1),
            table.clsReport tr td:nth-child(2) {
                width: 30px;
                min-width: 30px;
            }

            table.clsReport tr td:nth-child(12) {
                width: 120px;
                min-width: 120px;
                text-align: left;
            }

        #divReport td.clstdAction {
            text-align: center;
            width: 70px;
            min-width: 70px;
        }

            #divReport td.clstdAction img {
                margin: 0 3px;
                height: 14px;
                cursor: pointer;
            }

        table.clsReport tr td:nth-child(2),
        table.clsReport tr td:nth-child(8),
        table.clsReport tr td:nth-child(9),
        table.clsReport tr td:nth-child(10),
        table.clsReport tr td:nth-child(11),
        table.clsReport tr td:nth-child(12),
        table.clsReport tr td:nth-child(13),
        table.clsReport tr td:nth-child(14),
        table.clsReport tr td:nth-child(15),
        table.clsReport tr td:nth-child(16) {
            text-align: center;
        }

        #divChannelTblforCopy table tr td:nth-child(1),
        #divClusterTblforCopy table tr td:nth-child(1) {
            width: 30px;
        }

        span.clstdExpandedContent {
            float: left;
            width: 120px;
            min-width: 120px;
            padding: 0 0 1px 0;
            white-space: normal;
            display: inline-block;
            text-align: left !important;
            font-size: .55rem !important;
        }

        table.clsReport td.clstdExpandedContent {
            border: none;
            width: 126px;
            height: auto;
            min-width: 100px;
            min-height: auto;
            white-space: normal;
            padding: 1px 0 0 3px;
            text-align: left !important;
            font-size: .55rem !important;
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
                /*color: #003DA7;*/
                text-align: left;
                border-bottom: 2px solid #003DA7 !important;
            }

                .customtooltip table > thead > tr > th,
                .customtooltip table > tbody > tr > td {
                    padding: .3rem;
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
    <style>
        div.clsAppRuleSlabContainer {
            width: 100%;
            margin-bottom: 2px;
            border: 1px solid #5e84ca;
        }

        div.clsAppRuleHeader {
            background: #044d91;
            color: #fff;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 3px 3px 0 0;
        }

        div.clsAppRuleSubHeader {
            background: #b9d2ff;
            color: #044d91;
            font-weight: 700;
            padding-left: 6px;
        }

            div.clsAppRuleSubHeader i {
                float: right;
                margin: 2px 5px;
                font-size: 0.6rem;
            }

        table.clsAppRule {
            font-size: 0.54rem;
            margin-bottom: 0.2rem;
        }

            table.clsAppRule tr:nth-child(1) th:nth-child(2),
            table.clsAppRule tr:nth-child(1) th:nth-child(3) {
                width: auto;
                min-width: auto;
                white-space: nowrap;
            }

            table.clsAppRule tr td {
                height: auto;
                min-height: auto;
                text-align: left !important;
            }

                table.clsAppRule tr td i {
                    margin: 2px 5px;
                }

        .slab-active {
            background: #F0F8FF !important;
        }
    </style>
    <style>
        table.clstbl-Reject th:nth-child(1) {
            width: 36px;
            text-align: center;
        }

        table.clstbl-Reject th:nth-child(2) {
            width: 200px;
        }

        table.clstbl-Reject tr td:nth-child(1) {
            text-align: center;
        }

        table.clstbl-Reject tr td:nth-child(3) textarea {
            border: none;
        }
    </style>
    <style type="text/css">
        table.clsInitiativeLst th {
            text-align: center;
        }

            table.clsInitiativeLst th:nth-child(1) {
                width: 4%;
            }

            table.clsInitiativeLst th:nth-child(2) {
                width: 8%;
            }

            table.clsInitiativeLst th:nth-child(3),
            table.clsInitiativeLst th:nth-child(4) {
                width: 22%;
            }

            table.clsInitiativeLst th:nth-child(5) {
                width: 28%;
            }

            table.clsInitiativeLst th:nth-child(6) {
                width: 4%;
            }

            table.clsInitiativeLst th:nth-child(7) {
                width: 10%;
            }

        table.clsInitiativeLst tr td:nth-child(1),
        table.clsInitiativeLst tr td:nth-child(2),
        table.clsInitiativeLst tr td:nth-child(6),
        table.clsInitiativeLst tr td:nth-child(7) {
            text-align: center;
        }
    </style>
    <style type="text/css">
        .clsdiv-legend-block {
            margin-right: 12px;
            display: inline-block;
        }

        .clsdiv-legend-color {
            width: 10px;
            height: 10px;
            margin-right: 3px;
            border-radius: 2px;
            border: 1px solid #888;
            display: inline-block;
        }

        .clsdiv-legend-text {
            font-size: 0.72rem;
            display: inline-block;
        }
    </style>

    <style type="text/css">
        #tblClusterChannelMappingforImportHeader th {
            text-align: center;
            vertical-align: middle;
        }

            #tblClusterChannelMappingforImportHeader th:nth-child(1),
            #tblClusterChannelMappingforImport tr td:nth-child(1) {
                width: 140px;
            }

            #tblClusterChannelMappingforImportHeader th:nth-child(2),
            #tblClusterChannelMappingforImport tr td:nth-child(2) {
                width: 200px;
            }

        #tblClusterChannelMappingforImport td {
            padding-left: 10px;
        }

        #tblClusterChannelMappingforImport tr td:nth-child(1) {
            color: #0080FF;
            font-weight: 600;
            font-size: 0.9rem;
            padding-left: 5px;
        }

        #tblClusterChannelMappingforImport input[type=checkbox],
        #tblClusterChannelMappingforImportHeader input[type=checkbox] {
            margin-right: 10px;
            display: inline-block;
        }

        #tblClusterChannelMappingforImport input[type=text],
        #tblClusterChannelMappingforImportHeader input[type=text] {
            width: 90%;
            font-size: 0.76rem;
            border-radius: 4px;
            padding: 0 0 0 5px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <h4 class="middle-title" id="Heading" style="font-size: .92rem">
        <i class="fa fa-arrow-circle-down" style="margin-right: 10px;" onclick="fnCollapsefilter(this);"></i>
        SBD Master
        <span style="font-size: .7rem; margin-left: 20px; color: #666; cursor: pointer;" flgvisiblehierfilter="0" onclick="fnShowHierFilter(this);">Hierarchy Filter</span>
    </h4>
    <div class="row no-gutters" style="margin-top: -10px;">
        <div class="fsw col-12" id="Filter">
            <div class="fsw_inner">
                <div class="fsw_inputBox" style="width: 9%; padding: 6px 10px;">
                    <div class="fsw-title">Month</div>
                    <div class="d-block">
                        <select id="ddlQuarter" class="form-control form-control-sm" onchange="fnGetReport(0);"></select>
                    </div>
                </div>
                <div class="fsw_inputBox" style="width: 14%; padding: 6px 10px;">
                    <div class="fsw-title">Stage</div>
                    <div class="d-block">
                        <select id="ddlStatus" class="form-control form-control-sm" onchange="fnGetReport(0);"></select>
                    </div>
                </div>
                <div class="fsw_inputBox" id="divHierFilterBlock" style="width: 18%; padding: 6px;">
                    <div class="row">
                        <div class="col-3" id="MSMPFilterBlock" style="display: none; padding-right: 0;">
                            <div class="fsw-title">ms&amp;P</div>
                            <div class="d-block">
                                <select id="ddlMSMPAlies" multiple="multiple"></select>
                            </div>
                        </div>
                        <div class="col-5" id="HierFilterBlock" style="display: none; padding-right: 0;">
                            <div class="fsw-title">Filter</div>
                            <div class="d-block">
                                <a id="txtProductHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="1" prodlvl="40" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Product Filter" style="font-size: 0.8rem;">Product</a>
                                <a id="btnClusterFilter" class="btn btn-primary btn-sm" href="#" onclick="fnShowClusterPopup(this, true);" title="Cluster Filter" mth="0" yr="0" selectedstr="" style="font-size: 0.8rem; padding: 0.25rem 0.2rem;">Cluster</a>
                                <a id="txtChannelHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="3" prodlvl="210" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Channel Filter" style="font-size: 0.8rem; padding: 0.25rem 0.2rem; margin-right: 2%;">Channel</a>
                                <a id="btnReset" class="btn btn-primary btn-sm" href="#" onclick="fnResetFilter();" title="Reset All Filters" style="font-size: 0.8rem;">Reset</a>
                                <a id="btnShowRpt" class="btn btn-primary btn-sm" href="#" onclick="fnGetReport(0);" title="Show Filtered Initiative(s)" style="font-size: 0.8rem;">Show</a>
                            </div>
                        </div>
                        <div class="col-12" id="BookmarkFilterBlock">
                            <div class="fsw-title">Bookmark</div>
                            <select id="ddlBookmark" class="form-control form-control-sm" style="display: inline-block; width: 54%;" onchange="fnBookmarkFilter();">
                                <option value="0">All</option>
                                <option value="1">Bookmark</option>
                                <option value="2">Not Bookmark</option>
                            </select>
                            <img id="btnExcel" src="../../Images/excel.png" onclick="return fnDownload(); return false;" title="Download Report" style="margin-left: 10px; cursor: pointer;" />
                            <img id="btnChangeLogExcel" src="../../Images/excel-log.png" onclick="return fnChangeLogDownload(); return false;" title="Download Change Log" style="width: 35px; margin-left: 5px; cursor: pointer;" />
                        </div>
                    </div>
                </div>
                <div class="fsw_inputBox" id="divTypeSearchFilterBlock" style="width: 45%; padding: 6px 8px;">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Type atleast 3 characters .." />
                    </div>
                </div>
                <div class="fsw_inputBox" id="divAddNewFilterBlock" style="width: 14%; padding: 6px 2px 0 6px;">
                    <div class="fsw-title">SBD</div>
                    <div class="d-block">
                        <a href="##" class="btn btn-primary btn-sm" id="btnAddNewINIT" onclick="fnAddNew();" title="Add New Norm"><i class="fa fa-plus-square"></i>&nbsp; Add</a>
                        <a href="##" class="btn btn-primary btn-sm" id="btnCopyINIT" onclick="fnImportPrevQtrSBDPopup();" title="Import Norm from previous month to current month" style="margin-left: 1%;"><i class="fa fa-clone"></i>&nbsp; Import</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="tab-content" class="tab-content">
        <div role="tabpanel" class="tab-pane fade show active">
            <div><a id="btnInitExpandedCollapseMode" flgcollapse="1" href="#" style="color: #80BDFF;" onclick="fnInitExpandedCollapseMode();">Collapsed Mode</a></div>
            <div id="divReport" class="row">
                <div class="col-2" id="divLeftReportHeader" style="padding-right: 0; overflow: hidden;"></div>
                <div class="col-10" id="divRightReportHeader" style="overflow-x: hidden; overflow-y: scroll; padding-left: 0; margin-left: -2px;"></div>
                <div class="col-2" id="divLeftReport" style="padding-right: 0; overflow-y: hidden; overflow-x: scroll;"></div>
                <div class="col-10" id="divRightReport" style="overflow-y: scroll; overflow-x: scroll; padding-left: 0; margin-left: -3px;"></div>
            </div>
        </div>
    </div>
    <div id="divCopyBucketPopup" style="display: none;">
        <div class="row no-gutters">
            <div class="col-6">
                <div class="pl-2">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        <div id="PopupCopyBucketlbl" class="w-50"></div>
                        <div id="PopupCopyClusterddl" class="text-right w-50" selectedids="" currentnode="" IsSameforAllCluster="0" IsClusterDetailsUnchanged="1">
                            Cluster <select id="ddlSelectedCluster" class="ml-2" style="min-width: 100px;" onchange="fnClusterwiseBaseProxySBFSelection();"></select>
                        </div>
                    </div>
                    <div id="divCopyBucketPopupTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
            <div class="col-6">
                <div class="prodLvl" style="margin-left: 1%;">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        Your Selection
                    </div>
                    <div id="divCopyBucketSelectionTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
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
                        <%--<a id="btnAddNewNode" class="btns-outline" href="#" onclick="fnAddNewNode();" style="display: none;">Add New</a>--%>
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
    <div id="divClusterPopup" style="display: none;">
        <div class="row no-gutters">
            <div class="col-7">
                <div class="pl-2">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        <div class="d-block">Cluster(s)</div>
                    </div>
                    <div id="divClusterPopupTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
            <div class="col-5">
                <div class="prodLvl" style="margin-left: 1%;">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        Your Selection
                    </div>
                    <div id="divClusterSelectionTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="divProxySBFPopup" style="display: none;"></div>
    <div id="divBaseProxySBFPopup" style="display: none;">
        <div class="row no-gutters">
            <div class="col-12">
                <div class="d-flex" style="padding: 4px 12px; margin-bottom: 6px; border: 2px solid #F07C00; border-radius: 4px;">
                    <div class="d-block" style="width: 55%; color: #F07C00; font-size: 1.3rem; font-weight: 700; text-align: right;">What do you wish to do ?</div>
                    <div id="divBaseSBFActionbtns" class="d-block" style="width: 45%; text-align: right;">
                        <a class="btn btn-primary btn-sm" href="#" onclick="fnCombi(this,1);" style="border-color: #003da7; margin-right: 1%;">Add Individual Combi</a>
                        <a class="btn btn-primary btn-sm" href="#" onclick="fnCombi(this,2);" style="border-color: #003da7; margin-right: 1%;">Modify Individual Combi</a>
                        <a class="btn btn-primary btn-sm" href="#" onclick="fnCombi(this,3);" style="border-color: #003da7;">Add Multiple Base</a>
                    </div>
                </div>
            </div>
            <div class="col-5">
                <div class="prodLvl">
                    <div id="divBaseSBFlbl" class="align-items-center justify-content-between producthrchy">
                        <div>Base Sub-BrandForm</div>
                    </div>
                    <div id="divBaseSBFTbl" style="height: 190px; overflow-y: auto; width: 100%;"></div>
                    <div id="divSelectedBaseSBFTbl" style="display: none;"></div>
                    <div id="divBaseProxySBFlbl" class="align-items-center producthrchy">
                        <div class="d-block">Proxy Sub-BrandForm</div>
                    </div>
                    <div id="divBaseProxySBFTbl" style="height: 190px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
            <div class="col-7">
                <div class="pl-2">
                    <div class="d-flex align-items-center producthrchy">
                        <div class="d-block">Sub-BrandForm</div>
                    </div>
                    <div id="divProxySBFTbl" brand="0" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
        </div>
    </div>
    <div id="divFooter" style="width: 100%; background: #ddd; border: 1px solid #ccc; position: fixed; bottom: 0; padding: 6px 0; margin-left: -23px;">
        <div id="divLegends" style="width: 67%; margin-left: 5px; padding: 5px 8px; background: #fff; border: 1px solid #bbb; border-radius: 4px; display: inline-block; float: left;"></div>
        <div id="divButtons" style="width: 32%; display: inline-block; text-align: right;"></div>
    </div>
    <div id="dvSBDListforImport" style="display: none;">
        <div class="row no-gutters">
            <div class="col-12 fsw" style="margin-bottom: 4px;">
                <div class="fsw_inputBox" style="width: 100%; display: inline-block; min-height: 46px;">
                    <div class="fsw-title" style="display: inline;">Month</div>
                    <select id="ddlQuarterPopup" class="form-control form-control-sm ml-2 mr-4" style="width: 100px; display: inline;"></select>
                    <a id="btnImportProductHierFilter" class="btn btn-primary btn-sm mr-1" href="#" buckettype="1" prodlvl="40" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Product Filter" style="font-size: 0.8rem;">Product</a>
                    <a id="btnImportClusterHierFilter" class="btn btn-primary btn-sm mr-1" href="#" onclick="fnShowClusterPopup(this, false);" title="Cluster Filter" mth="0" yr="0" selectedstr="" style="font-size: 0.8rem;">Cluster</a>
                    <a id="btnImportChannelHierFilter" class="btn btn-primary btn-sm mr-4" href="#" buckettype="3" prodlvl="210" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Channel Filter" style="font-size: 0.8rem;">Channel</a>
                    <a id="btnImportSBD" class="btn btn-primary btn-sm" href="#" onclick="fnImportPrevQtrSBD();" title="Get Norm(s) for Import" style="font-size: 0.8rem;">Get SBD(s) List</a>
                </div>
            </div>
        </div>
        <div id="dvSBDListforImportBody"></div>
    </div>
    <div id="dvRejectComment" style="display: none;">
        <div id="dvPrevComment" style="max-height: 300px; overflow-y: auto;"></div>
        <div style="width: 100%; border-bottom: 1px solid #ddd; font-weight: 700; padding-top: 10px;">Your Comments :</div>
        <textarea rows="6" style="width: 100%; border: none;"></textarea>
    </div>
    <div id="divAddNewBucketPopup" style="display: none;">
        <div class="fsw-title" style="margin-bottom: 0;">Name :</div>
        <input id="txtBucketName" style='width: 100%; box-sizing: border-box; margin: 5px 0 10px 0; border: 1px solid #ccc;' />

        <div class="fsw-title" style="margin-bottom: 0;">Description :</div>
        <textarea id="txtBucketDescription" style='width: 100%; box-sizing: border-box; overflow-y: auto; margin: 5px 0 10px 0;' rows='4'></textarea>
    </div>
    <div id="divChannelClusterforCopy" style="display: none;">
        <div class="row no-gutters">
            <div class="col-6">
                <div class="pl-2">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        Channel :
                    </div>
                    <div id="divChannelTblforCopy" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
            <div class="col-6">
                <div class="pl-2">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        Cluster :
                    </div>
                    <div id="divClusterTblforCopy" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
        </div>
    </div>
    <div id="divSBDWiseChannelClusterforImport" style="display: none;"></div>

    <div id="divMsg" class="clsMsg"></div>
    <div id="divConfirm" style="display: none;"></div>

    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>

    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />

    <asp:HiddenField ID="hdnSBDID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />
    <asp:HiddenField ID="hdnQuarter" runat="server" />
    <asp:HiddenField ID="hdnProcessGrp" runat="server" />
    <asp:HiddenField ID="hdnDisburshmentType" runat="server" />
    <asp:HiddenField ID="hdnIncentiveType" runat="server" />
    <asp:HiddenField ID="hdnMultiplicationType" runat="server" />
    <asp:HiddenField ID="hdnInitType" runat="server" />
    <asp:HiddenField ID="hdnUOM" runat="server" />
    <asp:HiddenField ID="hdnBenefit" runat="server" />
    <asp:HiddenField ID="hdnAppliedOn" runat="server" />
    <asp:HiddenField ID="hdnBucketID" runat="server" />
    <asp:HiddenField ID="hdnBucketName" runat="server" />
    <asp:HiddenField ID="hdnBucketType" runat="server" />
    <asp:HiddenField ID="hdnProductLvl" runat="server" />
    <asp:HiddenField ID="hdnLocationLvl" runat="server" />
    <asp:HiddenField ID="hdnChannelLvl" runat="server" />
    <asp:HiddenField ID="hdnSelectedHier" runat="server" />
    <asp:HiddenField ID="hdnSelectedFrmFilter" runat="server" />
    <asp:HiddenField ID="hdnIsNewAdditionAllowed" runat="server" />
    <asp:HiddenField ID="hdnjsonarr" runat="server" />
    <asp:HiddenField ID="hdnMSMPAlies" runat="server" />
    <asp:HiddenField ID="hdnFrequency" runat="server" />
    <asp:HiddenField ID="hdnBaseSBFAction" runat="server" />
    <asp:HiddenField ID="hdnBrandlstforNewNode" runat="server" />
    <asp:HiddenField ID="hdnBrandFormlstforNewNode" runat="server" />

    <asp:HiddenField ID="hdnSBFHierforBasePopup" runat="server" />

    <asp:Button ID="btnDownload" runat="server" Text="." OnClick="btnDownload_Click" Style="visibility: hidden;" />
    <asp:Button ID="btnSBDDownload" runat="server" Text="." OnClick="btnSBDDownload_Click" Style="visibility: hidden;" />
    <asp:Button ID="btnChangeLogDownload" runat="server" Text="." OnClick="btnChangeLogDownload_Click" Style="visibility: hidden;" />
</asp:Content>
