document.addEventListener("DOMContentLoaded", function() {
  // Route Search Form Logic
  var routeSearchForm = document.querySelector(".route-search-form");
  if (routeSearchForm) {
    routeSearchForm.addEventListener("submit", function(event) {
      event.preventDefault();
      var source = document.getElementById("source").value.trim();
      var destination = document.getElementById("destination").value.trim();
      var date = document.getElementById("date").value;
      if (source && destination) {
        var query = new URLSearchParams({ source: source, destination: destination, date: date });
        window.location.href = "pages/routes.html?" + query.toString();
      }
    });
  }

});
