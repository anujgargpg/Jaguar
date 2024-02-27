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

public partial class _BaseProxyCombiBucket : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["LoginID"] == null)
        {
            Response.Redirect("~/frmLogin.aspx");
        }
        else
        {
            if (!IsPostBack)
            {
                hdnLoginID.Value = Session["LoginID"].ToString();
                hdnUserID.Value = Session["UserID"].ToString();
                hdnRoleID.Value = Session["RoleId"].ToString();
                hdnNodeID.Value = Session["NodeId"].ToString();
                hdnNodeType.Value = Session["NodeType"].ToString();



                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "54"))
                {
                    // 1: Base SBF; 2: Proxy SBF
                    hdnSBFMstr.Value = fnProdHier(hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "40", "BaseSBf", 1);
                    divProxySBFPopupTbl.InnerHtml = fnProdHier(hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "40", "ProxySBf", 2);
                }
                else
                    Response.Redirect("~/frmLogin.aspx");
                
            }
        }
    }

    [System.Web.Services.WebMethod()]
    public static string fnProdHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, string Name, int flg)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spGetPrdHierachyInTableFormat_SBD";
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@UserNodeID", UserNodeID);
            Scmd.Parameters.AddWithValue("@UserNodeType", UserNodeType);
            Scmd.Parameters.AddWithValue("@ProdLvl", ProdLvl);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return GetProdTbl(Ds.Tables[0], Name, flg);

        }
        catch (Exception ex)
        {
            return "Due to some technical reasons, we are unable to process your request. Error - " + ex.Message + " !";
        }
    }
    private static string GetProdTbl(DataTable dt, string Name, int flg)
    {
        string[] SkipColumn = new string[9];
        SkipColumn[0] = "CatNodeID";
        SkipColumn[1] = "CatNodeType";
        SkipColumn[2] = "BrnNodeID";
        SkipColumn[3] = "BrnNodeType";
        SkipColumn[4] = "BFNodeID";
        SkipColumn[5] = "BFNodeType";
        SkipColumn[6] = "SBFNodeId";
        SkipColumn[7] = "SBFNodeType";
        SkipColumn[8] = "SearchString";

        StringBuilder sb = new StringBuilder();
        sb.Append("<table class='table table-bordered table-sm table-hover cls-tbl" + Name + "'>");
        sb.Append("<thead>");

        if (flg == 2)
        {
            sb.Append("<tr>");
            sb.Append("<th colspan='6'>");
            sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnProxySBFPopuptypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
            sb.Append("</th>");
            sb.Append("</tr>");
        }

        sb.Append("<tr>");
        if (flg == 2)
            sb.Append("<th style='width: 30px;'><input type='checkbox' onclick='fnSelectAllProxySBF(this);' /></th>");
        sb.Append("<th style='display: none;'>SearchString</th>");
        for (int j = 0; j < dt.Columns.Count; j++)
        {
            if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
            {
                sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");
            }
        }
        sb.Append("</tr>");

        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sb.Append("<tr onclick='fnSelectSBF(this);' flg='0' flgVisible='1' flgSBFType='" + flg + "' nid='" + dt.Rows[i]["SBFNodeId"] + "' ntype='" + dt.Rows[i]["SBFNodeType"] + "'>");
            if (flg == 2)
                sb.Append("<td><img src='../../Images/checkbox-unchecked.png' /></td>");

            sb.Append("<td style='display: none;'>" + dt.Rows[i]["SearchString"] + "</td>");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                {
                    sb.Append("<td class='clss-" + j + "'>" + dt.Rows[i][j] + "</td>");
                }
            }
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string fnGetReport(string LoginID, string UserID, string RoleID)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBGetBaseProxyBucket";
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@ProxySBFNodeID", "0");
            Scmd.Parameters.AddWithValue("@ProxySBFNodeType", "0");
            Scmd.Parameters.AddWithValue("@flgType", "1");
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            string[] SkipColumn = new string[3];
            SkipColumn[0] = "FBBucketID";
            SkipColumn[1] = "BasePrdNodeID";
            SkipColumn[2] = "BasePrdNodeType";

            return "0|^|" + CreateBucketTbl(Ds, SkipColumn, "Report");
        }
        catch (Exception ex)
        {
            return "2|^|" + ex.Message;
        }
    }
    private static string CreateBucketTbl(DataSet Ds, string[] SkipColumn, string Name)
    {
        DataTable dt = Ds.Tables[0];
        StringBuilder sbProxy = new StringBuilder();

        StringBuilder sb = new StringBuilder();
        sb.Append("<table id='tbl" + Name + "' class='table table-bordered table-sm cls-" + Name + "'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th>#</th>");
        for (int j = 0; j < dt.Columns.Count; j++)
        {
            if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
            {
                sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");
            }
        }
        sb.Append("<th>Action</th>");


        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sbProxy.Clear();
            sbProxy.Append(GetProxy(dt.Rows[i]["FBBucketID"].ToString(), Ds.Tables[1]));

            sb.Append("<tr iden='sbf' strId='" + dt.Rows[i]["FBBucketID"] + "' BaseSBF='" + dt.Rows[i]["BasePrdNodeID"] + "|" + dt.Rows[i]["BasePrdNodeType"] + "|" + dt.Rows[i]["Base SBF"] + "' MOQ='" + dt.Rows[i]["MOQ"] + "' ProxySBF='" + sbProxy.ToString().Split('$')[0] + "' flgEdit='0'>");

            sb.Append("<td iden='sbf'>" + (i + 1).ToString() + "</td>");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                {
                    if (dt.Columns[j].ColumnName.ToString() == "Proxy SBF(s)")
                    {
                        sb.Append("<td iden='sbf' class='custom-tooltip' title='" + sbProxy.ToString().Split('$')[1] + "'>");
                        if (sbProxy.ToString().Split('$')[1].Length > 52)
                            sb.Append(sbProxy.ToString().Split('$')[1].Substring(0, 50) + "..");
                        else
                            sb.Append(sbProxy.ToString().Split('$')[1]);
                        sb.Append("</td>");
                    }
                    else
                        sb.Append("<td iden='sbf'>" + dt.Rows[i][j] + "</td>");
                }
            }
            sb.Append("<td iden='sbf'>");
            sb.Append("<img src='../../Images/copy.png' title='copy' onclick='fnCopy(this);'/>");
            sb.Append("<img src='../../Images/edit.png' class='ml-1' title='edit' onclick='fnEdit(this);'/>");
            sb.Append("<img src='../../Images/delete.png' class='ml-1' title='remove' onclick='fnDelete(this);'/>");
            sb.Append("</td>");

            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    public static string GetProxy(string FBBucketID, DataTable dt)
    {
        StringBuilder sbIds = new StringBuilder();
        StringBuilder sbDescr = new StringBuilder();

        DataRow[] dr = dt.Select("FBBucketID=" + FBBucketID);
        foreach (DataRow row in dr)
        {
            sbDescr.Append(", " + row["ProxySBF"].ToString());
            sbIds.Append("^" + row["ProxyPrdNodeID"].ToString() + "|" + row["ProxyPrdNodeType"].ToString());
        }
        return sbIds.ToString().Substring(1) + "$" + sbDescr.ToString().Substring(2);
    }


    [System.Web.Services.WebMethod()]
    public static string fnSave(string FBBucketID, string BaseSBF, string MOQ, string flgApplyToNorms, object obj, object objCluster, string LoginID, string UserID, string RoleID)
    {
        try
        {
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tbl = JsonConvert.DeserializeObject<DataTable>(str);

            string strCluster = JsonConvert.SerializeObject(objCluster, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblCluster = JsonConvert.DeserializeObject<DataTable>(strCluster);
            if (tblCluster.Rows[0][0].ToString() == "0")
                tblCluster.Rows.RemoveAt(0);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBManageBaseProxyBucket";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.Parameters.AddWithValue("@FBBucketID", FBBucketID);
            Scmd.Parameters.AddWithValue("@BasePesNodeID", BaseSBF.Split('|')[0]);
            Scmd.Parameters.AddWithValue("@BasePesNodeType", BaseSBF.Split('|')[1]);
            Scmd.Parameters.AddWithValue("@MOQ", Utilities.XSSHandling(MOQ));
            Scmd.Parameters.AddWithValue("@ApplyToNorms", flgApplyToNorms);
            Scmd.Parameters.AddWithValue("@ProxyPrds", tbl);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@Cluster_SBDMapIDs", tblCluster);
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -2)
                return "2|^|" + GetClusterforBucket(Ds.Tables[1], Ds.Tables[2]);
            else if(Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -1)
                return "1|^|";
            else
                return "0|^|";
        }
        catch (Exception e)
        {
            return "2|^|" + e.Message;
        }
    }
    private static string GetClusterforBucket(DataTable dtCluster, DataTable dtSBDClusterMap)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<div class='m-2 mb-3' style='color: #000;'>");
        sb.Append("<div class='mb-2' style='width: 70%; float: left;'>This Bucket is being used in following Cluster(s): </div>");
        sb.Append("<div class='mb-2' style='width: 30%; float: left; color: #ea7b00; text-align: right; padding-right: 5px;'><input type='checkbox' onclick='fnChkAll(this);' checked='checked'/> Select All</div>");
        sb.Append("<ul style='list-style-type: none; overflow-y: auto; max-height: 300px;'>");
        for (int i = 0; i < dtCluster.Rows.Count; i++)
            sb.Append("<li class='mt-1' style='color: #006fa4;'><input type='checkbox' class='mr-2' Clusterid='" + dtCluster.Rows[i]["ClusterID"].ToString() + "' SBDClusterMapids='" + GetSBDClusterMapIDs(dtCluster.Rows[i]["ClusterID"].ToString(), dtSBDClusterMap) + "' checked>" + dtCluster.Rows[i]["ClusterName"].ToString() + "</li>");

        sb.Append("</ul>");
        sb.Append("Please select the Cluster(s) in which you wish to reflect this change.");
        sb.Append("</div>");
        return sb.ToString();
    }
    private static string GetSBDClusterMapIDs(string ClusterID, DataTable dtSBDClusterMap)
    {
        StringBuilder sb = new StringBuilder();
        DataRow[] drtemp = dtSBDClusterMap.Select("ClusterID='" + ClusterID + "'");
        if (drtemp.Length > 0)
        {
            DataTable dttemp = drtemp.CopyToDataTable();
            for (int i = 0; i < dttemp.Rows.Count; i++)
            {
                if(i != 0)
                    sb.Append("^");
                sb.Append(dttemp.Rows[i]["Cluster_SBDMapID"].ToString());
            }
        }
        return sb.ToString();
    }

    [System.Web.Services.WebMethod()]
    public static string fnDelete(string SBDBucketID, string UserID, string LoginID)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spSBDDeleteBaseProxyBucket";
            Scmd.Parameters.AddWithValue("@SBDBucketID", SBDBucketID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();
            Ds.Dispose();

            if (Ds.Tables[0].Rows[0]["flgStatus"].ToString() == "1")
                return "0";
            else if (Ds.Tables[0].Rows[0]["flgStatus"].ToString() == "-1")
                return "2|^|Sorry, You are not allowed to delete this Bucket, since it was used for " + Ds.Tables[0].Rows[0]["Last Userd In"].ToString();
            else
                return "1|^|" + Ds.Tables[0].Rows[0]["Last Used"].ToString();
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
}