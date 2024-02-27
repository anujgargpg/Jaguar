<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="MSnPtoSBDMapping.aspx.cs" Inherits="_MSnPtoSBDMapping" ValidateRequest="false" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../../Styles/Multiselect/jquery.multiselect.css" rel="stylesheet" type="text/css" />
    <link href="../../Styles/Multiselect/jquery.multiselect.filter.css" rel="stylesheet" type="text/css" />

    <script src="../../Scripts/MultiSelect/jquery.multiselect.js" type="text/javascript"></script>
    <script src="../../Scripts/MultiSelect/jquery.multiselect.filter.js" type="text/javascript"></script>
    <script src="../../Scripts/js_MSnPtoSBDMappingForm.js"></script>
   
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <h4 class="middle-title" id="Heading">MS&P to SBD & FB Mapping</h4>
    <div class="fsw" id="Filter">
        <div class="fsw_inner">
            <div class="fsw_inputBox w-100">
                <div class="row">
                    <div class="col-4" style="padding-right: 0;">
                        <div class="fsw-title">MS&P User </div>
                        <div class="d-block">
                            <select id="ddlUser" class="form-control form-control-sm" style="width: 320px;"></select>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="fsw-title">&nbsp;</div>
                        <div class="d-block">
                            <a href='#' onclick="fnMappedUser();" class="btn btn-primary btn-sm">Mapped User to SBD & FB</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="divMsg" runat="server"></div>
    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>

    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />
    
    <asp:HiddenField ID="hdnUser" runat="server" />
    <asp:HiddenField ID="hdnSelectedUser" runat="server" />
</asp:Content>

