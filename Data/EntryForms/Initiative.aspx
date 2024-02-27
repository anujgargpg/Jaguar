<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/site.master" AutoEventWireup="true" CodeFile="Initiative.aspx.cs" Inherits="_BucketMstr" ValidateRequest="false" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../../Styles/Multiselect/jquery.multiselect.css" rel="stylesheet" type="text/css" />
    <link href="../../Styles/Multiselect/jquery.multiselect.filter.css" rel="stylesheet" type="text/css" />

    <script src="../../Scripts/MultiSelect/jquery.multiselect.js" type="text/javascript"></script>
    <script src="../../Scripts/MultiSelect/jquery.multiselect.filter.js" type="text/javascript"></script>

    <script src="../../Scripts/js_InitiativeForm.js"></script>
    <script src="../../Scripts/js_FBImport.js"></script>
    <script src="../../Scripts/js_Utilities.js"></script>

    <link href="../../CSS/FBImport.css" rel="stylesheet" />
    <style type="text/css">
        select {
            width: 100%;
        }

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
        
        #divPopupHierTblBody table tr.Active,
        #divCopyBucketPopupTbl table tr.Active,
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

            .btn-primary:not(:disabled):not(.disabled).active,
            .btn-primary:not(:disabled):not(.disabled):active,
            .show > .btn-primary.drop,
            .btn-primary:active,
            .btn-primary:hover {
                background: #D81F10 !important;
                border-color: #D81F10;
                color: #fff !important;
            }

        a.btn-small {
            cursor: pointer;
            font-size: 0.6rem;
            margin: 0.2rem 0;
            padding: 0 0.4rem 0.1rem;
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
        #divReport img,
        #divApplicationRulePopup img {
            cursor: pointer;
        }

        table.clsReport tr td {
            height: 50px;
            min-height: 50px;
        }

        table.clsReport tr th {
            text-align: center;
            vertical-align: middle;
        }

        table.clsReport tr td:nth-child(1),
        table.clsReport tr td:nth-child(2) {
            width: 30px;
            min-width: 30px;
        }

        table.clsReport tr td:nth-child(4) {
            width: 120px;
            min-width: 120px;
            text-align: left;
        }

        table.clsReport tr td:nth-child(5),
        table.clsReport tr td:nth-child(6) {
            width: 170px;
            min-width: 170px;
            max-width: 170px;
        }

        table.clsReport tr td:nth-child(4),
        table.clsReport tr td:nth-child(5),
        table.clsReport tr td:nth-child(6) {
            word-break: break-all;
        }

        table.clsReport tr td:nth-child(12),
        table.clsReport tr td:nth-child(13),
        table.clsReport tr td:nth-child(14),
        table.clsReport tr td:nth-child(15) {
            width: 110px;
            min-width: 110px;
        }

        table.clsReport tr td:nth-child(16),
        table.clsReport tr td:nth-child(19) {
            width: 72px;
            min-width: 72px;
        }

        table.clsReport tr td:nth-child(17),
        table.clsReport tr td:nth-child(20),
        table.clsReport tr td:nth-child(21) {
            width: 140px;
            min-width: 140px;
        }

        table.clsReport tr td:nth-child(18),
        table.clsReport tr td:nth-child(23) {
            width: 84px;
            min-width: 84px;
        }

        #divReport td.clstdAction {
            text-align: center;
            width: 74px;
            min-width: 74px;
        }

            #divReport td.clstdAction img {
                margin: 0 3px;
                height: 14px;
                cursor: pointer;
            }

        table.clsReport tr td:nth-child(1),
        table.clsReport tr td:nth-child(2),
        table.clsReport tr td:nth-child(9),
        table.clsReport tr td:nth-child(10),
        table.clsReport tr td:nth-child(11),
        table.clsReport tr td:nth-child(12),
        table.clsReport tr td:nth-child(13),
        table.clsReport tr td:nth-child(14),
        table.clsReport tr td:nth-child(15),
        table.clsReport tr td:nth-child(16),
        table.clsReport tr td:nth-child(17),
        table.clsReport tr td:nth-child(18),
        table.clsReport tr td:nth-child(19),
        table.clsReport tr td:nth-child(20),
        table.clsReport tr td:nth-child(21),
        table.clsReport tr td:nth-child(23) {
            text-align: center;
        }

            table.clsReport tr td:nth-child(15) input[type='checkbox'] {
                height: 11px;
                margin-right: 10px;
                margin-bottom: 6px;
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
            width: 17%;
            text-align: center;
        }

            table.clsInitiativeLst th:nth-child(1) {
                width: 4%;
            }

            table.clsInitiativeLst th:nth-child(2),
            table.clsInitiativeLst th:nth-child(3) {
                width: 10%;
            }

            table.clsInitiativeLst th:nth-child(2),
            table.clsInitiativeLst th:nth-child(3) {
                width: 10%;
            }

            table.clsInitiativeLst th:nth-child(6),
            table.clsInitiativeLst th:nth-child(7) {
                width: 24%;
            }

        table.clsInitiativeLst tr td:nth-child(1) {
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
        #divPopup input[type='checkbox'] {
            height: 11px;
            margin-right: 5px;
        }

        #divPopup div.lbl-header {
            font-weight: 600;
            font-size: 0.86rem;
            box-sizing: border-box;
            padding: 10px !important;
        }

        #divPopup ul {
            list-style: none;
            font-weight: 500;
            overflow-y: auto;
            max-height: 336px;
        }

            #divPopup ul li {
                font-weight: 500;
                margin-bottom: 4px;
            }
    </style>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <h4 class="middle-title" id="Heading" style="font-size: .92rem">
        <i class="fa fa-arrow-circle-down" style="margin-right: 10px;" onclick="fnCollapsefilter(this);"></i>
        Initiative Master
        <span style="font-size: .7rem; margin-left: 20px; color: #666; cursor: pointer;" flgvisiblehierfilter="0" onclick="fnShowHierFilter(this);">Hierarchy Filter</span>
    </h4>

    <div class="row no-gutters" style="margin-top: -10px;">
        <div class="fsw col-12" id="Filter">
            <div class="fsw_inner">
                <div class="fsw_inputBox" style="width: 8%; padding: 6px;">
                    <div class="fsw-title">Month</div>
                    <div class="d-block">
                        <select id="ddlMonth" class="form-control form-control-sm" onchange="fnGetReport(0);"></select>
                    </div>
                </div>
                <div class="fsw_inputBox" style="width: 12%; padding: 6px 10px;">
                    <div class="fsw-title">Stage</div>
                    <div class="d-block">
                        <select id="ddlStatus" class="form-control form-control-sm" onchange="fnGetReport(0);"></select>
                    </div>
                </div>
                <div class="fsw_inputBox" id="divHierFilterBlock" style="width: 12%; padding: 6px;">
                    <div class="row">
                        <div class="col-4" id="MSMPFilterBlock" style="display: none; padding-right: 0;">
                            <div class="fsw-title">ms&amp;P</div>
                            <div class="d-block">
                                <select id="ddlMSMPAlies" multiple="multiple"></select>
                            </div>
                        </div>
                        <div class="col-5" id="HierFilterBlock" style="display: none; padding-right: 0;">
                            <div class="fsw-title">Filter</div>
                            <div class="d-block">
                                <a id="txtProductHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="1" prodlvl="" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Product Filter" style="font-size: 0.8rem; padding: 0.25rem 0.2rem;">Product</a>
                                <a id="txtLocationHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="2" prodlvl="" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Location Filter" style="font-size: 0.8rem; padding: 0.25rem 0.2rem;">Location</a>
                                <a id="txtChannelHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="3" prodlvl="" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Channel Filter" style="font-size: 0.8rem; padding: 0.25rem 0.2rem; margin-right: 2%;">Channel</a>
                                <a id="btnReset" class="btn btn-primary btn-sm" href="#" onclick="fnResetFilter();" title="Reset All Filters" style="font-size: 0.8rem; padding: 0.25rem 0.2rem;">Reset</a>
                                <a id="btnShowRpt" class="btn btn-primary btn-sm" href="#" onclick="fnGetReport(0);" title="Show Filtered Initiative(s)" style="font-size: 0.8rem; padding: 0.25rem 0.2rem;">Show</a>
                            </div>
                        </div>
                        <div class="col-12" id="BookmarkFilterBlock">
                            <div class="fsw-title">Bookmark</div>
                            <select id="ddlBookmark" class="form-control form-control-sm" style="display: inline-block; width: 66%;" onchange="fnBookmarkFilter();">
                                <option value="0">All</option>
                                <option value="1">Bookmark</option>
                                <option value="2">Not Bookmark</option>
                            </select>
                            <img id="btnExcel" src="../../Images/excel.png" onclick="return fnDownload();return false;" title="Download Report" style="margin-left: 10px; cursor: pointer;" />
                        </div>
                    </div>
                </div>
                <div class="fsw_inputBox" id="divTypeSearchFilterBlock" style="width: 49%; padding: 6px 8px;">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Type atleast 3 characters .." />
                    </div>
                </div>
                <div class="fsw_inputBox" id="divAddNewFilterBlock" style="width: 19%; padding: 6px 2px 0 6px;">
                    <div class="fsw-title">Initiative</div>
                    <div class="d-block">
                        <a href="##" class="btn btn-primary btn-sm" id="btnAddNewINIT" onclick="fnAddNew();" title="Add New Initiative"><i class="fa fa-plus-square"></i>&nbsp; Add</a>
                        <a href="##" class="btn btn-primary btn-sm" id="btnCopyINIT" onclick="fnCopyMultiInitiativePopup();" title="Import initiative from previous month to current month" style="margin-left: 1%;"><i class="fa fa-clone"></i>&nbsp; Import</a>                        
                        <a href="##" class="btn btn-primary btn-sm" id="btnImportFB" onclick="fnFBImportPopup(1,1,1);" title="Import FB(s)" style="margin-left: 1%;"><i class="fa fa-clone"></i>&nbsp;FB Import</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="tab-content" class="tab-content">
        <div role="tabpanel" class="tab-pane fade show active">
            <div><a id="btnInitExpandedCollapseMode" flgcollapse="1" href="#" style="color: #80BDFF;" onclick="fnInitExpandedCollapseMode();">Collapsed Mode</a></div>
            <div id="divReport" class="row">
                <div class="col-4" id="divLeftReportHeader" style="padding-right: 0; overflow: hidden;"></div>
                <div class="col-8" id="divRightReportHeader" style="overflow-x: hidden; overflow-y: scroll; padding-left: 0;"></div>
                <div class="col-4" id="divLeftReport" style="padding-right: 0; overflow-y: hidden; overflow-x: scroll;"></div>
                <div class="col-8" id="divRightReport" style="overflow-y: scroll; overflow-x: scroll; padding-left: 0;"></div>
            </div>
        </div>
    </div>
    <div id="divFooter" style="width: 100%; background: #ddd; border: 1px solid #ccc; position: fixed; bottom: 0; padding: 6px 0; margin-left: -23px;">
        <div id="divLegends" style="width: 67%; margin-left: 5px; padding: 5px 8px; background: #fff; border: 1px solid #bbb; border-radius: 4px; display: inline-block; float: left;"></div>
        <div id="divButtons" style="width: 32%; display: inline-block; text-align: right;"></div>
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
                        <a id="btnAddNewNode" class="btns-outline" href="#" onclick="fnAddNewNode();" style="display: none;">Add New</a>
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

    <div id="divPopupHierTbl" style="display: none;">
        <div class="row no-gutters">
            <div class="col-12">
                <div class="pl-2">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        Sub-Brand Form
                    </div>
                    <div id="divPopupHierTblBody" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
        </div>
    </div>


    <div id="divCopyBucketPopup" style="display: none;">
        <div class="row no-gutters">
            <div class="col-7">
                <div class="pl-2">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        <div id="PopupCopyBucketlbl" class="d-block"></div>
                    </div>
                    <div id="divCopyBucketPopupTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
            <div class="col-5">
                <div class="prodLvl" style="margin-left: 1%;">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        Your Selection
                    </div>
                    <div id="divCopyBucketSelectionTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="divApplicationRulePopup" style="display: none;">
        <div class="fsw-title" style="margin-bottom: 0; color: #f06255;">Description :</div>
        <textarea id="txtArINITDescription" class="w-100 pl-2 pr-2" style='background-color: #f9fcff; box-sizing: border-box; overflow-y: auto; margin: 5px 0 10px 0;' rows='2' readonly="readonly"></textarea>

        <div>
            <div class="fsw-title mb-0 w-75 d-inline-block">
                <span style="color: #f06255;">Channel Summary Description :</span>
                <a href="#" class="ml-2" style="color: #0000ff; font-size: 0.7rem; font-weight: 500; text-transform: capitalize;" onclick="fnCopyfrmDescr(this);">copy from the Description</a>
            </div>
            <div class="text-right d-inline-block" style="width: 24%;">
                <a href="#" id="btnArChannelSummaryDescriptionSuggestion" class="btn btn-info btn-small mr-4" onclick="fnGetSKUlstforSuggestion();">Get suggestion</a>
                Length : <span id="lbltxtChannelSummarylengthPopup" style="font-weight: 700;">0/100</span>
            </div>
        </div>
        <textarea id="txtArChannelSummaryDescription" class="w-100 m-0 pl-2 pr-2" style='box-sizing: border-box; overflow-y: auto;' rows='2' maxlength='100' onkeyup='fncallength(this, 2);'></textarea>
        <div style="margin-top: -5px; font-weight: 500; color: #888888;">
            <div class="w-100 d-inline-block text-right">
                <span class="mr-1" style="margin-top: -5px; font-weight: 500; color: #888888; text-transform: capitalize;">*</span>Max-length shouldn't be more than 100 words.
            </div>
        </div>

        <div class="row mt-3 mb-2">
            <div class="col-md-3" style="color: #f06255; font-size: 0.9rem; font-weight: 600;">Applicable (%)</div>
            <div class="col-md-1">:</div>
            <div class="col-md-2">
                <input type="text" id="txtApplicablePer" style='width: 100%;' />
            </div>
            <div class="col-md-6"></div>
        </div>

        <div class="clsBaseProd">
            <div class="clsAppRuleHeader" style="font-size: 0.9rem;">Base Products :</div>
            <div id="divAppRuleBaseProdSec" class="clsAppRuleSlabContainer" style="padding: 0 6px 6px;">
            </div>
        </div>
        <hr style="border-top: 3px solid #70baff;">
        <div class="clsInitProd">
            <div class="clsAppRuleHeader" style="font-size: 0.9rem;">Initiative Products :</div>
            <div id="divAppRuleBenefitSec" class="clsAppRuleSlabContainer" style="border-radius: 3px 3px 0 0; padding: 6px;">
                <table class='table table-bordered table-sm' style="margin-bottom: 0;">
                    <thead>
                        <tr>
                            <th style="text-align: center; vertical-align: middle;">Product</th>
                            <th style="width: 120px; text-align: center; vertical-align: middle;">Initiative Type</th>
                            <th style="width: 120px; text-align: center; vertical-align: middle;">Applied On</th>
                            <th style="width: 120px; text-align: center; vertical-align: middle;">Value/Percentage</th>
                            <th iden='Action' style="width: 80px; text-align: center; vertical-align: middle;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="clsInitProd">
            <%--<div class="clsAppRuleHeader" style="font-size: 0.9rem;">Initiative Products :</div>--%>
            <div id="divAppRuleMixedCases" class="clsAppRuleSlabContainer" style="border-radius: 3px 3px 0 0; padding: 6px;">
                <table class='table table-bordered table-sm' style="margin-bottom: 0;">
                    <thead>
                        <tr>
                            <th style="text-align: center; vertical-align: middle;">Product</th>
                            <th style="width: 120px; text-align: center; vertical-align: middle;">Condition Check</th>
                            <th style="width: 120px; text-align: center; vertical-align: middle;">Minimum</th>
                            <th style="width: 120px; text-align: center; vertical-align: middle;">Maximum</th>
                            <th style="width: 120px; text-align: center; vertical-align: middle;">UOM</th>
                            <th style="width: 120px; text-align: center; vertical-align: middle;">Initiative Type</th>
                            <th style="width: 120px; text-align: center; vertical-align: middle;">Applied On</th>
                            <th style="width: 120px; text-align: center; vertical-align: middle;">Value/Percentage</th>
                            <th iden='Action' style="width: 80px; text-align: center; vertical-align: middle;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>


    <div id="dvInitiativeList" style="display: none;">
        <div class="row no-gutters">
            <div class="col-6 fsw" style="margin-bottom: 4px;">
                <div class="fsw_inputBox" style="width: 100%; display: inline-block; min-height: 46px;">
                    <div class="fsw-title" style="display: inline;">Month</div>
                    <select id="ddlMonthPopup" class="form-control form-control-sm ml-2 mr-4" style="width: 100px; display: inline;"></select>
                    <a id="btnImportProductHierFilter" class="btn btn-primary btn-sm mr-1" href="#" buckettype="1" prodlvl="40" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Product Filter" style="font-size: 0.8rem;">Product</a>
                    <a id="btnImportLocationHierFilter" class="btn btn-primary btn-sm mr-1" href="#" buckettype="2" prodlvl="120" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Location Filter" style="font-size: 0.8rem;">Location</a>
                    <a id="btnImportChannelHierFilter" class="btn btn-primary btn-sm mr-4" href="#" buckettype="3" prodlvl="210" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Channel Filter" style="font-size: 0.8rem;">Channel</a>
                    <a class="btn btn-primary btn-sm" href="#" onclick="fnCopyMultiInitiative();" title="Get Initiative(s) for Import" style="font-size: 0.8rem;">Get Initiative(s) List</a>
                </div>
            </div>
            <div class="col-6 fsw" style="margin-bottom: 4px;">
                <div class="fsw_inputBox" style="width: 100%; display: inline-block; min-height: 46px;">
                    <div class="d-block">
                        <input id="txtImportfilter" type="text" class="form-control form-control-sm" onkeyup="fnImportTypefilter();" placeholder="Type atleast 3 characters to Search .." />
                    </div>
                </div>
            </div>
        </div>
        <div id="dvInitiativeListBody" style="max-height: 424px; overflow-y: auto;"></div>
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

    <div id="divMsg" class="clsMsg"></div>
    <div id="divConfirm" style="display: none;"></div>
    <div id="divPopup" style="display: none;"></div>

    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>

    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />

    <asp:HiddenField ID="hdnInitID" runat="server" />
    <asp:HiddenField ID="hdnMonths" runat="server" />
    <asp:HiddenField ID="hdnProcessGrp" runat="server" />
    <asp:HiddenField ID="hdnDisburshmentType" runat="server" />
    <asp:HiddenField ID="hdnIncentiveType" runat="server" />
    <asp:HiddenField ID="hdnMultiplicationType" runat="server" />
    <asp:HiddenField ID="hdnUnitType" runat="server" />
    <asp:HiddenField ID="hdnINITType" runat="server" />
    <asp:HiddenField ID="hdnCOHType" runat="server" />
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
    <asp:HiddenField ID="hdnmonthyearexcel" runat="server" />
    <asp:HiddenField ID="hdnmonthyearexceltext" runat="server" />
    <asp:HiddenField ID="hdnjsonarr" runat="server" />
    <asp:HiddenField ID="hdnMSMPAlies" runat="server" />
    <asp:HiddenField ID="hdnMRAccount" runat="server" />

    <asp:HiddenField ID="hdnBrandlstforNewNode" runat="server" />
    <asp:HiddenField ID="hdnBrandFormlstforNewNode" runat="server" />

    <asp:Button ID="btnDownload" runat="server" Text="." OnClick="btnDownload_Click" Style="visibility: hidden;" />
</asp:Content>
