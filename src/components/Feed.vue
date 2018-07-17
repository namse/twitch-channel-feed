<template>
  <div class="container">
    <header>
      <img class="profile-image" v-bind:src="feed.profilePictureUrl"/>
      <div class="username-date-container">
        <h5 class="username">{{feed.username}}</h5>
        <span class="date">{{feed.date}}</span>
      </div>
    </header>
    <div class="content">{{feed.content}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Feed } from "@/store";

@Component
export default class FeedComponent extends Vue {
  @Prop() private feed!: Feed;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
.profile-image {
  height: 40px;
  width: 40px;
  margin-right: 8px;
  float: left;
}
.username-date-container {
  width: 100%;
  height: 40px;
}
.username {
  font-size: 14px;
  font-weight: normal;
  line-height: 1.38;
  margin-top: 0px;
  margin-bottom: 2px;
}
.date {
  font-size: 12px;
}
.content {
  overflow-wrap: break-word;
}
</style>
