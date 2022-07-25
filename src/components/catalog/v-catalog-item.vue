<template>
    <div class="v-catalog-item">
        <v-popup
        v-if="isInfoPopupVisible"
        rightBtnTitle="Add to cart"
        :popupTitle = 'product_data.name'
        @closePopup="closePopupInfo"
        @rightBtnAction="addToCart"
        >
        <img class="v-catalog-item__image" :src=" require('../../assets/images/' + product_data.image) " alt="img">
        <div>        
            <p class="v-catalog-item__name">{{product_data.name}} </p>
            <p class="v-catalog-item__price">{{ product_data.price }}</p>
            <p class="v-catalog-item__price">{{ product_data.category }}</p>
            </div>

        </v-popup>
        <img class="v-catalog-item__image" :src=" require('../../assets/images/' + product_data.image) " alt="img">
        <p class="v-catalog-item__name">{{product_data.name}} </p>
        <p class="v-catalog-item__price">{{ product_data.price }}</p>
        <button 
        class="v-catalog-item__show-info"
        @click="showPopupInfo"
        >
        Show info
        </button>
        <button 
        class="v-catalog-item__add_to_cart_btn btn" 
        @click="addToCart"
        >Add to cart
        </button>
    </div>
</template>

<script>
import vPopup from '../popup/v-popup'

    export default {
        name: "v-catalog-item",
        components: {
            vPopup
        },
        props: {
            product_data: {
                type: Object,
                default(){
                    return {}
                }
            }
        },
        data() {
            return {
                isInfoPopupVisible: false
            }
        },
        computed: {},
        methods: {
            showPopupInfo() {
                this.isInfoPopupVisible = true;
            },
            closePopupInfo() {
                this.isInfoPopupVisible = false;
            },

            addToCart(){
                this.$emit('addToCart', this.product_data) // name of method + what we want to pass
                // addToCart - как переданное будет называться в родителе
                console.log('data', this.product_data)
            }
        },
        mounted() {
        this.$set(this.product_data, 'quantity', 1)
        }
    }
</script>

<style lang="scss">

.v-catalog-item {
    flex-basis: 25%;
    box-shadow: 0 0 8px 0 #e0e0e0;
    padding: $padding*2;
    margin-bottom: $margin*2;
    &__image {
        width: 100px;
    }
}

</style>