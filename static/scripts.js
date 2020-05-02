document.body.onload = function (){
  window.header = document.getElementById("head-trigger");
  checkHeader();
  window.onscroll = checkHeader; 
  window.player = document.getElementById("audio_player");
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
  document.getElementById("a2a").style.display="block";
}
var header;
function checkHeader(){
  if(window.scrollY>100){
    header.className = "scroll-header scrolled-header";
  }else{
    header.className = "scroll-header";
  }
}
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var player = null;

function play(){
  var button = document.getElementById("play_button");
  var peak = document.getElementById("peak-meter");
  if(player.paused){
    player.play();
    peak.style.display = "block";
    button.className = "icon-pause";
  }
  else {
    player.pause();
    peak.style.display = "none";
    button.className = "icon-play";
  }
}

function setVolume(v){
  player.volume=v;
}

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 250 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};