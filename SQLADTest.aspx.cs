using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection.Emit;
using System.Web;
using System.Web.UI;

public partial class SQLADTest : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Label1.Text = "calling start";

        //SqlConnection Scon = AzureUtilities.GetSQLConnection();
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        Label1.Text = Scon.ConnectionString.ToString();
        SqlCommand Scmd = new SqlCommand("Select Count(*) from tblsecuserlogin", Scon);
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Label1.Text = Ds.Tables[0].Rows[0][0].ToString();
        Scmd.Dispose();
        Sdap.Dispose();        
    }
}