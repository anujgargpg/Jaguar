
$(document).ready(function () {

    //$('#fraLeft').load(function () {
    //    $("#fraLeft").contents().find("#DvMenu").find("li").removeClass("activemenu");
    //    $("#fraLeft").contents().find("#DvMenu").find("li[nid='24']").addClass("activemenu");
    //    $("#fraLeft")[0].height = $(window).height() - ($("#dvBanner").height() + $(".footer").height());
    //});
    $("#dvloader").hide();
    //e.preventDefault();

    //alert('hello');
    //alert(parseInt(branch.indexOf(']')));
    //alert(parseInt(branch.indexOf('[')));
    //alert(branch.substr(parseInt(branch.indexOf('[')), parseInt(branch.indexOf(']')) - (parseInt(branch.indexOf('[')) + 1)));



    $("#ConatntMatter_btnUpload").click(function (evt) {
        var monthyear = "";

        if ($("#ConatntMatter_ddlMonth").val() == "0^0") {
            alert("Kindly select month year first before click on upload button!!");
            $("#ConatntMatter_ddlMonth").focus();
            return false;
        }

        monthyear = $("#ConatntMatter_ddlMonth").val();

        if ($("#ConatntMatter_fupload1").get(0).files.length < 1) {
            alert("Please Select the File !");
            return false;
        }


        var fileList = [];

        fileList.push($("#ConatntMatter_fupload1").get(0));


        if ($("#ConatntMatter_fupload1").get(0).files.length < 1) //Retailer
        {
            $("#ConatntMatter_fupload1").closest('tr').find('td:eq(4)').css("color", "#0000c6").text("Retailer master is compulsory to upload if you have new stores in your DRCP otherwise DRCP against the retailers who are not available in our db will be rejected.");
        }




        var IsValidFiles = true;
        var filenames = ["Order"];

        //for (var i = 0; i < fileList.length; i++) {
        //    if ($("#" + fileList[i].id).get(0).files.length > 0) {
        //        if (validatefile($("#" + fileList[i].id), filenames[i]) == false) {
        //            IsValidFiles = false;
        //        }
        //    }
        //}

        if (IsValidFiles == false)
            return false;



        $("#ConatntMatter_btnUpload").attr("disabled", true);
        $("#ConatntMatter_btnUpload").val('Upload File in Progress...');


        $("#ConatntMatter_divRptFinelhead").css("color", "blue");
        $("#ConatntMatter_divRptFinelhead").html("<table id='tblstatus'></table>");//<tr><td>File is being uploading ...</td></tr>



        var data = new FormData();
        for (var i = 0; i < fileList.length; i++) {

            var fileUpload_WS = $("#" + fileList[i].id).get(0);
            if (fileUpload_WS.files.length > 0) {
                var file1 = fileUpload_WS.files;
                var filesettype = $(fileUpload_WS).siblings('input[type=hidden]').val();
                data.append(file1[0].name, file1[0], file1[0].name + '#' + filesettype);
            }
        }

        data.append("monthyear", monthyear);

        uploaddata(data);

        evt.preventDefault();
    });
    // end of button btnUpload click

    //setInterval(function () { getdata(); }, 60000);
    //getdata();

});



// End of Ready function


function validatefile(fupload, sfile) {


    var filesettype = $(fupload).siblings('input[type=hidden]').val();

    var selectedFile = $(fupload).get(0).value.split('\\');
    var sFilename = selectedFile[selectedFile.length - 1];
    //var sysFilename = $("#ConatntMatter_hdnFileName").val();
    var dtformat = sFilename.split("_")[1];


    var fExtention = sFilename.toLowerCase().split(".")[sFilename.toLowerCase().split(".").length - 1];

    if (sFilename.split("_").length != 2) {
        //onComplete(MessageStatus.Warning, 'Invalid File Format,kindly upload correct file format as shown in sample file!!', '', '0 of 0 Bytes', '', '', '');
        $(fupload).closest('tr').find('td:eq(4)').css("color", "#ff0000").text("Invalid File Name Format, kindly upload correct file format!!");
        return false;
    }
    if (fExtention != "csv") {
        $(fupload).closest('tr').find('td:eq(4)').css("color", "#ff0000").text("Incorrect file extension, kindly upload csv file only!!");
        return false;
    }
    if (sFilename.split('_')[0].toLowerCase() != sfile.toLowerCase()) {
        //onComplete(MessageStatus.Warning, 'Incorrect File Name,kindly upload correct file as shown in sample file!!', '', '0 of 0 Bytes', '', '', '');
        $(fupload).closest('tr').find('td:eq(4)').css("color", "#ff0000").text("Incorrect File Name, kindly upload correct file!!");
        return false;
    }
    if (validatedate(dtformat) == false) {
        //onComplete(MessageStatus.Warning, 'Date Format Not Matched,kindly upload correct date format as shown in sample file!!', '', '0 of 0 Bytes', '', '', '');
        $(fupload).closest('tr').find('td:eq(4)').css("color", "#ff0000").text("Date Format not corrent in file name, kindly upload correct date format!!");
        return false;
    }

    return true;
}



function validatedate(date) {
    date = date.match(/([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))/);
    if (date === null) {
        return false; // if match failed
    }

    return true;
}

