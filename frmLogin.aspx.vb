Imports System.Web.Security
Imports System.Data.SqlClient
Imports RestSharp
Imports System.IO
Imports System.Net
Imports System.IdentityModel.Tokens.Jwt
Imports Newtonsoft.Json.Linq
Imports System.Data
Imports DocumentFormat.OpenXml.Drawing.Spreadsheet

Partial Class Login
    Inherits System.Web.UI.Page
    Private Sub Page_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        If Not IsPostBack Then
            FormsAuthentication.SignOut()
            Session.Abandon()
            Session.RemoveAll()
        End If

    End Sub
    Protected Sub btnSubmit_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnSubmit.Click
        Session("usergroup") = "JaguarGroup"
        Session("EmailId") = ReplaceQuotes(Trim(txtUserName.Value))
        Session("LoginIDForPingID") = "1"
        Response.Redirect("Login.aspx")

        'Try
        '    Dim sqlPara As Dictionary(Of String, String) = New Dictionary(Of String, String)()
        '    sqlPara.Add("UserName", ReplaceQuotes(Trim(txtUserName.Value)))
        '    Dim Ds As DataSet = DBHelper.ExecuteDataSet("SpUserValidation", sqlPara)

        '    If Ds IsNot Nothing Then
        '        If Ds.Tables(0).Rows.Count > 0 Then
        '            If (Convert.ToString(Ds.Tables(0).Rows(0)("UserID")) = "") Then
        '                dvMessage.InnerText = "User is not registered to access this application. Please contact the site admin !!!"
        '                txtUserName.Value = ""
        '                txtPassword.Value = ""
        '            ElseIf Convert.ToInt16(Ds.Tables(0).Rows(0)("flgDormant")) = 1 Then
        '                dvMessage.InnerText = "Login Failed !! It seems you have not login for long and your account became inactive. Kindly contact site admin to reenable the same."
        '                txtUserName.Value = ""
        '                txtPassword.Value = ""
        '            Else
        '                Session("usergroup") = Ds.Tables(0).Rows(0)("Usergroup")
        '                Session("EmailId") = Ds.Tables(0).Rows(0)("EmailId")
        '                Session("LoginIDForPingID") = Ds.Tables(0).Rows(0)("UserID")
        '                Response.Redirect("Login.aspx")
        '            End If
        '        Else
        '            dvMessage.InnerText = "User not Found !!! "
        '            txtUserName.Value = ""
        '            txtPassword.Value = ""
        '        End If
        '    Else
        '        dvMessage.InnerText = "Sorry, due to some technical reasons, we are unable to process your request !!! "
        '        txtUserName.Value = ""
        '        txtPassword.Value = ""
        '    End If

        'Catch ex As Exception
        '    dvMessage.InnerText = "Error : " & ex.Message
        '    txtUserName.Value = ""
        '    txtPassword.Value = ""
        'End Try

    End Sub

    Public Function ReplaceQuotes(ByVal str As String) As String
        Return Replace(str, "'", "''")
    End Function
End Class
