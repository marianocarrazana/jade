document.body.onload = function (){
  window.header = document.getElementById("head-trigger");
  checkHeader();
  window.onscroll = checkHeader; 
  window.player = document.getElementById("audio_player");
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
    button.src = "https://fonts.gstatic.com/s/i/materialicons/pause/v4/24px.svg";
  }
  else {
    player.pause();
    peak.style.display = "none";
    button.src = "https://fonts.gstatic.com/s/i/materialicons/play_arrow/v4/24px.svg";
  }
}

function setVolume(v){
  player.volume=v;
}
