<template>
    <div>
        <ConfirmDialog :prompt="showAdmin" noPersistant @onClose="onClose" bg-color="white">
            <template #header>
                <div class="dialogTitle">
                    Seleccion de Usuario (v{{ appStore.state.config.version_timemaster }})
                </div>
            </template>
            <template #default>
                <q-input v-if="!passOK" v-model="pass" type="password" label="Ingrese contraseña" @change="onPassword" autofocus></q-input>
                <div v-if="passOK">
                    <q-select :options="appStore.state.users" behavior="menu" label="Seleccione usuario" v-model="selUser" option-label="name" option-value="id" @update:model-value="onSelUser"></q-select>
                    <qrcode-vue v-if="selUser" ref="qrRef" :value="QRValue" class="picQR" />
                    <q-btn icon="download" @click="updateAPK" class="btnDownload"></q-btn>
                </div>
            </template>
            <template #footer>
                <div></div>
            </template>
        </ConfirmDialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ui } from 'fwk-q-ui'
import ConfirmDialog from 'fwk-q-confirmdialog'
import appStore from 'src/pages/appStore'
import QrcodeVue from 'qrcode.vue'

console.log('Admin CONSTRUCTOR............')

const QRValue = ref()
const qrRef = ref()
const selUser = ref()
const pass = ref()
const passOK = ref(false)
const showAdmin = ref(false)

onMounted(async () => {
})
const show = () => {
    showAdmin.value = true
}
const onClose = () => {
    showAdmin.value = false
    pass.value = ''
}
const onPassword = (e) => {
    passOK.value = (e === 'admin1604')
    if (!passOK.value) { ui.actions.notify('Contraseña incorrecta!') }
}
const updateAPK = async () => {
    window.open('https://drive.google.com/file/d/1Hrs9k-RnuoTCI11NivBG36X4ObK1vtgh/view?usp=drive_link', '_system')
}
const onSelUser = (e) => {
    console.log(e.id)
    selUser.value = e
    QRValue.value = JSON.stringify({ id: e.id })
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.dialogTitle {
    font-size: 24px;
    text-align: center;
}

.picQR {
    width: 200px !important;
    height: 200px !important;
    margin: 20px;
    justify-content: center;
    display: grid;
    justify-self: center;
    margin: auto;
    margin-top: 50px;
}

.btnContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btnDownload {
    background: orange;
    display: flex;
    margin: auto;
    margin-top: 20px;
}
</style>
