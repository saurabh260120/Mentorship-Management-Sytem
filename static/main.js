const myTimeout = setTimeout(f1, 500);
function f1(){
let msgbox = document.getElementById("scrolltobottom");
msgbox.scrollTop = msgbox.scrollHeight; 
}

const myTimeout1 = setTimeout(f2, 500);
function f2(){
let msgbox = document.getElementById("scroll_bottom");
msgbox.scrollTop = msgbox.scrollHeight;
}
