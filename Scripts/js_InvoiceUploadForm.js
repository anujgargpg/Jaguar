var ht = 0;
var MonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


function fnfailed() {
    alert("Due to some technical reasons, we are unable to process your request !");
    $("#dvloader").hide();
}

$(document).ready(function () {
    ht = $(window).height();
    $("#divReport").height(ht - ($("#Heading").height() + $("#Filter").height() + $("#ConatntMatter_TabHead").height() + $("#AddNewBtn").height() + 170));

    $(".clsDate").datepicker({
        dateFormat: 'dd-M-y'
    });

    $("#ddlMonth").html($("#ConatntMatter_hdnMonths").val().split("^")[0]);
    $("#ddlMonth").val($("#ConatntMatter_hdnMonths").val().split("^")[1]);
    fnGetReport();

    //-------- Multiselect MS&P Allias Filter
    $("#ddlMSMP").html($("#ConatntMatter_hdnMSMPAlies").val());
    $("#ddlMSMP").multiselect({
        noneSelectedText: "--Select--"
    }).multiselectfilter();
    $("#ddlMSMP").next().css({
        "height": "calc(1.5em + .5rem + 2px)",
        "font-size": "0.8rem",
        "font-weight": "400",
        "width": "260px",
        "padding": ".25rem 0 .25rem .5rem",
        "border-radius": ".2rem",
        "border-color": "#ced4da"
    });
    $("#ddlMSMP").next().find("span.ui-icon").eq(0).css({
        "margin": ".2rem",
        "margin-bottom": "0",
        "background-color": "transparent",
        "border": "none"
    });

    $("#ConatntMatter_hdnMSMPAlies").val('');

    if ($("#ConatntMatter_hdnRoleID").val() == "3" || $("#ConatntMatter_hdnRoleID").val() == "1015") {
        $("#MSMPFilterBlock").css("display", "none");
        $("#TypeSearchBlock").css("width", "52%");
    }
});


function fnGetReport() {
    $("#txtfilter").val('');
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var ProdValues = [];
    var PrdString = $("#txtProductHierSearch").attr("prodhier");
    var LocValues = [];
    var LocString = $("#txtLocationHierSearch").attr("prodhier");
    var ChannelValues = [];
    var ChannelString = $("#txtChannelHierSearch").attr("prodhier");
    var FromDate = $("#ddlMonth").val().split("|")[0]; //$("#txtFromDate").val();
    var ToDate = $("#ddlMonth").val().split("|")[1]; //$("#txtToDate").val();
    var MSMPValues = [];

    if (PrdString != "") {
        for (var i = 0; i < PrdString.split("^").length; i++) {
            ProdValues.push({
                "col1": PrdString.split("^")[i].split("|")[0],
                "col2": PrdString.split("^")[i].split("|")[1],
                "col3": "1"
            });
        }
    }
    else {
        ProdValues.push({ "col1": "0", "col2": "0", "col3": "1" });
    }

    if (LocString != "") {
        for (var i = 0; i < LocString.split("^").length; i++) {
            LocValues.push({
                "col1": LocString.split("^")[i].split("|")[0],
                "col2": LocString.split("^")[i].split("|")[1],
                "col3": "2"
            });
        }
    }
    else {
        LocValues.push({ "col1": "0", "col2": "0", "col3": "2" });
    }

    if (ChannelString != "") {
        for (var i = 0; i < ChannelString.split("^").length; i++) {
            ChannelValues.push({
                "col1": ChannelString.split("^")[i].split("|")[0],
                "col2": ChannelString.split("^")[i].split("|")[1],
                "col3": "3"
            });
        }
    }
    else {
        ChannelValues.push({ "col1": "0", "col2": "0", "col3": "3" });
    }

    if ($("#ddlMSMP option:selected").length > 0) {
        for (var i = 0; i < $("#ddlMSMP option:selected").length; i++) {
            MSMPValues.push({ "col1": $("#ddlMSMP option:selected").eq(i).val() });
        }
    }
    else {
        MSMPValues.push({ "col1": "0" });
    }

    $("#dvloader").show();
    PageMethods.fnGetReport(LoginID, ProdValues, LocValues, ChannelValues, FromDate, ToDate, UserID, MSMPValues, fnGetReport_pass, fnfailed);
}

var tabledata = null;
var fileList = [];

