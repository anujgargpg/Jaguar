window.addEventListener('load', function () {
    //if (localStorage.getItem('web_browser') == null) {
    //    // new tab               
    //    localStorage.setItem('web_browser', 'true');
    //    window.addEventListener('unload', function () {
    //        localStorage.removeItem('web_browser');
    //    });

    //    ValidateSession();
    //    setInterval("ValidateSession()", 60000);
    //} else {
    //    // duplicate tab
    //    window.location = "../../Login.aspx";
    //}
});


$(function () {
    var marginTop = ($("nav.navbar").outerHeight());

    $("img.bg-img").hide();
    var $url = $("img.bg-img").attr("src");
    $('.full-background').css('backgroundImage', 'url(' + $url + ')');

    $('.main-box').css({
        "min-height": $(window).height() - ($(".navbar").outerHeight() + 10),
        "margin-top": marginTop,
        "margin-right": "auto",
        "margin-left": "auto"
    });
    $(".container").css({
        "max-width": "100%"
    });
    $('[data-toggle="tooltip"]').tooltip();
});

function ValidateSession() {
    var url = "../ValidateSession.ashx?";
    $.ajax({
        type: "GET",
        url: url,
        success: function (msg) {
            //Marked in DB that Session is Active
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //
        }
    });
}

function fnSelect(ctrl) {
    var RoleID = $("#hdnMasterRoleID").val();
    var HierId = $(ctrl).attr("hierid");

    switch (HierId) {
        case "3":
            parent.parent.window.location.href = "../EntryForms/UpdateMstr.aspx?t=2";
            break;
        case "4":
            parent.parent.window.location.href = "../EntryForms/UpdateMstr.aspx?t=3";
            break;
        case "7":
            parent.parent.window.location.href = "../MasterForms/frmRoleAddEdit.aspx";
            break;
        case "8":
            parent.parent.window.location.href = "../MasterForms/frmUserAddEdit.aspx";
            break;
        case "10":
            parent.parent.window.location.href = "../EntryForms/BucketMstr.aspx";
            break;
        case "16":
            parent.parent.window.location.href = "../BrandMapping/frmGetBrandCategory.aspx";
            break;
        case "18":
            parent.parent.window.location.href = "../EntryForms/Initiative.aspx";
            break;
        case "19":
            parent.parent.window.location.href = "../EntryForms/InvoiceUpload.aspx";
            break;
        case "20":
            parent.parent.window.location.href = "../EntryForms/ChannelSummaryUpload.aspx";
            break;
        case "22":
            parent.parent.window.location.href = "../EntryForms/ChannelSummaryDownload.aspx";
            break;
        case "24":
            parent.parent.window.location.href = "../EntryForms/InvoiceUpload.aspx";
            break;
        case "25":
            parent.parent.window.location.href = "../EntryForms/frmExtendCreationDate.aspx";
            break;
        case "26":
            parent.parent.window.location.href = "../EntryForms/InitiativeReleased.aspx";
            break;
        case "28":
            parent.parent.window.location.href = "../UploadPRDFile/frmUploadPRDMFile.aspx";
            break;
        case "30":
            parent.parent.window.location.href = "../EntryForms/LeapWinITExtract.aspx?pg=2&ins=1";
            break;
        case "31":
            parent.parent.window.location.href = "../EntryForms/LeapWinITExtract.aspx?pg=1&ins=1";
            break;
        case "32":
            parent.parent.window.location.href = "../EntryForms/LeapWinITExtract.aspx?pg=1&ins=2";
            break;
        case "33":
            parent.parent.window.location.href = "../EntryForms/LeapWinITExtract.aspx?pg=1&ins=3";
            break;
        case "34":
            parent.parent.window.location.href = "../EntryForms/LeapWinITExtract.aspx?pg=1&ins=-1";
            break;
        case "37":
            parent.parent.window.location.href = "../EntryForms/SBD.aspx";
            break;
        case "38":
            parent.parent.window.location.href = "../EntryForms/SBDApproval.aspx";
            break;
        case "39":
            parent.parent.window.location.href = "../EntryForms/SBDApproval.aspx";
            break;
        case "40":
            parent.parent.window.location.href = "../EntryForms/Cluster.aspx";
            break;
        case "41":
            parent.parent.window.location.href = "../EntryForms/AddRemoveProxyinBaseSBF.aspx?pg=1";
            break;
        case "42":
            parent.parent.window.location.href = "../EntryForms/AddRemoveProxyinBaseSBF.aspx?pg=2";
            break;
        case "43":
            parent.parent.window.location.href = "../EntryForms/MSnPtoSBDMapping.aspx";
            break;
        case "44":
            parent.parent.window.location.href = "../EntryForms/SBDExtract.aspx";
            break;
        case "45":
            parent.parent.window.location.href = "../EntryForms/SBDAsReleased.aspx";
            break;
        case "47":
            parent.parent.window.location.href = "../EntryForms/FocusBrand.aspx";
            break;
        case "48":
            parent.parent.window.location.href = "../EntryForms/FBCluster.aspx";
            break;
        case "49":
            parent.parent.window.location.href = "../EntryForms/BrandSectorMapping.aspx";
            break;
        case "50":
            parent.parent.window.location.href = "../EntryForms/FBApproval.aspx";
            break;
        case "51":
            parent.parent.window.location.href = "../EntryForms/FBApproval.aspx";
            break;
        case "52":
            parent.parent.window.location.href = "../EntryForms/FBAsReleased.aspx";
            break;
        case "53":
            parent.parent.window.location.href = "../EntryForms/FBExtract.aspx";
            break;
        case "54":
            parent.parent.window.location.href = "../EntryForms/BaseProxyCombiBucket.aspx";
            break;
        case "55":
            parent.parent.window.location.href = "../EntryForms/ExtendCreationDateFB.aspx";
            break;
        case "56":
            parent.parent.window.location.href = "../EntryForms/ExtendCreationDateSBD.aspx";
            break;
        case "58":
            parent.parent.window.location.href = "../EntryForms/SWB.aspx";
            break;
        case "59":
            parent.parent.window.location.href = "../EntryForms/SWBExtract.aspx";
            break;
        case "60":
            parent.parent.window.location.href = "../EntryForms/FBExtractTopSKU.aspx";
            break;
        case "61":
            parent.parent.window.location.href = "../EntryForms/ExtendCreationDateSWB.aspx";
            break;
        case "62":
            parent.parent.window.location.href = "../EntryForms/SBDExtractInLeap.aspx";
            break;
        case "63":
            parent.parent.window.location.href = "../EntryForms/RemovedSBDs.aspx";
            break;
        case "64":
            parent.parent.window.location.href = "../EntryForms/RemovedINITs.aspx";
            break;
        case "65":
            parent.parent.window.location.href = "../EntryForms/RemovedFBs.aspx";
            break;
        case "66":
            parent.parent.window.location.href = "../EntryForms/FocusBrandTopup.aspx";
            break;
        case "67":
            parent.parent.window.location.href = "../EntryForms/InitiativeMR.aspx";
            break;
        case "68":
            parent.parent.window.location.href = "../EntryForms/UserCounter.aspx";
            break;
        case "69":
            parent.parent.window.location.href = "../EntryForms/StoreTypeWisseSectors.aspx";
            break;
        case "70":
            parent.parent.window.location.href = "../EntryForms/UpdateSBFCode.aspx";
            break;
        case "71":
            parent.parent.window.location.href = "../EntryForms/FBBase.aspx";
            break;
        case "72":
            parent.parent.window.location.href = "../EntryForms/FBTopup.aspx";
            break;
        case "73":
            parent.parent.window.location.href = "../EntryForms/FBAsReleasedNew.aspx";
            break;
        case "74":
            parent.parent.window.location.href = "../EntryForms/FBApprovalNew.aspx";
            break;
        case "75":
            parent.parent.window.location.href = "../EntryForms/FBApprovalNew.aspx";
            break;
        case "76":
            parent.parent.window.location.href = "../EntryForms/RemovedFBNew.aspx";
            break;
        case "77":
            parent.parent.window.location.href = "../EntryForms/SBFGrpMapping.aspx";
            break;
        case "78":
            parent.parent.window.location.href = "../EntryForms/GrpNameSBFMngt.aspx";
            break;
        case "79":
            parent.parent.window.location.href = "../EntryForms/FBExtractNew.aspx";
            break;
        case "80":
            parent.parent.window.location.href = "../EntryForms/FBExtractTopSKUNew.aspx";
            break;
        case "86":
            parent.parent.window.location.href = "../EntryForms/SBFGrpUploader.aspx";
            break;
        case "87":
            parent.parent.window.location.href = "../EntryForms/FBClusterNew.aspx";
            break;
        case "88":
            parent.parent.window.location.href = "../EntryForms/FBINITMapExtract.aspx";
            break;
        default:
            alert("Comming Soon");
            break;
    }
}
