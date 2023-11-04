<template>
    <div class="backIntegralmente">
        <div v-if="!showScanner" class="timeFrame">
            <div class="logoFrame">
                <img src="images/tn.png" class="logo" @click="selecteUserToRegister">
                <div class="btnScan" @click="scanQR">
                    <img src="images/scan.png" class="qr" />
                </div>
                <div class="day">
                    {{ currentTime.toLocaleDateString('es-ES') }}
                </div>
                <div class="time">
                    {{ currentTime.toLocaleTimeString('en-GB') }}
                </div>
            </div>
            <div class="personalFrame">
                <div class="tipo">
                    <div class="porteria" v-if="appStore.state.users">
                        <div class="flexFrame">
                            <div v-for="(usr) in appStore.state.users" :key="usr" class="avatar">
                                <!--@click="showCheckIO = true"-->
                                <img :src="usr.hiresUrl" class="imgAvatar" :class="{working: (usr.isWorking === true)}" />
                                <div class="userStatus" :style="{'background': (!usr.isWorking) ? 'radial-gradient(farthest-corner at 0px 0px, #faa 0%, #f00 50%)' : 'radial-gradient(farthest-corner at 0px 0px, #afa 0%, #090 50%)'}"></div>
                                <div class="user">{{ usr.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showScanner">
            <q-icon name="arrow_back" class="back" @click="cancelQR"></q-icon>
            <qrcode-stream @detect="onDecode"></qrcode-stream>
        </div>
        <ConfirmDialog :prompt="showCheckIO" class="formDialog" bg-color="white">
            <template #header>
                <div class="title">
                    Confirmar acción
                </div>
            </template>
            <template #default>
                <Btn3d text="Entrada" color="red" @change="onChangeButton" />
            </template>
            <template #footer>
                <div class="btnContainer">
                    <q-btn glossy color="primary" icon="check" class="footerBtns" @click="cancel">Cancelar</q-btn>
                    <q-btn glossy color="primary" icon="check" class="footerBtns" @click="accept">Aceptar</q-btn>
                </div>
            </template>
        </ConfirmDialog>
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
                    <q-btn icon="download" @click="updateAPK"></q-btn>
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
import { ref, onMounted, watch } from 'vue'
import { useCurrentTime } from './useCurrentTime'
import appStore from 'src/pages/appStore'
import Btn3d from './Btn3d.vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import QrcodeVue from 'qrcode.vue'
import ConfirmDialog from 'fwk-q-confirmdialog'
import { ui } from 'fwk-q-ui'

const qrRef = ref()
const QRValue = ref()
const { currentTime } = useCurrentTime()
const userAction = ref('checkin')
const showCheckIO = ref(false)
const showScanner = ref(false)
const showPersonal = ref(false)
const selUser = ref()
const pass = ref()
const passOK = ref(false)

onMounted(async () => {
    await appStore.actions.initApp()
    await appStore.actions.getUsers()
})
const selecteUserToRegister = () => {
    showPersonal.value = true
}
const accept = () => {
    showPersonal.value = false
    selUser.value = undefined
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
const cancel = () => {
    showCheckIO.value = false
}
const onDecode = async (deco) => {
    try {
        const obj = JSON.parse(deco[0].rawValue)
        const now = new Date().getTime()
        showScanner.value = false
        console.log('obj scanned:', obj)
        if ((now - obj.datetime) > 60000) {
            console.log('Tiempo vencido de validacion QR')
            ui.actions.notify('Por favor escanea nuevamente el codigo QR.', 'info')
        } else {
            // showCheckIO.value = true
            const usr = appStore.state.users.find(x => x.id === obj.id)
            const action = (usr.isWorking) ? 'checkout' : 'checkin'
            appStore.actions.checkIO(usr.id, action)
        }
    } catch (error) {
        ui.actions.notify('Codigo Incorrecto!', 'error')
    }
}
const updateAPK = async () => {
    window.open('https://drive.google.com/file/d/1Hrs9k-RnuoTCI11NivBG36X4ObK1vtgh/view?usp=drive_link', '_system')
}

watch(() => appStore.state.users, (newUsers) => {
    console.log('watch users update:', newUsers)
}, { deep: true })

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

.time {
    font-size: 7vw;
    color: white;
    font-weight: bold;
    text-shadow: 1px 1px 9px black;
}

.day {
    font-size: 7vw;
    color: white;
    text-shadow: 1px 1px 9px black;
}

.flexFrame {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
    justify-content: center;
}

.avatar {
    position: relative;
    height: 144px;
}

.working {
    opacity: 1 !important;
    box-shadow: 0px 0px 20px black !important;
}

.userStatus {
    position: absolute;
    top: -10px;
    right: 5px;
    border-radius: 50%;
    box-shadow: 1px 1px 4px;
    width: 20px;
    height: 20px;
}

.imgAvatar {
    opacity: 0.3;
    box-shadow: none;
    border-radius: 5px;
    width: 80px;
    height: 100px;
    border: 2px solid;
}

.user {
    font-size: 11px;
    width: 90px;
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

.title {
    font-size: 22px;
    font-weight: bold;
    text-shadow: 1px 1px 1px white;
    text-align: center;
    padding-bottom: 10px;
}

.personalFrame {
    background: #e9e9e9;
    margin: 8px;
    padding-top: 16px;
    border-radius: 10px;
    box-shadow: inset 1px 1px 5px gray;
}

.logoFrame {
    display: grid;
    position: relative;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    width: 100%;
    height: 140px;
}

.logo {
    position: relative;
    display: flex;
    justify-content: center;
    /* top: 10%; */
    /* right: 0; */
    /* left: 0; */
    margin: auto;
    width: 28vw;
    padding: 2vw;
    max-width: 500px;
    box-shadow: 5px 5px 20px #7b7b7b;
    border-radius: 20px;
}

.btnScan {
    display: grid;
    text-align: center;
    background: #e6eaeb;
    justify-content: center;
    margin: auto;
    width: 80px;
    height: 80px;
    border-radius: 16px;
    color: gray;
    padding: 10px;
    border: 2px solid gray;
    box-shadow: 5px 5px 20px black;
}

.btnScan:active {
    box-shadow: none;
    padding: 12px
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
