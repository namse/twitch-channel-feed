<template>
  <div class="view">
    <button
      v-if="isOwner"
      v-on:click="changePage('EditPage')"
    >Post New Channel Feed</button>
    <div v-for="(feed, index) in feeds" :key="index">
      <FeedComponent :feed="feed"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FeedComponent from "@/components/Feed.vue";
import { State, Action } from "vuex-class";

@Component({
  components: {
    FeedComponent
  }
})
export default class ViewPage extends Vue {
  @Action("changePage") changePage: any;

  @State("feeds") feeds!: Feed[];
  @State("isOwner") isOwner!: boolean;
}
</script>
<style>
.view {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
</style>
