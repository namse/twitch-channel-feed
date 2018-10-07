import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class ModalComponent extends Vue {
  @Prop() title!: string;
  @Prop() message!: string;
  @Prop() isOpen!: boolean;

  htmlContent: string = '';

  @Emit()
  confirm() {
    console.log(this.isOpen);
    return;
  }
  @Emit()
  cancel() {
    return;
  }

}
