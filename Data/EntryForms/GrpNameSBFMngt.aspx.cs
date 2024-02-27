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

public partial class _GrpNameSBFMngt : System.Web.UI.Page
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
                
                if (!(Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "25")))
                    Response.Redirect("~/frmLogin.aspx");
            }
        }
    }


    [System.Web.Services.WebMethod()]
    public static string GetReport(string LoginID, string UserID, string GroupID, string GroupName)
    {
        try
        {
            Dictionary<string, string> sqlPara = new Dictionary<string, string>();
            sqlPara.Add("SBFGroupID", GroupID);
            DataSet Ds = DBHelper.ExecuteDataSet("spGetSBFGroupForEdit", sqlPara);

            if (GroupID == "0")
            {
                string[] SkipColumn = new string[2];
                SkipColumn[0] = "SBFGROUPID";
                SkipColumn[1] = "STRSEARCH";
                return "0|^|" + CreateHtmlTbl(Ds.Tables[0], SkipColumn, "SBFGrp") + "|^|" + GroupName;
            }
            else
            {
                string[] SkipColumn = new string[0];
                return "0|^|" + CreateSBFHTML(Ds.Tables[0]) + "|^|" + GroupName;
            }
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
            sb.Append("<tr SBFGroupID='" + dt.Rows[i]["SBFGroupID"].ToString() + "' grpcode='" + dt.Rows[i]["SBFGroupCode"].ToString() + "' grpname='" + dt.Rows[i]["SBF Group Name"].ToString() + "'>");
            sb.Append("<td>" + (i + 1).ToString() + "</td>");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim().ToUpper()))
                {
                    if (dt.Columns[j].ColumnName.ToString().ToUpper() == "SBFGROUPCODE")
                        sb.Append("<td><input type='text' class='input-ctrl-txt' value='" + dt.Rows[i][j] + "' disabled></td>");
                    else if (dt.Columns[j].ColumnName.ToString().ToUpper() == "SBF GROUP NAME")
                        sb.Append("<td><input type='text' class='input-ctrl-txt' value='" + dt.Rows[i][j] + "' disabled></td>");
                    else if (dt.Columns[j].ColumnName.ToString().ToUpper() == "NO OF SBF" && Convert.ToInt16(dt.Rows[i][j]) > 0)
                        sb.Append("<td><a href='#' onclick='fnSBFlst(this);'>" + dt.Rows[i][j] + "</a></td>");
                    else
                        sb.Append("<td>" + dt.Rows[i][j].ToString() + "</td>");
                }
            }
            sb.Append("<td class='td-action'><img src='../../Images/edit.png' alt='edit' title='edit' onclick='fnEdit(this);'/></td>");
            sb.Append("<td iden='search' style='display: none;'>" + dt.Rows[i]["strSearch"].ToString() + "</td>");
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");

        return sb.ToString();
    }
    private static string CreateSBFHTML(DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<ul>");

        for (int i = 0; i < dt.Rows.Count; i++)
            sb.Append("<li>" + dt.Rows[i]["SBF"].ToString() + "</li>");

        sb.Append("</ul>");
        return sb.ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string fnAddEditGrpDetails(string GroupID, string GroupCode, string GroupName, string RoleID, string LoginID)
    {
        try
        {
            DataSet Ds = Utilities.AddEditSBFGroup(GroupID, GroupCode, GroupName, LoginID, RoleID);
            return "0|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
}