<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="frmGetBrandCategory.aspx.cs"  ValidateRequest="false" Inherits="Data_BrandMapping_frmGetBrandCategory" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <script src="../../Scripts/js_GetBrandCategoryForm.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ConatntMatter" Runat="Server">
      <h4 class="middle-title mb-3">Brand Category</h4>
    <!-- Nav tabs -->
    <ul class="nav nav-tabs" role="tablist" id="my-tab">
        <li><a class="nav-link active" href="#brand" data-toggle="tab" onclick="fnGetBrand()">Brand Form</a></li>
        <li><a class="nav-link" href="#subbrand" data-toggle="tab" onclick="fnGetSubBrand()">Sub Brand Form</a></li>
    </ul>
    <div id="tab-content" class="tab-content pt-2">
        <!--- Tab1----->
        <div role="tabpanel" id="brand" class="tab-pane fade show active">
            <div id="dvBrandName" runat="server"></div>
            <div class="text-center">
                <input type="button" id="btnSaveBrand" onclick="fnSaveBrand()" value="Save" class="btn btn-primary btn-sm" />
            </div>
        </div>
        
        <!--- Tab2----->
        <div role="tabpanel" id="subbrand" class="tab-pane fade">
            <div id="dvSubBrandName" runat="server"></div>
            <div class="text-center" id="dvSaveSubBrand" style="display:none">
                <input type="button" id="btnSaveSubBrand" onclick="fnSaveSubBrand()" value="Save" class="btn btn-primary btn-sm" />
            </div>
        </div>
    </div>

    <!----- End Tab2-----> 
    <div id="dvloader" class="loader_bg">
        <div class="loader"></div>
    </div>
    <div id="dvDialog" style="display: none"></div>
</asp:Content>

