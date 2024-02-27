$(function () {
    $('input[type="file"]').change(function (e) {
        var fileName = e.target.files[0].name;
        $('.custom-file-label').html(fileName);
    });

    //$("#tblbrand-popup").dialog({
    //    title: "Brand Name",
    //    resizable: false,
    //    width: "75%",
    //    height: "400",
    //    modal: true
    //});
});
function fnValidateFile() {
    var fileUpload = $("#ConatntMatter_FileUpload1").get(0);
    var files = fileUpload.files;
    var allowedExtensions = "";
    allowedExtensions = /(\.csv)$/i;
    if (files.length == 0) {
        alert("Please select the file!!!!");
        return false;
    }
    if (!allowedExtensions.exec($("#ConatntMatter_FileUpload1").val())) {
        alert('Please upload only csv file');
        fileUpload.value = '';
        return false;
    }

    document.getElementById("ConatntMatter_btnRead").click();
}

function fnSaveSubBrand() {
    var ArrDataSaving = [];
    // debugger;
    $("#ConatntMatter_dvSubBrandName").find("#tblMain tbody tr").each(function () {
        if ($(this).find("#ddlSubBrandForm").val() != 'NA') {

            var ddlSubBrandForm = $(this).find("#ddlSubBrandForm option:selected").text();
            var PrdType = "SBF";
            var SBFNodeId = $(this).attr("NodeId")
            var SBFNodeType = $(this).attr("NodeType")

            ArrDataSaving.push({ PrdName: ddlSubBrandForm, PrdType: PrdType, NodeID: SBFNodeId, NodeType: SBFNodeType });
        }
    });

    if (ArrDataSaving.length == 0) {
        alert("Kindly Select the data from the drop down")
        return false;
    }

    $("#dvloader").show();

    PageMethods.fnSaveSubBrand(ArrDataSaving, fnSave_Success, fnFailed);
}


function fnSave_Success(result) {
    $("#dvloader").hide();
    if (result.split("^")[0] == "1") {
        alert("Saved successfully");
        fnClose();

    }
    else {
        alert("Some techical error. " + result.split("^")[1]);
    }

}
function fnFailed(result) {
    alert("Oops! Something went wrong. Please try again.");
    $("#dvloader").hide();
}
function fnClose() {
    // alert("here")
    $("#ConatntMatter_lblMsg").html("");
    $("#ConatntMatter_tblbrandpopup").hide();
}