function fnGetReport_pass(res) {
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    if (RoleID == 2) {
        if (res.split("|^|")[0] == "0") {
            $("#divReport").html(res.split("|^|")[1]);

            tabledata = $.parseJSON('[' + res.split('|^|')[2] + ']');

            if (res.split("|^|")[3].length > 0) {
                $("#divbtns").html(res.split("|^|")[3]);

            }

            var dbfilelist = tabledata[0].Table1;
            if (dbfilelist.length > 0) {
                for (var i = 0; i < dbfilelist.length; i++) {
                    fileList.push({ "initid": dbfilelist[i]["INITID"], "File": "", "filename": dbfilelist[i]["InvoiceFileName"], "flag": "1", "INITInvoiceMapID": dbfilelist[i]["INITInvoiceMapID"], "filechanged": "0" });
                }

                $("#tblReport tbody tr").each(function (index, tr) {
                    var filename = "";
                    var rowinitid = $(this).closest("tr").attr('initid');
                    var singlefilelist = fileList.filter(function (n, i) {
                        return n.initid == rowinitid && n.flag == "1";
                    });
                    for (var f = 0; f < singlefilelist.length; f++) {

                        // filename += '<p class="p_btn" imgname="' + singlefilelist[f].filename + '" onclick="fnShowPDF(this);">' + singlefilelist[f].filename.split(".")[0].substring(0, 10) + '.' + singlefilelist[f].filename.split(".")[1] + '&nbsp;&nbsp;<i class="fa fa-close" title="Delete Invoice.." imgname="' + singlefilelist[f].filename + '" onclick="fndeletefile(this);"></i></p>' + ' ';
                        if (singlefilelist[f].filename.indexOf('.') != -1) {
                            filename += '<p class="p_btn"><span imgname="' + singlefilelist[f].filename + '" onclick="fnShowPDF(this);">' + (singlefilelist[f].filename.indexOf('.') == -1 ? "" : singlefilelist[f].filename.split(".")[0].substring(0, 10) + '.' + singlefilelist[f].filename.split(".")[1]) + '&nbsp;&nbsp;</span><i class="fa fa-close" title="Delete Invoice.." imgname="' + singlefilelist[f].filename + '" onclick="fndeletefile(this);"></i></p>' + ' ';
                        }
                    }
                    $(this).find('td:eq(5)').html(filename);

                });

            }

            $('input[type=file]').bind("change", function () {

                var selectedFile = $(this).val().toLowerCase(),
                    regex = new RegExp("(.*?)\.(pdf)$");
                //regex = new RegExp("(.*?)\.(pdf|jpg)$");
                $(this).attr("flgUpload", "0");
                if ($(this).val() != "") {
                    if (!(regex.test(selectedFile))) {
                        $(this).val('');
                        alert("Incorrect file extension,kindly upload pdf file only!");
                    }
                    for (var fc = 0; fc < $(this).get(0).files.length; fc++) {

                        var rowinitid = $(this).closest("tr").attr("initid");
                        var imgname = $(this).get(0).files[fc].name;

                        if (fileList.length > 0) {
                            var hasfile = false;
                            var hasfileindex;
                            for (var i = 0; i < fileList.length; i++) {
                                if (fileList[i]["initid"] == rowinitid && fileList[i]["filename"] == imgname) {
                                    hasfile = true;
                                    hasfileindex = i;
                                }
                            }
                            if (hasfile) {
                                if (confirm("Are you sure to replace existing " + $(this).get(0).files[fc].name + " file!")) {
                                    fileList.splice(hasfileindex, 1);
                                    fileList.push({ "initid": $(this).closest("tr").attr('initid'), "File": $(this).get(0).files[fc], "filename": $(this).get(0).files[fc].name, "flag": "0", "INITInvoiceMapID": "", "filechanged": "1" });
                                }



                                //$("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure to replace existing <span style='color:#0000ff; font-weight: 700;'>" + $(this).get(0).files[fc].name + "</span> file!<br/>Do you want to continue ?</div>");


                                //$("#divConfirm").dialog({
                                //    "modal": true,
                                //    "width": "320",
                                //    "height": "200",
                                //    "title": "Message :",
                                //    close: function () {
                                //        $("#divConfirm").dialog('destroy');
                                //    },
                                //    buttons: [{
                                //        text: 'Yes',
                                //        class: 'btn-primary',
                                //        click: function () {
                                //            $("#divConfirm").dialog('close');

                                //            fileList.splice(hasfileindex, 1);
                                //            fileList.push({ "initid": $(this).closest("tr").attr('initid'), "File": $(this).get(0).files[fc], "filename": $(this).get(0).files[fc].name, "flag": "0", "INITInvoiceMapID": "", "filechanged": "1" });

                                //        }
                                //    },
                                //    {
                                //        text: 'No',
                                //        class: 'btn-primary',
                                //        click: function () {
                                //            $("#divConfirm").dialog('close');
                                //        }
                                //    }]
                                //});




                            }
                            else {
                                fileList.push({ "initid": $(this).closest("tr").attr('initid'), "File": $(this).get(0).files[fc], "filename": $(this).get(0).files[fc].name, "flag": "0", "INITInvoiceMapID": "", "filechanged": "0" });
                            }
                        }
                        else {
                            fileList.push({ "initid": $(this).closest("tr").attr('initid'), "File": $(this).get(0).files[fc], "filename": $(this).get(0).files[fc].name, "flag": "0", "INITInvoiceMapID": "", "filechanged": "0" });
                        }
                    }

                    var filename = "";
                    var rowinitid = $(this).closest("tr").attr('initid');
                    var singlefilelist = fileList.filter(function (n, i) {
                        return n.initid == rowinitid;
                    });

                    for (var f = 0; f < singlefilelist.length; f++) {
                        // files[f].name
                        //  filename += '<div class="img-with-text"><img src="../../Images/pdf.png" alt="' + singlefilelist[f].filename + '" width="20" height="20"><img src="../../Images/close_iconNew.png"  width="20" height="20" imgname="' + singlefilelist[f].filename + '" onclick="fndeletefile(this);"><p>' + singlefilelist[f].filename + '</p></div>' + ' ';
                        // filename += '<div class="img-with-text" style="display:inline-block; padding:5px; box-sizing:border-box; width:19.5%"><img src="../../Images/pdf.png" alt="' + singlefilelist[f].filename + '" width="20" height="20"><img src="../../Images/close_iconNew.png"  width="20" height="20" imgname="' + singlefilelist[f].filename + '" onclick="fndeletefile(this);"><p>' + singlefilelist[f].filename.split(".")[0].substring(0, 10) + '.' + singlefilelist[f].filename.split(".")[1] + '</p></div>' + ' ';
                        //filename += '<div class="img-with-text" style="display:inline-block; padding:0px; box-sizing:border-box; width:19.5%"><p>' + singlefilelist[f].filename.split(".")[0].substring(0, 10) + '.' + singlefilelist[f].filename.split(".")[1] + '<img src="../../Images/close_iconNew.png"  width="20" height="20" imgname="' + singlefilelist[f].filename + '" onclick="fndeletefile(this);"></p></div>' + ' ';
                        // filename += '<p class="p_btn">' + singlefilelist[f].filename.split(".")[0].substring(0, 10) + '.' + singlefilelist[f].filename.split(".")[1] + '&nbsp;&nbsp;<i class="fa fa-close" title="Delete Invoice.." imgname="' + singlefilelist[f].filename + '" onclick="fndeletefile(this);"></i></p>' + ' ';
                        if (singlefilelist[f].filename.indexOf('.') != -1) {
                            filename += '<p class="p_btn"><span imgname="' + singlefilelist[f].filename + '" onclick="fnShowPDF(this);">' + (singlefilelist[f].filename.indexOf('.') == -1 ? "" : singlefilelist[f].filename.split(".")[0].substring(0, 10) + '.' + singlefilelist[f].filename.split(".")[1]) + '&nbsp;&nbsp;</span><i class="fa fa-close" title="Delete Invoice.." imgname="' + singlefilelist[f].filename + '" onclick="fndeletefile(this);"></i></p>' + ' ';
                        }
                    }
                    $(this).closest("tr").find('td:eq(5)').html(filename);
                    if ($(this).val() != "") {
                        $(this).attr("flgUpload", "1");
                    }
                }
            });
            $("#dvloader").hide();
        }
        else {
            fnfailed();
        }
    }
    else {
        if (res.split("|^|")[0] == "0") {
            $("#divReport").html(res.split("|^|")[1]);

            tabledata = $.parseJSON('[' + res.split('|^|')[2] + ']');

            if (res.split("|^|")[3].length > 0) {
                //$("#btnUpload").val(tabledata[0].Table2[0]["Button"]);
                //$("#btnUpload").attr("savebuttontype", tabledata[0].Table2[0]["ButtonID"]);
                $("#divbtns").html(res.split("|^|")[3]);

            }

            var dbfilelist = tabledata[0].Table1;
            if (dbfilelist.length > 0) {
                for (var i = 0; i < dbfilelist.length; i++) {
                    fileList.push({ "initid": dbfilelist[i]["INITID"], "File": "", "filename": dbfilelist[i]["InvoiceFileName"], "flag": "1", "INITInvoiceMapID": dbfilelist[i]["INITInvoiceMapID"] });
                }

                $("#tblReport tbody tr").each(function (index, tr) {
                    var filename = "";
                    var rowinitid = $(this).closest("tr").attr('initid');
                    var singlefilelist = fileList.filter(function (n, i) {
                        return n.initid == rowinitid && n.flag == "1";
                    });
                    for (var f = 0; f < singlefilelist.length; f++) {
                        //  filename += '<p class="p_btn" imgname="' + singlefilelist[f].filename + '" onclick="fnShowPDF(this);">' + singlefilelist[f].filename.split(".")[0].substring(0, 10) + '.' + singlefilelist[f].filename.split(".")[1] + '</p>' + ' ';
                        if (singlefilelist[f].filename.indexOf('.') != -1) {
                            filename += '<p class="p_btn"><span imgname="' + singlefilelist[f].filename + '" onclick="fnShowPDF(this);">' + (singlefilelist[f].filename.indexOf('.') == -1 ? "" : singlefilelist[f].filename.split(".")[0].substring(0, 10) + '.' + singlefilelist[f].filename.split(".")[1]) + '</span></p>' + ' ';
                        }
                    }
                    $(this).find('td:eq(5)').html(filename);

                });

            }

            $("#dvloader").hide();
        }
        else {
            fnfailed();
        }
    }

}

