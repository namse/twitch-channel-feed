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
// import compressImage from '../utils/compressImage';
import uploadMedia from '../utils/uploadMedia';
import toJsonNodeFromHTMLElement from "../../../markup/src/components/toJsonNodeFromHTMLElement";

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

  elementReplaceMap: { source: HTMLElement, dest: HTMLElement }[] = [];
  compressingJobs: Promise<any>[] = [];

  back() {
    this.changePage("ViewPage");
  }
  async save() {
    await Promise.all(this.compressingJobs);

    this.replaceMediaIntoUploadAll();

    const jsonNode = toJsonNodeFromHTMLElement(this.$refs.editor);
    const content = JSON.stringify(jsonNode);

    try {
      await savePost(this.extensionAuth.token, content);
      this.changePage("ViewPage");
    } catch(err) {
      alert(`다음과 같은 이유로 글을 저장하지 못하였습니다. - ${err}`);
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
    const tempUrl = URL.createObjectURL(file);

    const tempMediaElement = this.createMediaElement(tempUrl, file.type);

    const compressingJob = uploadMedia(this.extensionAuth.token, file);
    this.compressingJobs.push(compressingJob);

    compressingJob.then(({ url, mime }) => {
      const uploadedMediaElement = this.createMediaElement(url, mime);

      this.elementReplaceMap.push({
        source: tempMediaElement,
        dest: uploadedMediaElement,
      });
    });

    this.addHtmlElement(tempMediaElement);
  }
  createMediaElement(src, mime): HTMLElement {
    if (['image', 'video'].every((type) => !mime.startsWith(type))) {
      alert(`잘못된 파일 형식입니다(${mime}).`);
      throw new Error('uplload only image or video file please');
    }
    const mediaElement = mime.startsWith('image')
        ? this.createImageElement(src)
        : this.createVideoElement(src);

    return mediaElement;
  }
  createVideoElement(src): HTMLElement {
    const videoElement = document.createElement('video');
    videoElement.src = src;
    videoElement.loop = true;
    videoElement.autoplay = true;
    videoElement.className = 'uploaded-video';
    return videoElement;
  }
  createImageElement(src): HTMLElement {
    const imageElement = document.createElement('img');
    imageElement.src = src;
    imageElement.className = 'uploaded-image';
    return imageElement;
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
  replaceMediaIntoUploadAll() {
    this.elementReplaceMap.forEach(({ source, dest }) => {
      const { parentNode } =  source;
      if (!parentNode) {
        throw new Error(`no parent Node for ${source.innerHTML}`);
      }
      parentNode.replaceChild(dest, source);
    });
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
.uploaded-video {
  display: block;
  max-width: calc(100% - 20px);
  margin: 10px;
}
</style>
