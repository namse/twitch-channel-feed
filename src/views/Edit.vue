<template>
  <div class="container">
    <div class="editor" contenteditable="true">
    </div>
    <button v-on:click="save">저장하기</button>
    <button v-on:click="login">로그인하기</button>
    <!-- <button v-on:click="getUser">getUser</button>
    <button v-on:click="getUserEmotes">getUserEmotes</button> -->
    <EmotesComponent />
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

@Component({
  components: {
    EmotesComponent
  }
})
export default class Edit extends Vue {
  @State("clientId") clientId!: string;
  @State("accessToken") accessToken!: string;

  @Action("fetchAccessTokenAndIdToken") fetchAccessTokenAndIdToken: any;

  user: any = null;
  mounted() {
    this.fetchAccessTokenAndIdToken();
  }
  save() {
    console.log("i couldnt save my wift");
  }
  login() {
    const redirectUri = "http://192.168.0.2:8080/edit";
    const responseType = "token+id_token";
    const scope = ["openid", "user_subscriptions", "user_read"].join(" ");
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${
      this.clientId
    }&redirect_uri=${redirectUri}&&response_type=${responseType}&scope=${scope}`;

    window.location.replace(url);
  }
}
</script>
<style scoped>
.editor {
  min-height: 200px;
  border: 1px solid blueviolet;
}
</style>