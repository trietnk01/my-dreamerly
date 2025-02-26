const checkedColor=(val)=>{	
	let checked=true;
    const len = val.length;    
    for (let i = 0; i < len / 2; i++) {        
        if (val[i] !== val[len - 1 - i]) {
            checked=false;
        }
    }
    return checked;
}
const result= checkedColor("madam");
if(result===true){
	console.log("It is palindrome");
}else{
	console.log("It is not palindrome");
}
