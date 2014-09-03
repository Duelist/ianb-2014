
var $ = require('../../bower_components/jquery/dist/jquery.min.js')

module.exports = (function () {
  this.Tiler = (function () {
    var feed = [];
    function init() {
      $.ajax({
        url: '/social',
        type: 'GET',
        success: function (data) {
          var json_data = data;
          feed = json_data;
          render();
        }
      });
    }

    function render_tile(post) {
      var tile = $('<div>')
                 .addClass('tile'),
          tile_content = $('<div>')
                         .addClass('tile-content');
      tile_content.html(post.messages.join(' '));
      tile.append(tile_content);
      return tile;
    }
  
    function render() {
      var rendered_tiles = [];
      console.log(feed);
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
