<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/site.master" AutoEventWireup="true" CodeFile="frmRoleAddEdit.aspx.cs" Inherits="MasterForms_frmRoleAddEdit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <link href="../../Styles/Multiselect/jquery.multiselect.css" rel="stylesheet" type="text/css" />
    <link href="../../Styles/Multiselect/jquery.multiselect.filter.css" rel="stylesheet" type="text/css" />
    <link href="../../Styles/Multiselect/style.css" rel="stylesheet" type="text/css" />
    <link href="../../Styles/Multiselect/jquery-ui.css" rel="stylesheet" type="text/css" />

    <script src="../../Scripts/MultiSelect/jquery.js" type="text/javascript"></script>
    <script src="../../Scripts/MultiSelect/jquery-ui.min.js" type="text/javascript"></script>
    <script src="../../Scripts/MultiSelect/jquery.multiselect.js" type="text/javascript"></script>
    <script src="../../Scripts/MultiSelect/jquery.multiselect.filter.js" type="text/javascript"></script>
    <script src="../../Scripts/js_RoleAddEditForm.js"></script>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <h4 class="middle-title">Role Management</h4>
    <div class="fsw">
        <div class="fsw_inner" style="width: 88%; float: left; margin-right: 1%;">
            <div class="fsw_inputBox w-100">
                <div class="fsw-title">Search Box</div>
                <div class="d-block">
                    <input id="txtfilter" type="text" class="form-control form-control-sm" onkeyup="fntypefilter();" placeholder="Search" />
                </div>

            </div>
        </div>
        <div class="fsw_inner" style="width: 11%; text-align: center;">
            <div class="fsw_inputBox w-100">
                <div class="fsw-title">&nbsp;</div>
                <div class="d-block">
                    <a class="btn btn-primary btn-sm" href="#" onclick="fnAddNew();">Add New Role</a>
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


    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>
    <div id="divMsg" class="clsMsg"></div>
    <div id="dvUserDetail" style="display: none; font-size: 8.5pt">
    </div>
    <div id="dvAddUser" style="display: none;" title="Add New User">
        <table style="width: 99%" class="table table-bordered table-sm">
            <tr>
                <td style="text-align: left; width: 30%">User Name</td>
                <td style="width: 2%;">:</td>
                <td style="text-align: left;">
                    <div class="input-group">
                        <asp:TextBox ID="txtUserName" CssClass="form-control" runat="server" MaxLength="20" onkeypress="fnClear('lblErrorUserName')"></asp:TextBox>
                        <span id="lblErrorUserName" class="lblError"></span>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="text-align: left; width: 30%">Designation</td>
                <td style="width: 2%;">:</td>
                <td style="text-align: left;">
                    <div class="input-group">
                        <asp:TextBox ID="txtDesignation" CssClass="form-control" runat="server" MaxLength="20" onkeypress="fnClear('lblErrorDesignation')"></asp:TextBox>
                        <span id="lblErrorDesignation" class="lblError"></span>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="text-align: left; width: 30%">Employee Code</td>
                <td style="width: 2%;">:</td>
                <td style="text-align: left;">
                    <div class="input-group">
                        <asp:TextBox ID="txtEmpCode" CssClass="form-control" runat="server" MaxLength="10" onkeypress="fnClear('lblErrorEmpCode')"></asp:TextBox>
                        <span id="lblErrorEmpCode" class="lblError"></span>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="text-align: left; width: 30%">Email ID</td>
                <td style="width: 2%;">:</td>
                <td style="text-align: left;">
                    <div class="input-group">
                        <asp:TextBox ID="txtEmailID" CssClass="form-control" runat="server" MaxLength="30" onkeypress="fnClear('lblErrorEmailID')"></asp:TextBox>
                        <span id="lblErrorEmailID" class="lblError"></span>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="text-align: left; width: 30%">Phone No</td>
                <td style="width: 2%;">:</td>
                <td style="text-align: left;">
                    <div class="input-group">
                        <asp:TextBox ID="txtPhoneNo" CssClass="form-control" runat="server" MaxLength="10" onkeypress="return isNumber(event)"></asp:TextBox>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="text-align: left; width: 30%">Status</td>
                <td style="width: 2%;">:</td>
                <td style="text-align: left;">
                    <asp:CheckBox ID="chkUserStatus" Checked="true" runat="server" />
                </td>
            </tr>
        </table>
    </div>
    <div class="clear"></div>
    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />
    <asp:HiddenField ID="hdnMenuID" runat="server" />
</asp:Content>

