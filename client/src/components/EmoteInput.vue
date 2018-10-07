<template>
  <div class="container">
    <div v-if="Object.keys(emotesMap).length === 0">
      아직 동기화된 이모티콘이 없습니다.<br/>
      <br/>
      <strong>--이모티콘 동기화 하는 방법--</strong><br/>
      왼쪽 아래 'ChannelFeed' -> '구성' -><br/> '사용가능한 이모티콘 동기화하기' 버튼 클릭<br/>
      <br/>
      위 방법을 따라하시면 평소 사용하시던 이모티콘을<br/>
      채널피드에도 사용할 수 있습니다. 감사합니다!</div>
    <div class="emote-picker-block" v-for="emotes in emotesMap" :key="emotes[0].emoteSetId">
      <div class="emote-picker-container tooltip-wrapper" v-for="emote in emotes" :key="emote.id">
        <button class="emote-picker-button" v-on:click="clickEmote(emote)">
          <img class="emote-picker-image" :src="emote.url"/>
        </button>
        <span class="tooltip-text">{{emote.regex}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./EmoteInput.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  width: 100%;
}
.emote-picker-block {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  border-bottom: 1px solid #2c2541;
}
.emote-picker-container {
  width: 2.3rem;
  height: 2.3rem;
}

.emote-picker-button {
  width: 2.2rem;
  height: 2.2rem;

  background-color: rgba(75, 54, 124, 0.2);
  cursor: pointer;
  cursor: pointer;
  justify-content: center !important;
  align-items: center !important;
  display: flex !important;
  background-position: 50%;
  background-repeat: no-repeat;
  border: none;
  background: none;
  border-radius: 0;
  color: inherit;
  font: inherit;
  text-align: inherit;
}

.emote-picker-image {
  max-height: 2.2rem;
  width: 100%;
}

.tooltip-wrapper {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip-wrapper .tooltip-text {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-wrapper .tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
