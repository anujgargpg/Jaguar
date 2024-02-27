using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for DBHelper
/// </summary>
public static class DBHelper
{
    public static string getDBConnectionString()
    {
        return "server=103.107.67.197;database=db_Jaguar_Dev;uid=rtdx_user;pwd=Polo%$!12345@1234;connection timeout=0";
        //return AzureUtilities.GetVaultValue(ConfigurationManager.AppSettings["strConnKV"].ToString());
    }
    public static DataSet ExecuteDataSet(string spName, Dictionary<string, string> keyValues)
    {
        try
        {
            DataSet ds = new DataSet();
            using (SqlConnection sqlConn = new SqlConnection(getDBConnectionString()))
            {
                using (SqlCommand sqlcmd = new SqlCommand(spName, sqlConn))
                {
                    foreach (KeyValuePair<string, string> keyVal in keyValues)
                    {
                        if (!string.IsNullOrWhiteSpace(keyVal.Key))
                            sqlcmd.Parameters.AddWithValue("@" + keyVal.Key, keyVal.Value);
                    }
                    sqlcmd.CommandTimeout = 0;
                    sqlcmd.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter Sdap = new SqlDataAdapter(sqlcmd);
                    Sdap.Fill(ds);
                    sqlcmd.Dispose();
                    Sdap.Dispose();
                }
            }
            return ds;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}