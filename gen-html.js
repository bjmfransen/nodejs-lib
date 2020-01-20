class HtmlElement {
  constructor(){
    //HtmlElement can be two types: has a tag, optional attributes and content, OR a string value WITHOUT tag and attributes
    //arguments provided are converted to a json object to be loaded
    let json = {};
    if (arguments.length === 1){
      //case 1: one argument is provided
      if (typeof arguments[0] === 'string'){
        //the argument is of type string => that string is the content; no tags/attributes
        json.tag = '';
        json.attributes = {};
        json.content = arguments[0] || '';
      } else {
        //the argument is not a string so it must be a hash => load it
        json = arguments[0];
      }
    } else {
      //case 2: there are three arguments: tag, attributes and content
      json.tag = arguments[0];
      json.attributes = arguments[1] || {};
      json.content = arguments[2] || '';
    }

    return this.load(json);
  }

  load(json){
    //json: has three keys
    // tag - string
    // attributes - key/string value pairs
    // content - [json||string]
    
    //start by processing content
    //if it is not an array, make it so
    let content;
    console.log('LOAD', json.content, json.content instanceof Array)
    if (json.content instanceof Array){
      content = json.content;
    } else {
      if (json.content){
        content = [json.content];
        console.log('has content', content)
      } else {
        content = [];
        console.log('no content', content)
      }
    }

    console.log(content)

    this.content = content.map((element) => {
      if (typeof element === 'string'){
        return element;
      } else {
        return new HtmlElement(element)  
      }
    }).join('');
    this.tag = json.tag;
    this.attributes = json.attributes;

    return this;
  }
  
  toString(){
    let aAttributes = [];
    for (let key in this.attributes){
      aAttributes.push(`${key}="${this.attributes[key]}"`);
    }
    
    let result = `<${this.tag} ${aAttributes.join(' ')}>${this.content}</${this.tag}>`
    
    return result;
  }
}
let heJson = {
  'tag': 'div',
  'attributes': {
    'class': 'brown bold',
    'id': '1234'
  },
  'content': [
    'some string!',
    {
      'tag': 'b',
      'content': 'text in BOLD'
    }
  ]
}
// let he = new HtmlElement('div', { 'class': 'brown bold', 'id': '1234' }, 'dadadd');
let he = new HtmlElement(heJson)
console.log(he.toString())
