<template>
  <div class="container">
    <div class="header">
      <button v-on:click="back">뒤로 가기</button>
      <button v-on:click="onClickAddImageButton">
        <input type="file" ref="imageFileInput" accept="image/*" style="display:none" @change="onImageFileUpload">
        <font-awesome-icon icon="image" /> 사진 추가
      </button>
      <button class="save" v-on:click="save">저장하기</button>
    </div>
    <div ref="editor" class="editor" contenteditable="true"></div>
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
import compressImage from '../utils/compressImage';

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

  readonly PAGE_WIDTH = 500;
  readonly IMAGE_MARGIN = 10;

  $refs!: {
    editor: HTMLDivElement;
    imageFileInput: HTMLInputElement;
  };

  textReplaceMap: {[text: string]: string} = {};
  compressingJobs: Promise<any>[] = [];

  back() {
    this.changePage("ViewPage");
  }
  async save() {
    await Promise.all(this.compressingJobs);
    const content = this.replaceAll(this.$refs.editor.innerHTML);
    try {
      await savePost(this.extensionAuth.token, content);
      this.changePage("ViewPage");
    } catch(err) {
      alert(`다음과 같은 이유로 글을 저장하지 못하였습니다. - ${err}`);
      console.error(err);
    }
  }
  openEmoteSyncPage() {
    const redirectUri =
      "http://twitch-channel-feed-emote-sync-page.s3-website.ap-northeast-2.amazonaws.com";
    const responseType = "token+id_token";
    const scope = ["openid", "user_subscriptions", "user_read"].join(" ");
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_APP_CLIENT_ID}&redirect_uri=${redirectUri}&&response_type=${responseType}&scope=${scope}`;
    window.open(url);
  }
  onClickEmote(emote: Emote) {
    const imageTag = document.createElement("img");
    imageTag.src = emote.url;
    imageTag.className = "emote-image";

    this.addHtmlElement(imageTag);
  }
  onClickAddImageButton() {
    this.$refs.imageFileInput.click();
  }
  async onImageFileUpload(event: Event) {
    const files = this.$refs.imageFileInput.files;
    if (!files || !files[0]) {
      return;
    }

    const file = files[0];

    const url = window.URL.createObjectURL(file);

    const iamgeMaxWidth = this.PAGE_WIDTH - (2 * this.IMAGE_MARGIN);

    const compressingJob = compressImage(file, iamgeMaxWidth);
    this.compressingJobs.push(compressingJob);
    compressingJob.then((compressedImageBase64) => {
      this.textReplaceMap[url] = compressedImageBase64;
    });

    const imageTag = document.createElement('img');
    imageTag.src = url;
    imageTag.className = 'uploaded-image';

    this.addHtmlElement(imageTag);
  }
  addHtmlElement(element: HTMLElement) {
    this.$refs.editor.focus();
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    range.insertNode(element);
    range.setStartAfter(element);
    range.setEndAfter(element);

    this.$refs.editor.focus();
  }
  replaceAll(content: string): string {
    return Object.entries(this.textReplaceMap).reduce((prev, [sourceText, destText]) => {
      return prev.replace(sourceText, destText);
    }, content);
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
  display: flex;
  justify-content: space-between;
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
<style>
.emote-image {
  pointer-events: none;
}
.uploaded-image {
  display: block;
  max-width: calc(100% - 20px);
  margin: 10px;
}
</style>
