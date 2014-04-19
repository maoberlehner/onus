/**
 * TODO
 * maybe use localStorage + caching system
 * add function to load only when visible (onscroll)
 */
;(function ($, window, document, undefined) {

  var pluginName = 'onus';
  var self;
  var defaults = {
    matchMedia: [
      'min-width: 36em'
    ],
    anchor: '#main-content',
    $spinner: $('<div class="spinner" />')
  };

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);

    this.settings = $.extend(
      {},
      defaults,
      options,
      $(this.element).data('onusOptions')
    );

    this._defaults = defaults;
    this._name = pluginName;

    self = this;
    self.init();
  }

  Plugin.prototype = {
    init: function () {
      var mq_string = '(' + self.settings.matchMedia[0] + ')';

      $.each(self.settings.matchMedia.slice(1), function () {
        mq_string += ' and (' + this + ')';
      });

      if (window.matchMedia(mq_string).matches) {
        self.loadContent();
      }

      self.$element.on('click', function (e) {
        e.preventDefault();
        self.loadContent();
      });
    },
    loadContent: function () {
      var $tmp = $('<div id="onus-tmp" />');

      // add spinner loading animation
      self.$element.after(self.settings.$spinner).remove();

      // load the content
      $tmp.load(self.element.href + ' ' + self.settings.anchor, function () {
        // insert the content after the spinner and remove the spinner
        self.settings.$spinner
          .after($tmp.find(self.settings.anchor).html())
          .remove();
      });
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