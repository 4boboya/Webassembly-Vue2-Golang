import { mapState, mapMutations } from "vuex";
import hello from "hellojs/dist/hello.all.js";
import LoginApiConfig from '@/config/components/ThirdPartyLoginConfig';
import { discordTokenCheck, getDiscordAtMe } from '@/apis/thirdPartyLogin';
import axios from "axios";
import qs from "qs";
const ThirdPartyLogin = {
    data() {
        return {
            discordConfig: LoginApiConfig.Discord,
            facebookConfig: LoginApiConfig.Facebook,
            twitterConfig: LoginApiConfig.Twitter,
            googleSignInParams: LoginApiConfig.Google,
        };
    },
    computed: {
        ...mapState("Login", ["Finger", "User"]),
        ...mapState("Root", ["Host"]),
        discordLoginPath() {
            let discordConfig = this.discordConfig;
            let { baseAuthUrl, clientID, responseType, scope } = discordConfig;
            let redirectUrl = `${this.Host}/login`;
            return `${baseAuthUrl}?client_id=${clientID}&redirect_uri=${redirectUrl}&response_type=${responseType}&scope=${scope}`;
        },
        fbSignInParams() {
            let { scope, returnScopes } = this.facebookConfig;
            return {
                scope: scope,
                return_scopes: returnScopes,
            }
        }
    },
    mounted() {
        this.twitterInit();
    },
    methods: {
        // twitter
        twitterInit() {
            let { scope, key } = this.twitterConfig;
            let options = { scope, redirect_uri: `${this.Host}/login` }
            hello.init({ twitter: key }, options);
        },
        twitterLogin() {
            this.loading = true;
            let twitter = hello("twitter");
            twitter.login().then(
                () => { //success
                    twitter.api("me", { include_email: true }).then((res) => {
                        this.loginForSite(res.email, res.name, "twitter");
                    });
                },
                (e) => { // error
                    this.loading = false;
                    this.$msg.Error("Connection twitter api error!");
                }
            );
        },
        // discord
        checkDiscordLogin() {
            if (this.$format.NotNull(this.$route.query.code)) {
                this.loading = true;
                this.discordGetData(this.$route.query.code);
            }
            if (this.$format.NotNull(this.$route.query.error)) {
                this.SignInError();
            }
        },
        async discordGetData(code) {
            let { grantType, clientID, clientSecret } = this.discordConfig;
            // discordTokenCheck
            let body = qs.stringify({
                grant_type: grantType,
                client_id: clientID,
                client_secret: clientSecret,
                redirect_uri: `${this.Host}${this.$route.path}`,
                code: code,
            });
            let headers = { "Content-Type": "application/x-www-form-urlencoded" };
            let tokenResponse = await discordTokenCheck(body, headers);
            if (this.checkTokenResponse(tokenResponse)) {
                let tokenHeaders = { Authorization: `Bearer ${tokenResponse.access_token}` };
                let userInfo = await getDiscordAtMe(tokenHeaders);
                this.loginForSite(userInfo.email, userInfo.username, "discord");
            } else {
                this.loading = false;
                this.$router.push({ query: {} });
            }
        },
        checkTokenResponse(tokenResponse) {
            if (!tokenResponse) return false;
            let success = true;
            let keys = ["access_token", "token_type", "scope", "refresh_token"];
            keys.forEach((key) => {
                if (!this.$format.NotNull(tokenResponse[key])) success = false;
            })
            if (tokenResponse.error != undefined || tokenResponse.error_description != undefined) success = false;
            return success;
        },
        // google
        googleSignInSuccess(res) {
            this.loginForSite(res.Ts.Et, res.Ts.Me, "google");
        },
        // facebook
        FBSignInSuccess(response) {
            var userID = response.authResponse.userID;
            if (response.status == "connected") {
                FB.api(
                    `/${userID}`,
                    "GET",
                    { fields: "last_name,first_name,name,email" },
                    (res) => {
                        this.loginForSite(res.email, res.name, "facebook");
                    }
                );
            }
        },
    },
};
export default ThirdPartyLogin;
