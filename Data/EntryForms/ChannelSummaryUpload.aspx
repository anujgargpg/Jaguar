<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="ChannelSummaryUpload.aspx.cs" Inherits="Data_EntryForms_ChannelSummaryUpload" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
      
   
   
    
     <style>
       


    .btn {
    display: inline-block;
    padding: 2px 4px !important;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}

    #progressBar
{
	width:0px;
	height:5px;
	/*background-color:#F44336;
	position:fixed;
	top:0px;
	left:0px;*/
	display:none;
    background-image: url(../../Images/Progressbar_Content.gif);
    height: 100%;
}

#progressBar.active
{
	display:block;
	/*transition: 3s linear width;
	-webkit-transition: 3s linear width;
	-moz-transition: 3s linear width;
	-o-transition: 3s linear width;
	-ms-transition: 3s linear width;*/
}

#dvProgressContainer {
    border-left: solid 1px #CFCFCF;
    border-right: solid 1px #CFCFCF;
     width: 100% !important; 
    height: 12px;
    background-image: url(../../Images/Progressbar_Wrapper.gif);
}





input {
    overflow: hidden !important;
}


</style>

    <style type="text/css">
     
        #dialog { height: 600px; overflow: auto; font-size: 10pt! important; font-weight: normal !important; background-color: #FFFFC1; margin: 10px; border: 1px solid #ff6a00; }
        #dialog div { margin-bottom: 15px; }/**/
    </style>
    <script src="../../Scripts/js_ChannelSummaryUploadForm.js"></script>

   
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ConatntMatter" Runat="Server">
    <div style="margin-left: 0px;padding-bottom:0px;z-index:1;width:100%;background-color:#ffffff" id="divHeadercont">
         <h4 class="middle-title" id="Heading">Channel Summary Upload</h4>

          <div class="fsw" id="Filter">
        <div class="fsw_inner">
            <div class="fsw_inputBox w-100">
                 <div class="row">
                     <div class="form-row">
                            <label class="col-form-label col-form-label-sm">Month Year </label>
                            <div class="col-5">                               
                                 <asp:DropDownList runat="server" ID="ddlMonth" style="width:230px"  class="form-control form-control-sm"></asp:DropDownList>      
                            </div>                           
                        </div>
                       </div>
            </div>
            </div>
    </div>

    </div>
    <div style="padding-top:2px;margin: 0px auto" id="divtblContain">
      <div id="divdrmmain" style="margin-top:0px;border:1px solid #ccc;width:80%;margin:0px">
    
    <table width="100%" cellpadding="5" cellspacing="5" border="0" style="margin: 0px auto">
        <tr>  
        <td style="width:15%;">Summary File </td> 
                
        <td style="text-align:right;width:80px;">  
            <asp:FileUpload ID="fupload1" runat="server" onchange="fnFileSelect(this);"  style="width:78px;" /><input type="hidden" value="7" /> </td>
             <td style="width:200px;"><input type="button" value="Clear" class="btn-default btn-xs" onclick="fnFileClear(this);" /><a href="../../SampleFile/UpdatedChannelSummaryTemplate.xlsx" target="_blank" title="Download Sample File">Download Sample File</a></td>              
            <td></td> 
        <td></td> 
            <td style=""></td> 
        </tr>
        <tr><td><asp:Button ID="btnUpload" runat="server" cssClass="btn btn-primary btn-xs" Text="Upload File"  /></td>
          <td colspan="5">

              <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" style="width:95%">
                                                                <div id="dvProgressContainer">
                                                                    <div id="progressBar">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style="width:5%">
                                                                <div id="dvProgressPrcent">
                                                                    0%
                                                                </div>
                                                            </td>
                                                        </tr>
                 
                 </table>
          </td>  
        </tr>      
    </table>
         <div id="divRptFinel" style="padding: 0 5px; ">
             <div style="width:100%" id="divsaving"></div>
        <div id="divRptFinelhead" style="text-align: left; padding-bottom: 10px; font-size: 13px; color:#0000ff; width:100%;margin:0 auto;" runat="server"></div>
  </div> 
        
         </div>
         </div>

      <div style="padding-top:20px;margin: 0px auto" id="divtbllist">         
          <div id="divmain"   style="margin-top:0px;border:0px solid #ccc;width:95%;margin: 0px auto">

          </div>
      </div>
    <div id="dialog" style="display: none"></div>
     <asp:HiddenField runat="server" ID="hdnLoginId" Value="0" />
     <asp:HiddenField runat="server" ID="hdnBranchcode" Value="0" />
   
</asp:Content>

