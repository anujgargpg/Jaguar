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


public partial class Data_EntryForms_ChannelSummaryDownload : System.Web.UI.Page
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
                hdnLoginID.Value = Session["LoginID"].ToString();
                hdnUserID.Value = Session["UserID"].ToString();
                hdnRoleID.Value = Session["RoleId"].ToString();
                hdnNodeID.Value = Session["NodeId"].ToString();
                hdnNodeType.Value = Session["NodeType"].ToString();

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "22"))
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
        Scmd.CommandText = "spGetMonthswithCM";
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
            itm.Value = dr["MonthVal"].ToString() + "^" + dr["YEarVal"].ToString();
            itm.Attributes.Add("startdt", dr["startdt"].ToString());
            ddlMonth.Items.Add(itm);
            if (dr["flgSelect"].ToString() == "1")
            {
                itm.Selected = true;
            }
        }

        Ds.Clear();
        StringBuilder sbMSMP = new StringBuilder();
        StringBuilder sbProcessGrpLegend = new StringBuilder();
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

        //------- MSMP
        sbMSMP.Clear();
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
    

    protected void btnDownload_Click(object sender, EventArgs e)
    {
        DataTable tbl = new DataTable();
        tbl.Columns.Add("Col1", typeof(Int32));

        DataTable tblProd = new DataTable();
        tblProd.Columns.Add("Col1", typeof(Int32));
        tblProd.Columns.Add("Col2", typeof(Int32));
        tblProd.Columns.Add("Col3", typeof(Int32));
        if (hdnProductSelectedValue.Value != "")
        {
            for (var i = 0; i < hdnProductSelectedValue.Value.Split('^').Length; i++)
            {
                DataRow dr = tblProd.NewRow();
                dr[0] = hdnProductSelectedValue.Value.Split('^')[i].Split('|')[0];
                dr[1] = hdnProductSelectedValue.Value.Split('^')[i].Split('|')[1];
                dr[2] = "1";
                tblProd.Rows.Add(dr);
            }
        }

        DataTable tblLoc = new DataTable();
        tblLoc.Columns.Add("Col1", typeof(Int32));
        tblLoc.Columns.Add("Col2", typeof(Int32));
        tblLoc.Columns.Add("Col3", typeof(Int32));
        if (hdnLocationSelectedValue.Value != "")
        {
            for (var i = 0; i < hdnLocationSelectedValue.Value.Split('^').Length; i++)
            {
                DataRow dr = tblLoc.NewRow();
                dr[0] = hdnLocationSelectedValue.Value.Split('^')[i].Split('|')[0];
                dr[1] = hdnLocationSelectedValue.Value.Split('^')[i].Split('|')[1];
                dr[2] = "2";
                tblLoc.Rows.Add(dr);
            }
        }

        DataTable tblChannel = new DataTable();
        tblChannel.Columns.Add("Col1", typeof(Int32));
        tblChannel.Columns.Add("Col2", typeof(Int32));
        tblChannel.Columns.Add("Col3", typeof(Int32));
        if (hdnChannelSelectedValue.Value != "")
        {
            for (var i = 0; i < hdnChannelSelectedValue.Value.Split('^').Length; i++)
            {
                DataRow dr = tblChannel.NewRow();
                dr[0] = hdnChannelSelectedValue.Value.Split('^')[i].Split('|')[0];
                dr[1] = hdnChannelSelectedValue.Value.Split('^')[i].Split('|')[1];
                dr[2] = "3";
                tblChannel.Rows.Add(dr);
            }
        }

        DataTable tblInitType = new DataTable();
        tblInitType.Columns.Add("Col1", typeof(Int32));
        if (hdnINITType.Value != "")
        {
            for (var i = 0; i < hdnINITType.Value.Split('^').Length - 1; i++)
            {
                DataRow dr = tblInitType.NewRow();
                dr[0] = hdnINITType.Value.Split('^')[i];
                tblInitType.Rows.Add(dr);
            }
        }

        DataTable tblUser = new DataTable();
        tblUser.Columns.Add("Col1", typeof(Int32));
        if (hdnMSMPAlies.Value != "")
        {
            for (var i = 0; i < hdnMSMPAlies.Value.Split('^').Length - 1; i++)
            {
                DataRow dr = tblUser.NewRow();
                dr[0] = hdnMSMPAlies.Value.Split('^')[i];
                tblUser.Rows.Add(dr);
            }
        }

        DataSet ds = new DataSet();
        SqlConnection Scon = new SqlConnection(ConfigurationManager.AppSettings["strConn"]);
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spGenerateChannelSummary]";
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Scmd.Parameters.AddWithValue("@MonthVal", ddlMonth.SelectedValue.ToString().Split('^')[0]);
        Scmd.Parameters.AddWithValue("@YearVal", ddlMonth.SelectedValue.ToString().Split('^')[1]);
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@UserID", hdnUserID.Value);
        Scmd.Parameters.AddWithValue("@RoleID", hdnRoleID.Value);
        Scmd.Parameters.AddWithValue("@INITID", tbl);
        Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
        Scmd.Parameters.AddWithValue("@LocSelection", tblLoc);
        Scmd.Parameters.AddWithValue("@ChannelSelection", tblChannel);
        Scmd.Parameters.AddWithValue("@flgIncludeReadyForRealsed", hdnIncludeReleased.Value);
        Scmd.Parameters.AddWithValue("@flgWithSystemPart", ddlSystemPart.Value);
        Scmd.Parameters.AddWithValue("@Users", tblUser);
        //Scmd.Parameters.AddWithValue("@INITTypeIDs", tblInitType);
        Scmd.Parameters.AddWithValue("@flgMR", hdnMR.Value);
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        Sdap.Fill(ds);

        if (!File.Exists(Server.MapPath("~/Uploads/") + ds.Tables[0].Rows[0][0].ToString()))
        {
            divMsg.InnerHtml = "<span style='color:red;font-size:12px;'>File not available.</span>";
        }
        else
        {
            clsExcelDownload.ConvertToExcelNew(ds, "existing", ddlMonth.SelectedItem.Text);
        }


        // ConvertToExcelNew(ds);
    }
    public void ConvertToExcel(DataSet ds, string strFilenamewithpath)
    {
        //FnWriteLogFile_Log("", "ConvertToExcel1");

        //Instance reference for Excel Application
        Microsoft.Office.Interop.Excel.Application objXL = null;

        //Workbook refrence
        Microsoft.Office.Interop.Excel.Workbook objWB = null;
        objXL = new Microsoft.Office.Interop.Excel.Application();

        // Find the Excel Process Id (ath the end, you kill him
        int id;
        GetWindowThreadProcessId(objXL.Hwnd, out id);
        Process excelProcess = Process.GetProcessById(id);
        //FnWriteLogFile_Log("", "ConvertToExcel3");
        objWB = objXL.Workbooks.Open(Server.MapPath("~/Uploads/") + ds.Tables[0].Rows[0][0].ToString());// Server.MapPath("\Log\Feet on Street Report.xlsx");

        try

        {
            //Adding WorkBook
            ////objWB = objXL.Workbooks.Add(1);//ds.Tables.Count  //  Server.MapPath("~/ExcelFile/Log/myexcel.xlsx") + ""

            //Variable to keep sheet count
            int sheetcount = 1;

            //Do I need to explain this ??? If yes please close my website and learn abc of .net .
            ////oSheet = oWorkBook.Sheets.Item(1)
            //FnWriteLogFile_Log("", "add sheet");
            Microsoft.Office.Interop.Excel.Worksheet objSHT = null;
            objSHT = (Microsoft.Office.Interop.Excel.Worksheet)objWB.Sheets[4];
            DataTable dt = ds.Tables[2];


            //Adding sheet to workbook for each datatable

            //Naming sheet as SheetData1.SheetData2 etc....
            //FnWriteLogFile_Log("", "Naming sheet");
            objSHT.Name = ds.Tables[1].Rows[0][0].ToString();

            for (int i = 0; i < dt.Columns.Count; i++)
            {
                objSHT.Cells[1, i + 1] = dt.Columns[i].ColumnName.ToString();
                objSHT.Range[objSHT.Cells[1, i + 1], objSHT.Cells[1, i + 1]].Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.Color.LightSteelBlue);
            }

            Int32 rows;
            Int32 columns;
            rows = dt.Rows.Count;
            columns = dt.Columns.Count;

            var Data = new object[rows - 1 + 1, columns - 1 + 1];

            for (var i = 0; i <= dt.Rows.Count - 1; i += 1)
            {
                for (var j = 0; j <= dt.Columns.Count - 1; j += 1)
                    Data[i, j] = Utilities.HTMLDecode(dt.Rows[i][j].ToString());
            }

            var startCell = objSHT.Cells[2, 1];
            var endCell = objSHT.Cells[1 + dt.Rows.Count, dt.Columns.Count];
            var writeRange = objSHT.Range[startCell, endCell];
            writeRange.Value = Data;


            //Saving the work book
            objSHT = (Microsoft.Office.Interop.Excel.Worksheet)objWB.Sheets[1];
            objSHT.Activate();
            ////objSHT.Select(Type.Missing);
            objWB.Saved = true;
            objWB.SaveCopyAs(Server.MapPath("~/Uploads/New/") + ds.Tables[0].Rows[0][0].ToString());

            //Closing work book
            //FnWriteLogFile_Log("", "objWB.Close()");
            objWB.Close();

            //Closing excel application
            objXL.Quit();

            //FnWriteLogFile_Log("", "set null");
            objSHT = null;
            objWB = null;
            objXL = null;

            GC.Collect();
            GC.WaitForPendingFinalizers();

            if (objSHT != null)
                Marshal.ReleaseComObject(objSHT);

            if (objWB != null)
                Marshal.ReleaseComObject(objWB);

            if (objXL != null)
                Marshal.ReleaseComObject(objXL);

            ////FnWriteLogFile_Log("", "complete");
        }
        catch (Exception ex)
        {
            //FnWriteLogFile_Log("", "Error:" + ex.StackTrace.ToString());
            if (objWB != null)
            {
                objWB.Close();
                objXL.Quit();

                // objSHT = null;
                objWB = null;
                objXL = null;

                GC.Collect();
                GC.WaitForPendingFinalizers();

                //if (objSHT != null)
                //    Marshal.ReleaseComObject(objSHT);

                if (objWB != null)
                    Marshal.ReleaseComObject(objWB);

                if (objXL != null)
                    Marshal.ReleaseComObject(objXL);
            }

        }
        finally
        {
            //FnWriteLogFile_Log("", "Check HasExited");
            if (!excelProcess.HasExited)
            {
                //FnWriteLogFile_Log("", "kill process");
                excelProcess.Kill();
                //FnWriteLogFile_Log("", "end kill process");
            }
        }

    }
    
}