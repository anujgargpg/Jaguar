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

public partial class Data_BrandMapping_frmGetBrandCategory : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["LoginID"] == null)
        {
            Response.Redirect("../../frmLogin.aspx");
        }

        if (!IsPostBack)
        {
            if (!(Utilities.ValidateRoleBasedAccess(Session["RoleId"].ToString(), "16")))
            {
                Response.Redirect("~/frmLogin.aspx");
            }

            string strReturnBrandTable = fnGetBrandDetails();
            if (strReturnBrandTable.Split('~')[0] == "1")
            {
                dvBrandName.InnerHtml = strReturnBrandTable.Split('~')[1];
            }
        }



    }
    [System.Web.Services.WebMethod()]
    public static string fnGetBrandDetails()
    {
        int Cntr = 0;
        SqlConnection objCon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand objCom = new SqlCommand("[spPordHierMapUserDefinedPrd]", objCon);
        objCom.Parameters.Add("@FileSetID", SqlDbType.Int).Value = 39; // 
        objCom.Parameters.Add("@LoginID", SqlDbType.Int).Value = 0;
        objCom.Parameters.Add("@Lvl", SqlDbType.VarChar).Value = "BF";

        objCom.CommandTimeout = 0;
        objCom.CommandType = CommandType.StoredProcedure;

        SqlDataAdapter da = new SqlDataAdapter(objCom);
        DataSet ds = new DataSet();
        da.Fill(ds);
        string strReturn;

        StringBuilder strTable = new StringBuilder();
        StringBuilder strSecondTable = new StringBuilder();



        // ''''''''''''''''''''''''''''Second Cursor'''''''''''''''''''''
        if (ds.Tables[1].Rows.Count > 0)
        {
            strSecondTable.Append("<table class='table table-bordered table-sm table-striped' id='tblMain'>");
            strSecondTable.Append("<thead>");
            strSecondTable.Append("<tr>");
            strSecondTable.Append("<th>");
            strSecondTable.Append("Category");
            strSecondTable.Append("</th>");
            strSecondTable.Append("<th>");
            strSecondTable.Append("Brand");
            strSecondTable.Append("</th>");
            strSecondTable.Append("<th>");
            strSecondTable.Append("Brand Form");
            strSecondTable.Append("</th>");
            strSecondTable.Append("<th>");
            strSecondTable.Append("Brand Form name");
            strSecondTable.Append("</th>");

            // strSecondTable.Append("<th>")
            // strSecondTable.Append("BrandName")
            // strSecondTable.Append("</th>")

            // strSecondTable.Append("<th>")
            // strSecondTable.Append("Category Name")
            // strSecondTable.Append("</th>")

            strSecondTable.Append("</tr>");


            strSecondTable.Append("</thead>");



            foreach (DataRow dataR in ds.Tables[1].Rows)
            {
                strSecondTable.Append("<tr BFNodeId = '" + dataR["BFNodeID"] + "'  BFNodeType = '" + dataR["BFNodeType"] + "' >");
                strSecondTable.Append("<td>");
                strSecondTable.Append(dataR["Category"]);
                strSecondTable.Append("</td>");

                strSecondTable.Append("<td>");
                strSecondTable.Append(dataR["Brand"]);
                strSecondTable.Append("</td>");

                strSecondTable.Append("<td>");
                strSecondTable.Append(dataR["BrandForm"]);
                strSecondTable.Append("</td>");

                string ddlBrandForm = "";
                ddlBrandForm += "<option value = 0>- Select Brand Form -</option>";
                int flag = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    // If dataR.Item("Brand").ToString.ToUpper = dr.Item("Brand_Name").ToString.ToUpper Then
                    // ddlBrandForm &= "<option selected value = " & dr.Item("ID") & ">" & dr.Item("BrandForm_Name").ToString() & "</Option>"
                    // End If
                    if (dataR["id"] == dr["id"])
                        ddlBrandForm += "<option selected value = " + dr["Id"] + ">" + dr["BrandForm_Name"].ToString() + "</Option>";
                    else
                        ddlBrandForm += "<option value = " + dr["Id"] + ">" + dr["BrandForm_Name"].ToString() + "</Option>";
                }
                strSecondTable.Append("<td>");
                strSecondTable.Append("<Select id='ddlBrandForm' class='form-control form-control-sm'> " + ddlBrandForm + "</select>");
                strSecondTable.Append("</td>");

                strSecondTable.Append("</tr>");
            }

            strSecondTable.Append("</table>");
        }
        else
        {
            strSecondTable.Append("<div class='text-danger text-center'>");
            strSecondTable.Append("No Record Found...");
            strSecondTable.Append("</div>");
        }

        // strReturnVal = "1@" & HttpContext.Current.Server.HtmlDecode(strTable.ToString)
        strReturn = "1~" + strSecondTable.ToString();
        return strReturn;
    }



    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string fnSaveBrand(object objDetails)
    {
        string strReturn = "1";
        int strReturnFromDb = 0;
        DataTable tblBrandForm = new DataTable();
        tblBrandForm.TableName = "tblBrandForm";
        JsonSerializerSettings settings = new JsonSerializerSettings();
        settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
        string strTable = JsonConvert.SerializeObject(objDetails, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
       // string strTable = JsonConvert.SerializeObject(objDetails, settings.ReferenceLoopHandling);
        tblBrandForm = JsonConvert.DeserializeObject<DataTable>(strTable);


        SqlConnection Objcon2 = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand objCom2 = new SqlCommand("[spPordHierConfirmPrd]", Objcon2);

        objCom2.Parameters.AddWithValue("@PrdMapping", tblBrandForm);
        objCom2.Parameters.Add("@LoginID", SqlDbType.Int).Value = 1; // Session("LoginID") '1
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



    [System.Web.Services.WebMethod()]
    public static string fnGetSubBrandDetails()
    {
        int Cntr = 0;
        SqlConnection objCon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand objCom = new SqlCommand("[spPordHierMapUserDefinedPrd]", objCon);
        objCom.Parameters.Add("@FileSetID", SqlDbType.Int).Value = 39; // 
        objCom.Parameters.Add("@LoginID", SqlDbType.Int).Value = 0;
        objCom.Parameters.Add("@Lvl", SqlDbType.VarChar).Value = "SBF";

        objCom.CommandTimeout = 0;
        objCom.CommandType = CommandType.StoredProcedure;

        SqlDataAdapter da = new SqlDataAdapter(objCom);
        DataSet ds = new DataSet();
        da.Fill(ds);
        string strReturn;

        StringBuilder strTable = new StringBuilder();
        StringBuilder strSecondTable = new StringBuilder();



        // ''''''''''''''''''''''''''''Second Cursor'''''''''''''''''''''
        if (ds.Tables[1].Rows.Count > 0)
        {
            strSecondTable.Append("<table class='table table-bordered table-sm table-striped' id='tblMain'>");
            strSecondTable.Append("<thead>");
            strSecondTable.Append("<tr>");
            strSecondTable.Append("<th>");
            strSecondTable.Append("Category");
            strSecondTable.Append("</th>");
            strSecondTable.Append("<th>");
            strSecondTable.Append("Brand");
            strSecondTable.Append("</th>");
            strSecondTable.Append("<th>");
            strSecondTable.Append("Brand Form");
            strSecondTable.Append("</th>");

            strSecondTable.Append("<th>");
            strSecondTable.Append("Sub Brand Form");
            strSecondTable.Append("</th>");

            strSecondTable.Append("<th>");
            strSecondTable.Append("Sub Brand Form");
            strSecondTable.Append("</th>");

            // strSecondTable.Append("<th>")
            // strSecondTable.Append("BrandName")
            // strSecondTable.Append("</th>")

            // strSecondTable.Append("<th>")
            // strSecondTable.Append("Category Name")
            // strSecondTable.Append("</th>")

            strSecondTable.Append("</tr>");


            strSecondTable.Append("</thead>");



            foreach (DataRow dataR in ds.Tables[1].Rows)
            {
                strSecondTable.Append("<tr SBFNodeId = '" + dataR["SBFNodeID"] + "'  SBFNodeType = '" + dataR["SBFNodeType"] + "' >");
                strSecondTable.Append("<td>");
                strSecondTable.Append(dataR["Category"]);
                strSecondTable.Append("</td>");

                strSecondTable.Append("<td>");
                strSecondTable.Append(dataR["Brand"]);
                strSecondTable.Append("</td>");

                strSecondTable.Append("<td>");
                strSecondTable.Append(dataR["BrandForm"]);
                strSecondTable.Append("</td>");

                strSecondTable.Append("<td>");
                strSecondTable.Append(dataR["SubBrandForm"]);
                strSecondTable.Append("</td>");

                string ddlBrandForm = "";
                ddlBrandForm += "<option value = 0>- Select SBF -</option>";
                int flag = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    // If dataR.Item("Brand").ToString.ToUpper = dr.Item("Brand_Name").ToString.ToUpper Then
                    // ddlBrandForm &= "<option selected value = " & dr.Item("ID") & ">" & dr.Item("BrandForm_Name").ToString() & "</Option>"
                    // End If
                    if (dataR["id"] == dr["id"])
                        ddlBrandForm += "<option selected value = " + dr["Id"] + ">" + dr["Sub_brandform_Name"].ToString() + "</Option>";
                    else
                        ddlBrandForm += "<option value = " + dr["Id"] + ">" + dr["Sub_brandform_Name"].ToString() + "</Option>";
                }
                strSecondTable.Append("<td>");
                strSecondTable.Append("<Select id='ddlSubBrandForm' class='form-control form-control-sm'> " + ddlBrandForm + "</select>");
                strSecondTable.Append("</td>");

                strSecondTable.Append("</tr>");
            }

            strSecondTable.Append("</table>");
            strReturn = "1~" + strSecondTable.ToString();
        }
        else
        {
            strSecondTable.Append("<div class='text-danger text-center'>");
            strSecondTable.Append("No Record Found...");
            strSecondTable.Append("</div>");
            strReturn = "2~" + strSecondTable.ToString();
        }

        // strReturnVal = "1@" & HttpContext.Current.Server.HtmlDecode(strTable.ToString)

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
        SqlCommand objCom2 = new SqlCommand("[spPordHierConfirmPrd]", Objcon2);

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