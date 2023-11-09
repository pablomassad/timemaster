<template>
    <div>
        <div class="title">Liquidación de horas horas</div>
        <q-select :options="appStore.state.months" behavior="menu" label="Seleccione mes" v-model="selMonth" option-label="name" option-value="id" @update:model-value="onSelMonth" class="combo" outlined></q-select>
        <div v-if="timeLogs.length > 0">
            <div class="rowLog" style="background-color: rgb(8, 210, 59);">
                <div class="header">id</div>
                <div class="header">Fecha/Hora</div>
                <div class="header">Empleado</div>
            </div>
            <div v-for="log in timeLogs" :key="log" class="rowLog">
                <div class="info">{{ log.id }}</div>
                <div class="info">{{ moment(log.datetime).format('DD/MM/YY HH:mm') }}</div>
                <div class="info">{{ log.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import appStore from 'src/pages/appStore'
import moment from 'moment'

console.log('Hours CONSTRUCTOR............')

const selMonth = ref()
const timeLogs = ref([])

onMounted(() => {
    console.log('onMounted Hours')
})

const onSelMonth = async (e) => {
    console.log(e.id)
    selMonth.value = e
    timeLogs.value = await appStore.actions.getHoursByMonth(e.id)
    console.log(timeLogs.value)
}
</script>

<style scoped lang="scss">
.title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin: 20px;
}

.combo {
    margin: 16px;
}

.rowLog {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    align-items: center;
    border: 1px solid gray;
    margin: 0 16px;
    justify-items: center;
}

.header {
    font-size: 15px;
    font-weight: bold;
}

.info {
    font-size: 14px;
}
</style>
