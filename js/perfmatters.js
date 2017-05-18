// Measuring the Critical Rendering Path with Navigation Timing
// https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp


(function(w,g){w['GoogleAnalyticsObject']=g;
 w[g]=w[g]||function(){(w[g].q=w[g].q||[]).push(arguments)};w[g].l=1*new Date();})(window,'ga');

// Optional TODO: replace with your Google Analytics profile ID.
ga('create', 'UA-39582533-4');
ga('send', 'pageview');

WebFontConfig = {
    custom: {
        families: ['FontAwesome'],
        urls: ['//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css']
    },
    google: {
        families: ['Open Sans: 400,700']
    }

};

(function(d) {
    var wf = d.createElement('script'), s = d.scripts[0];
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    wf.async = true;
    s.parentNode.insertBefore(wf, s);
})(document);

function logCRP() {
  var t = window.performance.timing,
    dcl = t.domContentLoadedEventStart - t.domLoading,
    complete = t.domComplete - t.domLoading;
  var stats = document.getElementById("crp-stats");
  stats.textContent = 'DCL: ' + dcl + 'ms, onload: ' + complete + 'ms';
}

window.addEventListener("load", function(event) {

  logCRP();

  document.querySelector(".description").classList.add('visible');

  var message = document.getElementById('message');
  var welcome = document.getElementById('welcome');
  var messageString = message.innerHTML;
  for (var i = 0, len = messageString.length; i < len; i++) {
    if (messageString[i] === ' ')
    {
      welcome.innerHTML += ' ';
    }
    else 
    {
      welcome.innerHTML += '<span class="hello-letter">'+messageString[i]+'</span>';
      welcome.querySelector('.hello-letter:last-child').style.animationDelay = (i * 200) + 'ms';
    }
  }

  
  document.querySelector("h1").addEventListener("touchstart", function()
  {
      this.classList.toggle('expanded');
      document.querySelector("nav").classList.toggle('expanded');
  });
});