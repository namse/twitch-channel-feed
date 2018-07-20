<template>
  <div class="container">
    <div class="editor" contenteditable="true">
    </div>
  </div>
</template>

<script lang="ts">
// 에디터는 어떤 기능이 들어가야 하는가?
//     1. 글 쓸 수 있어야 함.
//     2. 이모티콘 넣을 수 있어야 하고
//     3. 사진 넣을 수 있어야 하고요 - Optional
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
  }
})
export default class Edit extends Vue {
}
</script>
<style scoped>
.editor {
  min-height: 200px;
  border: 1px solid blueviolet;
}
</style>