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

public partial class MasterForms_frmUserAddEdit : System.Web.UI.Page
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

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "8"))
                    GetMaster();
                else
                    Response.Redirect("~/frmLogin.aspx");
            }
        }
    }
    private void GetMaster()
    {
        hdnProductLvl.Value = "<div class='producthrchy'>Product Level</div>" + Utilities.GetHierLvl("1", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "8");

        hdnLocationLvl.Value = "<div class='producthrchy'>Location Level</div>" + Utilities.GetHierLvl("2", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "8");

        hdnChannelLvl.Value = "<div class='producthrchy'>Channel Level</div>" + Utilities.GetHierLvl("3", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "8");

        

        //------- Bucket Type -----------------------
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spBucketGetBucketType";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        StringBuilder sbBucketType = new StringBuilder();
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            if (i == 0)
            {
                sbBucketType.Append("<li BucketTypeID='" + Ds.Tables[0].Rows[i]["BucketTypeID"].ToString() + "' onclick='fnBucketTypeSel(this);'><a class='nav-link active' href='#'>" + Ds.Tables[0].Rows[i]["BucketType"].ToString() + "</a></li>");
                hdnBucketType.Value = Ds.Tables[0].Rows[i]["BucketTypeID"].ToString();
            }
            else
                sbBucketType.Append("<li BucketTypeID='" + Ds.Tables[0].Rows[i]["BucketTypeID"].ToString() + "' onclick='fnBucketTypeSel(this);'><a class='nav-link' href='#'>" + Ds.Tables[0].Rows[i]["BucketType"].ToString() + "</a></li>");
        }

        //------------- Role ---------------------------
        Ds.Clear();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spRoleGetRoles";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        ddlRole.Items.Add(new ListItem("--Select--", "0"));
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
            ddlRole.Items.Add(new ListItem(Ds.Tables[0].Rows[i]["RoleName"].ToString(), Ds.Tables[0].Rows[i]["RoleId"].ToString()));
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
                return "0|^|" + Utilities.GetHierDetail("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "8") + "|^|" + Utilities.GetSelectedHierDetail("1", obj, "8");
            }
            else
                return "0|^|" + Utilities.GetHierDetail("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "8") + "|^|";
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
                return "0|^|" + Utilities.GetHierDetail("2", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "8") + "|^|" + Utilities.GetSelectedHierDetail("2", obj, "8");
            }
            else
                return "0|^|" + Utilities.GetHierDetail("2", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "8") + "|^|";
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
                return "0|^|" + Utilities.GetHierDetail("3", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "8") + "|^|" + Utilities.GetSelectedHierDetail("3", obj, "8");
            }
            else
                return "0|^|" + Utilities.GetHierDetail("3", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "8") + "|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
   

    [System.Web.Services.WebMethod()]
    public static string fnGetTableData(string LoginID)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spUserGetUsers";
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            string[] SkipColumn = new string[9];
            SkipColumn[0] = "UserID";
            SkipColumn[1] = "RoleId";
            SkipColumn[2] = "TimestampIns";
            SkipColumn[3] = "LoginIDUpd";
            SkipColumn[4] = "TimestampUpd";
            SkipColumn[5] = "strProduct";
            SkipColumn[6] = "strLocation";
            SkipColumn[7] = "strChannel";
            SkipColumn[8] = "strProductExtra";
            return "0|^|" + CreateMstrTbl(Ds, SkipColumn, "tblReport", "clsReport");
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string CreateMstrTbl(DataSet Ds, string[] SkipColumn, string tblname, string cls)
    {
        DataTable dt = Ds.Tables[0];
        DataTable dtCursorData = Ds.Tables[1];

        StringBuilder sb = new StringBuilder();
        StringBuilder sbDescr = new StringBuilder();
        sb.Append("<table id='" + tblname + "' class='table table-striped table-bordered table-sm " + cls + "'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th>#</th>");
        for (int j = 0; j < dt.Columns.Count; j++)
        {
            if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
            {
                if (dt.Columns[j].ColumnName.ToString().Trim() == "Product Access")
                    sb.Append("<th>Primary Product Access</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Product Access Extra")
                    sb.Append("<th>Secondary Product Access</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "MSMPAlies")
                    sb.Append("<th>MS&amp;P ALIAS</th>");
                else
                    sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");
            }
        }
        sb.Append("<th>Edit</th>");
        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sbDescr.Clear();
            sb.Append("<tr UserID='" + dt.Rows[i]["UserID"] + "' Name='" + Utilities.XSSHandling(dt.Rows[i]["Name"].ToString()) + "'  EmailID='" + Utilities.XSSHandling(dt.Rows[i]["Email ID"].ToString()) + "' Active='" + dt.Rows[i]["Active"] + "' Role='" + Utilities.XSSHandling(dt.Rows[i]["Role"].ToString()) + "' RoleId='" + dt.Rows[i]["RoleId"] + "' CorpUser='" + dt.Rows[i]["Corp User"] + "' Prodstr='" + dt.Rows[i]["Product Access"] + "' Prodselstr='" + dt.Rows[i]["strProduct"] + "' Locationstr='" + dt.Rows[i]["Location Access"] + "' Locationselstr='" + dt.Rows[i]["strLocation"] + "' Channelstr='" + dt.Rows[i]["Channel Access"] + "' Channelselstr='" + dt.Rows[i]["strChannel"] + "' ExtraProdstr='" + dt.Rows[i]["Product Access Extra"] + "' ExtraProdselstr='" + dt.Rows[i]["strProductExtra"] + "' MSMPAlies='" + dt.Rows[i]["MSMPAlies"] + "'>");
            sb.Append("<td>" + (i + 1).ToString() + "</td>");

            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                {
                    if (dt.Columns[j].ColumnName.ToString() == "Product Access")
                    {
                        if (dtCursorData.Select("UserID=" + dt.Rows[i]["UserID"].ToString() + " And HierTypeId=1").Length > 0)
                        {
                            sb.Append("<td><span title='" + customTooltip(dt.Rows[i]["UserID"].ToString(), "1", dtCursorData) + "' class='clsInform'>" + dt.Rows[i][j] + "</span></td>");
                        }
                        else
                        {
                            sb.Append("<td><span>" + dt.Rows[i][j] + "</span></td>");
                        }
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Location Access")
                    {
                        if (dtCursorData.Select("UserID=" + dt.Rows[i]["UserID"].ToString() + " And HierTypeId=2").Length > 0)
                        {
                            sb.Append("<td><span title='" + customTooltip(dt.Rows[i]["UserID"].ToString(), "2", dtCursorData) + "' class='clsInform'>" + dt.Rows[i][j] + "</span></td>");
                        }
                        else
                        {
                            sb.Append("<td><span>" + dt.Rows[i][j] + "</span></td>");
                        }
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Channel Access")
                    {
                        if (dtCursorData.Select("UserID=" + dt.Rows[i]["UserID"].ToString() + " And HierTypeId=3").Length > 0)
                        {
                            sb.Append("<td><span title='" + customTooltip(dt.Rows[i]["UserID"].ToString(), "3", dtCursorData) + "' class='clsInform'>" + dt.Rows[i][j] + "</span></td>");
                        }
                        else
                        {
                            sb.Append("<td><span>" + dt.Rows[i][j] + "</span></td>");
                        }
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Product Access Extra")
                    {
                        if (Ds.Tables[2].Select("UserID=" + dt.Rows[i]["UserID"].ToString() + " And HierTypeId=4").Length > 0)
                        {
                            sb.Append("<td><span title='" + customTooltip(dt.Rows[i]["UserID"].ToString(), "4", Ds.Tables[2]) + "' class='clsInform'>" + dt.Rows[i][j] + "</span></td>");
                        }
                        else
                        {
                            sb.Append("<td><span>" + dt.Rows[i][j] + "</span></td>");
                        }
                    }
                    else if (dt.Columns[j].ColumnName.ToString() == "Corp User")
                    {
                        if (dt.Rows[i]["Corp User"].ToString() == "0")
                        {
                            sb.Append("<td>No</td>");
                        }
                        else
                        {
                            sb.Append("<td>Yes</td>");
                        }
                    }
                    else
                    {
                        sb.Append("<td>" + Utilities.XSSHandling(dt.Rows[i][j].ToString()) + "</td>");
                    }
                }
            }
            sb.Append("<td title='Edit User Details'><img src='../../Images/edit.png' onclick='fnEdit(this);'/></td>");
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    private static string customTooltip(string UserId, string HierId, DataTable dtCursorData)
    {
        StringBuilder sb = new StringBuilder();
        DataTable dt = dtCursorData.Select("UserID=" + UserId + " And HierTypeId=" + HierId).CopyToDataTable();

        int cntr = 0;
        string strLevel = "";
        DataTable dtDistinctNodeType = dt.DefaultView.ToTable(true, "NodeType");
        for (int i = 0; i < dtDistinctNodeType.Rows.Count; i++)
        {
            switch (dtDistinctNodeType.Rows[i]["NodeType"].ToString())
            {
                case "10":
                    strLevel = "Category";
                    break;
                case "20":
                    strLevel = "Brand";
                    break;
                case "100":
                    strLevel = "Country";
                    break;
                case "110":
                    strLevel = "Region";
                    break;
                case "120":
                    strLevel = "Site";
                    break;
                case "130":
                    strLevel = "Distributor";
                    break;
                case "200":
                    strLevel = "Class";
                    break;
                case "210":
                    strLevel = "Channel";
                    break;
                default:
                    strLevel = "---";
                    break;
            }
            DataTable dtLevelBased = dt.Select("NodeType=" + dtDistinctNodeType.Rows[i]["NodeType"].ToString()).CopyToDataTable();

            sb.Append("<div>Selection Level :");
            sb.Append("<span>"+ strLevel + "</span>");
            sb.Append("</div>");

            sb.Append("<table>");
            sb.Append("<thead><tr>");
            switch (dtLevelBased.Rows.Count)
            {
                case 1:
                    sb.Append("<th>" + strLevel + "</th>");
                    break;
                case 2:
                    sb.Append("<th>" + strLevel + "</th><th>" + strLevel + "</th>");
                    break;
                default:
                    sb.Append("<th>" + strLevel + "</th><th>" + strLevel + "</th><th>" + strLevel + "</th>");
                    break;
            }

            sb.Append("</tr></thead>");
            sb.Append("<tbody>");
            sb.Append("<tr>");
            for (int j = 0; j < dtLevelBased.Rows.Count; j++) {
                sb.Append("<td>" + dtLevelBased.Rows[j]["Descr"].ToString() + "</td>");
                cntr++;

                if (cntr > 2)
                {
                    cntr = 0;
                    sb.Append("</tr><tr>");
                }
            }
            sb.Append("</tr>");
            sb.Append("</tbody>");
            sb.Append("</table>");
        }

        return sb.ToString();
    }
    

    [System.Web.Services.WebMethod()]
    public static string fnSave(string LoginID, string UserID, string Name, string EmailID, string Status, string Role, object obj, string CorpUser, string strProduct, string strLocation, string strChannel, object objExtraProd, string strExtraProduct, string MSMPAlies)
    {
        DataTable tbl = new DataTable();
        string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        tbl = JsonConvert.DeserializeObject<DataTable>(str);

        DataTable tblExtraProd = new DataTable();
        string strExtraProd = JsonConvert.SerializeObject(objExtraProd, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        tblExtraProd = JsonConvert.DeserializeObject<DataTable>(strExtraProd);
        if(tblExtraProd.Rows[0][2].ToString() == "0")
        {
            tblExtraProd.Rows.RemoveAt(0);
        }

        try
        {
            StringBuilder sb = new StringBuilder();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spUserSaveUsers";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@userID", UserID);
            Scmd.Parameters.AddWithValue("@EmpName", Utilities.XSSHandling(Name));
            Scmd.Parameters.AddWithValue("@Designation", "");
            Scmd.Parameters.AddWithValue("@EmpCode", "");
            Scmd.Parameters.AddWithValue("@PersonEmailID", Utilities.XSSHandling(EmailID));
            Scmd.Parameters.AddWithValue("@PersonPhone", "");
            Scmd.Parameters.AddWithValue("@flgActive", Status);
            Scmd.Parameters.AddWithValue("@RoleID", Role);
            Scmd.Parameters.AddWithValue("@ApplicableLvls", tbl);
            Scmd.Parameters.AddWithValue("@flgcorporateUser", CorpUser);
            Scmd.Parameters.AddWithValue("@strProduct", Utilities.XSSHandling(strProduct));
            Scmd.Parameters.AddWithValue("@strLocation", Utilities.XSSHandling(strLocation));
            Scmd.Parameters.AddWithValue("@strChannel", Utilities.XSSHandling(strChannel));
            Scmd.Parameters.AddWithValue("@ApplicableLvlsExtra", tblExtraProd);
            Scmd.Parameters.AddWithValue("@MSMPAlies", MSMPAlies);
            Scmd.Parameters.AddWithValue("@strExtraProduct", Utilities.XSSHandling(strExtraProduct));
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -1)
            {
                return "-1|^|";
            }
            else if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -2)
            {
                return "-2|^|";
            }
            else
            {
                return "-3|^|";
            }
        }
        catch (Exception e)
        {
            return "2|^|" + e.Message;
        }
    }
}