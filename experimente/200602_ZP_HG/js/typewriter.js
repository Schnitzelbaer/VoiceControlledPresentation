var i = 0;
var txt = 'Im adding bullet points to your slide';
var speed = 60;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("type").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}