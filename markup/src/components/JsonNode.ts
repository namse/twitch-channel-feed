export class JsonNode {
  constructor(public nodeType: number) { }
  public toHtmlString(): string {
    throw new Error('not implemented');
  }
}

export class ElementJsonNode extends JsonNode {
  constructor(
    nodeType: number,
    public tagName: string,
    public children: JsonNode[],
  ) {
    super(nodeType);
  }

  static createFromHtmlElement(element: HTMLElement, children: JsonNode[]): ElementJsonNode {
    const {
      nodeType,
      tagName,
    } = element;
    switch (tagName) {
      case 'IMG':
      case 'VIDEO':
        const mediaElement = element as HTMLImageElement | HTMLVideoElement;
        return new MediaElementJsonNode(nodeType, tagName, mediaElement.src, children);
      case 'SCRIPT':
        throw new Error('cannot include script tag');
      default:
        return new ElementJsonNode(nodeType, tagName, children);
    }
  }
  static createFromObject(object: ElementJsonNode, children: JsonNode[]): ElementJsonNode {
    const {
      nodeType,
      tagName,
    } = object;
    switch (tagName) {
      case 'IMG':
      case 'VIDEO':
        const mediaElement = object as MediaElementJsonNode;
        return new MediaElementJsonNode(nodeType, tagName, mediaElement.src, children);
      case 'SCRIPT':
        throw new Error('cannot include script tag');
      default:
        return new ElementJsonNode(nodeType, tagName, children);
    }
  }
  public toHtmlString(): string {
    const tag = this.tagName.toLowerCase();
    const childrenHtmlString = this.children.map(child => child.toHtmlString()).join('');
    return `<${tag}>${childrenHtmlString}</${tag}>`;
  }
}

export class MediaElementJsonNode extends ElementJsonNode {
  constructor(
    nodeType: number,
    public tagName: string,
    public src: string,
    children: JsonNode[],
  ) {
    super(nodeType, tagName, children);
  }
  public toHtmlString(): string {
    const tag = this.tagName.toLowerCase();
    const childrenHtmlString = this.children.map(child => child.toHtmlString()).join('');
    return `<${tag} src="${this.src}">${childrenHtmlString}</${tag}>`;
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
