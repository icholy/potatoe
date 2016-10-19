
import { Tag, Attribute, Text, Style, Content } from "./Parser";

export interface Options {
  indent:  string;
  newline: string;
}

const defaults: Options = {
  indent:  "  ",
  newline: "\n"
};

export class Generator {

  private output = "";

  constructor(private options: Options = defaults) {}

  private write(s: string): void {
    this.output += s;
  }

  private newline(): void {
    this.write(this.options.newline);
  }

  private indent(level: number): void {
    for (let i = 0; i < level; i++) {
      this.write(this.options.indent);
    }
  }

  getOutput(): string {
    return this.output;
  }
  
  content(content: Content, level: number = 0): void {
    switch (content.type) {
      case "text":
        this.text(content, level);
        break;
      case "tag":
        this.tag(content, level);
        break;
    }
  }

  tags(tags: Tag[], level: number = 0): void {
    for (let t of tags) {
      this.content(t, level);
    }
  }

  tag(tag: Tag, level: number = 0): void {
    this.newline();
    this.indent(level);
    this.write(`<${tag.name}`);
    this.attributes(tag.attributes);
    this.attributes(this.stylesToAttributes(tag.styles));
    this.write(`>`);
    for (let c of tag.children) {
      this.content(c, level + 1);
    }
    this.newline();
    this.indent(level);
    this.write(`</${tag.name}>`);
  }

  text(text: Text, level: number = 0): void {
    this.newline();
    this.indent(level);
    this.write(`${text.content}`);
  }

  stylesToAttributes(styles: Style[]): Attribute[] {
    if (styles.length === 0) {
      return [];
    }
    let value = "";
    for (let s of styles) {
      value += `${s.name}: ${s.value};`;
    }
    return [{ name: "style", value: value }];
  }

  attributes(attributes: Attribute[]): void {
    for (let a of attributes) {
      this.write(` ${a.name}="${a.value}"`);
    }
  }

}
