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

public partial class _BucketMstr : System.Web.UI.Page
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
                hdnLoginID.Value = Session["LoginID"].ToString();
                hdnUserID.Value = Session["UserID"].ToString();
                hdnRoleID.Value = Session["RoleId"].ToString();
                hdnNodeID.Value = Session["NodeId"].ToString();
                hdnNodeType.Value = Session["NodeType"].ToString();

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "18"))
                    GetMaster();
                else
                    Response.Redirect("~/frmLogin.aspx");
            }
        }
    }
    private void GetMaster()
    {
        hdnProductLvl.Value = "<div class='producthrchy'>Product Level</div>" + Utilities.GetHierLvl("1", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "18");

        hdnLocationLvl.Value = "<div class='producthrchy'>Location Level</div>" + Utilities.GetHierLvl("2", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "18");

        hdnChannelLvl.Value = "<div class='producthrchy'>Channel Level</div>" + Utilities.GetHierLvl("3", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "18");


        StringBuilder sbMstr = new StringBuilder();
        StringBuilder sbSelectedstr = new StringBuilder();

        //------- MRAccount
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spINITGetMRAccountsList ";
        Scmd.Parameters.AddWithValue("@RoleID", hdnRoleID.Value);
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@UserID", hdnUserID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        hdnMRAccount.Value = JsonConvert.SerializeObject(Ds.Tables[0], Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });

        //------- Masters -----------------------------------
        Ds.Clear();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spINITGetINITMatser]";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@UserID", hdnUserID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        //------- Months
        sbMstr.Clear();
        sbSelectedstr.Clear();
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["Start Date"].ToString() + "|" + Ds.Tables[0].Rows[i]["End Date"].ToString() + "'>" + Ds.Tables[0].Rows[i]["Month"].ToString() + "</option>");
            if (Ds.Tables[0].Rows[i]["flgSelect"].ToString() == "1")
                sbSelectedstr.Append(Ds.Tables[0].Rows[i]["Start Date"].ToString() + "|" + Ds.Tables[0].Rows[i]["End Date"].ToString());
        }
        hdnMonths.Value = sbMstr.ToString() + "^" + sbSelectedstr.ToString();

        //------- Disburshment Type
        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[1].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[1].Rows[i]["DisburshmentTypeID"].ToString() + "'>" + Ds.Tables[1].Rows[i]["DisburshmentType"].ToString() + "</option>");
        }
        hdnDisburshmentType.Value = sbMstr.ToString();

        //------- Multiplication Type
        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[2].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[2].Rows[i]["MultiplicationTypeID"].ToString() + "'>" + Ds.Tables[2].Rows[i]["MultiplicationType"].ToString() + "</option>");
        }
        hdnMultiplicationType.Value = sbMstr.ToString();

        //------- Init Type
        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[3].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[3].Rows[i]["INITTypeID"].ToString() + "' uom='" + Ds.Tables[3].Rows[i]["INITUOMID"].ToString() + "'>" + Ds.Tables[3].Rows[i]["INITType"].ToString() + "</option>");
        }
        hdnUnitType.Value = sbMstr.ToString();

        //------- UOM 
        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[4].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[4].Rows[i]["INITIOMID"].ToString() + "'>" + Ds.Tables[4].Rows[i]["INITUOM"].ToString() + "</option>");
        }
        hdnUOM.Value = sbMstr.ToString();

        //------- Benefit 
        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[5].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[5].Rows[i]["INITBenefitID"].ToString() + "'>" + Ds.Tables[5].Rows[i]["INITBenefit"].ToString() + "</option>");
        }
        hdnBenefit.Value = sbMstr.ToString();

        //------- Applied On
        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[6].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[6].Rows[i]["INITAppliedOnID"].ToString() + "'>" + Ds.Tables[6].Rows[i]["INITAppliedOn"].ToString() + "</option>");
        }
        hdnAppliedOn.Value = sbMstr.ToString();

        //------- Incentive Type
        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[7].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[7].Rows[i]["IncentiveTypeID"].ToString() + "'>" + Ds.Tables[7].Rows[i]["IncentiveType"].ToString() + "</option>");
        }
        hdnIncentiveType.Value = sbMstr.ToString();

        //------- INIT Type
        sbMstr.Clear();
        sbSelectedstr.Clear();
        sbSelectedstr.Append("0");
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[8].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[8].Rows[i]["INITTypeID"].ToString() + "'>" + Ds.Tables[8].Rows[i]["INITTYPE"].ToString() + "</option>");
            if(Ds.Tables[8].Rows[i]["flgSelected"].ToString() == "1")
            {
                sbSelectedstr.Clear();
                sbSelectedstr.Append(Ds.Tables[8].Rows[i]["INITTypeID"].ToString());
            }
        }
        hdnINITType.Value = sbMstr.ToString() + "^" + sbSelectedstr.ToString();

        //------- COH Type
        sbMstr.Clear();
        sbSelectedstr.Clear();
        sbSelectedstr.Append("0");
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[9].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[9].Rows[i]["COHID"].ToString() + "'>" + Ds.Tables[9].Rows[i]["COHName"].ToString() + "</option>");
            if (Ds.Tables[9].Rows[i]["flgSelected"].ToString() == "1")
            {
                sbSelectedstr.Clear();
                sbSelectedstr.Append(Ds.Tables[9].Rows[i]["COHID"].ToString());
            }
        }
        hdnCOHType.Value = sbMstr.ToString() + "^" + sbSelectedstr.ToString();


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
            if (flg == "1")
            {
                DataTable tbl = new DataTable();
                string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
                tbl = JsonConvert.DeserializeObject<DataTable>(str);
                if (tbl.Rows.Count > 0)
                {
                    return "0|^|" + Utilities.GetHierDetail("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "18") + "|^|" + Utilities.GetSelectedHierDetail("1", obj, "18");
                }
                else
                    return "0|^|" + Utilities.GetHierDetail("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "18") + "|^|";
            }
            else if (flg == "3")
                return "0|^|" + Utilities.GetHierTblAtSpecificLvl("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "18");
            else
                return "0|^|" + Utilities.GetParentHierForNewChild("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "18");
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
                return "0|^|" + Utilities.GetHierDetail("2", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "18") + "|^|" + Utilities.GetSelectedHierDetail("2", obj, "18");
            }
            else
                return "0|^|" + Utilities.GetHierDetail("2", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "18") + "|^|";
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
                return "0|^|" + Utilities.GetHierDetail("3", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "18") + "|^|" + Utilities.GetSelectedHierDetail("3", obj, "18");
            }
            else
                return "0|^|" + Utilities.GetHierDetail("3", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "18") + "|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }


    [System.Web.Services.WebMethod()]
    public static string GetSelHierTbl(object obj, string BucketType, string InSubD)
    {
        return Utilities.GetSelectedHierDetail(BucketType, obj, "18");
    }
    [System.Web.Services.WebMethod()]
    public static string GetBucketbasedonType(string LoginID, string RoleID, string UserID, string BucketType)
    {
        return Utilities.GetBucketDetailsbasedonType(BucketType, LoginID, UserID, RoleID, "", "", false, "18");
    }
    [System.Web.Services.WebMethod()]
    public static string fnSaveAsNewBucket(string BucketName, string BucketDescr, string BucketType, object obj, string LoginID, string PrdLvl, string PrdString)
    {
        DataTable tbl = new DataTable();
        try
        {
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);

            StringBuilder sb = new StringBuilder();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spBucketSaveBucket";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.Parameters.AddWithValue("@BucketID", "0");
            Scmd.Parameters.AddWithValue("@BucketName", Utilities.XSSHandling(BucketName));
            Scmd.Parameters.AddWithValue("@BucketDescr", Utilities.XSSHandling(BucketDescr));
            Scmd.Parameters.AddWithValue("@flgActive", "1");
            Scmd.Parameters.AddWithValue("@BucketTypeID", BucketType);
            Scmd.Parameters.AddWithValue("@BucketValues", tbl);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@PrdLvl", PrdLvl);
            //Scmd.Parameters.AddWithValue("@PrdString", Utilities.XSSHandling(PrdString));
            Scmd.Parameters.AddWithValue("@flgIncludeSubD", "0");
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) > -1)
            {
                return "0|^|" + Ds.Tables[0].Rows[0][0];
            }
            else if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -1)
            {
                return "1|^|";
            }
            else
            {
                return "2|^|";
            }
        }
        catch (Exception e)
        {
            return "2|^|" + e.Message;
        }
    }




    [System.Web.Services.WebMethod()]
    public static string fnGetReport(string LoginID, string RoleID, string UserID, string FromDate, string ToDate, object objProd, object objLoc, object objChannel, string ProcessGroup, object objUser)
    {
        //try
        //{
            StringBuilder sbTimeChecker = new StringBuilder();
            string strUser = JsonConvert.SerializeObject(objUser, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable dtUser = JsonConvert.DeserializeObject<DataTable>(strUser);
            if (dtUser.Rows[0][0].ToString() == "0")
                dtUser.Rows.RemoveAt(0);

            sbTimeChecker.Append("SP Caliing Start : " + DateTime.Now.ToLongTimeString());
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
            {
                IsNewAdditionAllowed = "1";
            }
            Ds.Dispose();

            DataTable tblProd = new DataTable();
            string str = JsonConvert.SerializeObject(objProd, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblProd = JsonConvert.DeserializeObject<DataTable>(str);
            if (tblProd.Rows[0][0].ToString() == "0")
            {
                tblProd.Rows.RemoveAt(0);
            }

            DataTable tblLoc = new DataTable();
            string strLoc = JsonConvert.SerializeObject(objLoc, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblLoc = JsonConvert.DeserializeObject<DataTable>(strLoc);
            if (tblLoc.Rows[0][0].ToString() == "0")
            {
                tblLoc.Rows.RemoveAt(0);
            }

            DataTable tblChannel = new DataTable();
            string strChannel = JsonConvert.SerializeObject(objChannel, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblChannel = JsonConvert.DeserializeObject<DataTable>(strChannel);
            if (tblChannel.Rows[0][0].ToString() == "0")
            {
                tblChannel.Rows.RemoveAt(0);
            }

            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spINITGetInitiativeInfo";
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
            Scmd.Parameters.AddWithValue("@LocSelection", tblLoc);
            Scmd.Parameters.AddWithValue("@ChannelSelection", tblChannel);
            Scmd.Parameters.AddWithValue("@FromDate", FromDate);
            Scmd.Parameters.AddWithValue("@EndDate", ToDate);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@Users", dtUser);
            if (ProcessGroup != "")
            {
                Scmd.Parameters.AddWithValue("@ProcessGroup", ProcessGroup);
            }
            Scmd.Parameters.AddWithValue("@flgMR", "0");
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            Sdap = new SqlDataAdapter(Scmd);
            Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            sbTimeChecker.Append("<br/>SP Caliing End : " + DateTime.Now.ToLongTimeString());
            return "0|^|" + CreateInitiativeMstrTbl(RoleID, Ds, "tblReport", "clsReport", IsNewAdditionAllowed) + "|^|" + CreateButtons(Ds.Tables[3]) + "|^|" + IsNewAdditionAllowed + "|^|" + CreateLegends(Ds.Tables[4]) + "|^|" + sbTimeChecker.ToString() + "<br/>HTML Format Created : " + DateTime.Now.ToLongTimeString();
        //}
        //catch (Exception ex)
        //{
        //    return "1|^|" + ex.Message;
        //}
    }
    private static string CreateInitiativeMstrTbl(string RoleID, DataSet Ds, string tblname, string cls, string IsNewAdditionAllowed)
    {        
        string[] SkipColumn = new string[22];
        SkipColumn[0] = "INITID";
        SkipColumn[1] = "AllLocation";
        SkipColumn[2] = "AllChannel";
        SkipColumn[3] = "LocStrValue";
        SkipColumn[4] = "ChannelStrValue";
        SkipColumn[5] = "FromDate";
        SkipColumn[6] = "flgIncludeSubD";
        SkipColumn[7] = "Name";
        SkipColumn[8] = "INITShortDescr";
        SkipColumn[9] = "DisburshmentTypeID";
        SkipColumn[10] = "MultiplicationTypeID";
        SkipColumn[11] = "Include SubD";
        SkipColumn[12] = "flgEdit";
        SkipColumn[13] = "flgRejectComment";
        SkipColumn[14] = "colorcode";
        SkipColumn[15] = "Applicable_Per";
        SkipColumn[16] = "flgBookmark";
        SkipColumn[17] = "flgCheckBox";
        SkipColumn[18] = "flgSettle";
        SkipColumn[19] = "IncentiveTypeId";
        SkipColumn[20] = "INITTypeID";
        SkipColumn[21] = "COHID";

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        StringBuilder sbLoc = new StringBuilder();
        StringBuilder sbChannel = new StringBuilder();
        StringBuilder sbInitAppRule = new StringBuilder();
        sb.Append("<table id='" + tblname + "' class='table table-striped table-bordered table-sm " + cls + "' IsSchemeAppRule='1' IsLocExpand='1' IsChannelExpand='1'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th rowspan='2'><input type='checkbox' onclick='fnChkUnchkInitAll(this);'/></th>");
        sb.Append("<th rowspan='2'><img src='../../Images/bookmark-inactive.png' iden='Bookmark' title='Bookmark' flgBookmark='0' onclick='fnManageBookMarkAll(this);'/></th>");
        sb.Append("<th rowspan='2'>Action</th>");
        for (int j = 0; j < dt.Columns.Count; j++)
        {
            if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
            {
                if (dt.Columns[j].ColumnName.ToString().Trim() == "Code")
                {
                    if (RoleID != "3" && RoleID != "1015")
                        sb.Append("<th rowspan='2'>Recm. Trade Plan<br/>Short Details</th>");
                    else
                        sb.Append("<th rowspan='2'>Recm. Trade Plan</th>");
                }
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Description")
                    sb.Append("<th rowspan='2'>Details</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "ChannelSummaryDescr")
                    sb.Append("<th rowspan='2'>Channel Summary Description</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "ToDate")
                    sb.Append("<th rowspan='2'>Time Period</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Include Leap")
                    sb.Append("<th rowspan='2'>Include Leap/SubD</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Disburshment Limit Amount")
                    sb.Append("<th colspan='2'>Disb. Limit</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Disburshment Limit Count")
                    sb.Append("");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Initiatives Application Rules")
                    sb.Append("<th rowspan='2'><i iden='btnAppRuleExpandCollapse' class='fa fa-minus-square clsExpandCollapse' onclick='fnCollapseContent(1);'></i><span>Initiatives Application Rules</span></th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Location")
                    sb.Append("<th rowspan='2'><i iden='btnlocExpandCollapse' class='fa fa-minus-square clsExpandCollapse' onclick='fnCollapseContent(2);'></i><span>Location</span></th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Channel")
                    sb.Append("<th rowspan='2'><i iden='btnChannelExpandCollapse' class='fa fa-minus-square clsExpandCollapse' onclick='fnCollapseContent(3);'></i><span>Channel</span></th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "flgMixedCases")
                    sb.Append("<th rowspan='2'>Is Mixed Cases</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "strSearch")
                    sb.Append("<th rowspan='2' style='display: none;'>strSearch</th>");
                else
                    sb.Append("<th rowspan='2'>" + dt.Columns[j].ColumnName.ToString() + "</th>");
            }
        }
        sb.Append("</tr>");
        sb.Append("<tr>");
        sb.Append("<th>Amount</th><th>Count</th>");
        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        if (dt.Rows.Count > 0)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                sbLoc.Clear();
                sbChannel.Clear();
                sbInitAppRule.Clear();
                sbLoc.Append(InitChannelLocStr(dt.Rows[i]["INITID"].ToString(), "2", Ds.Tables[7], Ds.Tables[8]));
                sbChannel.Append(InitChannelLocStr(dt.Rows[i]["INITID"].ToString(), "3", Ds.Tables[6], Ds.Tables[8]));
                sbInitAppRule.Append(InitAppRules(dt.Rows[i]["INITID"].ToString(), Ds.Tables[1], Ds.Tables[2]));

                sb.Append("<tr Init='" + dt.Rows[i]["INITID"] + "' INITCode='" + dt.Rows[i]["Code"] + "' INITName='" + dt.Rows[i]["Name"] + "' ShortDescr='" + dt.Rows[i]["INITShortDescr"].ToString() + "' Descr='" + dt.Rows[i]["Description"].ToString() + "' ChannelSummaryDescr='" + dt.Rows[i]["ChannelSummaryDescr"].ToString() + "' lmlAmt='" + dt.Rows[i]["Disburshment Limit Amount"] + "' lmlCntr='" + dt.Rows[i]["Disburshment Limit Count"] + "' FromDate='" + dt.Rows[i]["FromDate"] + "' ToDate='" + dt.Rows[i]["ToDate"] + "' loc='" + sbLoc.ToString().Split('~')[2] + "' locStr='" + sbLoc.ToString().Split('~')[1] + "' channel='" + sbChannel.ToString().Split('~')[2] + "' channelStr='" + sbChannel.ToString().Split('~')[1] + "' InSubD='1' Distribution='" + dt.Rows[i]["DisburshmentTypeID"] + "^" + dt.Rows[i]["Method of Disb."] + "' Multiplication='" + dt.Rows[i]["MultiplicationTypeID"] + "^" + dt.Rows[i]["Multiplication Type"] + "' IncludeSubD='" + dt.Rows[i]["Include SubD"] + "' IncludeLeap='" + dt.Rows[i]["Include Leap"] + "' MixedCases='" + dt.Rows[i]["flgMixedCases"] + "' BaseProd='" + sbInitAppRule.ToString().Split('~')[1] + "' InitProd='" + sbInitAppRule.ToString().Split('~')[2] + "' flgRejectComment='" + dt.Rows[i]["flgRejectComment"].ToString() + "' ApplicablePer='" + dt.Rows[i]["Applicable_Per"].ToString() + "' ApplicableNewPer='" + dt.Rows[i]["Applicable_Per"].ToString() + "' IncentiveType='" + dt.Rows[i]["IncentiveTypeId"] + "^" + dt.Rows[i]["Type of Incentive"] + "' InitType='" + (dt.Rows[i]["INITTypeID"].ToString() == "" ? "0" : dt.Rows[i]["INITTypeID"].ToString()) + "^" + dt.Rows[i]["INITTYPE"] + "' COHType='" + (dt.Rows[i]["COHID"].ToString() == "" ? "0" : dt.Rows[i]["COHID"].ToString()) + "^" + dt.Rows[i]["COH"] + "' flgDBEdit='" + dt.Rows[i]["flgEdit"].ToString() + "' flgCheckBox='" + dt.Rows[i]["flgCheckBox"].ToString() + "' flgBookmark='" + dt.Rows[i]["flgBookmark"].ToString() + "' flgSettle='" + dt.Rows[i]["flgSettle"].ToString() + "' flgVisible='1' flgEdit='0' iden='Init' style='display: table-row;'>");

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
                    sb.Append("<img src='../../Images/copy.png' iden='CopyInit' title='Copy Initiative' onclick='fnEditCopy(this, 2);'/>");
                if (dt.Rows[i]["flgEdit"].ToString() == "1")
                {
                    sb.Append("<img src='../../Images/edit.png' iden='EditInit' title='Edit Initiative' onclick='fnEditCopy(this, 1);'/>");
                    sb.Append("<img src='../../Images/delete.png' iden='DeleteInit' title='Delete Initiative' onclick='fnDelete(this);'/>");
                }
                if (dt.Rows[i]["flgSettle"].ToString() == "1")
                    sb.Append("<img src='../../Images/settle.png' iden='SettleInit' title='Settle Initiative' onclick='fnSettle(this);'/>");
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
                                sb.Append("<td iden='Init' style='font-size: 0.7rem;'>" + (dt.Rows[i]["Name"].ToString().Length > 17 ? "<span title='" + dt.Rows[i]["Name"].ToString() + "' class='clsInform'>" + dt.Rows[i]["Name"].ToString().Substring(0, 15) + "..</span>" : dt.Rows[i]["Name"].ToString()) + "<br/>" + (dt.Rows[i]["INITShortDescr"].ToString().Length > 17 ? "<span title='" + dt.Rows[i]["INITShortDescr"].ToString() + "' class='clsInform'>" + dt.Rows[i]["INITShortDescr"].ToString().Substring(0, 15) + "..</span>" : dt.Rows[i]["INITShortDescr"].ToString()) + "</td>");
                            }
                            else
                                sb.Append("<td iden='Init' style='font-size: 0.7rem;'>" + (dt.Rows[i]["Name"].ToString().Length > 17 ? "<span title='" + dt.Rows[i]["Name"].ToString() + "' class='clsInform'>" + dt.Rows[i]["Name"].ToString().Substring(0, 15) + "..</span>" : dt.Rows[i]["Name"].ToString()) + "</td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Description" || dt.Columns[j].ColumnName.ToString() == "ChannelSummaryDescr")
                        {
                            sb.Append("<td iden='Init' style='font-size: 0.7rem;'>" + (dt.Rows[i][j].ToString().Length > 50 ? "<span title='" + dt.Rows[i][j].ToString() + "' class='clsInform'>" + dt.Rows[i][j].ToString().Substring(0, 48) + "..</span>" : dt.Rows[i][j].ToString()) + "</td>");
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
                        else if (dt.Columns[j].ColumnName.ToString() == "Initiatives Application Rules")
                        {
                            if (sbInitAppRule.ToString().Split('~')[1] == "")
                                sb.Append("<td iden='Init'><div style='width: 120px; min-width: 120px; text-align: center;'><a href='#' class='btn btn-danger btn-small' style='cursor: default;'>No Rule Defined</a><div></td>");
                            else
                                sb.Append("<td iden='Init'><div style='width: 120px; min-width: 120px; text-align: center;'><a href='#' class='btn btn-primary btn-small' onclick='fnShowApplicationRules(this, 0);'>View Details</a><div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Location")
                        {
                            sb.Append("<td iden='Init'><div style='width: 202px; min-width: 202px; font-size:0.6rem;'>" + (sbLoc.ToString().Split('~')[2].Length > 70 ? "<span title='" + sbLoc.ToString().Split('~')[2] + "' class='clsInform'>" + sbLoc.ToString().Split('~')[2].Substring(0, 68) + "..</span>" : sbLoc.ToString().Split('~')[2]) + "</div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Channel")
                        {
                            sb.Append("<td iden='Init'><div style='width: 202px; min-width: 202px; font-size:0.6rem;'>" + (sbChannel.ToString().Split('~')[2].Length > 70 ? "<span title='" + sbChannel.ToString().Split('~')[2] + "' class='clsInform'>" + sbChannel.ToString().Split('~')[2].Substring(0, 68) + "..</span>" : sbChannel.ToString().Split('~')[2]) + "</div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "flgMixedCases")
                        {
                            if (dt.Rows[i][j].ToString() == "1")
                                sb.Append("<td iden='Init'>Yes</td>");
                            else
                                sb.Append("<td iden='Init'>No</td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "strSearch")
                            sb.Append("<td iden='Init' iden_td='search' style='display: none;'>" + dt.Rows[i][j].ToString() + "</td>");
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
                    else if (dt.Columns[j].ColumnName.ToString() == "Description" || dt.Columns[j].ColumnName.ToString() == "ChannelSummaryDescr")
                    {
                        sb.Append("<td iden='Init' style='font-size: 0.7rem;'></td>");
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Initiatives Application Rules")
                    {
                        sb.Append("<td iden='Init'><div style='width: 120px; min-width: 120px; text-align: center;'><div></td>");
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Location")
                    {
                        sb.Append("<td iden='Init'><div style='width: 202px; min-width: 202px; font-size:0.6rem;'></div></td>");
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Channel")
                    {
                        sb.Append("<td iden='Init'><div style='width: 202px; min-width: 202px; font-size:0.6rem;'></div></td>");
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
    private static string InitChannelLocStr(string InitId, string buckettype, DataTable dt, DataTable dtbucket)
    {
        StringBuilder sb = new StringBuilder();
        StringBuilder sbdescr = new StringBuilder();

        DataRow[] dr = dt.Select("INITID=" + InitId);
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

                sb.Append(dttemp.Rows[k]["NodeID"].ToString() + "|" + dttemp.Rows[k]["NodeType"].ToString() + "|" + dttemp.Rows[k]["Descr"].ToString());
                sbdescr.Append(dttemp.Rows[k]["Descr"].ToString());
            }
        }


        sb.Append("|||" + InitChannelLocBucketStr(InitId, buckettype, dtbucket));

        return "0" + "~" + sb.ToString() + "~" + sbdescr.ToString();
    }
    private static string InitChannelLocBucketStr(string InitId, string buckettype, DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        DataRow[] dr = dt.Select("INITID=" + InitId + " And BucketTypeID=" + buckettype);
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
    private static string InitAppRules(string InitID, DataTable dtBase, DataTable dtInit)
    {
        StringBuilder sbBase = new StringBuilder();
        StringBuilder sbInit = new StringBuilder();

        DataRow[] drInitiativeBase = dtBase.Select("INITID=" + InitID);
        if (drInitiativeBase.Length > 0)
        {
            DataTable dtInitiativeBase = drInitiativeBase.CopyToDataTable();
            DataTable dtDistinctSlab = dtInitiativeBase.DefaultView.ToTable(true, "SlabNo");
            for (int i = 0; i < dtDistinctSlab.Rows.Count; i++)
            {
                sbBase.Append("$$$" + dtDistinctSlab.Rows[i]["SlabNo"].ToString());

                DataTable dtSlab = dtInitiativeBase.Select("SlabNo=" + dtDistinctSlab.Rows[i]["SlabNo"].ToString()).CopyToDataTable();
                DataTable dtDistinctGrp = dtSlab.DefaultView.ToTable(true, "INITSlabBasePrdGroupID");
                for (int j = 0; j < dtDistinctGrp.Rows.Count; j++)
                {
                    sbBase.Append("***");
                    DataTable dtGrp = dtSlab.Select("INITSlabBasePrdGroupID=" + dtDistinctGrp.Rows[j]["INITSlabBasePrdGroupID"].ToString()).CopyToDataTable();
                    sbBase.Append(dtGrp.Rows[0]["INITTypeID"].ToString() + "*$*" + dtGrp.Rows[0]["MinValue"].ToString() + "*$*" + dtGrp.Rows[0]["maxValue"].ToString() + "*$*" + dtGrp.Rows[0]["INITIOMID"].ToString() + "*$*");
                    for (int k = 0; k < dtGrp.Rows.Count; k++)
                    {
                        if (k != 0)
                        {
                            sbBase.Append("^");
                        }
                        sbBase.Append(dtGrp.Rows[k]["NodeID"].ToString() + "|" + dtGrp.Rows[k]["NodeType"].ToString() + "|" + dtGrp.Rows[k]["Descr"].ToString());
                    }
                    sbBase.Append("*$*" + dtDistinctGrp.Rows[j]["INITSlabBasePrdGroupID"].ToString());
                    DataTable dtDistinctBucketID = dtGrp.DefaultView.ToTable(true, "BucketID");
                    for (int m = 0; m < dtDistinctBucketID.Rows.Count; m++)
                    {
                        if (m == 0)
                        {
                            sbBase.Append("*$*");
                        }
                        else
                        {
                            sbBase.Append("|");
                        }
                        sbBase.Append(dtDistinctBucketID.Rows[m]["BucketID"].ToString());
                    }
                    sbBase.Append("*$*0");      // IsNewSlab
                    sbBase.Append("*$*0");      // IsNewGrp
                }
            }
        }

        //------------------
        DataRow[] drInitiativeInit = dtInit.Select("INITID=" + InitID);
        if (drInitiativeInit.Length > 0)
        {
            DataTable dtInitiativeInit = drInitiativeInit.CopyToDataTable();
            DataTable dtDistinctGrp = dtInitiativeInit.DefaultView.ToTable(true, "INITSlabBanefitPrdGroupID");

            for (int j = 0; j < dtDistinctGrp.Rows.Count; j++)
            {
                sbInit.Append("***");
                DataTable dtGrp = dtInitiativeInit.Select("INITSlabBanefitPrdGroupID=" + dtDistinctGrp.Rows[j]["INITSlabBanefitPrdGroupID"].ToString()).CopyToDataTable();
                sbInit.Append(dtGrp.Rows[0]["INITBenefitID"].ToString() + "*$*" + dtGrp.Rows[0]["INITAppliedOnID"].ToString() + "*$*" + dtGrp.Rows[0]["Value"].ToString() + "*$*" + dtGrp.Rows[0]["SlabNo"].ToString() + "*$*");

                for (int k = 0; k < dtGrp.Rows.Count; k++)
                {
                    if (k != 0)
                    {
                        sbInit.Append("^");
                    }
                    sbInit.Append(dtGrp.Rows[k]["NodeID"].ToString() + "|" + dtGrp.Rows[k]["NodeType"].ToString() + "|" + dtGrp.Rows[k]["Descr"].ToString());
                }
                sbInit.Append("*$*" + dtDistinctGrp.Rows[j]["INITSlabBanefitPrdGroupID"].ToString());
                sbInit.Append("*$*0");      // CopyBucketID
                sbInit.Append("*$*0");      // IsNewSlab
                sbInit.Append("*$*0");      // IsNewGrp
                sbInit.Append("*$*" + dtGrp.Rows[0]["INITSlabBasePrdGroupID"].ToString());      // BaseGrpId
            }
        }
        return "0" + "~" + sbBase.ToString() + "~" + sbInit.ToString();
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
    public static string fnGetInitiativeList(string LoginID, string RoleID, string UserID, string FromDate, string ToDate, object objProd, object objLoc, object objChannel)
    {
        try
        {
            DataTable tblProd = new DataTable();
            string str = JsonConvert.SerializeObject(objProd, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblProd = JsonConvert.DeserializeObject<DataTable>(str);
            if (tblProd.Rows[0][0].ToString() == "0")
            {
                tblProd.Rows.RemoveAt(0);
            }

            DataTable tblLoc = new DataTable();
            string strLoc = JsonConvert.SerializeObject(objLoc, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblLoc = JsonConvert.DeserializeObject<DataTable>(strLoc);
            if (tblLoc.Rows[0][0].ToString() == "0")
            {
                tblLoc.Rows.RemoveAt(0);
            }

            DataTable tblChannel = new DataTable();
            string strChannel = JsonConvert.SerializeObject(objChannel, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblChannel = JsonConvert.DeserializeObject<DataTable>(strChannel);
            if (tblChannel.Rows[0][0].ToString() == "0")
            {
                tblChannel.Rows.RemoveAt(0);
            }

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spINITGetInitiativeInfoForCopy";
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
            Scmd.Parameters.AddWithValue("@LocSelection", tblLoc);
            Scmd.Parameters.AddWithValue("@ChannelSelection", tblChannel);
            Scmd.Parameters.AddWithValue("@FromDate", FromDate);
            Scmd.Parameters.AddWithValue("@EndDate", ToDate);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@flgMR", "0");
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0|^|" + CreateInitiativeListTbl(Ds, "tblInitiativeLst", "clsInitiativeLst");
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string CreateInitiativeListTbl(DataSet Ds, string tblname, string cls)
    {
        string[] SkipColumn = new string[1];
        SkipColumn[0] = "INITID";

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();

        sb.Append("<table id='" + tblname + "' class='table table-striped table-bordered table-sm " + cls + "'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th><input type='checkbox' onclick='fnChkUnchkInitAllPopup(this);'/></th>");
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
            sb.Append("<tr Init='" + dt.Rows[i]["INITID"] + "'>");
            sb.Append("<td><input iden='chkInit' type='checkbox' onclick='fnUnchkInitIndividual(this);'/></td>");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                {
                    sb.Append("<td>" + dt.Rows[i][j] + "</td>");
                }
            }
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    [System.Web.Services.WebMethod()]
    public static string fnPasteInitiative(string RoleID, string LoginID, string UserID, string FromDate, string ToDate, object objINIT)
    {
        try
        {
            string strINIT = JsonConvert.SerializeObject(objINIT, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblINIT = JsonConvert.DeserializeObject<DataTable>(strINIT);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spINITCopyMUltiple";
            Scmd.Parameters.AddWithValue("@INITIDSs", tblINIT);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@StartDate", FromDate);
            Scmd.Parameters.AddWithValue("@EndDate", ToDate);
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
    public static string fnGetFBforImport(string RoleID, string UserID, string LoginID, string FromDate, string ToDate, string flgOldNew, string flgFBType, string flgChannel, object objProd, object objLoc, object objChannel)
    {
        return Utilities.GetFBforImport(UserID, LoginID, FromDate, ToDate, objProd, objLoc, objChannel, flgOldNew, flgFBType, flgChannel, "1");
    }
    [System.Web.Services.WebMethod()]
    public static string fnImportFB(string RoleID, string UserID, string LoginID, string FromDate, string ToDate, object objINIT, string flgOldNew, string flgFBType)
    {
        return Utilities.ImportFB(RoleID, UserID, LoginID, FromDate, ToDate, objINIT, flgOldNew, flgFBType, "1");
    }
    [System.Web.Services.WebMethod()]
    public static string GetClusters(string LoginID, string RoleID, string UserID, string BucketType, string Month, string Year)
    {
        return Utilities.GetBucketDetailsbasedonType(BucketType, LoginID, UserID, RoleID, Month, Year, true, "4");
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
            Scmd.CommandText = "spINITGetCommentsinBulk";
            Scmd.Parameters.AddWithValue("@INIT", tblINIT);
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
            Scmd.CommandText = "spINITGetComment";
            Scmd.Parameters.AddWithValue("@INITID", INITID);
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
            Scmd.CommandText = "spINITSaveComment";
            Scmd.Parameters.AddWithValue("@INITID", INITID);
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
            Scmd.CommandText = "spINITManageBookmark";
            Scmd.Parameters.AddWithValue("@INITID", tblINIT);
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
            Scmd.CommandText = "spINITMarkSetteled";
            Scmd.Parameters.AddWithValue("@INITID", INITID);
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

            string[] SkipColumn = new string[11];
            SkipColumn[0] = "CatNodeID";
            SkipColumn[1] = "CatNodeType";
            SkipColumn[2] = "BrnNodeID";
            SkipColumn[3] = "BrnNodeType";
            SkipColumn[4] = "BFNodeID";
            SkipColumn[5] = "BFNodeType";
            SkipColumn[6] = "SBFGroupID";
            SkipColumn[7] = "SBFGroupNOdeType";
            SkipColumn[8] = "SBFNodeID";
            SkipColumn[9] = "SBFNodeType";
            SkipColumn[10] = "SearchString";

            DataTable dt = Ds.Tables[0];
            StringBuilder sb = new StringBuilder();
            sb.Append("<table class='table table-bordered table-sm table-hover'>");
            sb.Append("<thead>");

            sb.Append("<tr>");
            sb.Append("<th colspan='6'>");
            sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnPopupHierTblAtSpecificLvlTypeFilter(this);' placeholder='Type atleast 3 character to filter...'/>");
            sb.Append("</th>");
            sb.Append("</tr>");

            sb.Append("<tr>");
            sb.Append("<th style='width: 30px;'></th>");
            sb.Append("<th style='display: none;'>SearchString</th>");
            for (int j = 0; j < dt.Columns.Count; j++)
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                    sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");

            sb.Append("</tr>");

            sb.Append("</thead>");
            sb.Append("<tbody>");
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                sb.Append("<tr onclick='fnSelectUnSelectSBF(this);' flg='0' flgVisible='1' flgDisable='0' nid='" + dt.Rows[i]["SBFNodeId"] + "' ntype='" + dt.Rows[i]["SBFNodeType"] + "'>");

                sb.Append("<td><img src='../../Images/checkbox-unchecked.png'/></td>");
                sb.Append("<td style='display: none;'>" + dt.Rows[i]["SBF"] + "</td>");
                for (int j = 0; j < dt.Columns.Count; j++)
                    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                        sb.Append("<td class='clss-" + j + "'>" + dt.Rows[i][j] + "</td>");

                sb.Append("</tr>");
            }
            sb.Append("</tbody>");
            sb.Append("</table>");

            return "0|^|" + sb.ToString();
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnGetChannelSummaryDescr(string LoginID, object objBasePrdMain, object objBasePrdDetail, object objBenefitPrdMain, object objBenefitPrdDetail, string strSBF)
    {
        try
        {
            DataTable tblBasePrdMain = new DataTable();
            string strBasePrdMain = JsonConvert.SerializeObject(objBasePrdMain, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBasePrdMain = JsonConvert.DeserializeObject<DataTable>(strBasePrdMain);
            if (tblBasePrdMain.Rows[0][0].ToString() == "0")
                tblBasePrdMain.Rows.RemoveAt(0);

            DataTable tblBasePrdDetail = new DataTable();
            string strBasePrdDetail = JsonConvert.SerializeObject(objBasePrdDetail, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBasePrdDetail = JsonConvert.DeserializeObject<DataTable>(strBasePrdDetail);
            if (tblBasePrdDetail.Rows[0][0].ToString() == "0")
                tblBasePrdDetail.Rows.RemoveAt(0);

            DataTable tblBenefitPrdMain = new DataTable();
            string strBenefitPrdMain = JsonConvert.SerializeObject(objBenefitPrdMain, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBenefitPrdMain = JsonConvert.DeserializeObject<DataTable>(strBenefitPrdMain);
            if (tblBenefitPrdMain.Rows[0][0].ToString() == "0")
                tblBenefitPrdMain.Rows.RemoveAt(0);

            DataTable tblBenefitPrdDetail = new DataTable();
            string strBenefitPrdDetail = JsonConvert.SerializeObject(objBenefitPrdDetail, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBenefitPrdDetail = JsonConvert.DeserializeObject<DataTable>(strBenefitPrdDetail);
            if (tblBenefitPrdDetail.Rows[0][0].ToString() == "0")
                tblBenefitPrdDetail.Rows.RemoveAt(0);

            StringBuilder sb = new StringBuilder();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spINITGetSuggestedDescr";
            Scmd.CommandType = CommandType.StoredProcedure;
            //Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@INITSlabBaseMain", tblBasePrdMain);
            Scmd.Parameters.AddWithValue("@INITSlabBaseDetail", tblBasePrdDetail);
            Scmd.Parameters.AddWithValue("@INITSlabBenefitMain", tblBenefitPrdMain);
            Scmd.Parameters.AddWithValue("@INITSlabBenefitDetail", tblBenefitPrdDetail);
            Scmd.Parameters.AddWithValue("@strSBFList", strSBF);
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0|^|" + Utilities.XSSHandling(Ds.Tables[0].Rows[0][0].ToString());
        }
        catch (Exception e)
        {
            return "2|^|" + e.Message;
        }
    }




    [System.Web.Services.WebMethod()]
    public static string fnSave(string INITID, string INITCode, string INITName, string INITShortDescr, string INITDescription, string ChannelSummaryDescr, string AmtLimit, string CountLimit, string FromDate, string ToDate, object objBucket, object obj, string LoginID, string strLocation, string strChannel, string Disburshment, string Multiplication, string IncudeLeap, string IncudeSubD, object objBasePrdMain, object objBasePrdDetail, object objBenefitPrdMain, object objBenefitPrdDetail, string UserID, string MixedCases, string flgSave, string ApplicablePer, string IncentiveTypeId, string INITTypeID, string COHID, string MRAccountIDs)
    {
        try
        {
            DataTable tblBucket = new DataTable();
            string strBucket = JsonConvert.SerializeObject(objBucket, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBucket = JsonConvert.DeserializeObject<DataTable>(strBucket);

            DataTable tbl = new DataTable();
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);

            DataTable tblBasePrdMain = new DataTable();
            string strBasePrdMain = JsonConvert.SerializeObject(objBasePrdMain, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBasePrdMain = JsonConvert.DeserializeObject<DataTable>(strBasePrdMain);
            if (tblBasePrdMain.Rows[0][0].ToString() == "0")
                tblBasePrdMain.Rows.RemoveAt(0);

            DataTable tblBasePrdDetail = new DataTable();
            string strBasePrdDetail = JsonConvert.SerializeObject(objBasePrdDetail, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBasePrdDetail = JsonConvert.DeserializeObject<DataTable>(strBasePrdDetail);
            if (tblBasePrdDetail.Rows[0][0].ToString() == "0")
                tblBasePrdDetail.Rows.RemoveAt(0);

            DataTable tblBenefitPrdMain = new DataTable();
            string strBenefitPrdMain = JsonConvert.SerializeObject(objBenefitPrdMain, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBenefitPrdMain = JsonConvert.DeserializeObject<DataTable>(strBenefitPrdMain);
            if (tblBenefitPrdMain.Rows[0][0].ToString() == "0")
                tblBenefitPrdMain.Rows.RemoveAt(0);

            DataTable tblBenefitPrdDetail = new DataTable();
            string strBenefitPrdDetail = JsonConvert.SerializeObject(objBenefitPrdDetail, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBenefitPrdDetail = JsonConvert.DeserializeObject<DataTable>(strBenefitPrdDetail);
            if (tblBenefitPrdDetail.Rows[0][0].ToString() == "0")
                tblBenefitPrdDetail.Rows.RemoveAt(0);

            StringBuilder sb = new StringBuilder();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spINITManageINIT";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.Parameters.AddWithValue("@INITID", INITID);
            //Scmd.Parameters.AddWithValue("@INITCode", INITCode);
            Scmd.Parameters.AddWithValue("@INITName", Utilities.XSSHandling(INITName));
            Scmd.Parameters.AddWithValue("@INITDescription", Utilities.XSSHandling(INITDescription));
            Scmd.Parameters.AddWithValue("@AmtLimit", AmtLimit);
            Scmd.Parameters.AddWithValue("@CountLimit", CountLimit);
            Scmd.Parameters.AddWithValue("@FromDate", FromDate);
            Scmd.Parameters.AddWithValue("@ToDate", ToDate);
            Scmd.Parameters.AddWithValue("@Buckets", tblBucket);
            Scmd.Parameters.AddWithValue("@BucketValues", tbl);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@strLocation", Utilities.XSSHandling(strLocation));
            Scmd.Parameters.AddWithValue("@strChannel", Utilities.XSSHandling(strChannel));
            Scmd.Parameters.AddWithValue("@flgIncludeSubD", IncudeSubD);
            Scmd.Parameters.AddWithValue("@INITShortDescr ", Utilities.XSSHandling(INITShortDescr));
            Scmd.Parameters.AddWithValue("@MultiplicationTypeID", Multiplication);
            Scmd.Parameters.AddWithValue("@flgIncludeLeap", IncudeLeap);
            Scmd.Parameters.AddWithValue("@DisburshmentTypeID", Disburshment);
            Scmd.Parameters.AddWithValue("@INITSlabBaseMain", tblBasePrdMain);
            Scmd.Parameters.AddWithValue("@INITSlabBaseDetail", tblBasePrdDetail);
            Scmd.Parameters.AddWithValue("@INITSlabBenefitMain", tblBenefitPrdMain);
            Scmd.Parameters.AddWithValue("@INITSlabBenefitDetail", tblBenefitPrdDetail);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@flgSaveSubmit", flgSave);   //1: Save as draft, 2: Save
            Scmd.Parameters.AddWithValue("@flgMixedCases", MixedCases);
            Scmd.Parameters.AddWithValue("@Applicable_Per", ApplicablePer);
            Scmd.Parameters.AddWithValue("@IncentiveTypeId", IncentiveTypeId);
            Scmd.Parameters.AddWithValue("@INITTypeID", INITTypeID);
            Scmd.Parameters.AddWithValue("@COHID", COHID);
            Scmd.Parameters.AddWithValue("@MRAccountIDs", MRAccountIDs);
            Scmd.Parameters.AddWithValue("@ChannelSummaryDescr", Utilities.XSSHandling(ChannelSummaryDescr));
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
            else
            {
                return "2|^|";
            }
        }
        catch (Exception e)
        {
            return "2|^|" + e.Message;
        }
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
                Scmd.CommandText = "spINITDelete";
                Scmd.Parameters.AddWithValue("@INITID", INITID.Split('^')[i]);
                Scmd.Parameters.AddWithValue("@UserID", UserID);
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
            Scmd.CommandText = "spINITSaveSubmitINIT";
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@INITLIST", tblINIT);
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
    public static string fnSaveNewNode(string NodeId, string Code, string Descr, string NodeType, string ParentId, string ParentType, string LoginID, string UserID, string RoleID)
    {
        try
        {
            DataSet Ds = new DataSet();
            if (NodeType != "35")
            {
                Ds = Utilities.AddNewNode(NodeType, Utilities.XSSHandling(Code), Utilities.XSSHandling(Descr), ParentId, ParentType, LoginID);
                NodeId = Ds.Tables[0].Rows[0][0].ToString();
            }
            else
            {
                Ds = Utilities.AddEditSBFGroup(NodeId, Utilities.XSSHandling(Code), Utilities.XSSHandling(Descr), LoginID, RoleID);
                NodeId = Ds.Tables[0].Rows[0]["GroupID"].ToString();

                Ds.Clear();
                Utilities.SBFGroupMapping(ParentId + "^" + NodeId + "|", LoginID, UserID);
            }

            return "0|^|" + NodeId + "^" + NodeType;
        }
        catch (Exception ex)
        {
            return "2|^|" + ex.Message;
        }
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
        Scmd.CommandText = "[spGenerateChannelSummary]";
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Scmd.Parameters.AddWithValue("@MonthVal", hdnmonthyearexcel.Value.ToString().Split('^')[0]);
        Scmd.Parameters.AddWithValue("@YearVal", hdnmonthyearexcel.Value.ToString().Split('^')[1]);
        Scmd.Parameters.AddWithValue("@LoginID", Session["LoginID"].ToString());
        Scmd.Parameters.AddWithValue("@UserID", Session["UserID"].ToString());
        Scmd.Parameters.AddWithValue("@RoleID", Session["RoleId"].ToString());
        Scmd.Parameters.AddWithValue("@INITID", tblLoc);
        Scmd.Parameters.AddWithValue("@flgMR", "0");


        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        Sdap.Fill(ds);
        if (ds.Tables[0].Rows.Count > 0)
        {
            //if (File.Exists(Server.MapPath("~/Uploads/") + ds.Tables[0].Rows[0][0].ToString()))
            //{
            clsExcelDownload.ConvertToExcelNew(ds, "", hdnmonthyearexceltext.Value);
            //}
        }

        //ConvertToExcelNew(ds);
    }
}