function uploaddata(data) {
    var pbar = $('#progressBar'), currentProgress = 0;
    $(pbar).width(0).addClass('active');

    $.ajax({
        url: "FileUploadHandler.ashx",
        type: "POST",
        data: data,

        xhr: function () {
            // Custom XMLHttpRequest
            var appXhr = $.ajaxSettings.xhr();

            // Check if upload property exists, if "yes" then upload progress can be tracked otherwise "not"
            if (appXhr.upload) {
                // Attach a function to handle the progress of the upload
                appXhr.upload.addEventListener('progress', trackUploadProgress, false);

            }

            return appXhr;
        },

        contentType: false,
        processData: false,
        success: function (result) {

            if (result.split("^")[0] == "0") {
                fnSuccess(result);
            }
            else {
                //alert(result.split("^")[1])
                $("#ConatntMatter_divRptFinelhead").find("table[id='tblstatus']").append("<tr><td style='color:#ff0000;'>" + result.split("^")[1] + "</td></tr>");
                $("#ConatntMatter_btnUpload").removeAttr('disabled');
                $("#ConatntMatter_btnUpload").val('Upload File');
                $("#divsaving")[0].innerHTML = "";
            }
        },
        error: OnError
        //error: function (err) {
        //    $("#ConatntMatter_divRptFinelhead").find("table[id='tblstatus']").append("<tr><td style='color:#ff0000;'>" + result + "</td></tr>");
        //}

    });
}





function fnSuccess(res) {

    $("#divsaving")[0].innerHTML = "";
    $("#ConatntMatter_divRptFinelhead").css("color", "blue");
    $("#ConatntMatter_divRptFinelhead").find("table[id='tblstatus']").append("<tr><td><div>" + res.split("^")[1] + "</div></td></tr>");

    $("#ConatntMatter_btndownloadorderdata").click();

    $("#ConatntMatter_fupload1").val('');


    $("#ConatntMatter_fupload1").closest('tr').find('td:eq(3)').text('');

    $("#ConatntMatter_btnUpload").removeAttr('disabled');
    $("#ConatntMatter_btnUpload").val('Upload File');

    //getdata();

}


function OnError(xhr, errorType, exception) {

    /*
    var responseText;
    $("#dialog").html("");
    try {
        responseText = jQuery.parseJSON(xhr.responseText);
        //responseText = $.parseJSON('[' + xhr.responseText + ']');

        $("#dialog").append("<div><b>" + errorType + " " + exception + "</b></div>");
        $("#dialog").append("<div><u>Exception</u>:<br /><br />" + responseText.ExceptionType + "</div>");
        //$("#dialog").append("<div><u>StackTrace</u>:<br /><br />" + responseText.StackTrace + "</div>");
        $("#dialog").append("<div><u>Message</u>:<br /><br />" + responseText.Message + "</div>");
    } catch (e) {
        responseText = xhr.responseText;
        $("#dialog").html(responseText);
    }
    $("#dialog").dialog({
        title: "Error in file uploading ",
        width: 700,
        buttons: {
            Close: function () {
                $(this).dialog('close');
            }
        }
    });

    */
    $("#ConatntMatter_divRptFinelhead").find("table[id='tblstatus']").append("<tr><td style='color:#ff0000;'>Error in uploading due to connection failure, please try again</td></tr>");
    $('#progressBar').css("display", "none");
    $('#dvProgressPrcent').html('0%');
    $("#ConatntMatter_btnUpload").removeAttr('disabled');
    $("#ConatntMatter_btnUpload").val('Upload File');
}


function fnFileSelect(ctrl) {
    var obj = $(ctrl).val().split("\\");
    var filename = obj[obj.length - 1];
    $(ctrl).closest("tr").find('td:eq(3)').html(filename);
    $(ctrl).closest("tr").find('td:eq(4)').text('');
}


function fnFileClear(ctrl) {
    $(ctrl).closest("tr").find('input[type=file]').val('');
    $(ctrl).closest("tr").find('td:eq(3)').html('');
    $(ctrl).closest("tr").find('td:eq(4)').text('');
}


function getdata() {

    var LoginId = $("#ConatntMatter_hdnLoginId").val();

    //$("#dvloader").show();
    PageMethods.fnDSEList(LoginId, function (result) {
        //$("#dvloader").hide();
        //$("#divBTNS").find("a").hide();
        if (result.split("|")[0] == "2") {
            alert("Error-" + result.split("|")[1]);
        } else if (result == "") {
            $("#divmain")[0].innerHTML = "No Record(s) Found!!!";
        }
        else {
            // $("#divBTNS").show();
            $("#divmain")[0].innerHTML = result.split("|")[0];
            //fntblFixedHeader();
            var table = $('#tbldbrlist').DataTable({
                scrollCollapse: true,
                scrollY: "150px",
                paging: false,
                "ordering": false,
                "info": false,
                "bFilter": false,
                fixedHeader: {
                    header: true
                }
            });

            setInterval(function () { getdata(); }, 60000);
        }
    },
        function (result) {
            //$("#dvloader").hide();
            alert("Error-" + result._message);
        }
    )
}


//---------------progress bar

function trackUploadProgress(e) {
    if (e.lengthComputable) {
        currentProgress = (e.loaded / e.total) * 100; // Amount uploaded in percent
        $('#progressBar').width(currentProgress + '%');
        $('#dvProgressPrcent').html(currentProgress.toFixed(2) + '%');//dvProgressPrcent
        if (currentProgress == 100)
            $("#divsaving")[0].innerHTML = "<div><img valign='middle' src='../../Images/preloader_18.gif' alt='loading gif' />Importing data...Please Wait</div>";
        //$('#progressBar').css("display", "none");               

    }
}
