<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="ChannelSummaryDownload.aspx.cs" Inherits="Data_EntryForms_ChannelSummaryDownload" ValidateRequest="false" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../../Styles/Multiselect/jquery.multiselect.css" rel="stylesheet" type="text/css" />
    <link href="../../Styles/Multiselect/jquery.multiselect.filter.css" rel="stylesheet" type="text/css" />

    <script src="../../Scripts/MultiSelect/jquery.multiselect.js" type="text/javascript"></script>
    <script src="../../Scripts/MultiSelect/jquery.multiselect.filter.js" type="text/javascript"></script>
    <script src="../../Scripts/js_ChannelSummaryDownload.js"></script>
    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <h4 class="middle-title" id="Heading">Channel Summary Download</h4>
    <div class="fsw" id="Filter">
        <div class="fsw_inner">
            <div class="fsw_inputBox w-100">
                <div class="row">
                    <div class="col-1" style="padding-right: 0;">
                        <div class="fsw-title">Month Year </div>
                        <div class="d-block">
                            <asp:DropDownList runat="server" ID="ddlMonth" class="form-control form-control-sm"></asp:DropDownList>
                        </div>
                    </div>
                    <div class="col-1" style="padding-right: 0;">
                        <div class="fsw-title">System Part </div>
                        <div class="d-block">
                            <select id="ddlSystemPart" runat="server" class="form-control form-control-sm">
                                <option value="0">-- Select --</option>
                                <option value="1">With System Part</option>
                                <option value="2">Without System Part</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-2" style="padding-right: 0;">
                        <div class="fsw-title">Initiative Type</div>
                        <div class="d-block">
                            <select id="ddlInitType" multiple="multiple"></select>
                        </div>
                    </div>
                    <div class="col-2" style="padding-right: 0;" id="MSMPFilterBlock">
                        <div class="fsw-title">MS&amp;P ALIAS</div>
                        <div class="d-block">
                            <select id="ddlMSMPAlies" multiple="multiple"></select>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="fsw-title">Include </div>
                        <div class="d-block" style="margin-top: 12px; display: table-row;">
                            <div style="display: table-cell;">
                                <input type="checkbox" id="chkReleased" style="width: 20px; height: 20px;" /></div>
                            <div style="padding-left: 10px; font-size: 0.9rem; vertical-align: top; display: table-cell;">Ready for Released</div>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="fsw-title">&nbsp; </div>
                        <div class="d-block" style="margin-top: 12px; display: table-row;">
                            <div style="display: table-cell;">
                                <input type="checkbox" id="chkMR" style="width: 20px; height: 20px;" /></div>
                            <div style="padding-left: 10px; font-size: 0.9rem; vertical-align: top; display: table-cell;">MR</div>
                        </div>
                    </div>
                    <div class="col-2" style="padding-left: 0 ; padding-right: 0;">
                        <div class="fsw-title">Hierarchy Filter</div>
                        <div class="d-block">
                            <a id="txtProductHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="1" insubd="0" prodlvl="" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Products Filter">Products</a>
                            <a id="txtLocationHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="2" insubd="0" prodlvl="" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Location Filter">Location</a>
                            <a id="txtChannelHierSearch" class="btn btn-primary btn-sm" href="#" buckettype="3" insubd="0" prodlvl="" prodhier="" onclick="fnShowProdHierPopup(this, 0);" title="Channel Filter">Channel</a>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="fsw-title">Report</div>
                        <div class="d-block">
                            <a href='#' id="Downloadexcel" onclick="fnDownload();" class="btn btn-primary btn-sm">Download</a>
                            <asp:Button ID="btnDownload" runat="server" Text="." OnClick="btnDownload_Click" Style="visibility: hidden;" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="divHierPopup" style="display: none;">
        <div class="row no-gutters">
            <div class="col-2">
                <div id="ProdLvl" class="prodLvl"></div>
            </div>
            <div class="col-5">
                <div class="pl-2">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        <div id="PopupHierlbl" class="d-block"></div>
                    </div>
                    <div id="divHierPopupTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
            <div class="col-5">
                <div class="prodLvl" style="margin-left: 1%;">
                    <div class="d-flex align-items-center justify-content-between producthrchy">
                        Your Selection
                    </div>
                    <div id="divHierSelectionTbl" style="height: 410px; overflow-y: auto; width: 100%;"></div>
                </div>
            </div>
        </div>
    </div>
    <div id="divMsg" runat="server"></div>

    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />

    <asp:HiddenField ID="hdnBucketType" runat="server" />
    <asp:HiddenField ID="hdnProductLvl" runat="server" />
    <asp:HiddenField ID="hdnLocationLvl" runat="server" />
    <asp:HiddenField ID="hdnChannelLvl" runat="server" />
    <asp:HiddenField ID="hdnSelectedHier" runat="server" />
    <asp:HiddenField ID="hdnSelectedFrmFilter" runat="server" />
    
    <asp:HiddenField ID="hdnMR" runat="server" />
    <asp:HiddenField ID="hdnINITType" runat="server" />
    <asp:HiddenField ID="hdnMSMPAlies" runat="server" />
    <asp:HiddenField ID="hdnIncludeReleased" runat="server" />
    <asp:HiddenField ID="hdnProductSelectedValue" runat="server" />
    <asp:HiddenField ID="hdnLocationSelectedValue" runat="server" />
    <asp:HiddenField ID="hdnChannelSelectedValue" runat="server" />
</asp:Content>

