using ClosedXML.Excel;
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

public partial class _StoreTypeWisseSectors : System.Web.UI.Page
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

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "69"))
                    GetSectorlstPopup();
                else
                    Response.Redirect("~/frmLogin.aspx");
            }
        }
    }
    private void GetSectorlstPopup()
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        DataSet Ds = DBHelper.ExecuteDataSet("spMasterGetSectors", sqlPara);

        StringBuilder sb = new StringBuilder();
        sb.Append("<ul>");
        if (Ds.Tables[0].Rows.Count > 0) {
            for (int i = 0; i < Ds.Tables[0].Rows.Count; i++)
                sb.Append("<li><input type='checkbox' class'mr-2' sectorId='" + Ds.Tables[0].Rows[i]["SectorID"] + "' onclick='fnIndividualSector(this);'>" + Ds.Tables[0].Rows[i]["Sector Name"] + "</li>");
        }
        else
            sb.Append("<li style='color: #f00; font-weight: 500;'>No Sector Found !</li>");

        sb.Append("</ul>");

        divSectorPopup.InnerHtml = sb.ToString();        
    }


    [System.Web.Services.WebMethod()]
    public static string fnGetReport()
    {
        try
        {
            Dictionary<string, string> sqlPara = new Dictionary<string, string>();
            DataSet Ds = DBHelper.ExecuteDataSet("spMasterGetStoreTypeSectorMapping", sqlPara);

            string[] SkipColumn = new string[1];
            SkipColumn[0] = "StoreTypeID";

            return "0|^|" + CreateMstrTbl(Ds.Tables[0], Ds.Tables[1], SkipColumn, "Report");

        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string CreateMstrTbl(DataTable dt, DataTable dtSector, string[] SkipColumn, string lbl)
    {
        StringBuilder sb = new StringBuilder();
        StringBuilder sbSector = new StringBuilder();
        sb.Append("<table id='tbl" + lbl + "' class='table table-striped table-bordered table-sm table-" + lbl + "'>");
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
        sb.Append("<th>Sector(s)</th>");
        sb.Append("<th>Action</th>");
        sb.Append("<th style='display: none;'>Search</th>");
        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sbSector.Clear();
            sbSector.Append(SectorStr(dt.Rows[i]["StoreTypeID"].ToString(), dtSector));

            sb.Append("<tr strId='" + dt.Rows[i]["StoreTypeID"] + "' sector='" + sbSector.ToString().Split('~')[0] + "'>");
            sb.Append("<td>" + (i + 1).ToString() + "</td>");

            for (int j = 0; j < dt.Columns.Count; j++)
            {

                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                {
                    sb.Append("<td>" + dt.Rows[i][j] + "</td>");
                }
            }
            sb.Append("<td>" + sbSector.ToString().Split('~')[1] + "</td>");
            sb.Append("<td><img src='../../Images/edit.png' onclick='fnEdit(this);'/></td>");


            // ---------------- Search String Start --------------------- //
            sb.Append("<td iden='search' style='display: none;'>");
            for (int j = 1; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                {
                    sb.Append(dt.Rows[i][j] + " ");
                }
            }
            sb.Append(sbSector.ToString().Split('~')[1].Replace(',', ' '));
            sb.Append("</td>");
            // ---------------- Search String End ----------------------- //


            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    private static string SectorStr(string strId, DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        StringBuilder sbdescr = new StringBuilder();

        DataRow[] dr = dt.Select("StoreTypeID=" + strId);
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

                sb.Append(dttemp.Rows[k]["SectorID"].ToString());
                sbdescr.Append(dttemp.Rows[k]["SectorName"].ToString());
            }
        }
        return sb.ToString() + "~" + sbdescr.ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string fnSave(string LoginID, object objMapping)
    {
        try
        {
            string strMapping = JsonConvert.SerializeObject(objMapping, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable dtMapping = JsonConvert.DeserializeObject<DataTable>(strMapping);
            if (dtMapping.Rows[0][0].ToString() == "0")
                dtMapping.Rows.RemoveAt(0);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spMasterManageStoreTypeSectorMapping";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@Mapping", dtMapping);
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();


            return "0|^|";
        }
        catch (Exception e)
        {
            return "1|^|" + e.Message;
        }
    }


    protected void btnDownload_Click(object sender, EventArgs e)
    {

        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        DataSet Ds = DBHelper.ExecuteDataSet("spMasterGetStoreTypeSectorMapping", sqlPara);

        //(from st in Ds.Tables[0].AsEnumerable()
        // join sec in Ds.Tables[1].AsEnumerable()
        // on st.Field<int>("Tax Id") equals sec.Field<int>("Tax Id")
        // select new
        // {
        //     ProductName = p.Field<string>("Product Name"),
        //     BrandName = p.Field<string>("Brand Name"),
        //     ProductCategory = t.Field<string>("Product Category"),
        //     TaxCharge = t.Field<int>("Charge")
        // }).ToList();

        DataTable dt = Ds.Tables[0];
        string filename = "Sub-BrandForm Codes dated " + DateTime.Now.ToString("dd-MMM-yyyy HH-mm-ss");

        string[] SkipColumn = new string[1];
        SkipColumn[0] = "SBFNodeId";


        XLWorkbook wb = new XLWorkbook();
        wb = AddWorkSheet(wb, dt, SkipColumn, "Sub-BrandForm Codes");
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
    private static XLWorkbook AddWorkSheet(XLWorkbook wb, DataTable dt, string[] SkipColumn, string Sheetname)
    {
        IXLCell cellStart;
        IXLCell cellEnd;
        int k = 0, j = 0;
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
        //ws.Columns().Width = 35;


        ws.Row(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        ws.Columns().AdjustToContents();

        return wb;
    }
}