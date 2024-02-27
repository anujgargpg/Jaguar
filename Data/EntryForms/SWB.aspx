<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/site.master" AutoEventWireup="true" CodeFile="SWB.aspx.cs" Inherits="SWB" ValidateRequest="false" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../../Styles/Multiselect/jquery.multiselect.css" rel="stylesheet" type="text/css" />
    <link href="../../Styles/Multiselect/jquery.multiselect.filter.css" rel="stylesheet" type="text/css" />

    <script src="../../Scripts/MultiSelect/jquery.multiselect.js" type="text/javascript"></script>
    <script src="../../Scripts/MultiSelect/jquery.multiselect.filter.js" type="text/javascript"></script>

    <%--common functions--%>
    <script src="../../Scripts/js_SWBForm.js"></script>

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

        #divHierPopupTbl table tr.Active,
        #divSBFHierPopupTbl table tr.Active,
        #divCopyBucketPopupTbl table tr.Active {
            background: #C0C0C0;
        }

        .fixed-top {
            z-index: 99 !important;
        }

        #divHierPopupTbl td,
        #divSBFHierPopupTbl td,
        #divHierSelectionTbl td {
            font-size: 0.7rem !important;
        }

        #divSBFHierSelectionTbl {
            padding: 10px;
            border: 1px solid #666;
            background-color: #f7f7f7;
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
                background: #D81F10;
                border-color: #D81F10;
                color: #fff;
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
        #divReport img {
            cursor: pointer;
        }

        table.cls-tbl-Report tr td {
            height: 33px;
            min-height: 33px;
        }

        table.cls-tbl-Report tr th {
            text-align: center;
            vertical-align: middle;
        }

        table.cls-tbl-Report tr td:nth-child(1) {
            width: 5%;
            text-align: center;
        }

        table.cls-tbl-Report tr td:nth-child(2),
        table.cls-tbl-Report tr td:nth-child(3) {
            width: 24%;
            text-align: left;
        }

        table.cls-tbl-Report tr td:nth-child(4) {
            width: 40%;
            text-align: left;
        }

        table.cls-tbl-Report tr td.cls-td-Action {
            text-align: center;
            white-space: nowrap;
        }

            table.cls-tbl-Report tr td.cls-td-Action img {
                margin: 0 3px;
                height: 14px;
                cursor: pointer;
            }

        table.cls-tbl-Report tr td:nth-child(1) input[type='checkbox'] {
            height: 11px;
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

        table.cls-tbl-Report td.clstdExpandedContent {
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
        .td-container {
            position: relative;
            box-sizing: border-box;
        }

        .td-container-content {
            font-size: 0.6rem;
            padding-right: 30px;
        }

        .td-container-btn {
            top: 0px;
            right: 5px;
            position: absolute;
        }

        div.cls-div-drag-block {
            cursor: move;
            color: #64270B;
            border-radius: 3px;
            margin: 2px 8px 5px;
            border: 1px solid #DA7112;
            background-color: #F7CFA8;
        }

        div.cls-div-drag-block-mini {
            width: 49%;
            color: #64270B;
            margin: 0.5% 0.5%;
            border-radius: 3px;
            display: inline-block;
            border: 1px solid #DA7112;
            background-color: #F7CFA8;
        }

        div.cls-div-drag-count {
            width: 10%;
            padding: 4px 12px;
            font-weight: 800;
            text-align: center;
            display: inline-block;
            border-right: 1px solid #DA7112;
        }

        div.cls-div-drag-count-mini {
            width: 10%;
            padding: 0 4px;
            font-weight: 800;
            font-size: 0.5rem;
            text-align: center;
            display: inline-block;
            border-right: 1px solid #DA7112;
        }

        div.cls-div-drag-content {
            width: 90%;
            padding: 4px 12px;
            font-weight: 600;
            display: inline-block;
        }

        div.cls-div-drag-content-mini {
            width: 90%;
            padding: 0 4px;
            font-weight: 600;
            font-size: 0.5rem;
            display: inline-block;
        }

        div.cls-div-drag-block-1,
        div.cls-div-drag-block-2 {
            background-color: #EF913A !important;
        }

        div.cls-div-drag-block-3,
        div.cls-div-drag-block-4,
        div.cls-div-drag-block-5 {
            background-color: #F3AB69 !important;
        }
    </style>
    <style type="text/css">
        #divNote {
            border-radius: 4px;
            padding: 10px 14px 5px 15px;
            background: rgba(255,255,2355,.96);
        }

            #divNote ol {
                padding-left: 30px;
            }

            #divNote label {
                color: #044d91;
                font-size: 1rem;
                font-weight: 700;
            }

            #divNote li {
                font-weight: 500;
                font-size: 0.72rem;
                padding-bottom: 3px;
            }
    </style>
    <style type="text/css">
        #tblError th {
            color: #000;
            background: #dfdfff;
            border-color: #acacac;
        }
        #tblError th:nth-child(1) {
            width: 150px;
        }        
        #tblError tr td:nth-child(1) {
            color: #666666;
            font-weight: 700;
        }
    </style>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <h4 class="middle-title" id="Heading" style="font-size: .92rem">Site Priority</h4>

    <div class="row no-gutters" style="margin-top: -10px;">
        <div class="fsw col-12" id="Filter">
            <div class="fsw_inner">
                <%--<div class="fsw_inputBox" style="width: 12%; padding: 6px 10px;">
                    <div class="fsw-title">Stage</div>
                    <div class="d-block">
                        <select id="ddlStatus" class="form-control form-control-sm" onchange="fnGetReport();"></select>
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
                                <a id="txtProductHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="1" lvl="" selectedstr="" onclick="fnShowHierPopup(this, 0);" title="Product Filter" style="font-size: 0.8rem; padding: 0.25rem 0.2rem;">Product</a>
                                <a id="txtLocationHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="2" lvl="" selectedstr="" onclick="fnShowHierPopup(this, 0);" title="Location Filter" style="font-size: 0.8rem; padding: 0.25rem 0.2rem;">Location</a>
                                <a id="txtChannelHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="3" lvl="" selectedstr="" onclick="fnShowHierPopup(this, 0);" title="Channel Filter" style="font-size: 0.8rem; padding: 0.25rem 0.2rem; margin-right: 2%;">Channel</a>
                                <a id="btnReset" class="btn btn-primary btn-sm" href="#" onclick="fnResetFilter();" title="Reset All Filters" style="font-size: 0.8rem; padding: 0.25rem 0.2rem;">Reset</a>
                                <a id="btnShowRpt" class="btn btn-primary btn-sm" href="#" onclick="fnGetReport();" title="Show Filtered Initiative(s)" style="font-size: 0.8rem; padding: 0.25rem 0.2rem;">Show</a>
                            </div>
                        </div>
                    </div>
                </div>--%>
                <div class="fsw_inputBox" style="width: 10%; padding: 6px;">
                    <div class="fsw-title">Month</div>
                    <div class="d-block">
                        <select id="ddlMonth" runat="server" class="form-control form-control-sm" onchange="fnGetReport();"></select>
                    </div>
                </div>
                <div class="fsw_inputBox" id="divTypeSearchFilterBlock" style="width: 75%;">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Type atleast 3 characters .." />
                    </div>
                </div>
                <div class="fsw_inputBox" id="divAddNewFilterBlock" style="width: 15%;">
                    <div class="fsw-title">Site Priority</div>
                    <div class="d-block">
                        <a href="##" class="btn btn-primary btn-sm" id="btnAddNewSWP" onclick="fnAddNew();" title="Add New Site-Channel Priority Mapping"><i class="fa fa-plus-square"></i>&nbsp; Add</a>                        
                        <a href="##" class="btn btn-primary btn-sm" id="btnImportSWP" onclick="fnImportSWBPopup();" title="Import Site-Channel Priority Mapping from previous month to current month" style="margin-left: 1%;"><i class="fa fa-clone"></i>&nbsp; Import</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="tab-content" class="tab-content">
        <div role="tabpanel" class="tab-pane fade show active">
            <div id="divReport" class="row m-0">
                <div class="col-9 pl-0">
                    <div id="divReportHeader" style="overflow-x: hidden;"></div>
                    <div id="divReportBody" style="overflow-x: hidden; overflow-y: auto;"></div>
                </div>
                <div class="col-3" id="divNote">
                    <label>Note :</label>
                    <ol>
                        <li>Please complete filling up of site priorities by <asp:Label ID="lblLastDate" runat="server" Text="Label" style="color: #044d91; font-size: 0.75rem; font-weight: bold;"></asp:Label>
                        </li>
                        <li>Select the month such that the site priorities will appear in that month's Smart Basket run. For example, when details are entered in August, you need to select September for the site priorities to appear in September.</li>
                        <li>Click on add new priority</li>
                        <li>Select location, channel and SBFs as required</li>
                        <li>If multiple locations & channels have same priorities, you can do multi-select.</li>
                        <li>You can rank SBFs based on priority by rearranging.</li>
                        <li>Click on save icon, after saving you would only be able to see an edit icon.</li>
                        <li>You can edit the Site priorities by clicking the edit button anytime till the deadline mentioned as long as it has not been submitted. After submitting, edit button will not be available.  After the deadline, submission is not possible.</li>
                    </ol>
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
    <div id="divSBFPriorityPopup" style="display: none;">
        <div class="row no-gutters">
            <div class="col-8">
                <div class="pl-2">
                    <div class="d-flex align-items-center justify-content-between producthrchy" style="background-color: #ED5D35;">
                        <div class="d-block">Sub-Brand Form</div>
                    </div>
                    <div id="divSBFHierPopupTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
            <div class="col-4">
                <div class="prodLvl" style="margin-left: 1%;">
                    <div class="d-flex align-items-center justify-content-between producthrchy" style="background-color: #ED5D35;">
                        SBF Priority Order
                    </div>
                    <div id="divSBFHierSelectionTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="divFooter" style="width: 100%; background: #ddd; border: 1px solid #ccc; position: fixed; bottom: 0; padding: 6px 0; margin-left: -23px;">
        <div id="divButtons" style="width: 100%; display: inline-block; text-align: center;">
            <a id="btnSaveMultiple" class="btn btn-primary btn-sm btn-disabled mb-1 mr-2" href="#" title="Save">Save All Opened</a>
            <a id="btnDeleteMultiple" class="btn btn-danger btn-sm btn-disabled mb-1" href="#" title="Delete">Delete Selected</a>
        </div>
    </div>


    <div id="dvImportPopup" style="display: none;">
        <div class="row no-gutters">
            <div class="col-12 fsw">
                <div class="fsw_inputBox" style="width: 20%; display: inline-block;">
                    <div class="fsw-title">Month</div>
                    <div class="d-block">
                        <asp:DropDownList ID="ddlImportMonth" runat="server" CssClass="form-control form-control-sm" onchange="fnImportSWB();"></asp:DropDownList>
                    </div>
                </div>
                <div class="fsw_inputBox" style="width: 78%; display: inline-block;">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtImportTypeFilter" type="text" class="form-control form-control-sm" onkeyup="fnImportTypeFilter();" placeholder="Type atleast 3 characters .." />
                    </div>
                </div>
            </div>
        </div>
        <div id="dvImportPopupBody" style="max-height: 360px; overflow-y: auto;"></div>
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
    <div id="divMsg" style="display: none;"></div>
    <div id="divConfirm" style="display: none;"></div>

    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>

    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />

    <asp:HiddenField ID="hdnInitID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />
    <asp:HiddenField ID="hdnMonths" runat="server" />
    <asp:HiddenField ID="hdnProcessGrp" runat="server" />
    <asp:HiddenField ID="hdnDisburshmentType" runat="server" />
    <asp:HiddenField ID="hdnIncentiveType" runat="server" />
    <asp:HiddenField ID="hdnMultiplicationType" runat="server" />
    <asp:HiddenField ID="hdnInitType" runat="server" />
    <asp:HiddenField ID="hdnBucketID" runat="server" />
    <asp:HiddenField ID="hdnBucketName" runat="server" />
    <asp:HiddenField ID="hdnBucketType" runat="server" />
    <asp:HiddenField ID="hdnProductLvl" runat="server" />
    <asp:HiddenField ID="hdnLocationLvl" runat="server" />
    <asp:HiddenField ID="hdnChannelLvl" runat="server" />
    <asp:HiddenField ID="hdnSelectedHier" runat="server" />
    <asp:HiddenField ID="hdnCalledFrom" runat="server" />

    <asp:HiddenField ID="hdnmonthyearexcel" runat="server" />
    <asp:HiddenField ID="hdnmonthyearexceltext" runat="server" />
    <asp:HiddenField ID="hdnjsonarr" runat="server" />

    <asp:Button ID="btnDownload" runat="server" Text="." OnClick="btnDownload_Click" Style="visibility: hidden;" />
</asp:Content>
