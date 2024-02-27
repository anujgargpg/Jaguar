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

public partial class _SBFGrpMapping : System.Web.UI.Page
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
                
                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "25"))
                    GetMaster();
                else
                    Response.Redirect("~/frmLogin.aspx");
            }
        }
    }
    private void GetMaster()
    {
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());

        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandTimeout = 0;
        Scmd.CommandText = "[spSBFGroupGetProdHier]";
        Scmd.CommandType = CommandType.StoredProcedure;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Sdap.Dispose();
        Scmd.Dispose();


        ddlCategoryFilter.Items.Add(new ListItem("--Select--", "0"));
        for (int i = 0; i < Ds.Tables[0].Rows.Count; i++)
            ddlCategoryFilter.Items.Add(new ListItem(Ds.Tables[0].Rows[i]["Category"].ToString(), Ds.Tables[0].Rows[i]["CatNOdeID"].ToString()));

        hdnBrandMstr.Value = JsonConvert.SerializeObject(Ds.Tables[1], Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }).ToString();
        hdnBrandFormMstr.Value = JsonConvert.SerializeObject(Ds.Tables[2], Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }).ToString();


        Ds.Clear();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandTimeout = 0;
        Scmd.CommandText = "[spSBFGroupGetGroups]";
        Scmd.CommandType = CommandType.StoredProcedure;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);

        hdnGroupMstr.Value = JsonConvert.SerializeObject(Ds.Tables[0], Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }).ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string GetReport(string LoginID, string UserID, string Category, string Brand, string BrandForm, string flgSBFType)
    {
        try
        {
            Dictionary<string, string> sqlPara = new Dictionary<string, string>();
            sqlPara.Add("LoginID", LoginID);
            sqlPara.Add("UserID", UserID);
            sqlPara.Add("CategoryNodeID", Category);
            sqlPara.Add("BrandNodeID", Brand);
            sqlPara.Add("BrandFormNodeID", BrandForm);
            sqlPara.Add("flgNew", flgSBFType);
            DataSet Ds = DBHelper.ExecuteDataSet("spSBFGroupGetSBFToMapGroup", sqlPara);

            string[] SkipColumn = new string[5];
            SkipColumn[0] = "BRANDNODEID";
            SkipColumn[1] = "NODEID";
            SkipColumn[2] = "SBFGROUPID";
            SkipColumn[3] = "CATNODEID";
            SkipColumn[4] = "STRSEARCH";
            return "0|^|" + CreateHtmlTbl(Ds.Tables[0], SkipColumn, "SBFGrpMapping");
        }
        catch (Exception ex)
        {
            return "1|^|<div class='error-msg'>Error  :   " + ex.Message + "</div>";
        }
    }
    private static string CreateHtmlTbl(DataTable dt, string[] SkipColumn, string tblname)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<table id='tbl" + tblname + "' class='table table-sm table-bordered mb-0 cls-" + tblname + "'>");
        sb.Append("<thead>");
        sb.Append("<tr>");

        sb.Append("<th>#</th>");
        //sb.Append("<th><input type='checkbox' onclick='fnCheckAll(this);'/></th>");
        for (int j = 0; j < dt.Columns.Count; j++)
            if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim().ToUpper()))
                sb.Append("<th>" + dt.Columns[j].ColumnName + "</th>");

        sb.Append("<th>Action</th>");
        sb.Append("<th style='display: none;'>Search</th>");
        sb.Append("</tr>");
        sb.Append("</thead>");

        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sb.Append("<tr CatNodeID='" + dt.Rows[i]["CatNodeID"].ToString() + "' brandId='" + dt.Rows[i]["BrandNodeID"].ToString() + "' sbfId='" + dt.Rows[i]["NodeID"].ToString() + "'>");

            sb.Append("<td>" + (i + 1).ToString() + "</td>");
            //sb.Append("<td><input type='checkbox' onclick='fnCheckIndividual(this);'/></td>");
            for (int j = 0; j < dt.Columns.Count; j++)
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim().ToUpper()))
                {
                    if (dt.Columns[j].ColumnName.ToString().ToUpper() == "SBF GROUP")
                    {
                        sb.Append("<td>");
                        sb.Append("<div style='position: relative;'>");
                        sb.Append("<input type='text' class='input-ctrl-txt' selectedid='" + dt.Rows[i]["SBFGrouPID"] + "' value='" + dt.Rows[i][j] + "' onkeyup='fnShowGroupPopup(this);' onclick='fnShowGroupPopup(this);'>");
                        sb.Append("<div class='popup-content popup-content-grp'><div class='popup-content-body'></div><div class='popup-content-footer'><a href='#' class='btn btn-primary' onclick='fnHideCtrlPopup()'>Close</a></div></div>");
                        sb.Append("</div>");
                        sb.Append("</td>");
                    }
                    else
                        sb.Append("<td>" + dt.Rows[i][j].ToString() + "</td>");
                }

            sb.Append("<td class='td-action'><img src='../../Images/save.png' alt='save mapping' title='save mapping' onclick='fnUpdateMapping(this);'/></td>");
            sb.Append("<td iden='search' style='display: none;'>" + dt.Rows[i]["strSearch"].ToString() + "</td>");
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");

        return sb.ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string fnUpdateMapping(string strSBFGroiPMapping, string UserID, string LoginID)
    {
        try
        {
            DataSet Ds = Utilities.SBFGroupMapping(strSBFGroiPMapping, LoginID, UserID);
            return "0|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnAddEditGroup(string GroupID, string GroupCode, string GroupName, string RoleID, string LoginID)
    {
        try
        {
            DataSet Ds = Utilities.AddEditSBFGroup(GroupID, GroupCode, GroupName, LoginID, RoleID);
            GroupID = Ds.Tables[0].Rows[0]["GroupID"].ToString();

            Ds.Clear();
            Dictionary<string, string> sqlPara = new Dictionary<string, string>();
            Ds = DBHelper.ExecuteDataSet("spSBFGroupGetGroups", sqlPara);
            string GrpMstr = JsonConvert.SerializeObject(Ds.Tables[0], Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }).ToString();

            return "0|^|" + GroupID + "|^|" + GroupName + "|^|" + GrpMstr;
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
}