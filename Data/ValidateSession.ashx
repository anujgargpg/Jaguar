<%@ WebHandler Language="C#" Class="ValidateSession" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Data;
using System.Data.SqlClient;

public class ValidateSession : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));
        context.Response.Cache.SetNoStore();
        context.Response.Cache.SetNoServerCaching();

        string UserId = context.Session["UserID"] == null ? "0" : context.Session["UserID"].ToString();
        SqlConnection con = new SqlConnection(DBHelper.getDBConnectionString());
        if (UserId != "0")
        {
            SqlCommand cmd = new SqlCommand("spSecUserUpdateLoginTime", con);
            cmd.Parameters.AddWithValue("@UserID", Convert.ToInt32(UserId));
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 0;
            try
            {
                con.Open();
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex) { }
            finally
            {
                cmd.Dispose();
                con.Close();
                con.Dispose();

            }
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}