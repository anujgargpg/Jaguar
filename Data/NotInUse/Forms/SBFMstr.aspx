<%@ Page Title="" Language="C#"  MasterPageFile="~/Data/MasterPages/site.master" AutoEventWireup="true"
    CodeFile="SBFMstr.aspx.cs" Inherits="_BucketMstr" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="../../Scripts/js_SBFMstrForm.js"></script>

    <style type="text/css">
        h4 {
            margin: 0;
            font-size: 17px;
            padding: 0 0 10px 0;
            background-color: rgba(31, 164, 249, 0.48);
            color: White;
            font-weight: bold;
            padding-top: 5px;
            padding-left: 5px;
            text-shadow: 2px 2px 2px #333333;
            filter: progid:DXImageTransform.Microsoft.DropShadow(offX=2,offY=2,color=333333);
        }

        table {
            width: 100%;
        }

        .clstxt,
        .clsddl {
            width: 98%;
            padding: 3px;
            border-radius: 3px;
            box-sizing: border-box;
        }

        .buttonBlue {
            white-space: nowrap;
        }

        .clsfilter {
            margin-bottom: 10px;
            padding: 0 10px 4px;
            background: #efefef;
            box-sizing: border-box;
            border-bottom: 2px solid #ddd;
        }

        .clslbl {
            color: #777;
            font-size: 0.8rem;
            font-weight: 700;
            white-space: nowrap;
        }

        .clslnk {
            color: #0080C0 !important;
            font-size: 0.66rem;
            font-weight: 700;
            text-decoration: underline;
        }

        .clsMsg {
            padding: 10px;
            color: #ff0000;
            font-size: 0.9rem;
            font-weight: 700;
        }

        .button1 {
            padding: 3px 30px !important;
            border-radius: 6px !important;
            border: 1px solid #273E88;
        }

        .clsProdContainer {
            float: left;
            display: inline-block;
            box-sizing: border-box;
            border: 1px solid #696969;
        }

        .clsProdHeader {
            color: #ffffff;
            padding: 5px 10px;
            background: #696969;
            border-radius: 4px 4px 0 0;
        }

        #divReport {
            padding: 0 0 10px 0;
            overflow-y: auto;
            overflow-x: hidden;
        }
    </style>
    <style type="text/css">
        table.clstable {
            width: 100%;
            border-collapse: collapse;
        }

            table.clstable th {
                color: #495057;
                padding: .8rem 0;
                font-weight: 700;
                font-size: 0.76rem;
                text-align: center;
                background: #EEF0F2;
                border: 1px solid #DEE2E6;
            }

            table.clstable td {
                padding: .4rem 0;
                font-size: 0.72rem;
                text-align: left;
                padding-left: 5px;
                border: 1px solid #DEE2E6;
            }

            table.clstable tr td:nth-child(1) {
                text-align: center;
            }

        table.clsReport tr td.clstdAction img {
            height: 14px;
            cursor: pointer;
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
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <div id="bg" style="position: fixed; z-index: 10; top: 0; left: 0; background-color: transparent; width: 100%; height: 100%; display: none;" onclick="fnHidePopup()"></div>
    <div id="dvloader" style="position: fixed; z-index: 9999; top: 0; left: 0; opacity: .80; -moz-opacity: 0.8; filter: alpha(opacity=80); background-color: #ccc; width: 100%; height: 100%; text-align: center;">
        <img alt="Loading..." title="Loading..." src="../Imgs/loading.gif" style="margin-top: 20%;" />
    </div>
    <h4>Product Master : </h4>
    <div class="clsfilter">
        <table>
            <tr>
                <td>
                    <input id="txtfilter" type="text" class="clstxt" onkeyup="fntypefilter();" placeholder="Type atleast 3 character to filter..." style="width: 400px" />
                </td>
                <td style="width: 150px; text-align: right;">
                    <a class="buttonBlue" href="#" onclick="fnAddNewSBF();">Add New SubBrandForm</a>
                </td>
            </tr>
        </table>
    </div>
    <div id="divHeader" style="width: 60%; margin: 0 auto;"></div>
    <div id="divReport" style="width: 60%; margin: 0 auto;"></div>
    <div id="divMsg" class="clsMsg" style="color: #aaa;"></div>
    <div id="divSBFPopup" style="display: none;">
        <div>
            <table>
                <tr>
                    <td class="clslbl">SBF Code :</td>
                    <td>
                        <input type="text" class="clstxt" id="txtSBFCode" style="width: 60%;" /></td>
                    <td></td>
                </tr>
                <tr>
                    <td class="clslbl">SBF Name :</td>
                    <td>
                        <input type="text" class="clstxt" id="txtSBFName" /></td>
                    <td></td>
                </tr>
                <tr>
                    <td class="clslbl">BrandForm :</td>
                    <td>
                        <div style="position: relative;">
                            <input id="txtBrandForm" type="text" class="clstxt" sel="" autocomplete="off" onclick="fnShowPopup(this, 2)" onkeyup="fnPopupTypeSearch(this);" onchange="fnRemoveSelection(this);" placeholder="Type atleast 3 character to filter..." />
                            <div class="clsPopup">
                                <%--<div class="clsPopupTypeSearch clsPopupSec">
                                    <input type="text" onkeyup="fnPopupTypeSearch(this);" placeholder="Type atleast 3 character to filter..." style="width: 96%;" />
                                </div>--%>
                                <div class="clsPopupBody clsPopupSec" style="padding: 0;"></div>
                                <div class="clsPopupFooter clsPopupSec">
                                    <a class="button1" href="#" onclick="fnHidePopup();">Close</a>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td style="text-align: center;">
                        <a href="#" class="clslnk" onclick="fnAddNewBrandForm();">Add BrandForm</a></td>
                </tr>
            </table>
        </div>
    </div>
    <div id="divBFPopup" style="display: none;">
        <div>
            <table>
                <tr>
                    <td class="clslbl">BrandForm Code :</td>
                    <td>
                        <input type="text" class="clstxt" id="txtBFCode" style="width: 60%;" /></td>
                </tr>
                <tr>
                    <td class="clslbl">BrandForm Name :</td>
                    <td>
                        <input type="text" class="clstxt" id="txtBFName" /></td>
                </tr>
                 <tr>
                    <td class="clslbl">Brand :</td>
                    <td>
                        <div style="position: relative;">
                            <input id="txtBrand" type="text" class="clstxt" sel="" autocomplete="off" onclick="fnShowPopup(this, 1)" onkeyup="fnPopupTypeSearch(this);" onchange="fnRemoveSelection(this);" placeholder="Type atleast 3 character to filter..." style="width: 410px;"/>
                            <div class="clsPopup">
                                <%--<div class="clsPopupTypeSearch clsPopupSec">
                                    <input type="text" onkeyup="fnPopupTypeSearch(this);" placeholder="Type atleast 3 character to filter..." style="width: 96%;" />
                                </div>--%>
                                <div class="clsPopupBody clsPopupSec" style="padding: 0;"></div>
                                <div class="clsPopupFooter clsPopupSec">
                                    <a class="button1" href="#" onclick="fnHidePopup();">Close</a>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />

    <asp:HiddenField ID="hdnBrand" runat="server" />
    <asp:HiddenField ID="hdnBrandForm" runat="server" />
</asp:Content>
