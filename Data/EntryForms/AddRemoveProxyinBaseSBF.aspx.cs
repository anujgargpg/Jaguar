using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.IO;
using ClosedXML.Excel;

public partial class AddRemoveProxyinBaseSBF : System.Web.UI.Page
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
                hdnPageType.Value = Request.QueryString["pg"].ToString();       // 1:Add, 2:Remove

                hdnLoginID.Value = Session["LoginID"].ToString();
                hdnUserID.Value = Session["UserID"].ToString();
                hdnRoleID.Value = Session["RoleId"].ToString();
                hdnNodeID.Value = Session["NodeId"].ToString();
                hdnNodeType.Value = Session["NodeType"].ToString();

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "41"))
                    hdnSBFMstr.Value = fnProdHier(hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "40");
                else if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "42"))
                    hdnSBFMstr.Value = fnProdHier(hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "40");
                else
                    Response.Redirect("~/frmLogin.aspx");                
            }
        }
    }


    [System.Web.Services.WebMethod()]
    public static string fnProdHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spGetPrdHierachyInTableFormat";
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

            return GetProdTbl(Ds.Tables[0], ProdLvl);

        }
        catch (Exception ex)
        {
            return "Due to some technical reasons, we are unable to process your request. Error - " + ex.Message + " !";
        }
    }
    private static string GetProdTbl(DataTable dt, string ProdLvl)
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
        sb.Append("<table class='table table-bordered table-sm table-hover'>"); //clsProduct clstable
        sb.Append("<thead>");
        sb.Append("<tr>");
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
            switch (ProdLvl)
            {
                case "10":
                    sb.Append("<tr onclick='fnSelectSBF(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='0' bf='0' sbf='0' nid='" + dt.Rows[i]["CatNodeID"] + "' ntype='" + dt.Rows[i]["CatNodeType"] + "'>");
                    break;
                case "20":
                    sb.Append("<tr onclick='fnSelectSBF(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='0' sbf='0' nid='" + dt.Rows[i]["BrnNodeID"] + "' ntype='" + dt.Rows[i]["BrnNodeType"] + "'>");
                    break;
                case "30":
                    sb.Append("<tr onclick='fnSelectSBF(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' sbf='0' nid='" + dt.Rows[i]["BFNodeID"] + "' ntype='" + dt.Rows[i]["BFNodeType"] + "'>");
                    break;
                case "40":
                    sb.Append("<tr onclick='fnSelectSBF(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' sbf='" + dt.Rows[i]["SBFNodeId"] + "' nid='" + dt.Rows[i]["SBFNodeId"] + "' ntype='" + dt.Rows[i]["SBFNodeType"] + "'>");
                    break;
            }
            //sb.Append("<td><img src='../../Images/checkbox-unchecked.png' /></td>");

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
    public static string fnGetDetails(string SBFNodeID, string SBFNodeType, string LoginID, string RoleID, string UserID, string flgPage)
    {
        try
        {
            DataSet Ds = new DataSet();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBGetBaseProxyBucket";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@ProxySBFNodeID", SBFNodeID);
            Scmd.Parameters.AddWithValue("@ProxySBFNodeType", SBFNodeType);
            Scmd.Parameters.AddWithValue("@flgType", flgPage);
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            Sdap.Fill(Ds);

            if (Ds.Tables[0].Rows.Count > 0)
                return "0|^|" + GetSBDlst(Ds);
            else
                return "1|^|<div style='font-size: 1rem; font-weight: 600; padding: 5px 20px;'>No Bucket(s) Found !</div>";
        }
        catch (Exception ex)
        {
            return "2|^|" + ex.Message;
        }
    }
    private static string GetSBDlst(DataSet Ds)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<table id='tblSBDHeader' class='table table-striped table-bordered table-sm mb-0'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th><input type='checkbox' id='chkSBDSelectAll' onclick='fnSBDSelectAll(this);'/></th>");
        sb.Append("<th>Base<br/><input type='text' iden='cluster' placeholder='Type atleast 3 characters' onkeyup='fnSBDTypeSearch(this);'/></th>");
        sb.Append("<th>Proxy<br/><input type='text' iden='basesbf' placeholder='Type atleast 3 characters' onkeyup='fnSBDTypeSearch(this);'/></th>");
        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("</table>");
        sb.Append("<div id='dvSBDBody' style='overflow-y: auto;'>");
        sb.Append("<table id='tblSBDBody' class='table table-striped table-bordered table-sm'>");
        sb.Append("<tbody>");
        for (int i = 0; i < Ds.Tables[0].Rows.Count; i++)
        {
            sb.Append("<tr strId='" + Ds.Tables[0].Rows[i]["FBBucketID"].ToString() + "' flgVisible='1'>");
            sb.Append("<td><input type='checkbox' iden='SBD' onclick='fnSelectSBD(this);'/></td>");
            sb.Append("<td>" + Ds.Tables[0].Rows[i]["Base SBF"].ToString() + "</td>");
            sb.Append("<td>" + GetProxySBFlst(Ds.Tables[0].Rows[i]["FBBucketID"].ToString(), Ds.Tables[0].Rows[i]["BasePrdNodeID"].ToString(), Ds.Tables[1]) + "</td>");
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        sb.Append("</div>");

        return sb.ToString();
    }
    private static string GetProxySBFlst(string FBBucketID, string BaseSBFNodeID, DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        DataTable dttemp = dt.Select("FBBucketID=" + FBBucketID).CopyToDataTable();
        for (int i = 0; i < dttemp.Rows.Count; i++)
        {
            sb.Append("<div class='clsProxySBF' strId='" + dttemp.Rows[i]["ProxyPrdNodeID"].ToString() + "' strType='" + dttemp.Rows[i]["ProxyPrdNodeType"].ToString() + "'>");
            sb.Append("<span>" + dttemp.Rows[i]["ProxySBF"].ToString() + "</span>");
            if (BaseSBFNodeID != dttemp.Rows[i]["ProxyPrdNodeID"].ToString())
                sb.Append("<i class='fa fa-window-close' onclick='fnRemoveProxySBFInIndividualBaseBucket(this);'></i>");
            sb.Append("</div>");
        }
        return sb.ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string fnAddRemoveProxySBF(string UserID, string RoleID, string LoginID, string flgAddRemove, string SBFNodeID, string SBFNodeType, string ApplyToNorms, object obj, object objCluster)
    {
        try
        {
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tbl = JsonConvert.DeserializeObject<DataTable>(str);

            string strCluster = JsonConvert.SerializeObject(objCluster, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblCluster = JsonConvert.DeserializeObject<DataTable>(strCluster);

            DataSet ds = new DataSet(); 
            SqlCommand Scmd = new SqlCommand();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());

            if (flgAddRemove == "1")
            {
                Scmd.Connection = Scon;
                Scmd.CommandText = "[spSBDAddProxySBFFromBucket]";
                Scmd.CommandType = CommandType.StoredProcedure;
                Scmd.CommandTimeout = 0;
                Scmd.Parameters.AddWithValue("@LoginID", LoginID);
                Scmd.Parameters.AddWithValue("@ApplyToNorms", ApplyToNorms);
                Scmd.Parameters.AddWithValue("@BaseSBFs", tbl);
                Scmd.Parameters.AddWithValue("@ProxySBFNodeID", SBFNodeID);
                Scmd.Parameters.AddWithValue("@ProxySBFNodeType", SBFNodeType);
                Scmd.Parameters.AddWithValue("@Cluster_SBDMapID", tblCluster);
                Scmd.Parameters.AddWithValue("@ROleID", RoleID);
                SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
                Sdap.Fill(ds);
            }
            else
            {
                Scmd.Connection = Scon;
                Scmd.CommandText = "[spSBDDeleteProxySBFFromBucket]";
                Scmd.CommandType = CommandType.StoredProcedure;
                Scmd.CommandTimeout = 0;
                Scmd.Parameters.AddWithValue("@BaseSBFs", tbl);
                Scmd.Parameters.AddWithValue("@ProxySBFNodeID", SBFNodeID);
                Scmd.Parameters.AddWithValue("@ProxySBFNodeType", SBFNodeType);
                Scmd.Parameters.AddWithValue("@LoginID", LoginID);
                Scmd.Parameters.AddWithValue("@ApplyToNorms", ApplyToNorms);
                Scmd.Parameters.AddWithValue("@Cluster_SBDMapID", tblCluster);
                Scmd.Parameters.AddWithValue("@UserID", UserID);
                Scmd.Parameters.AddWithValue("@RoleID", RoleID);
                SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
                Sdap.Fill(ds);
            }

            if (Convert.ToInt32(ds.Tables[0].Rows[0][0]) == -2)
                return "2|^|" + GetClusterforBucket(ds.Tables[1], ds.Tables[2]);
            else if (Convert.ToInt32(ds.Tables[0].Rows[0][0]) == -1)
                return "1|^|Error : ";
            else
                return "0|^|";
        }
        catch (Exception ex)
        {
            return "1|^|Error : " + ex.Message;
        }
    }
    private static string GetClusterforBucket(DataTable dtCluster, DataTable dtSBDClusterMap)
    {
        StringBuilder sb = new StringBuilder();
        string[] SkipColumn = new string[1];
        SkipColumn[0] = "strKey";

        sb.Append("<div class='m-2 mb-3' style='color: #000;'>");
        sb.Append("This Bucket is being used in following SBF-Cluster(s): ");

        sb.Append("<div style='overflow-y: auto; max-height: 300px;'>");
        sb.Append("<table id='tblSBFClusterMapping' class='table table-striped table-bordered table-sm mt-1'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th class='text-center'><input type='checkbox' onclick='fnSelectAllMapping(this);' checked/></th>");
        for (int j = 0; j < dtCluster.Columns.Count; j++)
            if (!SkipColumn.Contains(dtCluster.Columns[j].ColumnName.ToString().Trim()))
                sb.Append("<th>" + dtCluster.Columns[j].ColumnName.ToString() + "</th>");

        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dtCluster.Rows.Count; i++)
        {
            sb.Append("<tr>");
            sb.Append("<td class='text-center'><input type='checkbox' Mapids='" + GetMapIDs(dtCluster.Rows[i]["strKey"].ToString(), dtSBDClusterMap) + "'  onclick='fnSelectIndividualMapping(this);' checked/></td>");
            for (int j = 0; j < dtCluster.Columns.Count; j++)
                if (!SkipColumn.Contains(dtCluster.Columns[j].ColumnName.ToString().Trim()))
                    sb.Append("<td>" + dtCluster.Rows[i][j].ToString() + "</td>");

            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        sb.Append("</div>");

        //sb.Append("<ul style='list-style-type: none;'>");
        //for (int i = 0; i < dtCluster.Rows.Count; i++)
        //    sb.Append("<li class='mt-1' style='color: #006fa4;'><input type='checkbox' class='mr-2' strKey='" + dtCluster.Rows[i]["strKey"].ToString() + "' SBDClusterMapids='" + GetSBDClusterMapIDs(dtCluster.Rows[i]["strKey"].ToString(), dtSBDClusterMap) + "' checked>" + dtCluster.Rows[i]["ClusterName"].ToString() + "</li>");
        //sb.Append("</ul>");

        sb.Append("Please select the Cluster(s) in which you wish to reflect this change.");
        sb.Append("</div>");
        return sb.ToString();
    }
    private static string GetMapIDs(string strKey, DataTable dtSBDClusterMap)
    {
        StringBuilder sb = new StringBuilder();
        DataRow[] drtemp = dtSBDClusterMap.Select("strKey='" + strKey + "'");
        if (drtemp.Length > 0)
        {
            DataTable dttemp = drtemp.CopyToDataTable();
            for (int i = 0; i < dttemp.Rows.Count; i++)
            {
                if (i != 0)
                    sb.Append("^");
                sb.Append(dttemp.Rows[i]["Cluster_SBDMapID"].ToString() + "|" + dttemp.Rows[i]["BucketID"].ToString());
            }
        }
        return sb.ToString();
    }
}