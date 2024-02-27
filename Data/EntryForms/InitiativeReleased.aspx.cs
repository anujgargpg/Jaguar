using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Data_EntryForms_InitiativeReleased : System.Web.UI.Page
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

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "26"))
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

        //------- Masters -----------------------------------

        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spINITGetINITMatser]";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@UserID", hdnUserID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
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
        hdnInitType.Value = sbMstr.ToString();

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

        //----------------MS & P Filter
        Ds.Clear();
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
    public static string fnProdHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, object obj)
    {
        try
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

    //[System.Web.Services.WebMethod()]
    //public static string GetSelHierTbl(object obj, string BucketType, string InSubD)
    //{
    //    return Utilities.GetSelectedHierDetail(BucketType, obj, "18");
    //}



    [System.Web.Services.WebMethod()]
    public static string fnGetReport(string LoginID, string FromDate, string ToDate, string UserID, object objProd, object objLoc, object objChannel, object objMSMP, string flgMR)
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

            string strMSMP = JsonConvert.SerializeObject(objMSMP, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblMSMP = JsonConvert.DeserializeObject<DataTable>(strMSMP);
            if (tblMSMP.Rows[0][0].ToString() == "0")
            {
                tblMSMP.Rows.RemoveAt(0);
            }

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spINITGetInitiativeInfoForReleased";
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);            
            Scmd.Parameters.AddWithValue("@FromDate", FromDate);
            Scmd.Parameters.AddWithValue("@EndDate", ToDate);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
            Scmd.Parameters.AddWithValue("@LocSelection", tblLoc);
            Scmd.Parameters.AddWithValue("@ChannelSelection", tblChannel);
            Scmd.Parameters.AddWithValue("@Users", tblMSMP);
            Scmd.Parameters.AddWithValue("@flgMR", flgMR);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();
            return "0|^|" + CreateInitiativeMstrTbl(Ds, "tblReport", "clsReport") + "|^|"  + CreateButtons(Ds);
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }


    private static string CreateButtons(DataSet ds)
    {
        StringBuilder sb = new StringBuilder();
        if (ds.Tables.Count > 1)
        {
            DataTable dt = ds.Tables[1].Copy();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                sb.Append("<a href='#' class='btn btn-primary btn-disabled btn-sm' style='margin-right: 20px;'  savebuttontype='" + dt.Rows[i]["ButtonID"].ToString() + "'>" + dt.Rows[i]["Button"].ToString() + "</a>");
            }
        }
        return sb.ToString();
    }

    private static string CreateInitiativeMstrTbl(DataSet Ds, string tblname, string cls)
    {
        string[] SkipColumn = new string[1];
        SkipColumn[0] = "INITID";


        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        StringBuilder sbLoc = new StringBuilder();
        //StringBuilder sbDescr = new StringBuilder();
        StringBuilder sbChannel = new StringBuilder();
        //StringBuilder sbShortDescr = new StringBuilder();
        
            sb.Append("<table id='" + tblname + "' class='table table-striped table-bordered table-sm " + cls + "' IsSchemeAppRule='1' IsLocExpand='1' IsChannelExpand='1'>");
            sb.Append("<thead>");
            sb.Append("<tr>");
            sb.Append("<th><input type='checkbox'  id='chkAll' onchange='fnSelectAll(this,1)' /></th>");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                {
                    sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");
                }
            }
            //if (HttpContext.Current.Session["RoleId"].ToString() == "2")
            //{
            //    sb.Append("<th style='text-align:center;' colspan='2'>Invoice(s)</th>");
            //}

            //sb.Append("<th style='text-align:center;'>Action</th>");
            sb.Append("</tr>");
            sb.Append("</thead>");
            sb.Append("<tbody>");
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                sb.Append("<tr initid='" + dt.Rows[i]["INITID"] + "' >");

                sb.Append("<td style='text-align:center;'><input type='checkbox' onchange='fnsameigst(this)'/></td>");

                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                    {
                        sb.Append("<td iden='Init'>" + dt.Rows[i][j] + "</td>");
                    }
                }

                
                sb.Append("</tr>");
            }
            sb.Append("</tbody>");
            sb.Append("</table>");

        return sb.ToString();
    }



    [System.Web.Services.WebMethod()]
    public static string fnFinalSaving(object objINIT)
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
            Scmd.Parameters.AddWithValue("@RoleID", HttpContext.Current.Session["RoleId"].ToString());
            Scmd.Parameters.AddWithValue("@LoginID", HttpContext.Current.Session["LoginID"].ToString());
            Scmd.Parameters.AddWithValue("@UserID", HttpContext.Current.Session["UserID"].ToString());
            Scmd.Parameters.AddWithValue("@INITLIST", tblINIT);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0|^|Invoices Uploaded Successfully..";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }


    [System.Web.Services.WebMethod()]
    public static string fnDeleteFile(string InvoiceMapID, string initid, string filename)
    {
        try
        {

            string filePath = HttpContext.Current.Server.MapPath("~/Uploads/InvoiceFiles/" + initid + "/") + filename;

            //var directory = new DirectoryInfo(HttpContext.Current.Server.MapPath("~/Uploads/InvoiceFiles/" + initid + "/"));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spINITDeleteInvoice";
            Scmd.Parameters.AddWithValue("@INITInvoiceMapID", InvoiceMapID);

            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0|^|File Deleted Successfully";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
}