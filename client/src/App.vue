<template>
  <div id="app">
    <button
      v-if="isOwner"
      v-on:click="changePage('EditPage')"
    >Post New Channel Feed</button>
    <component :is="currentPage" />
  </div>
</template>

<script lang="ts">
import EmotesComponent from "@/components/Emotes.vue";
import { Component, Vue } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import ViewPage from "@/pages/View.vue";
import EditPage from "@/pages/Edit.vue";

declare var Twitch: any;

@Component({
  components: {
    ViewPage,
    EditPage
  }
})
export default class App extends Vue {
  @Action("saveExtensionAuth") saveExtensionAuth: any;
  @Action("changePage") changePage: any;

  @State("currentPage") currentPage!: string;
  @State("isOwner") isOwner!: boolean;

  created() {
    Twitch.ext.onAuthorized(auth => {
      this.saveExtensionAuth(auth);
    });
  }
}
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #ffffff;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #ffffff;
  }
}
</style>
