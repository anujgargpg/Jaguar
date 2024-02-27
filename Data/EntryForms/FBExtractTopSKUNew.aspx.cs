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

public partial class FBExtractTopSKU : System.Web.UI.Page
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

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "80"))
                    GetMaster();
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
        Scmd.CommandText = "[spFBGetFBMatser]";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        Sdap = new SqlDataAdapter(Scmd);
        Ds = new DataSet();
        Sdap.Fill(Ds);
        Scmd.Dispose();
        Sdap.Dispose();

        bool isSelected = true;
        ListItem itm = new ListItem();
        foreach (DataRow dr in Ds.Tables[0].Rows)
        {
            itm = new ListItem();
            itm.Text = dr["Month"].ToString();
            itm.Value = dr["Start Date"].ToString() + "|" + dr["End Date"].ToString();
            ddlQuarter.Items.Add(itm);
            if (dr["flgSelect"].ToString() == "1" && isSelected)
            {
                itm.Selected = true;
                isSelected = false;
            }
        }

        //for (int i = 0; Ds.Tables[0].Rows.Count > i; i++)
        //{
        //    sbMstr.Append("<option value='" + Ds.Tables[0].Rows[i]["Start Date"].ToString() + "|" + Ds.Tables[0].Rows[i]["End Date"].ToString() + "'>" + Ds.Tables[0].Rows[i]["Month"].ToString() + "</option>");
        //    if (Ds.Tables[0].Rows[i]["flgSelect"].ToString() == "1")
        //        sbSelectedstr.Append(Ds.Tables[0].Rows[i]["Start Date"].ToString() + "|" + Ds.Tables[0].Rows[i]["End Date"].ToString());
        //}
        //hdnQuarter.Value = sbMstr.ToString() + "|^|" + sbSelectedstr.ToString();


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
        Scmd.CommandText = "[spGetMSMPAliesFilter]";
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
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
            sb.Append("<th style='width:25%;'>Category</th>");
            sb.Append("<th style='width:25%;'>Brand</th>");
            sb.Append("<th style='width:25%;'>BrandForm</th>");
            sb.Append("<th style='width:25%;'>SubBrandForm</th>");
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
    public static string GetBucketbasedonType(string LoginID, string RoleID, string UserID, string BucketType, string QtrNo, string QtrYear)
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
            sb.Append("<tr onclick='fnSelectUnSelectBucket(this);' flg='0' flgVisible='1' BucketID='" + dt.Rows[i]["BucketID"] + "' StrValue='" + dt.Rows[i]["StrValue"] + "' InSubD='" + dt.Rows[i]["flgIncludeSubD"] + "'>");
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
    public static string fnDownloadCSVExtractReport(string LoginID, string RoleID, string UserID, string FBType, object objProd, object objLoc, object objChannel, string ProcessGroup, object objUser, string QtrNo, string QtrYear)
    {
        try
        {
            // ----------- MS & P
            StringBuilder sbTimeChecker = new StringBuilder();
            string strUser = JsonConvert.SerializeObject(objUser, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            DataTable dtUser = JsonConvert.DeserializeObject<DataTable>(strUser);
            if (dtUser.Rows[0][0].ToString() == "0")
                dtUser.Rows.RemoveAt(0);

            // ----------- Product
            DataTable tblProd = new DataTable();
            string str = JsonConvert.SerializeObject(objProd, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblProd = JsonConvert.DeserializeObject<DataTable>(str);
            if (tblProd.Rows[0][0].ToString() == "0")
            {
                tblProd.Rows.RemoveAt(0);
            }

            // ----------- Location
            DataTable tblLoc = new DataTable();
            string strLoc = JsonConvert.SerializeObject(objLoc, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblLoc = JsonConvert.DeserializeObject<DataTable>(strLoc);
            if (tblLoc.Rows[0][0].ToString() == "0")
            {
                tblLoc.Rows.RemoveAt(0);
            }

            // ----------- Channel
            DataTable tblChannel = new DataTable();
            string strChannel = JsonConvert.SerializeObject(objChannel, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            tblChannel = JsonConvert.DeserializeObject<DataTable>(strChannel);
            if (tblChannel.Rows[0][0].ToString() == "0")
            {
                tblChannel.Rows.RemoveAt(0);
            }

            SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
            SqlCommand Scmd = new SqlCommand();
            Scmd.Connection = Scon;
            if(FBType == "1")
                Scmd.CommandText = "spFBExtracttopSKU_New";
            else
                Scmd.CommandText = "spFBExtracttopSKU_TopUp_New";
            Scmd.Parameters.AddWithValue("@UserID", UserID);
            Scmd.Parameters.AddWithValue("@LoginID", LoginID);
            Scmd.Parameters.AddWithValue("@RoleID", RoleID);
            Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
            Scmd.Parameters.AddWithValue("@LocSelection", tblLoc);
            Scmd.Parameters.AddWithValue("@ChannelSelection", tblChannel);
            if (ProcessGroup != "")
                Scmd.Parameters.AddWithValue("@ProcessGroup", ProcessGroup);
            Scmd.Parameters.AddWithValue("@Users", dtUser);
            Scmd.Parameters.AddWithValue("@MonthVal", QtrNo);
            Scmd.Parameters.AddWithValue("@YearVal", QtrYear);
            Scmd.CommandType = CommandType.StoredProcedure;
            Scmd.CommandTimeout = 0;
            SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
            DataSet Ds = new DataSet();
            Sdap.Fill(Ds);
            Scmd.Dispose();
            Sdap.Dispose();

            string[] MonthArr = { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
            string strFileName = "";
            if(FBType == "1")
                strFileName = "FB Top SKU Extract - " + MonthArr[Convert.ToInt16(QtrNo) - 1] + " " + QtrYear;
            else
                strFileName = "Topup FB Top SKU Extract - " + MonthArr[Convert.ToInt16(QtrNo) - 1] + " " + QtrYear;

            try
            {
                string[] SkipColumn = new string[0];
                saveCSVFile(Ds.Tables[0], SkipColumn, HttpContext.Current.Server.MapPath("~/Files/") + strFileName + ".csv");
            }
            catch (Exception ex)
            {
                classSendMail.fnSendmail("saurav@astix.in", "", "Jaguar : Error while Downloading FB Extract", ex.Message, "");
            }
            finally
            {
                Sdap.Dispose();
                Scmd.Dispose();
                Scon.Dispose();
            }

            return "0|^|" + strFileName.ToString();
        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static void saveCSVFile(DataTable dt, string[] SkipColumn, string Path)
    {
        StringBuilder sb = new StringBuilder();
        //for (int j = 0; j < dt.Columns.Count; j++)
        //{
        //    if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
        //    {                
        //        if (j != dt.Columns.Count - 1)
        //            sb.Append(dt.Columns[j].ColumnName.ToString() + ", ");
        //        else
        //            sb.Append(dt.Columns[j].ColumnName.ToString());
        //    }
        //}
        //sb.Append(Environment.NewLine);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (!SkipColumn.Contains(dt.Columns[j].ColumnName.ToString().Trim()))
                {
                    if (j != dt.Columns.Count - 1)
                        sb.Append(Utilities.HTMLDecode(dt.Rows[i][j].ToString()) + ", ");
                    else
                        sb.Append(Utilities.HTMLDecode(dt.Rows[i][j].ToString()));
                }
            }
            sb.Append(Environment.NewLine);
        }

        using (StreamWriter objWriter = new StreamWriter(Path, false, new UTF8Encoding(true)))
        {
            objWriter.WriteLine(sb);
            objWriter.Flush();
        }
        sb.Clear();
    }

    protected void btnDownload_Click(object sender, EventArgs e)
    {
        DataTable dtUser = new DataTable();
        dtUser.Columns.Add("Col1", typeof(Int32));
        if (hdnUserValue.Value != "")
        {
            for (var i = 0; i < hdnUserValue.Value.Split('^').Length; i++)
            {
                DataRow dr = dtUser.NewRow();
                dr[0] = hdnUserValue.Value.Split('^')[i];
                dtUser.Rows.Add(dr);
            }
        }

        // ----------- Product
        DataTable tblProd = new DataTable();
        tblProd.Columns.Add("Col1", typeof(Int32));
        tblProd.Columns.Add("Col2", typeof(Int32));
        tblProd.Columns.Add("Col3", typeof(Int32));
        if (hdnProductValue.Value != "")
        {
            for (var i = 0; i < hdnProductValue.Value.Split('^').Length; i++)
            {
                DataRow dr = tblProd.NewRow();
                dr[0] = hdnProductValue.Value.Split('^')[i].Split('|')[0];
                dr[1] = hdnProductValue.Value.Split('^')[i].Split('|')[1];
                dr[2] = "1";
                tblProd.Rows.Add(dr);
            }
        }

        // ----------- Location
        DataTable tblLoc = new DataTable();
        tblLoc.Columns.Add("Col1", typeof(Int32));
        tblLoc.Columns.Add("Col2", typeof(Int32));
        tblLoc.Columns.Add("Col3", typeof(Int32));
        if (hdnLocationValue.Value != "")
        {
            for (var i = 0; i < hdnLocationValue.Value.Split('^').Length; i++)
            {
                DataRow dr = tblLoc.NewRow();
                dr[0] = hdnLocationValue.Value.Split('^')[i];
                dr[1] = "0";
                dr[2] = "5";
                tblLoc.Rows.Add(dr);
            }
        }

        // ----------- Channel
        DataTable tblChannel = new DataTable();
        tblChannel.Columns.Add("Col1", typeof(Int32));
        tblChannel.Columns.Add("Col2", typeof(Int32));
        tblChannel.Columns.Add("Col3", typeof(Int32));
        if (hdnChannelValue.Value != "")
        {
            for (var i = 0; i < hdnChannelValue.Value.Split('^').Length; i++)
            {
                DataRow dr = tblChannel.NewRow();
                dr[0] = hdnChannelValue.Value.Split('^')[i].Split('|')[0];
                dr[1] = hdnChannelValue.Value.Split('^')[i].Split('|')[1];
                dr[2] = "3";
                tblChannel.Rows.Add(dr);
            }
        }

        string[] MonthArr = { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

        SqlConnection Scon = new SqlConnection(DBHelper.getDBConnectionString());
        SqlCommand Scmd = new SqlCommand();
        Scmd.Connection = Scon;
        if(ddlFBType.SelectedValue == "1")
            Scmd.CommandText = "spFBExtracttopSKU_New";
        else
            Scmd.CommandText = "spFBExtracttopSKU_TopUp_New";
        Scmd.Parameters.AddWithValue("@UserID", hdnUserID.Value);
        Scmd.Parameters.AddWithValue("@LoginID", hdnLoginID.Value);
        Scmd.Parameters.AddWithValue("@RoleID", hdnRoleID.Value);
        Scmd.Parameters.AddWithValue("@PrdSelection", tblProd);
        Scmd.Parameters.AddWithValue("@LocSelection", tblLoc);
        Scmd.Parameters.AddWithValue("@ChannelSelection", tblChannel);
        if (hdnProcessGrpValue.Value != "")
            Scmd.Parameters.AddWithValue("@ProcessGroup", hdnProcessGrpValue.Value);
        Scmd.Parameters.AddWithValue("@Users", dtUser);
        Scmd.Parameters.AddWithValue("@MonthVal", Array.IndexOf(MonthArr, ddlQuarter.SelectedItem.Text.Split('-')[0]) + 1);
        Scmd.Parameters.AddWithValue("@YearVal", "20" + ddlQuarter.SelectedItem.Text.Split('-')[1]);
        Scmd.CommandType = CommandType.StoredProcedure;
        Scmd.CommandTimeout = 0;
        SqlDataAdapter Sdap = new SqlDataAdapter(Scmd);
        DataSet ds = new DataSet();
        Sdap.Fill(ds);
        Scmd.Dispose();
        Sdap.Dispose();

        string filename = "FB Top SKU Extract - " + ddlQuarter.SelectedItem.Text;
        if(ddlFBType.SelectedValue == "1")
            filename = "FB Top SKU Extract - " + ddlQuarter.SelectedItem.Text;
        else
            filename = "Topup FB Top SKU Extract - " + ddlQuarter.SelectedItem.Text;

        string[] SkipColumn = new string[0];

        XLWorkbook wb = new XLWorkbook();
        try
        {
            wb = AddWorkSheet(wb, ds.Tables[0], SkipColumn, "Top SKU Extract", true, false);

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
                ws.Cell(k, j).Value = Utilities.HTMLDecode(dt.Columns[c].ColumnName.ToString());
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
                    ws.Cell(k, j).Value = Utilities.HTMLDecode(dt.Rows[b][c].ToString());
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

        ws.Column(1).Width = 25;
        ws.Column(2).Width = 30;
        ws.Column(3).Width = 50;
        ws.Row(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        //ws.Columns().AdjustToContents();

        return wb;
    }
}   