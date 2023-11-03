<template>
    <div class="backIntegralmente">
        <div v-if="appStore.state.user">
            <div class="logoFrame">
                <img src="images/tn.png" class="logo">
            </div>
            <div class="estado username">Bienvenido {{ appStore.state.user.name }}</div>
            <div class="qrFrame">
                <div class="dialogTitle subtitle">
                    Escaneá el código QR
                </div>
                <qrcode-vue ref="qrRef" :value="QRValue" class="picQR" />
            </div>
        </div>
        <div v-if="!appStore.state.user">
            <qrcode-stream @detect="onDecode"></qrcode-stream>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import appStore from 'src/pages/appStore'

const QRValue = ref()
const showQR = ref(false)
const showScanner = ref(false)

onMounted(async () => {
    await appStore.actions.initApp()
})
const generateQR = async (ev) => {
    QRValue.value = JSON.stringify({ id: appStore.state.user.id, datetime: new Date().getTime() })
    console.log('generateQR...................:', QRValue.value)
    showQR.value = true
}
const onDecode = (deco) => {
    const obj = JSON.parse(deco[0].rawValue)
    appStore.actions.findUserById(obj.id)
    console.log('obj scanned:', obj)
}
watch(() => appStore.state.user, (newUser) => {
    console.log('watch user:', newUser)
    if (newUser !== null) {
        generateQR()
        setInterval(() => {
            generateQR()
        }, 60000)
    }
}, { immediate: true })
</script>

<style scoped lang="scss">
.username {
    text-align: center;
    font-weight: bold;
    font-size: 5vw;
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

.rowEstado {
    position: relative;
    display: grid;
    grid-template-columns: 28vw 31vw 10vw;
    align-items: center;
    text-align: center;
    justify-content: center;
}

.estado {
    font-size: 8vw;
}

.statusLed {
    border-radius: 50%;
    width: 8vw;
    height: 8vw;
    background-color: red;
    border: 2px solid black;
}

.activo {
    background-color: green;
}

.statusText {
    font-size: 8vw;
    font-weight: bold;
}

.dialogTitle {
    text-align: center;
    width: 100%;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 1px 1px 1px white;
}

.subtitle {
    font-size: 5vw;
    font-weight: normal;
    margin-bottom: 40px;
}

.picQR {
    width: 100% !important;
    height: 100% !important;
}

.qrFrame {
    background-color: white;
    border-radius: 10px;
    box-shadow: 1px 1px 4px gray;
    margin: auto;
    padding: 10vw;
    margin: 10vw;
    padding-top: 5vw;
}

@media screen and(min-width:600px) {
    .logoFrame {
        height: 250px;
    }

    .logo {
        top: 40px;
        right: 0;
        left: 0;
        margin: auto;
        width: 310px;
        padding: 15px;
    }

    .qrFrame {
        width: 500px;
        padding: 50px;
        margin: auto;
        margin-top: 50px;

    }

    .subtitle {
        font-size: 24px;
    }

    .estado {
        font-size: 50px;
    }

    .username {
        font-size: 40px !important;
    }

    .statusText {
        font-size: 50px;
    }

    .rowEstado {
        grid-template-columns: 210px 178px 100px;
    }

    .statusLed {
        width: 50px;
        height: 50px;
    }
}
</style>
