
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
  let tags = parse<Tag[]>(data.toString(), { startRule: "Tags" });

  let rewriter = new StyleRewriter();
  rewriter.replaceStyles(tags);
  console.log(rewriter.getOutput());

  let gen = new Generator();
  gen.tags(tags);
  console.log(gen.getOutput());
});
