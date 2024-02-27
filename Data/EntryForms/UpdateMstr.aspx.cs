using DocumentFormat.OpenXml.EMMA;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection.Emit;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _UpdateMstr : System.Web.UI.Page
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
                hdnHierTypeID.Value = Request.QueryString["t"];

                hdnLoginID.Value = Session["LoginID"].ToString();
                hdnUserID.Value = Session["UserID"].ToString();
                hdnRoleID.Value = Session["RoleId"].ToString();
                hdnNodeID.Value = Session["NodeId"].ToString();
                hdnNodeType.Value = Session["NodeType"].ToString();

                if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "3"))
                    GetMaster();
                else if (Utilities.ValidateRoleBasedAccess(hdnRoleID.Value, "4"))
                    GetMaster();
                else
                    Response.Redirect("~/frmLogin.aspx");
            }
        }
    }
    private void GetMaster()
    {
        //
    }


    [System.Web.Services.WebMethod()]
    public static string GetHierNodes(string NodeId, string NodeType, string HierTypeId)
    {
        try
        {
            Dictionary<string, string> sqlPara = new Dictionary<string, string>();
            sqlPara.Add("NodeID", NodeId);
            sqlPara.Add("NOdeType", NodeType);
            sqlPara.Add("HierTypeID", HierTypeId);
            DataSet Ds = DBHelper.ExecuteDataSet("spMastergetNodeChilds", sqlPara);

            return "0|^|" + CreateNodelist(Ds.Tables[0]);

        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
    private static string CreateNodelist(DataTable dt)
    {
        StringBuilder sb = new StringBuilder();

        sb.Append("<ul>");
        if (dt.Rows.Count > 0)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                sb.Append("<li nid='" + dt.Rows[i]["NodeID"].ToString() + "' ntype='" + dt.Rows[i]["NodeType"].ToString() + "' flgDBCallforChildStr='0' flgHasChild='" + dt.Rows[i]["flgHasChild"].ToString() + "' flgExpandCollapse='0'>");

                if (dt.Rows[i]["flgHasChild"].ToString() == "1")
                    sb.Append("<img class='c-pointer' src='../../Images/icoAdd.gif' title='click to expand' onclick='fnExpandCollapse(this);' />");
                else
                    sb.Append("<img class='' src='../../Images/Down-Right-Arrow.png'/>");

                sb.Append("<a href='#' onclick=fnClickOnNode(this);>" + dt.Rows[i]["Descr"].ToString() + "</a>");
                sb.Append("</li>");
            }
        }
        else
            sb.Append("<li>No Child Node Found !</li>");

        sb.Append("</ul>");

        return sb.ToString();
    }



    [System.Web.Services.WebMethod()]
    public static string GetNodeDetails(string NodeId, string NodeType)
    {
        try
        {
            Dictionary<string, string> sqlPara = new Dictionary<string, string>();
            sqlPara.Add("NodeID", NodeId);
            sqlPara.Add("NOdeType", NodeType);
            DataSet Ds = DBHelper.ExecuteDataSet("spMasterGetNodeDetails", sqlPara);

            object obj = JsonConvert.SerializeObject(Ds, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            return "0|^|" + obj.ToString();

        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }



    [System.Web.Services.WebMethod()]
    public static string SaveNodeDetails(string HierTypeID, string NodeId, string NodeType, string Code, string Descr, string flgAddEdit, string LoginID, string SwingCode, string flgMR)
    {
        try
        {
            Dictionary<string, string> sqlPara = new Dictionary<string, string>();
            sqlPara.Add("HierTypeID", HierTypeID);
            sqlPara.Add("PNodeID", NodeId);
            sqlPara.Add("PNodeType", NodeType);
            sqlPara.Add("Code", Code);
            sqlPara.Add("Descr", Descr);
            sqlPara.Add("flgAddNew", flgAddEdit);     // 1: Add, 2: Edit
            sqlPara.Add("LoginID", LoginID);
            sqlPara.Add("SwingCode", SwingCode);
            sqlPara.Add("flgMR", flgMR);
            DataSet Ds = DBHelper.ExecuteDataSet("spMasterSaveHierrachy", sqlPara);

            if (Ds.Tables[0].Rows[0]["flgDuplicate"].ToString() == "0")
            {
                return "0|^|" + Ds.Tables[1].Rows[0]["NodeID"].ToString() + "|^|" + Ds.Tables[1].Rows[0]["NodeType"].ToString();

                //New Add Functionality
                //if (flgAddEdit == "1")
                //    return "0|^|" + Ds.Tables[2].Rows[0]["NodeID"].ToString() + "|^|" + Ds.Tables[2].Rows[0]["NodeType"].ToString();
                //else
                //    return "0|^|" + Ds.Tables[1].Rows[0]["NodeID"].ToString() + "|^|" + Ds.Tables[1].Rows[0]["NodeType"].ToString();
            }
            else
                return "2";

        }
        catch (Exception ex)
        {
            return "1|^|" + ex.Message;
        }
    }
}