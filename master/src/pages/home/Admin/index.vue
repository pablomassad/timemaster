<template>
    <div>
        <ConfirmDialog :prompt="showAdmin" noPersistant @onClose="onClose" bg-color="white">
            <template #header>
                <div class="dialogTitle">
                    Seleccion de Usuario (v{{ ENVIRONMENTS.versionName }})
                </div>
            </template>
            <template #default>
                <q-input v-if="!passOK" v-model="pass" type="password" label="Ingrese contraseña" @change="onPassword" autofocus></q-input>
                <div v-if="passOK">
                    <q-select :options="appStore.state.users" behavior="menu" label="Seleccione usuario" v-model="selUser" option-label="name" option-value="id" @update:model-value="onSelUser"></q-select>
                    <qrcode-vue v-if="selUser" ref="qrRef" :value="QRValue" class="picQR" />
                    <q-btn icon="download" @click="searchUpdates" class="btnDownload"></q-btn>
                </div>
            </template>
            <template #footer>
                <div></div>
            </template>
        </ConfirmDialog>
        <ConfirmDialog :prompt="prompt" :message="dialogMessage" :onCancel="onCancelDialog" :onAccept="onAcceptDialog" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ui } from 'fwk-q-ui'
import ConfirmDialog from 'fwk-q-confirmdialog'
import appStore from 'src/pages/appStore'
import QrcodeVue from 'qrcode.vue'
import { ENVIRONMENTS } from 'src/environments'

console.log('Admin CONSTRUCTOR............')

const QRValue = ref()
const qrRef = ref()
const selUser = ref()
const pass = ref()
const passOK = ref(false)
const showAdmin = ref(false)

const prompt = ref(false)
const dialogMessage = ref('')
const onAcceptDialog = ref()
const onCancelDialog = ref()

onMounted(async () => {
    setTimeout(() => {
        searchUpdates()
    }, 5000)
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
const searchUpdates = () => {
    if (ENVIRONMENTS.versionName < appStore.state.config?.version_timemaster) {
        prompt.value = true
        dialogMessage.value = 'Hay una nueva version de la aplicación, desea instalarla?'
        onAcceptDialog.value = async () => {
            window.open(appStore.state.config.url_timemaster, '_system')
        }
        onCancelDialog.value = () => {
            prompt.value = false
        }
    } else { ui.actions.notify('No hay nuevas actualizaciones!', 'info', { position: 'center' }) }
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
