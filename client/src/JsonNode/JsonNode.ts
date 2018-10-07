export class JsonNode {
  constructor(public nodeType: number) { }
  public toHtmlString(): string {
    throw new Error('not implemented');
  }
}

const ClassNameFilter = [
  'emote-image',
  'uploaded-image',
  'uploaded-video',
  'editor',
];

export class ElementJsonNode extends JsonNode {
  static createFromHtmlElement(element: HTMLElement, children: JsonNode[]): ElementJsonNode {
    const {
      nodeType,
      tagName,
      className,
    } = element;
    switch (tagName) {
      case 'IMG':
        const imageElement = element as HTMLImageElement;
        return new MediaElementJsonNode(nodeType, tagName, className, imageElement.src, children);
      case 'VIDEO':
        const videoElement = element as HTMLVideoElement;
        return new VideoElementJsonNode(nodeType, tagName, className, videoElement.src, children);
      case 'SCRIPT':
        throw new Error('cannot include script tag');
      default:
        return new ElementJsonNode(nodeType, tagName, className, children);
    }
  }
  static createFromObject(object: ElementJsonNode, children: JsonNode[]): ElementJsonNode {
    const {
      nodeType,
      tagName,
      className,
    } = object;
    switch (tagName) {
      case 'IMG':
        const mediaElementJsonNode = object as MediaElementJsonNode;
        return new MediaElementJsonNode(nodeType, tagName, className, mediaElementJsonNode.src, children);
      case 'VIDEO':
        const videoElementJsonNode = object as VideoElementJsonNode;
        return new VideoElementJsonNode(nodeType, tagName, className, videoElementJsonNode.src, children);
      case 'SCRIPT':
        throw new Error('cannot include script tag');
      default:
        return new ElementJsonNode(nodeType, tagName, className, children);
    }
  }
  constructor(
    nodeType: number,
    public tagName: string,
    public className: string,
    public children: JsonNode[],
  ) {
    super(nodeType);
  }
  public toHtmlString(): string {
    const tag = this.tagName.toLowerCase();
    const childrenHtmlString = this.children.map(child => child.toHtmlString()).join('');
    return `<${tag} ${this.attributeString()}>${childrenHtmlString}</${tag}>`;
  }

  public attributeString(): string {
    return this.classNameHtml ? `class="${this.classNameHtml}"` : '';
  }

  get classNameHtml(): string {
    if (!this.className || !this.className.length) {
      return '';
    }
    if (ClassNameFilter.includes(this.className)) {
      return this.className;
    }
    throw new Error(`have wrong className ${this.className}`);
  }
}

export class MediaElementJsonNode extends ElementJsonNode {
  constructor(
    nodeType: number,
    tagName: string,
    className: string,
    public src: string,
    children: JsonNode[],
  ) {
    super(nodeType, tagName, className, children);
  }

  public attributeString(): string {
    return `${super.attributeString()} src="${this.src}"`;
  }
}

export class VideoElementJsonNode extends MediaElementJsonNode {
  public attributeString(): string {
    return `${super.attributeString()} autoplay loop muted src="${this.src}"`;
  }
}

export class TextJsonNode extends JsonNode {
  constructor(
    nodeType: number,
    public text: string,
  ) {
    super(nodeType);
    this.text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  public toHtmlString(): string {
    return this.text;
  }
}
