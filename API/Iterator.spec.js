const fs = require("fs");
const Iterator = require("./Iterator");

const iterator = Iterator(fs.readFileSync("./scores/basic.xml").toString());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.prev());
console.log(iterator.prev());
console.log(iterator.prev());
//console.log(iterator.prev()); //No prev!

