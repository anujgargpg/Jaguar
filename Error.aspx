<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Error.aspx.cs" Inherits="Custom_Error" %>

<!DOCTYPE html>

<html>
<head id="Head1">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

    <title>Jaguar Trade Tool Dev</title>
    <link href="../MasterPages/Images/favicon.ico" rel="shortcut icon" type="image/x-icon" />

    <!-- Latest compiled and minified CSS -->
    <link href="CSS/font-awesome.css" rel="stylesheet" type="text/css" />
    <link href="CSS/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="CSS/jquery-ui.css" rel="stylesheet" type="text/css" />
    <link href="CSS/style.css" rel="stylesheet" type="text/css" />
    <link href="CSS/header-menu.css" rel="stylesheet" type="text/css" />

    <!-- Latest compiled and minified JavaScript -->
    <script src="Scripts/jquery-1.12.4.js" type="text/javascript"></script>
    <script src="Scripts/bootstrap.min.js" type="text/javascript"></script>
</head>
<body>
    <form id="form1" runat="server">
        <div class="full-background">
            <img src="Images/login-bg.jpg" class="bg-img" />
        </div>
        <nav class="navbar fixed-top shadow-sm navbar-head">
            <div class="container">
                <div class="d-flex w-100 h-66">
                    <img id="imgLogo1" alt="RRD Logo" class="logo" src="Images/p_g-logo.png" />
                    <div class="d-flex ml-auto">
                        <div class="d-block">
                            <ul class="user_nav text-right">
                                <li><span id="lblUserName" class="font-weight-bold"></span>
                                    &nbsp; &nbsp;</li>
                                <li><a href="frmLogin.aspx" class="btn">
                                    <img src="Images/Logout.png" /></a></li>
                            </ul>

                        </div>
                        <div class="d-block">
                            <img id="imgLogo2" alt="RRD Logo" class="logo_sec" src="Images/JaguarLogo_w.png" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="container-fluid" style='margin-top: 100px;'>
            <div class="container text-center clearfix">
                <h1 style="color: #006393; font-size: 6rem;">Oops !!</h1>
                <h4 style="color: #444;"">Sorry but due to some technical reasons, an unexpected error occured.</h4>
                <h1 style="color: #fff; font-size: 11rem;">ERROR</h1>
                <h6>Click to visit the <a href="Data/Other/frmDashboard.aspx">Home Page</a></h6>
                <div class="clear"></div>
            </div>
        </div>
    </form>
</body>
</html>
