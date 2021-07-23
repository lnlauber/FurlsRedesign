let clearCart = document.querySelector('#clear-cart');
let cart = document.querySelector('#cart');
let contents = document.querySelectorAll('.cart__content__item');
let quickaddItems = document.querySelectorAll('.quickadd__item');
let cartContentDiv = document.getElementById('cart-content');

clearCart.addEventListener('click', () => {
  while(contents[0]){
    cartContentDiv.removeChild(contents[0]);
    contents = document.querySelectorAll('.cart__content__item')
  }
  cart.classList.add('empty');
})
function setEventListeners(){
  contents = document.querySelectorAll('.cart__content__item');
  contents.forEach(item => {
    let quantity = item.querySelector('.cart__content__item__details__quantity');
    quantity.addEventListener('change', (evt) =>{
      if(evt.target.value == 0){
        item.remove();
      } else{
        let price = item.getAttribute('data-price')
        let priceDiv = item.querySelector('.cart__content__item__details__price')
        priceDiv.textContent = '$' +(price * evt.target.value).toFixed(2);
      }
      contents = document.querySelectorAll('.cart__content__item');
      if(contents.length == 0){
        cart.classList.add('empty');
      }
    })
  });
}

quickaddItems.forEach(item => {
  let styles = item.querySelectorAll('.styles > li');
  let sizes = item.querySelectorAll('.sizes > li');
  let colors = item.querySelectorAll('.colors > li');
  let quickitem = quickadds.find(i => i.id === Number(item.getAttribute('data-item-id')));
  let sizeSelected = false;
  let styleSelected = false;
  let selectedSize;
  let selectedStyle;
  styles.forEach(s => {
    s.addEventListener('click', ()=>{
      if(!s.classList.contains('no-stock')){
        if(selectedStyle == Number(s.getAttribute('data-style-id'))){
          s.classList.remove('selected');
          styleSelected = false;
        } else{
          selectedStyle = s.getAttribute('data-style-id');
          if(sizeSelected){
            addToCart(quickitem, selectedStyle, selectedSize, null);
            sizes.forEach(si => {
              si.classList.remove('selected');
            });
            styles.forEach(st => {
              st.classList.remove('selected');
            });
            sizeSelected = false;
            styleSelected = false;
            selectedSize = null;
            selectedStyle =null;
          } else {
            styles.forEach(st => {
              st.classList.remove('selected');
            })
            let availableSizes = quickitem.styles.find(style => style.id === Number(selectedStyle)).sizes;          
            sizes.forEach(size => {
              let id = size.getAttribute('data-size-id');
              if(!availableSizes.includes(Number(id))){
                size.classList.add('no-stock');
              } else{
                size.classList.remove('no-stock');
              }
            });
            s.classList.add('selected');
            styleSelected = true;
          }
        }
      }
    })
  });
  sizes.forEach(s => {
    s.addEventListener('click', () =>{
    if(!s.classList.contains('no-stock')){
        if(selectedSize == Number(s.getAttribute('data-size-id'))){
          s.classList.remove('selected');
          sizeSelected = false;
        } else {
          selectedSize = s.getAttribute('data-size-id');
          if(styleSelected){
            addToCart(quickitem, selectedStyle, selectedSize, null);
            styles.forEach(st => {
              st.classList.remove('selected');
            });
            sizes.forEach(si => {
              si.classList.remove('selected');
            });
            sizeSelected = false;
            styleSelected = false;
            selectedSize = null;
            selectedStyle =null;
          }else{
            sizes.forEach(si => {
              si.classList.remove('selected');
            });
            let availableStyles = quickitem.sizes.find(size => size.id === Number(selectedSize)).styles;
            styles.forEach(style =>{
              let id = style.getAttribute('data-style-id');
              if(!availableStyles.includes(Number(id))){
                style.classList.add('no-stock');
              } else{
                style.classList.remove('no-stock');
              }
            })
            s.classList.add('selected');
            sizeSelected = true;
          }
        }
      }
    })
  });
  colors.forEach(c => {
    if(!c.classList.contains('no-stock')){
      c.addEventListener('click', () =>{
        addToCart(quickitem, null, null, c.getAttribute('data-color-id'));
      })
    }
  });
});


function addToCart(item, style, size, color){
  let styleObj = item.styles.find(s => s.id === Number(style));
  let sizeObj = item.sizes.find(s => s.id === Number(size));
  let colorObj = item.colors.find(c => c.id === Number(color));
  let cartItem = createCartItem(item, styleObj, sizeObj, colorObj);
  cartContentDiv.appendChild(cartItem);
  setEventListeners();
}

function createCartItem(item, style, size, color){
  let cartItem = document.createElement('div');
  cartItem.classList.add('cart__content__item');
  cartItem.setAttribute('data-price', item.price);

  let itemImg = document.createElement('img');
  itemImg.src = item.img;

  let details = document.createElement('div');
  details.classList.add('cart__content__item__details');

  let name = document.createElement('h3');
  name.classList.add('cart__content__item__details__name');
  name.textContent = item.name;
  details.appendChild(name);

  let description = document.createElement('h4');
  description.classList.add('cart__content__item__details__description');
  if(style && size){
    description.textContent = style.name + ' - ' + size.name; 
  } else {
    description.textContent = 'Color: ' + color.name;
  }
  details.appendChild(description);

  let price = document.createElement('h4');
  price.classList.add('cart__content__item__details__price');
  price.textContent = '$' + item.price;
  details.appendChild(price);

  let quantity = document.createElement('input');
  quantity.type = 'number';
  quantity.classList.add('cart__content__item__details__quantity');
  quantity.name = 'quantity';
  quantity.value = '1';
  details.appendChild(quantity);

  cartItem.appendChild(itemImg);
  cartItem.appendChild(details);
  cart.classList.remove('empty');
  return cartItem;
}

setEventListeners();