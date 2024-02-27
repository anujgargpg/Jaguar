<%@ Page Language="VB" AutoEventWireup="false" CodeFile="frmLogin.aspx.vb" Inherits="Login" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title><%= ConfigurationManager.AppSettings("Title").ToString().Trim()%></title>

    <link href="Images/favicon.ico" rel="shortcut icon" type="image/x-icon" />

    <!-- Latest compiled and minified CSS -->
    <link href="CSS/font-awesome.css" rel="stylesheet" type="text/css" />
    <link href="CSS/bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="CSS/style.css" rel="stylesheet" type="text/css" />

    <!-- Latest compiled and minified JavaScript -->
    <%--<script src="Scripts/jquery-1.12.4.js" type="text/javascript"></script>--%>
    <script src="Scripts/jquery-3.6.0.js"  type="text/javascript"></script>
    <script src="Scripts/js_LoginForm_PNG.js"></script>
    <!-- WARNING: Respond.js doesn't work if you view the page via file: -->
    <!--[if lt IE 9]>
  <script src="Scripts/html5shiv.min.js"></script>
  <script src="Scripts/respond.min.js"></script>
<![endif]-->
</head>
<body onload="fnSetFocus();">
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
                    <div class="loginfrm cls-4">
                        <div class="login-box">
                            <div class="login-box-msg">
                                <asp:Image ID="imgLogo1" runat="server" ImageUrl="~/Images/p_g-logo.png" alt="RRD Logo" class="logo1" />
                                <h3 class="title">User Login</h3>
                            </div>
                            <div class="login-box-body clearfix">
                                <div class="input-group frm-group-txt mb-0">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fa fa-user"></i></span>
                                    </div>
                                    <input type="text" class="form-control" id="txtUserName" runat="server" placeholder="Email-Id" autocomplete="off" />
                                </div>
                                <div class="input-group frm-group-txt d-none">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fa fa-lock"></i></span>
                                    </div>
                                    <input type="password" class="form-control" id="txtPassword" runat="server" placeholder="Password" autocomplete="off" />
                                </div>
								<div class="flex-sb-m w-100 pb-3 d-none">
                                    <div class="contact100-form-checkbox">
                                        <input class="input-checkbox100" id="ckb1" type="checkbox" name="remember-me">
                                        <label class="label-checkbox100" for="ckb1">
                                            Remember me
                                        </label>
                                    </div>
                                    <div class="d-block">
                                        <a href="#" class="txt1">Forgot your password?</a>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center error_msg">
                                <span id="dvMessage" runat="server" class="label label-danger labeldanger"></span></div>
                            <div class="login-box-footer clearfix">
                                <asp:Button ID="btnSubmit" Text="Login" CssClass="btns btn-submit w-100" runat="server" OnClientClick="return fnValidate();" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
