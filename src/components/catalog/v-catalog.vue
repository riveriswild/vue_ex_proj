<template>
    <div class="v-catalog">
        <router-link :to="{name:'cart', params:{cart_data: CART} }">
        <div class="v-catalog__link_to_cart">Cart: {{CART.length}}</div>
        </router-link>

        <h1>Catalog</h1>
        
        <v-select
            :selected="selected"
            :options="categories"
            @select="sortByCategories"
            :isExtended='IS_DESKTOP'
        />
        <div class="range-slider">
            <input 
            type="range"
            min="0"
            max="1000"
            step="10"
            v-model.number="minPrice"
            @change="setRangeSliders"
            >
            <input 
            type="range"
            min="0"
            max="1000"
            step="10"
            v-model.number="maxPrice"
            @change="setRangeSliders"
            >
        </div>
        <div class="range-values">
            <p>Min: {{minPrice}}</p>
            <p>Max: {{maxPrice}}</p>
        </div>

        <div class="v-catalog__list">
            <v-catalog-item 
            v-for="product in filteredProducts"
            :key="product.article"
            :product_data="product"
            @addToCart="addToCart"
             />
        </div>
    </div>
</template>

<script>
// this.$store.state.products == 
  import vCatalogItem from './v-catalog-item.vue'
  import { mapActions, mapGetters } from 'vuex'
  import vSelect from '../v-select.vue'
    export default {
        name: "v-catalog",
        components: {
            vCatalogItem,
            vSelect
        },
        props: {},
        data() {
            return {
                categories: [
                    {name: 'Все', value: 'ALL'},
                    {name: 'Мужские', value: 'м'},
                    {name: 'Женские', value: 'ж'},
                ],
                selected: 'Все',
                sortedProducts: [],
                minPrice: 0,
                maxPrice: 1000
            }
        },
        computed: {
            ...mapGetters([
                'PRODUCTS',
                'CART',
                'IS_DESKTOP',
                'IS_MOBILE',
            ]),
            filteredProducts() {
                if (this.sortedProducts.length) {
                    return this.sortedProducts
                } else {
                    return this.PRODUCTS
                }
            }
        },
        methods: {
            ...mapActions([
                'GET_PRODUCTS_FROM_API',
                'ADD_TO_CART'
            ]),
            // sortByCategories(category) {
            //     this.sortedProducts = [];
            //     let vm = this;
            //      this.PRODUCTSG.map(function(item){
            //         if (item.category === category.name) {
            //             vm.sortedProducts.push(item);
            //         }
            //      })
            //      this.selected = category.name;
            // },
            addToCart(data){
                this.ADD_TO_CART(data);
            },

            setRangeSliders(){
                if (this.minPrice > this.maxPrice) {
                    let temp = this.maxPrice;
                    this.maxPrice = this.minPrice;
                    this.minPrice = temp;
                }
                this.sortByCategories();
            },
            sortByCategories(category){
                let vm = this
                this.sortedProducts = [...this.PRODUCTS]
                this.sortedProducts = this.sortedProducts.filter(function(item) {
                    return item.price >= vm.minPrice && item.price <= vm.maxPrice
                })
                if (category) {
                    this.sortedProducts = this.sortedProducts.filter(function(e) {
                        vm.selected = category.name
                        return e.category === category.name
                    })
                }
            },
    },
    async mounted() {
      await this.GET_PRODUCTS_FROM_API()
      this.sortByCategories()
    }
}
</script>

<style lang="scss">
.v-catalog {
    &__list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
    }
    &__link_to_cart {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: $padding*2;
        border: solid 1px #aeaeae;
        background: #ffffff;       
    }
}
.filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.range-slider {
    width: 200px;
    margin: auto 16px;
    text-align:center;
    position: relative;
}

.range-slider svg, .range-slider input[type=range] {
    position: absolute;
    left: 0;
    bottom: 0;
}

input[type=range]::-webkit-slider-thumb {
    z-index: 2;
    position: relative;
    top: 2px;
    margin-top: -7px;
}

</style>