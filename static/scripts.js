document.body.onload = function (){
  window.header = document.getElementById("head-trigger");
  checkHeader();
  window.onscroll = checkHeader; 
}
var header;
function checkHeader(){
  console.log("a");
  if(window.scrollY>100){
    header.className = "scroll-header scrolled-header";
  }else{
    header.className = "scroll-header";
  }
}