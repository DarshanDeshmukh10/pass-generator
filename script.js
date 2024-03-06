const inputSlider=document.querySelector('[data-lengthSlider]');
const lengthDisplay=document.querySelector('[data-lengthNumber]');
const passwordDisplay=document.querySelector('[data-passwordDisplay]');
const copyBtn=document.querySelector('[data-copy]');
const copyMsg=document.querySelector('[data-copyMsg]');
const uppercaseCheck=document.querySelector('#uppercase');
const lowercaseCheck=document.querySelector('#lowercase');
const numbersCheck=document.querySelector('#numbers');
const symbolsCheck=document.querySelector('#symbols');
const indicator=document.querySelector('[data-indicator]');
const generateBtn=document.querySelector('.generate-button');
const allCheckBox=document.querySelectorAll('input[type=checkbox]');
const symbols= '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
setIndicator('#ccc');
handleSlider();
//set password length 
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor= color; 
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;

}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randomNum=getRndInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNumbers=false;
    let hasSymbols=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNumbers=true;
    if(symbolsCheck.checked) hasSymbols=true;

    if(hasUpper && hasLower && (hasNumbers || hasSymbols) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNumbers || hasSymbols) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00")
    }
}
async function copyContent(){
    try{
        //copied on clipboard
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }   
    //to make copy msg visible
    copyMsg.classList.add("active")
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;

    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str; 
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();  
});
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});
generateBtn.addEventListener('click',()=>{
    //if no checkbox selected
    if(checkCount==0) 
    return;
    
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    //find new password
     
    //remove old password
    password="";

    //according to checkboxes
    // if(uppercaseCheck.checked){
    //     password=password + generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password=password + generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password=password + generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password=password + generateSymbol();
    // }

    let funcArr=[];
    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    //shuffle the password
    password=shufflePassword(Array.from(password));
    
    passwordDisplay.value=password;
    //clac strength
    calcStrength();
});
