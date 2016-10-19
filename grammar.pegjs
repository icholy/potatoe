Tags
  = Tag*

Tag
  = _ name:Ident _ attributes:Attributes? _ "{" _ content:Content* _ "}" _ {

    function isStyle(item) {
      return item.type === "style";
    }

    function isChild(item) {
      return item.type === "tag" || item.type === "text";
    }

    return {
      type:       "tag",
      name:       name.value,
      attributes: attributes || [],
      styles:     content.filter(isStyle),
      children:   content.filter(isChild)
    };
  }
  
Content
  = Text
  / Tag
  / Style
  
Text
  = _ ">" text:[^;]* ";" {
    return {
      type:    "text",
      content: text.join("")
    };
  }
  
Style
  = _ name:Ident _ ":" _ value:[^;]+  _ ";" _ {
    return {
      type:  "style",
      name:  name.value,
      value: value.join("")
    };
  }

Attributes
  = "(" _ attributes:Attribute* _ ")" {
    return attributes;
  }
 
Attribute
  = _ name:Ident _ "=" _ "\"" value:[^\"]* "\"" _ {
    return {
      name:  name.value,
      value: value.join("")
    };
  }
  
Ident
  = [a-zA-Z$_-] [a-zA-Z0-9$_-]* {
      return {
        tag:   "ident",
        value: text()
      };
    }

_ "whitespace"
  = [ \t\n\r]*
