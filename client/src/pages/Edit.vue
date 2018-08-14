<template>
  <div class="container">
    <div class="header">
      <button v-on:click="back">뒤로 가기</button>
      <button class="save" v-on:click="save">저장하기</button>
    </div>
    <div ref="editor" class="editor" contenteditable="true" @input="onUpdateContent"></div>
    <div class="bottom">
      <EmoteInputComponent :clickEmote="onClickEmote"/>
      <button v-on:click="openEmoteSyncPage">사용가능한 새 이모티콘 가져오기</button>
    </div>
  </div>
</template>

<script lang="ts">
// 에디터는 어떤 기능이 들어가야 하는가?
//     1. 글 쓸 수 있어야 함.
//     2. 이모티콘 넣을 수 있어야 하고
//     3. 사진 넣을 수 있어야 하고요 - Optional
import { Component, Vue } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import EmoteInputComponent from "@/components/EmoteInput.vue";
import { TWITCH_APP_CLIENT_ID } from "../api/twitchApi";
import { savePost } from "../api/backendApi";

declare var Twitch: any;

@Component({
  components: {
    EmoteInputComponent
  }
})
export default class Edit extends Vue {
  @State("extensionAuth") extensionAuth!: ExtensionAuth;

  @Action("changePage") changePage: any;
  @Action("fetchEmotesAvailable") fetchEmotesAvailable: any;

  $refs!: {
    editor: HTMLDivElement;
  };

  content: string = "";

  onUpdateContent(event) {
    this.content = event.target.innerText;
  }
  back() {
    this.changePage("ViewPage");
  }
  async save() {
    await savePost(this.extensionAuth.token, this.content);
    this.changePage("ViewPage");
  }
  openEmoteSyncPage() {
    const redirectUri = "http://192.168.0.2:8090";
    const responseType = "token+id_token";
    const scope = ["openid", "user_subscriptions", "user_read"].join(" ");
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_APP_CLIENT_ID}&redirect_uri=${redirectUri}&&response_type=${responseType}&scope=${scope}`;
    window.open(url);
  }
  onClickEmote(emote: Emote) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const imageTag = document.createElement("img");
    imageTag.src = emote.url;
    imageTag.onclick = this.onEmoteImageClick.bind(this);

    range.insertNode(imageTag);
    range.setStartAfter(imageTag);
    range.setEndAfter(imageTag);

    this.$refs.editor.focus();
  }
  onEmoteImageClick(event: MouseEvent) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const { srcElement, clientX } = event;
    if (!srcElement) {
      console.log("no srcElement");
      return;
    }

    const { left, width } = srcElement.getBoundingClientRect();
    const isLeft = clientX - left < width / 2;
    console.log(isLeft);

    if (isLeft) {
      range.setStartBefore(srcElement);
      range.setEndBefore(srcElement);
    } else {
      range.setStartAfter(srcElement);
      range.setEndAfter(srcElement);
    }
  }
}
</script>
<style scoped>
.editor {
  height: 320px;
  overflow-y: auto;
  border: 1px solid blueviolet;
  border-radius: 7px;
  padding: 5px;
  box-sizing: border-box;
}
.editor:focus {
  outline: 0;
}
.header {
  height: 30px;
}
.save {
  float: right;
}
.bottom {
  overflow-y: auto;
  overflow-x: hidden;
  height: 150px;
  text-align: center;
}
</style>