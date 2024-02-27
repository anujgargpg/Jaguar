<%@ WebHandler Language="C#" Class="FileUpload" %>

using System;
using System.IO;
using System.Web;
using System.Data;
using System.Linq;
using System.Net.Mail;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;
using ExcelDataReader;
using System.Text.RegularExpressions;

public class FileUpload : IHttpHandler, System.Web.SessionState.IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        try
        {
            var postedFile = context.Request.Files[0];
            string LoginID = context.Request.Form["LoginID"].ToString();
            string FileTypeId = context.Request.Form["FileTypeId"].ToString();      // 1: SBF Grp

            string msg = UploadFile(postedFile, LoginID, FileTypeId);
            context.Response.Write(msg);
        }
        catch (Exception ex)
        {
            context.Response.Write("1^Error - " + ex.Message);
        }
    }

    private string UploadFile(HttpPostedFile File_Up, string LoginID, string FileTypeId)
    {
        string filePath = "", sqlstmt = "";
        string newfilename = LoginID + "_" + DateTime.Now.ToString("yyyy-MM-dd") + "_" + DateTime.Now.ToString("HHmmss") + Path.GetExtension(File_Up.FileName); ;

        if (FileTypeId == "1")  // SBF Grp
        {
            filePath = HttpContext.Current.Server.MapPath("~/Uploads/SBFGroup/");
            sqlstmt = "truncate table tmpSBFGroupUpload";
        }
        else
            return "1^File type not defined !";

        //Create directory, if Not
        ValidateFolder(filePath);
        ValidateFolder(filePath + "Temp/");

        //Truncate Temp Table
        DataSet ds = new DataSet();
        SqlCommand Scmd = new SqlCommand();
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        Scmd = new SqlCommand(sqlstmt, Scon);
        Scon.Open();
        Scmd.ExecuteNonQuery();
        Scon.Close();
        Scmd.Dispose();

        //Get File ID
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spGetFileID]";
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.Parameters.AddWithValue("@FileName", newfilename);
        Scmd.Parameters.AddWithValue("@LoginID", LoginID);
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        Sdap.Fill(ds);
        Scmd.Dispose();
        Sdap.Dispose();

        string FileID = ds.Tables[0].Rows[0]["FileID"].ToString();
        string filename = FileID + "_" + newfilename;
        File_Up.SaveAs(filePath + "Temp/" + filename);      //Save File in Temp Folder


        DataTable dt = new DataTable();
        if (Path.GetExtension(File_Up.FileName).Substring(1).ToUpper() == "ZIP")
        {
            using (Ionic.Zip.ZipFile zip = Ionic.Zip.ZipFile.Read(filePath + "Temp/" + filename))
            {
                //zip.Password = "jokars";
                zip.ExtractAll(filePath + "Temp/" + Path.GetFileNameWithoutExtension(filename), Ionic.Zip.ExtractExistingFileAction.DoNotOverwrite);
            }

            string[] FilesInDir = Directory.GetFiles(filePath + "Temp/" + Path.GetFileNameWithoutExtension(filename), "*", SearchOption.AllDirectories);
            if (FilesInDir.Length > 0)
            {
                for (int i = 0; i < FilesInDir.Length; i++)
                {
                    if (Path.GetExtension(FilesInDir[i]).Substring(1).ToUpper() == "CSV")
                    {
                        if (dt.Rows.Count == 0)
                            dt = CSVToDatatable(filePath + "Temp/" + Path.GetFileNameWithoutExtension(filename) + "/", Path.GetFileName(FilesInDir[i]));
                        else
                            dt.Merge(CSVToDatatable(filePath + "Temp/" + Path.GetFileNameWithoutExtension(filename) + "/", Path.GetFileName(FilesInDir[i])));
                    }
                    else
                    {
                        if (dt.Rows.Count == 0)
                            dt = ExcelToDatatable(filePath + "Temp/" + Path.GetFileNameWithoutExtension(filename) + "/", Path.GetFileName(FilesInDir[i]));
                        else
                            dt.Merge(ExcelToDatatable(filePath + "Temp/" + Path.GetFileNameWithoutExtension(filename) + "/", Path.GetFileName(FilesInDir[i])));
                    }
                }
            }
            else
                return "1^No File found in " + Path.GetFileName(File_Up.FileName) + ".";
        }
        else if (Path.GetExtension(File_Up.FileName).Substring(1).ToUpper() == "CSV")
            dt = CSVToDatatable(filePath + "Temp/", filename);
        else
            dt = ExcelToDatatable(filePath + "Temp/", filename);


        if (dt.Rows.Count > 0)
        {
            DataColumn newColumnLogin = new DataColumn("FileID", typeof(string));
            newColumnLogin.DefaultValue = FileID;
            dt.Columns.Add(newColumnLogin);

            string res = UploadData(dt, FileTypeId);
            dt.Dispose();
            if (res != "0")
                return res;
            else
            {
                ds.Dispose();
                ds = new DataSet();
                Scmd = new SqlCommand();
                Scmd.Connection = Scon;
                Scmd.CommandText = "[spSBFGroupUploadFile]";
                Scmd.CommandType = CommandType.StoredProcedure;
                Scmd.Parameters.AddWithValue("@FileID", FileID);
                Scmd.Parameters.AddWithValue("@LoginID", LoginID);
                Scmd.CommandTimeout = 0;
                Sdap = new SqlDataAdapter(Scmd);
                Sdap.Fill(ds);
                Scmd.Dispose();
                Sdap.Dispose();
            }
        }
        else
        {
            dt.Dispose();
            return "1^No data found in " + Path.GetFileName(File_Up.FileName) + ".";
        }

        File.Move(filePath + "Temp/" + filename, filePath + filename);
        return "0^" + Path.GetFileName(File_Up.FileName) + " uploaded successfully.";
    }

    public DataTable CSVToDatatable(string FilePath, string FileName)
    {
        int lineNo = 0;
        int ColumnCount = 0;
        DataTable dt = new DataTable();
        using (StreamReader sr = new StreamReader(FilePath + FileName))
        {
            string[] headers = sr.ReadLine().Split(',');
            ColumnCount = headers.Length;
            for (int i = 0; i < ColumnCount; i++)
            {
                dt.Columns.Add(headers[i].Trim().Replace("\"", "").Replace("\r", ""));
            }

            while (!sr.EndOfStream)
            {
                lineNo++;
                string[] CellArr = sr.ReadLine().Split(',');

                DataRow dr = dt.NewRow();
                for (int i = 0; i < CellArr.Length; i++)
                {
                    dr[i] = CellArr[i];
                }
                dt.Rows.Add(dr);
            }
        }

        return dt;
    }

    public DataTable ExcelToDatatable(string FilePath, string FileName)
    {
        DataSet ds = new DataSet();
        using (FileStream oStream = File.Open((FilePath + FileName), FileMode.Open, FileAccess.Read))
        {
            IExcelDataReader iExcelDataReader = null;
            string extension = Path.GetExtension(FilePath + FileName);
            var conf = new ExcelDataSetConfiguration
            {
                ConfigureDataTable = _ => new ExcelDataTableConfiguration
                {
                    UseHeaderRow = true
                }
            };
            if (extension == ".xls" || extension == ".xlsb")
            {
                iExcelDataReader = ExcelReaderFactory.CreateBinaryReader(oStream);
            }
            else if (extension == ".xlsx")
            {
                iExcelDataReader = ExcelReaderFactory.CreateOpenXmlReader(oStream);
            }
            else if (extension == ".csv")
            {
                iExcelDataReader = ExcelReaderFactory.CreateCsvReader(oStream);
            }
            ds = iExcelDataReader.AsDataSet(conf);
        }
        return ds.Tables[0];
    }


    public string UploadData(DataTable dtRecords, string FileTypeId)
    {
        string[] ArrColumnName = new string[0];
        switch (FileTypeId)
        {
            case "1":           // SBF Grp
                ArrColumnName = new string[6];
                ArrColumnName[0] = "CATEGORY_NAME";
                ArrColumnName[1] = "NIELSEN_BRAND";
                ArrColumnName[2] = "SBFName";
                ArrColumnName[3] = "LPH_SKU";
                ArrColumnName[4] = "LPH_SKUCode";
                ArrColumnName[5] = "FileID";
                break;
        }

        try
        {
            string strcon = DBHelper.getDBConnectionString();

            if (dtRecords.Columns.Count != ArrColumnName.Length)
                return "1^Column count mis-match. Plz re-verify the File !";

            for (int j = 0; j < dtRecords.Columns.Count; j++)
            {
                if (!ArrColumnName.Contains(dtRecords.Columns[j].ColumnName.ToString().Trim()))
                    return "1^" + dtRecords.Columns[j].ColumnName.ToString().Trim() + " column is not a valid defined column. Please check..";
            }

            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(strcon))
            {
                bulkCopy.BatchSize = 1000;
                bulkCopy.NotifyAfter = 1000;

                if (FileTypeId == "1")         // SBF Group
                {
                    bulkCopy.DestinationTableName = "tmpSBFGroupUpload";
                    bulkCopy.ColumnMappings.Add(ArrColumnName[0], "[CATEGORY_NAME]");
                    bulkCopy.ColumnMappings.Add(ArrColumnName[1], "[NIELSEN_BRAND]");
                    bulkCopy.ColumnMappings.Add(ArrColumnName[2], "[SBFName]");
                    bulkCopy.ColumnMappings.Add(ArrColumnName[3], "[LPH_SKU]");
                    bulkCopy.ColumnMappings.Add(ArrColumnName[4], "[LPH_SKUCode]");
                    bulkCopy.ColumnMappings.Add(ArrColumnName[5], "[FileID]");
                }

                System.Data.SqlClient.SqlBulkCopyColumnMappingCollection sbcmc = bulkCopy.ColumnMappings;
                bulkCopy.WriteToServer(dtRecords);
            }
            return "0";
        }
        catch (Exception ex)
        {
            return "1^" + ex.Message + " !";
        }
    }


    public void CreateLogfile(string msg)
    {
        //string strFilePath = HttpContext.Current.Server.MapPath("~/Logs/SBFGroup/"); FilePath + "\\Log\\" + System.DateTime.Now.Year.ToString("0000") + "-" + System.DateTime.Now.Month.ToString("00") + "-" + System.DateTime.Now.Day.ToString("00") + " " + Status + ".log";
        //StreamWriter strWrite = default(StreamWriter);
        //try
        //{
        //    if (!System.IO.Directory.Exists(FilePath + "\\Log"))
        //        System.IO.Directory.CreateDirectory(FilePath + "\\Log");

        //    if (System.IO.File.Exists(strFilePath))
        //        strWrite = File.AppendText(strFilePath);
        //    else
        //        strWrite = File.CreateText(strFilePath);

        //    strWrite.WriteLine(msg);
        //    strWrite.Close();
        //}
        //catch
        //{
        //    //
        //}
        //finally
        //{
        //    strWrite = null;
        //    System.GC.Collect();
        //}
    }

        
    public static void ValidateFolder(string FolderPath)
    {
        if (!System.IO.Directory.Exists(FolderPath))
            System.IO.Directory.CreateDirectory(FolderPath);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}