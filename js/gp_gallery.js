var gallery_animation_timer;
var gallery_current_object_id = 1;
var gallery_is_paused = false;
var gallery_image_size = null;

if (typeof(GALLERY_ANIMATION_INTERVAL) == 'undefined') {
  GALLERY_ANIMATION_INTERVAL = 5; // seconds
}
if (typeof(GALLERY_ANIMATION_LENGTH) == 'undefined') {
  GALLERY_ANIMATION_LENGTH = 1; // seconds
}
if (typeof(GALLERY_ANIMATION) == 'undefined') {
  GALLERY_ANIMATION = true;
}
if (typeof(GALLERY_LOOP_IMAGES) == 'undefined') {
  GALLERY_LOOP_IMAGES = true;
}

if (typeof(GALLERY_URL) == 'undefined') {
  GALLERY_URL = '';
}

function gallery_pause() {
  gallery_is_paused = true;
}
function gallery_pause_if_ie() {
  if (navigator.appName == "Microsoft Internet Explorer") {
    gallery_is_paused = true;
  }
}
function gallery_resume() {
  gallery_is_paused = false;
}

function gallery_changeToImage(obj, container) {
  if (container == null) {
    container = document.getElementById('gallery-main2');
    
    // The request is from a mouse click
    var secondary = document.getElementById('gallery-secondary');
    if (secondary.filters != null) {
      secondary.filters[0].Stop();
    }
    secondary.style.display = 'none';
  }
  
  var i;
  var newNode;
  
  if (gallery_image_size == null) {
    var primary_gallery_image = document.getElementById('gallery-main2').getElementsByTagName('img')[0];
    gallery_image_size = {x: primary_gallery_image.width, y: primary_gallery_image.height};
  }

  for (i = container.childNodes.length - 1; i >= 0; i--) {
    container.removeChild(container.childNodes[i]);
  }


//  for (i = 0; i < obj.childNodes.length; i++) {
    var thumb = obj.getElementsByTagName('img');
    var img = new Image();
    var constraints_policy = (gallery_image_size.x == 'undefined' || gallery_image_size.y == 'undefined' ) ? "" : "&image_constraints=" + gallery_image_size.x + "x" + gallery_image_size.y + "&constraint_policy=crop-center&q=j";
    img.src = GALLERY_URL + 'source.php?id=' + thumb[0].id + constraints_policy;
    if (constraints_policy != '') { 
      img.setAttribute("width", gallery_image_size.x);
      img.setAttribute("height", gallery_image_size.y);
    }
    img.id = thumb[0].id;
    container.appendChild(img);
//  }
  
  if (gallery_animation_timer) {
    clearTimeout(gallery_animation_timer);
  }
  if (animationTimer) {
    clearInterval(animationTimer);
  }
}

function gallery_transitionStart() {
  if (gallery_is_paused) {
    gallery_animation_timer = setTimeout(gallery_transitionStart, GALLERY_ANIMATION_INTERVAL * 1000);
    return;
  }
  
  var nextObjectId = gallery_current_object_id + 1;
  if (document.getElementById('gallery-thumb-'+nextObjectId) == null) {
    if (GALLERY_LOOP_IMAGES) {
      nextObjectId = 1;
    } else {
      return;
    }
  }
  gallery_current_object_id = nextObjectId;
  
  // Change to front-side image.
  document.getElementById('gallery-secondary').style.display = 'none';
  gallery_changeToImage(document.getElementById('gallery-thumb-'+nextObjectId), document.getElementById('gallery-secondary'));
  
  if (navigator.appName == "Microsoft Internet Explorer") {
            var majorVersion = navigator.appVersion.match(/MSIE (\d+)/)[1];
            if(majorVersion > 9)
                gallery_transition_moz(document.getElementById('gallery-main2'), document.getElementById('gallery-secondary'));
            else
    gallery_transition_ie(document.getElementById('gallery-main2'), document.getElementById('gallery-secondary'));
  }
  else {
    gallery_transition_moz(document.getElementById('gallery-main2'), document.getElementById('gallery-secondary'));
  }
}


/**
* Animation function for Internet Explorer.
*/
function gallery_transition_ie(sourceObj, targetObj) {
  targetObj.filters[0].Apply();
  targetObj.style.display = 'block';
  targetObj.filters[0].Play();
  setTimeout(gallery_transitionEnd, GALLERY_ANIMATION_LENGTH * 1000);
}


/**
* Animation function for Mozilla etc.
*/
var animationCallback = null;
var animationSource = null;
var animationTarget = null;
var animationStep = 0;
var animationTotalSteps = 0;
var animationTimer = 0;

function gallery_transition_moz(fromObj, toObj) {
  var animationTick = 30; // ms
  var animationTime = GALLERY_ANIMATION_LENGTH * 1000; // ms
  animationTotalSteps = Math.round(animationTime / animationTick);
  //alert('animation takes '+animationTotalSteps+' steps.');

  animationStep = 0;
  animationSource = fromObj;
  animationTarget = toObj;
  //alert('starting animation...');
  animationTimer = setInterval(mozAnimationDisplay, animationTick);
}

function mozAnimationDisplay() {
  if (animationStep == 0) {
    animationSource.style.zIndex = 1;
    animationSource.style.opacity = 1;
    animationSource.style.display = 'block';
    animationTarget.style.zIndex = 2;
    animationTarget.style.opacity = 0;
    animationTarget.style.display = 'block';
  }
  else if (animationStep >= animationTotalSteps) {
    animationTarget.style.opacity = 1;
    animationSource.style.opacity = 1;
    mozAnimationEnd();
  }
  else {
    // Tweening step
    var tween = (animationStep / animationTotalSteps);
    animationTarget.style.opacity = tween;
    //animationSource.style.opacity = 1 - tween;
    //window.status = tween;
  }
  animationStep++;
}

function mozAnimationEnd() {
  //alert('animationEnd()');
  gallery_transitionEnd();
  clearInterval(animationTimer);
}


function gallery_transitionEnd() {
        var container = document.getElementById('gallery-secondary');
        if (!container) 
            return;
        
  if (container.style.display != 'none') {
    gallery_changeToImage(container, document.getElementById('gallery-main2'));
    container.style.display = 'none';
    
    gallery_animation_timer = setTimeout(gallery_transitionStart, GALLERY_ANIMATION_INTERVAL * 1000);
  }
}

if (GALLERY_ANIMATION == true && !document.location.toString().match(/\/conto\//)) {
  gallery_animation_timer = setTimeout(gallery_transitionStart, GALLERY_ANIMATION_INTERVAL * 1000);
}