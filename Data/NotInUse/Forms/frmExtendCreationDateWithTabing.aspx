<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="frmExtendCreationDateWithTabing.aspx.cs" Inherits="Data_EntryForms_frmExtendCreationDate" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="../../Scripts/js_ExtendCreationDateWithTabingForm.js"></script>

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
        #tblReport_header th {
            text-align: center;
        }

        #tblReport tr td:nth-child(1) {
            width: 2%;
            text-align: center;
        }

        #tblReport tr td:nth-child(2) {
            width: 15%;
        }

        #tblReport tr td:nth-child(3) {
            width: 15%;
        }

        #tblReport tr td:nth-child(4) {
            width: 15%;
            text-align: center;
        }

        #tblReport tr td:nth-child(5) {
            width: 5%;
            text-align: center;
        }

        #tblReport tr td:nth-child(6) {
            width: 5%;
            text-align: center;
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
    <h4 class="middle-title">Extend Creation Date</h4>
    <div class="row no-gutters" style="margin-top: -10px;">
        <div class="fsw col-12" id="Filter">
            <div class="fsw_inner">
                <div class="fsw_inputBox" style="width: 15%;">
                    <div class="fsw-title">Month</div>
                    <div class="d-block">
                        <select id="ddlMonth" class="form-control form-control-sm" onchange="fnGetTableData();"></select>
                    </div>
                </div>
                <div class="fsw_inputBox" style="width: 73%;">
                    <div class="fsw-title">Search Box</div>
                    <div class="d-block">
                        <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Search" />
                    </div>
                </div>
                <div class="fsw_inputBox" style="width: 12%;">
                    <div class="fsw-title">For All User</div>
                    <div class="d-block">
                        <a class="btn btn-primary btn-sm" href="#" onclick="fnShowExtandDatePopup();">Extend Date</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <ul id="SubTabHead" class="nav nav-tabs mb-3" role="tablist">
        <li ProcessId="1" onclick="fnSelProcessType(this);"><a class="nav-link active" href="#">Initiative</a></li>
        <li ProcessId="2" onclick="fnSelProcessType(this);"><a class="nav-link" href="#">SBD</a></li>
        <li ProcessId="3" onclick="fnSelProcessType(this);"><a class="nav-link" href="#">Focus Brand</a></li>
    </ul>
    <div id="tab-content" class="tab-content">
        <!-- Tab panes 1-->
        <div role="tabpanel" class="tab-pane fade show active" style="width: 70%; margin: 0 auto;" id="CSTab-1">
            <div id="divHeader"></div>
            <div id="divReport"></div>
        </div>
    </div>

    <div id="divExtandDatePopup" style="display: none; padding: 15px 0 0 30px;">
        <label style="display: inline; font-size: 1.2rem; margin-right: 20px;">Extended Till : </label>
        <input id="txtExtendAll" type='text' class='form-control' style="width: 140px; display: inline;" tabindex="-1" />
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
    <asp:HiddenField ID="hdnMainRoleID" runat="server" />

    <asp:HiddenField ID="hdnMonths" runat="server" />
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
    <asp:HiddenField ID="hdnProcessType" runat="server" />
</asp:Content>

