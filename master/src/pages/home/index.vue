<template>
    <div class="backIntegralmente">
        <div v-if="!showScanner" class="timeFrame">
            <div class="logoFrame">
                <img src="images/tn.png" class="logo" :class="{masterClass: !!mastermode}" @click="adminUsers">
                <div class="btnScan" @click="scanQR">
                    <img src="images/scan.png" class="qr" />
                </div>
                <div class="time">
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
                            <div v-for="usr in appStore.state.users" :key="usr" class="avatar" @click="checkAction(usr)">
                                <img :src="usr.hiresUrl" class="imgAvatar" :class="{working: (usr.isWorking)}" />
                                <div class="userStatus" :style="{'background': evalStatusColor(usr)}"></div>
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

        <CheckIO ref="refCheckIO" />
        <Admin ref="refAdmin" />
        <div class="master" v-touch-hold.mouse="toggleMaster"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCurrentTime } from './useCurrentTime'
import appStore from 'src/pages/appStore'
import { QrcodeStream } from 'vue-qrcode-reader'
import { ui } from 'fwk-q-ui'
import Admin from './Admin/index.vue'
import CheckIO from './CheckIO/index.vue'

const refAdmin = ref()
const refCheckIO = ref()
const mastermode = ref(false)
const { currentTime } = useCurrentTime()
const showScanner = ref(false)
let userInfo

onMounted(async () => {
    await appStore.actions.initApp()
    appStore.actions.monitorUsers()
})
const adminUsers = () => {
    refAdmin.value.show()
}
const scanQR = () => {
    showScanner.value = true
}
const cancelQR = () => {
    showScanner.value = false
}
const checkAction = (usr) => {
    if (mastermode.value) {
        console.log('mastermode checkIO:', usr.name)
        refCheckIO.value.show(usr.id)
    }
}
const onDecode = async (deco) => {
    try {
        showScanner.value = false
        userInfo = JSON.parse(deco[0].rawValue)
        const now = new Date().getTime()
        console.log('obj scanned:', userInfo)
        if ((now - userInfo.datetime) > 60000) {
            console.log('Tiempo vencido de validacion QR')
            ui.actions.notify('Por favor escanea nuevamente el codigo QR.', 'info')
        } else {
            refCheckIO.value.show(userInfo.id)
        }
    } catch (error) {
        ui.actions.notify('Codigo Incorrecto!', 'error')
    }
}
const toggleMaster = () => {
    mastermode.value = !mastermode.value
    console.log('mastermode:', mastermode.value.toString())
}
const evalStatusColor = (usr) => {
    const stColor = (!usr.isWorking) ? 'radial-gradient(farthest-corner at 0px 0px, #faa 0%, #f00 50%)' : 'radial-gradient(farthest-corner at 0px 0px, #afa 0%, #090 50%)'
    return stColor
}

watch(() => appStore.state.users, (newUsers) => {
    console.log('watch users update:', newUsers)
}, { deep: true })

</script>

<style scoped lang="scss">
.master {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 40px;
}

.masterClass {
    box-shadow: 0 0 10px yellow !important;
}

.back {
    font-size: 50px;
    color: white;
    text-shadow: 1px 1px 1px black;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
}

.timeFrame {
    padding-top: 16px;
    max-width: 500px;
    margin: auto;
}

.time {
    font-size: 7vw;
    color: white;
    font-weight: bold;
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
    width: 90px;
    padding: 10px;
    max-width: 500px;
    box-shadow: 0px 0px 20px #c2c2c2;
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

.actionFrame {
    display: flex;
    justify-content: center;
}

@media screen and(min-width:600px) {
    .logoFrame {
        height: 300px;
    }

    .logo {
        margin: auto;
        width: 90px;
        padding: 10px;
    }

    .time {
        font-size: 40px;
    }

}
</style>
