

<template>
    <div id="app">
        <transition name="fade" modeSlit="out-in" modeSlit1="out-in" modeSlit2="out-in" modeSlit3="out-in">
            <router-view class="view" id="rootview" />
        </transition>
        <test attr1="u" attr2="u"  
        attr3="u">
          wa
        </test>
        <shop-item v-for="item in goodsList" :key="item.id" :id="item.id"
                       :title="item.name"
                        :sold="item.soldNum"
                          :unsold="item.order"
                            :weigth="item.weigth || ''"
                       :img-url="item.imageUrl"
                       :old-price="item.price"
                       :new-price="item.discountPrice"/>
    </div>
</template>

<style lang='scss'>
    @import './style/App.scss';
    #app {
        width: 100%; 
        // width: auto;
        padding: 1PX;
    }
</style>

<script lang="ts">
    export default {
        name: 'App',
        created() {
            // do something after creating vue instance
        }
    }
</script>
