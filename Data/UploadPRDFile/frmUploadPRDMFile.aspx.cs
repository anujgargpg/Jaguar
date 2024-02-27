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
using System.IO;


public partial class Data_UploadPRDFile_frmUploadPRDMFile : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["LoginID"] == null)
        {
            Response.Redirect("../../frmLogin.aspx");
        }

        if (!IsPostBack)
        {
            if (!(Utilities.ValidateRoleBasedAccess(Session["RoleId"].ToString(), "28")))
            {
                Response.Redirect("../../frmLogin.aspx");
            }
        }
    }

    protected void btnRead_Click(object sender, EventArgs e)
    {
        string csvPath = Server.MapPath("~/Files/") + Path.GetFileName(FileUpload1.PostedFile.FileName);
        if (File.Exists(csvPath))
            File.Delete(csvPath);
        FileUpload1.SaveAs(csvPath);

        string Filename = Path.GetFileName(FileUpload1.PostedFile.FileName);

        string FileSetID = fnGetFileSetID(Filename);

        if (FileSetID.Split('^')[0] == "1")
            FileSetID = FileSetID.Split('^')[1];
        else
            FileSetID = "0";
        string ErrorMsg = "";
        DataTable dataTable = new DataTable();
        // Create a DataTable.
        if (FileSetID != "0")
        {
            using (StreamReader SR = new StreamReader(csvPath))
            {
                string[] Headers = SR.ReadLine().Split('|');

                var lineno = 0;
                var maxcol = 0;
                maxcol = Headers.Count();

                for (int i = 0; i <= Headers.Count() - 1; i++)
                    dataTable.Columns.Add(Headers[i].Trim().Replace("\"", "").Replace(@"r\", ""));
                dataTable.Columns.Add("FileSetID");
                while (!SR.EndOfStream)
                {
                    lineno = lineno + 1;

                    string test = SR.ReadLine();
                    string[] rows = System.Text.RegularExpressions.Regex.Split(test, @"(?<!\\)\|").Select(x => x.Replace("\"", "")).ToArray(); // (""[^""]*""|[^|]*)

                    if ((maxcol == rows.Count()))
                    {
                        var DRow = dataTable.NewRow();
                        for (int i = 0; i <= rows.Count() - 1; i++)
                            DRow[i] = rows[i];
                        DRow[rows.Count()] = FileSetID;
                        dataTable.Rows.Add(DRow);
                    }
                }
            }
            try
            {

                // ''''''''''''''''' Truncate Table ''''''''''''''''''''''''
                string consString = DBHelper.getDBConnectionString();
                string strSQL;
                strSQL = "TRUNCATE TABLE tmpProductMaster";
                using (SqlConnection connection = new SqlConnection(consString))
                {
                    SqlCommand cmd = new SqlCommand(strSQL, connection);
                    cmd.Connection.Open();
                    cmd.ExecuteNonQuery();
                }

                // '''''''''''''''''' Insert Data ''''''''''''''''''''''''
                using (SqlConnection con = new SqlConnection(consString))
                {
                    using (SqlBulkCopy sqlBulkCopy = new SqlBulkCopy(con))
                    {
                        // Set the database table name.
                        sqlBulkCopy.DestinationTableName = "dbo.tmpProductMaster";
                        con.Open();
                        sqlBulkCopy.WriteToServer(dataTable);
                        con.Close();
                    }
                }
                var strReturn = fnExecutePrdUploadFromTmpTable();

                if (strReturn.Split('^')[0] == "1")
                    lblMsg.Text = "File Uploaded Successfully...";
                else if (strReturn.Split('^')[0] == "3")
                {
                    lblMsg.Text = "File Uploaded Successfully...";
                    tblbrandpopup.Attributes.Add("style", "display:block");
                    dvSubBrandName.InnerHtml = strReturn.Split('^')[1];
                }
                else
                    lblMsg.Text = "Error--" + strReturn.Split('^')[1];
            }
            catch (Exception ex)
            {
                lblMsg.Text = "Error..." + ex.Message;
            }
        }
    }


    public string fnGetFileSetID(string FileName)
    {
        SqlConnection Objcon2 = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand objCom2 = new SqlCommand("[spFileGetFileSetID]", Objcon2);
        objCom2.Parameters.Add("@FileName", SqlDbType.VarChar).Value = FileName;
        objCom2.Parameters.Add("@LoginID", SqlDbType.Int).Value = 1; // Session("LoginID")

        SqlParameter retValParam = new SqlParameter("@FileSetID", System.Data.SqlDbType.Int);
        retValParam.Direction = System.Data.ParameterDirection.Output;
        objCom2.Parameters.Add(retValParam);

        objCom2.CommandType = CommandType.StoredProcedure;
        objCom2.CommandTimeout = 0;
        int FileSetID = 0;
        SqlDataReader dr;
        string strReturn;
        try
        {
            Objcon2.Open();
            dr = objCom2.ExecuteReader();
            // dr.Read()
            FileSetID = Convert.ToInt32(retValParam.Value);  // dr.Item("FileSetID")
            strReturn = "1^" + FileSetID;
        }
        catch (Exception ex)
        {
            strReturn = "2^" + ex.Message;
        }
        finally
        {
            objCom2.Dispose();
            Objcon2.Close();
            Objcon2.Dispose();
        }
        return strReturn;
    }

    public string fnExecutePrdUploadFromTmpTable()
    {
        SqlConnection Objcon2 = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand objCom2 = new SqlCommand("[spPrdUploadFromTmpTable]", Objcon2);

        objCom2.CommandType = CommandType.StoredProcedure;
        objCom2.CommandTimeout = 0;


        string strReturn;

        SqlDataAdapter da = new SqlDataAdapter(objCom2);
        DataSet ds = new DataSet();
        da.Fill(ds);


        try
        {
            if (ds.Tables[0].Rows.Count > 0)
            {
                StringBuilder strTable = new StringBuilder();
                strTable.Append("<table class='table table-bordered table-sm table-striped' id='tblMain'>");
                strTable.Append("<thead>");
                strTable.Append("<tr>");
                strTable.Append("<th>");
                strTable.Append("Category");
                strTable.Append("</th>");
                strTable.Append("<th>");
                strTable.Append("Brand");
                strTable.Append("</th>");
                strTable.Append("<th>");
                strTable.Append("BrandForm name");
                strTable.Append("</th>");
                strTable.Append("<th>");
                strTable.Append("Sub Brand Form");
                strTable.Append("</th>");
                strTable.Append("<th>");
                strTable.Append("Product Code");
                strTable.Append("</th>");
                strTable.Append("<th>");
                strTable.Append("Sub Brand Form");
                strTable.Append("</th>");
                strTable.Append("</tr>");

                strTable.Append("</thead>");
                string ddlSubBrandForm = "";
                ddlSubBrandForm += "<option value = 'NA'>- Select SubBrandForm -</option>";
                foreach (DataRow dr in ds.Tables[1].Rows)
                    // ddlSubBrandForm &= "<option value = " & dr.Item("Id") & ">" & dr.Item("BrandForm_Name").ToString() & "</Option>"
                    ddlSubBrandForm += "<option>" + dr["Sub_BrandForm_Name"].ToString() + "</Option>";

                foreach (DataRow dataR in ds.Tables[0].Rows)
                {
                    strTable.Append("<tr NodeId = '" + dataR["NodeID"] + "'  NodeType = '" + dataR["NodeType"] + "' >");
                    strTable.Append("<td>");
                    strTable.Append(dataR["Category_name"]);
                    strTable.Append("</td>");

                    strTable.Append("<td>");
                    strTable.Append(dataR["Brand_name"]);
                    strTable.Append("</td>");

                    strTable.Append("<td>");
                    strTable.Append(dataR["BrandForm_name"]);
                    strTable.Append("</td>");
                    strTable.Append("<td>");
                    strTable.Append(dataR["Sub_BrandForm_name"]);
                    strTable.Append("</td>");
                    strTable.Append("<td>");
                    strTable.Append(dataR["product_code"]);
                    strTable.Append("</td>");
                    strTable.Append("<td>");
                    strTable.Append("<Select id='ddlSubBrandForm' class='form-control form-control-sm'> " + ddlSubBrandForm + "</select>");
                    strTable.Append("</td>");
                    strTable.Append("</tr>");
                }
                strTable.Append("</table>");
                strReturn = "3^" + strTable.ToString();
            }
            else
                strReturn = "1^";
        }

        catch (Exception ex)
        {
            strReturn = "2^" + ex.Message;
        }
        finally
        {
            objCom2.Dispose();
            Objcon2.Close();
            Objcon2.Dispose();
        }
        return strReturn;
    }

    [System.Web.Services.WebMethod()]
    public static string fnSaveSubBrand(object objDetails)
    {
        string strReturn = "1";
        int strReturnFromDb = 0;
        DataTable tblBrandForm = new DataTable();
        tblBrandForm.TableName = "tblBrandForm";
        JsonSerializerSettings settings = new JsonSerializerSettings();
        settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
        //string strTable = JsonConvert.SerializeObject(objDetails, settings.ReferenceLoopHandling);
        string strTable = JsonConvert.SerializeObject(objDetails, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });

        tblBrandForm = JsonConvert.DeserializeObject<DataTable>(strTable);


        SqlConnection Objcon2 = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand objCom2 = new SqlCommand("[spPrdMapExistingSBF]", Objcon2);

        objCom2.Parameters.AddWithValue("@PrdMapping", tblBrandForm);
        objCom2.Parameters.Add("@LoginID", SqlDbType.Int).Value = 1;
        objCom2.CommandType = CommandType.StoredProcedure;
        objCom2.CommandTimeout = 0;
        try
        {
            Objcon2.Open();
            objCom2.ExecuteNonQuery();
            strReturn = "1^";
        }
        catch (Exception ex)
        {
            strReturn = "2^" + ex.Message;
        }
        finally
        {
            objCom2.Dispose();
            Objcon2.Close();
            Objcon2.Dispose();
        }
        return strReturn;
    }


}