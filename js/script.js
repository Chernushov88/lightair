// Expandable
window.addEvent("domready", function() {
	$$('.drop').each(function(extendable) {
		extendable.triggerElement = extendable.getElements('.drop-rub')[0];
		
		if (extendable.triggerElement != null) {
			extendable.triggerElement.style.cursor = "pointer";
			extendable.triggerElement.fxAnimator = new Fx.Slide(extendable.getElements('.drop-content', {duration: 500})[0]);
			extendable.triggerElement.addEvent('click', function() {
			  if (window.ie6) {
			    // IE6 doesn't like Fx.Slider.
			    this.fxAnimator.show();
			  } else {
			    this.fxAnimator.toggle();
		    }
			});
			if (extendable.getElements('.error').length == 0) {
			  extendable.triggerElement.fxAnimator.hide();
		  }
		}
	});
});