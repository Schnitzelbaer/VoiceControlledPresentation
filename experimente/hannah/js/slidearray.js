// let arrayName = [];
// $("#brainstorming").children('div').each(function(){arrayName.push(this.outerHTML)});
// console.log("First approach: ", arrayName);
//

// const arr = [...document.querySelectorAll('#impress > div')].map(el => el.innerHTML);
// console.log(arr);
//

let arr = [];

$("#impress div").each(function() {
  arr.push($(this).html());
});

console.log(arr);
