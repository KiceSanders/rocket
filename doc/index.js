rocket.ready(function() {
  var $ = rocket.extend(rocket.$, rocket);
  
  for (var name in docs) {
    if (name.substr(-1) === '_') {
      delete docs[i];
    } else {
      for (var i = docs[name].children.length - 1; docs[name].children[i]; --i) {
        if (docs[name].children[i].substr(-1) === '_') {
          docs[name].children.splice(i, 1);
        }
      }
    }
  }
  
  var lex = function(parent, code) {
    var pre = $.createElement('pre').style(style.code);
    var results = rocket.lexeme(code);
    for(var j = 0; results[j]; ++j){
      var span = $.createElement('span');
      if (style[results[j].type]) {
        span.style(style[results[j].type]);
      }
      span.innerHTML($.htmlEntities(results[j].value));
      pre.appendChild(span);
    }
    parent.appendChild(pre);
  };

  var style = {};
  
  style.font_family = 'consolas,"courier new",monospace';
  style.font_size = 12;
  style.legend = {
    'font-weight': 'bold', 
    'color': '#000088'
  };
  style.human = {
    'margin': 10,
    'padding': 10,
    'background-color': '#F8F8F8',
    'font-family': 'helvetica'
  };
  style.type = {
    'color': '#888888',
    'font-style': 'italic'
  };
  style.fieldset = {
    'border': '1px solid #CCCCCC', 
    'margin-bottom': 10
  };
  style.code = {
    'font-family': style.font_family,
    'padding': 10
  };
  style.comment = {
    'color': 'green'
  };
  style.word = {
    'color': 'blue',
    'font-style': 'italic'
  };
  style.string = {
    'color': 'gray'
  };
  style.number = {
    'color': 'red'
  };
  style.regexp = {
    'color': 'purple'
  };
  style.operator = {
    'font-size': 13
  };
    
  var left = function(name) {
    this.name = name;
  };
  left.prototype.link = function(parent, name) {
    var div = $.createElement('div');
    div.style({'cursor': 'pointer'});
    div.innerHTML(name.replace(docs[name].parent,'').replace('prototype.', '').replace(/^\./, ''));
    div.addClass('name').dataset('name', name);
    parent.appendChild(div);
  };
  left.prototype.render = function(parent) {
    var fieldset = $.createElement('fieldset').style(style.fieldset);
    var legend = fieldset.appendChild($.createElement('legend').style(style.legend).innerHTML(this.legend));
    this.render_links(fieldset);
    if (fieldset.children().length > 1) {
      parent.appendChild(fieldset);
    }
  };
  left.prototype.render_links = function(parent) {
    if (docs[this.name].children.length) {
      var name = this.name;
    } else {
      var name = docs[this.name].parent;
    }
    for (var i = 0; docs[name].children[i]; ++i) {
      this.render_link(parent, docs[docs[name].children[i]]);
    }
  };
  
  left.test_runner = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.test_runner, left);
  left.test_runner.prototype.legend = 'Test Runner';
  left.test_runner.prototype.render_links = function(parent) {
    parent.appendChild($.createElement('div').addClass('name,test_runner').dataset('name',this.name).style({'cursor':'pointer'}).innerHTML(this.name));
  };
  
  left.parents = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.parents, left);
  left.parents.prototype.legend = 'Parents';
  left.parents.prototype.render_links = function(parent) {
    var i = this.name;
    while(i = docs[i].parent){
      this.link(parent, i);
    }
  };
  
  left.namespaces = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.namespaces, left);
  left.namespaces.prototype.legend = 'Namespaces';
  left.namespaces.prototype.render_link = function(parent, child) {
    if (child.type === 'namespace') {
      this.link(parent, child.name);
    }
  };
    
  left.interfaces = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.interfaces, left);
  left.interfaces.prototype.legend = 'Interfaces';
  left.interfaces.prototype.render_link = function(parent, child) {
    if (child.type === 'interface') {
      this.link(parent, child.name);
    }
  };
   
  left.classes = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.classes, left);
  left.classes.prototype.legend = 'Classes';
  left.classes.prototype.render_link = function(parent, child) {
    if (child.type === 'constructor') {
      this.link(parent, child.name);
    }
  };
    
  left.statics = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.statics, left);
  left.statics.prototype.legend = 'Static Properties';
  left.statics.prototype.render_link = function(parent, child) {
    if (child.type === 'static') {
      this.link(parent, child.name);
    }
  };
    
  left.prototypes = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.prototypes, left);
  left.prototypes.prototype.legend = 'Prototype Properties';
  left.prototypes.prototype.render_link = function(parent, child) {
    if (child.type === 'prototype') {
      this.link(parent, child.name);
    }
  };
  
  
  var contents = function(name) {
    this.name = name;
  };
  contents.prototype.render = function(parent) {
    var fieldset = $.createElement('fieldset').style(style.fieldset);
    var legend = fieldset.appendChild($.createElement('legend').style(style.legend).innerHTML(this.legend));
    this.render_contents(fieldset);
    if (fieldset.children().length > 1) {
      parent.appendChild(fieldset);
    }
  };
  
  contents.description = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.description, contents);
  contents.description.prototype.legend = 'Description';
  contents.description.prototype.render_contents = function(parent) {
    parent.appendChild($.createElement('div').style(style.human).innerHTML(docs[this.name].description.replace(/\n\s*\n/g, '<br/><br/>') || '[todo]'));
  };
 
  contents['implements'] = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents['implements'], contents);
  contents['implements'].prototype.legend = 'Implements';
  contents['implements'].prototype.render_contents = function(parent) {
    if (docs[this.name].tags['implements']) {
      for (var i = 0; docs[this.name].tags['implements'][i]; ++i) {
        parent.appendChild($.createElement('div').innerHTML(docs[this.name].tags['implements'][i].type).addClass('name').dataset('name',docs[this.name].tags['implements'][i].type).style({'cursor':'pointer', 'margin': 10}));
      }
    }
  };
  
  contents['extends'] = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents['extends'], contents);
  contents['extends'].prototype.legend = 'Extends';
  contents['extends'].prototype.render_contents = function(parent) {
    if (docs[this.name].tags['extends']) {
      for (var i = 0; docs[this.name].tags['extends'][i]; ++i) {
        parent.appendChild($.createElement('div').innerHTML(docs[this.name].tags['extends'][i].type).addClass('name').dataset('name',docs[this.name].tags['extends'][i].type).style({'cursor':'pointer', 'margin': 10}));
      }
    }
  };
   
  contents.params = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.params, contents);
  contents.params.prototype.legend = 'Arguments';
  contents.params.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.param) {
      for (var i = 0; docs[this.name].tags.param[i]; ++i) {
        var div = $.createElement('div').style({'margin': 10});
        div.appendChild($.createElement('span').style({'font-weight': 'bold'}).innerHTML(docs[this.name].tags.param[i].name));
        div.appendChild($.createElement('span').style(style.type).style({'margin-left':10}).innerHTML($.htmlEntities(docs[this.name].tags.param[i].type)));
        parent.appendChild(div);
        parent.appendChild($.createElement('div').style(style.human).innerHTML(docs[this.name].tags.param[i].description || '[todo]'));
      }
    }
  };
  
  contents.returns = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.returns, contents);
  contents.returns.prototype.legend = 'Return Value';
  contents.returns.prototype.render_contents = function(parent) {
    if (docs[this.name].tags['return']) {
      for (var i = 0; docs[this.name].tags['return'][i]; ++i) {
        parent.appendChild($.createElement('div').style(style.type).style({'margin': 10}).innerHTML($.htmlEntities(docs[this.name].tags['return'][i].type)));
        parent.appendChild($.createElement('div').style(style.human).innerHTML(docs[this.name].tags['return'][i].description));
      }
    }
  };
   
  contents['final'] = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents['final'], contents);
  contents['final'].prototype.legend = 'Final';
  contents['final'].prototype.render_contents = function(parent) {
    if (docs[this.name].tags['final']) {
      parent.appendChild($.createElement('div').innerHTML('This method is final and cannot be overriden!'))
    }
  };
   
  contents.types = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.types, contents);
  contents.types.prototype.legend = 'Variable Type';
  contents.types.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.type) {
      for (var i = 0; docs[this.name].tags.type[i]; ++i) {
        parent.appendChild($.createElement('div').style(style.type).style({'margin': 10}).innerHTML($.htmlEntities(docs[this.name].tags.type[i])));
      }
    }
  };
   
  contents.examples = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.examples, contents);
  contents.examples.prototype.legend = 'Examples';
  contents.examples.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.example) {
      for (var i = 0; docs[this.name].tags.example[i]; ++i) {
        lex(parent, docs[this.name].tags.example[i]);
      }
    }
  };
   
  contents.source = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.source, contents);
  contents.source.prototype.legend = 'Source';
  contents.source.prototype.render_contents = function(parent) {
    parent.appendChild($.createElement('a').setAttribute({
      'href': '../src/' + docs[this.name].file_name
    }).innerHTML('Download'));
    if (docs[this.name].source) {
      lex(parent, docs[this.name].source);
    }
  };

  contents.tests = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.tests, contents);
  contents.tests.prototype.legend = 'Unit Tests';
  contents.tests.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.test) {
      for (var i = 0; docs[this.name].tags.test[i]; ++i) {
        var test = eval(docs[this.name].tags.test[i].code);
        var result = eval('('+docs[this.name].tags.test[i].result+')');
        var pass = $.equal(test, result);
        var container = $.createElement('div').style({'padding': 10});
        var description = (docs[this.name].tags.test[i].description ? (' ('+docs[this.name].tags.test[i].description+')') : '');
        container.appendChild($.createElement('div').style(style.type).innerHTML('Test # ' + (i + 1) + description));
        lex(container, docs[this.name].tags.test[i].code);
        container.appendChild($.createElement('div').style(style.type).innerHTML('Result'));
        if (pass) {
          lex(container, docs[this.name].tags.test[i].result);
        } else {
          lex(container, $.JSON.stringify(test));
          container.style({'background-color': 'red'});
          container.appendChild($.createElement('div').style(style.type).innerHTML('Expected'));
          lex(container, $.JSON.stringify(result));
        }
        parent.appendChild(container);
      }
    }
  };
   
  contents.sees = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.sees, contents);
  contents.sees.prototype.legend = 'Related';
  contents.sees.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.see) {
      for (var i = 0; docs[this.name].tags.see[i]; ++i) {
        parent.appendChild($.createElement('div').style({'cursor':'pointer','margin':10}).addClass('name').dataset('name',docs[this.name].tags.see[i].type).innerHTML(docs[this.name].tags.see[i].type));
      }
    }
  };
   
  contents.links = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.links, contents);
  contents.links.prototype.legend = 'Links';
  contents.links.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.link) {
      for (var i = 0; docs[this.name].tags.link[i]; ++i) {
        parent.appendChild($.createElement('div').style({'margin':10})).appendChild($.createElement('a').setAttribute({'href':docs[this.name].tags.link[i].href}).innerHTML(docs[this.name].tags.link[i].name));
      }
    }
  };
    
  contents.statics = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.statics, contents);
  contents.statics.prototype.legend = 'Static Properties';
  contents.statics.prototype.render_contents = function(parent) {
    for (var i = 0; docs[this.name].children[i]; ++i) {
      var child = docs[docs[this.name].children[i]];
      if (child.type === 'static') {
        parent.appendChild($.createElement('div').innerHTML(child.name + '(' + child.parameters.join(', ') + ')').addClass('name').dataset('name',child.name).style({'cursor':'pointer'}));
        parent.appendChild($.createElement('div').style(style.human).innerHTML(child.summary || '[todo]'));
      }
    }
  };
     
  contents.prototypes = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.prototypes, contents);
  contents.prototypes.prototype.legend = 'Prototype Properties';
  contents.prototypes.prototype.render_contents = function(parent) {
    for (var i = 0; docs[this.name].children[i]; ++i) {
      var child = docs[docs[this.name].children[i]];
      if (child.type === 'prototype') {
        parent.appendChild($.createElement('div').innerHTML(child.parent + ' -> ' + child.title + '(' + child.parameters.join(', ') + ')').addClass('name').dataset('name',child.name).style({'cursor':'pointer'}));
        parent.appendChild($.createElement('div').style(style.human).innerHTML(child.summary || '[todo]'));
      }
    }
  };
  
  
  var layer = function(name) {
    this.name = document.title = name && name.split('/')[0] || 'rocket';
    this.test_runner = name.split('/')[1];
  };
  layer.previous_layer;
  layer.prototype.name;
  layer.prototype.render = function() {
    window.location.hash = '#' + this.name + (this.test_runner ? '/test_runner' : '');

    var table = $.table(2, 2).setAttribute({'cellspacing': 1, 'cellpadding': 10}).style({'background-color': '#CCCCCC', 'height': '100%'});

    table.tbody.style({'font-family': style.font_family, 'font-size': style.font_size, 'background-color': 'white'});

    table.trs[1].removeChild(table.trs[1].tds[0]);
    table.trs[0].tds[0].setAttribute({'rowspan': 2});

    table.trs[0].tds[0].setAttribute({'width': 250, 'valign': 'top'});
    this.render_left(table.trs[0].tds[0]);

    table.trs[0].tds[1].setAttribute({'height': 30});
    this.render_header(table.trs[0].tds[1]);

    table.trs[1].tds[1].setAttribute({'valign': 'top'});
    
    if (this.test_runner) {
      this.render_test_runner(table.trs[1].tds[1]);
    } else {
      this.render_contents(table.trs[1].tds[1]);
    }

    if (layer.previous_layer) {
      $('body').replaceChild(table, layer.previous_layer);
    } else {
      $('body').appendChild(table);
    }

    $('body').scrollIntoView();
    
    layer.previous_layer = table;
  };
  layer.prototype.render_header = function(parent) {
    parent.appendChild($.createElement('div').style({'font-size':24, 'margin-left': 10, 'color': '#000088'}).innerHTML(this.name));
  };
  layer.prototype.render_left = function(parent) {
    
    (new left.test_runner(this.name)).render(parent);
    (new left.parents(this.name)).render(parent);
    (new left.namespaces(this.name)).render(parent);
    (new left.interfaces(this.name)).render(parent);
    (new left.classes(this.name)).render(parent);
    (new left.statics(this.name)).render(parent);
    (new left.prototypes(this.name)).render(parent);
  
  };
  layer.prototype.render_contents = function(parent) {
    
    var title;
    
    if (docs[this.name].type === 'namespace') {
      title = '';
    } else if (docs[this.name].type === 'constructor') {
      title = this.name;
    } else if (docs[this.name].type === 'interface') {
      title = this.name;
    } else if (docs[this.name].type === 'static') {
      title = this.name;
    } else if (docs[this.name].type === 'prototype') {
      title = docs[this.name].parent + ' -> ' + docs[this.name].title;
    }
    
    if (docs[this.name].lambda) {
      title += '(' + docs[this.name].parameters.join(', ') + ')';
    }

    if (title) {
      parent.appendChild($.createElement('div').style({'font-size': 14, 'font-weight': 'bold', 'margin': 10}).innerHTML(title));
    }

    (new contents.description(this.name)).render(parent);
    (new contents['implements'](this.name)).render(parent);
    (new contents['extends'](this.name)).render(parent);
    (new contents.params(this.name)).render(parent);
    (new contents.statics(this.name)).render(parent);
    (new contents.prototypes(this.name)).render(parent);
    (new contents.types(this.name)).render(parent);
    (new contents.returns(this.name)).render(parent);
    (new contents['final'](this.name)).render(parent);
    (new contents.sees(this.name)).render(parent);
    (new contents.examples(this.name)).render(parent);
    (new contents.links(this.name)).render(parent);
    (new contents.tests(this.name)).render(parent);
    (new contents.source(this.name)).render(parent);
  };
  layer.prototype.render_test_runner = function(parent) {
    (new test_runner(parent, this.name));
  };
  
  var test_runner = function(parent, this_name) {
    var total_pass = 0;
    var total_fail = 0;
    var total_total = 0;
    var total_start = $.now();
    for (var name in docs) {
      if (
        docs[name].tags.test &&
        (this_name === 'rocket' || docs[name].parent === this_name || name === this_name)
      ) {
        var container = $.createElement('div').style({'margin-top': 10}).addClass('name').dataset('name', name).style({'cursor': 'pointer'});
        container.appendChild($.createElement('div').style({'font-weight': 'bold'}).innerHTML(name));
        var pass = 0;
        var fail = 0;
        var total = 0;
        var start = $.now();
        for (var i = 0, test; test = docs[name].tags.test[i]; ++i) {
          try {
            if(this.test(container, name, test)){
              ++fail;
              ++total_fail;
            } else {
              ++pass;
              ++total_pass;
            }
          } catch (e) {
            ++fail;
            ++total_fail;
          }
          ++total;
          ++total_total;
        }
        this.print_results(container, pass, fail, total, start);
        parent.appendChild(container);
      }
    }
    var container = $.createElement('div').style({'margin-top': 10});
    container.appendChild($.createElement('div').style({'font-weight': 'bold'}).innerHTML('Total'));
    var results = $.createElement('div');
    this.print_results(results, total_pass, total_fail, total_total, total_start);
    container.appendChild(results);
    parent.appendChild(container);
  };
  test_runner.prototype.test = function(parent, name, test) {
    var result = eval(test.code);
    var expected = eval('('+test.result+')');
    if (rocket.equal(result, expected)) {
      return 0;
    } else {
      return 1;
    }
  };
  test_runner.prototype.print_results = function(parent, pass, fail, total, start) {
    var container = $.createElement('div');
    container.appendChild($.createElement('span').innerHTML('( '));
    container.appendChild($.createElement('span').style({'color':'green'}).innerHTML(pass + ' pass'));
    container.appendChild($.createElement('span').innerHTML(' / '));
    container.appendChild($.createElement('span').style({'color':'red'}).innerHTML(fail + ' fail'));
    container.appendChild($.createElement('span').innerHTML(' / '));
    container.appendChild($.createElement('span').innerHTML(total + ' total'));
    container.appendChild($.createElement('span').innerHTML(' / '));
    container.appendChild($.createElement('span').innerHTML($.numberFormat(((pass + fail) / total) * 100, 0, '', '') + ' % '));
    container.appendChild($.createElement('span').innerHTML(' in '));
    container.appendChild($.createElement('span').innerHTML($.numberFormat($.now() - start, 0, '', ',') + ' ms'));
    container.appendChild($.createElement('span').innerHTML(' )'));
    parent.appendChild(container);
  };
  
  
  $('html,body').style({'border': 0, 'margin': 0, 'height': '100%'});

  $(window).addEventListener('hashchange', function() {
    (new layer(window.location.hash.substr(1))).render();
  });

  $('body').live('div.name', 'click', function() {
    (new layer($(this).dataset('name') + ($(this).hasClass('test_runner') ? '/test_runner' : ''))).render();
  });
  
  (new layer(window.location.hash.substr(1))).render();

});

