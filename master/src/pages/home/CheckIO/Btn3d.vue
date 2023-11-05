<template>
    <div class="btn" :class="{'pressed': !!state}" :style="{backgroundColor: `hsl(${H}deg,${S}%, ${L}%)`}" @click="onChange">
        {{ text }}
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['text', 'color', 'option'])
const emit = defineEmits(['change'])

const state = ref(false)
const H = computed(() => convertToHue(props.color))
const S = computed(() => (state.value) ? 100 : 50)
const L = computed(() => (state.value) ? 50 : 20)

const onChange = () => {
    if (state.value && props.option) return
    state.value = !state.value
    console.log('state:', state.value.toString())
    emit('change', state.value)
}
const setValue = (val) => {
    console.log('setValue:', val)
    state.value = val
}
const convertToHue = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16) / 255
    const g = parseInt(hex.substring(3, 5), 16) / 255
    const b = parseInt(hex.substring(5, 7), 16) / 255

    const cmax = Math.max(r, g, b)
    const cmin = Math.min(r, g, b)
    const delta = cmax - cmin

    let hue = 0
    if (delta === 0) {
        hue = 0
    } else if (cmax === r) {
        hue = ((g - b) / delta) % 6
    } else if (cmax === g) {
        hue = (b - r) / delta + 2
    } else {
        hue = (r - g) / delta + 4
    }
    hue = Math.round(hue * 60)
    return hue
}

defineExpose({ setValue })
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
    box-shadow: inset 2px 2px 20px black;
}
</style>
