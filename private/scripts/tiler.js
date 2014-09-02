
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
        }
      });
    }
  
    function render() {
      var rendered_tiles = [],
          tile = $('<div>');
      console.log(feed[0]);
      rendered_tiles.push(tile); 
      console.log(rendered_tiles);
    }
  
    return {
      init: init,
      render: render
    };
  }());
}());
