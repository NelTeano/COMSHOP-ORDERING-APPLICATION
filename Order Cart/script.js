const { ipcRenderer } = require('electron');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
const popupHTML = document.querySelector('.popup');
const pcNumInput = document.querySelector('.pcNumber');
const suggestionInput = document.querySelector('.suggestion');
let products = [];
let cart = [];
let total = 0;
let pcNum = 1;
let comment = '';



localStorage.clear(); // INITIATE CLEAR FIRST ALWAYS FOR NEW DATA

function openPopup() {
    console.log(cart.length)
    if(cart.length < 1){
        alert("Put Items to the cart first !");
    }else{
        popupHTML.style.display = "flex";
    }
}

function closePopup() {
    popupHTML.style.display = "none";
}


const confirmOrder = async () => {
    
    pcNum = parseInt(pcNumInput.value, 10);
    if (isNaN(pcNum)) {
        alert("Please enter a valid PC Number");
        return; 
    }

    const orderData = {
        pcNum: pcNum,
        products: cart,
        total: total,
        comment: comment  
    };

    try {
        
        const response = await fetch('http://localhost:3000/api/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Iterate through each item in the cart and update the stock
        for (const item of cart) {
            const productId = item.product_id;
            const quantity = -item.quantity;

            // Make a PUT request to update the stock for the current product
            const stockUpdateResponse = await fetch(`http://localhost:3000/api/Products/${productId}/addStock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity }),
            });

            if (!stockUpdateResponse.ok) {
                throw new Error(`Error updating stock for product ${productId}: ${stockUpdateResponse.status}`);
            }
        }

        console.log('Success:', orderData)
        alert("Order Successful");
        closePopup();

        console.log('Sending close-main-window event...');
        ipcRenderer.send('close-main-window');
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting order');
    }
}


pcNumInput.addEventListener('input', function() {
    pcNum = parseInt(pcNumInput.value, 10); 
});

suggestionInput.addEventListener('input', function() {
    comment = suggestionInput.value;
});

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

    const addDataToHTML = () => {
    // remove datas default from HTML

        // add new datas
        if(products.length > 0) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <h5>Stock : ${product.stock}</h5>
                <div class="price">₱${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
                
            });
        }
    }
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })

const calculateItemTotalPrice = (item) => {
    let positionProduct = products.findIndex((value) => value.id == item.product_id);
    let productInfo = products[positionProduct];
    return productInfo.price * item.quantity;
};

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    let positionProduct = products.findIndex((value) => value.id == product_id);

    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1,
            name: products[positionProduct].name
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1,
            name: products[positionProduct].name
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }

    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Cart", cart);
    console.log("total", total);
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let overallTotalPrice = 0;

    if (cart.length > 0) {
        cart.forEach((item) => {
            totalQuantity = totalQuantity + item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            // Fetch the corresponding product information
            let positionProduct = products.findIndex((value) => value.id == item.product_id);

            // Check if the product is found
            if (positionProduct !== -1) {
                let productInfo = products[positionProduct];
                let itemTotalPrice = calculateItemTotalPrice(item);
                overallTotalPrice += itemTotalPrice;
                total = overallTotalPrice; // Update total here

                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                <div class="image">
                    <img src="${productInfo.image}">
                </div>
                <div class="name">
                    ${productInfo.name}
                </div>
                <div class="totalPrice">₱${itemTotalPrice}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
                `;
            } else {
                console.error(`Product with id ${item.product_id} not found.`);
            }
        });
    }

    // Display overall total price
    listCartHTML.innerHTML += `<div class="overallTotal">Overall Total: ₱${overallTotalPrice}</div>`;

    iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
    console.log("Cart", cart);
    console.log("total", total);
}

const initApp = () => {
    // get data product
    fetch('http://localhost:3000/api/Products/In-Stock')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }

        
        console.log(products)
    })
}
initApp();






