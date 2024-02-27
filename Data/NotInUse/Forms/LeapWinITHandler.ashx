<%@ WebHandler Language="C#" Class="FileInitUploadHandler" %>

using System;
using System.IO;
using System.Web;
using System.Data;
using System.Linq;
using System.Net.Mail;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using System.Runtime.Serialization.Formatters.Binary;
using System.Collections.Generic;

public class FileInitUploadHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        string loginId = context.Request.Form["LoginId"].ToString();
        string objProd = context.Request.Form["objProd"].ToString();
        string objLoc = context.Request.Form["objLoc"].ToString();
        string objChannel = context.Request.Form["objChannel"].ToString();
        string fromdate = context.Request.Form["fromdate"].ToString();
        string todate = context.Request.Form["todate"].ToString();
        string userId = context.Request.Form["user"].ToString();
        string objStage = context.Request.Form["objStage"].ToString();
        string roleId = context.Request.Form["role"].ToString();
        string flgPage = context.Request.Form["flgPage"].ToString();
        string flgInstance = context.Request.Form["flgInstance"].ToString();
        string objMSMP = context.Request.Form["objMSMP"].ToString();
        string objINITType = context.Request.Form["objINITType"].ToString();

        context.Response.Write(GenerateReport(loginId, objProd, objLoc, objChannel, fromdate, todate, userId, objStage, roleId, flgPage, flgInstance, objMSMP, objINITType));
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


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}