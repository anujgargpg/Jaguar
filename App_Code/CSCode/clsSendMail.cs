using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Data.SqlClient;
using System.Text;
using System.Net.Mail;


/// <summary>
/// Summary description for classSendMail
/// </summary>
public class clsSendMail
{

    public static string SendMail(string ToMail, string BCCMail, string CCMail, string sub, string msg, string MailType)
    {
        try
        {
            MailMessage mail = new MailMessage();
            mail.From = new MailAddress("PMS Support <PMSSupport@astix.in>");
            if (ConfigurationManager.AppSettings["flgTesting"].ToString() == "0")
            {
                if (ToMail != "")
                    mail.To.Add(ToMail);
                if (BCCMail != "")
                    mail.Bcc.Add(BCCMail);
                if (CCMail != "")
                    mail.CC.Add(CCMail);
            }
            else
            {
                mail.To.Add(ConfigurationManager.AppSettings["TestingMailId"].ToString());
            }
            mail.Subject = sub;
            mail.Body = msg;
            mail.IsBodyHtml = true;
            //mail.Attachments.Add(new Attachment(fileName));

            SmtpClient SmtpServer = new SmtpClient(ConfigurationManager.AppSettings["MailServerString"].ToString());
            SmtpServer.Credentials = new System.Net.NetworkCredential(ConfigurationManager.AppSettings["MailUserName"].ToString(), ConfigurationManager.AppSettings["MailPassword"].ToString());
            SmtpServer.Port = 587;
            SmtpServer.EnableSsl = false;
            SmtpServer.Send(mail);

            Console.WriteLine("Mail successfully send to " + ToMail);
            return "0";
        }
        catch (Exception ex)
        {
            Console.WriteLine("Mail failed to send " + ToMail);
            return "1^" + ex.Message;
        }
    }



}