function fnShowPDF(ctrl) {
    var rowinitid = $(ctrl).closest("tr").attr("initid");
    var imgname = $(ctrl).attr("imgname");
    document.getElementById("iFramePdf").src = "../../Uploads/InvoiceFiles/" + rowinitid + "/" + imgname;
    $("#dvPdfDialog")[0].style.display = "block";
    $("#dvPdfDialog").dialog({
        title: "Invoice Details :",
        resizable: false,
        height: $(window).height() - 150,
        width: "90%",
        modal: true,
        open: function () {
            $("body").css("overflow", "hidden");
            $("#iFramePdf").height(($(window).height() - 250) + "px");
        },
        close: function () {
            document.getElementById("iFramePdf").src = "";
        }
    });

    $("#dvPdfDialog").dialog("option", "title", "Invoice Details");
}

function fntypefilter() {
    var flgtr = 0, rowindex = 0;
    var filter = ($("#txtfilter").val()).toUpperCase().split(",");

    $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").css("display", "none");
    $("#tblReport").find("tbody").eq(0).find("tr").css("display", "none");

    var flgValid = 0;
    $("#tblReport").find("tbody").eq(0).find("tr").each(function () {
        flgValid = 1;
        for (var t = 0; t < filter.length; t++) {
            if ($(this)[0].innerText.toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                flgValid = 0;
            }
        }

        if (flgValid == 1) {
            $("#tblReport").find("tbody").eq(0).find("tr").eq(rowindex).css("display", "table-row");
            $(this).css("display", "table-row");
            flgtr = 1;
        }

        rowindex++;
    });

    if (flgtr == 0) {
        $("#divHeader").hide();
        $("#divReport").hide();
        $("#divMsg").html("No Records found for selected Filters !");
    }
    else {
        $("#divHeader").show();
        $("#divReport").show();
        $("#divMsg").html('');
    }
}


