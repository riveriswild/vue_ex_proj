export default {
    PRODUCTSG(state) {  // верни то что в стейте называется продуктз
        console.log('data2', state.products)
        return state.products;
    },
    CART(state){
        return state.cart;
    },
    IS_MOBILE(state){
        return state.isMobile;
    },
    IS_DESKTOP(state){
        return state.isDesktop;
    },
} // короткий путь получения информации данных стейта
