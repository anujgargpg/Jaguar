using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Azure.Identity;
using Microsoft.Azure.KeyVault;
using Microsoft.IdentityModel.Clients.ActiveDirectory;


/// <summary>
/// Summary description for AzureUtilities
/// </summary>
public class AzureUtilities
{
    private static async Task<string> GetToken(string authority, string resource, string scope)
    {
        try
        {
            var clientId = "0a3c8ad3-0575-4e56-adcd-a98b456d587c";
            var clientSecret = "CKq8Q~svynbJ-~S__UwbTyFhHq6ys4t3Y9-XkanT";

            ClientCredential credential = new ClientCredential(clientId, clientSecret);
            var context = new AuthenticationContext(authority);
            var result = await context.AcquireTokenAsync(resource, credential);
            return result.AccessToken;
        }
        catch (Exception ex)
        {
            //Add database error logging
            throw ex;
        }
    }

    // In Development
    public static string GetVaultValue(string secretKeyName)
    {
        try
        {
            KeyVaultClient client = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(GetToken));
            var vaultAddress = "https://tradeplannkv.vault.azure.net/";
            var secretName = secretKeyName;
            var secret = client.GetSecretAsync(vaultAddress, secretName).GetAwaiter().GetResult();
            return secret.Value;
        }
        catch (Exception ex)
        {
            //Add database error logging
            throw ex;
        }
    }
    public static SqlConnection GetSQLConnection()
    {
        try
        {
            SqlConnection Scon = new SqlConnection("Server=tcp:jaguartest.database.windows.net,1433;Initial Catalog=db_Jaguar;Encrypt=True;");
            Environment.SetEnvironmentVariable("AZURE_CLIENT_ID", "0a3c8ad3-0575-4e56-adcd-a98b456d587c");
            Environment.SetEnvironmentVariable("AZURE_TENANT_ID", "b95e1a25-528c-4e2f-b119-a9ff18b251da");
            Environment.SetEnvironmentVariable("AZURE_CLIENT_SECRET", "CKq8Q~svynbJ-~S__UwbTyFhHq6ys4t3Y9-XkanT");

            Scon.AccessToken = new DefaultAzureCredential().GetToken(new Azure.Core.TokenRequestContext(new[] { "https://database.windows.net//.default" })).Token;
            return Scon;
        }
        catch (Exception ex)
        {
            //Add database error logging
            throw ex;
        }
    }
}