function fnResetFilter() {
    $("#txtProductHierSearch").attr("InSubD", "0");
    $("#txtProductHierSearch").attr("prodhier", "");
    $("#txtProductHierSearch").attr("prodlvl", "");
    $("#txtLocationHierSearch").attr("InSubD", "0");
    $("#txtLocationHierSearch").attr("prodhier", "");
    $("#txtLocationHierSearch").attr("prodlvl", "");
    $("#txtChannelHierSearch").attr("InSubD", "0");
    $("#txtChannelHierSearch").attr("prodhier", "");
    $("#txtChannelHierSearch").attr("prodlvl", "");

    $("#btnInitExpandedCollapseMode").show();
    $("#btnInitExpandedCollapseMode").html("Expanded Mode");
    $("#btnInitExpandedCollapseMode").attr("flgCollapse", "0");

    $("#txtfilter").val("");
    $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").css("display", "table-row");
    $("#tblleftfixed").find("tbody").eq(0).find("tr").css("display", "table-row");
    $("#divReport").show();
    $("#divMsg").html('');

    fnGetReport();
}

function fndeletefile(ctrl) {
    var rowinitid = $(ctrl).closest("tr").attr("initid");
    var imgname = $(ctrl).attr("imgname");

    //if (ArrINIT.length > 0) {
    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure you want to delete <span style='color:#0000ff; font-weight: 700;'>" + imgname + "</span> invoice...<br/>Do you want to continue ?</div>");
    // }
    $("#divConfirm").dialog({
        "modal": true,
        "width": "320",
        "height": "200",
        "title": "Message :",
        close: function () {
            $("#divConfirm").dialog('destroy');
        },
        buttons: [{
            text: 'Yes',
            class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');

                $("#dvloader").show();
                //alert(initid + '_' + imgname);
                for (var i = 0; i < fileList.length; i++) {
                    if (fileList[i]["initid"] == rowinitid && fileList[i]["filename"] == imgname) {
                        if (fileList[i]["flag"] == "1") {
                            var InvoiceMapID = fileList[i]["INITInvoiceMapID"];
                            var initid = fileList[i]["initid"];
                            PageMethods.fnDeleteFile(InvoiceMapID, initid, imgname, delete_success, delete_falied);
                        }
                        fileList.splice(i, 1);

                    }
                }

                var singlefilelist = fileList.filter(function (n, i) {
                    return n.initid == rowinitid;
                });

                var filename = "";

                for (var f = 0; f < singlefilelist.length; f++) {
                    // filename += '<p class="p_btn" imgname="' + singlefilelist[f].filename + '" onclick="fnShowPDF(this);">' + singlefilelist[f].filename.split(".")[0].substring(0, 10) + '.' + singlefilelist[f].filename.split(".")[1] + '&nbsp;&nbsp;<i class="fa fa-close" title="Delete Invoice.." imgname="' + singlefilelist[f].filename + '" onclick="fndeletefile(this);"></i></p>' + ' ';
                    if (singlefilelist[f].filename.indexOf('.') != -1) {
                        filename += '<p class="p_btn"><span imgname="' + singlefilelist[f].filename + '" onclick="fnShowPDF(this);">' + (singlefilelist[f].filename.indexOf('.') == -1 ? "" : singlefilelist[f].filename.split(".")[0].substring(0, 10) + '.' + singlefilelist[f].filename.split(".")[1]) + '&nbsp;&nbsp;</span><i class="fa fa-close" title="Delete Invoice.." imgname="' + singlefilelist[f].filename + '" onclick="fndeletefile(this);"></i></p>' + ' ';
                    }
                }

                $(ctrl).closest("tr").find('td:eq(5)').html(filename);
            }
        },
        {
            text: 'No',
            class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');
            }
        }]
    });
}

function delete_success(res) {
    if (res.split("|^|")[0] == "0") {
        $("#dvloader").hide();
        //fnGetReport();
    }
    else {
        fnfailed();
    }
}

function delete_falied() {
    alert("Due to some technical reasons, we are unable to process your request !");
    $("#dvloader").hide();
}

function fnfailed() {
    alert("Due to some technical reasons, we are unable to process your request !");
    $("#dvloader").hide();
}


/* ---------------------------------Upload------------------------ */

function progressHandler(event) {
    $("#loaded_n_total").html("Uploaded " + event.loaded + " bytes of " + event.total);
    var percent = (event.loaded / event.total) * 100;
    $("#progressBar").val(Math.round(percent));
    $("#status").html(Math.round(percent) + "% uploaded... please wait");
}

function completeHandler(event) {
    counter++
    $("#status").html(counter + " " + event.target.responseText);
}

function errorHandler(event) {
    $("#status").html("Upload Failed");
}

