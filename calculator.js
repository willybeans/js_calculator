/* issues to be adddressed:

- the "." behavior is incorrect *SOLVED*
- display properties
- the button sizing is inconsistent
- fix addition/subtraction behavior *solved*
- fix after calculation behavior *SOLVED*
- redundant double code *SOLVED*
- CE behavior *SOLVED*
--im suspiscious that the display stuff is ghetto rigged my man *solved*
*/

var buttons = ['CE','AC', 'x','7','8','9','/','4','5','6',
               '-','1','2','3','+','0','.','='];
var currentEntry = [], totalEntry = [];
var testNum = /[0-9]/g;
var regexOperands = /[+\-\/x=]/;
var regexPeriod = /./;
var equals = true;

const totalArea = document.getElementById("totalArea");
const currentArea = document.getElementById("currentArea");
const numberArea = document.getElementById("numberArea");
const faceHappy = document.getElementById("face-happy");

window.onload = () => {
  makeButtons();
}

function applyClick(x) { //all our clicking behaviors for buttons
  let btn = document.getElementById("b" + x);

  btn.onclick = () => {
    let totalAreaLength = totalArea.textContent.length;
    //first we clear the face
    changeDisplay(x);
       if(equals){ //clear after =, or for first entry
        if (!isNaN(x)){ //if there is pre-existing numbers after hitting equals then delete
          currentArea.textContent = '';
        } else {
          currentArea.textContent = totalEntry;
        }
        totalArea.textContent = '';
        currentEntry = [];
        totalEntry = [];
        equals = false;
      }

     //first we restrict input length to 17
     if(currentArea.textContent.length > 17 || totalArea.textContent.length > 17){
      alert("Number Limit Reached!");
      currentArea.textContent = "";
      totalArea.textContent = "";
      totalEntry = []
      currentEntry = [];
      equals = true;
     } else if(!isNaN(x)) { //test for number
           equals = false;
           //is this code doing anything?
           currentArea.textContent = (currentArea.textContent == "0") ?  x :  currentArea.textContent + x;
      } else if (isNaN(x)) { //**for all non numerics**\\

        if(equals){ //restricts equals being pressedtwice
          return;
        } else {

        if (x === "=") { //to get answer
            currentEntry = filterUserInput(x);
            var test = currentArea.textContent;
            console.log(currentEntry);
            var total = operateOnEntry(currentEntry);
            equals = true;
            totalEntry = currentEntry[0];
            currentArea.textContent = test;
            totalArea.textContent = total;
        } else if (x === ".") {
            let lastEntry = filterUserInput(x);
            if(!lastEntry.includes(".")){ //test for pre-existing period
              currentArea.textContent = currentArea.textContent + x;
            }
        } else if (x === "AC" || x === "CE") {
          if (x === "AC"){
            changeDisplay(x);
            totalEntry = [] ;
            currentEntry = [];
            currentArea.textContent = "";
            totalArea.textContent = "";
          } else if (x === "CE"){
            let clearedLastEntry = filterUserInput(x);
            currentArea.textContent = clearedLastEntry.join('');
          }
        } else { //this is default operator behavior
           let lastEntry = filterUserInput(x);
           //limits operators from printing if there is a pre-existing operator as last user input
           currentArea.textContent = (regexOperands.test(lastEntry)) ? currentArea.textContent : currentArea.textContent + x;
      }
    }
   }
  }
 }

function operateOnEntry(userEntry){
   //this is where the calculations occur when hitting =
  let a, b, c, index;
    if(userEntry.includes("x")){
        index = userEntry.indexOf('x');
        a = Number(userEntry[index - 1]);
        b = Number(userEntry[index + 1]);
        c = a * b;
        userEntry.splice((index - 1),3,c);
        return operateOnEntry(userEntry);
    } else if (userEntry.includes("/")) {
        index = userEntry.indexOf('/');
        a = Number(userEntry[index - 1]);
        b = Number(userEntry[index + 1]);
        c = a / b;
        userEntry.splice((index - 1),3,c);
        return operateOnEntry(userEntry);
    } else if (currentEntry.includes("+") || currentEntry.includes("-")){
      index = userEntry[1];
      a = Number(userEntry[0]);
      b = Number(userEntry[2]);
      console.log("index: " + index);
      if(index == '+'){
        c = a + b;
        userEntry.splice(0,3,c);
        return operateOnEntry(userEntry);
      } else {
        c = a - b;
        userEntry.splice(0,3,c);
        return operateOnEntry(userEntry);
      }
    }
    return userEntry;
 }

function filterUserInput(x) {
  //this function converts the user input into an array
  let testCurrentEntry;
  if(x==="."){
    testCurrentEntry = currentArea.textContent.split(regexOperands);
    return testCurrentEntry.pop();
  } else if(x==="=") {
    testCurrentEntry = currentArea.textContent;//.split(regexOperands)
    testCurrentEntry = testCurrentEntry.split(/([+\-\/x=])/g);
    return testCurrentEntry;
  } else if (x==="CE"){
    testCurrentEntry = currentArea.textContent.split("");
    testCurrentEntry.pop()
    return testCurrentEntry;
  } else {
    testCurrentEntry = currentArea.textContent.split('');
    return testCurrentEntry.pop();
  }
}

function changeDisplay (btn) {
  numberArea.style.display = 'block';
  if (btn == "=") {
    //speech.style.display = "block";
  //  document.getElementById("face-sleep").style.display = "none";
  //  document.getElementById("numberArea").style.display = "none";
//    document.getElementById("face-happy").style.display = "block";
  } else if (btn == 'AC') {
    numberArea.style.display = 'none';
    faceHappy.style.display = "block";
  }
}

function makeButtons() {
  for (var i = 0; i < buttons.length; i++){
    var btn = document.createElement("BUTTON");
    var t = document.createTextNode(buttons[i]);
    var container = document.getElementById('container');
    btn.id = "b" + buttons[i];
    btn.className = "button";
    btn.appendChild(t);
    container.appendChild(btn);
    applyClick(buttons[i]);
  }
}
