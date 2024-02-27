function fnSaveBrand() {
    var ArrDataSaving = [];
    $("#ConatntMatter_dvBrandName").find("#tblMain tbody tr").each(function () {
        if ($(this).find("#ddlBrandForm").val() > 0) {

            var ddlBrandForm = $(this).find("#ddlBrandForm option:selected").text();
            var PrdType = "BF";
            var BFNodeId = $(this).attr("BFNodeId")
            var BFNodeType = $(this).attr("BFNodeType")

            ArrDataSaving.push({ PrdName: ddlBrandForm, PrdType: PrdType, NodeID: BFNodeId, NodeType: BFNodeType });
        }
    });

    if (ArrDataSaving.length == 0) {
        //  alert("Kindly Select the data from the drop down")
        //if (window.confirm("You have not mapped anything! Are you sure you want to Save?"))
        //{
        //    var ddlBrandForm = "";
        //    var PrdType = "BF";
        //    var BFNodeId = "0";//$(this).attr("BFNodeId")
        //    var BFNodeType = "0"; //$(this).attr("BFNodeType")
        //    ArrDataSaving.push({ PrdName: ddlBrandForm, PrdType: PrdType, NodeID: BFNodeId, NodeType: BFNodeType });
        //}
        //else
        //{
        //    return false;
        //}


        $("#dvDialog").html("You have not mapped anything! Are you sure you want to Save?");
        $("#dvDialog").dialog({
            modal: true,
            title: "Alert",
            width: '40%',
            maxHeight: 'auto',
            minHeight: 150,
            buttons: {
                "Yes": function () {
                    var ddlBrandForm = "";
                    var PrdType = "BF";
                    var BFNodeId = "0";//$(this).attr("BFNodeId")
                    var BFNodeType = "0"; //$(this).attr("BFNodeType")
                    ArrDataSaving.push({ PrdName: ddlBrandForm, PrdType: PrdType, NodeID: BFNodeId, NodeType: BFNodeType });
                    $("#dvloader").show();
                    PageMethods.fnSaveBrand(ArrDataSaving, fnSave_Success, fnFailed);
                },
                "No": function () {
                    $(this).dialog("close");
                }
            }
        });

    }
    else {
        $("#dvloader").show();

        PageMethods.fnSaveBrand(ArrDataSaving, fnSave_Success, fnFailed);
    }


}


function fnSaveSubBrand() {
    var ArrDataSaving = [];
    $("#ConatntMatter_dvSubBrandName").find("#tblMain tbody tr").each(function () {
        if ($(this).find("#ddlSubBrandForm").val() > 0) {

            var ddlSubBrandForm = $(this).find("#ddlSubBrandForm option:selected").text();
            var PrdType = "SBF";
            var SBFNodeId = $(this).attr("SBFNodeId")
            var SBFNodeType = $(this).attr("SBFNodeType")

            ArrDataSaving.push({ PrdName: ddlSubBrandForm, PrdType: PrdType, NodeID: SBFNodeId, NodeType: SBFNodeType });
        }
    });

    if (ArrDataSaving.length == 0) {
        /* if (window.confirm("You have not mapped anything! Are you sure you want to Save?")) {
            var ddlSubBrandForm = "";
             var PrdType = "SBF";
             var SBFNodeId = "0";//$(this).attr("BFNodeId")
             var SBFNodeType = "0"; //$(this).attr("BFNodeType")
             ArrDataSaving.push({ PrdName: ddlSubBrandForm, PrdType: PrdType, NodeID: SBFNodeId, NodeType: SBFNodeType });
         }
         else {
             return false;
         }*/

        $("#dvDialog").html("You have not mapped anything! Are you sure you want to Save?");
        $("#dvDialog").dialog({
            modal: true,
            title: "Alert",
            width: '40%',
            maxHeight: 'auto',
            minHeight: 150,
            buttons: {
                "Yes": function () {
                    var ddlSubBrandForm = "";
                    var PrdType = "SBF";
                    var SBFNodeId = "0";//$(this).attr("BFNodeId")
                    var SBFNodeType = "0"; //$(this).attr("BFNodeType")
                    ArrDataSaving.push({ PrdName: ddlSubBrandForm, PrdType: PrdType, NodeID: SBFNodeId, NodeType: SBFNodeType });
                    $("#dvloader").show();
                    PageMethods.fnSaveSubBrand(ArrDataSaving, fnSave_Success, fnFailed);
                },
                "No": function () {
                    $(this).dialog("close");
                }
            }
        });

    }
    else {
        $("#dvloader").show();

        PageMethods.fnSaveSubBrand(ArrDataSaving, fnSave_Success, fnFailed);
    }
}

function fnSave_Success(result) {
    $("#dvloader").hide();
    $("#dvDialog").dialog("close");
    if (result.split("^")[0] == "1") {
        alert("Saved successfully");

    }
    else {
        alert("Some techical error. " + result.split("^")[1]);
    }

}
function fnFailed(result) {
    alert("Oops! Something went wrong. Please try again.");
    $("#dvloader").hide();
}

function fnGetBrand() {
    PageMethods.fnGetBrandDetails(fnSuccessBrand, fnfailed1)
}


function fnSuccessBrand(result) {
    if (result.split("~")[0] == "1") {
        $("#ConatntMatter_dvBrandName")[0].innerHTML = result.split("~")[1];
        $("#dvBrandName").show();
    }

    else {
        fnfailed1();
    }
}
function fnfailed1() {
    alert("Due to some technical reasons, we are unable to process your request !");
    //   $("#dvloader").hide();
}
function fnGetSubBrand() {
    PageMethods.fnGetSubBrandDetails(fnSuccess, fnfailed)
}

function fnSuccess(result) {
    if (result.split("~")[0] == "2") {
        // alert(result.split("~")[1])


        $("#ConatntMatter_dvSubBrandName")[0].innerHTML = result.split("~")[1];
        $("#dvSaveSubBrand").hide();
    }
    else if (result.split("~")[0] == "1") {
        $("#ConatntMatter_dvSubBrandName")[0].innerHTML = result.split("~")[1];
        $("#dvSaveSubBrand").show();
    }

    else {
        fnfailed();
    }
}
function fnfailed() {
    alert("Due to some technical reasons, we are unable to process your request !");
    //   $("#dvloader").hide();
}