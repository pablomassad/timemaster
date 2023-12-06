<template>
    <div>
        <div class="title">Listado de turnos por mes</div>
        <div class="grdCombos">
            <q-select :options="appStore.state.years" behavior="menu" label="Seleccione año" v-model="selYear" option-label="name" option-value="id" @update:model-value="onSelYear" class="combo" outlined></q-select>
            <q-select :options="appStore.state.months" behavior="menu" label="Seleccione mes" v-model="selMonth" option-label="name" option-value="id" @update:model-value="onSelMonth" class="combo" outlined></q-select>
        </div>

        <div v-if="processedData.length > 0">
            <div class="rowMatrix">
                <div class="header">Fecha</div>
                <div class="header">Mañana</div>
                <div class="header">Tarde</div>
                <div class="header">Noche</div>
            </div>
            <div v-for="item in processedData" :key="item" class="rowMatrix">
                <div style="background:lightgray">{{ item.fecha }}</div>
                <div :style="{background: evalBgColor(item.turnos.mañana)}">{{ item.turnos.mañana }}</div>
                <div :style="{background: evalBgColor(item.turnos.tarde)}">{{ item.turnos.tarde }}</div>
                <div :style="{background: evalBgColor(item.turnos.noche)}">{{ item.turnos.noche }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import appStore from 'src/pages/appStore'
import moment from 'moment'

console.log('Report CONSTRUCTOR............')

const colores = [
    '#b1f6d2',
    '#ffffad',
    '#ff9595',
    '#bad9f7',
    '#e6c1e6'
]
const selYear = ref()
const selMonth = ref()
const processedData = ref([])

onMounted(() => {
    console.log('onMounted Hours')
})
const evalBgColor = (u) => {
    const idx = appStore.state.users.findIndex(x => x.name === u)
    return colores[idx]
}
const onSelYear = async (e) => {
    console.log('selYear:', e.id)
    selYear.value = e
}
const onSelMonth = async (e) => {
    console.log('selMonth:', e.id)
    selMonth.value = e
    const arr = await appStore.actions.getHoursByMonth(selYear.value.id, selMonth.value.id)
    console.log(arr)
    processData(arr)
}

const processData = (arr) => {
    const data = {}
    arr.forEach(obj => {
        const fecha = moment(obj.datetime).format('DD').toString() // d.toISOString().split('T')[0]
        const hora = new Date(obj.datetime).toTimeString().split(' ')[0].split(':')[0]
        const turno = hora < 6 ? 'mañana' : hora < 14 ? 'tarde' : 'noche'

        if (!data[fecha]) {
            data[fecha] = { fecha, turnos: {} }
        }
        data[fecha].turnos[turno] = obj.name
    })
    console.log('processedData:', Object.values(data))
    processedData.value = Object.values(data)
}
</script>

<style scoped lang="scss">
.title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin: 20px;
}

.grdTotals {
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-size: 20px;
    justify-items: center;
    margin: auto;
    margin-bottom: 20px;
}

.grdCombos {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.combo {
    margin: 16px;
}

.rowLog {
    display: grid;
    grid-template-columns: 1fr 200px;
    align-items: center;
    border: 1px solid gray;
    margin: 0 16px;
    justify-items: center;
}

.rowMatrix {
    display: grid;
    grid-template-columns: 40px 1fr 1fr 1fr;
    align-items: center;
    border: 1px solid gray;
    margin: 0 16px;
    text-align: center;
    background-color: #777;
    min-width: 480px;
}

.header {
    font-size: 15px;
    font-weight: bold;
    background-color: #c2c2c2;
}

.info {
    font-size: 14px;
}
</style>
