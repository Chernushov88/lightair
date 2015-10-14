// Tabs
tab_count = 0;



function make_tab_group_of_tab(tab) {
  
  if (tab.tagName.toLowerCase() != 'h5') {
    return;
  }
  var tab_group_start = tab;
  var element = tab;
  var tab_group_navigation = new Element('ul');
  var current_tab = tab;
  var current_tab_content = null;
  var current_tab_container = null;
  var tab_container;
  var li = null;
  var a = null;
  var is_first_tab = true;
  
  while (!element.getParent().hasClass('mainslot')) {
    element = element.getParent();
  }
  
  if (element.belongs_to_tab_group != null) {
    return;
  }
  
  
  tab_group_navigation.addClass('tab-navigation');
  
  while (true) {
    element.belongs_to_tab_group = tab_group_start;
    
    if (!is_tab_end(element)) {
    if(current_tab_content != null)
            current_tab_content.push(element);
    }
    
    if (is_tab_end(element) || indicates_tab_group_end(element.getNext())) {
      if (current_tab_content != null) {
        current_tab_content.each(function(tab_content) {
          tab_content.injectInside(current_tab_container);
        });
        if (!is_first_tab) {
          current_tab_container.style.display = 'none';
        }
        current_tab_container.injectAfter(current_tab);
        is_first_tab = false;
        // console.log(current_tab_container.innerHTML);
      }
      current_tab = element;
      // current_tab.style.display = 'none';
      current_tab_content = new Array();
      current_tab_container = new Element('div');
      current_tab_container.addClass('tab-container');
      current_tab_container.id = 'tab-' + (++tab_count);
      // console.log(current_tab_container.id);
      
      if (current_tab.getElements('h5.tab').length > 0) {
        li = new Element('li');
        a = new Element('a');
        a.href = '#tab-' + tab_count;
        a.set('text', current_tab.get('text').replace(/\r?\n/g,""));
        a.injectInside(li);
        if (is_first_tab) {
          li.addClass('active');
        }
        li.injectInside(tab_group_navigation);
      }
    }
    
    element = element.getNext();
    if (indicates_tab_group_end(element)) {
      break;
    }
  }
  
  tab_group_navigation.injectBefore(tab_group_start);
}

function indicates_tab_group_end(element) {
  if (typeof(element) == 'undefined' || element == null) {
    // console.log('group end? undef or null!');
    return true;
  } else if (element.getElements('.tab-end').length > 0) {
    // console.log('group end? tab end');
    return true;
  }
  // console.log('group end? no');
  return false;
}

function is_tab_end(element) {
  if (element.getElements('h5.tab').length > 0) {
    return true;
  } else if (element.getElements('.tab-end').length > 0) {
    return true;
  }
  return false;
}

function tab_click() {
  // console.log(this);
  var li = this.getParent();
  var this_tab_content = $(this.hash.replace('#', ''));
  
  li.getParent().getElements('a').each(function(element) {
    var tab_content = $(element.hash.replace('#', ''));
    if (tab_content) {
      tab_content.style.display = 'none';
    }
    element.getParent().removeClass('active');
  });
  
  if (this_tab_content) {
    this_tab_content.style.display = 'block';
  }
  this.getParent().addClass('active');
  return false;
}

function apply_tabs() {
  $$('.tab').each(make_tab_group_of_tab);
  $$('h5.tab').setStyle('display', 'none');
  $$('ul.tab-navigation a').each(function(element) {
    element.onclick = tab_click;
  });
    try {
        window["fixTabParentsClass"]();
    }
    catch(err) {}
}

window.addEvent('domready', apply_tabs);