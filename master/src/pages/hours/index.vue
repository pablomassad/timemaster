<template>
    <div>
        <div class="title">Listador de horas x empleado</div>
        <div class="grdCombos">
            <q-select :options="appStore.state.years" behavior="menu" label="Seleccione año" v-model="selYear" option-label="name" option-value="id" @update:model-value="onSelYear" class="combo" outlined></q-select>
            <q-select :options="appStore.state.months" behavior="menu" label="Seleccione mes" v-model="selMonth" option-label="name" option-value="id" @update:model-value="onSelMonth" class="combo" outlined></q-select>
        </div>

        <div v-if="days.length > 0">
            <!--<div class="rowMatrix ">
                <div class="header"></div>
                <div v-for="usr in appStore.state.users" :key="usr">
                </div>
            </div>-->
            <div class="rowMatrix ">
                <div class="header">Fecha</div>
                <div v-for="usr in appStore.state.users" :key="usr">
                    <div class="header">Turnos: {{ turns[usr.uid] }}</div>
                    <div class="header">{{ usr.name }}</div>
                </div>
            </div>
            <div v-for="day in days" :key="day" class="rowMatrix">
                <div class="info">{{ day }}</div>
                <div v-for="usr in appStore.state.users" :key="usr" class="info">
                    <div :style="{background: evalBgColor(evalTurno(day, usr.uid))}">{{ evalTurno(day, usr.uid) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import appStore from 'src/pages/appStore'
import moment from 'moment'

console.log('Hours CONSTRUCTOR............')

const selYear = ref()
const selMonth = ref()
const days = ref([])
const timeLog = ref([])
const turns = ref({})

onMounted(() => {
    console.log('onMounted Hours')
})
const onSelYear = async (e) => {
    console.log('selYear:', e.id)
    selYear.value = e
}
const onSelMonth = async (e) => {
    console.log('selMonth:', e.id)
    selMonth.value = e
    timeLog.value = await appStore.actions.getHoursByMonth(selYear.value.id, selMonth.value.id)
    console.log(timeLog.value)
    processDates()
}
const processDates = () => {
    const uniqueDays = {}
    timeLog.value.forEach(obj => {
        const d = moment(obj.datetime).format('DD').toString()
        if (!uniqueDays[d]) {
            uniqueDays[d] = true
        }
    })
    days.value = Object.keys(uniqueDays)
    appStore.actions.sortArray(days.value, null, 1)

    for (const d of days.value) {
        for (const usr of appStore.state.users) {
            if (evalTurno(d, usr.uid)) {
                if (!turns.value[usr.uid]) { turns.value[usr.uid] = 0 }
                turns.value[usr.uid] = turns.value[usr.uid] + 1
            }
        }
    }
    console.log('turns:', turns.value)
}
const evalBgColor = (turno) => {
    let bg = '#aaa'
    switch (turno) {
        case 'mañana':
            bg = '#ffffa6'
            break
        case 'tarde':
            bg = '#f7b98a'
            break
        case 'noche':
            bg = '#c4d0ff'
            break

        default:
            break
    }
    return bg
}
const evalTurno = (d, uid) => {
    let res
    const fnd = timeLog.value.find(x => (getDay(x.datetime) === d) && (x.uid === uid))
    if (fnd) {
        const hora = new Date(fnd.datetime).toTimeString().split(' ')[0].split(':')[0]
        res = hora < 7 ? 'mañana' : hora < 15 ? 'tarde' : 'noche'
    }
    return res
}
const getDay = (dt) => {
    const day = moment(dt).format('DD').toString()
    return day
}
</script>

<style scoped lang="scss">
.title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin: 20px;
}

.grdCombos {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.combo {
    margin: 16px;
}

.rowMatrix {
    display: grid;
    grid-template-columns: 40px 1fr 1fr 1fr 1fr 1fr;
    align-items: center;
    text-align: center;
    border: 1px solid rgb(72, 72, 72);
    margin: 0 16px;
    background-color: #aaa;
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
