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

(function(d) {
  var head = d.getElementsByTagName('head')[0];
  var link = d.createElement('link');
  link.type = "text/css";
  link.rel = "stylesheet"
  link.href = "css/style.css";
  //link.addEventListener("load", onLoadCss);
  head.appendChild(link);
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

  //var onLoadCss = function() {
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

    var onPressHeader = function() {
       this.classList.toggle('expanded');
       document.querySelector("nav").classList.toggle('expanded');
    };

    var onNavigated = function(event) {
        var old = document.getElementById('old');
        old.parentNode.removeChild(old);
        this.setAttribute('id', '');
        this.classList.remove('animated');
    };

    var onNavClick = function(event) {
      event.preventDefault();

      if (this.classList.contains('current')){
        return;
      }

      var self = this;      
      var req = new XMLHttpRequest();
      req.open('GET', this.getAttribute('href'));
      req.onload = function(response) {
        if (req.status == 200) {
          var navLinks = document.querySelectorAll("nav .nav-item");
          for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.remove('current');
          }
          self.classList.add('current');
          onPressHeader.call(document.querySelector('h1'));
          document.querySelector('.container').setAttribute('id', 'old');
          var div = document.createElement("div");
          div.innerHTML = req.response;
          var innerContainer = div.querySelector('.container');
          var className = innerContainer.className;
          div.innerHTML = innerContainer.innerHTML;
          div.className = className;
          div.setAttribute('id', 'new');
          document.querySelector("body").appendChild(div);
          void div.offsetWidth;
          div.classList.add('animated');
          div.addEventListener("transitionend", onNavigated, false);
        }
      };
      // Make the request
      req.send();
      return false;
    }

    var header = document.querySelector("h1");
    header.addEventListener("click", onPressHeader);

    var navLinks = document.querySelectorAll("nav .nav-item");
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', onNavClick);
    }
  //};

});