using ClosedXML.Excel;
using DocumentFormat.OpenXml.EMMA;
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

public partial class _UserCounter : System.Web.UI.Page
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

                if (!(Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "68")))
                    Response.Redirect("~/frmLogin.aspx");
                else
                    GetMaster();
            }
        }
    }
    private void GetMaster()
    {
        StringBuilder sbMstr = new StringBuilder();
        StringBuilder sbSelectedstr = new StringBuilder();

        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("LoginID", hdnLoginID.Value);
        sqlPara.Add("UserID", hdnUserID.Value);
        DataSet Ds = DBHelper.ExecuteDataSet("spSBDGetQtr", sqlPara);

        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["QtrNo"].ToString() + "|" + Ds.Tables[0].Rows[i]["Year"].ToString() + "'>" + Ds.Tables[0].Rows[i]["QrtName"].ToString() + "</option>");

            if (Ds.Tables[0].Rows[i]["flgSelect"].ToString() == "1")
                sbSelectedstr.Append(Ds.Tables[0].Rows[i]["QtrNo"].ToString() + "|" + Ds.Tables[0].Rows[i]["Year"].ToString());
        }
        hdnMonthMstr.Value = sbMstr.ToString() + "|^|" + sbSelectedstr.ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string fnGetTableData(string Mth, string Yr)
    {
        try
        {
            Dictionary<string, string> sqlPara = new Dictionary<string, string>();
            sqlPara.Add("MonthVal", Mth);
            sqlPara.Add("YearVal", Yr);
            DataSet Ds = DBHelper.ExecuteDataSet("spUsageGetMOnthUsage", sqlPara);

            string[] SkipColumn = new string[0];
            return "0|^|" + CreateMstrTbl(Ds.Tables[0], SkipColumn, "tblReport", "clsReport");

        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string CreateMstrTbl(DataTable dt, string[] SkipColumn, string tblname, string cls)
    {
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
                sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");
            }
        }
        //sb.Append("<th>Action</th>");
        //sb.Append("<th style='display: none;'>Search</th>");
        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sbDescr.Clear();
            sb.Append("<tr>");
            sb.Append("<td>" + (i + 1).ToString() + "</td>");

            for (int j = 0; j < dt.Columns.Count; j++)
            {

                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                {
                    sb.Append("<td>" + dt.Rows[i][j] + "</td>");
                }
            }
            //sb.Append("<td><img src='../../Images/edit.png' onclick='fnEdit(this);'/></td>");
            //sb.Append("<td iden='search' style='display: none;'>");
            //for (int j = 1; j < dt.Columns.Count; j++)
            //{
            //    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
            //    {
            //        sb.Append(dt.Rows[i][j] + " ");
            //    }
            //}
            //sb.Append("</td>");

            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }


}