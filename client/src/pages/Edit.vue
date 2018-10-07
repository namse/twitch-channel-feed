<template>
  <div class='container'>
    <div class='header'>
      <button v-on:click='back'>뒤로 가기</button>
      <button v-on:click='onClickAddImageButton'>
        <input type='file' ref='imageFileInput' accept='image/*' style='display:none' @change='onImageFileUpload'>
        <font-awesome-icon icon='image' /> 사진 추가
      </button>
      <button class='save' v-on:click='save'>저장하기</button>
    </div>
    <div ref='editor' class='editor' contenteditable='true'></div>
    <div class='bottom'>
      <EmoteInputComponent :clickEmote='onClickEmote'/>
    </div>
  </div>
</template>

<script lang='ts' src="./Edit.ts">
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
