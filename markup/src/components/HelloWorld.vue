<template>
  <div class="hello">
    <button v-on:click="onClick">do</button>
    <div ref="editor" class="editor" contenteditable="true"></div>
    <div class="content" v-html="htmlString"></div>
    <div class="content" v-html="htmlString2"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import toJsonNodeFromHTMLElement from '../../../client/src/JsonNode/toJsonNodeFromHTMLElement';
import toJsonNodeFromString from '../../../client/src/JsonNode/toJsonNodeFromString';

@Component
export default class HelloWorld extends Vue {
  $refs!: {
    editor: HTMLDivElement;
  };
  htmlString: string = '';
  htmlString2: string = '';
  onClick() {
    const jsonNode = toJsonNodeFromHTMLElement(this.$refs.editor);
    console.log(jsonNode);
    const jsonString = JSON.stringify(jsonNode);
    console.log(jsonString);
    this.htmlString = jsonNode.toHtmlString();

    const restoredJsonNode = toJsonNodeFromString(jsonString);
    console.log(restoredJsonNode);
    this.htmlString2 = restoredJsonNode.toHtmlString();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editor {
  height: 320px;
  overflow-y: auto;
  border: 1px solid blueviolet;
  border-radius: 7px;
  padding: 5px;
  box-sizing: border-box;
}
</style>
