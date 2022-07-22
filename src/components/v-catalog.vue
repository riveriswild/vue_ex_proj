<template>
    <div class="v-catalog">
        <h1>Catalog</h1>
        <div class="v-catalog__list">
            <v-catalog-item 
            v-for="product in PRODUCTSG"
            :key="product.article"
            :product_data="product"
            @sendDataToParent="showChildArticleInConsole"
             />
        </div>
    </div>
</template>

<script>
// this.$store.state.products == 
  import vCatalogItem from './v-catalog-item.vue'
  import { mapActions, mapGetters } from 'vuex'
    export default {
        name: "v-catalog",
        components: {
            vCatalogItem
        },
        props: {},
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                'PRODUCTSG'
            ])
        },
        methods: {
            ...mapActions([
                'GET_PRODUCTS_FROM_API'
            ]),
            showChildArticleInConsole(data){
                console.log(data)
            }  
    },
    async created() {
      await this.GET_PRODUCTS_FROM_API()
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
}

</style>