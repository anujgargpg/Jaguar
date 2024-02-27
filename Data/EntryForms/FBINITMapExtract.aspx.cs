using ClosedXML.Excel;
using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
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

                if (!(Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "88")))
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
        DataSet Ds = DBHelper.ExecuteDataSet("spINITGetINITMatser", sqlPara);

        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["Start Date"].ToString() + "|" + Ds.Tables[0].Rows[i]["End Date"].ToString() + "'>" + Ds.Tables[0].Rows[i]["Month"].ToString() + "</option>");

            if (Ds.Tables[0].Rows[i]["flgSelect"].ToString() == "1")
                sbSelectedstr.Append(Ds.Tables[0].Rows[i]["Start Date"].ToString() + "|" + Ds.Tables[0].Rows[i]["End Date"].ToString());
        }
        hdnMonthMstr.Value = sbMstr.ToString() + "|^|" + sbSelectedstr.ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string fnGetTableData(string FromDate, string EndDate, string RoleID, string UserID, string LoginID)
    {
        try
        {
            Dictionary<string, string> sqlPara = new Dictionary<string, string>();
            sqlPara.Add("FromDate", FromDate);
            sqlPara.Add("EndDate", EndDate);
            sqlPara.Add("RoleID", RoleID);
            sqlPara.Add("UserID", UserID);
            sqlPara.Add("LoginID", LoginID);
            DataSet Ds = DBHelper.ExecuteDataSet("spINIT_FBMapExtract", sqlPara);

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
        sb.Append("<table id='" + tblname + "' class='table table-striped table-bordered table-sm " + cls + "'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th>#</th>");
        for (int j = 0; j < dt.Columns.Count; j++)
            if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");

        //sb.Append("<th>Action</th>");
        sb.Append("<th style='display: none;'>Search</th>");
        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sb.Append("<tr>");
            sb.Append("<td>" + (i + 1).ToString() + "</td>");

            for (int j = 0; j < dt.Columns.Count; j++)
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                    sb.Append("<td>" + dt.Rows[i][j] + "</td>");

            //sb.Append("<td><img src='../../Images/edit.png' onclick='fnEdit(this);'/></td>");
            sb.Append("<td iden='search' style='display: none;'>");
            for (int j = 1; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                {
                    sb.Append(dt.Rows[i][j] + " ");
                }
            }
            sb.Append("</td>");

            sb.Append("</tr>");
        }

        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }


    protected void btnDownload_Click(object sender, EventArgs e)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("FromDate", hdnMonthMstr.Value.Split('|')[0]);
        sqlPara.Add("EndDate", hdnMonthMstr.Value.Split('|')[1]);
        sqlPara.Add("RoleID", hdnRoleID.Value);
        sqlPara.Add("UserID", hdnUserID.Value);
        sqlPara.Add("LoginID", hdnLoginID.Value);
        DataSet Ds = DBHelper.ExecuteDataSet("spINIT_FBMapExtract", sqlPara);

        XLWorkbook wb = new XLWorkbook();
        string[] SkipColumn = new string[0];
        wb = AddWorkSheet(wb, Ds.Tables[0], SkipColumn, "FB-INIT Mapping", true, false);
        try
        {
            //Export the Excel file.
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Buffer = true;
            HttpContext.Current.Response.Charset = "";
            HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=FB-INIT Mapping dated " + DateTime.Now.ToString("dd-MMM-yyyy hhmmss") + ".xlsx");
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
    private static XLWorkbook AddWorkSheet(XLWorkbook wb, DataTable dt, string[] SkipColumn, string Sheetname, bool IsSBD, bool IsBaseProxyMap)
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
                    ws.Cell(k, j).Value = dt.Rows[b][c].ToString();
                }
            }
        }
        cellEnd = ws.Cell(k, j);

        ws.Range(cellStart, cellEnd).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
        ws.Range(cellStart, cellEnd).Style.Alignment.SetVertical(XLAlignmentVerticalValues.Center);
        ws.Range(cellStart, cellEnd).Style.Border.SetInsideBorder(XLBorderStyleValues.Thin);
        ws.Range(cellStart, cellEnd).Style.Border.SetOutsideBorder(XLBorderStyleValues.Medium);
        ws.Range(cellStart, cellEnd).Style.Font.SetFontSize(10);
        ws.SheetView.FreezeRows(FreezeRows);
        //ws.Columns().AdjustToContents();

        ws.Row(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        ws.Column(1).Width = 15;
        ws.Column(2).Width = 45;
        ws.Column(3).Width = 25;
        ws.Column(4).Width = 15;
        ws.Column(5).Width = 45;
        ws.Column(6).Width = 25;
        //ws.Columns().Width = 20;

        return wb;
    }
}