$(function () {
    $(".middile-aligned").css({
        "margin-top": ($(".main-box").height() - $(".middile-aligned").outerHeight()) / 2 + "px"
    });
});
function fnBucket() {
    window.location.href = '../EntryForms/BucketMstr.aspx';
}
function fnInitiative() {
    window.location.href = '../EntryForms/Initiative.aspx';
}
function fnSubBrandForm() {
    window.location.href = '../EntryForms/SBFMstr.aspx';
}
function fnRoleManagement() {
    window.location.href = '../MasterForms/frmRoleAddEdit.aspx';
}
function fnUserManagement() {
    window.location.href = '../MasterForms/frmUserAddEdit.aspx';
}
function fnComingSoon() {
    alert("Coming Soon !");
}