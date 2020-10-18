/* BEM.js
Write a module that takes a class string and returns a separators for elements and modifiers in BEM notation:
block_mod__elem // modificator goes first
block_mod_mod__elem  
block__elem_mod_mod
these class strings will result in:
{  
  mod: "_", // modificator separator 
  elem: "__", // element separator
}
*/

const func = (str) => {
  const re = /[A-Za-z]+/;
  let identificators = str.split(re).filter(Boolean);
  let mod, elem;
  const duplicates = identificators.filter(
    (item, index) => identificators.indexOf(item) !== index
  );
  if (duplicates.length === 0) {
    mod = identificators[0];
    elem = identificators[1];
  } else {
    mod = duplicates[0];
    elem = identificators.filter((item) => item !== mod)[0];
  }
  return { mod, elem };
};

//// TESTS
console.log(func("block_mod__elem"));
console.log(func("block_mod_mod__elem"));
console.log(func("block__elem_mod_mod"));

/* all resulting in
{ mod: '_', elem: '__' }
*/

console.log(func("block--elem_mod_mod")); // { mod: '_', elem: '--' }
