function bestCharge(selectedItems) {
  var items = loadAllItems();
  const promotions = loadPromotions();
  const cartItems = selectedIds2CartItems(selectedItems);//得到购物车菜单及其信息
  const bestProm = getBestProm(cartItems,promotions);//获得优惠方式及内容
  return printBill(cartItems, bestProm);
}

function selectedIds2CartItems(selectedItems){
  let cartItems = [];
  selectedItems.forEach(seleInfo => { //ITEM0013 x 4...
    const id = seleInfo.substring(0,8);
    const number = seleInfo.substring(11);
    const item = getItemById(id);
    let cartItem = {
      name : item.name,
      number : number,
      totalPrice : item.price * number,
      id : id
    }
    cartItems.push(cartItem);
  });
  return cartItems;
}

function getBestProm(cartItems,promotions){
  let cartPrice = 0;
  cartItems.forEach(cartItem => cartPrice += cartItem.totalPrice);
  let bestProm = { "type" : null , "discount" : 0 , "count" : cartPrice };
  promotions.forEach(function(promotion){
    var promCount = 0;
    if(promotion.type === "指定菜品半价"){
      let promName = "(";
      cartItems.forEach(cartItem => {
        if(promotion.items.indexOf(cartItem.id) >= 0){
          promCount += cartItem.totalPrice / 2;
          promName += (cartItem.name + "，");
        }else{
          promCount += cartItem.totalPrice;
        }
      });
      promName = promName.substring(0,promName.length-1);
      promotion.type += promName + ")";
    }
    if(promotion.type === "满30减6元"){
      cartItems.forEach(cartItem => promCount += cartItem.totalPrice);
      const times = Math.floor(promCount / 30); // promCount > 30 ? Math.floor(promCount / 30) : 0 ;
      promCount -= (times * 6);
    }
    const discount = cartPrice - promCount;
    if(discount > bestProm.discount){
      bestProm = { "type" : promotion.type , "discount" : discount , "count" : promCount }
    }
  });
  return bestProm;
}

function printBill(cartItems, bestProm) {
  let result = "============= 订餐明细 =============\n";
  let delimiter = "-----------------------------------\n";
  cartItems.forEach(item => {
    result += `${item.name} x ${item.number} = ${item.totalPrice}元\n`;
  });
  result += delimiter;
  if(bestProm.type){
    result += `使用优惠:\n${bestProm.type}，省${bestProm.discount}元\n${delimiter}`;
  }
  result += `总计：${bestProm.count}元\n`;
  result += "===================================\n";
  return result;
}

function getItemById(id){
  const items = loadAllItems();
  let item = {};
  items.forEach(it => {
    if(it.id == id){
      item = it;
    }
  });
  return item;
}
