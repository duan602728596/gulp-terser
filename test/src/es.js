// const
function add(x, y){
  const mid = 12;
  return x + y + 12;
}

// let
function array(arr){
  let r = 0;
  for(let i = 0; i < arr.length; i++){
    r += arr[i];
  }
  return r;
}

// arrow function
const pow = (a, b)=>{
  return a ** b;
};

// Promise
const promise = (number)=>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(number + 3);
    }, 1500);
  });
};

// async
async function asyncFn(){
  const input = await promise(add(15, 27));
}

module.exports = {
  add,
  array,
  pow,
  promise,
  asyncFn
};