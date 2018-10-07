import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class EmoteInputComponent extends Vue {
  @State('emotesMap') emotesMap!: EmotesMap;
  @Prop({ type: Function, default: undefined })
  clickEmote!: (emote: Emote) => void;
}
