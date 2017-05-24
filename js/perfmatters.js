// Measuring the Critical Rendering Path with Navigation Timing
// https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp

WebFontConfig = {
    google: {
        families: ['Open Sans: 400,700']
    }

};

function logCRP() {
  var t = window.performance.timing,
    dcl = t.domContentLoadedEventStart - t.domLoading,
    complete = t.domComplete - t.domLoading;
  var stats = document.getElementById("crp-stats");
  stats.textContent = 'DCL: ' + dcl + 'ms, onload: ' + complete + 'ms';
}

window.addEventListener("load", function(event) {
  logCRP();
 
  (function(d) {
    var wf = d.createElement('script'), s = d.scripts[0];
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    wf.async = true;
    s.parentNode.insertBefore(wf, s);
})(document);
});

window.addEventListener("load", function(event) {

  logCRP();

  var container = document.querySelector(".container").getAttribute('id');
  onFirstLoad[container]();

  var header = document.querySelector("h1");
  header.addEventListener("click", onPressHeader);

  var navLinks = document.querySelectorAll("nav .nav-item");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', onNavClick);
  }


});