function abortHandler(event) {
    $("#status").html("Upload Aborted");
}
function OnError(xhr, errorType, exception) {
    $('#progressBar').css("display", "none");
}

function trackUploadProgress(e) {
    if (e.lengthComputable) {
        currentProgress = (e.loaded / e.total) * 100; // Amount uploaded in percent
        $('#progressBar').width(currentProgress + '%');
        $('#dvProgressPrcent').html(currentProgress.toFixed(2) + '%');//dvProgressPrcent
        //if (currentProgress == 100)
        // $("#divsaving")[0].innerHTML = "<div><img valign='middle' src='../Images/preloader_18.gif' alt='loading gif' />Saving Files...Please Wait</div>";
    }
}

var successAll = true; var SuccessCount = 0; var TotalFileCount = 0; var groupids = ""; var objINIT = [];
function fnUploadFilesSingle(ctrl) {
    // alert("1");
    var filesUpload = $(ctrl).closest("tr").find('input[type=file][flgUpload="1"]');

    var rowinitid = $(ctrl).closest("tr").attr('initid');
    var singlefilelist = fileList.filter(function (n, i) {
        return n.initid == rowinitid && n.flag == "0";
    });

    var IsValidFiles = true;
    successAll = false;


    $("#cphRight_divRptFinelhead").css("color", "blue");
    $("#cphRight_divRptFinelhead").html("<table id='tblstatus' style='width:100%;text-align:center;'></table>");

    SuccessCount = 0;
    TotalFileCount = singlefilelist.length;
    objINIT = [];
    var formdata = new FormData();
    for (var i = 0; i < singlefilelist.length; i++) {


        //$(ctrl).closest("tr").find("td:eq(6)").html("Pending..");
        //var files = singlefilelist[i].File;//$("#" + filesUpload[i].id).get(0).files;
        var LoginId = $("#cphRight_hdnLoginId").val();
        var filesettype = "1"//$("#" + filesUpload[i].id).siblings('input[type=hidden]').val();

        //for (var f = 0; f < singlefilelist.length ; f++) {
        formdata.append(singlefilelist[i].File.name, singlefilelist[i].File, singlefilelist[i].File.name + '#' + filesettype + '#' + singlefilelist[i].initid);
        formdata.append("LoginId", LoginId);
        //}
        if (singlefilelist[i].filechanged == "0") {
            objINIT.push({ "INITID": singlefilelist[i].initid, "ButtonID": "5", "comments": singlefilelist[i].File.name });
        }
    }
    if (filesUpload.length > 0) {
        postFile(1, formdata, filesUpload[0].id, singlefilelist.length);
    }
    else {
        postFile(1, formdata, $(ctrl).id, singlefilelist.length);
    }


}

function fnUploadFiles(ctrl) {
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    if (RoleID == "3" || RoleID == "1015") {
        objINIT = [];
        var allfilesUpload = $('#tblReport tbody input[type=checkbox]:checked');
        for (var i = 0; i < allfilesUpload.length; i++) {
            var rowinitid = $(allfilesUpload[i]).closest("tr").attr('initid');
            objINIT.push({ "INITID": rowinitid, "ButtonID": $(ctrl).attr("savebuttontype"), "comments": "" });
        }

        if (allfilesUpload.length > 0) {
            fnApprove(ctrl);
        }

    }
    else {
        // var allfilesUpload = $('input[type=checkbox]:checked').closest("tr").find("input[type=file]");
        var allfilesUpload = $('#tblReport tbody input[type=checkbox]:checked');
        // alert(allfilesUpload.length);
        if (allfilesUpload.length == 0) {
            $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Please select atleast one Initiative to send for approval..</div>");
        }

        /* $("#divConfirm").dialog({
             "modal": true,
             "width": "320",
             "height": "200",
             "title": "Message :",
             close: function () {
                 $("#divConfirm").dialog('destroy');
             },
             buttons: [{
                 text: 'Ok',
                 class: 'btn-primary',
                 click: function () {
                     $("#divConfirm").dialog('close');

                     // $("#dvloader").show();
                     // PageMethods.fnFinalSaving(objINIT, finalsuccess, finalfalied);
                 }
             }]
        });

         */

        /*
         for (var i = 0; i < allfilesUpload.length ; i++) {
             var rowinitid = $("#" + allfilesUpload[i].id).closest("tr").attr('initid');
             var multiplefilelist = fileList.filter(function (n, i) {
                 return n.initid == rowinitid;
             });
             //  TotalFileCount += multiplefilelist.length;
         }
         */
        TotalFileCount = allfilesUpload.length;
        //if (TotalFileCount.length == 0) {
        //    alert("Kindly select file first!!");
        //    return false
        //}

        var IsValidFiles = true;

        $("#cphRight_divRptFinelhead").css("color", "blue");
        $("#cphRight_divRptFinelhead").html("<table id='tblstatus' style='width:100%;text-align:center;'></table>");
        SuccessCount = 0;
        objINIT = [];


        for (var a = 0; a < allfilesUpload.length; a++) {
            var rowinitid = $(allfilesUpload[a]).closest("tr").attr('initid');
            var singlefilelist = fileList.filter(function (n, i) {
                return n.initid == rowinitid;
            });
            var formdata = new FormData();
            if (singlefilelist.length > 0) {

                var hasfile = false;
                for (var i = 0; i < singlefilelist.length; i++) {

                    //$(allfilesUpload[a]).closest("tr").find("td:eq(6)").html("Pending..");
                    var LoginId = $("#cphRight_hdnLoginId").val();
                    var filesettype = $(allfilesUpload[a]).siblings('input[type=hidden]').val();
                    if (singlefilelist[i].flag == "0") {
                        hasfile = true;
                        formdata.append(singlefilelist[i].File.name, singlefilelist[i].File, singlefilelist[i].File.name + '#' + filesettype + '#' + singlefilelist[i].initid);
                        formdata.append("LoginId", LoginId);

                        objINIT.push({ "INITID": singlefilelist[i].initid, "ButtonID": $(ctrl).attr("savebuttontype"), "comments": singlefilelist[i].File.name });


                    }
                    else {

                        objINIT.push({ "INITID": singlefilelist[i].initid, "ButtonID": $(ctrl).attr("savebuttontype"), "comments": singlefilelist[i].filename });//

                    }
                }
                if (hasfile == true) {
                    postFile(100, formdata, allfilesUpload[a].id, singlefilelist.length);
                }
                else {
                    fnSuccess(100, "0^Success", allfilesUpload[a].id, "1");
                }
            }
            else {
                //  fnSuccess()
                objINIT.push({ "INITID": rowinitid, "ButtonID": $(ctrl).attr("savebuttontype"), "comments": "" });
                fnSuccess(100, "0^Success", allfilesUpload[a].id, "1");
            }

        }
    }

}

