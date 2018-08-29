import { JsonNode, TextJsonNode, ElementJsonNode } from '@/components/JsonNode';

export default function toJsonNodeFromString(value: string): JsonNode {
  const parsed = JSON.parse(value);
  const jsonNode = toJsonNodeFromObject(parsed);
  return jsonNode;
}

function toJsonNodeFromObject(object: JsonNode): JsonNode {
  switch (object.nodeType) {
    case Node.ELEMENT_NODE:
      {
        const elementJsonNode = object as ElementJsonNode;
        const children = elementJsonNode.children.map(child => toJsonNodeFromObject(child));
        return ElementJsonNode.createFromObject(elementJsonNode, children);
      }
    case Node.TEXT_NODE:
      {
        const textJsonNode = object as TextJsonNode;
        return new TextJsonNode(object.nodeType, textJsonNode.text);
      }
    default:
      {
        throw new Error(`unable to parse object : ${JSON.stringify(object)}`);
      }
  }
}