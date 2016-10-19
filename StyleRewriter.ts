
import { Tag, Style } from "./Parser";
import { Sequence } from "./Sequence";

interface StyleClass {
  name: string;
  rule: string;
}

export class StyleRewriter {

  private sequence = new Sequence();
  private classMap = {} as { [rule: string]: string; };
  private output = "";
  private prefix = "poop_";

  getOutput(): string {
    return this.output;
  }

  replaceStyles(tags: Tag[]): void {
    for (let t of tags) {
      this.replaceTagStyles(t);
    }
  }

  private addClassAttribute(tag: Tag, classNames: string[]): void {
    if (classNames.length === 0) {
      return;
    }
    for (let a of tag.attributes) {
      if (a.name === "class") {
        a.value += classNames.join(" ");
        return;
      }
    }
    tag.attributes.push({
      name:  "class",
      value: classNames.join(" ")
    });
  }

  private replaceTagStyles(tag: Tag): void {
    let classNames = this.stylesToClassNames(tag.styles);
    tag.styles = [];
    this.addClassAttribute(tag, classNames);
    for (let child of tag.children) {
      if (child.type === "tag") {
        this.replaceTagStyles(child);
      }
    }
  }

  private write(s: string): void {
    this.output += s;
  }

  private styleToClass(style: Style): StyleClass {
    let rule = `${style.name}: ${style.value}`.replace(/\s+/g, "");
    let name = this.classMap[rule];
    if (!name) {
      name = this.prefix + this.sequence.next();
      this.classMap[rule] = name;
      this.write(`.${name} { ${rule}; }\n`);
    }
    return { name, rule };
  }

  private stylesToClassNames(styles: Style[]): string[] {
    let names = [] as string[];
    for (let s of styles) {
      let clazz = this.styleToClass(s);
      names.push(clazz.name);
    }
    return names;
  }

}
