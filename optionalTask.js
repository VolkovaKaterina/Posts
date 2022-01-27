console.log(1);

setTimeout(function () {
    console.log(2);
}, 100);

setTimeout(function () {
    console.log(3);
}, 0);

new Promise(function (resolve) {
    resolve();
}).then(() => {
   setTimeout(()=>{
       console.log(4);
   },0)
});

console.log(5);