function finalupload() {
    var ArrINIT = [];
    $("#tblReport").find("tbody").eq(0).find("tr").each(function () {
        if ($(this).find("input[type='checkbox']").length > 0) {
            if ($(this).find("input[type='checkbox']").is(":checked")) {
                var rowIndex = $(this).closest("tr").index();

                ArrINIT.push({
                    "col1": $("#tblReport").find("tbody").eq(0).find("tr[iden='Init']").eq(rowIndex).attr("Init"),
                    "col2": "",
                    "col3": ""
                });
            }
        }
    });

    if (ArrINIT.length > 0) {
        $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>You are sending <span style='color:#0000ff; font-weight: 700;'>" + ArrINIT.length + "</span> Initiative(s).<br/>Do you want to continue ?</div>");
    }
    $("#divConfirm").dialog({
        "modal": true,
        "width": "320",
        "height": "200",
        "title": "Message :",
        close: function () {
            $("#divConfirm").dialog('destroy');
        },
        buttons: [{
            text: 'Yes',
            class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');

                $("#dvloader").show();
                PageMethods.fnFinalSaving(objINIT, finalsuccess, finalfalied);
            }
        },
        {
            text: 'No',
            class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');
            }
        }]
    });

    // $("#divsaving")[0].innerHTML = "<div><img valign='middle' src='../../Images/preloader_18.gif' alt='loading gif' />Processing Data...Please Wait</div>";
    //PageMethods.fnFinalSaving(objINIT, finalsuccess, finalfalied);
}

function finalsuccess(res) {
    if (res.split("|^|")[0] == "0") {
        $("#dvloader").hide();
        //$("#divsaving")[0].innerHTML = "";
        // alert(res.split("|^|")[1])
        // alert("Invoices Send for approval successfully..")
        fnGetReport();
    }
    else {
        $("#dvloader").hide();
        fnfailed();
    }
}

function finalSingleupload() {
    PageMethods.fnFinalSaving(objINIT, finalSinglesuccess, finalfalied);
}


function fnApprove(ctrl) {
    $("#divConfirm").html("<div style='font-size: 0.9rem; font-weight: 600; text-align: center;'>Are you sure you want to " + $(ctrl).text() + " selected invoice..</div>");

    $("#divConfirm").dialog({
        "modal": true,
        "width": "320",
        "height": "200",
        "title": "Message :",
        buttons: [{
            text: 'Yes',
            //class: 'btn-primary',
            click: function () {


                $("#dvloader").show();

                PageMethods.fnFinalSaving(objINIT, approve_success, finalfalied);

            }
        },
        {
            text: 'No',
            //class: 'btn-primary',
            click: function () {
                $("#divConfirm").dialog('close');

            }
        }
        ]
    });



}

function approve_success(res) {
    if (res.split("|^|")[0] == "0") {
        $("#dvloader").hide();
        $("#divConfirm").dialog('close');
        fnGetReport();
    }
    else {
        $("#divConfirm").dialog('close');
        $("#dvloader").hide();
        fnfailed();
    }
}

function finalSinglesuccess(res) {
    if (res.split("|^|")[0] == "0") {
        $("#dvloader").hide();
        // $("#divsaving")[0].innerHTML = "";
        alert('File Saved Successfully.')
        //fnGetReport();
    }
    else {
        $("#dvloader").hide();
        fnfailed();
    }
}




function finalfalied(res) {
    //$("#divsaving")[0].innerHTML = "";
    $("#cphRight_divRptFinelhead").find("table[id='tblstatus']").append("<tr><td style='color:#ff0000;'>Error in uploading due to connection failure, please try again</td></tr>");
}


