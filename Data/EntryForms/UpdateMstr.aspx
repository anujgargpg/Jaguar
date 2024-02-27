<%@ Page Title="" Language="C#" MasterPageFile="~/Data/MasterPages/Site.master" AutoEventWireup="true" CodeFile="UpdateMstr.aspx.cs" Inherits="_UpdateMstr" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script type="text/javascript">
        var temp_nid = 0; temp_ntype = 0;

        function AutoHideAlertMsg(msg) {
            var str = "<div id='divAutoHideAlertMsg' style='width: 100%; background-color: transparent; top: 0; position: fixed; z-index: 999; text-align: center; opacity: 0;'>";
            str += "<span style='font-size: 0.9rem; font-weight: 700; color: #fff; padding: 6px 16px; border-radius: 4px; background-color: #202020; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.6), 0 6px 20px 0 rgba(0, 0, 0, 0.2)'>";
            str += msg;
            str += "</span>";
            str += "</div>";
            $("body").append(str);

            $("#divAutoHideAlertMsg").animate({
                top: '100px',
                opacity: '1'
            }, "slow");

            //---------------------------------------------
            setTimeout(function () {
                $("#divAutoHideAlertMsg").animate({
                    top: '0px',
                    opacity: '0'
                }, "slow");
            }, 3000);
            setTimeout(function () {
                $("#divAutoHideAlertMsg").remove();
            }, 3500);

        }
        function fnfailed() {
            $("#dvloader").hide();
            AutoHideAlertMsg("Due to some technical reasons, we are unable to process your request !");
        }

        $(document).ready(function () {
            $("#divHier").height($(window).height() - ($(".navbar").height() + 70));

            GetHierNodes(0, 0, null);
        });

        function fnExpandCollapse(ctrl) {
            if ($(ctrl).closest("li").attr("flgExpandCollapse") == "1") {
                $(ctrl).closest("li").find("ul").eq(0).hide();

                $(ctrl).attr("title", "click to expand");
                $(ctrl).attr("src", "../../Images/icoAdd.gif");
                $(ctrl).closest("li").attr("flgExpandCollapse", "0");
            }
            else {
                if ($(ctrl).closest("li").attr("flgDBCallforChildStr") == "1") {
                    $(ctrl).closest("li").find("ul").eq(0).show();

                    $(ctrl).attr("title", "click to collapse");
                    $(ctrl).attr("src", "../../Images/icoMinus.gif");
                    $(ctrl).closest("li").attr("flgExpandCollapse", "1");
                }
                else {
                    var nid = $(ctrl).closest("li").attr("nid");
                    var ntype = $(ctrl).closest("li").attr("ntype");

                    GetHierNodes(nid, ntype, ctrl);
                }
            }
        }
        function GetHierNodes(nid, ntype, ctrl) {
            var HierTypeID = $("#ConatntMatter_hdnHierTypeID").val();

            $("#dvloader").show();
            PageMethods.GetHierNodes(nid, ntype, HierTypeID, GetHierNodes_pass, fnfailed, ctrl);
        }
        function GetHierNodes_pass(res, ctrl) {
            $("#dvloader").hide();
            if (res.split("|^|")[0] == "0") {
                if (ctrl == null) {
                    $("#divHier").html(res.split("|^|")[1]);
                }
                else {
                    $(ctrl).closest("li").find("ul").remove();

                    $(ctrl).closest("li").append(res.split("|^|")[1]);
                    $(ctrl).attr("title", "click to collapse");
                    $(ctrl).attr("src", "../../Images/icoMinus.gif");
                    $(ctrl).closest("li").attr("flgExpandCollapse", "1");
                    $(ctrl).closest("li").attr("flgDBCallforChildStr", "1");

                    if (temp_nid.toString() != "0")
                        fnClickOnNode($(ctrl).closest("li").find("ul").eq(0).find("li[nid='" + temp_nid + "'][ntype='" + temp_ntype + "']").eq(0).find("a")[0]);
                }
            }
            else {
                fnfailed();
            }
        }


        function Reset() {
            $("#lblCode").html("Code : ");
            $("#txtCode").val("");
            $("#lblName").html("Name : ");
            $("#txtName").val("");
            $("#chkMR").removeAttr("checked");
            $("#txtSwingCode").val("");

            $("#divSwingCode").hide();
            $("#divMR").hide();
        }
        function fnClickOnNode(ctrl) {
            $("#divHier").find("li.active").removeClass("active");
            $(ctrl).closest("li").addClass("active");

            $("#ConatntMatter_hdnHierNodeID").val($(ctrl).closest("li").attr("nid"));
            $("#ConatntMatter_hdnHierNodeType").val($(ctrl).closest("li").attr("ntype"));

            fnGetNodeDetail(1);
        }


        function fnGetNodeDetail(flgCalling) {
            var nid = $("#ConatntMatter_hdnHierNodeID").val();
            var ntype = $("#ConatntMatter_hdnHierNodeType").val();

            $("#dvloader").show();
            PageMethods.GetNodeDetails(nid, ntype, GetNodeDetails_pass, fnfailed, flgCalling);
        }
        function GetNodeDetails_pass(res, flgCalling) {
            $("#dvloader").hide();
            if (res.split("|^|")[0] == "0") {
                $("#divContentBody").show();

                Reset();
                var json = $.parseJSON(res.split("|^|")[1]);

                if (flgCalling.toString() == "1") {
                    $("#divHeadBtns").html("");
                    $("#ConatntMatter_hdnHierChildLvlDescr").val(json.Table[0].ChildLvlName);
                    $("#ConatntMatter_hdnHierNodeDescr").val($("#divHier").find("li.active").eq(0).find("a").eq(0).html());

                    var strbtns = "";
                    strbtns += "<li class='nav-item'><a href='#' flg='2' class='nav-link active' onclick='fnEdit(this);'>Edit Details</a></li>";
                    if (json.Table[0].isLastLvl == "0")
                        strbtns += "<li class='nav-item'><a href='#' flg='1' class='nav-link' onclick='fnAdd(this);'>Add New " + $("#ConatntMatter_hdnHierChildLvlDescr").val() + " under " + $("#ConatntMatter_hdnHierNodeDescr").val() + "</a></li>";
                    $("#divHeadBtns").html(strbtns);
                }


                $("#lblCode").html(json.Table[0].LvlName + " Code : ");
                $("#txtCode").val(json.Table[0].Code);
                $("#lblName").html(json.Table[0].LvlName + " Name : ");
                $("#txtName").val(json.Table[0].Descr);

                if ($("#ConatntMatter_hdnHierNodeType").val() == "210") {
                    $("#divSwingCode").show();
                    $("#txtSwingCode").val(json.Table[0].SwingCode);
                }
                else if ($("#ConatntMatter_hdnHierNodeType").val() == "220") {
                    $("#divMR").show();
                    if (json.Table[0].flgMR == "1")
                        $("#chkMR").prop("checked", true);
                }
            }
            else {
                fnfailed();
            }
        }

        function fnAdd(ctrl) {
            $("#divHeadBtns").find("a.active").removeClass("active");
            $(ctrl).addClass("active");
            Reset();

            $("#lblCode").html($("#ConatntMatter_hdnHierChildLvlDescr").val() + " Code : ");
            $("#lblName").html($("#ConatntMatter_hdnHierChildLvlDescr").val() + " Name : ");

            if ($("#ConatntMatter_hdnHierNodeType").val() == "200") {
                $("#divSwingCode").show();
            }
            else if ($("#ConatntMatter_hdnHierNodeType").val() == "210") {
                $("#divMR").show();
            }
        }
        function fnEdit(ctrl) {
            $("#divHeadBtns").find("a.active").removeClass("active");
            $(ctrl).addClass("active");
            fnGetNodeDetail(2);
        }

        function fnSaveNodeDetail() {
            var HierTypeID = $("#ConatntMatter_hdnHierTypeID").val();
            var nid = $("#ConatntMatter_hdnHierNodeID").val();
            var ntype = $("#ConatntMatter_hdnHierNodeType").val();
            var Code = $("#txtCode").val();
            var Descr = $("#txtName").val();
            var flgAddEdit = $("#divHeadBtns").find("a.active").eq(0).attr("flg");
            var LoginID = $("#ConatntMatter_hdnLoginID").val();
            var SwingCode = "";
            var flgMR = "0";

            if (flgAddEdit == "1") {        // 1: Add New,  2 : Edit
                if ($("#ConatntMatter_hdnHierNodeType").val() == "200") {
                    SwingCode = $("#txtSwingCode").val();
                }
                else if ($("#ConatntMatter_hdnHierNodeType").val() == "210") {
                    if ($("#chkMR").is(":checked"))
                        flgMR = "1";
                }
            }
            else {
                if ($("#ConatntMatter_hdnHierNodeType").val() == "210") {
                    SwingCode = $("#txtSwingCode").val();
                }
                else if ($("#ConatntMatter_hdnHierNodeType").val() == "220") {
                    if ($("#chkMR").is(":checked"))
                        flgMR = "1";
                }
            }


            $("#dvloader").show();
            PageMethods.SaveNodeDetails(HierTypeID, nid, ntype, Code, Descr, flgAddEdit, LoginID, SwingCode, flgMR, SaveNodeDetails_pass, fnfailed);
        }
        function SaveNodeDetails_pass(res) {
            $("#dvloader").hide();
            if (res.split("|^|")[0] == "0") {
                if ($("#divHeadBtns").find("a.active").eq(0).attr("flg") == "1") {
                    AutoHideAlertMsg("New " + $("#ConatntMatter_hdnHierChildLvlDescr").val() + " under " + $("#ConatntMatter_hdnHierNodeDescr").val() + " added successfully ! ");

                    temp_nid = res.split("|^|")[1];
                    temp_ntype = res.split("|^|")[2];

                    var nid = $("#ConatntMatter_hdnHierNodeID").val();
                    var ntype = $("#ConatntMatter_hdnHierNodeType").val();
                    var ctrl = $("#divHier").find("li.active").eq(0).find("img")[0];

                }
                else {
                    AutoHideAlertMsg($("#ConatntMatter_hdnHierNodeDescr").val() + " details updated successfully ! ");

                    temp_nid = $("#ConatntMatter_hdnHierNodeID").val();
                    temp_ntype = $("#ConatntMatter_hdnHierNodeType").val();

                    var nid = $("#divHier").find("li.active").eq(0).parent().parent().attr("nid");
                    var ntype = $("#divHier").find("li.active").eq(0).parent().parent().attr("ntype");
                    var ctrl = $("#divHier").find("li.active").eq(0).parent().parent().find("img")[0];
                }

                GetHierNodes(nid, ntype, ctrl);
            }
            else if (res.split("|^|")[0] == "2") {      // Duplicate Records
                AutoHideAlertMsg("Duplicate record found ! ");
            }
            else {
                fnfailed();
            }
        }
    </script>

    <style type="text/css">
        .txt-lbl {
            color: #044d91;
            font-size: 1rem;
            font-weight: 600;
        }

        .c-pointer {
            cursor: pointer !important;
        }

        #divHier {
            padding: 20px;
            padding-right: 5px;
            overflow-y: auto;
            border-right: 2px solid #b9c8e3;
        }

            #divHier ul {
                color: #999;
                list-style: none;
                padding-inline-start: 20px;
            }

            #divHier img {
                height: 10px;
                margin-top: -5px;
                padding-right: 5px;
            }

            #divHier li > a {
                color: #333;
                text-decoration: none !important;
            }

            #divHier li.active > a {
                color: #007bff;
                font-weight: bold;
            }

        ul.nav-tabs {
            padding-left: 10px;
            border-bottom: 1px solid #777;
        }

        .nav-tabs > li > a.nav-link {
            color: #fff;
            background-color: #F07C00;
        }

            .nav-tabs > li > a.nav-link.active {
                font-weight: 600;
                background-color: #eef4ff;
                border-color: #777 #777 #eef4ff;
            }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ConatntMatter" runat="Server">
    <div class="fsw mb-0 pb-0">
        <div class="fsw_inner">
            <div class="row w-100">
                <div class="col-3" id="divHier"></div>
                <div class="col-9 p-3" id="divContentBody" style="display: none;">
                    <ul class="nav nav-tabs" id="divHeadBtns">
                    </ul>
                    <div class="p-4" style="min-height: 400px;">
                        <div class="row pt-3" id="divMR" style="display: none;">
                            <div class="col-2 txt-lbl" id="lblMR">Is MR :</div>
                            <div class="col-8 txt-lbl">
                                <input type="checkbox" id="chkMR" class="form-control form-control-sm" style="width: 20px;" />
                            </div>
                        </div>
                        <div class="row pt-3">
                            <div class="col-2 txt-lbl" id="lblCode">Code :</div>
                            <div class="col-3 txt-lbl">
                                <input type="text" id="txtCode" class="form-control form-control-sm" />
                            </div>
                        </div>
                        <div class="row pt-3">
                            <div class="col-2 txt-lbl" id="lblName">Name :</div>
                            <div class="col-8 txt-lbl">
                                <input type="text" id="txtName" class="form-control form-control-sm" />
                            </div>
                        </div>
                        <div class="row pt-3" id="divSwingCode" style="display: none;">
                            <div class="col-2 txt-lbl" id="lblSwingCode">Swing Code :</div>
                            <div class="col-8 txt-lbl">
                                <input type="text" id="txtSwingCode" class="form-control form-control-sm" />
                            </div>
                        </div>
                    </div>
                    <div class="w-100" style="text-align: center;">
                        <a href="#" class="btn btn-info" onclick="fnSaveNodeDetail();">Submit</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="loader_bg" id="dvloader">
        <div class="loader"></div>
    </div>

    <div class="clear"></div>
    <asp:HiddenField ID="hdnLoginID" runat="server" />
    <asp:HiddenField ID="hdnUserID" runat="server" />
    <asp:HiddenField ID="hdnRoleID" runat="server" />
    <asp:HiddenField ID="hdnNodeID" runat="server" />
    <asp:HiddenField ID="hdnNodeType" runat="server" />
    
    <asp:HiddenField ID="hdnHierTypeID" runat="server" />
    <asp:HiddenField ID="hdnHierNodeID" runat="server" />
    <asp:HiddenField ID="hdnHierNodeType" runat="server" />
    <asp:HiddenField ID="hdnHierNodeDescr" runat="server" />
    <asp:HiddenField ID="hdnHierChildLvlDescr" runat="server" />

</asp:Content>
