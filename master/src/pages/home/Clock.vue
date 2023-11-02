<template>
    <div>
        <div class="time">
            {{ currentTime.toLocaleTimeString('en-GB') }}
        </div>
        <div class="day">
            {{ currentTime.toLocaleDateString('es-ES') }}
        </div>
    </div>
</template>

<script type="module">
import { useCurrentTime } from './useCurrentTime'
export default {
    name: 'CurrentTimeExample',
    setup () {
        const { currentTime } = useCurrentTime()
        console.log(currentTime.value)

        return { currentTime }
    }
}
</script>

<style scoped>
.time {
    font-size: 10vw;
    color: white;
    font-weight: bold;
    text-shadow: 1px 1px 9px black;
}

.day {
    font-size: 7vw;
    color: white;
    text-shadow: 1px 1px 9px black;
}
</style>
