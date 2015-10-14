var ImageGallery = new Class({
  _image_elements: null,
  _options: null,
  _overlay: null,
  _background: null,
  _image: null,
  _initialized: false,
  _hidden: false,
  _spinner: null,
  
  initialize: function(class_name, options) {
    this._options = Object.extend({
      pre_source_url: '',
      post_source_url: '',
      overlay_class: 'gallery-overlay',
      image_bg_class: 'gallery-background',
      image_class: 'gallery-image',
      top_offset: 30,
      spinner_url: null,
      spinner_width: 0,
      spinner_height: 0,
      preload: false
    }).extend(options || {});
    
    this._image_elements = $A($$('img.' + class_name));
    if (this._options.preload)
      this.preload();
    this.setup();
  },
  
  preload: function() {
    this._image_elements.each(function(image) {
      var url = this._options.pre_source_url + image.id + this._options.post_source_url;
      
      var preloaded_image = new Image(20, 20);
      preloaded_image.src = url;
    }, this);
    
    if (this._options.spinner_url) {
      this._spinner = new Image(this._options.spinner_width, this._options.spinner_height);
      this._spinner.url = this._options.spinner_url;
    }
  },
  
  setup: function() {
    this._image_elements.each(function(image) {
      image.onclick = this.show.bindWithEvent(this);
    }, this);
  },
  
  setup_elements: function() {
    this._overlay = new Element('div');
    this._overlay.addClass(this._options.overlay_class);
    this._overlay.onclick = this.hide.bindWithEvent(this);
    this._overlay.setStyles({
      position: 'absolute',
      width: '100%',
      display: 'none',
      top: '0',
      left: '0',
      'z-index': '9000'
    });

    var bodyElement = $$('body')[0];
    bodyElement.adopt(this._overlay, 'first');
    
    this._background = new Element('div');
    this._background.addClass(this._options.image_bg_class);
    this._background.onclick = this.hide.bindWithEvent(this);
    this._background.injectInside(this._overlay);
    
    this._spinner = new Element('img');
    this._spinner.src = this._options.spinner_url;
    this._spinner.setStyles({
      display: 'none'
    });
    this._spinner.injectInside(this._background);
    
    this._image = new Element('img');
    this._image.injectInside(this._background);
            
    this._initialized = true;
  },
  
  show: function(e) {
    var e = new Event(e);
    var image = e.target;
    var url = this._options.pre_source_url + image.id + this._options.post_source_url;
              
    if (!this._initialized) {
      // Create the gallery elements
      this.setup_elements();
    }
    
    this._overlay.setStyles({
      display: 'block',
      height: window.getScrollHeight() + 'px'
    });
    
    this._hidden = false;
    
    this._spinner.setStyles({
      display: 'block'
    });
    this.resize_and_center_background(this._options.spinner_width, this._options.spinner_height);
              
    this._image.setStyles({
     visibility: 'hidden'
    });
    this._image.onload = this.image_loaded.bindWithEvent(this);
    this._image.src = url;
  },
  
  resize_and_center_background: function(width, height) {
    var center_win = window.getHeight() / 2;
    var center_div = height / 2;
    var offset = center_win - center_div + window.getScrollTop();
    
    this._background.setStyles({
      'margin-top': offset + 'px',
      width: width + 'px',
      height: height + 'px',
      display: 'block'
    });
  },
  
  image_loaded: function(e) {
    if (!this._hidden) {
      this.resize_and_center_background(this._image.width, this._image.height);
      this._spinner.setStyles({
        display: 'none'
      });
      this._image.setStyles({
        visibility: 'visible'
      });
    }
  },
  
  hide: function() {
    this._overlay.setStyles({
      display: 'none',
      height: '0'
    });
    this._background.setStyles({
      display: 'none'
    });
    this._image.src = "";
    
    this._hidden = false;
  }
});

window.addEvent('domready', function() {
  post_source_url = typeof(GALLERY_LARGE_IMAGE_CONSTRAINTS) != 'undefined' ? '&image_constraints=' + GALLERY_LARGE_IMAGE_CONSTRAINTS : '';
  
  new ImageGallery('gallery', {
    pre_source_url: '/source.php?id=',
    post_source_url: post_source_url,
    spinner_url: '/img/spinner.gif',
    spinner_width: 200,
    spinner_height: 200
  });
});