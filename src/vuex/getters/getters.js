export default {
    PRODUCTSG(state) {  // верни то что в стейте называется продуктз
        console.log('data2', state.products)
        return state.products;
    },
    CART(state){
        return state.cart;
    }
} // короткий путь получения информации данных стейта
