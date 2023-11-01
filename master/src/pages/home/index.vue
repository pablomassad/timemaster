<template>
    <div class="backIntegralmente">
        <div v-if="!showScanner">
            <div class="logoFrame">
                <img src="images/tn.png" class="logo" @click="selecteUserToRegister">
            </div>
            <DigitalClock class="clockFrame" />
            <div class="personalFrame">
                <div class="tipo">
                    <div class="porteria" v-if="appStore.state.curGuardias !== null">
                        <div class="title"> PORTERIA </div>
                        <div class="rowActiveUser" v-for="(uid) in Object.keys(appStore.state.curGuardias)" :key="uid">
                            <div class="avatar">
                                <img :src="appStore.state.curGuardias[uid].hiresUrl" class="imgAvatar" />
                            </div>
                            <div class="user">{{ appStore.state.curGuardias[uid].name }}</div>
                        </div>
                    </div>
                    <div class="maestranza">
                        <div class="title">MAESTRANZA</div>
                        <div class="rowActiveUser">
                            <div class="avatar"></div>
                            <div class="user">GUSTAVO MENDEZ</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btnScan" @click="scanQR">
                <img src="images/scan.png" class="qr" />
                <div class="scanText">SCANEAR QR</div>
            </div>
        </div>
        <div v-if="showScanner">
            <q-icon name="arrow_back" class="back" @click="cancelQR"></q-icon>
            <qrcode-stream @detect="onDecode"></qrcode-stream>
        </div>
        <ConfirmDialog :prompt="showPersonal" class="formDialog" bg-color="white">
            <template #header>
                <div class="dialogTitle">
                    Seleccion de Usuario
                </div>
            </template>
            <template #default>
                <q-input v-if="!passOK" v-model="pass" type="password" label="Ingrese contraseña" @change="onPassword"></q-input>
                <div v-if="passOK">
                    <q-select :options="appStore.state.users" behavior="menu" label="Seleccione usuario" v-model="selUser" option-label="name" option-value="id" @update:model-value="onSelUser"></q-select>
                    <qrcode-vue v-if="selUser" ref="qrRef" :value="QRValue" class="picQR" />
                </div>
            </template>
            <template #footer>
                <div class="btnContainer">
                    <q-btn glossy color="primary" icon="check" class="footerBtns" @click="accept">Aceptar</q-btn>
                </div>
            </template>
        </ConfirmDialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, defineComponent, reactive } from 'vue'
import appStore from 'src/pages/appStore'
import DigitalClock from './Clock.vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import QrcodeVue from 'qrcode.vue'
import ConfirmDialog from 'fwk-q-confirmdialog'
import { ui } from 'fwk-q-ui'

const qrRef = ref()
const QRValue = ref()
const showScanner = ref(false)
const showPersonal = ref(false)
const selUser = ref()
const pass = ref()
const passOK = ref(false)

onMounted(async () => {
    console.log('onMounted:', appStore.state.curGuardias)
    await appStore.actions.initApp()
    await appStore.actions.getUsers()
})
const selecteUserToRegister = () => {
    showPersonal.value = true
}
const accept = () => {
    showPersonal.value = false
    selUser.value.valuel = undefined
}
const onPassword = (e) => {
    passOK.value = (e === 'admin1604')
    if (!passOK.value) { ui.actions.notify('Contraseña incorrecta!') }
}
const onSelUser = (e) => {
    console.log(e.id)
    selUser.value = e
    QRValue.value = JSON.stringify({ id: e.id })
}
const scanQR = () => {
    showScanner.value = true
}
const cancelQR = () => {
    showScanner.value = false
}
const onDecode = async (deco) => {
    const obj = JSON.parse(deco[0].rawValue)
    const now = new Date().getTime()
    showScanner.value = false
    console.log('obj scanned:', obj)
    if ((now - obj.datetime) > 60000) {
        console.log('Tiempo vencido de validacion QR')
        ui.actions.notify('Por favor escanee nuevamente el codigo QR.', 'info')
    } else {
        appStore.actions.checkIO(obj.id)
    }
}

</script>

<style scoped>
.back {
    font-size: 50px;
    color: white;
    text-shadow: 1px 1px 1px black;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
}

.rowActiveUser {
    display: grid;
    grid-template-columns: 10vw 55vw;
    align-items: center;
    justify-items: center;
    margin: 10px 0;
    border-bottom: 1px solid gray;
}

.imgAvatar {
    box-shadow: 1px 1px 5px gray;
    border-radius: 5px;
    width: 8vw;
    height: 8vw;
}

.user {
    font-size: 4vw;
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

.title {
    font-size: 20px;
    font-weight: bold;
    text-shadow: 1px 1px 1px white;
    text-align: center;
}

.personalFrame {
    background: white;
    margin: 20px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: inset 1px 1px 5px gray;
}

.logoFrame {
    position: relative;
    width: 100%;
    height: 35vw;
}

.logo {
    position: absolute;
    top: 20%;
    right: 0;
    left: 0;
    margin: auto;
    width: 50vw;
    padding: 2vw;
    max-width: 500px;
    box-shadow: 5px 5px 20px #7b7b7b;
    border-radius: 20px;
}

.clockFrame {
    display: grid;
    justify-items: center;
}

.btnScan {
    display: grid;
    text-align: center;
    background: #e6eaeb;
    justify-content: center;
    margin: auto;
    width: 30vw;
    height: 30vw;
    border-radius: 40px;
    color: gray;
    padding: 20px;
    border: 2px solid gray;
    box-shadow: 5px 5px 20px black;
}

.btnScan:active {
    box-shadow: none;
    padding: 22px
}

.scanText {
    font-size: 2vw;
}

.qr {
    width: 100%;
}

@media screen and(min-width:600px) {
    .logoFrame {
        height: 300px;
    }

    .logo {
        top: 40px;
        right: 0;
        left: 0;
        margin: auto;
        width: 310px;
        padding: 15px;
    }
}
</style>
