<template>
  <div class="container">
    <button v-on:click="back">뒤로 가기</button>
    <div class="editor" contenteditable="true" @input="onUpdateContent"></div>
    <button v-on:click="save">저장하기</button>
    <button v-on:click="openEmoteSyncPage">사용가능한 새 이모티콘 가져오기</button>
  </div>
</template>

<script lang="ts">
// 에디터는 어떤 기능이 들어가야 하는가?
//     1. 글 쓸 수 있어야 함.
//     2. 이모티콘 넣을 수 있어야 하고
//     3. 사진 넣을 수 있어야 하고요 - Optional
import { Component, Vue } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import EmotesComponent from "@/components/Emotes.vue";
import { TWITCH_APP_CLIENT_ID } from "../api/twitchApi";

declare var Twitch: any;

@Component({
  components: {
    EmotesComponent
  }
})
export default class Edit extends Vue {
  @State("extensionAuth") extensionAuth!: ExtensionAuth;
  @Action("changePage") changePage: any;

  content: string = "";

  onUpdateContent(event) {
    this.content = event.target.innerText;
  }
  back() {
    this.changePage("ViewPage");
  }
  async save() {
    const response = await fetch(
      "https://yaauic5zfh.execute-api.ap-northeast-2.amazonaws.com/dev/feed",
      {
        method: "POST",
        body: JSON.stringify({
          token: this.extensionAuth.token,
          content: this.content
        })
      }
    );
    const json = await response.json();
    console.log(json);
    this.changePage("ViewPage");
  }
  openEmoteSyncPage() {
    const redirectUri = "http://192.168.0.2:8090";
    const responseType = "token+id_token";
    const scope = ["openid", "user_subscriptions", "user_read"].join(" ");
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_APP_CLIENT_ID}&redirect_uri=${redirectUri}&&response_type=${responseType}&scope=${scope}`;
    window.open(url);
  }
}
</script>
<style scoped>
.editor {
  min-height: 200px;
  border: 1px solid blueviolet;
}
</style>