using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;

public partial class AdminLogin : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["UserName"] == null)
        {
            txtUserName.Value = Session["UserName"].ToString();
        }
    }

    protected void btnSubmit_Click(object sender, EventArgs e)
    {
        bool varAuthenticate = false;
        var RoleID = "0";
        var PassChangeFirst = "0";

        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand cmd = new SqlCommand();
        cmd = new SqlCommand("spSecUserLogin", Scon);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.AddWithValue("@UserName", txtUserName.Value.ToString().Trim());
        cmd.Parameters.AddWithValue("@UserPwd", txtPassword.Value.ToString().Trim());
        cmd.Parameters.AddWithValue("@SessionIdNw", Session.SessionID);
        cmd.Parameters.AddWithValue("@IPAddress", Request.ServerVariables["REMOTE_ADDR"]);
        cmd.Parameters.AddWithValue("@BrwsrVer", Request.Browser.Type);
        cmd.Parameters.AddWithValue("@ScrRsltn", "");

        cmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(cmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        cmd.Dispose();
        Sdap.Dispose();
        {
            if (Ds != null)
            {
                if (Ds.Tables[0].Rows.Count > 0)
                {

                    if (Ds.Tables[0].Rows[0]["LoginResult"].ToString() == "")
                    {
                        dvMessage.InnerText = "Invalid Username or Password !!!";
                        txtUserName.Value = "";
                        txtPassword.Value = "";
                    }
                    else if (Ds.Tables[0].Rows[0]["LoginResult"].ToString() == "2" | Ds.Tables[0].Rows[0]["LoginResult"].ToString() == "3")
                    {
                        if (string.IsNullOrEmpty(Convert.ToString(Ds.Tables[0].Rows[0]["UserID"])))
                        {
                            dvMessage.InnerText = "User is not registered to access this application. Please contact the site admin !!!";
                            txtUserName.Value = "";
                            txtPassword.Value = "";
                        }
                        else if ((int)Convert.ToInt16(Ds.Tables[0].Rows[0]["flgDormant"]) == 1)
                        {
                            dvMessage.InnerText = "Login Failed !! It seems you have not login for long and your account became inactive. Kindly contact site admin to reenable the same.";
                            txtUserName.Value = "";
                            txtPassword.Value = "";
                        }
                        else
                        {
                            Session["LoginID"] = Ds.Tables[0].Rows[0]["LoginID"];
                            Session["UserID"] = Ds.Tables[0].Rows[0]["UserID"];
                            Session["RoleId"] = Ds.Tables[0].Rows[0]["RoleId"];
                            RoleID = Ds.Tables[0].Rows[0]["RoleId"].ToString();
                            Session["NodeType"] = Ds.Tables[0].Rows[0]["NodeType"];
                            Session["NodeId"] = Ds.Tables[0].Rows[0]["NodeId"];
                            Session["UserFullName"] = Ds.Tables[0].Rows[0]["UserFullName"];
                            PassChangeFirst = Ds.Tables[0].Rows[0]["flgPasswordChange"].ToString();

                            varAuthenticate = true;
                        }

                    }
                }
                else
                {
                    dvMessage.InnerText = "User not Found !!! ";
                    txtUserName.Value = "";
                    txtPassword.Value = "";
                }
            }
            else
            {
                dvMessage.InnerText = "Sorry, due to some technical reasons, we are unable to process your request !!! ";
                txtUserName.Value = "";
                txtPassword.Value = "";
            }
            {
                if (varAuthenticate)
                {
                    Response.Redirect("Data/Other/frmDashboard.aspx");
                    
                }
            }


        }



    }
    public string ReplaceQuotes(string str)
    {
        return str.Replace(str, "'").Replace("'", "''");
    }

}