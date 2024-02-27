<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Login" %>

<!DOCTYPE html>

<html>
<head runat="server">
   <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title><%= ConfigurationManager.AppSettings["Title"].ToString().Trim()%></title>

    <link href="Images/favicon.ico" rel="shortcut icon" type="image/x-icon" />

    <!-- Latest compiled and minified CSS -->
    <link href="CSS/font-awesome.css" rel="stylesheet" type="text/css" />
    <link href="CSS/bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="CSS/style.css" rel="stylesheet" type="text/css" />

    <!-- Latest compiled and minified JavaScript -->
    <%--<script src="Scripts/jquery-1.12.4.js" type="text/javascript"></script>--%>
    <script src="Scripts/jquery-3.6.0.js"  type="text/javascript"></script>
    <script src="Scripts/js_LoginForm_PNG.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <div class="full-background">
            <img src="Images/login-bg.jpg" class="bg-img" />
        </div>
		 <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div class="login-img">
                        <img src="Images/JaguarLogo_w.png" class="w-100" />
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="loginfrm cls-4" id="divMainbox" runat="server" style="display:none">
                        <div class="login-box">
                            <div class="login-box-msg">
                                <asp:Image ID="imgLogo1" runat="server" ImageUrl="~/Images/p_g-logo.png" alt="RRD Logo" class="logo1" />
                                <h3 class="title">Error</h3>
                            </div>
                            <div class="text-center error_msg mb-4">
                                <span id="dvMessage" runat="server" class="label label-danger labeldanger"></span></div>
                            <div class="login-box-footer clearfix">
                                <a href="frmLogin.aspx" class="btns btn-submit btns-sm w-100" title="Click To Login" OnClick="btnSubmit_Click">click To return</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
