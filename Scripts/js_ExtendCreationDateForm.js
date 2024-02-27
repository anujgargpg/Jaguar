var ht = 0;
var MonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function GetCurrentDate() {
    var d = new Date();
    var dat = d.getDate();
    var MonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (dat < 10) {
        dat = "0" + dat.toString();
    }
    return (dat + "-" + MonthArr[d.getMonth()] + "-" + d.getFullYear());
}
function fnfailed() {
    alert("Due to some technical reasons, we are unable to process your request !");
    $("#dvloader").hide();
}
$(document).ready(function () {
    ht = $(window).height();
    $("#divReport").height(ht - ($("#Heading").height() + $("#Filter").height() + $("#SubTabHead").height() + 180));

    $("#txtExtendAll").datepicker({
        dateFormat: 'dd-M-yy',
        minDate: 0
    });
    $("#txtExtendAll").val(GetCurrentDate());

    $("#ddlMonth").html($("#ConatntMatter_hdnMonths").val().split("^")[0]);
    $("#ddlMonth").val($("#ConatntMatter_hdnMonths").val().split("^")[1]);

    fnGetTableData();
});

function fnSelProcessType(ctrl) {
    $(ctrl).parent().parent().find("a").removeClass("active");
    $(ctrl).find("a").eq(0).addClass("active");
    $("#ConatntMatter_hdnProcessType").val($(ctrl).attr("ProcessId"));

    fnGetTableData();
}

function fnGetTableData() {
    $("#txtfilter").val('');
    var LoginID = $("#ConatntMatter_hdnLoginID").val();
    var UserID = $("#ConatntMatter_hdnUserID").val();
    var MonthVal = $("#ddlMonth").val().split("|")[0];
    var YearVal = $("#ddlMonth").val().split("|")[1];
    var ProcessType = $("#ConatntMatter_hdnProcessType").val();

    $("#dvloader").show();
    PageMethods.fnGetTableData(MonthVal, YearVal, ProcessType, fnGetTableData_pass, fnfailed);
}
function fnGetTableData_pass(res) {
    if (res.split("|^|")[0] == "0") {
        $("#divReport").html(res.split("|^|")[1]);

        var wid = $("#tblReport").width();
        var thead = $("#tblReport").find("thead").eq(0).html();

        $(".clsDate").datepicker({
            dateFormat: 'dd-M-yy',
            minDate: 0
        });

        $("#divHeader").html("<table id='tblReport_header' class='table table-bordered table-sm' style='margin-top:-4px; margin-bottom:0; width:" + (wid - 1) + "px; min-width:" + (wid - 1) + "px;'><thead>" + thead + "</thead></table>");
        $("#tblReport").css("width", wid);

        $("#tblReport").css("min-width", wid);
        for (i = 0; i < $("#tblReport").find("th").length; i++) {
            var th_wid = $("#tblReport").find("th")[i].clientWidth;
            $("#tblReport_header").find("th").eq(i).css("min-width", th_wid);
            $("#tblReport_header").find("th").eq(i).css("width", th_wid);
            $("#tblReport").find("th").eq(i).css("min-width", th_wid);
            $("#tblReport").find("th").eq(i).css("width", th_wid);
        }
        $("#tblReport").css("margin-top", "-" + $("#tblReport_header")[0].offsetHeight + "px");
        $("#dvloader").hide();
    }
    else {
        fnfailed();
    }
}


function fnSave(ctrl, flgAll) {
    var useridextend = $(ctrl).closest("tr").attr("userid");
    var NodeID = $(ctrl).closest("tr").attr("NodeID");
    var date = $(ctrl).closest("tr").find("input[type='text']").eq(0).val();
    var month = $("#ddlMonth").val().split("|")[0];
    var year = $("#ddlMonth").val().split("|")[1];
    var ProcessType = $("#ConatntMatter_hdnProcessType").val();

    if (flgAll == 1) {
        useridextend = "-1";
        NodeID = "-1";
        date = $("#txtExtendAll").val();
    }

    $("#dvloader").show();
    PageMethods.fnSave(NodeID, date, month, year, useridextend, ProcessType, fnSave_pass, fnfailed, flgAll);
}

function fnSave_pass(res, flgAll) {
    if (res.split("|^|")[0] == "0") {
        alert("Saved Successfully !");
        var Extendeddate = $("#txtExtendAll").val();
        if (flgAll == 1) {
            $("#tblReport").find("tbody").eq(0).find("input.clsDate").each(function () {
                $(this).val(Extendeddate);
            });
        }

        $("#dvloader").hide();
    }
}

function fntypefilter() {
    var flgtr = 0;
    var filter = ($("#txtfilter").val()).toUpperCase();

    $("#tblReport").find("tbody").eq(0).find("tr").css("display", "none");
    $("#tblReport").find("tbody").eq(0).find("tr").each(function () {
        if ($(this)[0].innerText.toUpperCase().indexOf(filter) > -1) {
            $(this).css("display", "table-row");
            flgtr = 1;
        }
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

function fnShowExtandDatePopup() {
    $("#divExtandDatePopup").dialog({
        "modal": true,
        "width": "350",
        "height": "160",
        "title": "Extend for All User : ",
        buttons: [{
            text: 'Extend',
            class: 'btn-primary',
            click: function () {
                fnSave(this, 1);
                $("#divExtandDatePopup").dialog('close');
            }
        },
        {
            text: 'Cancel',
            class: 'btn-primary',
            click: function () {
                $("#divExtandDatePopup").dialog('close');
            }
        }],
        close: function () {
            //
        }
    });
}