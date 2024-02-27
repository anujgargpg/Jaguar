using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;
using System.Web.Security;
using System.Net.Http;
using System.Xml;
using System.IO;
using System.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using RestSharp;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Collections;
using System.Security;

public partial class Login : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {

            //if (Session["LoginIDForPingID"] == null)
            //{
            //    Response.Redirect("~/frmLogin.aspx");
            //    return;
            //}
            
            ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;

            if (Request.QueryString["code"] == null)
            {
                Response.Redirect("https://login.microsoftonline.com/as/authorization.oauth2?client_id=0a3c8ad3-0575-4e56-adcd-a98b456d587c&response_type=code&redirect_uri=" + HttpUtility.UrlEncode("https://jaguarkvtest.azurewebsites.net/Login.aspx") + "&pfidpadapterid=ad..OAuth");
                return;
            }
            else if (Convert.ToString(Request.QueryString["code"]) == "")
            {
                Response.Redirect("https://login.microsoftonline.com/as/authorization.oauth2?client_id=0a3c8ad3-0575-4e56-adcd-a98b456d587c&response_type=code&redirect_uri=" + HttpUtility.UrlEncode("https://jaguarkvtest.azurewebsites.net/Login.aspx") + "&pfidpadapterid=ad..OAuth");
                return;
            }
            else
            {
                //var client = new RestClient("https://fedauthtst.pg.com/as/token.oauth2");
                //var client = new RestClient("https://fedauth.pg.com/as/token.oauth2");

                var client = new RestClient("https://login.microsoftonline.com/as/token.oauth2");
                var request = new RestRequest(Method.POST);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                request.AddParameter("client_id", "0a3c8ad3-0575-4e56-adcd-a98b456d587c");
                request.AddParameter("grant_type", "authorization_code");
                request.AddParameter("code", Request.QueryString["code"]);
                request.AddParameter("redirect_uri", "https://jaguarkvtest.azurewebsites.net/Login.aspx");
                request.AddParameter("client_secret", "CKq8Q~svynbJ-~S__UwbTyFhHq6ys4t3Y9-XkanT");
                request.AddParameter("scope", "openid");
                IRestResponse response = client.Execute(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var handler = new JwtSecurityTokenHandler();
                    var JObject1 = JObject.Parse(response.Content);
                    string AccessToken = JObject1["access_token"].ToString();
                    var token = handler.ReadToken(AccessToken) as JwtSecurityToken;
                    var EmailID = token.Claims.First(claim => claim.Type == "Mail").Value;
                    var token1 = (handler.ReadToken(token.RawData) as JwtSecurityToken).Payload;
                    var sGroupList = ((Newtonsoft.Json.Linq.JArray)token1["Groups"]).Values<string>();


                    using (StreamWriter logfile = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\" + Session["EmailId"].ToString() + "_" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + ".txt", true))
                    {
                        logfile.WriteLine("Ping EmailId:" + EmailID);
                        logfile.WriteLine("Astix DB EmailId:" + Convert.ToString(Session["EmailId"]));
                        logfile.WriteLine("AccessToken:" + AccessToken);
                        logfile.WriteLine("Usergroup:" + Convert.ToString(Session["usergroup"]));
                    }


                    string txt = "";
                    string smsg = "";
                    if (EmailID.Trim().ToLower() != Convert.ToString(Session["EmailId"]).Trim().ToLower())
                    {
                        txt = "P&G AD EmailId : " + EmailID + "<br/>Jaguar DB Id : " + Convert.ToString(Session["EmailId"]);
                        smsg = "User does not match. kindly contact site admin !<br/>" + txt;

                        divMainbox.Style.Add("display", "block");
                        dvMessage.InnerHtml = smsg;
                    }
                    else if (!sGroupList.Contains(Convert.ToString(Session["usergroup"]).Trim()))
                    {
                        smsg = "your account is not authorized to access this application. Please contact site admin !";
                        divMainbox.Style.Add("display", "block");
                        dvMessage.InnerHtml = smsg;
                    }
                    else
                    {
                        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
                        SqlCommand Scmd = new SqlCommand();
                        Scmd.Connection = Scon;
                        Scmd.CommandText = "spSecUserLoginSSO";
                        Scmd.Parameters.AddWithValue("@UserName", Convert.ToString(Session["EmailId"]));
                        Scmd.Parameters.AddWithValue("@SessionIdNw", Session.SessionID);
                        Scmd.Parameters.AddWithValue("@IPAddress", Request.ServerVariables["REMOTE_ADDR"]);
                        Scmd.Parameters.AddWithValue("@BrwsrVer", Request.Browser.Type);
                        Scmd.Parameters.AddWithValue("@ScrRsltn", "0");
                        Scmd.CommandType = CommandType.StoredProcedure;
                        Scmd.CommandTimeout = 0;
                        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
                        DataSet Ds = new DataSet();
                        Sdap.Fill(Ds);
                        Scmd.Dispose();
                        Sdap.Dispose();

                        if (!(Ds.Tables[0].Rows[0]["LoginResult"].ToString() == "2" || Ds.Tables[0].Rows[0]["LoginResult"].ToString() == "3"))
                        {
                            smsg = "User is not registered to access this application. Please contact site admin !";
                            divMainbox.Style.Add("display", "block");
                            dvMessage.InnerHtml = smsg;
                        }
                        //else if(Ds.Tables[0].Rows[0]["flgAlreadyLogin"].ToString() == "1")
                        //{
                        //    smsg = "Your account is locked. Please contact support or wait for 5 minutes to unlock it !";
                        //    divMainbox.Style.Add("display", "block");
                        //    dvMessage.InnerHtml = smsg;
                        //}
                        else
                        {
                            Session["LoginID"] = Ds.Tables[0].Rows[0]["LoginID"].ToString();
                            Session["UserID"] = Ds.Tables[0].Rows[0]["UserID"].ToString();
                            Session["RoleId"] = Ds.Tables[0].Rows[0]["RoleId"].ToString();
                            Session["NodeType"] = Ds.Tables[0].Rows[0]["NodeType"].ToString();
                            Session["NodeId"] = Ds.Tables[0].Rows[0]["NodeId"].ToString();
                            Session["UserFullName"] = Ds.Tables[0].Rows[0]["UserFullName"].ToString();

                            Response.Redirect("Data/Other/frmDashboard.aspx");
                        }

                    }
                }
                else
                {
                    using (StreamWriter logfile = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\" + Session["EmailId"].ToString() + "_" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + ".txt", true))
                    {
                        logfile.WriteLine("Status:Error");
                        logfile.WriteLine("Error Descr:" + response.Content);
                        logfile.WriteLine("---------------------------------------------");
                    }

                    divMainbox.Style.Add("display", "block");
                    dvMessage.InnerHtml = "Error : " + response.Content + " </br>StatusCode : " + response.StatusCode + " </br>StatusDescription:" + response.StatusDescription;
                }
            }

        }
        catch (Exception ex)
        {
            divMainbox.Style.Add("display", "block");
            dvMessage.InnerHtml = "Error : " + ex.Message;
        }
    }

    protected void btnSubmit_Click(object sender, EventArgs e)
    {
        Response.Redirect("~/frmLogin.aspx");
    }
}
