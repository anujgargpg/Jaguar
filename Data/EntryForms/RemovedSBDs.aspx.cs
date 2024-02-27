﻿using Newtonsoft.Json;
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
using ClosedXML.Excel;
using System.IO;

public partial class RemovedSBDs : System.Web.UI.Page
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
                //hdnIsNewAdditionAllowed.Value = "1";                      // 1 : Allowed
                hdnLoginID.Value = Session["LoginID"].ToString();
                hdnUserID.Value = Session["UserID"].ToString();
                hdnRoleID.Value = Session["RoleId"].ToString();
                hdnNodeID.Value = Session["NodeId"].ToString();
                hdnNodeType.Value = Session["NodeType"].ToString();

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "63"))
                {
                    GetMaster();
                    hdnSBFHierforBasePopup.Value = fnProdHier(hdnLoginID.Value, hdnUserID.Value, hdnRoleID.Value, hdnNodeID.Value, hdnNodeType.Value, "40", "1", null);
                }
                else
                    Response.Redirect("~/frmLogin.aspx");

            }
        }
    }
    private void GetMaster()
    {
        StringBuilder sbMstr = new StringBuilder();
        StringBuilder sbSelectedstr = new StringBuilder();
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());

        //------- Product Lvl
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spGetProdHierLvl";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@UserID", hdnUserID.Value);
        Scmd.Parameters.AddWithValue("@RoleID", hdnRoleID.Value);
        Scmd.Parameters.AddWithValue("@UserNodeID", hdnNodeID.Value);
        Scmd.Parameters.AddWithValue("@UserNodeType", hdnNodeType.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        StringBuilder sbProductLvl = new StringBuilder();
        sbProductLvl.Append("<div class='producthrchy'>Product Level</div>");
        sbProductLvl.Append("<table class='productlvl_list'>");
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            if (i != 0)
                sbProductLvl.Append("<tr><td ntype='" + Ds.Tables[0].Rows[i]["NodeType"].ToString() + "' onclick='fnProdLvl(this);'><img src='../../Images/Down-Right-Arrow.png' />" + Ds.Tables[0].Rows[i]["lvl"].ToString() + "</td></tr>");
            else
                sbProductLvl.Append("<tr><td ntype='" + Ds.Tables[0].Rows[i]["NodeType"].ToString() + "' onclick='fnProdLvl(this);'>" + Ds.Tables[0].Rows[i]["lvl"].ToString() + "</td></tr>");
        }
        sbProductLvl.Append("</table>");
        hdnProductLvl.Value = sbProductLvl.ToString();

        //------- Location Lvl
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spGetLocHierLvl";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@UserID", hdnUserID.Value);
        Scmd.Parameters.AddWithValue("@RoleID", hdnRoleID.Value);
        Scmd.Parameters.AddWithValue("@UserNodeID", hdnNodeID.Value);
        Scmd.Parameters.AddWithValue("@UserNodeType", hdnNodeType.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        StringBuilder sbLocationLvl = new StringBuilder();
        sbLocationLvl.Append("<div class='producthrchy'>Location Level</div>");
        sbLocationLvl.Append("<table class='productlvl_list' style='margin-bottom: 12px;'>");
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            if (i != 0)
                sbLocationLvl.Append("<tr><td ntype='" + Ds.Tables[0].Rows[i]["NodeType"].ToString() + "' onclick='fnProdLvl(this);'><img src='../../Images/Down-Right-Arrow.png'/>" + Ds.Tables[0].Rows[i]["lvl"].ToString() + "</td></tr>");
            else
                sbLocationLvl.Append("<tr><td ntype='" + Ds.Tables[0].Rows[i]["NodeType"].ToString() + "' onclick='fnProdLvl(this);'>" + Ds.Tables[0].Rows[i]["lvl"].ToString() + "</td></tr>");
        }
        sbLocationLvl.Append("</table>");
        hdnLocationLvl.Value = sbLocationLvl.ToString();

        //------- Channel Lvl
        Ds.Clear();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spGetChannelHierLvl ";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@UserID", hdnUserID.Value);
        Scmd.Parameters.AddWithValue("@RoleID", hdnRoleID.Value);
        Scmd.Parameters.AddWithValue("@UserNodeID", hdnNodeID.Value);
        Scmd.Parameters.AddWithValue("@UserNodeType", hdnNodeType.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        StringBuilder sbChannelLvl = new StringBuilder();
        sbChannelLvl.Append("<div class='producthrchy'>Channel Level</div>");
        sbChannelLvl.Append("<table class='productlvl_list' style='margin-bottom: 12px;'>");
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            if (Ds.Tables[0].Rows[i]["NodeType"].ToString() != "220")
            {
                if (i != 0)
                    sbChannelLvl.Append("<tr><td ntype='" + Ds.Tables[0].Rows[i]["NodeType"].ToString() + "' onclick='fnProdLvl(this);'><img src='../../Images/Down-Right-Arrow.png' />" + Ds.Tables[0].Rows[i]["lvl"].ToString() + "</td></tr>");
                else
                    sbChannelLvl.Append("<tr><td ntype='" + Ds.Tables[0].Rows[i]["NodeType"].ToString() + "' onclick='fnProdLvl(this);'>" + Ds.Tables[0].Rows[i]["lvl"].ToString() + "</td></tr>");
            }
        }
        sbChannelLvl.Append("</table>");
        hdnChannelLvl.Value = sbChannelLvl.ToString();

        //------- Quarter
        Ds.Clear();
        sbMstr.Clear();
        sbSelectedstr.Clear();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spSBDGetQtr]";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@UserID", hdnUserID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["FromDate"].ToString() + "|" + Ds.Tables[0].Rows[i]["ToDate"].ToString() + "|" + Ds.Tables[0].Rows[i]["QtrNo"].ToString() + "|" + Ds.Tables[0].Rows[i]["Year"].ToString() + "' Qtrtype='" + Ds.Tables[0].Rows[i]["flgSelect"].ToString() + "'>" + Ds.Tables[0].Rows[i]["QrtName"].ToString() + "</option>");

            if (Ds.Tables[0].Rows[i]["flgSelect"].ToString() == "1")
                sbSelectedstr.Append(Ds.Tables[0].Rows[i]["FromDate"].ToString() + "|" + Ds.Tables[0].Rows[i]["ToDate"].ToString() + "|" + Ds.Tables[0].Rows[i]["QtrNo"].ToString() + "|" + Ds.Tables[0].Rows[i]["Year"].ToString());
        }
        hdnQuarter.Value = sbMstr.ToString() + "|^|" + sbSelectedstr.ToString();


        //------- Legend/Process Grp
        Ds.Clear();
        sbMstr.Clear();
        sbSelectedstr.Clear();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spINITGetLeged]";
        Scmd.Parameters.AddWithValue("@RoleID", hdnRoleID.Value);
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        sbMstr.Append("<option value=''>-- Select --</option>");
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["Legend"].ToString() + "'>" + Ds.Tables[0].Rows[i]["Legend"].ToString() + "</option>");
        }
        hdnProcessGrp.Value = sbMstr.ToString();

        Ds.Clear();
        sbMstr.Clear();
        sbSelectedstr.Clear();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spSBDGetMSMPAliesFilter]";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@flgType", "1");
        Scmd.Parameters.AddWithValue("@CalledFrom", "1");
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        sbMstr.Clear();
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["UserID"].ToString() + "'>" + Ds.Tables[0].Rows[i]["MSMPAlies"].ToString() + "</option>");
        }
        hdnMSMPAlies.Value = sbMstr.ToString();


        Ds.Clear();
        sbMstr.Clear();
        sbSelectedstr.Clear();
        Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spSBDGetFrequencyMstr]";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@UserID", hdnUserID.Value);
        Scmd.Parameters.AddWithValue("@RoleID", hdnRoleID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        sbMstr.Clear();
        sbMstr.Append("<option value='0'>--Select--</option>");
        for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        {
            sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["Frequency"].ToString() + "'>" + Ds.Tables[0].Rows[i]["Frequency"].ToString() + "</option>");
        }
        hdnFrequency.Value = sbMstr.ToString();
    }

    [System.Web.Services.WebMethod()]
    public static string fnProdHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, string flg, object obj)
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

            if (flg == "0")
            {
                DataTable tbl = new DataTable();
                string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
                tbl = JsonConvert.DeserializeObject<DataTable>(str);
                if (tbl.Rows.Count > 0)
                {
                    return "0|^|" + GetProdTbl(Ds.Tables[0], ProdLvl, flg) + "|^|" + GetSelHierTbl(obj, "1", "0");
                }
                else
                    return "0|^|" + GetProdTbl(Ds.Tables[0], ProdLvl, flg) + "|^|";
            }
            else
            {
                return GetProdTbl(Ds.Tables[0], ProdLvl, flg);
            }
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string GetProdTbl(DataTable dt, string ProdLvl, string flg)
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
        if (flg == "0")
        {
            switch (ProdLvl)
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
                case "40":
                    sb.Append("<th colspan='5'>");
                    break;
            }

            sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnProdPopuptypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
            sb.Append("</th>");
        }
        else
        {
            switch (ProdLvl)
            {
                case "10":
                    sb.Append("<th colspan='3'>");
                    break;
                case "20":
                    sb.Append("<th colspan='4'>");
                    break;
                case "30":
                    sb.Append("<th colspan='5'>");
                    break;
                case "40":
                    sb.Append("<th colspan='6'>");
                    break;
            }

            sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnSBFTypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
            sb.Append("</th>");
        }
        sb.Append("</tr>");

        sb.Append("<tr>");
        sb.Append("<th style='width: 30px;'><input id='chkSelectAllProd' type='checkbox' onclick='fnSelectAllSBF(this);' /></th>");
        sb.Append("<th style='display: none;'>SearchString</th>");
        for (int j = 0; j < dt.Columns.Count; j++)
        {
            if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
            {
                sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");
            }
        }
        if (flg == "1")
        {
            sb.Append("<th>Mark Base</th>");
        }
        sb.Append("</tr>");

        sb.Append("</thead>");
        sb.Append("<tbody>");
        if (flg == "0")
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                switch (ProdLvl)
                {
                    case "10":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='0' bf='0' sbf='0' nid='" + dt.Rows[i]["CatNodeID"] + "' ntype='" + dt.Rows[i]["CatNodeType"] + "'>");
                        break;
                    case "20":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='0' sbf='0' nid='" + dt.Rows[i]["BrnNodeID"] + "' ntype='" + dt.Rows[i]["BrnNodeType"] + "'>");
                        break;
                    case "30":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' sbf='0' nid='" + dt.Rows[i]["BFNodeID"] + "' ntype='" + dt.Rows[i]["BFNodeType"] + "'>");
                        break;
                    case "40":
                        sb.Append("<tr onclick='fnSelectUnSelectProd(this);' flg='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' sbf='" + dt.Rows[i]["SBFNodeId"] + "' nid='" + dt.Rows[i]["SBFNodeId"] + "' ntype='" + dt.Rows[i]["SBFNodeType"] + "'>");
                        break;
                }
                sb.Append("<td><img src='../../Images/checkbox-unchecked.png'/></td>");

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
        }
        else
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                switch (ProdLvl)
                {
                    case "10":
                        sb.Append("<tr flg='0' flgBase='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='0' bf='0' sbf='0' nid='" + dt.Rows[i]["CatNodeID"] + "' ntype='" + dt.Rows[i]["CatNodeType"] + "'>");
                        break;
                    case "20":
                        sb.Append("<tr flg='0' flgBase='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='0' sbf='0' nid='" + dt.Rows[i]["BrnNodeID"] + "' ntype='" + dt.Rows[i]["BrnNodeType"] + "'>");
                        break;
                    case "30":
                        sb.Append("<tr flg='0' flgBase='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' sbf='0' nid='" + dt.Rows[i]["BFNodeID"] + "' ntype='" + dt.Rows[i]["BFNodeType"] + "'>");
                        break;
                    case "40":
                        sb.Append("<tr flg='0' flgBase='0' flgVisible='1' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrnNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' sbf='" + dt.Rows[i]["SBFNodeId"] + "' nid='" + dt.Rows[i]["SBFNodeId"] + "' ntype='" + dt.Rows[i]["SBFNodeType"] + "'>");
                        break;
                }
                //sb.Append("<td onclick='fnMarkProxy(this);'><img src='../../Images/checkbox-unchecked.png'/></td>");
                sb.Append("<td><img src='../../Images/checkbox-unchecked.png'/></td>");
                sb.Append("<td style='display: none;'>" + dt.Rows[i]["SearchString"] + "</td>");
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                    {
                        //sb.Append("<td class='clss-" + j + "' onclick='fnMarkProxy(this);'>" + dt.Rows[i][j] + "</td>");
                        sb.Append("<td class='clss-" + j + "'>" + dt.Rows[i][j] + "</td>");
                    }
                }
                if (flg == "1")
                {
                    //sb.Append("<td onclick='fnMarkBaseSBF(this);'><i class='fa fa-circle-o'></i></td>");
                    sb.Append("<td><i class='fa fa-circle-o'></i></td>");
                }

                sb.Append("</tr>");
            }
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    [System.Web.Services.WebMethod()]
    public static string fnLocationHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, object obj, string InSubD)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spGetLocHierachyInTableFormat";
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

            DataTable tbl = new DataTable();
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);
            if (tbl.Rows.Count > 0)
            {
                return "0|^|" + GetLocationTbl(Ds.Tables[0], ProdLvl) + "|^|" + GetSelHierTbl(obj, "2", InSubD);
            }
            else
                return "0|^|" + GetLocationTbl(Ds.Tables[0], ProdLvl) + "|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string GetLocationTbl(DataTable dt, string ProdLvl)
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

        StringBuilder sb = new StringBuilder();
        sb.Append("<table class='table table-bordered table-sm table-hover'>"); //clsProduct clstable
        sb.Append("<thead>");

        sb.Append("<tr>");
        switch (ProdLvl)
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
            switch (ProdLvl)
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
        return sb.ToString();
    }
    [System.Web.Services.WebMethod()]
    public static string fnChannelHier(string LoginID, string UserID, string RoleID, string UserNodeID, string UserNodeType, string ProdLvl, object obj)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spGetChannelHierachyInTableFormat";
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

            DataTable tbl = new DataTable();
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);
            if (tbl.Rows.Count > 0)
            {
                return "0|^|" + GetChannelTbl(Ds.Tables[0], ProdLvl) + "|^|" + GetSelHierTbl(obj, "3", "0");
            }
            else
                return "0|^|" + GetChannelTbl(Ds.Tables[0], ProdLvl) + "|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string GetChannelTbl(DataTable dt, string ProdLvl)
    {
        string[] SkipColumn = new string[7];
        SkipColumn[0] = "ClassID";
        SkipColumn[1] = "ClassNodeType";
        SkipColumn[2] = "ChannelID";
        SkipColumn[3] = "ChannelNodeType";
        SkipColumn[4] = "STNodeID";
        SkipColumn[5] = "STNodeType";
        SkipColumn[6] = "SearchString";

        StringBuilder sb = new StringBuilder();
        sb.Append("<table class='table table-bordered table-sm table-hover'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        switch (ProdLvl)
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
            switch (ProdLvl)
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
        return sb.ToString();
    }

    [System.Web.Services.WebMethod()]
    public static string GetClusters(string LoginID, string RoleID, string UserID, string BucketType, string QtrNo, string QtrYear)
    {
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spGetBucketbasedonType";
        Scmd.Parameters.AddWithValue("@BucketTypeID", BucketType);
        Scmd.Parameters.AddWithValue("@LoginID", LoginID);
        Scmd.Parameters.AddWithValue("@UserID", UserID);
        Scmd.Parameters.AddWithValue("@RoleID", RoleID);
        Scmd.Parameters.AddWithValue("@QtrNo", QtrNo);
        Scmd.Parameters.AddWithValue("@QtrYear", QtrYear);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        sb.Append(GetClusterTbl(dt));
        return sb.ToString();
    }
    private static string GetClusterTbl(DataTable dt)
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
        sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnClusterPopuptypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
        sb.Append("</th>");
        sb.Append("</tr>");
        sb.Append("<tr><th style='width: 30px;'></th><th>Name</th></tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sb.Append("<tr onclick='fnSelectUnSelectCluster(this);' flg='0' flgVisible='1' clusterid='" + dt.Rows[i]["BucketID"] + "' StrValue='" + dt.Rows[i]["StrValue"] + "'>");
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

    [System.Web.Services.WebMethod()]
    public static string GetSelHierTbl(object obj, string BucketType, string InSubD)
    {
        DataTable tbl = new DataTable();
        string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        tbl = JsonConvert.DeserializeObject<DataTable>(str);

        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spGetHierDetails_New";
        Scmd.Parameters.AddWithValue("@PrdSelection", tbl);
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
            sb.Append("<th style='width:20%;'>Category</th>");
            sb.Append("<th style='width:20%;'>Brand</th>");
            sb.Append("<th style='width:25%;'>BrandForm</th>");
            sb.Append("<th style='width:35%;'>SubBrandForm</th>");
        }
        else if (BucketType == "2")
        {
            sb.Append("<th style='width:15%;'>Country</th>");
            sb.Append("<th style='width:20%;'>Region</th>");
            sb.Append("<th style='width:20%;'>Site</th>");
            sb.Append("<th style='width:25%;'>Distributor</th>");
            sb.Append("<th style='width:20%;'>Branch</th>");
            //sb.Append("<th style='width:25%;'>SubD</th>");
        }
        else if (BucketType == "3")
        {
            sb.Append("<th style='width:30%;'>Class</th>");
            sb.Append("<th style='width:35%;'>Channel</th>");
            sb.Append("<th style='width:35%;'>Store Type</th>");
        }
        else if (BucketType == "6")
        {
            sb.Append("<th style='width:20%;'>Category</th>");
            sb.Append("<th style='width:20%;'>Brand</th>");
            sb.Append("<th style='width:25%;'>BrandForm</th>");
            sb.Append("<th style='width:35%;'>SubBrandForm</th>");
        }
        else
        {
            sb.Append("<th style='width:15%;'>Country</th>");
            sb.Append("<th style='width:25%;'>Region</th>");
            sb.Append("<th style='width:20%;'>Site</th>");
            sb.Append("<th style='width:40%;'>Distributor</th>");
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
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='0' bf='0' sbf='0' nid='" + dt.Rows[i]["CatNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Category"] + "</td><td>All</td><td>All</td><td>All</td>");
                    break;
                case "20":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrandNodeID"] + "' bf='0' sbf='0' nid='" + dt.Rows[i]["BrandNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Category"] + "</td><td>" + dt.Rows[i]["Brand"] + "</td><td>All</td><td>All</td>");
                    break;
                case "30":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrandNodeID"] + "' bf='" + dt.Rows[i]["BFNodeID"] + "' sbf='0' nid='" + dt.Rows[i]["BFNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Category"] + "</td><td>" + dt.Rows[i]["Brand"] + "</td><td>" + dt.Rows[i]["BF"] + "</td><td>All</td>");
                    break;
                case "40":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cat='" + dt.Rows[i]["CatNodeID"] + "' brand='" + dt.Rows[i]["BrandNodeID"] + "' bf='" + dt.Rows[i]["BrandNodeID"] + "' sbf='" + dt.Rows[i]["SBFNodeID"] + "' nid='" + dt.Rows[i]["SBFNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Category"] + "</td><td>" + dt.Rows[i]["Brand"] + "</td><td>" + dt.Rows[i]["BF"] + "</td><td>" + dt.Rows[i]["SBF"] + "</td>");
                    break;
                case "100":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cntry='" + dt.Rows[i]["CountryNodeId"] + "' reg='0' site='0' dbr='0' branch='0' nid='" + dt.Rows[i]["CountryNodeId"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Country"] + "</td><td>All</td><td>All</td><td>All</td>");
                    break;
                case "110":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cntry='" + dt.Rows[i]["CountryNodeId"] + "' reg='" + dt.Rows[i]["RegionNodeId"] + "' site='0' dbr='0' branch='0' nid='" + dt.Rows[i]["RegionNodeId"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Country"] + "</td><td>" + dt.Rows[i]["Region"] + "</td><td>All</td><td>All</td>");
                    break;
                case "120":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cntry='" + dt.Rows[i]["CountryNodeId"] + "' reg='" + dt.Rows[i]["RegionNodeId"] + "' site='" + dt.Rows[i]["SiteNodeId"] + "' dbr='0' branch='0' nid='" + dt.Rows[i]["SiteNodeId"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Country"] + "</td><td>" + dt.Rows[i]["Region"] + "</td><td>" + dt.Rows[i]["Site"] + "</td><td>All</td>");
                    break;
                case "130":
                    sb.Append("<tr lvl='" + dt.Rows[i]["NodeType"] + "' cntry='" + dt.Rows[i]["CountryNodeId"] + "' reg='" + dt.Rows[i]["RegionNodeId"] + "' site='" + dt.Rows[i]["SiteNodeId"] + "' dbr='" + dt.Rows[i]["DBRNodeID"] + "' branch='0' nid='" + dt.Rows[i]["DBRNodeID"] + "'>");
                    sb.Append("<td>" + dt.Rows[i]["Country"] + "</td><td>" + dt.Rows[i]["Region"] + "</td><td>" + dt.Rows[i]["Site"] + "</td><td>" + dt.Rows[i]["DBR"] + "</td>");
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


    [System.Web.Services.WebMethod()]
    public static string GetBaseSBFBucket(string LoginID, string RoleID, string UserID, string BucketType, string QtrNo, string QtrYear, string strBrand)
    {
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spSBDGetBucketbasedonType";
        Scmd.Parameters.AddWithValue("@BucketTypeID", BucketType);
        Scmd.Parameters.AddWithValue("@LoginID", LoginID);
        Scmd.Parameters.AddWithValue("@UserID", UserID);
        Scmd.Parameters.AddWithValue("@RoleID", RoleID);
        Scmd.Parameters.AddWithValue("@QtrNo", QtrNo);
        Scmd.Parameters.AddWithValue("@QtrYear", QtrYear);
        Scmd.Parameters.AddWithValue("@strBrand", strBrand);
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
        sb.Append("<th colspan='3'>");
        sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnCopyBucketPopuptypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
        sb.Append("</th>");
        sb.Append("</tr>");
        sb.Append("<tr><th style='width: 30px;'></th><th>Base SBF</th><th style='width: 100px;'>MOQ</th></tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sb.Append("<tr flg='0' flgVisible='1' BucketID='" + dt.Rows[i]["FBBucketID"] + "' StrValue='" + GetProxy(dt.Rows[i]["FBBucketID"].ToString(), Ds.Tables[1]) + "' MOQ='" + dt.Rows[i]["MOQ"] + "' InSubD='0'>");
            sb.Append("<td onclick='fnSelectUnSelectBucket(this);'><img src='../../Images/checkbox-unchecked.png' /></td>");
            sb.Append("<td class='clss-1' onclick='fnSelectUnSelectBucket(this);'>" + dt.Rows[i]["Base SBF"] + "</td>");
            sb.Append("<td class='clss-1'><input type='text' style='text-align: center;' value='" + dt.Rows[i]["MOQ"] + "' disabled/></td>");
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    public static string GetProxy(string FBBucketID, DataTable dt)
    {
        StringBuilder sbIds = new StringBuilder();
        DataRow[] dr = dt.Select("FBBucketID=" + FBBucketID);
        foreach (DataRow row in dr)
        {
            sbIds.Append("^" + row["ProxyPrdNodeID"].ToString() + "|" + row["ProxyPrdNodeType"].ToString());
        }
        return sbIds.ToString().Substring(1);
    }



    [System.Web.Services.WebMethod()]
    public static string GetBucketbasedonType(string LoginID, string RoleID, string UserID, string BucketType, string QtrNo, string QtrYear)
    {
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "spSBDGetBucketbasedonType";
        Scmd.Parameters.AddWithValue("@BucketTypeID", BucketType);
        Scmd.Parameters.AddWithValue("@LoginID", LoginID);
        Scmd.Parameters.AddWithValue("@UserID", UserID);
        Scmd.Parameters.AddWithValue("@RoleID", RoleID);
        Scmd.Parameters.AddWithValue("@QtrNo", QtrNo);
        Scmd.Parameters.AddWithValue("@QtrYear", QtrYear);
        Scmd.Parameters.AddWithValue("@strBrand", "");
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        sb.Append(GetCopyBucketTbl(dt));
        return sb.ToString();
    }
    private static string GetCopyBucketTbl(DataTable dt)
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
        sb.Append("<input type='text' class='form-control form-control-sm' onkeyup='fnCopyBucketPopuptypefilter(this);' placeholder='Type atleast 3 character to filter...'/>");
        sb.Append("</th>");
        sb.Append("</tr>");
        sb.Append("<tr><th style='width: 30px;'></th><th>Name</th></tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sb.Append("<tr flg='0' flgVisible='1' BucketID='" + dt.Rows[i]["BucketID"] + "' StrValue='" + dt.Rows[i]["StrValue"] + "' InSubD='" + dt.Rows[i]["flgIncludeSubD"] + "'>");
            sb.Append("<td onclick='fnSelectUnSelectBucket(this);'><img src='../../Images/checkbox-unchecked.png' /></td>");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                {
                    sb.Append("<td class='clss-" + j + "' onclick='fnSelectUnSelectBucket(this);'>" + dt.Rows[i][j] + "</td>");
                }
            }
            sb.Append("</tr>");
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    [System.Web.Services.WebMethod()]
    public static string fnSaveAsNewBucket(string BucketName, string BucketDescr, string BucketType, object obj, string LoginID, string PrdLvl, string PrdString)
    {
        DataTable tbl = new DataTable();
        try
        {
            string str = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tbl = JsonConvert.DeserializeObject<DataTable>(str);

            StringBuilder sb = new StringBuilder();
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spBucketSaveBucket";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.Parameters.AddWithValue("@BucketID", "0");
            Scmd.Parameters.AddWithValue("@BucketName", Utilities.XSSHandling(BucketName));
            Scmd.Parameters.AddWithValue("@BucketDescr", Utilities.XSSHandling(BucketDescr));
            Scmd.Parameters.AddWithValue("@flgActive", "1");
            Scmd.Parameters.AddWithValue("@BucketTypeID", BucketType);
            Scmd.Parameters.AddWithValue("@BucketValues", tbl);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@PrdLvl", PrdLvl);
            Scmd.Parameters.AddWithValue("@PrdString", Utilities.XSSHandling(PrdString));
            Scmd.Parameters.AddWithValue("@flgIncludeSubD", "0");
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) > -1)
            {
                return "0|^|" + Ds.Tables[0].Rows[0][0];
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
    public static string fnGetReport(string LoginID, string RoleID, string UserID, object objProd, object objLoc, object objChannel, string ProcessGroup, object objUser, string QtrNo, string QtrYear)
    {
        try
        {
            StringBuilder sbTimeChecker = new StringBuilder();
            sbTimeChecker.Append("SP Caliing Start : " + DateTime.Now.ToLongTimeString());


            // ----------- MS & P
            string strUser = JsonConvert.SerializeObject(objUser, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable dtUser = JsonConvert.DeserializeObject<DataTable>(strUser);
            if (dtUser.Rows[0][0].ToString() == "0")
                dtUser.Rows.RemoveAt(0);
            
            // ----------- Product
            DataTable tblProd = new DataTable();
            string str = JsonConvert.SerializeObject(objProd, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblProd = JsonConvert.DeserializeObject<DataTable>(str);
            if (tblProd.Rows[0][0].ToString() == "0")
                tblProd.Rows.RemoveAt(0);

            // ----------- Location
            DataTable tblLoc = new DataTable();
            string strLoc = JsonConvert.SerializeObject(objLoc, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblLoc = JsonConvert.DeserializeObject<DataTable>(strLoc);
            if (tblLoc.Rows[0][0].ToString() == "0")
                tblLoc.Rows.RemoveAt(0);

            // ----------- Channel
            DataTable tblChannel = new DataTable();
            string strChannel = JsonConvert.SerializeObject(objChannel, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblChannel = JsonConvert.DeserializeObject<DataTable>(strChannel);
            if (tblChannel.Rows[0][0].ToString() == "0")
                tblChannel.Rows.RemoveAt(0);


            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spSBDGetSBDInfo_Deleted";
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
            Scmd.Parameters.AddWithValue("@LocSelection", tblLoc);
            Scmd.Parameters.AddWithValue("@ChannelSelection", tblChannel);
            if (ProcessGroup != "")
                Scmd.Parameters.AddWithValue("@ProcessGroup", ProcessGroup);
            Scmd.Parameters.AddWithValue("@Users", dtUser);
            Scmd.Parameters.AddWithValue("@QtrNo", QtrNo);
            Scmd.Parameters.AddWithValue("@QtrYear", QtrYear);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            string IsNewAdditionAllowed = "0";
            sbTimeChecker.Append("<br/>SP Caliing End : " + DateTime.Now.ToLongTimeString());
            return "0|^|" + CreateSBDMstrTbl(RoleID, Ds, "tblReport", "clsReport", IsNewAdditionAllowed) + "|^|" + CreateButtons(Ds.Tables[4]) + "|^|" + IsNewAdditionAllowed + "|^|" + CreateLegends(Ds.Tables[5]) + "|^|" + sbTimeChecker.ToString() + "<br/>HTML Format Created : " + DateTime.Now.ToLongTimeString();
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string CreateSBDMstrTbl(string RoleID, DataSet Ds, string tblname, string cls, string IsNewAdditionAllowed)
    {
        string[] SkipColumn = new string[13];
        SkipColumn[0] = "SBDID";
        SkipColumn[1] = "strChannel";
        SkipColumn[2] = "strLocation";
        SkipColumn[3] = "strBaseProduct";
        SkipColumn[4] = "FromDate";
        SkipColumn[5] = "flgCheckBox";
        SkipColumn[6] = "flgSettle";
        SkipColumn[7] = "flgBookmark";
        SkipColumn[8] = "flgEdit";
        SkipColumn[9] = "flgRejectComment";
        SkipColumn[10] = "colorcode";
        SkipColumn[11] = "MOQ";
        SkipColumn[12] = "StrBrand";

        DataTable dt = Ds.Tables[0];
        StringBuilder sb = new StringBuilder();
        StringBuilder sbLocation = new StringBuilder();
        StringBuilder sbChannel = new StringBuilder();
        StringBuilder sbBaseSBF = new StringBuilder();

        sb.Append("<table id='" + tblname + "' class='table table-striped table-bordered table-sm " + cls + "' IsSBDExpand='1' IsLocExpand='1' IsChannelExpand='1'>");
        sb.Append("<thead>");
        sb.Append("<tr>");
        sb.Append("<th><input type='checkbox' onclick='fnChkUnchkInitAll(this);'/></th>");
        sb.Append("<th>Action</th>");
        for (int j = 0; j < dt.Columns.Count; j++)
        {
            if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
            {
                if (dt.Columns[j].ColumnName.ToString().Trim() == "ToDate")
                    sb.Append("<th>Time Period</th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Channel")
                    sb.Append("<th><i iden='btnChannelExpandCollapse' class='fa fa-minus-square clsExpandCollapse' onclick='fnCollapseContent(3);'></i><span>Channel</span></th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Clusters")
                    sb.Append("<th><i iden='btnlocExpandCollapse' class='fa fa-minus-square clsExpandCollapse' onclick='fnCollapseContent(2);'></i><span>Clusters</span></th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "Base SBF")
                    sb.Append("<th><i iden='btnSBDExpandCollapse' class='fa fa-minus-square clsExpandCollapse' onclick='fnCollapseContent(1);'></i><span>Base SBF</span></th>");
                else if (dt.Columns[j].ColumnName.ToString().Trim() == "strSearch")
                    sb.Append("<th style='display: none;'>strSearch</th>");
                else
                    sb.Append("<th>" + dt.Columns[j].ColumnName.ToString() + "</th>");
            }
        }
        sb.Append("</tr>");
        sb.Append("</thead>");
        sb.Append("<tbody>");
        if (dt.Rows.Count > 0)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                sbChannel.Clear();
                sbLocation.Clear();
                sbBaseSBF.Clear();
                sbChannel.Append(GetStrLocChannelBaseSBF(1, dt.Rows[i]["SBDID"].ToString(), Ds.Tables[1], ""));
                sbLocation.Append(GetStrLocChannelBaseSBF(2, dt.Rows[i]["SBDID"].ToString(), Ds.Tables[2], ""));
                sbBaseSBF.Append(GetStrLocChannelBaseSBF(3, dt.Rows[i]["SBDID"].ToString(), Ds.Tables[3], dt.Rows[i]["StrBrand"].ToString()));

                sb.Append("<tr SBD='" + dt.Rows[i]["SBDID"] + "' SBDName='" + dt.Rows[i]["SBDName"] + "' FromDate='" + dt.Rows[i]["FromDate"] + "' ToDate='" + dt.Rows[i]["ToDate"] + "' strloc='" + sbLocation.ToString() + "' strchannel='" + sbChannel.ToString() + "' strSBD='" + sbBaseSBF.ToString() + "' Frequency='" + dt.Rows[i]["Frequency"].ToString() + "' flgRejectComment='" + dt.Rows[i]["flgRejectComment"].ToString() + "' flgDBEdit='" + dt.Rows[i]["flgEdit"].ToString() + "' flgCheckBox='" + dt.Rows[i]["flgCheckBox"].ToString() + "' flgBookmark='" + dt.Rows[i]["flgBookmark"].ToString() + "' flgEdit='0' iden='SBD' style='display: table-row;'>");

                //sb.Append("<td iden='SBD' style='background-color: " + dt.Rows[i]["colorcode"].ToString() + ";'>");
                //if (dt.Rows[i]["flgCheckBox"].ToString() == "1")
                //    sb.Append("<input iden='chkInit' type='checkbox' onclick='fnUnchkInitIndividual(this);'/>");
                //sb.Append("</td>");
                sb.Append("<td iden='SBD' style='background-color: " + dt.Rows[i]["colorcode"].ToString() + ";'>");
                sb.Append("<input iden='chkInit' type='checkbox' onclick='fnUnchkInitIndividual(this);'/>");
                sb.Append("</td>");


                //sb.Append("<td iden='SBD' class='clstdAction'>");
                //if (IsNewAdditionAllowed == "1")
                //    sb.Append("<img src='../../Images/copy.png' iden='CopyInit' title='Copy Initiative' onclick='fnShowChannelClusterforCopy(this);'/>");
                //if (dt.Rows[i]["flgEdit"].ToString() == "1")
                //{
                //    sb.Append("<img src='../../Images/edit.png' iden='EditInit' title='Edit Initiative' onclick='fnEdit(this);'/>");
                //    sb.Append("<img src='../../Images/delete.png' iden='DeleteInit' title='Delete Initiative' onclick='fnDelete(this);'/>");
                //}
                //if (dt.Rows[i]["flgRejectComment"].ToString() == "1")
                //    sb.Append("<img src='../../Images/comments.png' iden='RejComments' title='Comments' onclick='fnGetRejectComment(this);'/>");
                //sb.Append("</td>");
                sb.Append("<td iden='SBD' class='clstdAction'>");
                sb.Append("<img src='../../Images/saveasdraft.png' title='Restore' onclick='fnRestore(this);'/>");
                sb.Append("</td>");

                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString()))
                    {
                        if (dt.Columns[j].ColumnName.ToString() == "ToDate")
                            sb.Append("<td iden='SBD'>" + dt.Rows[i]["FromDate"] + "<br/>to " + dt.Rows[i]["ToDate"] + "</td>");
                        else if (dt.Columns[j].ColumnName.ToString() == "SBDName")
                        {
                            sb.Append("<td iden='SBD'>" + (dt.Rows[i]["SBDName"].ToString().Length > 20 ? "<span title='" + dt.Rows[i]["SBDName"].ToString() + "' class='clsInform'>" + dt.Rows[i]["SBDName"].ToString().Substring(0, 18) + "..</span>" : dt.Rows[i]["SBDName"].ToString()) + "</div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Clusters")
                        {
                            sb.Append("<td iden='SBD'><div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (sbLocation.ToString().Split('~')[0].Length > 50 ? "<span title='" + sbLocation.ToString().Split('~')[0] + "' class='clsInform'>" + sbLocation.ToString().Split('~')[0].Substring(0, 48) + "..</span>" : sbLocation.ToString().Split('~')[0]) + "</div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Channel")
                        {
                            sb.Append("<td iden='SBD'><div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (sbChannel.ToString().Split('~')[0].Length > 70 ? "<span title='" + sbChannel.ToString().Split('~')[0] + "' class='clsInform'>" + sbChannel.ToString().Split('~')[0].Substring(0, 68) + "..</span>" : sbChannel.ToString().Split('~')[0]) + "</div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "Base SBF")
                        {
                            sb.Append("<td iden='SBD'><div style='width: 202px; min-width: 202px; font-size:0.7rem;'>" + (sbBaseSBF.ToString().Split('~')[0].Length > 70 ? "<span title='" + sbBaseSBF.ToString().Split('~')[0] + "' class='clsInform'>" + sbBaseSBF.ToString().Split('~')[0].Substring(0, 68) + "..</span>" : sbBaseSBF.ToString().Split('~')[0]) + "</div></td>");
                        }
                        else if (dt.Columns[j].ColumnName.ToString() == "strSearch")
                            sb.Append("<td iden='SBD' style='display: none;'>" + dt.Rows[i][j].ToString() + "</td>");
                        else
                            sb.Append("<td iden='SBD'>" + dt.Rows[i][j] + "</td>");
                    }
                }

                sb.Append("</tr>");
            }
        }
        sb.Append("</tbody>");
        sb.Append("</table>");
        return sb.ToString();
    }
    private static string GetStrLocChannelBaseSBF(int flg, string SBDID, DataTable dt, string strBrand)
    {
        StringBuilder sb = new StringBuilder();
        StringBuilder sbDescr = new StringBuilder();
        DataRow[] dr = dt.Select("SBDID=" + SBDID);
        if (dr.Length > 0)
        {
            DataTable dttemp = dr.CopyToDataTable();
            switch (flg)
            {
                case 1:
                    for (int i = 0; i < dttemp.Rows.Count; i++)
                    {
                        sb.Append("^" + dttemp.Rows[i]["NodeID"].ToString() + "|" + dttemp.Rows[i]["NodeType"].ToString());
                        sbDescr.Append(", " + dttemp.Rows[i]["Descr"].ToString());
                    }
                    break;
                case 2:
                    for (int i = 0; i < dttemp.Rows.Count; i++)
                    {
                        sb.Append("|" + dttemp.Rows[i]["ClusterID"].ToString());
                        sbDescr.Append(", " + dttemp.Rows[i]["ClusterName"].ToString());
                    }
                    break;
                case 3:
                    for (int i = 0; i < dttemp.Rows.Count; i++)
                    {
                        sb.Append("|" + dttemp.Rows[i]["FBBucketID"].ToString() + "^" + dttemp.Rows[i]["Moq"].ToString());
                        sbDescr.Append(", " + dttemp.Rows[i]["SBF"].ToString());
                    }
                    break;
            }
            return sbDescr.ToString().Substring(2) + "~" + sb.ToString().Substring(1) + "~0~" + strBrand;
        }
        else
        {
            return "~~0~";
        }
    }
    private static string CreateButtons(DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<a href='#' class='btn btn-primary btn-disabled btn-sm' flgAction='101'>Click to Restore Selected</a>");
        return sb.ToString();
    }
    private static string CreateLegends(DataTable dt)
    {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            sb.Append("<div class='clsdiv-legend-block'><div class='clsdiv-legend-color' style='background: " + dt.Rows[i]["ColorCode"].ToString() + ";'></div><div class='clsdiv-legend-text'>" + dt.Rows[i]["Legend"].ToString() + "</div></div>");
        }
        return sb.ToString();
    }


    [System.Web.Services.WebMethod()]
    public static string fnGetBrandlst(string LoginID, string RoleID, string UserID)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spSBDGetMSMPBrands";
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            DataTable dt = Ds.Tables[1];
            StringBuilder sb = new StringBuilder();
            if (Ds.Tables[1].Rows.Count > 0)
            {
                sb.Append("<span style='font-size: 0.9rem; font-weight: 600;'>Please select the brand for which you want to define Norm :</span>");
                sb.Append("<div style='margin-top: 6px; height: 400px; overflow-y: auto;'>");
                sb.Append("<table class='table table-striped table-sm'>");
                sb.Append("<thead>");
                sb.Append("<tr>");
                sb.Append("<th>#</th>");
                sb.Append("<th>Brand</th>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                StringBuilder sbBrand = new StringBuilder();
                StringBuilder sbBrandIDs = new StringBuilder();
                DataTable dtDistinctPerson = dt.DefaultView.ToTable(true, "Descr");
                for (int i = 0; i < dtDistinctPerson.Rows.Count; i++)
                {
                    sbBrand.Clear();
                    sbBrandIDs.Clear();
                    DataTable dtPersonWiseBrand = dt.Select("Descr='" + dtDistinctPerson.Rows[i]["Descr"].ToString() + "'").CopyToDataTable();
                    for (int j = 0; j < dtPersonWiseBrand.Rows.Count; j++)
                    {
                        if (j == 0)
                        {
                            sbBrand.Append(dtPersonWiseBrand.Rows[j]["Brand"].ToString());
                            sbBrandIDs.Append(dtPersonWiseBrand.Rows[j]["NodeID"].ToString());
                        }
                        else
                        {
                            sbBrand.Append(", " + dtPersonWiseBrand.Rows[j]["Brand"].ToString());
                            sbBrandIDs.Append("^" + dtPersonWiseBrand.Rows[j]["NodeID"].ToString());
                        }
                    }

                    sb.Append("<tr brand='" + sbBrandIDs.ToString() + "'>");
                    sb.Append("<td><input name='brand' type='radio'/></td>");
                    sb.Append("<td><b>" + dtDistinctPerson.Rows[i]["Descr"].ToString() + "</b> ( " + sbBrand.ToString() + " )</td>");
                    sb.Append("</tr>");
                }
                sb.Append("</tbody>");
                sb.Append("</table>");
                sb.Append("</div>");
            }
            return "0|^|" + sb.ToString();
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }



    [System.Web.Services.WebMethod()]
    public static string fnGetAllRejectComments(string RoleID, string LoginID, string UserID, object objINIT)
    {
        try
        {
            string strINIT = JsonConvert.SerializeObject(objINIT, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblINIT = JsonConvert.DeserializeObject<DataTable>(strINIT);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spSBDGetCommentsinBulk";
            Scmd.Parameters.AddWithValue("@INIT", tblINIT);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            object obj = JsonConvert.SerializeObject(Ds, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            return "0|^|" + obj.ToString();
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnGetRejectComments(string SBDID, string RoleID, string UserID)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spSBDGetComment";
            Scmd.Parameters.AddWithValue("@SBDID", SBDID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            if (Ds.Tables[0].Rows.Count > 0)
            {
                object obj = JsonConvert.SerializeObject(Ds, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
                return "0|^|" + obj.ToString();
            }
            else
                return "0|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    [System.Web.Services.WebMethod()]
    public static string fnSaveRejectComments(string SBDID, string RoleID, string UserID, string LoginID, string Comments)
    {
        try
        {
            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spSBDSaveComment";
            Scmd.Parameters.AddWithValue("@SBDID", SBDID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@Comments", Utilities.XSSHandling(Comments));
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            return "0|^|";
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }


    [System.Web.Services.WebMethod()]
    public static string fnSave(string SBDID, string SBDName, string FromDATE, string EndDate, string strChannel, string strLocation, string UserID, string LoginID, string RoleID, string QtrNo, string QtrYear, object objBuckets, object objBucketValues, object objMOQ, string flgSaveDuplicate, string Frequency, string StrBrand, string SBDcntr)
    {
        try
        {
            DataTable tblBuckets = new DataTable();
            string strBuckets = JsonConvert.SerializeObject(objBuckets, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBuckets = JsonConvert.DeserializeObject<DataTable>(strBuckets);

            DataTable tblBucketValues = new DataTable();
            string strBucketValues = JsonConvert.SerializeObject(objBucketValues, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblBucketValues = JsonConvert.DeserializeObject<DataTable>(strBucketValues);

            DataTable tblMOQ = new DataTable();
            string strMOQ = JsonConvert.SerializeObject(objMOQ, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblMOQ = JsonConvert.DeserializeObject<DataTable>(strMOQ);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spSBDManageSBD";
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.Parameters.AddWithValue("@SBDID", SBDID);
            Scmd.Parameters.AddWithValue("@SBDName", Utilities.XSSHandling(SBDName));
            Scmd.Parameters.AddWithValue("@FromDATE", FromDATE);
            Scmd.Parameters.AddWithValue("@EndDate", EndDate);
            Scmd.Parameters.AddWithValue("@strChannel", Utilities.XSSHandling(strChannel));
            Scmd.Parameters.AddWithValue("@strLocation", Utilities.XSSHandling(strLocation));
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@Buckets", tblBuckets);
            Scmd.Parameters.AddWithValue("@BucketValues", tblBucketValues);
            Scmd.Parameters.AddWithValue("@MOQ", tblMOQ);
            Scmd.Parameters.AddWithValue("@QtrNo", QtrNo);
            Scmd.Parameters.AddWithValue("@QtrYear", QtrYear);
            Scmd.Parameters.AddWithValue("@flgSaveDuplicate", flgSaveDuplicate);
            Scmd.Parameters.AddWithValue("@Frequency", Frequency);
            Scmd.Parameters.AddWithValue("@StrBrand", Utilities.XSSHandling(StrBrand));
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) > -1)
            {
                return "0|^|" + SBDcntr;
            }
            else if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -1)
            {
                return "1|^|" + SBDcntr;
            }
            else if (Convert.ToInt32(Ds.Tables[0].Rows[0][0]) == -3)
            {
                StringBuilder sb = new StringBuilder();
                if (Ds.Tables[1].Rows.Count > 0)
                {
                    sb.Append("Following combination(s) is/are already defined : ");
                    sb.Append("<table class='table table-striped table-bordered table-sm' style='margin-top: 6px;'>");
                    sb.Append("<thead>");
                    sb.Append("<tr>");
                    sb.Append("<th>#</th>");
                    sb.Append("<th>Combination</th>");
                    sb.Append("</tr>");
                    sb.Append("</thead>");
                    sb.Append("<tbody>");
                    for (int i = 0; i < Ds.Tables[1].Rows.Count; i++)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + (i + 1).ToString() + "</td>");
                        sb.Append("<td>" + Ds.Tables[1].Rows[i][1] + "</td>");
                        sb.Append("</tr>");
                    }
                    sb.Append("</tbody>");
                    sb.Append("</table>");
                    sb.Append("Do you want to remove these from existing Norm and define in this Norm ?");
                }
                return "3|^|" + SBDcntr + "|^|" + sb.ToString();
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
    public static string fnSaveFinalAction(string RoleID, string LoginID, string UserID, object objINIT)
    {
        try
        {
            string strINIT = JsonConvert.SerializeObject(objINIT, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblINIT = JsonConvert.DeserializeObject<DataTable>(strINIT);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spSBDSaveSubmitSBD";
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@INITLIST", tblINIT);
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


    [System.Web.Services.WebMethod()]
    public static string fnRestore(string RoleID, string LoginID, string UserID, object objSBD)
    {
        try
        {
            string strSBD = JsonConvert.SerializeObject(objSBD, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable tblSBD = JsonConvert.DeserializeObject<DataTable>(strSBD);

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            Scmd.CommandText = "spSBDRestoreDeleted";
            Scmd.Parameters.AddWithValue("@SBDID", tblSBD);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
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



    protected void btnDownload_Click(object sender, EventArgs e)
    {
        //string strBucket = JsonConvert.SerializeObject(arr, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        DataTable tblSBD = JsonConvert.DeserializeObject<DataTable>(hdnjsonarr.Value);
        if (tblSBD.Rows[0][0].ToString() == "0")
            tblSBD.Rows.RemoveAt(0);

        DataSet ds = new DataSet();
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spSBDDownloadinExcel]";
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        //Scmd.Parameters.AddWithValue("@MonthVal", hdnQuarter.Value.ToString().Split('~')[0]);
        //Scmd.Parameters.AddWithValue("@YearVal", hdnQuarter.Value.ToString().Split('~')[1]);
        Scmd.Parameters.AddWithValue("@SBDID", tblSBD);
        Scmd.Parameters.AddWithValue("@LoginID", Session["LoginID"].ToString());
        Scmd.Parameters.AddWithValue("@UserID", Session["UserID"].ToString());
        Scmd.Parameters.AddWithValue("@RoleID", Session["RoleId"].ToString());
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        Sdap.Fill(ds);

        DataTable dt = ds.Tables[0];
        string filename = "SBD";
        string[] SkipColumn = new string[1];
        SkipColumn[0] = "flgStatus";

        XLWorkbook wb = new XLWorkbook();
        wb = AddWorkSheet(wb, dt, SkipColumn, "SBD", true, false);
        try
        {
            //Export the Excel file.
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Buffer = true;
            HttpContext.Current.Response.Charset = "";
            HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=" + filename + ".xlsx");
            using (MemoryStream MyMemoryStream = new MemoryStream())
            {
                wb.SaveAs(MyMemoryStream);
                MyMemoryStream.WriteTo(HttpContext.Current.Response.OutputStream);
                HttpContext.Current.Response.Flush();
                HttpContext.Current.Response.End();
            }
        }
        catch (Exception ex)
        {
            //
        }
    }
    protected void btnSBDDownload_Click(object sender, EventArgs e)
    {
        DataTable dt = JsonConvert.DeserializeObject<DataTable>(hdnjsonarr.Value);
        string filename = "Base-Proxy SubBrandForm Mapping dated " + DateTime.Now.ToString("dd-MMM-yyyy HH-mm-ss");
        string[] SkipColumn = new string[0];

        XLWorkbook wb = new XLWorkbook();
        wb = AddWorkSheet(wb, dt, SkipColumn, "Base-Proxy SubBrandForm Mapping", false, true);
        try
        {
            //Export the Excel file.
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Buffer = true;
            HttpContext.Current.Response.Charset = "";
            HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=" + filename + ".xlsx");
            using (MemoryStream MyMemoryStream = new MemoryStream())
            {
                wb.SaveAs(MyMemoryStream);
                MyMemoryStream.WriteTo(HttpContext.Current.Response.OutputStream);
                HttpContext.Current.Response.Flush();
                HttpContext.Current.Response.End();
            }
        }
        catch (Exception ex)
        {
            //
        }
    }
    private static XLWorkbook AddWorkSheet(XLWorkbook wb, DataTable dt, string[] SkipColumn, string Sheetname, bool IsSBD, bool IsBaseProxyMap)
    {
        IXLCell cellStart;
        IXLCell cellEnd;
        int k = 0, j = 0, trCntr = 0;
        var ws = wb.Worksheets.Add(Sheetname);

        //-----------Header------------------------
        k++;
        int FreezeRows = k;
        cellStart = ws.Cell(k, j + 1);
        for (int c = 0; c < dt.Columns.Count; c++)
        {
            if (!SkipColumn.Contains(dt.Columns[c].ColumnName.ToString().Trim()))
            {
                j++;
                ws.Cell(k, j).Value = dt.Columns[c].ColumnName.ToString();
                ws.Cell(k, j).Style.Alignment.WrapText = true;
                ws.Cell(k, j).Style.Fill.BackgroundColor = XLColor.FromHtml("#728cd4");
                ws.Cell(k, j).Style.Font.FontColor = XLColor.FromHtml("#ffffff");
                ws.Cell(k, j).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
            }
        }

        //------------Body---------------------------
        trCntr = k;
        for (int b = 0; b < dt.Rows.Count; b++)
        {
            k++; j = 0;
            for (int c = 0; c < dt.Columns.Count; c++)
            {
                if (!SkipColumn.Contains(dt.Columns[c].ColumnName.ToString().Trim()))
                {
                    j++;
                    ws.Cell(k, j).Style.Alignment.WrapText = true;

                    if (IsSBD)
                    {
                        switch (dt.Rows[b]["flgStatus"].ToString())
                        {
                            case "1":   // No Colour
                                ws.Cell(k, j).Value = dt.Rows[b][c].ToString();
                                break;
                            case "2":   // Green
                                ws.Cell(k, j).Value = dt.Rows[b][c].ToString();
                                ws.Cell(k, j).Style.Fill.BackgroundColor = XLColor.FromHtml("#8CFF8C");
                                break;
                            case "3":   // Red
                                ws.Cell(k, j).Value = dt.Rows[b][c].ToString();
                                ws.Cell(k, j).Style.Fill.BackgroundColor = XLColor.FromHtml("#FF5E5E");
                                ws.Cell(k, j).Style.Font.Strikethrough = true;
                                break;
                        }

                        //if (dt.Rows[b][c].ToString().Split('^').Length > 1)
                        //{
                        //    ws.Cell(k, j).Value = dt.Rows[b][c].ToString().Split('^')[0];
                        //    ws.Cell(k, j).Style.Fill.BackgroundColor = XLColor.FromHtml("#" + dt.Rows[b][c].ToString().Split('^')[1]);
                        //}
                        //else
                        //    ws.Cell(k, j).Value = dt.Rows[b][c].ToString();
                    }
                    else if (IsBaseProxyMap)
                    {
                        ws.Cell(k, j).Value = dt.Rows[b][c].ToString();
                    }
                }
            }
        }
        cellEnd = ws.Cell(k, j);

        ws.Range(cellStart, cellEnd).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
        ws.Range(cellStart, cellEnd).Style.Alignment.SetVertical(XLAlignmentVerticalValues.Center);
        ws.Range(cellStart, cellEnd).Style.Border.SetInsideBorder(XLBorderStyleValues.Thin);
        ws.Range(cellStart, cellEnd).Style.Border.SetOutsideBorder(XLBorderStyleValues.Medium);
        ws.Range(cellStart, cellEnd).Style.Font.SetFontSize(10);
        ws.SheetView.FreezeRows(FreezeRows);
        //ws.Columns().Width = 35;

        if (IsSBD)
        {
            ws.Columns(7, 8).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
        }

        ws.Row(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        ws.Columns().AdjustToContents();

        return wb;
    }

    protected void btnChangeLogDownload_Click(object sender, EventArgs e)
    {
        //string strBucket = JsonConvert.SerializeObject(arr, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        DataTable tblSBD = JsonConvert.DeserializeObject<DataTable>(hdnjsonarr.Value);
        if (tblSBD.Rows[0][0].ToString() == "0")
            tblSBD.Rows.RemoveAt(0);

        DataSet ds = new DataSet();
        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        Scmd.CommandText = "[spSBDGetChangedReport]";
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        //Scmd.Parameters.AddWithValue("@MonthVal", hdnQuarter.Value.ToString().Split('~')[0]);
        //Scmd.Parameters.AddWithValue("@YearVal", hdnQuarter.Value.ToString().Split('~')[1]);
        Scmd.Parameters.AddWithValue("@SBDID", tblSBD);
        Scmd.Parameters.AddWithValue("@LoginID", Session["LoginID"].ToString());
        Scmd.Parameters.AddWithValue("@UserID", Session["UserID"].ToString());
        Scmd.Parameters.AddWithValue("@RoleID", Session["RoleId"].ToString());
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        Sdap.Fill(ds);

        string filename = "SBD Change Log";
        DataTable dt = ds.Tables[0];
        string[] SkipColumn = new string[1];
        SkipColumn[0] = "flgStatus";

        XLWorkbook wb = new XLWorkbook();
        wb = AddWorkSheet_ChangeLog(wb, dt, SkipColumn, "Change Log");
        try
        {
            //Export the Excel file.
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Buffer = true;
            HttpContext.Current.Response.Charset = "";
            HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=" + filename + ".xlsx");
            using (MemoryStream MyMemoryStream = new MemoryStream())
            {
                wb.SaveAs(MyMemoryStream);
                MyMemoryStream.WriteTo(HttpContext.Current.Response.OutputStream);
                HttpContext.Current.Response.Flush();
                HttpContext.Current.Response.End();
            }
        }
        catch (Exception ex)
        {
            //
        }
    }
    private static XLWorkbook AddWorkSheet_ChangeLog(XLWorkbook wb, DataTable dt, string[] SkipColumn, string Sheetname)
    {
        IXLCell cellStart;
        IXLCell cellEnd;
        int k = 0, j = 0, trCntr = 0;
        var ws = wb.Worksheets.Add(Sheetname);

        //-----------Header------------------------
        k++;
        int FreezeRows = k;
        cellStart = ws.Cell(k, j + 1);
        for (int c = 0; c < dt.Columns.Count; c++)
        {
            if (!SkipColumn.Contains(dt.Columns[c].ColumnName.ToString().Trim()))
            {
                j++;
                ws.Cell(k, j).Value = dt.Columns[c].ColumnName.ToString();
                ws.Cell(k, j).Style.Alignment.WrapText = true;
                ws.Cell(k, j).Style.Fill.BackgroundColor = XLColor.FromHtml("#728cd4");
                ws.Cell(k, j).Style.Font.FontColor = XLColor.FromHtml("#ffffff");
                ws.Cell(k, j).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
            }
        }

        //------------Body---------------------------
        trCntr = k;
        for (int b = 0; b < dt.Rows.Count; b++)
        {
            k++; j = 0;
            for (int c = 0; c < dt.Columns.Count; c++)
            {
                if (!SkipColumn.Contains(dt.Columns[c].ColumnName.ToString().Trim()))
                {
                    j++;
                    ws.Cell(k, j).Style.Alignment.WrapText = true;

                    switch (dt.Rows[b]["flgStatus"].ToString())
                    {
                        case "1":   // Green
                            ws.Cell(k, j).Value = dt.Rows[b][c].ToString();
                            ws.Cell(k, j).Style.Fill.BackgroundColor = XLColor.FromHtml("#8CFF8C");
                            break;
                        case "2":   // No Colour
                            ws.Cell(k, j).Value = dt.Rows[b][c].ToString();
                            break;
                        case "3":   // Red
                            ws.Cell(k, j).Value = dt.Rows[b][c].ToString();
                            ws.Cell(k, j).Style.Font.Strikethrough = true;
                            ws.Cell(k, j).Style.Fill.BackgroundColor = XLColor.FromHtml("#FF5E5E");
                            break;
                    }
                }
            }
        }
        cellEnd = ws.Cell(k, j);

        ws.Range(cellStart, cellEnd).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
        ws.Range(cellStart, cellEnd).Style.Alignment.SetVertical(XLAlignmentVerticalValues.Center);
        ws.Range(cellStart, cellEnd).Style.Border.SetInsideBorder(XLBorderStyleValues.Thin);
        ws.Range(cellStart, cellEnd).Style.Border.SetOutsideBorder(XLBorderStyleValues.Medium);
        ws.Range(cellStart, cellEnd).Style.Font.SetFontSize(10);
        ws.SheetView.FreezeRows(FreezeRows);
        //ws.Columns().Width = 35;

        ws.Row(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        ws.Columns().AdjustToContents();

        return wb;
    }
}