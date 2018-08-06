<template>
  <div id="app">
    <!-- <ViewPage /> -->
    <EditPage />
  </div>
</template>

<script lang="ts">
import EmotesComponent from "@/components/Emotes.vue";
import { Component, Vue } from "vue-property-decorator";
import ViewPage from "@/pages/View.vue";
import EditPage from "@/pages/Edit.vue";

declare var Twitch: any;

@Component({
  components: {
    ViewPage,
    EmotesComponent,
    EditPage
  }
})
export default class App extends Vue {
  // created() {
  //   Twitch.ext.onAuthorized(auth => {
  //     console.log(auth);
  //     const tokenParts = auth.token.split('.');
  //     const json = JSON.parse(atob(tokenParts[1]));
  //     this.userId = json.user_id;
  //     this.channelId = auth.channelId;
  //     this.loadingFeeds(auth.channelId);
  //   });
  // }
}
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
