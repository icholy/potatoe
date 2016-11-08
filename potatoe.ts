
import * as fs from "fs";
import * as yargs from "yargs";
import { Generator } from "./Generator";
import { Tag, parse } from "./Parser";
import { StyleRewriter } from "./StyleRewriter";

let argv = yargs.usage("Usage: $0 [file]")
                .demand(1, "please supply a filename")
                .argv;

let filename = argv["_"][0];

fs.readFile(filename, (err, data) => {
  if (err) {
    throw err;
  }

  // parse it
  let tags = parse<Tag[]>(data.toString(), { startRule: "Tags" });

  // convert inline styles to classes
  let rewriter = new StyleRewriter();
  rewriter.replaceStyles(tags);
  let css = rewriter.getOutput();

  // add style tag to tree
  tags.unshift({
    type:       "tag",
    name:       "style",
    attributes: [{ name: "type", value: "text/css" }],
    styles:     [],
    children:   [{ type: "text", content: css }]
  });

  // convert to html
  let gen = new Generator();
  gen.tags(tags);
  let html = gen.getOutput();

  console.log(html);
});
