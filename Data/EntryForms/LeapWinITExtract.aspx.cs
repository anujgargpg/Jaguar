using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.IO;
using ClosedXML.Excel;
using System.Net.Sockets;


public partial class Data_EntryForms_LeapWinITExtract : System.Web.UI.Page
{
    [DllImport("user32.dll")]
    static extern int GetWindowThreadProcessId(int hWnd, out int lpdwProcessId);
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
                hdnPageType.Value = Request.QueryString["pg"].ToString();
                hdnInstanceType.Value = Request.QueryString["ins"].ToString();

                hdnLoginID.Value = Session["LoginID"].ToString();
                hdnUserID.Value = Session["UserID"].ToString();
                hdnRoleID.Value = Session["RoleId"].ToString();
                hdnNodeID.Value = Session["NodeId"].ToString();
                hdnNodeType.Value = Session["NodeType"].ToString();

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "30"))
                    GetMaster();
                else if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "31"))
                    GetMaster();
                else if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "32"))
                    GetMaster();
                else if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "33"))
                    GetMaster();
                else if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "34"))
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


        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spINITGetDashboardMatser";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        ListItem itm = new ListItem();
        foreach (DataRow dr in Ds.Tables[0].Rows)
        {
            itm = new ListItem();
            itm.Text = dr["Month"].ToString();
            itm.Value = dr["Start Date"].ToString() + "|" + dr["End Date"].ToString();
            //itm.Attributes.Add("startdt", dr["startdt"].ToString());
            ddlMonth.Items.Add(itm);
            if (dr["flgSelect"].ToString() == "1")
            {
                itm.Selected = true;
            }
        }

        Ds.Clear();
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

        StringBuilder sbStage = new StringBuilder();
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbStage.Append("<option value='" + Ds.Tables[0].Rows[i]["Legend"].ToString() + "'>" + Ds.Tables[0].Rows[i]["Legend"].ToString() + "</option>");
        }
        hdnStage.Value = sbStage.ToString();

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

        StringBuilder sbMSMP = new StringBuilder();
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMSMP.Append("<option value='" + Ds.Tables[0].Rows[i]["UserID"].ToString() + "'>" + Ds.Tables[0].Rows[i]["MSMPAlies"].ToString() + "</option>");
        }
        hdnMSMPAlies.Value = sbMSMP.ToString();


        Ds.Clear();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spINITGetINITType]";
        Scmd.Parameters.AddWithValue("@RoleID", hdnRoleID.Value);
        Scmd.Parameters.AddWithValue("@USerID", hdnUserID.Value);
        Scmd.Parameters.AddWithValue("@LOginID", hdnLoginID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        //------- Initiative Type
        StringBuilder sbInitType = new StringBuilder();
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbInitType.Append("<option value='" + Ds.Tables[0].Rows[i]["INITTypeID"].ToString() + "'>" + Ds.Tables[0].Rows[i]["INITTYPE"].ToString() + "</option>");
        }
        hdnINITType.Value = sbInitType.ToString();
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
    public static string fnLocationHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, string flg, object obj, string InSubD)
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
    public static string fnChannelHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, string flg, object obj)
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
    public static string GetDownloadReport(string login, object objProd, object objLoc, object objChannel, string fromdate, string todate, string user, object objStage, string role, string flgPage, string flgInstance, object objMSMP, object objINITType, string flgMR)
    {
        StringBuilder sb = new StringBuilder();
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

            string strINITType = JsonConvert.SerializeObject(objINITType, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblINITType = JsonConvert.DeserializeObject<DataTable>(strINITType);
            if (tblINITType.Rows[0][0].ToString() == "0")
            {
                tblINITType.Rows.RemoveAt(0);
            }

            string strStage = JsonConvert.SerializeObject(objStage, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblStage = JsonConvert.DeserializeObject<DataTable>(strStage);
            if (tblStage.Rows[0][0].ToString() == "0")
            {
                tblStage.Rows.RemoveAt(0);
            }

            string strMSMP = JsonConvert.SerializeObject(objMSMP, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblMSMP = JsonConvert.DeserializeObject<DataTable>(strMSMP);
            if (tblMSMP.Rows[0][0].ToString() == "0")
            {
                tblMSMP.Rows.RemoveAt(0);
            }

            DataSet ds = new DataSet();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "[spExtractLeapExtractCSV]";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            Scmd.Parameters.AddWithValue("@LoginID", login);
            Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
            Scmd.Parameters.AddWithValue("@LocSelection", tblLoc);
            Scmd.Parameters.AddWithValue("@ChannelSelection", tblChannel);
            Scmd.Parameters.AddWithValue("@FromDate", fromdate);
            Scmd.Parameters.AddWithValue("@EndDate", todate);
            Scmd.Parameters.AddWithValue("@UserID", user);
            Scmd.Parameters.AddWithValue("@ProcessGroup", tblStage);
            Scmd.Parameters.AddWithValue("@RoleID", role);
            Scmd.Parameters.AddWithValue("@flgLeapwinIT", flgPage);
            Scmd.Parameters.AddWithValue("@Instance", flgInstance);
            Scmd.Parameters.AddWithValue("@Users", tblMSMP);
            Scmd.Parameters.AddWithValue("@INITTypeIDs", tblINITType);
            Scmd.Parameters.AddWithValue("@flgMR", flgMR);
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            Sdap.Fill(ds);
            Sdap.Dispose();
            Scmd.Dispose();
            Scon.Dispose();

            //divMsg.InnerHtml = "<span style='color:red;font-size:12px;'>File not available.</span>";
            string[] SkipColumn = new string[0];
            string FileName = "";
            if (flgPage == "1")
            {
                switch (flgInstance)
                {
                    case "-1":
                        FileName = "Leap_Extract_AllCloud";
                        break;
                    case "1":
                        FileName = "Leap_Extract_Cloud01";
                        break;
                    case "2":
                        FileName = "Leap_Extract_Cloud02";
                        break;
                    case "3":
                        FileName = "Leap_Extract_Cloud03";
                        break;
                }
            }
            else
                FileName = "WinIT_Extract";

            saveCSVFile(ds.Tables[0], SkipColumn, HttpContext.Current.Server.MapPath("~/Files/") + FileName + "_Scheme_Master.csv");
            saveCSVFile(ds.Tables[1], SkipColumn, HttpContext.Current.Server.MapPath("~/Files/") + FileName + "_Scheme_Criteria_Mapping.csv");
            sb.Append("0|^|" + FileName + "_Scheme_Master.csv" + "|^|" + FileName + "_Scheme_Criteria_Mapping.csv");
        }
        catch (Exception ex)
        {
            sb.Append("1|^|" + ex.Message);
            //classSendMail.fnSendmail("saurav@astix.in", "", "Jaguar : Error while Downloading Extract", ex.Message, "");
        }

        return sb.ToString();
    }
    private static void saveCSVFile(DataTable dt, string[] SkipColumn, string Path)
    {
        StringBuilder sb = new StringBuilder();
        //for (int j = 0; j < dt.Columns.Count; j++)
        //{
        //    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
        //    {                
        //        if (j != dt.Columns.Count - 1)
        //            sb.Append(dt.Columns[j].ColumnName.ToString() + ", ");
        //        else
        //            sb.Append(dt.Columns[j].ColumnName.ToString());
        //    }
        //}
        //sb.Append(Environment.NewLine);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                {
                    if (j != dt.Columns.Count - 1)
                        sb.Append(Utilities.HTMLDecode(dt.Rows[i][j].ToString()) + ", ");
                    else
                        sb.Append(Utilities.HTMLDecode(dt.Rows[i][j].ToString()));
                }
            }
            sb.Append(Environment.NewLine);
        }

        using (StreamWriter objWriter = new StreamWriter(Path, false, new UTF8Encoding(true)))
        {
            objWriter.WriteLine(sb);
            objWriter.Flush();
        }
        sb.Clear();
    }    
}