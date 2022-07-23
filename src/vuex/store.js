import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        products: [],
        cart: [],
    },
    mutations: {
        SET_PRODUCTS_TO_STATE: (state, products) => {   // 3. Та самая мутация, которая вызывается в экшне
            state.products = products;    // наполняем массив в стейте данными
        },
        SET_CART: (state, product) => {
            state.cart.push(product);
        },
        REMOVE_FROM_CART: (state, index) => {
            state.cart.splice(index, 1);
        }
    },  // мутации синхронны, если вызвать две, сначала одна, потом вторая

    actions: {
        async GET_PRODUCTS_FROM_API({commit}) {
            try {
                const products = await axios('http://localhost:3000/products', {
                    method: "GET"
                });
                commit('SET_PRODUCTS_TO_STATE', products.data);
                return products;
            } catch (error) {
                console.log(error);
                return error;
            }
          },
          ADD_TO_CART({commit}, product) {
            commit('SET_CART', product);
          },
          DELETE_FROM_CART({commit}, index) {
            commit('REMOVE_FROM_CART', index);
          }
    }, // асинхронны
    getters: {
        PRODUCTSG(state) {  // верни то что в стейте называется продуктз
            console.log('data2', state.products)
            return state.products;
        },
        CART(state){
            return state.cart;
        }
    } // короткий путь получения информации данных стейта

});

export default store;