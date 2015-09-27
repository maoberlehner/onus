/**
 * TODO
 * maybe use localStorage + caching system
 */
;(function ($, window, document, undefined) {

  var pluginName = 'onus';
  var self;
  var defaults = {
    matchMedia: [
      'min-width: 36em'
    ],
    anchor: '#main-content',
    inViewportThreshold: 0,
    $spinner: $('<span class="spinner" />')
  };
  var loaded = false;
  var mq_string;
  var lastScrollY = $(window).scrollTop();
  var ticking = false;


  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);

    this.settings = $.extend(
      {},
      defaults,
      options
    );
    this._defaults = defaults;
    this._name = pluginName;

    self = this;
    self.init();
  }

  Plugin.prototype = {
    init: function () {
      mq_string = '(' + self.settings.matchMedia[0] + ')';

      $.each(self.settings.matchMedia.slice(1), function () {
        mq_string += ' and (' + this + ')';
      });

      $(window).on('load scroll', self.onScroll);

      self.$element.on('click', function (e) {
        e.preventDefault();
        self.loadContent();
      });
    },
    observer: function () {
      if (!loaded && window.matchMedia(mq_string).matches && self.inViewport()) {
        self.loadContent();
      }
      ticking = false;
    },
    loadContent: function () {
      var $tmp = $('<div id="onus-tmp" />');
      loaded = true;
      // Add spinner loading animation
      self.$element.after(self.settings.$spinner).remove();

      // Load the content
      $tmp.load(self.element.href + ' ' + self.settings.anchor, function () {
        // Insert the content after the spinner and remove the spinner
        var $ajax_content = $($tmp.find(self.settings.anchor).html());
        self.settings.$spinner
          .after($ajax_content)
          .remove();
        $(window).trigger('onus-content-loaded', $ajax_content);
      });
    },
    inViewport: function () {
      var fold = $(window).height() + lastScrollY;
      return fold >= self.$element.offset().top - self.settings.inViewportThreshold;
    },
    requestTick: function() {
      if (!ticking) {
        window.requestAnimationFrame(self.observer);
        ticking = true;
      }
    },
    onScroll: function() {
      lastScrollY = $(window).scrollTop();
      self.requestTick();
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });
  };
}(jQuery, window, document));
