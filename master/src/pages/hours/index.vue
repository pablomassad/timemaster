<template>
    <div>
        <div class="title">Listador de horas x empleado</div>
        <q-select :options="appStore.state.users" behavior="menu" label="Seleccione usuario" v-model="selUser" option-label="name" option-value="id" @update:model-value="onSelUser" class="combo" outlined></q-select>
        <div v-if="timeLogs.length > 0">
            <div class="rowLog" style="background-color: yellow;">
                <div class="header">id</div>
                <div class="header">Fecha/Hora</div>
                <div class="header">Acción</div>
            </div>
            <div v-for="log in timeLogs" :key="log" class="rowLog">
                <div class="info">{{ log.id }}</div>
                <div class="info">{{ moment(log.datetime).format('DD/MM/YY HH:mm') }}</div>
                <div class="info">{{ log.action }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import appStore from 'src/pages/appStore'
import moment from 'moment'

console.log('Hours CONSTRUCTOR............')

const selUser = ref()
const timeLogs = ref([])

onMounted(() => {
    console.log('onMounted Hours')
})

const onSelUser = async (e) => {
    console.log(e.id)
    selUser.value = e
    timeLogs.value = await appStore.actions.getUserHours(e.id)
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
    grid-template-columns: 200px 1fr 1fr;
    align-items: center;
    width: 400px;
    border: 1px solid gray;
    margin: auto;
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