function postFile(X, data, id, filecount) {
    // Make the Ajax call
    $.ajax({
        url: "FileInitUploadHandler.ashx",
        type: 'POST',
        data: data,
        contentType: false,
        processData: false,
        xhr: function () {
            var req = $.ajaxSettings.xhr();
            if (req.upload) {
                // Setup event listener for any progress info
                // returned from the Web API
                req.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        // Update the progress bar
                        updateProgressBar(e, id);
                    }
                }, false);
            }
            return req;
        },
    }).done(function (response) {
        fnSuccess(X, response, id, filecount);
    }).fail(function (error) {
        fnError(response, id);
    });
}
function updateProgressBar(e, id) {
    // Calculate current percentage
    var percentage = (e.loaded * 100) / e.total;
    /*
    // Modify the progress bar
    $("#" + id).closest("tr").find("td:eq(6)").html(Math.round(percentage) + "% uploaded... please wait");

    // Are we done?
    if (percentage >= 100) {
        $("#" + id).closest("tr").find("td:eq(6)").html(100 + "% uploaded but wait for further process..");
    }*/
}
function fnSuccess(X, response, id, filecount) {
    var ArrResponse = response.split("^");
    if (ArrResponse[0] == "0" || ArrResponse[0] == "2") {
        SuccessCount++;

        $("#" + id).val("");
        $("#" + id).attr("flgUpload", "0");
    } else {
        $("#" + id).attr("flgUpload", "0");
        $("#" + id).val("");
        $("#" + id).closest("tr").find("td").eq(6).text(ArrResponse[1]);
    }

    if (X == 1) {
        if (objINIT.length > 0) {
            finalSingleupload();
        }
        else {
            alert('File Saved Successfully.');
        }
    }
    else {
        if (SuccessCount == TotalFileCount) {
            finalupload();
        }
    }
}
function fnError(response, id) {
    $("#" + id).attr("flgUpload", "0");
    $("#" + id).val("");
    $("#" + id).closest("td").next().html("Error-" + response);
}

/*---------------------------------end Upload----------------------*/


function fnInv(ctrl) {
    $(ctrl).siblings('input[type=file]').click();
}

function fnSelectAll(sender, flg) {
    //debugger;
    if (flg == 1) {
        if ($("#chkAll").is(":checked")) {
            //$("#chkAll").prop("checked", false);
            $("#tblReport input[type=checkbox]").prop("checked", true);
            fnsameigst(sender);
        } else {
            //$("#chkAll").prop("checked", true);
            $("#tblReport input[type=checkbox]").prop("checked", false);
            fnsameigst(sender);
        }
    }
}


function fnsameigst(sender) {
    //$("#btnUpload").hide();
    $("#divbtns").find("a.btn").addClass("btn-disabled");
    $("#divbtns").find("a.btn").removeAttr("onclick");

    if ($("#tblReport tbody input[type=checkbox]:checked").length > 0) {
        //$("#btnUpload").show();
        $("#divbtns").find("a.btn").removeClass("btn-disabled");
        $("#divbtns").find("a.btn").attr("onclick", "fnUploadFiles(this);");

    }
}

