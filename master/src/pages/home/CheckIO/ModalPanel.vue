<template @keypress.esc="close">
    <transition name="modal-animation">
        <div v-if="modalActive" class="modal" @click="close">
            <transition name="modal-animation-inner">
                <div v-if="modalActive" class="modalInner" v-on:click.stop="prevent">
                    <slot />
                    <q-btn style="width: 100%" color="primary" label="Aceptar" @click="close" />
                </div>
            </transition>
        </div>
    </transition>
</template>

<script setup>
const props = defineProps(['modalActive'])
const emit = defineEmits(['close'])

const close = () => {
    console.log('close event')
    emit('close')
}
const prevent = (e) => {
    console.log('prevent:', e)
}
</script >

<style lang="scss">
.modal {
    z-index: 10000;
}

.modal-animation-enter-active,
.modal-animation-leave-active {
    transition: opacity 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
    opacity: 0;
}

/*.modal-animation-leave-from
.modal-animation-enter-to {
    opacity:1;
}*/

.modal-animation-inner-enter-active {
    transition: opacity 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s;
}

.modal-animation-inner-leave-active {
    transition: opacity 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-animation-inner-enter-from {
    opacity: 0;
    transform: scale(0.8);
}

.modal-animation-inner-leave-to {
    transform: scale(0.8);
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    position: fixed;
    background: rgba(173, 216, 230, 0.473);
}

.modalInner {
    position: relative;
    box-shadow: 3px 3px 10px;
    border-radius: 10px;
}

.ico {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
}
</style>
