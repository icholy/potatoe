#!/usr/bin/env python

import re, sys
from BeautifulSoup import BeautifulSoup, Tag

class Env(object):

    def __init__(self, parent = None):
        self.parent = parent
        self.values = {}

    def MakeChild(self):
        return Env(self)

    def GetValue(self, key, default = None):
        if key in self.values:
            return self.values[key]
        if self.parent:
            return self.parent.GetValue(key, default)
        return default

    def SetValue(self, key, value):
        self.values[key] = value

    def GetKeys(self):
        keys = set(self.values.keys())
        if self.parent:
            keys = keys.union(self.parent.GetKeys())
        return keys


def ProcessTag(root, styles = Env()):

    # we only want tags
    tags = [t for t in root.contents if type(t) is Tag]

    non_script_tags = []

    # first pass extracts the styles
    for tag in tags:
        if IsStyleScript(tag):
            ProcessStyleScript(tag, root, styles)
            tag.extract()
        else:
            non_script_tags.append(tag)

    # process the child tags
    for tag in non_script_tags:
        ApplyNamedStyles(tag, styles)
        ProcessTag(tag, styles.MakeChild())


def IsStyleScript(tag):
    return tag.name == "script" and tag.get("type") == "style"


def ProcessStyleScript(tag, parent, styles):
    style = tag.text
    if tag.has_key("name"):
        styles.SetValue(tag["name"], style)
    else:
        parent["style"] = style


def ApplyNamedStyles(tag, styles):
    if not tag.has_key("style"):
        return
    s = tag["style"]
    matches = list(re.finditer(r"@([\w\d]+);?", s))
    for m in reversed(matches):
        name = m.groups()[0]
        style = styles.GetValue(name, "")
        s = "".join((s[:m.start()], style, s[m.end():]))
    tag["style"] = s

if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("Usage: {0} <file>".format(sys.argv[0]))
        exit(1)

    filename = sys.argv[-1]
    soup = BeautifulSoup(open(filename))
    ProcessTag(soup)
    print(soup.prettify())
