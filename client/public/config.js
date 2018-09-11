function openSync() {
  var redirectUri = "https://sync-emote.twitchchannelfeed.com";
  var responseType = "token+id_token";
  var scope = ["openid", "user_subscriptions", "user_read"].join(" ");
  var url = "https://id.twitch.tv/oauth2/authorize?client_id=04x1w8j9ieyvxl4c3j17173z0zh1e7&redirect_uri="
    + redirectUri
    + "&response_type="
    + responseType
    + "&scope="
    + scope;
  window.open(url);
}

document.getElementById('sync-button').addEventListener('click', openSync);