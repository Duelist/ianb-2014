
var $ = require('../../bower_components/jquery/dist/jquery.min.js')

module.exports = (function () {
  this.Tiler = (function () {
    function init() {
      $.ajax({
        url: '/social',
        type: 'GET',
        success: function (data) {
          render(data);
        }
      });
    }
  
    function render(feed) {
      var i,
          tf = $('.tiled-feed').first(),
          row = $('<div>').addClass('row');
          rendered_tiles = [];

      rendered_tiles = feed.map(function (post) {
        return $(post);
      });

      for (i = 0; i < rendered_tiles.length; i++) {
        /*
        if (i % 4 === 0) {
          tf.append(row);
          // New row
          row = $('<div>').addClass('row');
        }
        row.append(rendered_tiles[i].addClass('col-md-3'));
        */
        tf.append(rendered_tiles[i]);
      }
    }
  
    return {
      init: init
    };
  }());
}());
