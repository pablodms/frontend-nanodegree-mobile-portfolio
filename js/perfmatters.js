// Measuring the Critical Rendering Path with Navigation Timing
// https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp

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
  link.href = "css/style.min.css";
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

var onFirstLoad = {
  'about': function() {
    var cleanHello = function() {
    var letters = this.childNodes;
    var message = '';
    for (var i = 0; i < letters.length; i++) {
      message += letters[i].textContent;
    }
    letters[0].parentNode.innerHTML = message;
  };

  var descriptionNode = document.querySelector(".description");
  descriptionNode.style.display = 'block';
  void descriptionNode.offsetWidth;
  descriptionNode.classList.add('visible');


  var hello = document.getElementById('hello');
  var messageString = hello.innerHTML;
  hello.innerHTML = '';
  hello.classList.add('visible');
  for (var i = 0, len = messageString.length; i < len; i++) {
    if (messageString[i] === ' ')
    {
      hello.innerHTML += ' ';
    }
    else 
    {
      hello.innerHTML += '<span class="hello-letter" style="animation-delay: '+(i * 200)+'ms">'+messageString[i]+'</span>';
    }
  }

  setTimeout(cleanHello.bind(hello), i* 200 + 1000);
    this.about = null;
   },
  'courses': function() {
    this.courses = null;
   },
  'experience': function() {
    this.experience = null;
   },
  'portfolio': function() {
    this.portfolio = null;

  }
};

var sections = {};

var onPressHeader = function() {
  var headerIcon = this.querySelector('#header-toggle');
  if (headerIcon)
  {
     this.querySelector('#header-toggle').classList.toggle('expanded');
     document.querySelector("nav").classList.toggle('expanded');
  }
};

var injectNode = function() {
    this.classList.remove('old');
    this.classList.add('new');
    document.querySelector("body").insertBefore(this, document.querySelector("footer"));
    void this.offsetWidth;
    this.classList.add('animated');
    setTimeout(onNavigated.bind(this), 1200);
};

var onNavigated = function(event) {
    // Ignore old animations
    if (this.classList.contains('old')) {
      return;
    }

    var oldElements = document.querySelectorAll('.old');
    if (oldElements)
    {
      for (var i = 0; i < oldElements.length; i++) {
        oldElements[i].classList.remove('old');
        sections[oldElements[i].getAttribute('id')] = oldElements[i].parentNode.removeChild(oldElements[i]);
      }
    }
    this.classList.remove('new');
    this.classList.remove('animated');

    var id = this.getAttribute('id');
    onFirstLoad[id] && onFirstLoad[id]();
};

var navigate = function(url, container, preserveState) {

  if (sections[container]) {
    var containerElements = document.querySelectorAll('.container');
    if (containerElements) {
      for (var i = 0; i < containerElements.length; i++) {
        containerElements[i].classList.add('old');
      }
    }
    injectNode.call(sections[container]);
    !preserveState && history.pushState({'container': container}, '', url);
    return false;
  }

  var req = new XMLHttpRequest();
  req.open('GET', url);
  req.onload = function(response) {
    if (req.status == 200) {
      var containerElements = document.querySelectorAll('.container');
      if (containerElements) {
        for (var i = 0; i < containerElements.length; i++) {
          containerElements[i].classList.add('old');
        }
      }
      var div = document.createElement("div");
      div.innerHTML = req.response;
      injectNode.call(div.querySelector('.container'));
      div.innerHTML = '';
      !preserveState && history.pushState({'container': container}, '', url);
    }
  };
  // Make the request
  req.send();
  return false;
};

var onNavClick = function(event) {

  event.preventDefault();
  var self = this;

  if (this.classList.contains('current')) {
    return;
  }

  onPressHeader.call(document.querySelector('h1'));
  var navLinks = document.querySelectorAll("nav .nav-item");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove('current');
  }
  self.classList.add('current');

  return navigate(this.getAttribute('href'), this.dataset.container);
}

window.addEventListener("popstate", function(event) {

  var container = event.state && event.state.container || 'about';
  var links = document.querySelectorAll('.nav-item');
  for (var i = 0; i < links.length; i++)
  {
    links[i].classList.remove('current');
  }
  var currentLink = document.querySelector('.nav-item[data-container='+container+']');
  currentLink.classList.add('current');
  navigate(document.location.href, container, true);
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