var i = 0;
var txt = 'Im adding bulletpoints to your slide';
var speed = 40;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("type").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }