using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ClosedXML.Excel;
using System.IO;

public partial class _FocusBrandTopup : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["LoginID"] == null)
        {
            Response.Redirect("~/frmLogin.aspx");
        }
        else
        {
            if (!IsPostBack)
            {
                hdnFBType.Value = "2";       // 1:Base, 2:Topup
                hdnLoginID.Value = Session["LoginID"].ToString();
                hdnUserID.Value = Session["UserID"].ToString();
                hdnRoleID.Value = Session["RoleId"].ToString();
                hdnNodeID.Value = Session["NodeId"].ToString();
                hdnNodeType.Value = Session["NodeType"].ToString();

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "72"))
                    GetMaster();
                else
                    Response.Redirect("~/frmLogin.aspx");
            }
        }
    }
    private void GetMaster()
    {
        hdnProductLvl.Value = "<div class='producthrchy'>Product Level</div>" + Utilities.GetHierLvl("1", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "72");

        hdnLocationLvl.Value = "<div class='producthrchy'>Location Level</div>" + Utilities.GetHierLvl("2", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "72");

        hdnChannelLvl.Value = "<div class='producthrchy'>Channel Level</div>" + Utilities.GetHierLvl("3", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "72");


        //------- Masters -----------------------------------
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spFBGetFBMatser_Topup_New";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        StringBuilder sbMstr = new StringBuilder();
        StringBuilder sbSelectedstr = new StringBuilder();
        //------- Months
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["Start Date"].ToString() + "|" + Ds.Tables[0].Rows[i]["End Date"].ToString() + "'>" + Ds.Tables[0].Rows[i]["Month"].ToString() + "</option>");
            if (Ds.Tables[0].Rows[i]["flgSelect"].ToString() == "1")
                sbSelectedstr.Append(Ds.Tables[0].Rows[i]["Start Date"].ToString() + "|" + Ds.Tables[0].Rows[i]["End Date"].ToString());
        }
        hdnMonths.Value = sbMstr.ToString() + "^" + sbSelectedstr.ToString();

        //------- Init Type
        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[1].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[1].Rows[i]["INITTypeID"].ToString() + "' uom='" + Ds.Tables[1].Rows[i]["INITUOMID"].ToString() + "'>" + Ds.Tables[1].Rows[i]["INITType"].ToString() + "</option>");
        }
        hdnInitType.Value = sbMstr.ToString();

        //------- UOM 
        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[2].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[2].Rows[i]["INITIOMID"].ToString() + "'>" + Ds.Tables[2].Rows[i]["INITUOM"].ToString() + "</option>");
        }
        hdnUOM.Value = sbMstr.ToString();

        //------- COH 
        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[3].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[3].Rows[i]["COHID"].ToString() + "'>" + Ds.Tables[3].Rows[i]["COHNo"].ToString() + "</option>");
        }
        hdnCOHMstr.Value = sbMstr.ToString();

        //------- Sector 
        sbMstr.Clear();
        sbMstr.Append("<table class='tbl-sector'>");
        sbMstr.Append("<tbody>");
        for (int i = 0; Ds.Tables[4].Rows.Count > i; i++)
        {
            sbMstr.Append("<tr iden='sector' strid='" + Ds.Tables[4].Rows[i]["SectorID"].ToString() + "' flg='0' onclick='fnSelectSector(this);'><td><img src='../../Images/checkbox-unchecked.png'/></td><td>" + Ds.Tables[4].Rows[i]["SectorName"].ToString() + "</td></tr>");
        }
        sbMstr.Append("</tbody>");
        sbMstr.Append("</table>");
        hdnSectorMstr.Value = sbMstr.ToString();

        //sbMstr.Clear();
        //sbMstr.Append("<option value='0'>--Select--</option>");
        //for (int i = 0; Ds.Tables[4].Rows.Count > i; i++)
        //{
        //    sbMstr.Append("<option value='" + Ds.Tables[4].Rows[i]["SectorID"].ToString() + "'>" + Ds.Tables[4].Rows[i]["SectorName"].ToString() + "</option>");
        //}
        //hdnSectorMstr.Value = sbMstr.ToString();

        Ds.Clear();
        sbMstr = new StringBuilder();
        StringBuilder sbProcessGrpLegend = new StringBuilder();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spINITGetLeged]";
        Scmd.Parameters.AddWithValue("@RoleID", hdnRoleID.Value);
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        //------- Months
        sbMstr.Clear();
        sbProcessGrpLegend.Clear();
        sbMstr.Append("<option value=''>-- Select --</option>");
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["Legend"].ToString() + "'>" + Ds.Tables[0].Rows[i]["Legend"].ToString() + "</option>");
            sbProcessGrpLegend.Append("<div class='clsdiv-legend-block'><div class='clsdiv-legend-color' style='background: " + Ds.Tables[0].Rows[i]["ColorCode"].ToString() + ";'></div><div class='clsdiv-legend-text'>" + Ds.Tables[0].Rows[i]["Legend"].ToString() + "</div></div>");
        }
        hdnProcessGrp.Value = sbMstr.ToString() + "^" + sbProcessGrpLegend.ToString();

        Ds.Clear();
        sbMstr = new StringBuilder();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spGetMSMPAliesFilter]";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@CalledFrom", "1");
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        sbMstr.Clear();
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["UserID"].ToString() + "'>" + Ds.Tables[0].Rows[i]["MSMPAlies"].ToString() + "</option>");
        }
        hdnMSMPAlies.Value = sbMstr.ToString();
    }

    

    [System.Web.Services.WebMethod()]
    public static string fnProdHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, string flg, object obj)
    {
        try
        {
            DataTable tbl = new DataTable();
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);
            if (tbl.Rows.Count > 0)
            {
                return "0|^|" + Utilities.GetHierDetail("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "72") + "|^|" + Utilities.GetSelectedHierDetail("1", obj, "72");
            }
            else
                return "0|^|" + Utilities.GetHierDetail("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "72") + "|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }

    [System.Web.Services.WebMethod()]
    public static string fnLocationHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, object obj, string InSubD)
    {
        try
        {
            DataTable tbl = new DataTable();
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);
            if (tbl.Rows.Count > 0)
            {
                return "0|^|" + Utilities.GetHierDetail("2", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "72") + "|^|" + Utilities.GetSelectedHierDetail("2", obj, "72");
            }
            else
                return "0|^|" + Utilities.GetHierDetail("2", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "72") + "|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }

    [System.Web.Services.WebMethod()]
    public static string fnChannelHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, object obj)
    {
        try
        {
            DataTable tbl = new DataTable();
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);
            if (tbl.Rows.Count > 0)
            {
                return "0|^|" + Utilities.GetHierDetail("3", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "72") + "|^|" + Utilities.GetSelectedHierDetail("3", obj, "72");
            }
            else
                return "0|^|" + Utilities.GetHierDetail("3", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "72") + "|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }



    [System.Web.Services.WebMethod()]
    public static string ClusterFilter(string BucketType, string Month, string Year, string searchtxt)
    {
        DataSet Ds = Utilities.BucketFilterTillLastlvl(BucketType, Month, Year, searchtxt);
        object obj = JsonConvert.SerializeObject(Ds, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        return "0|^|" + obj.ToString();
    }
    [System.Web.Services.WebMethod()]
    public static string GetClusters(string LoginID, string RoleID, string UserID, string BucketType, string Month, string Year)
    {
        return Utilities.GetBucketDetailsbasedonType(BucketType, LoginID, UserID, RoleID, Month, Year, true, "72");
    }

    [System.Web.Services.WebMethod()]
    public static string GetBucketbasedonType(string LoginID, string RoleID, string UserID, string BucketType)
    {
        return Utilities.GetBucketDetailsbasedonType(BucketType, LoginID, UserID, RoleID, "", "", false, "72");
    }

    [System.Web.Services.WebMethod()]
    public static string GetSelHierTbl(object obj, string BucketType, string InSubD)
    {
        return Utilities.GetSelectedHierDetail(BucketType, obj, "72");
    }


    [System.Web.Services.WebMethod()]
    public static string fnGetReport(string LoginID, string RoleID, string UserID, string FromDate, string ToDate, object objProd, object objLoc, object objChannel, string ProcessGroup, object objUser)
    {
        //try
        //{
            StringBuilder sbTimeChecker = new StringBuilder();
            sbTimeChecker.Append("SP Caliing Start : " + DateTime.Now.ToLongTimeString());

            string strUser = JsonConvert.SerializeObject(objUser, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable dtUser = JsonConvert.DeserializeObject<DataTable>(strUser);
            if (dtUser.Rows[0][0].ToString() == "0")
                dtUser.Rows.RemoveAt(0);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spCheckINITCreationDate";
            Scmd.Parameters.AddWithValue("@StartDate", FromDate);
            Scmd.Parameters.AddWithValue("@EndDate", ToDate);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            string IsNewAdditionAllowed = "0";
            if (Ds.Tables[0].Rows[0][0].ToString() == "1")
                IsNewAdditionAllowed = "1";
            Ds.Dispose();

            DataTable tblProd = new DataTable();
            string str = JsonConvert.SerializeObject(objProd, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblProd = JsonConvert.DeserializeObject<DataTable>(str);
            if (tblProd.Rows[0][0].ToString() == "0")
                tblProd.Rows.RemoveAt(0);

            DataTable tblLoc = new DataTable();
            string strLoc = JsonConvert.SerializeObject(objLoc, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblLoc = JsonConvert.DeserializeObject<DataTable>(strLoc);
            if (tblLoc.Rows[0][0].ToString() == "0")
                tblLoc.Rows.RemoveAt(0);

            DataTable tblChannel = new DataTable();
            string strChannel = JsonConvert.SerializeObject(objChannel, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblChannel = JsonConvert.DeserializeObject<DataTable>(strChannel);
            if (tblChannel.Rows[0][0].ToString() == "0")
                tblChannel.Rows.RemoveAt(0);

            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBGetFBInfo_TopUp_NEW";
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
            Scmd.Parameters.AddWithValue("@LocSelection", tblLoc);
            Scmd.Parameters.AddWithValue("@ChannelSelection", tblChannel);
            Scmd.Parameters.AddWithValue("@FromDate", FromDate);
            Scmd.Parameters.AddWithValue("@EndDate", ToDate);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@ProcessGroup", ProcessGroup);
            Scmd.Parameters.AddWithValue("@Users", dtUser);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            Sdap = new SqlDataAdapter(Scmd);
            Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            sbTimeChecker.Append("<br/>SP Caliing End : " + DateTime.Now.ToLongTimeString());

            return "0|^|" + CreateFBMstrTbl(RoleID, Ds, "tblReport", "clsReport", IsNewAdditionAllowed) + "|^|" + CreateButtons(Ds.Tables[2]) + "|^|" + IsNewAdditionAllowed + "|^|" + CreateLegends(Ds.Tables[3]) + "|^|" + sbTimeChecker.ToString() + "<br/>HTML Format Created : " + DateTime.Now.ToLongTimeString();
        //}
        //catch (Exception ex)
        //{
        //    return "1|^|" + ex.Message;
        //}
    }
    private static string CreateFBMstrTbl(string RoleID, DataSet Ds, string tblname, string cls, string IsNewAdditionAllowed)
    {        
        string[] SkipColumn = new string[18];
        SkipColumn[0] = "FBID";
        SkipColumn[1] = "AllChannel";
        SkipColumn[2] = "LocStrValue";
        SkipColumn[3] = "ChannelStrValue";
        SkipColumn[4] = "FromDate";
        SkipColumn[5] = "flgIncludeSubD";
        SkipColumn[6] = "Name";
        SkipColumn[7] = "FBShortDescr";
        SkipColumn[8] = "Include SubD";
        SkipColumn[9] = "flgEdit";
        SkipColumn[10] = "flgRejectComment";
        SkipColumn[11] = "colorcode";
        SkipColumn[12] = "flgBookmark";
        SkipColumn[13] = "flgCheckBox";
        SkipColumn[14] = "flgSettle";
        SkipColumn[15] = "SectorID";
        SkipColumn[16] = "COHNo";
        SkipColumn[17] = "COHID";

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        StringBuilder sbCluster = new StringBuilder();
        StringBuilder sbChannel = new StringBuilder();
        StringBuilder sbFBAppRule = new StringBuilder();

        sb.Append("<table id='" + tblname + "' class='table table-striped table-bordered table-sm " + cls + "' IsSchemeAppRule='1' IsLocExpand='1' IsChannelExpand='1'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th><input type='checkbox' onclick='fnChkUnchkInitAll(this);'/></th>");
        sb.Append("<th><img src='../../Images/bookmark-inactive.png' iden='Bookmark' title='Bookmark' flgBookmark='0' onclick='fnManageBookMarkAll(this);'/></th>");
        sb.Append("<th>Action</th>");
        for (int j = 0; j < dt.Columns.Count; j++)
        {
            if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
            {
                if (dt.Columns[j].ColumnName.ToString().Trim() == "Code")
                {
                    if (RoleID != "3" && RoleID != "1015")
                        sb.Append("<th>Focus Brand<br/>Short Details</th>");
                    else
                        sb.Append("<th>Focus Brand</th>");
                }
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Description")
                    sb.Append("<th>Details</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "ToDate")
                    sb.Append("<th>Time Period</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Include Leap")
                    sb.Append("<th>Include Leap/SubD</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "FB Application Rules")
                    sb.Append("<th><i iden='btnAppRuleExpandCollapse' class='fa fa-minus-square clsExpandCollapse' onclick='fnCollapseContent(1);'></i><span>Application Rules</span></th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Location")
                    sb.Append("<th><i iden='btnlocExpandCollapse' class='fa fa-minus-square clsExpandCollapse' onclick='fnCollapseContent(2);'></i><span>Location</span></th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Channel")
                    sb.Append("<th><i iden='btnChannelExpandCollapse' class='fa fa-minus-square clsExpandCollapse' onclick='fnCollapseContent(3);'></i><span>Channel</span></th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "strSearch")
                    sb.Append("<th style='display: none;'>strSearch</th>");
                else
                    sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");
            }
        }
        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        if (dt.Rows.Count > 0)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                sbCluster.Clear();
                sbChannel.Clear();
                sbFBAppRule.Clear();
                sbFBAppRule.Append(FBAppRules(dt.Rows[i]["FBID"].ToString(), Ds.Tables[1]));
                sbCluster.Append(FBClusterStr(dt.Rows[i]["FBID"].ToString(), Ds.Tables[4]));
                sbChannel.Append(FBChannelStr(dt.Rows[i]["FBID"].ToString(), Ds.Tables[7], Ds.Tables[8]));

                sb.Append("<tr Init='" + dt.Rows[i]["FBID"] + "' INITName='" + dt.Rows[i]["Name"] + "' ShortDescr='" + dt.Rows[i]["FBShortDescr"].ToString() + "' Descr='" + dt.Rows[i]["Description"].ToString() + "' FromDate='" + dt.Rows[i]["FromDate"] + "' ToDate='" + dt.Rows[i]["ToDate"] + "' channel='" + sbChannel.ToString().Split('~')[2] + "' channelStr='" + sbChannel.ToString().Split('~')[1] + "' loc='" + sbCluster.ToString().Split('~')[2] + "' locStr='" + sbCluster.ToString().Split('~')[1] + "' InSubD='1' IncludeSubD='" + dt.Rows[i]["Include SubD"] + "' IncludeLeap='" + dt.Rows[i]["Include Leap"] + "' CusterDetail='" + CusterDetail(dt.Rows[i]["FBID"].ToString(), Ds.Tables[4], Ds.Tables[6]) + "' FBAppRule='" + sbFBAppRule.ToString() + "' TopSKUs='" + GetTopSKUDetail(dt.Rows[i]["FBID"].ToString(), Ds.Tables[5]) + "' flgRejectComment='" + dt.Rows[i]["flgRejectComment"].ToString() + "' flgDBEdit='" + dt.Rows[i]["flgEdit"].ToString() + "' flgCheckBox='" + dt.Rows[i]["flgCheckBox"].ToString() + "' flgBookmark='" + dt.Rows[i]["flgBookmark"].ToString() + "' flgSettle='" + dt.Rows[i]["flgSettle"].ToString() + "' flgEdit='0' flgVisible='1' iden='Init' style='display: table-row;'>");

                sb.Append("<td iden='Init' style='background-color: " + dt.Rows[i]["colorcode"].ToString() + ";'>");
                if (dt.Rows[i]["flgCheckBox"].ToString() == "1")
                    sb.Append("<input iden='chkInit' type='checkbox' onclick='fnUnchkInitIndividual(this);'/>");
                sb.Append("</td>");

                if (dt.Rows[i]["flgBookmark"].ToString() == "1")
                    sb.Append("<td iden='Init'><img src='../../Images/bookmark.png' title='Active Bookmark' flgBookmark='1' onclick='fnManageBookMark(this);'/></td>");
                else
                    sb.Append("<td iden='Init'><img src='../../Images/bookmark-inactive.png' title='InActive Bookmark' flgBookmark='0' onclick='fnManageBookMark(this);'/></td>");

                sb.Append("<td iden='Init' class='clstdAction'>");
                if (IsNewAdditionAllowed == "1")
                    sb.Append("<img src='../../Images/copy.png' iden='CopyInit' title='Copy Norm' onclick='fnEditCopy(this, 2);'/>");
                if (dt.Rows[i]["flgEdit"].ToString() == "1")
                {
                    sb.Append("<img src='../../Images/edit.png' iden='EditInit' title='Edit Norm' onclick='fnEditCopy(this, 1);'/>");
                    sb.Append("<img src='../../Images/delete.png' iden='DeleteInit' title='Delete Norm' onclick='fnDelete(this);'/>");
                }
                if (dt.Rows[i]["flgSettle"].ToString() == "1")
                    sb.Append("<img src='../../Images/settle.png' iden='SettleInit' title='Settle Norm' onclick='fnSettle(this);'/>");
                if (dt.Rows[i]["flgRejectComment"].ToString() == "1")
                    sb.Append("<img src='../../Images/comments.png' iden='RejComments' title='Comments' onclick='fnGetRejectComment(this);'/>");
                sb.Append("</td>");

                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                    {
                        if (dt.Columns[j].ColumnName.ToString() == "Code")
                        {
                            if (RoleID != "3" && RoleID != "1015")
                            {
                                sb.Append("<td iden='Init' style='font-size: 0.7rem;'>" + (dt.Rows[i]["Name"].ToString().Length > 17 ? "<span title='" + dt.Rows[i]["Name"].ToString() + "' class='clsInform'>" + dt.Rows[i]["Name"].ToString().Substring(0, 15) + "..</span>" : dt.Rows[i]["Name"].ToString()) + "<br/>" + (dt.Rows[i]["FBShortDescr"].ToString().Length > 17 ? "<span title='" + dt.Rows[i]["FBShortDescr"].ToString() + "' class='clsInform'>" + dt.Rows[i]["FBShortDescr"].ToString().Substring(0, 15) + "..</span>" : dt.Rows[i]["FBShortDescr"].ToString()) + "</td>");
                            }
                            else
                                sb.Append("<td iden='Init' style='font-size: 0.7rem;'>" + (dt.Rows[i]["Name"].ToString().Length > 17 ? "<span title='" + dt.Rows[i]["Name"].ToString() + "' class='clsInform'>" + dt.Rows[i]["Name"].ToString().Substring(0, 15) + "..</span>" : dt.Rows[i]["Name"].ToString()) + "</td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Description")
                        {
                            sb.Append("<td iden='Init' style='font-size: 0.7rem;'>" + (dt.Rows[i]["Description"].ToString().Length > 50 ? "<span title='" + dt.Rows[i]["Description"].ToString() + "' class='clsInform'>" + dt.Rows[i]["Description"].ToString().Substring(0, 48) + "..</span>" : dt.Rows[i]["Description"].ToString()) + "</td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "ToDate")
                            sb.Append("<td iden='Init'>" + dt.Rows[i]["FromDate"] + "<br/>to " + dt.Rows[i]["ToDate"] + "</td>");
                        else if (dt.Columns[j].ColumnName.ToString() == "Include Leap")
                        {
                            if (dt.Rows[i]["Include Leap"].ToString() == "1" && dt.Rows[i]["Include SubD"].ToString() == "1")
                                sb.Append("<td iden='Init'>Leap<br/>SubD</td>");
                            else if (dt.Rows[i]["Include Leap"].ToString() == "1")
                                sb.Append("<td iden='Init'>Leap</td>");
                            else if (dt.Rows[i]["Include SubD"].ToString() == "1")
                                sb.Append("<td iden='Init'>SubD</td>");
                            else
                                sb.Append("<td iden='Init'></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Cluster-wise Details")
                        {
                            sb.Append("<td iden='Init'><div style='width: 101px; min-width: 101px; text-align: center;'><a href='#' class='btn btn-primary btn-small' onclick='fnShowClusterDetailPopupReadOnly(this);'>View Details</a><div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "FB Application Rules")
                        {
                            if (sbFBAppRule.ToString() == "")
                                sb.Append("<td iden='Init'><div style='width: 101px; min-width: 101px; text-align: center;'><a href='#' class='btn btn-danger btn-small' style='cursor: default;'>No Rule Defined</a><div></td>");
                            else
                                sb.Append("<td iden='Init'><div style='width: 101px; min-width: 101px; text-align: center;'><a href='#' class='btn btn-primary btn-small' onclick='fnShowApplicationRulesPopup(this);'>View Details</a><div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Location")
                        {
                            sb.Append("<td iden='Init'><div style='width: 122px; min-width: 122px; font-size:0.6rem;'>" + (sbCluster.ToString().Split('~')[2].Length > 70 ? "<span title='" + sbCluster.ToString().Split('~')[2] + "' class='clsInform'>" + sbCluster.ToString().Split('~')[2].Substring(0, 68) + "..</span>" : sbCluster.ToString().Split('~')[2]) + "</div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Channel")
                        {
                            sb.Append("<td iden='Init'><div style='width: 162px; min-width: 162px; font-size:0.6rem;'>" + (sbChannel.ToString().Split('~')[2].Length > 80 ? "<span title='" + sbChannel.ToString().Split('~')[2] + "' class='clsInform'>" + sbChannel.ToString().Split('~')[2].Substring(0, 78) + "..</span>" : sbChannel.ToString().Split('~')[2]) + "</div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Top SKUs")
                        {
                            sb.Append("<td iden='Init'><div style='width: 122px; min-width: 122px; font-size:0.6rem;'>" + (dt.Rows[i]["Top SKUs"].ToString().Length > 80 ? "<span title='" + dt.Rows[i]["Top SKUs"].ToString() + "' class='clsInform'>" + dt.Rows[i]["Top SKUs"].ToString().Substring(0, 78) + "..</span>" : dt.Rows[i]["Top SKUs"].ToString()) + "</div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "strSearch")
                            sb.Append("<td iden='Init' style='display: none;'>" + dt.Rows[i][j].ToString() + "</td>");
                        else
                            sb.Append("<td iden='Init'>" + dt.Rows[i][j] + "</td>");
                    }
                }

                sb.Append("</tr>");
            }
        }
        else
        {
            sb.Append("<tr iden='Init' Init='0' INITName=''>");
            sb.Append("<td style='background-color: transparent;'></td>");
            sb.Append("<td></td>");
            sb.Append("<td class='clstdAction'></td>");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                {
                    if (dt.Columns[j].ColumnName.ToString() == "Code")
                    {
                        sb.Append("<td iden='Init' style='font-size: 0.7rem;'></td>");
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Description")
                    {
                        sb.Append("<td iden='Init' style='font-size: 0.7rem;'></td>");
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Cluster-wise Details")
                    {
                        sb.Append("<td iden='Init'><div style='width: 101px; min-width: 101px; text-align: center;'><div></td>");
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "FB Application Rules")
                    {
                        sb.Append("<td iden='Init'><div style='width: 101px; min-width: 101px; text-align: center;'><div></td>");
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Location")
                    {
                        sb.Append("<td iden='Init'><div style='width: 122px; min-width: 122px; font-size:0.6rem;'></div></td>");
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Channel")
                    {
                        sb.Append("<td iden='Init'><div style='width: 162px; min-width: 162px; font-size:0.6rem;'></div></td>");
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Top SKUs")
                    {
                        sb.Append("<td iden='Init'><div style='width: 122px; min-width: 122px; font-size:0.6rem;'></div></td>");
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "strSearch")
                        sb.Append("<td iden='Init' style='display: none;'></td>");
                    else
                        sb.Append("<td iden='Init'></td>");
                }
            }
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    private static string FBClusterStr(string FBId, DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        StringBuilder sbdescr = new StringBuilder();

        DataRow[] dr = dt.Select("FBID=" + FBId);
        if (dr.Length > 0)
        {
            DataTable dttemp = dr.CopyToDataTable();
            for (int k = 0; k < dttemp.Rows.Count; k++)
            {
                if (k != 0)
                {
                    sb.Append("^");
                    sbdescr.Append(", ");
                }

                sb.Append(dttemp.Rows[k]["ClusterID"].ToString() + "|" + dttemp.Rows[k]["ClusterName"].ToString());
                sbdescr.Append(dttemp.Rows[k]["ClusterName"].ToString());
            }
        }

        return "0" + "~" + sb.ToString() + "~" + sbdescr.ToString();
    }
    private static string FBChannelStr(string FBId, DataTable dt, DataTable dtbucket)
    {
        StringBuilder sb = new StringBuilder();
        StringBuilder sbdescr = new StringBuilder();

        DataRow[] dr = dt.Select("FBID=" + FBId);
        if (dr.Length > 0)
        {
            DataTable dttemp = dr.CopyToDataTable();
            for (int k = 0; k < dttemp.Rows.Count; k++)
            {
                if (k != 0)
                {
                    sb.Append("^");
                    sbdescr.Append(", ");
                }

                sb.Append(dttemp.Rows[k]["NodeID"].ToString() + "|" + dttemp.Rows[k]["NodeType"].ToString());
                sbdescr.Append(dttemp.Rows[k]["Descr"].ToString());
            }
        }

        sb.Append("|||" + FBChannelBucketStr(FBId, dtbucket));

        return "0" + "~" + sb.ToString() + "~" + sbdescr.ToString();
    }
    private static string FBChannelBucketStr(string FBId, DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        DataRow[] dr = dt.Select("FBID=" + FBId);
        if (dr.Length > 0)
        {
            DataTable dttemp = dr.CopyToDataTable();
            for (int k = 0; k < dttemp.Rows.Count; k++)
            {
                if (k != 0)
                    sb.Append("|");

                sb.Append(dttemp.Rows[k]["BucketID"].ToString());
            }
        }
        else
            sb.Append("0");

        return sb.ToString();
    }
    private static string FBAppRules(string InitID, DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        StringBuilder sbProdHier = new StringBuilder();
        DataRow[] drFBProd = dt.Select("FBID=" + InitID);
        if (drFBProd.Length > 0)
        {            
            DataTable dtFBProd = drFBProd.CopyToDataTable();
            DataTable dtDistinctSlab = dtFBProd.DefaultView.ToTable(true, "FBSlabID");
            for (int i = 0; i < dtDistinctSlab.Rows.Count; i++)
            {
                sb.Append("##" + dtDistinctSlab.Rows[i]["FBSlabID"].ToString() + "$$0$$");
                DataTable dtSlabWiseProds = dtFBProd.Select("FBSlabID=" + dtDistinctSlab.Rows[i]["FBSlabID"].ToString()).CopyToDataTable();

                sbProdHier.Clear();
                for (int k = 0; k < dtSlabWiseProds.Rows.Count; k++)
                {
                    if (k != 0)
                    {
                        sbProdHier.Append("^");
                        sb.Append(", ");
                    }
                    sbProdHier.Append(dtSlabWiseProds.Rows[k]["NodeID"].ToString() + "|" + dtSlabWiseProds.Rows[k]["NodeType"].ToString());
                    sb.Append(dtSlabWiseProds.Rows[k]["Descr"].ToString());
                }
                sb.Append("$$" + sbProdHier.ToString() + "$$" + dtSlabWiseProds.Rows[0]["NodeType"].ToString() + "$$0$$" + dtSlabWiseProds.Rows[0]["INITTypeID"].ToString() + "$$" + Convert.ToDouble(dtSlabWiseProds.Rows[0]["MinQty"].ToString()) + "$$" + dtSlabWiseProds.Rows[0]["UOMID"].ToString());
                
            }
            return sb.ToString().Substring(2);
        }
        else
            return "";
    }
    private static string CusterDetail(string FBID, DataTable dt, DataTable dtSector)
    {
        StringBuilder sb = new StringBuilder();
        DataRow[] drFBCluster = dt.Select("FBID=" + FBID);
        if (drFBCluster.Length > 0)
        {
            DataTable dtFBCluster = drFBCluster.CopyToDataTable();
            for (int i = 0; i < dtFBCluster.Rows.Count; i++)
            {
                sb.Append("|" + dtFBCluster.Rows[i]["ClusterID"].ToString() + "^" + dtFBCluster.Rows[i]["ClusterName"].ToString() + "^" + dtFBCluster.Rows[i]["FBTarget"].ToString() + "^" + dtFBCluster.Rows[i]["COHID"].ToString() + "^");

                //dtFBCluster.Rows[i]["SectorID"].ToString()
                DataRow[] drFBClusterSector = dtSector.Select("FBID=" + FBID + " And ClusterID=" + dtFBCluster.Rows[i]["ClusterID"].ToString());
                if (drFBClusterSector.Length > 0)
                {
                    DataTable dtFBClusterSector = drFBClusterSector.CopyToDataTable();
                    for (int j = 0; j < dtFBClusterSector.Rows.Count; j++)
                    {
                        if (j > 0)
                            sb.Append("$");

                        sb.Append(dtFBClusterSector.Rows[j]["SectorID"].ToString() + "~" + dtFBClusterSector.Rows[j]["SectorName"].ToString());
                    }
                }
            }
            return sb.ToString().Substring(1);
        }
        else
            return "";
    }
    private static string GetTopSKUDetail(string FBID, DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        StringBuilder sbdescr = new StringBuilder();
        DataRow[] drFBSKU = dt.Select("FBID=" + FBID);
        if (drFBSKU.Length > 0)
        {
            DataTable dtFBSKU = drFBSKU.CopyToDataTable();
            for (int i = 0; i < dtFBSKU.Rows.Count; i++)
            {
                sb.Append("^" + dtFBSKU.Rows[i]["NodeID"].ToString() + "|" + dtFBSKU.Rows[i]["NodeType"].ToString());
                sbdescr.Append(", " + dtFBSKU.Rows[i]["Descr"].ToString().Trim());
            }
            return sb.ToString().Substring(1) + "~" + sbdescr.ToString().Substring(2);
        }
        else
            return "~";
    }
    private static string CreateButtons(DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sb.Append("<a href='#' class='btn btn-primary btn-disabled btn-sm' style='margin-right: 10px;' flgAction='" + dt.Rows[i]["ButtonID"].ToString() + "'>" + dt.Rows[i]["Button"].ToString() + "</a>");
        }
        return sb.ToString();
    }
    private static string CreateLegends(DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sb.Append("<div class='clsdiv-legend-block'><div class='clsdiv-legend-color' style='background: " + dt.Rows[i]["ColorCode"].ToString() + ";'></div><div class='clsdiv-legend-text'>" + dt.Rows[i]["Legend"].ToString() + "</div></div>");
        }
        return sb.ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string fnGetFBforImport(string RoleID, string UserID, string LoginID, string FromDate, string ToDate, string flgOldNew, string flgFBType, string flgChannel, object objProd, object objLoc, object objChannel)
    {
        return Utilities.GetFBforImport(UserID, LoginID, FromDate, ToDate, objProd, objLoc, objChannel, flgOldNew, flgFBType, flgChannel, "0");
    }
    [System.Web.Services.WebMethod()]
    public static string fnImportFB(string RoleID, string UserID, string LoginID, string FromDate, string ToDate, object objINIT, string flgOldNew, string flgFBType)
    {
        return Utilities.ImportFB(RoleID, UserID, LoginID, FromDate, ToDate, objINIT, flgOldNew, flgFBType, "0");
    }



    [System.Web.Services.WebMethod()]
    public static string fnGetAllRejectComments(string RoleID, string LoginID, string UserID, object objINIT)
    {
        try
        {
            string strINIT = JsonConvert.SerializeObject(objINIT, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblINIT = JsonConvert.DeserializeObject<DataTable>(strINIT);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBGetCommentsinBulk_TopUp_New";
            Scmd.Parameters.AddWithValue("@FB", tblINIT);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            object obj = JsonConvert.SerializeObject(Ds, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            return "0|^|" + obj.ToString();
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnGetRejectComments(string INITID, string RoleID)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBGetComment_TopUp";
            Scmd.Parameters.AddWithValue("@FBID", INITID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            if (Ds.Tables[0].Rows.Count > 0)
            {
                object obj = JsonConvert.SerializeObject(Ds, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
                return "0|^|" + obj.ToString();
            }
            else
                return "0|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnSaveRejectComments(string INITID, string RoleID, string UserID, string LoginID, string Comments)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBSaveComment_TopUp_New";
            Scmd.Parameters.AddWithValue("@FBID", INITID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@Comments", Utilities.XSSHandling(Comments));
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnManageBookMark(string flgBookmark, string LoginID, string UserID, object objINIT)
    {
        try
        {
            string strINIT = JsonConvert.SerializeObject(objINIT, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblINIT = JsonConvert.DeserializeObject<DataTable>(strINIT);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBManageBookmark_TopUp_New    ";
            Scmd.Parameters.AddWithValue("@FBID", tblINIT);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@flgBookmark", flgBookmark);   // 1: bookmark, 0: clear bookmark

            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnSettle(string INITID, string UserID, string LoginID)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBMarkSetteled_TopUp_New";
            Scmd.Parameters.AddWithValue("@FBID", INITID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnSave(string INITID, string INITName, string FBShortDescr, string INITDescription, string FromDate, string ToDate, object objBucket, object obj, string LoginID, string strLocation, string strChannel, string IncudeLeap, string IncudeSubD, object objProd, string UserID, string flgSave, object objClusterDetails, object objAllSKU, object objTopSKU, object objSector, string flgOverwrite)
    {
        try
        {

            StringBuilder sb = new StringBuilder();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());

            DataTable tblBucket = new DataTable();
            string strBucket = JsonConvert.SerializeObject(objBucket, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBucket = JsonConvert.DeserializeObject<DataTable>(strBucket);

            DataTable tbl = new DataTable();
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);

            string strProd = JsonConvert.SerializeObject(objProd, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblProd = JsonConvert.DeserializeObject<DataTable>(strProd);
            if (tblProd.Rows[0][3].ToString() == "0")
                tblProd.Rows.RemoveAt(0);

            string strClusterDetails = JsonConvert.SerializeObject(objClusterDetails, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblClusterDetails = JsonConvert.DeserializeObject<DataTable>(strClusterDetails);
            if (tblClusterDetails.Rows[0][0].ToString() == "0")
                tblClusterDetails.Rows.RemoveAt(0);

            string strTopSKU = JsonConvert.SerializeObject(objTopSKU, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblTopSKU = JsonConvert.DeserializeObject<DataTable>(strTopSKU);
            if (tblTopSKU.Rows[0][0].ToString() == "0")
                tblTopSKU.Rows.RemoveAt(0);

            string strSector = JsonConvert.SerializeObject(objSector, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable dtSector = JsonConvert.DeserializeObject<DataTable>(strSector);
            if (dtSector.Rows[0][0].ToString() == "0")
                dtSector.Rows.RemoveAt(0);

            int flgTopSKU = 1;
            if(tblProd.Rows.Count > 0 && tblTopSKU.Rows.Count > 0 && flgOverwrite == "0")
            {
                string strAllSKU = JsonConvert.SerializeObject(objAllSKU, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
                DataTable tblAllSKU = JsonConvert.DeserializeObject<DataTable>(strAllSKU);

                SqlCommand SKUScmd = new SqlCommand();
                SKUScmd.Connection = Scon;
                SKUScmd.CommandText = "spFBCheckSBF_New";
                SKUScmd.CommandType = CommandType.StoredProcedure;
                SKUScmd.Parameters.AddWithValue("@PrdList", tblAllSKU);
                SKUScmd.Parameters.AddWithValue("@SBFList", tblTopSKU);
                SKUScmd.CommandTimeout = 0;
                SqlDataAdapter SKUSdap = new SqlDataAdapter(SKUScmd);
                DataSet DsSKU = new DataSet();
                SKUSdap.Fill(DsSKU);
                SKUScmd.Dispose();
                SKUSdap.Dispose();

                if(DsSKU.Tables[0].Rows[0][0].ToString() == "2")
                    flgTopSKU = 2;
            }

            if (flgTopSKU == 1)
            {
                SqlCommand Scmd = new SqlCommand();
                Scmd.Connection = Scon;
                Scmd.CommandText = "spFBManageFB_TopUp_New";
                Scmd.CommandType = CommandType.StoredProcedure;
                Scmd.Parameters.AddWithValue("@FBID", INITID);
                Scmd.Parameters.AddWithValue("@FBName", Utilities.XSSHandling(INITName));
                Scmd.Parameters.AddWithValue("@FBDescription", Utilities.XSSHandling(INITDescription));
                Scmd.Parameters.AddWithValue("@FromDate", FromDate);
                Scmd.Parameters.AddWithValue("@ToDate", ToDate);
                Scmd.Parameters.AddWithValue("@Buckets", tblBucket);
                Scmd.Parameters.AddWithValue("@BucketValues", tbl);
                Scmd.Parameters.AddWithValue("@LoginID", LoginID);
                Scmd.Parameters.AddWithValue("@strLocation", Utilities.XSSHandling(strLocation));
                Scmd.Parameters.AddWithValue("@strChannel", Utilities.XSSHandling(strChannel));
                Scmd.Parameters.AddWithValue("@flgIncludeSubD", IncudeSubD);
                Scmd.Parameters.AddWithValue("@FBShortDescr ", Utilities.XSSHandling(FBShortDescr));
                Scmd.Parameters.AddWithValue("@flgIncludeLeap", IncudeLeap);
                Scmd.Parameters.AddWithValue("@FBPrd", tblProd);
                Scmd.Parameters.AddWithValue("@UserID", UserID);
                Scmd.Parameters.AddWithValue("@flgSaveSubmit", flgSave);   //1: Existing, 2: Add new
                Scmd.Parameters.AddWithValue("@Clusters", tblClusterDetails);
                Scmd.Parameters.AddWithValue("@topSKU", tblTopSKU);
                Scmd.Parameters.AddWithValue("@SectorIDs", dtSector);
                Scmd.Parameters.AddWithValue("@flgOverwrite", flgOverwrite);
                Scmd.CommandTimeout = 0;
                SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
                DataSet Ds = new DataSet();
                Sdap.Fill(Ds);
                Scmd.Dispose();
                Sdap.Dispose();

                if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) > -1)
                {
                    return "0|^|";
                }
                else if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -1)
                {
                    return "1|^|";
                }
                else if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -3)
                {
                    return "3|^|";
                }
                else if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -4)
                {
                    return "4|^|" + fnWarningSBFInBase(Ds.Tables[1]);
                }
                else
                {
                    return "2|^|";
                }
            }
            else
                return "5|^|";
        }
        catch (Exception e)
        {
            return "2|^|" + e.Message;
        }
    }
    public static string fnWarningSBFInBase(DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<div style='font-size: 0.8rem;'>");
        sb.Append("<span style='font-weight: 500; font-size: 0.9rem;'>Following SBF is already defined in Base Norm(s).<br/>Do you still want to continue ? </span>");

        sb.Append("<ul style='padding-top: 5px;'>");
        for(int i=0; i < dt.Rows.Count; i++)
        {
            sb.Append("<li style='color: #00486a;'>" + dt.Rows[i][0].ToString() + "</li>");
        }
        sb.Append("</ul>");
        sb.Append("</div>");

        return sb.ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string fnDeleteInitiative(string INITID, string UserID)
    {
        try
        {
            DataSet Ds;
            SqlCommand Scmd;
            SqlDataAdapter Sdap;
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());

            for (int i = 0; i < INITID.Split('^').Length; i++)
            {
                Scmd = new SqlCommand();
                Scmd.Connection = Scon;
                Scmd.CommandText = "spFBDelete_TopUp_New";
                Scmd.Parameters.AddWithValue("@FBID", INITID.Split('^')[i]);
                Scmd.Parameters.AddWithValue("@USerID", UserID);
                Scmd.CommandType = CommandType.StoredProcedure;
                Scmd.CommandTimeout = 0;
                Sdap = new SqlDataAdapter(Scmd);
                Ds = new DataSet();
                Sdap.Fill(Ds);
                Scmd.Dispose();
                Sdap.Dispose();
                Ds.Dispose();
            }

            return "0";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnSaveFinalAction(string RoleID, string LoginID, string UserID, object objINIT)
    {
        try
        {
            string strINIT = JsonConvert.SerializeObject(objINIT, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblINIT = JsonConvert.DeserializeObject<DataTable>(strINIT);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBSaveSubmitFB_TopUp_New";
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@FBLIST", tblINIT);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }


    [System.Web.Services.WebMethod()]
    public static string GetSKUList(object obj)
    {
        try
        {
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tbl = JsonConvert.DeserializeObject<DataTable>(str);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spSBDGetSBFList";
            Scmd.Parameters.AddWithValue("@PrdList", tbl);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0|^|" + GetSKUTbl(Ds.Tables[0]);
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string GetSKUTbl(DataTable dt)
    {
        string[] SkipColumn = new string[2];
        SkipColumn[0] = "SBFNodeID";
        SkipColumn[1] = "SBFNodeType";

        StringBuilder sb = new StringBuilder();
        sb.Append("<table class='table table-bordered table-sm table-hover'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th colspan='" + ((dt.Columns.Count - SkipColumn.Length) + 1) + "'>");
        sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnSKUtypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
        sb.Append("</th>");
        sb.Append("</tr>");

        sb.Append("<tr>");
        sb.Append("<th style='width: 30px;'></th>");
        sb.Append("<th style='display: none;'>SearchString</th>");
        for (int j = 0; j < dt.Columns.Count; j++)
        {
            if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
            {
                sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");
            }
        }
        sb.Append("</tr>");

        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sb.Append("<tr onclick='fnSelectUnSelectSKU(this);' flg='0' flgVisible='1' nid='" + dt.Rows[i]["SBFNodeID"] + "' ntype='" + dt.Rows[i]["SBFNodeType"] + "'>");
            sb.Append("<td><img src='../../Images/checkbox-unchecked.png'/></td>");

            sb.Append("<td style='display: none;'>" + dt.Rows[i]["Category"] + " " + dt.Rows[i]["Brand"] + " " + dt.Rows[i]["BrandForm"] + " " + dt.Rows[i]["SBF"] + "</td>");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                {
                    sb.Append("<td class='clss-" + j + "'>" + dt.Rows[i][j] + "</td>");
                }
            }
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }


    protected void btnDownload_Click(object sender, EventArgs e)
    {
        DataTable tblLoc = new DataTable();
        //string strBucket = JsonConvert.SerializeObject(arr, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        tblLoc = JsonConvert.DeserializeObject<DataTable>(hdnjsonarr.Value);
        if (tblLoc.Rows[0][0].ToString() == "0")
            tblLoc.Rows.RemoveAt(0);

        DataSet ds = new DataSet();
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spFBExtractSelected_TopUp_New]";
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        //Scmd.Parameters.AddWithValue("@MonthVal", hdnmonthyearexcel.Value.ToString().Split('^')[0]);
        //Scmd.Parameters.AddWithValue("@YearVal", hdnmonthyearexcel.Value.ToString().Split('^')[1]);
        //Scmd.Parameters.AddWithValue("@LoginID", Session["LoginID"].ToString());
        //Scmd.Parameters.AddWithValue("@UserID", Session["UserID"].ToString());
        //Scmd.Parameters.AddWithValue("@RoleID", Session["RoleId"].ToString());
        Scmd.Parameters.AddWithValue("@FBIDs", tblLoc);
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        Sdap.Fill(ds);


        string filename = "Focus Brand Report for " + hdnmonthyearexceltext.Value + " downloaded at " + DateTime.Now.ToString("dd-MMM-yyyy hh:mm tt");
        string[] SkipColumn = new string[0];
        //SkipColumn[0] = "flgStatus";

        XLWorkbook wb = new XLWorkbook();
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            wb = AddWorkSheet(wb, ds.Tables[i + 1], SkipColumn, ds.Tables[0].Rows[i]["SheetName"].ToString(), i);

        try
        {
            //Export the Excel file.
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Buffer = true;
            HttpContext.Current.Response.Charset = "";
            HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=" + filename + ".xlsx");
            using (MemoryStream MyMemoryStream = new MemoryStream())
            {
                wb.SaveAs(MyMemoryStream);
                MyMemoryStream.WriteTo(HttpContext.Current.Response.OutputStream);
                HttpContext.Current.Response.Flush();
                HttpContext.Current.Response.End();
            }
        }
        catch (Exception ex)
        {
            //
        }
    }
    private static XLWorkbook AddWorkSheet(XLWorkbook wb, DataTable dt, string[] SkipColumn, string Sheetname, int cntr)
    {
        IXLCell cellStart;
        IXLCell cellEnd;
        int k = 0, j = 0, trCntr = 0;
        var ws = wb.Worksheets.Add(Sheetname);

        //-----------Header------------------------
        k++;
        int FreezeRows = k;
        cellStart = ws.Cell(k, j + 1);
        for (int c = 0; c < dt.Columns.Count; c++)
        {
            if (!SkipColumn.Contains(dt.Columns[c].ColumnName.ToString().Trim()))
            {
                j++;
                ws.Cell(k, j).Value = dt.Columns[c].ColumnName.ToString();
                ws.Cell(k, j).Style.Alignment.WrapText = true;
                ws.Cell(k, j).Style.Fill.BackgroundColor = XLColor.FromHtml("#728cd4");
                ws.Cell(k, j).Style.Font.FontColor = XLColor.FromHtml("#ffffff");
                ws.Cell(k, j).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
            }
        }

        //------------Body---------------------------
        trCntr = k;
        for (int b = 0; b < dt.Rows.Count; b++)
        {
            k++; j = 0;
            for (int c = 0; c < dt.Columns.Count; c++)
            {
                if (!SkipColumn.Contains(dt.Columns[c].ColumnName.ToString().Trim()))
                {
                    j++;
                    ws.Cell(k, j).Style.Alignment.WrapText = true;
                    ws.Cell(k, j).Value = dt.Rows[b][c].ToString().Split('^')[0].Replace("amp;", "");
                    if (dt.Rows[b][c].ToString().Split('^').Length > 1)
                    {                        
                        ws.Cell(k, j).Style.Fill.BackgroundColor = XLColor.FromHtml("#" + dt.Rows[b][c].ToString().Split('^')[1]);
                    }
                }
            }
        }
        cellEnd = ws.Cell(k, j);

        ws.Range(cellStart, cellEnd).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
        ws.Range(cellStart, cellEnd).Style.Alignment.SetVertical(XLAlignmentVerticalValues.Center);
        ws.Range(cellStart, cellEnd).Style.Border.SetInsideBorder(XLBorderStyleValues.Thin);
        ws.Range(cellStart, cellEnd).Style.Border.SetOutsideBorder(XLBorderStyleValues.Medium);
        ws.Range(cellStart, cellEnd).Style.Font.SetFontSize(10);
        ws.SheetView.FreezeRows(FreezeRows);
        ws.Columns().Width = 15;

        if (cntr == 0)
        {
            ws.Column(1).Width = 18;
            ws.Column(2).Width = 18;
            ws.Column(3).Width = 26;
            ws.Column(5).Width = 40;
            ws.Column(7).Width = 54;
            ws.Column(12).Width = 30;
            ws.Column(3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
            ws.Column(5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
            ws.Column(7).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
            ws.Column(12).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
            ws.Row(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }
        else
        {
            ws.Column(2).Width = 18;
            ws.Column(3).Width = 25;
            ws.Column(3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
        }

        //ws.Rows().AdjustToContents();
        //ws.Columns().AdjustToContents();

        return wb;
    }
}