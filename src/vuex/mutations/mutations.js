export default {
    SET_PRODUCTS_TO_STATE: (state, products) => {   // 3. Та самая мутация, которая вызывается в экшне
        state.products = products;    // наполняем массив в стейте данными
    },
    SET_CART: (state, product) => {
        state.cart.push(product);
    },
    REMOVE_FROM_CART: (state, index) => {
        state.cart.splice(index, 1);
    },
    INCREMENT: (state, index) => {
        state.cart[index].quantity++;
    },
    DECREMENT: (state, index) => {
        if (state.cart[index].quantity > 1) {
            state.cart[index].quantity--;
        }
    }
}