
var $ = require('../../bower_components/jquery/dist/jquery.min.js')

module.exports = (function () {
  this.Tiler = (function () {
    var feed = [];
    function init() {
      $.ajax({
        url: '/social',
        type: 'GET',
        success: function (data) {
          var json_data = $.parseJSON(data);
          feed = json_data;
          render();
        }
      });
    }

    function render_tile(post) {
      var tile = $('<div>').addClass('tile');
      var tile_content = $('<div>').addClass('tile-content');

      var tile_header_row = $('<div>').addClass('row');
      var tile_header_username = $('<div>').addClass('col-xs-3');
      var tile_header_date = $('<div>').addClass('col-xs-9');

      var tile_footer_row = $('<div>').addClass('row');
      var tile_footer_date = $('<div>')
                             .addClass('col-xs-9')
                             .addClass('text-left');

      tile_content.html(post.messages.join('<br />'));
      tile.append(tile_content);
      return tile;
    }
  
    function render() {
      var rendered_tiles = [];
      rendered_tiles = feed.map(function (post) {
        return render_tile(post);
      });
      $('.tiled-feed').append(rendered_tiles);
    }
  
    return {
      init: init
    };
  }());
}());
