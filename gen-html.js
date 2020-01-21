class HtmlElement {
  constructor(){
    //HtmlElement can be two types: has a tag, optional attributes and content, OR a string value WITHOUT tag and attributes
    //arguments provided are converted to a json object to be loaded
    console.log('HtmlElement constructor', ...arguments)
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
        
        //if the object does not contain an attribute key, add an empty one
        if (!('attributes' in json)){
          json.attributes = {};
        }
      }
    } else {
      //case 2: there are three arguments: tag, attributes and content
      json.tag = arguments[0];
      json.attributes = arguments[1] || {};
      json.content = arguments[2] || '';
    }
    console.log('loading', json)
    
    //any attribute in json that is not tag, attribute or content will be moved to attributes
    for (let key in json){
      console.log(key)
      if (['tag', 'attributes', 'content'].indexOf(key) === -1){
        console.log('inside', key);
        json.attributes[key] = json[key];
        delete json[key];
      }
    }
    console.log('MODIFIED ', json)
    return this.load(json);
  }
  
  setAttribute(key, value){
    this.attributes[key] = value;
    return this;
  }
  
  appendChild(){
    //if the argument provided is an HtmlElement, it is appended as is
    //otherwise the HtmlElement constructor will be called using the same arguments as appendChild.
    //the newly created HtmlElement will then be appended.
    let element = (arguments[0] instanceof HtmlElement) ? arguments[0] : new HtmlElement(...arguments);
    this.content.push(element);
    
    return this;
  }

  load(json){
    //json: has four possible keys
    // tag - string
    // attributes - key/string value pairs
    // content - [json||string]
    // class - string - will be moved to attributes as class
    
    //start by processing content
    //if it is not an array, make it so
    let content;
 
    if (json.content instanceof Array){
      content = json.content;
    } else {
      if (json.content){
        content = [json.content];
      } else {
        content = [];
      }
    }

    this.content = content.map((element) => {
      if (typeof element === 'string'){
        return element;
      } else {
        return new HtmlElement(element)  
      }
    });
    this.tag = json.tag;
    this.attributes = json.attributes;

    return this;
  }
  
  toString(){
    let aAttributes = [];
    for (let key in this.attributes){
      aAttributes.push(`${key}="${this.attributes[key]}"`);
    }
    let content = this.content.map((contentItem) => {
      return contentItem.toString()
    }).join('')
    let sAttributes = (aAttributes.length === 0) ? '' : ' '+aAttributes.join(' ')
    let result = `<${this.tag}${sAttributes}>${content}</${this.tag}>`
    
    return result;
  }
}

class HtmlString extends HtmlElement {
  constructor(s){
    
  }
}

class HtmlTag extends HtmlElement {
  constructor(){
    if (arguments.length === 1){
      console.log('eee')
      super({
        tag: arguments[0]
      });
      console.log('fff')
    } else {
      super(...arguments);
    }
    this.type = 'tag';
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
// let he = new HtmlElement(heJson)
// he.appendChild(new HtmlElement({
//   'tag': 'span',
//   'content': 'Just some text here!'
// }))

class HtmlDocument {
  constructor(json){
    this.html = new HtmlTag('html');
    if (typeof json === 'undefined'){
      this.head = new HtmlTag('head');
      this.body = new HtmlTag('body');

      this.html.appendChild(this.head);
      this.html.appendChild(this.body);    
    } else {
      this.loadHtml(json)
    }
  }
  

  
  appendScript(content, place){
    if (typeof place === 'undefined'){
      place = this.head;
    }
    place.appendChild({
      'tag': 'script',
      'attributes': {
        'type': 'text/javascript'
      },
      content: content
    })
  }
  
  appendStyle(content, place){
    if (typeof place === 'undefined'){
      place = this.head;
    }
    place.appendChild({
      'tag': 'style',
      content: content
    })
  }
  
  toString(){
    let result = '<!DOCTYPE html>';
    result += this.html.toString();
    
    return result;
  }
}
/*
let hDoc = new HtmlDocument()
hDoc.html.setAttribute('lang', 'en');
hDoc.head
  .appendChild('meta', {
    'charset': 'UTF-8'
  })
  .appendChild('link', {
    rel: 'stylesheet',
    href: 'css/overview.css'
  })
  .appendChild('script', {
    src: 'https://kit.fontawesome.com/e5b76b1e14.js',
    crossorigin: 'anonymous'
  })
  .appendChild('title', null, 'FMTH22')

hDoc.appendScript('console.log("lalala")', hDoc.body)
hDoc.appendStyle('.bold { font-style: bold; }')
console.log(hDoc+'')
*/

let he2 = new HtmlElement({
  tag: 'html',
  lang: 'en',
  content: [{
    tag: 'div',
    class: 'question'
  }]
});


const questionOverview = (labelNr, difficultyString, qnl, qen, answer) => {
  return {
    tag: 'div',
    class: 'question',
    content: [{
      tag: 'div',
      class: 'question-header',
      content: [{
        tag: 'div',
        class: 'nr',
        content: labelNr
      },{
        tag: 'div',
        class: 'difficulty',
        content: difficultyString
      }]
    },{
      tag: 'div',
      class: 'question-text',
      content: [{
        tag: 'div',
        'data-language': 'nl',
        content: qnl
      },{
        tag: 'div',
        'data-language': 'en',
        content: qen        
      }]
    },{
      tag: 'div',
      class: 'answer',
      content: answer
    }]
  }
}

console.log(new HtmlElement(questionOverview('Vraag 1', '<diff>', 'Wat is de hoofdstad van Witrusland?', 'What is the capital of Belarus?', 'Minsk'))+'')
