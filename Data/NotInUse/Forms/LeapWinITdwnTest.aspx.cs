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

public partial class Data_EntryForms_LeapWinITdwnTest : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string loginId = Session["LoginID"].ToString();
        string objProd = "";
        string objLoc = "";
        string objChannel = "";
        string fromdate = "01-Apr-22";
        string todate = "30-Apr-22";
        string userId = Session["UserID"].ToString();
        string objStage = "";
        string roleId = Session["RoleId"].ToString();
        string flgPage = "2";
        string flgInstance = "1";
        string objMSMP = "";
        string objINITType = "";

        Label1.Text = "started at " + DateTime.Now;
        Label1.Text = DateTime.Now + " : " + GenerateReport(loginId, objProd, objLoc, objChannel, fromdate, todate, userId, objStage, roleId, flgPage, flgInstance, objMSMP, objINITType);
    }

    private string GenerateReport(string login, string objProd, string objLoc, string objChannel, string fromdate, string todate, string user, string objStage, string role, string flgPage, string flgInstance, string objMSMP, string objINITType)
    {
        try
        {
            DataTable tblProd = new DataTable();
            tblProd.Columns.Add("col1", typeof(string));
            tblProd.Columns.Add("col2", typeof(string));
            tblProd.Columns.Add("col3", typeof(string));

            DataTable tblLoc = new DataTable();
            tblLoc.Columns.Add("col1", typeof(string));
            tblLoc.Columns.Add("col2", typeof(string));
            tblLoc.Columns.Add("col3", typeof(string));

            DataTable tblChannel = new DataTable();
            tblChannel.Columns.Add("col1", typeof(string));
            tblChannel.Columns.Add("col2", typeof(string));
            tblChannel.Columns.Add("col3", typeof(string));

            DataTable tblINITType = new DataTable();
            tblINITType.Columns.Add("col1", typeof(string));

            DataTable tblStage = new DataTable();
            tblStage.Columns.Add("col1", typeof(string));

            DataTable tblMSMP = new DataTable();
            tblMSMP.Columns.Add("col1", typeof(string));



            using (StreamWriter logfile = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\ErrorLog_" + login + "_" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + ".txt", true))
            {
                logfile.WriteLine("SP Calling Start at :" + DateTime.Now);
            }


            DataSet ds = new DataSet();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "[spExtractLeapExtractCSV]";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = Int32.MaxValue;
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
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            Sdap.Fill(ds);
            Sdap.Dispose();
            Scmd.Dispose();
            Scon.Dispose();



            using (StreamWriter logfile = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\ErrorLog_" + login + "_" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + ".txt", true))
            {
                logfile.WriteLine("SP Calling End at :" + DateTime.Now);
            }



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




            using (StreamWriter logfile = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\ErrorLog_" + login + "_" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + ".txt", true))
            {
                logfile.WriteLine("File writting Start at :" + DateTime.Now);
            }

            saveCSVFile(ds.Tables[0], SkipColumn, HttpContext.Current.Server.MapPath("~/Files/") + FileName + "_Scheme_Master.csv");
            saveCSVFile(ds.Tables[1], SkipColumn, HttpContext.Current.Server.MapPath("~/Files/") + FileName + "_Scheme_Criteria_Mapping.csv");

            using (StreamWriter logfile = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\ErrorLog_" + login + "_" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + ".txt", true))
            {
                logfile.WriteLine("File writting End at :" + DateTime.Now);
            }

            return "0|^|" + FileName + "_Scheme_Master.csv" + "|^|" + FileName + "_Scheme_Criteria_Mapping.csv";
        }
        catch (Exception ex)
        {
            return "1|^|Error:" + ex.Message.ToString();
        }
    }


    public void saveCSVFile(DataTable dt, string[] SkipColumn, string Path)
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
                        sb.Append(dt.Rows[i][j].ToString() + ", ");
                    else
                        sb.Append(dt.Rows[i][j].ToString());
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