function fnProdPopuptypefilter(ctrl) {
    var filter = ($(ctrl).val()).toUpperCase().split(",");
    if ($(ctrl).val().length > 2) {
        $("#chkSelectAllProd").removeAttr("checked");
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "0");
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "none");

        var flgValid = 0;
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").each(function () {
            flgValid = 1;
            for (var t = 0; t < filter.length; t++) {
                if ($(this).find("td")[1].innerText.toUpperCase().indexOf(filter[t].toString().trim()) == -1) {
                    flgValid = 0;
                }
            }
            if (flgValid == 1) {
                $(this).attr("flgVisible", "1");
                $(this).css("display", "table-row");
            }
        });
    }
    else {
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    }
}
function fnShowProdHierPopup(ctrl, cntr) {
    $("#ConatntMatter_hdnSelectedFrmFilter").val(cntr);
    $("#divHierPopupTbl").html("<div style='font-size: 0.9rem; font-weight: 600; margin-top: 25%; text-align: center;'>Please Select the Level from Left</div>");
    $("#ConatntMatter_hdnBucketType").val($(ctrl).attr("buckettype"));

    var title = "";
    if ($("#ConatntMatter_hdnBucketType").val() == "1")
        title = "Product/s :";
    else if ($("#ConatntMatter_hdnBucketType").val() == "2")
        title = "Site/s :";
    else
        title = "Channel/s :";

    $("#divHierPopup").dialog({
        "modal": true,
        "width": "92%",
        "height": "560",
        "title": title,
        open: function () {
            if ($("#ConatntMatter_hdnBucketType").val() == "1") {
                $("#PopupHierlbl").html("Product Hierarchy");
                $("#divHierSelectionTbl").html(GetHierTblFormat("1"));
                $("#ProdLvl").html($("#ConatntMatter_hdnProductLvl").val());
            }
            else if ($("#ConatntMatter_hdnBucketType").val() == "2") {
                $("#PopupHierlbl").html("Location Hierarchy");
                $("#divHierSelectionTbl").html(GetHierTblFormat("2"));
                $("#ProdLvl").html($("#ConatntMatter_hdnLocationLvl").val());
            }
            else {
                $("#PopupHierlbl").html("Channel Hierarchy");
                $("#divHierSelectionTbl").html(GetHierTblFormat("3"));
                $("#ProdLvl").html($("#ConatntMatter_hdnChannelLvl").val());
            }

            if ($(ctrl).attr("ProdLvl") != "") {
                $("#ConatntMatter_hdnSelectedHier").val($(ctrl).attr("ProdHier"));
                fnProdLvl($("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("td[ntype='" + $(ctrl).attr("ProdLvl") + "']").eq(0));
            }
            else
                $("#ConatntMatter_hdnSelectedHier").val("");
        },
        close: function () {
            //$("#divIncludeSubd").remove();
        },
        buttons: {
            "Select": function () {
                var SelectedHierValues = fnProdSelected().split("||||");
                if (SelectedHierValues[2] != "") {
                    $(ctrl).attr("ProdLvl", SelectedHierValues[0]);
                    $(ctrl).attr("ProdHier", SelectedHierValues[1]);
                    if ($("#ConatntMatter_hdnSelectedFrmFilter").val() == "1") {
                        $(ctrl).closest("div").prev().html(SelectedHierValues[2]);
                    }
                }
                else {
                    $(ctrl).attr("ProdLvl", "");
                    $(ctrl).attr("ProdHier", "");
                    if ($("#ConatntMatter_hdnSelectedFrmFilter").val() == "1") {
                        $(ctrl).closest("div").prev().html("");
                    }
                }
                $("#divHierPopup").dialog('close');
            },
            "Reset": function () {
                fnHierPopupReset();
            },
            "Cancel": function () {
                $("#divHierPopup").dialog('close');
            }
        }
    });
}

function fnProdLvl(ctrl) {
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var RoleID = $("#ConatntMatter_hdnRoleID").val();
    var UserNodeID = $("#ConatntMatter_hdnNodeID").val();
    var UserNodeType = $("#ConatntMatter_hdnNodeType").val();
    var ProdLvl = $(ctrl).attr("ntype");

    $("#ProdLvl").find("table").eq(0).find("tbody").eq(0).find("tr").removeClass("Active");
    $(ctrl).closest("tr").addClass("Active");

    //if ($("#ConatntMatter_hdnSelectedFrmFilter").val() == "1") {
    //    if (ProdLvl != "145") {
    //        $("#divIncludeSubd").show();
    //    }
    //    else {
    //        $("#divIncludeSubd").hide();
    //    }
    //}
    //else {
    //    $("#divIncludeSubd").hide();
    //}

    $("#divHierPopupTbl").html("<img alt='Loading...' title='Loading...' src='../../Images/loading.gif' style='margin-top: 20%; margin-left: 40%; text-align: center;' />");

    var BucketValues = [];
    if ($("#ConatntMatter_hdnSelectedHier").val() != "") {
        var Selstr = $("#ConatntMatter_hdnSelectedHier").val();
        for (var i = 0; i < Selstr.split("^").length; i++) {
            BucketValues.push({
                "col1": Selstr.split("^")[i].split("|")[0],
                "col2": Selstr.split("^")[i].split("|")[1],
                "col3": $("#ConatntMatter_hdnBucketType").val()
            });
        }
    }

    if ($("#ConatntMatter_hdnBucketType").val() == "1") {
        PageMethods.fnProdHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, BucketValues, fnProdHier_pass, fnProdHier_failed);
    }
    else if ($("#ConatntMatter_hdnBucketType").val() == "2") {
        var InSubD = 0;
        //if ($("#chkIncludeSubd").is(":checked")) {
        //    InSubD = 1;
        //}

        PageMethods.fnLocationHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, BucketValues, InSubD, fnProdHier_pass, fnProdHier_failed);
    }
    else {
        PageMethods.fnChannelHier(LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, BucketValues, fnProdHier_pass, fnProdHier_failed);
    }
}


function fnHierPopupReset() {
    $("#divHierSelectionTbl").find("tbody").eq(0).html("");

    $("#divHierPopupTbl").find("table").eq(0).find("thead").eq(0).find("input[type='text']").val("");
    $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").attr("flgVisible", "1");
    $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr").css("display", "table-row");
    $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
        $(this).attr("flg", "0");
        $(this).removeClass("Active");
        $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");
    });
    $("#chkSelectAllProd").removeAttr("checked");

    //if ($("#ConatntMatter_hdnBucketType").val() == "2")
    //    $("#chkIncludeSubd").prop("checked", true);
}
function fnSelectHier(ctrl) {
    $(ctrl).attr("flg", "1");
    $(ctrl).addClass("Active");
    $(ctrl).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");

    fnAppendSelection(ctrl, 1);
}
function fnSelectAllProd(ctrl) {
    if ($(ctrl).is(":checked")) {
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
            $(this).attr("flg", "1");
            $(this).addClass("Active");
            $(this).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");

            fnAppendSelection(this, 1);
        });
    }
    else {
        $("#divHierPopupTbl").find("table").eq(0).find("tbody").eq(0).find("tr[flgVisible='1']").each(function () {
            $(this).attr("flg", "0");
            $(this).removeClass("Active");
            $(this).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

            fnAppendSelection(this, 0);
        });
    }
}
function fnSelectUnSelectProd(ctrl) {
    if ($(ctrl).attr("flg") == "1") {
        $(ctrl).attr("flg", "0");
        $(ctrl).removeClass("Active");
        $(ctrl).find("img").eq(0).attr("src", "../../Images/checkbox-unchecked.png");

        fnAppendSelection(ctrl, 0);
        $("#chkSelectAllProd").removeAttr("checked");
    }
    else {
        $(ctrl).attr("flg", "1");
        $(ctrl).addClass("Active");
        $(ctrl).find("img").eq(0).attr("src", "../../Images/checkbox-checked.png");

        fnAppendSelection(ctrl, 1);
    }
}


