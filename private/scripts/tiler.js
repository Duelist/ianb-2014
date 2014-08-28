
(function () {

  var type_to_tile = {
    Github: GithubTile;
  };

  var Tile = (function () {
    /*
      Expected format
  
      {
        post-type: "Github",
        post-id: 1234,
        author: "Duelist",
        date-time: "2014-12-31 18:30pm",
        message: "This is a test message."
      }
    */
  
    function init() {
  
    }
  
    function render() {
  
    }
  
    return {
      init: init,
      render: render
    }
  });
  
  var GithubTile = Object.create(Tile);
  
  var Tiler = (function () {
    function init() {
  
    }
  
    function render() {
  
    }
  
    return {
      init: init,
      render: render
    }
  }());

}());
