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

public partial class _BucketMstr : System.Web.UI.Page
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

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "10"))
                    GetMaster();
                else
                    Response.Redirect("~/frmLogin.aspx");
            }
        }
    }
    private void GetMaster()
    {
        hdnProductLvl.Value = "<div class='producthrchy'>Product Level</div>" + Utilities.GetHierLvl("1", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "10");

        hdnLocationLvl.Value = "<div class='producthrchy'>Location Level</div>" + Utilities.GetHierLvl("2", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "10");

        hdnChannelLvl.Value = "<div class='producthrchy'>Channel Level</div>" + Utilities.GetHierLvl("3", hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "10");



        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spBucketGetBucketType";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        StringBuilder sbBucketType = new StringBuilder();
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            if (i == 0)
            {
                sbBucketType.Append("<li BucketTypeID='" + Ds.Tables[0].Rows[i]["BucketTypeID"].ToString() + "' onclick='fnBucketTypeSel(this);'><a class='nav-link active' href='#'>" + Ds.Tables[0].Rows[i]["BucketType"].ToString() + "</a></li>");
                hdnBucketType.Value = Ds.Tables[0].Rows[i]["BucketTypeID"].ToString();
            }
            else
                sbBucketType.Append("<li BucketTypeID='" + Ds.Tables[0].Rows[i]["BucketTypeID"].ToString() + "' onclick='fnBucketTypeSel(this);'><a class='nav-link' href='#'>" + Ds.Tables[0].Rows[i]["BucketType"].ToString() + "</a></li>");
        }
        TabHead.InnerHtml = sbBucketType.ToString();
    }



    [System.Web.Services.WebMethod()]
    public static string fnProdHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, string flg, object obj)
    {
        try
        {
            if (flg == "1")
            {
                DataTable tbl = new DataTable();
                string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
                tbl = JsonConvert.DeserializeObject<DataTable>(str);
                if (tbl.Rows.Count > 0)
                {
                    return "0|^|" + Utilities.GetHierDetail("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "10") + "|^|" + Utilities.GetSelectedHierDetail("1", obj, "10");
                }
                else
                    return "0|^|" + Utilities.GetHierDetail("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "10") + "|^|";
            }
            else
                return "0|^|" + Utilities.GetParentHierForNewChild("1", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "10") + "|^|";

        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }

    [System.Web.Services.WebMethod()]
    public static string fnLocationHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, string flg, object obj, string InSubD)
    {
        try
        {
            DataTable tbl = new DataTable();
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);
            if (tbl.Rows.Count > 0)
            {
                return "0|^|" + Utilities.GetHierDetail("2", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "10") + "|^|" + Utilities.GetSelectedHierDetail("2", obj, "10");
            }
            else
                return "0|^|" + Utilities.GetHierDetail("2", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "10") + "|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }

    [System.Web.Services.WebMethod()]
    public static string fnChannelHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, string flg, object obj)
    {
        try
        {
            DataTable tbl = new DataTable();
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);
            if (tbl.Rows.Count > 0)
            {
                return "0|^|" + Utilities.GetHierDetail("3", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "10") + "|^|" + Utilities.GetSelectedHierDetail("3", obj, "10");
            }
            else
                return "0|^|" + Utilities.GetHierDetail("3", LoginID, UserID, RoleID, UserNodeID, UserNodeType, ProdLvl, "10") + "|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    

    [System.Web.Services.WebMethod()]
    public static string fnGetReport(string LoginID, string UserID, string BucketType, object objProd, object objInit, string FromDate, string ToDate)
    {
        try
        {
            DataTable tblProd = new DataTable();
            string str = JsonConvert.SerializeObject(objProd, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblProd = JsonConvert.DeserializeObject<DataTable>(str);
            if (tblProd.Rows[0][0].ToString() == "0")
            {
                tblProd.Rows.RemoveAt(0);
            }

            DataTable tblInit = new DataTable();
            string strInit = JsonConvert.SerializeObject(objInit, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblInit = JsonConvert.DeserializeObject<DataTable>(strInit);
            if (tblInit.Rows[0][0].ToString() == "0")
            {
                tblInit.Rows.RemoveAt(0);
            }

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spGetBucketInfo";
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@BucketTypeID", BucketType);
            Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
            Scmd.Parameters.AddWithValue("@INITCodes", tblInit);
            Scmd.Parameters.AddWithValue("@FromDate", FromDate);
            Scmd.Parameters.AddWithValue("@EndDate", ToDate);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            string[] SkipColumn = new string[5];
            SkipColumn[0] = "BucketID";
            SkipColumn[1] = "LvlNodeType";
            SkipColumn[2] = "StrValue";
            SkipColumn[3] = "AllProducts";
            SkipColumn[4] = "BucketType";
            return "0|^|" + CreateBucketMstrTbl(Ds, SkipColumn, "tblReport", "clsReport");
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string CreateBucketMstrTbl(DataSet Ds, string[] SkipColumn, string tblname, string cls)
    {
        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        StringBuilder sbBucketSelection = new StringBuilder();

        sb.Append("<table id='" + tblname + "' class='table table-striped table-bordered table-sm " + cls + "'>");
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
            sbBucketSelection.Clear();
            sbBucketSelection.Append(getBucketSelectionStr(dt.Rows[i]["BucketID"].ToString(), Ds.Tables[1]));

            sb.Append("<tr Bucket='" + dt.Rows[i]["BucketID"] + "' BucketType='" + dt.Rows[i]["BucketType"].ToString() + "' Bucketstr='" + dt.Rows[i]["BucketName"] + "' Descr='" + (dt.Rows[i]["Description"].ToString().Length > 20 ? dt.Rows[i]["Description"].ToString().Substring(0, 18) + ".." : dt.Rows[i]["Description"].ToString()) + "' InSubD='0' Prodstr='" + sbBucketSelection.ToString().Split('~')[3] + "' ProdLvl='" + sbBucketSelection.ToString().Split('~')[0] + "' Prodselstr='" + sbBucketSelection.ToString().Split('~')[2] + "' flgcopyprod='0'>");

            sb.Append("<td>" + (i + 1).ToString() + "</td>");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                {
                    if (dt.Columns[j].ColumnName.ToString() == "Description")
                        sb.Append("<td title='" + dt.Rows[i]["Description"] + "' class='clsInform'>" + (dt.Rows[i]["Description"].ToString().Length > 20 ? dt.Rows[i]["Description"].ToString().Substring(0, 18) + ".." : dt.Rows[i]["Description"].ToString()) + "</td>");
                    else if (dt.Columns[j].ColumnName.ToString() == "Products" || dt.Columns[j].ColumnName.ToString() == "Sites" || dt.Columns[j].ColumnName.ToString() == "Channels")
                        sb.Append("<td><span title='" + customTooltipCommaFormat(dt.Rows[i]["BucketID"].ToString(), sbBucketSelection.ToString().Split('~')[1], Ds.Tables[1]) + "' class='clsInform'>" + (sbBucketSelection.ToString().Split('~')[3].Length > 40 ? sbBucketSelection.ToString().Split('~')[3].Substring(0, 38) + ".." : sbBucketSelection.ToString().Split('~')[3]) + "</span><img src='../../Images/copy.png' title='copy' onclick='fncopyprod(this);' style='float: right;'/></td>");
                    else
                        sb.Append("<td>" + dt.Rows[i][j] + "</td>");
                }
            }
            sb.Append("<td class='clstdAction'><img src='../../Images/copy.png' title='copy' onclick='fnCopy(this);' style='margin-right: 12px;'/><img src='../../Images/edit.png' title='edit' onclick='fnEdit(this);'/></td>");
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    private static string getBucketSelectionStr(string BucketID, DataTable dt)
    {
        int lvl = 0;
        string Prodlvl = "";
        StringBuilder sb = new StringBuilder();
        StringBuilder sblvl = new StringBuilder();
        StringBuilder sbdescr = new StringBuilder();

        DataRow[] dr = dt.Select("BucketID=" + BucketID);
        if (dr.Length > 0)
        {
            DataView tempView = dr.CopyToDataTable().DefaultView;
            tempView.Sort = "NodeType ASC";
            DataTable dttemp = tempView.ToTable();
            for (int k = 0; k < dttemp.Rows.Count; k++)
            {
                if (k != 0)
                {
                    sb.Append("^");
                    sbdescr.Append(", ");
                }

                if (Prodlvl != dttemp.Rows[k]["NodeType"].ToString())
                {
                    Prodlvl = dttemp.Rows[k]["NodeType"].ToString();
                    if (sblvl.ToString() != "")
                        sblvl.Append("^");

                    sblvl.Append(dttemp.Rows[k]["NodeType"].ToString());

                    if (lvl < Convert.ToInt32(dttemp.Rows[k]["NodeType"].ToString()) || lvl == 0)
                        lvl = Convert.ToInt32(dttemp.Rows[k]["NodeType"].ToString());
                }

                sb.Append(dttemp.Rows[k]["NodeID"].ToString() + "|" + dttemp.Rows[k]["NodeType"].ToString());
                sbdescr.Append(dttemp.Rows[k]["Descr"].ToString());
            }
        }

        return lvl + "~" + sblvl.ToString() + "~" + sb.ToString() + "~" + sbdescr.ToString();
    }    
    private static string customTooltipCommaFormat(string BucketID, string ProdLvl, DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        DataRow[] dr = dt.Select("BucketID=" + BucketID);
        if (dr.Length > 0)
        {
            DataTable dtBucket = dr.CopyToDataTable();

            for (int i = 0; i < ProdLvl.Split('^').Length; i++)
            {
                DataRow[] drlvl = dtBucket.Select("NodeType=" + ProdLvl.Split('^')[i]);
                if (drlvl.Length > 0)
                {
                    DataTable dtlvl = drlvl.CopyToDataTable();

                    sb.Append("<div>");
                    sb.Append("<span>" + dtlvl.Rows[0]["NodeTypelvl"].ToString() + "  -  </span>");
                    for (int j = 0; j < dtlvl.Rows.Count; j++)
                    {
                        if (j != 0)
                            sb.Append(",  ");

                        sb.Append(dtlvl.Rows[j]["Descr"].ToString());
                    }
                    sb.Append("</div>");

                }
            }
        }
        return sb.ToString();
    }


    // ---------------------------- Not In Use ---------------------------------//
    private static string customTooltipTblFormat(string BucketID, string ProdLvl, DataTable dt)
    {
        Dictionary<string, string> Nodelvl = new Dictionary<string, string>();
        Nodelvl.Add("10", "Category");
        Nodelvl.Add("20", "Brand");
        Nodelvl.Add("30", "BrandForm");
        Nodelvl.Add("35", "SBFGroupName");
        Nodelvl.Add("40", "SubBrandForm");
        Nodelvl.Add("100", "Country");
        Nodelvl.Add("110", "Region");
        Nodelvl.Add("120", "Site");
        Nodelvl.Add("130", "Distributor");
        Nodelvl.Add("140", "Branch");
        Nodelvl.Add("150", "SubD");
        Nodelvl.Add("200", "Class");
        Nodelvl.Add("210", "Channel");
        Nodelvl.Add("220", "Store Type");


        int secCntr = 1;
        bool IsFirstLvl = false;
        StringBuilder sb = new StringBuilder();
        DataRow[] dr = dt.Select("BucketID=" + BucketID);
        if (dr.Length > 0)
        {
            DataTable dtBucket = dr.CopyToDataTable();
            if (dtBucket.Rows.Count > 22)
                secCntr = 4;
            else if (dtBucket.Rows.Count > 11)
                secCntr = 3;
            else if (dtBucket.Rows.Count > 6)
                secCntr = 2;
            else
                secCntr = 1;

            for (int i = 0; i < ProdLvl.Split('^').Length; i++)
            {
                if (ProdLvl.Split('^')[i] == "10" || ProdLvl.Split('^')[i] == "100" || ProdLvl.Split('^')[i] == "200")
                    IsFirstLvl = true;
                else
                    IsFirstLvl = false;

                DataRow[] drlvl = dtBucket.Select("NodeType=" + ProdLvl.Split('^')[i]);
                if (drlvl.Length > 0)
                {
                    DataTable dtlvl = drlvl.CopyToDataTable();

                    sb.Append("<div>Selection Level : <span>" + Nodelvl[ProdLvl.Split('^')[i]] + "</span></div>");
                    sb.Append("<table>");
                    sb.Append("<thead>");
                    sb.Append("<tr>");
                    for (int j = 0; j < secCntr; j++)
                    {
                        if (IsFirstLvl)
                            sb.Append("<th>" + Nodelvl[ProdLvl.Split('^')[i]] + "</th>");
                        else
                            sb.Append("<th>" + Nodelvl[dtlvl.Rows[0]["PNodeType"].ToString()] + "</th><th>" + Nodelvl[ProdLvl.Split('^')[i]] + "</th>");
                    }
                    sb.Append("</tr>");
                    sb.Append("</thead>");
                    sb.Append("<tbody>");
                    sb.Append("<tr>");
                    for (int j = 0; j < dtlvl.Rows.Count; j++)
                    {
                        if (j % secCntr == 0)
                            sb.Append("</tr><tr>");

                        if (IsFirstLvl)
                            sb.Append("<td>" + dtlvl.Rows[j]["Descr"].ToString() + "</td>");
                        else
                            sb.Append("<td>" + dtlvl.Rows[j]["Parent"].ToString() + "</td><td>" + dtlvl.Rows[j]["Descr"].ToString() + "</td>");
                    }
                    sb.Append("</tr>");
                    sb.Append("</tbody>");
                    sb.Append("</table>");

                }
            }
        }
        return sb.ToString();
    }
    // ---------------------------- Not In Use ---------------------------------//



    [System.Web.Services.WebMethod()]
    public static string fnGetInitiativelst(string BucketId, string BucketType)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spBucketcheckBucketUsedinINIT";
            Scmd.Parameters.AddWithValue("@BucketID", BucketId);
            Scmd.Parameters.AddWithValue("@BucketTypeID", BucketType);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            StringBuilder sb = new StringBuilder();
            if (Ds.Tables[0].Rows.Count > 0)
            {
                sb.Append("Selected Bucket is already used in following Initiative(s) : ");
                sb.Append("<ul>");
                for (int i = 0; i < Ds.Tables[0].Rows.Count; i++)
                {
                    sb.Append("<li strId='" + Ds.Tables[0].Rows[i]["INITID"] + "' style='color: #5F68BC;'>");
                    sb.Append(Ds.Tables[0].Rows[i]["Recm. Trade Plan"]);
                    sb.Append("</li>");
                }
                sb.Append("</ul>");
                sb.Append("Do you want to reflect the changes in all above Initiative(s) ?");
            }

            return "0|^|" + sb.ToString();
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnSave(string BucketID, string BucketName, string BucketDescr, string BucketType, string flgActive, object obj, string LoginID, string PrdLvl, string PrdString, string InSubD, object objINIT)
    {
        try
        {
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tbl = JsonConvert.DeserializeObject<DataTable>(str);

            string strINIT = JsonConvert.SerializeObject(objINIT, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblINIT = JsonConvert.DeserializeObject<DataTable>(strINIT);
            if (tblINIT.Rows[0][0].ToString() == "0")
            {
                tblINIT.Rows.RemoveAt(0);
            }

            StringBuilder sb = new StringBuilder();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spBucketSaveBucket";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.Parameters.AddWithValue("@BucketID", BucketID);
            Scmd.Parameters.AddWithValue("@BucketName", Utilities.XSSHandling(BucketName));
            Scmd.Parameters.AddWithValue("@BucketDescr", Utilities.XSSHandling(BucketDescr));
            Scmd.Parameters.AddWithValue("@flgActive", flgActive);
            Scmd.Parameters.AddWithValue("@BucketTypeID", BucketType);
            Scmd.Parameters.AddWithValue("@BucketValues", tbl);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@PrdLvl", PrdLvl);
            //Scmd.Parameters.AddWithValue("@PrdString", Utilities.XSSHandling(PrdString));
            Scmd.Parameters.AddWithValue("@flgIncludeSubD", InSubD);
            Scmd.Parameters.AddWithValue("@INITIDs", tblINIT);
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) > -1)
            {
                return "0|^|";
            }
            else if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -1)
            {
                return "1|^|";
            }
            else
            {
                return "2|^|";
            }
        }
        catch (Exception e)
        {
            return "2|^|" + e.Message;
        }
    }
    
    
    [System.Web.Services.WebMethod()]
    public static string fnSaveNewNode(string NodeId, string Code, string Descr, string NodeType, string ParentId, string ParentType, string LoginID, string UserID, string RoleID)
    {
        try
        {
            DataSet Ds = new DataSet();
            if (NodeType != "35")
            {
                Ds = Utilities.AddNewNode(NodeType, Utilities.XSSHandling(Code), Utilities.XSSHandling(Descr), ParentId, ParentType, LoginID);
                NodeId = Ds.Tables[0].Rows[0][0].ToString();
            }
            else
            {
                Ds = Utilities.AddEditSBFGroup(NodeId, Utilities.XSSHandling(Code), Utilities.XSSHandling(Descr), LoginID, RoleID);
                NodeId = Ds.Tables[0].Rows[0]["GroupID"].ToString();

                Ds.Clear();
                Utilities.SBFGroupMapping(ParentId + "^" + NodeId + "|", LoginID, UserID);
            }

            return "0|^|" + NodeId + "^" + NodeType;
        }
        catch (Exception ex)
        {
            return "2|^|" + ex.Message;
        }
    }
}