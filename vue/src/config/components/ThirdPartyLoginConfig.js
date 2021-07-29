export default new class LoginApiConfig {
    Twitter = {
        key: "VhbxtQffNf338grY2s2KzayfP",
        secret: "8ZlpbAgkl2fJagM2fpk9lzqaS6hF7wwTU905C33xyLiwQoFq2S",
    };
    Facebook = {
        scope: "email",
        returnScopes: true,
        fields: "last_name,first_name,name,email",
    };
    Discord = {
        grantType: "authorization_code",
        clientID: "859351116579209226",
        clientSecret: "BSwqX6PUgeTQFR2Jquhxy8bzWlbIf_jg",
        scope: "email identify guilds",
        responseType: "code",
        baseAuthUrl: "https://discord.com/api/oauth2/authorize",
    };
    Google = {
        client_id:
            "946863130831-6478h6ivofcmp9f83qalitu1enb9f6if.apps.googleusercontent.com",
    };
    // facebook appId
    //196192812417215 測試
    //240532037585332 正式
    //362353478733244 測試 商家
}
