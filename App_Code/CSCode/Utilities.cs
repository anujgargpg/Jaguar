using DocumentFormat.OpenXml.Drawing.Diagrams;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Sockets;
using System.Security.Policy;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI.WebControls;

/// <summary>
/// Summary description for Utilities
/// </summary>
public static class Utilities
{
    //BucketType =  1: Product, 2: Location, 3: Channel
    //FormType   =  8: User Mstr, 10: Bucket Mstr, 18: Initiative, 67: Initiative MR, 37: SBD, 47: FB Base, 66: FB Topup, 71: FB Base New, 72: FB Topup New

    public static string XSSHandling(string str)
    {
        return HttpUtility.HtmlEncode(str).Replace("&lt;/", "&lt;").Replace("&lt;script&gt;", "").Replace("&lt;!--", "");
    }
    public static string HTMLDecode(string str)
    {
        return HttpUtility.HtmlDecode(str);
    }

    public static bool ValidateRoleBasedAccess(string RoleId, string MenuId)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("RoleID", RoleId);
        sqlPara.Add("MnID", MenuId);
        DataSet Ds = DBHelper.ExecuteDataSet("spCheckMenuForRole", sqlPara);

        if (Ds.Tables[0].Rows[0]["Result"].ToString() == "1")
            return true;
        else
            return false;
    }



    public static string GetHierLvl(string BucketType, string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string flgCallingPage)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("LoginID", LoginID);
        sqlPara.Add("UserID", UserID);
        sqlPara.Add("RoleID", RoleID);
        sqlPara.Add("UserNodeID", UserNodeID);
        sqlPara.Add("UserNodeType", UserNodeType);

        DataSet Ds = new DataSet();
        if (BucketType == "1")
            Ds = DBHelper.ExecuteDataSet("spGetProdHierLvlForFB", sqlPara);
        else if (BucketType == "2")
            Ds = DBHelper.ExecuteDataSet("spGetLocHierLvl", sqlPara);
        else if (BucketType == "3")
            Ds = DBHelper.ExecuteDataSet("spGetChannelHierLvl", sqlPara);

        StringBuilder sb = new StringBuilder();
        sb.Append("<table class='productlvl_list'>");
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            if (flgCallingPage == "8")      // User Mstr
            {
                string[] Skiplvl = { "30", "35", "40", "140", "220" };
                if (!Skiplvl.Contains(Ds.Tables[0].Rows[i]["NodeType"].ToString()))
                {
                    sb.Append("<tr><td ntype='" + Ds.Tables[0].Rows[i]["NodeType"].ToString() + "' onclick='fnProdLvl(this);'>");
                    if (i != 0)
                        sb.Append("<img src='../../Images/Down-Right-Arrow.png' />");

                    sb.Append(Ds.Tables[0].Rows[i]["lvl"].ToString());
                    sb.Append("</td></tr>");
                }
            }
            else if (flgCallingPage == "37")     // SBD
            {
                if (Ds.Tables[0].Rows[i]["NodeType"].ToString() != "220")
                {
                    sb.Append("<tr><td ntype='" + Ds.Tables[0].Rows[i]["NodeType"].ToString() + "' onclick='fnProdLvl(this);'>");
                    if (i != 0)
                        sb.Append("<img src='../../Images/Down-Right-Arrow.png' />");

                    sb.Append(Ds.Tables[0].Rows[i]["lvl"].ToString());
                    sb.Append("</td></tr>");
                }
            }
            else
            {
                sb.Append("<tr><td ntype='" + Ds.Tables[0].Rows[i]["NodeType"].ToString() + "' onclick='fnProdLvl(this);'>");
                if (i != 0)
                    sb.Append("<img src='../../Images/Down-Right-Arrow.png' />");

                sb.Append(Ds.Tables[0].Rows[i]["lvl"].ToString());
                sb.Append("</td></tr>");
            }
        }
        sb.Append("</table>");
        return sb.ToString();
    }
    public static string GetHierDetail(string BucketType, string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string HierLvl, string flgCallingPage)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("LoginID", LoginID);
        sqlPara.Add("UserID", UserID);
        sqlPara.Add("RoleID", RoleID);
        sqlPara.Add("UserNodeID", UserNodeID);
        sqlPara.Add("UserNodeType", UserNodeType);
        sqlPara.Add("ProdLvl", HierLvl);

        DataSet Ds = new DataSet();
        if (BucketType == "1")
            Ds = DBHelper.ExecuteDataSet("spGetPrdHierachyInTableFormat", sqlPara);
        else if (BucketType == "2")
            Ds = DBHelper.ExecuteDataSet("spGetLocHierachyInTableFormat", sqlPara);
        else if (BucketType == "3" && flgCallingPage == "67")
            Ds = DBHelper.ExecuteDataSet("spGetChannelHierachyInTableFormat_MR", sqlPara);
        else if (BucketType == "3")
            Ds = DBHelper.ExecuteDataSet("spGetChannelHierachyInTableFormat", sqlPara);

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        if (BucketType == "1")
        {
            string[] SkipColumn = new string[11];
            SkipColumn[0] = "CatNodeID";
            SkipColumn[1] = "CatNodeType";
            SkipColumn[2] = "BrnNodeID";
            SkipColumn[3] = "BrnNodeType";
            SkipColumn[4] = "BFNodeID";
            SkipColumn[5] = "BFNodeType";
            SkipColumn[6] = "SBFGroupID";
            SkipColumn[7] = "SBFGroupNOdeType";
            SkipColumn[8] = "SBFNodeId";
            SkipColumn[9] = "SBFNodeType";
            SkipColumn[10] = "SearchString";

            sb.Append("<table class='table table-bordered table-sm table-hover'>");
            sb.Append("<thead>");
            sb.Append("<tr>");
            switch (HierLvl)
            {
                case "10":
                    sb.Append("<th colspan='2'>");
                    break;
                case "20":
                    sb.Append("<th colspan='3'>");
                    break;
                case "30":
                    sb.Append("<th colspan='4'>");
                    break;
                case "35":
                    sb.Append("<th colspan='5'>");
                    break;
                case "40":
                    sb.Append("<th colspan='6'>");
                    break;
            }
            sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnProdPopuptypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
            sb.Append("</th>");
            sb.Append("</tr>");

            sb.Append("<tr>");
            sb.Append("<th style='width: 30px;'><input id='chkSelectAllProd' type='checkbox' onclick='fnSelectAllProd(this);' /></th>");
            sb.Append("<th style='display: none;'>SearchString</th>");
            for (int j = 0; j < dt.Columns.Count; j++)
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                    sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");

            sb.Append("</tr>");

            sb.Append("</thead>");
            sb.Append("<tbody>");
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                switch (HierLvl)
                {
                    case "10":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='0' bf='0' sbf='0' grp='0' nid='" + dt.Rows[i]["CatNodeID"] + "' ntype='" + dt.Rows[i]["CatNodeType"] + "'>");
                        break;
                    case "20":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='0' sbf='0' grp='0' nid='" + dt.Rows[i]["BrnNodeID"] + "' ntype='" + dt.Rows[i]["BrnNodeType"] + "'>");
                        break;
                    case "30":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' sbf='0' grp='0' nid='" + dt.Rows[i]["BFNodeID"] + "' ntype='" + dt.Rows[i]["BFNodeType"] + "'>");
                        break;
                    case "35":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' grp='" + dt.Rows[i]["SBFGroupID"] + "' sbf='0' nid='" + dt.Rows[i]["SBFGroupID"] + "' ntype='" + dt.Rows[i]["SBFGroupNOdeType"] + "'>");
                        break;
                    case "40":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' grp='" + dt.Rows[i]["SBFGroupID"] + "' sbf='" + dt.Rows[i]["SBFNodeId"] + "' nid='" + dt.Rows[i]["SBFNodeId"] + "' ntype='" + dt.Rows[i]["SBFNodeType"] + "'>");
                        break;
                }
                sb.Append("<td><img src='../../Images/checkbox-unchecked.png'/></td>");

                sb.Append("<td style='display: none;'>" + dt.Rows[i]["SearchString"] + "</td>");
                for (int j = 0; j < dt.Columns.Count; j++)
                    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                        sb.Append("<td class='clss-" + j + "'>" + dt.Rows[i][j] + "</td>");

                sb.Append("</tr>");
            }
            sb.Append("</tbody>");
            sb.Append("</table>");
        }
        else if (BucketType == "2")
        {
            string[] SkipColumn = new string[13];
            SkipColumn[0] = "CountryNodeID";
            SkipColumn[1] = "CountryNodeType";
            SkipColumn[2] = "RegionNodeID";
            SkipColumn[3] = "RegionNodeType";
            SkipColumn[4] = "SiteNodeID";
            SkipColumn[5] = "SiteNodeType";
            SkipColumn[6] = "DBRNodeId";
            SkipColumn[7] = "DBRNodeType";
            SkipColumn[8] = "BranchNodeId";
            SkipColumn[9] = "BranchNodeType";
            SkipColumn[10] = "SUBDNodeId";
            SkipColumn[11] = "SUBDNodeType";
            SkipColumn[12] = "SearchString";

            sb.Append("<table class='table table-bordered table-sm table-hover'>");
            sb.Append("<thead>");
            sb.Append("<tr>");
            switch (HierLvl)
            {
                case "100":
                    sb.Append("<th colspan='2'>");
                    break;
                case "110":
                    sb.Append("<th colspan='3'>");
                    break;
                case "120":
                    sb.Append("<th colspan='4'>");
                    break;
                case "130":
                    sb.Append("<th colspan='5'>");
                    break;
                case "140":
                    sb.Append("<th colspan='6'>");
                    break;
            }
            sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnProdPopuptypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
            sb.Append("</th>");
            sb.Append("</tr>");

            sb.Append("<tr>");
            sb.Append("<th style='width: 30px;'><input id='chkSelectAllProd' type='checkbox' onclick='fnSelectAllProd(this);' /></th>");
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
                switch (HierLvl)
                {
                    case "100":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cntry='" + dt.Rows[i]["CountryNodeID"] + "' reg='0' site='0' dbr='0' branch='0' nid='" + dt.Rows[i]["CountryNodeID"] + "' ntype='" + dt.Rows[i]["CountryNodeType"] + "'>");
                        break;
                    case "110":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cntry='" + dt.Rows[i]["CountryNodeID"] + "' reg='" + dt.Rows[i]["RegionNodeID"] + "' site='0' dbr='0' branch='0' nid='" + dt.Rows[i]["RegionNodeID"] + "' ntype='" + dt.Rows[i]["RegionNodeType"] + "'>");
                        break;
                    case "120":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cntry='" + dt.Rows[i]["CountryNodeID"] + "' reg='" + dt.Rows[i]["RegionNodeID"] + "' site='" + dt.Rows[i]["SiteNodeID"] + "' dbr='0' branch='0' nid='" + dt.Rows[i]["SiteNodeID"] + "' ntype='" + dt.Rows[i]["SiteNodeType"] + "'>");
                        break;
                    case "130":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cntry='" + dt.Rows[i]["CountryNodeID"] + "' reg='" + dt.Rows[i]["RegionNodeID"] + "' site='" + dt.Rows[i]["SiteNodeID"] + "' dbr='" + dt.Rows[i]["DBRNodeId"] + "' branch='0' nid='" + dt.Rows[i]["DBRNodeId"] + "' ntype='" + dt.Rows[i]["DBRNodeType"] + "'>");
                        break;
                    case "140":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cntry='" + dt.Rows[i]["CountryNodeID"] + "' reg='" + dt.Rows[i]["RegionNodeID"] + "' site='" + dt.Rows[i]["SiteNodeID"] + "' dbr='" + dt.Rows[i]["DBRNodeId"] + "' branch='" + dt.Rows[i]["BranchNodeId"] + "' nid='" + dt.Rows[i]["BranchNodeId"] + "' ntype='" + dt.Rows[i]["BranchNodeType"] + "'>");
                        break;
                }
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
        }
        else if (BucketType == "3")
        {
            string[] SkipColumn = new string[7];
            SkipColumn[0] = "ClassID";
            SkipColumn[1] = "ClassNodeType";
            SkipColumn[2] = "ChannelID";
            SkipColumn[3] = "ChannelNodeType";
            SkipColumn[4] = "STNodeID";
            SkipColumn[5] = "STNodeType";
            SkipColumn[6] = "SearchString";

            sb.Append("<table class='table table-bordered table-sm table-hover'>");
            sb.Append("<thead>");
            sb.Append("<tr>");
            switch (HierLvl)
            {
                case "200":
                    sb.Append("<th colspan='2'>");
                    break;
                case "210":
                    sb.Append("<th colspan='3'>");
                    break;
                case "220":
                    sb.Append("<th colspan='4'>");
                    break;
            }
            sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnProdPopuptypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
            sb.Append("</th>");
            sb.Append("</tr>");

            sb.Append("<tr>");
            sb.Append("<th style='width: 30px;'><input id='chkSelectAllProd' type='checkbox' onclick='fnSelectAllProd(this);' /></th>");
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
                switch (HierLvl)
                {
                    case "200":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cls='" + dt.Rows[i]["ClassID"] + "' channel='0' storetype='0' nid='" + dt.Rows[i]["ClassID"] + "' ntype='" + dt.Rows[i]["ClassNodeType"] + "'>");
                        break;
                    case "210":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cls='" + dt.Rows[i]["ClassID"] + "' channel='" + dt.Rows[i]["ChannelID"] + "' storetype='0' nid='" + dt.Rows[i]["ChannelID"] + "' ntype='" + dt.Rows[i]["ChannelNodeType"] + "'>");
                        break;
                    case "220":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cls='" + dt.Rows[i]["ClassID"] + "' channel='" + dt.Rows[i]["ChannelID"] + "' storetype='" + dt.Rows[i]["STNodeID"] + "' nid='" + dt.Rows[i]["STNodeID"] + "' ntype='" + dt.Rows[i]["STNodeType"] + "'>");
                        break;
                }
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
        }
        return sb.ToString();
    }
    public static string GetSelectedHierDetail(string BucketType, object obj, string flgCallingPage)
    {
        string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        DataTable dtHier = JsonConvert.DeserializeObject<DataTable>(str);

        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        if (BucketType == "1")
            Scmd.CommandText = "[spGetHierDetails_NEW_FB]";
        else
            Scmd.CommandText = "[spGetHierDetails_New]";
        Scmd.Parameters.AddWithValue("@PrdSelection", dtHier);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        sb.Append("<table class='table table-bordered table-sm table-hover'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        if (BucketType == "1")
        {
            sb.Append("<th style='width:15%;'>Category</th>");
            sb.Append("<th style='width:20%;'>Brand</th>");
            sb.Append("<th style='width:20%;'>BrandForm</th>");
            sb.Append("<th style='width:20%;'>SBF Group</th>");
            sb.Append("<th style='width:25%;'>SubBrandForm</th>");
        }
        else if (BucketType == "2")
        {
            sb.Append("<th style='width:15%;'>Country</th>");
            sb.Append("<th style='width:20%;'>Region</th>");
            sb.Append("<th style='width:20%;'>Site</th>");
            sb.Append("<th style='width:25%;'>Distributor</th>");
            sb.Append("<th style='width:20%;'>Branch</th>");
        }
        else
        {
            sb.Append("<th style='width:30%;'>Class</th>");
            sb.Append("<th style='width:35%;'>Channel</th>");
            sb.Append("<th style='width:35%;'>Store Type</th>");
        }
        sb.Append("</th>");
        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            switch (dt.Rows[i]["NodeType"].ToString())
            {
                case "10":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='0' bf='0' grp='0' sbf='0' nid='" + dt.Rows[i]["CatNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Category"] + "</td><td>All</td><td>All</td><td>All</td><td>All</td>");
                    break;
                case "20":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrandNodeID"] + "' bf='0' grp='0' sbf='0' nid='" + dt.Rows[i]["BrandNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Category"] + "</td><td>" + dt.Rows[i]["Brand"] + "</td><td>All</td><td>All</td><td>All</td>");
                    break;
                case "30":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrandNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' grp='0' sbf='0' nid='" + dt.Rows[i]["BFNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Category"] + "</td><td>" + dt.Rows[i]["Brand"] + "</td><td>" + dt.Rows[i]["BF"] + "</td><td>All</td><td>All</td>");
                    break;
                case "35":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrandNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' grp='" + dt.Rows[i]["SBFGroupNodeID"] + "' sbf='0' nid='" + dt.Rows[i]["SBFGroupNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Category"] + "</td><td>" + dt.Rows[i]["Brand"] + "</td><td>" + dt.Rows[i]["BF"] + "</td><td>" + dt.Rows[i]["SBFGroup"] + "</td><td>All</td>");
                    break;
                case "40":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrandNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' grp='" + dt.Rows[i]["SBFGroupNodeID"] + "' sbf='" + dt.Rows[i]["SBFNodeID"] + "' nid='" + dt.Rows[i]["SBFNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Category"] + "</td><td>" + dt.Rows[i]["Brand"] + "</td><td>" + dt.Rows[i]["BF"] + "</td><td>" + dt.Rows[i]["SBFGroup"] + "</td><td>" + dt.Rows[i]["SBF"] + "</td>");
                    break;
                case "100":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cntry='" + dt.Rows[i]["CountryNodeId"] + "' reg='0' site='0' dbr='0' branch='0' nid='" + dt.Rows[i]["CountryNodeId"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Country"] + "</td><td>All</td><td>All</td><td>All</td><td>All</td>");
                    break;
                case "110":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cntry='" + dt.Rows[i]["CountryNodeId"] + "' reg='" + dt.Rows[i]["RegionNodeId"] + "' site='0' dbr='0' branch='0' nid='" + dt.Rows[i]["RegionNodeId"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Country"] + "</td><td>" + dt.Rows[i]["Region"] + "</td><td>All</td><td>All</td><td>All</td>");
                    break;
                case "120":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cntry='" + dt.Rows[i]["CountryNodeId"] + "' reg='" + dt.Rows[i]["RegionNodeId"] + "' site='" + dt.Rows[i]["SiteNodeId"] + "' dbr='0' branch='0' nid='" + dt.Rows[i]["SiteNodeId"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Country"] + "</td><td>" + dt.Rows[i]["Region"] + "</td><td>" + dt.Rows[i]["Site"] + "</td><td>All</td><td>All</td>");
                    break;
                case "130":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cntry='" + dt.Rows[i]["CountryNodeId"] + "' reg='" + dt.Rows[i]["RegionNodeId"] + "' site='" + dt.Rows[i]["SiteNodeId"] + "' dbr='" + dt.Rows[i]["DBRNodeID"] + "' branch='0' nid='" + dt.Rows[i]["DBRNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Country"] + "</td><td>" + dt.Rows[i]["Region"] + "</td><td>" + dt.Rows[i]["Site"] + "</td><td>" + dt.Rows[i]["DBR"] + "</td><td>All</td>");
                    break;
                case "140":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cntry='" + dt.Rows[i]["CountryNodeID"] + "' reg='" + dt.Rows[i]["RegionNodeID"] + "' site='" + dt.Rows[i]["SiteNodeID"] + "' dbr='" + dt.Rows[i]["DBRNodeID"] + "' branch='" + dt.Rows[i]["BranchNodeID"] + "' nid='" + dt.Rows[i]["BranchNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Country"] + "</td><td>" + dt.Rows[i]["Region"] + "</td><td>" + dt.Rows[i]["Site"] + "</td><td>" + dt.Rows[i]["DBR"] + "</td><td>" + dt.Rows[i]["Branch"] + "</td>");
                    break;
                case "200":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cls='" + dt.Rows[i]["ClassNodeID"] + "' channel='0' storetype='0' nid='" + dt.Rows[i]["ClassNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Class"] + "</td><td>All</td><td>All</td>");
                    break;
                case "210":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cls='" + dt.Rows[i]["ClassNodeID"] + "' channel='" + dt.Rows[i]["ChannelNodeID"] + "' storetype='0' nid='" + dt.Rows[i]["ChannelNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Class"] + "</td><td>" + dt.Rows[i]["Channel"] + "</td><td>All</td>");
                    break;
                case "220":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cls='" + dt.Rows[i]["ClassNodeID"] + "' channel='" + dt.Rows[i]["ChannelNodeID"] + "' storetype='" + dt.Rows[i]["StoreTypeNodeID"] + "' nid='" + dt.Rows[i]["StoreTypeNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Class"] + "</td><td>" + dt.Rows[i]["Channel"] + "</td><td>" + dt.Rows[i]["StoreType"] + "</td>");
                    break;
            }
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }

    public static string GetParentHierForNewChild(string BucketType, string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string HierLvl, string flgCallingPage)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("LoginID", LoginID);
        sqlPara.Add("UserID", UserID);
        sqlPara.Add("RoleID", RoleID);
        sqlPara.Add("UserNodeID", UserNodeID);
        sqlPara.Add("UserNodeType", UserNodeType);
        sqlPara.Add("ProdLvl", HierLvl);

        DataSet Ds = new DataSet();
        if (BucketType == "1")
            Ds = DBHelper.ExecuteDataSet("spGetPrdHierachyInTableFormat", sqlPara);
        else if (BucketType == "2")
            Ds = DBHelper.ExecuteDataSet("spGetLocHierachyInTableFormat", sqlPara);
        else if (BucketType == "3")
            Ds = DBHelper.ExecuteDataSet("spGetChannelHierachyInTableFormat", sqlPara);

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        if (BucketType == "1")
        {
            string[] SkipColumn = new string[11];
            SkipColumn[0] = "CatNodeID";
            SkipColumn[1] = "CatNodeType";
            SkipColumn[2] = "BrnNodeID";
            SkipColumn[3] = "BrnNodeType";
            SkipColumn[4] = "BFNodeID";
            SkipColumn[5] = "BFNodeType";
            SkipColumn[6] = "SBFGroupID";
            SkipColumn[7] = "SBFGroupNOdeType";
            SkipColumn[8] = "SBFNodeId";
            SkipColumn[9] = "SBFNodeType";
            SkipColumn[10] = "SearchString";

            sb.Append("<table class='table table-bordered table-sm table-hover'>");
            sb.Append("<thead>");
            sb.Append("<tr>");
            sb.Append("<th style='display: none;'>#</th>");
            sb.Append("<th style='display: none;'>SearchString</th>");
            for (int j = 0; j < dt.Columns.Count; j++)
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                    sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");

            sb.Append("</tr>");
            sb.Append("</thead>");
            sb.Append("<tbody>");
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                switch (HierLvl)
                {
                    case "10":
                        sb.Append("<tr onclick='fnSelectProdforNewNode(this);' flg='0' nid='" + dt.Rows[i]["CatNodeID"] + "' ntype='" + dt.Rows[i]["CatNodeType"] + "'>");
                        break;
                    case "20":
                        sb.Append("<tr onclick='fnSelectProdforNewNode(this);' flg='0' nid='" + dt.Rows[i]["BrnNodeID"] + "' ntype='" + dt.Rows[i]["BrnNodeType"] + "'>");
                        break;
                    case "30":
                        sb.Append("<tr onclick='fnSelectProdforNewNode(this);' flg='0' nid='" + dt.Rows[i]["BFNodeID"] + "' ntype='" + dt.Rows[i]["BFNodeType"] + "'>");
                        break;
                    case "35":
                        sb.Append("<tr onclick='fnSelectProdforNewNode(this);' flg='0' nid='" + dt.Rows[i]["SBFGroupID"] + "' ntype='" + dt.Rows[i]["SBFGroupNOdeType"] + "'>");
                        break;
                    case "40":
                        sb.Append("<tr onclick='fnSelectProdforNewNode(this);' flg='0' nid='" + dt.Rows[i]["SBFNodeId"] + "' ntype='" + dt.Rows[i]["SBFNodeType"] + "'>");
                        break;
                }
                sb.Append("<td style='display: none;'>" + (i + 1).ToString() + "</td>");
                sb.Append("<td style='display: none;'>" + dt.Rows[i]["SearchString"] + "</td>");
                for (int j = 0; j < dt.Columns.Count; j++)
                    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                        sb.Append("<td class='cls-" + j + "'>" + dt.Rows[i][j] + "</td>");

                sb.Append("</tr>");
            }
            sb.Append("</tbody>");
            sb.Append("</table>");
        }
        else if (BucketType == "2")
        {
            //
        }
        else if (BucketType == "3")
        {
            //
        }
        return sb.ToString();
    }

    public static string GetHierTblAtSpecificLvl(string BucketType, string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string HierLvl, string flgCallingPage)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("LoginID", LoginID);
        sqlPara.Add("UserID", UserID);
        sqlPara.Add("RoleID", RoleID);
        sqlPara.Add("UserNodeID", UserNodeID);
        sqlPara.Add("UserNodeType", UserNodeType);
        sqlPara.Add("ProdLvl", HierLvl);

        DataSet Ds = new DataSet();
        if (BucketType == "1")
            Ds = DBHelper.ExecuteDataSet("spGetPrdHierachyInTableFormat", sqlPara);
        else if (BucketType == "2")
            Ds = DBHelper.ExecuteDataSet("spGetLocHierachyInTableFormat", sqlPara);
        else if (BucketType == "3")
            Ds = DBHelper.ExecuteDataSet("spGetChannelHierachyInTableFormat", sqlPara);

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        if (BucketType == "1")                          //Currently configured for SBF Lvl.
        {
            string[] SkipColumn = new string[11];
            SkipColumn[0] = "CatNodeID";
            SkipColumn[1] = "CatNodeType";
            SkipColumn[2] = "BrnNodeID";
            SkipColumn[3] = "BrnNodeType";
            SkipColumn[4] = "BFNodeID";
            SkipColumn[5] = "BFNodeType";
            SkipColumn[6] = "SBFGroupID";
            SkipColumn[7] = "SBFGroupNOdeType";
            SkipColumn[8] = "SBFNodeId";
            SkipColumn[9] = "SBFNodeType";
            SkipColumn[10] = "SearchString";

            sb.Append("<table class='table table-bordered table-sm table-hover'>");
            sb.Append("<thead>");

            sb.Append("<tr>");
            sb.Append("<th colspan='6'>");
            sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnPopupHierTblAtSpecificLvlTypeFilter(this);' placeholder='Type atleast 3 character to filter...'/>");
            sb.Append("</th>");
            sb.Append("</tr>");

            sb.Append("<tr>");
            sb.Append("<th style='width: 30px;'></th>");
            sb.Append("<th style='display: none;'>SearchString</th>");
            for (int j = 0; j < dt.Columns.Count; j++)
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                    sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");

            sb.Append("</tr>");

            sb.Append("</thead>");
            sb.Append("<tbody>");
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                sb.Append("<tr onclick='fnSelectUnSelectSBF(this);' flg='0' flgVisible='1' flgDisable='0' nid='" + dt.Rows[i]["SBFNodeId"] + "' ntype='" + dt.Rows[i]["SBFNodeType"] + "'>");

                sb.Append("<td><img src='../../Images/checkbox-unchecked.png'/></td>");
                sb.Append("<td style='display: none;'>" + dt.Rows[i]["SearchString"] + "</td>");
                for (int j = 0; j < dt.Columns.Count; j++)
                    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                        sb.Append("<td class='clss-" + j + "'>" + dt.Rows[i][j] + "</td>");

                sb.Append("</tr>");
            }
            sb.Append("</tbody>");
            sb.Append("</table>");
        }
        else if (BucketType == "2")
        {
            //
        }
        else if (BucketType == "3")
        {
            //
        }
        return sb.ToString();
    }

    public static string GetBucketDetailsbasedonType(string BucketType, string LoginID, string UserID, string RoleID, string MonthQtr, string QtrYear, bool IsCluster, string flgCallingPage)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("BucketTypeID", BucketType);
        sqlPara.Add("LoginID", LoginID);
        sqlPara.Add("UserID", UserID);
        sqlPara.Add("RoleID", RoleID);
        if (IsCluster)
        {
            sqlPara.Add("QtrNo", MonthQtr);
            sqlPara.Add("QtrYear", QtrYear);
        }
        DataSet Ds = DBHelper.ExecuteDataSet("spGetBucketbasedonType", sqlPara);

        return GetBucketPopupStr(Ds.Tables[0], Ds.Tables[1], IsCluster, flgCallingPage);
    }
    private static string GetBucketPopupStr(DataTable dt, DataTable dtMapping, bool IsCluster, string flgCallingPage)
    {
        string[] SkipColumn = new string[3];
        SkipColumn[0] = "BucketID";
        SkipColumn[1] = "StrValue";
        SkipColumn[2] = "flgIncludeSubD";

        StringBuilder sb = new StringBuilder();
        sb.Append("<table class='table table-bordered table-sm table-hover'>");
        sb.Append("<thead>");

        sb.Append("<tr>");
        sb.Append("<th colspan='2'>");

        if (IsCluster)
            if (flgCallingPage == "71" || flgCallingPage == "72")
                sb.Append("<input type='text' id='txtClusterPopupFilter' class='form-control form-control-sm' style='width: 80%; float: left;'/><a href='#' class='btn btn-primary btn-sm ml-1' style='width: 9%;' onclick='fnClusterPopupFilter();'>Filter</a><a href='#' class='btn btn-primary btn-sm ml-1' style='width: 9%;' onclick='fnClusterPopupClearFilter();'>Clear</a>");
            else
                sb.Append("<input type='text' id='txtClusterPopupFilter' class='form-control form-control-sm' onkeyup='fnClusterPopuptypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
        else
            sb.Append("<input type='text' id='txtClusterPopupFilter' class='form-control form-control-sm' onkeyup='fnCopyBucketPopuptypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");

        sb.Append("</th>");
        sb.Append("</tr>");
        sb.Append("<tr><th style='width: 30px;'></th><th>Name</th></tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            if (IsCluster)
                sb.Append("<tr onclick='fnSelectUnSelectCluster(this);' flg='0' flgVisible='1' clusterid='" + dt.Rows[i]["BucketID"] + "' StrValue='" + getBucketChildstr(dt.Rows[i]["BucketID"].ToString(), dtMapping) + "'>");
            else
                sb.Append("<tr onclick='fnSelectUnSelectBucket(this);' flg='0' flgVisible='1' BucketID='" + dt.Rows[i]["BucketID"] + "' StrValue='" + getBucketChildstr(dt.Rows[i]["BucketID"].ToString(), dtMapping) + "' InSubD='" + dt.Rows[i]["flgIncludeSubD"] + "'>");


            sb.Append("<td><img src='../../Images/checkbox-unchecked.png' /></td>");
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
    private static string getBucketChildstr(string BucketID, DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        DataRow[] dr = dt.Select("BucketID=" + BucketID);
        if (dr.Length > 0)
        {
            DataTable dttemp = dr.CopyToDataTable();
            for (int k = 0; k < dttemp.Rows.Count; k++)
            {
                if (k != 0)
                    sb.Append("^");

                sb.Append(dttemp.Rows[k]["NodeID"].ToString() + "|" + dttemp.Rows[k]["NodeType"].ToString());
            }
        }
        else
            sb.Append("");

        return sb.ToString();
    }


    public static DataSet BucketFilterTillLastlvl(string BucketType, string QtrNo, string QtrYear, string strSearch)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("MonthVal", QtrNo);
        sqlPara.Add("YearVal", QtrYear);
        sqlPara.Add("strSerach", strSearch);
        DataSet Ds = DBHelper.ExecuteDataSet("spFBSerachCluster", sqlPara);
        return Ds;
    }



    public static DataSet AddEditSBFGroup(string GroupID, string GroupCode, string GroupName, string LoginID, string RoleID)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("GroupName", GroupName);
        sqlPara.Add("GroupID", GroupID);
        sqlPara.Add("LoginID", LoginID);
        sqlPara.Add("RoleID", RoleID);
        sqlPara.Add("GroupCode", GroupCode);
        DataSet Ds = DBHelper.ExecuteDataSet("spSBFGroupCreateGroup", sqlPara);
        return Ds;
    }
    public static DataSet SBFGroupMapping(string strSBFGroiPMapping, string LoginID, string UserID)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("strSBFGroiPMapping", strSBFGroiPMapping);
        sqlPara.Add("UserID", UserID);
        sqlPara.Add("LoginID", LoginID);
        DataSet Ds = DBHelper.ExecuteDataSet("spSBFGroupUpdateMapping", sqlPara);
        return Ds;
    }


    public static DataSet AddNewNode(string NodeType, string NodeCode, string NodeName, string PNodeID, string PNodeType, string LoginID)
    {
        Dictionary<string, string> sqlPara = new Dictionary<string, string>();
        sqlPara.Add("Code", NodeCode);
        sqlPara.Add("Descr", NodeName);
        sqlPara.Add("PNodeID", PNodeID);
        sqlPara.Add("PNodeType", PNodeType);
        sqlPara.Add("NodeType", NodeType);
        sqlPara.Add("LoginID", LoginID);
        DataSet Ds = DBHelper.ExecuteDataSet("spPrdAddBFSBF", sqlPara);
        return Ds;
    }




    // --------------------------------- Import FB -------------------------------------------------------------//
    public static string GetFBforImport(string UserID, string LoginID, string FromDate, string EndDate, object objProd, object objLoc, object objChannel, string flgOldNew, string flgFBType, string flgChannel, string flgCalled)
    {
        try
        {
            DataTable tblProd = new DataTable();
            string str = JsonConvert.SerializeObject(objProd, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblProd = JsonConvert.DeserializeObject<DataTable>(str);
            if (tblProd.Rows[0][0].ToString() == "0")
                tblProd.Rows.RemoveAt(0);

            DataTable tblLoc = new DataTable();
            string strLoc = JsonConvert.SerializeObject(objLoc, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblLoc = JsonConvert.DeserializeObject<DataTable>(strLoc);
            if (tblLoc.Rows[0][0].ToString() == "0")
                tblLoc.Rows.RemoveAt(0);

            DataTable tblChannel = new DataTable();
            string strChannel = JsonConvert.SerializeObject(objChannel, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblChannel = JsonConvert.DeserializeObject<DataTable>(strChannel);
            if (tblChannel.Rows[0][0].ToString() == "0")
                tblChannel.Rows.RemoveAt(0);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "[spFBGetFBForImportCombined]";
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
            Scmd.Parameters.AddWithValue("@LocSelection", tblLoc);
            Scmd.Parameters.AddWithValue("@ChannelSelection", tblChannel);
            Scmd.Parameters.AddWithValue("@FromDate", FromDate);
            Scmd.Parameters.AddWithValue("@EndDate", EndDate);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@flgOldNew", flgOldNew);            // 1: Old, 2: New
            Scmd.Parameters.AddWithValue("@flgBaseTopup", flgFBType);         // 1: Base, 2: Topup
            Scmd.Parameters.AddWithValue("@CalledFromINIT", flgCalled);       // 1: INIT, 0: FB
            Scmd.Parameters.AddWithValue("@flgSmallChannel", flgChannel);     // 1: Small, 0: All
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0|^|" + CreateInitiativeListTbl(Ds, "FBImport");
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string CreateInitiativeListTbl(DataSet Ds, string lbl)
    {
        string[] SkipColumn = new string[1];
        SkipColumn[0] = "FBID";

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();

        sb.Append("<table id='tbl" + lbl + "' class='table table-striped table-bordered table-sm tbl-" + lbl + "'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th><input type='checkbox' onclick='fnChkUnchkInitAllPopup(this);'/></th>");
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
            sb.Append("<tr Init='" + dt.Rows[i]["FBID"] + "'>");
            sb.Append("<td><input iden='chkInit' type='checkbox' onclick='fnUnchkInitIndividual(this);'/></td>");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                {
                    sb.Append("<td>" + dt.Rows[i][j] + "</td>");
                }
            }
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    public static string ImportFB(string RoleID, string UserID, string LoginID, string FromDate, string ToDate, object objFB, string flgOldNew, string flgFBType, string flgCalled)
    {
        try
        {
            string strFB = JsonConvert.SerializeObject(objFB, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblFB = JsonConvert.DeserializeObject<DataTable>(strFB);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spFBCopyFB_Combined";
            Scmd.Parameters.AddWithValue("@FBIDSs", tblFB);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@StartDate", FromDate);
            Scmd.Parameters.AddWithValue("@EndDate", ToDate);
            Scmd.Parameters.AddWithValue("@flgOldNew", flgOldNew);            // 1: Old, 2: New
            Scmd.Parameters.AddWithValue("@flgBaseTopup", flgFBType);         // 1: Base, 2: Topup
            Scmd.Parameters.AddWithValue("@CalledFromINIT", flgCalled);       // 1: INIT, 0: FB
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
}