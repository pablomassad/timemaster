<template>
    <div class="btn" @click="onChange" :class="{'pressed': !!state}" :style="{backgroundColor: (state === true) ? '#0eee60' : 'green'}">
        {{ text }}
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['text', 'color'])
const emit = defineEmits(['change'])

const state = ref(false)

const onChange = () => {
    state.value = !state.value
    console.log('state:', state.value.toString())
    emit('change', state)
}
</script>

<style scoped lang="scss">
.btn {
    border-radius: 5px;
    box-shadow: 1px 1px 5px #444;
    height: 50px;
    color: white;
    text-shadow: 1px 1px 1px black;
    font-size: 20px;
    padding: 9px;
    width: 100px;
    text-align: center;
}

/*.btn:active,*/
.pressed {
    text-shadow: none;
    transform: translateY(2px);
}
</style>
