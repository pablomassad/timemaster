<template>
    <Layout isRoot>
        <template #drawer>
            <q-separator />
            <div class="menuRow" @click="searchUpdates()">
                <q-icon name="update" class="iconMenu" />
                <div class="rowText">Buscar actualización</div>
            </div>
            <q-separator />
            <div class="menuRow" @click="logout()">
                <q-icon name="logout" class="iconMenu" />
                <div class="rowText">Salir</div>
            </div>
            <q-separator />
        </template>
    </Layout>
    <div class="logoFrame">
        <img src="images/tn.png" class="logo" />
    </div>
    <ConfirmDialog :prompt="prompt" :message="dialogMessage" :onCancel="onCancelDialog" :onAccept="onAcceptDialog" />
</template>

<script setup>
import { ref } from 'vue'
import Layout from './fwk-q-layout/index.vue'
import appStore from 'src/pages/appStore'
import ConfirmDialog from 'fwk-q-confirmdialog'
import { ENVIRONMENTS } from 'src/environments'
import { LocalStorage } from 'quasar'
import { ui } from 'fwk-q-ui'
import { main } from 'fwk-q-main'

const prompt = ref(false)
const dialogMessage = ref('')
const onAcceptDialog = ref()
const onCancelDialog = ref()

const searchUpdates = () => {
    if (ENVIRONMENTS.versionName < appStore.state.config.version_timemaster || !main.state.isMobile) {
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
const logout = () => {
    alert('No disponible')
}
</script>

<style lang="scss" scoped>
.logoFrame {
    position: fixed;
    top: -12px;
    left: 0;
    right: 0;
    width: 145px;
    height: 65px;
    overflow: hidden;
    margin: auto;
    z-index: 10000;
}

.logo {
    width: 150px;
}

.menuRow {
    display: flex;
    align-items: center;
    margin: 10px;
    width: 200px;
}

.rowText {
    font-size: 15px;
    color: gray;
}

.iconMenu {
    font-size: 26px;
    text-shadow: 1px 1px 1px gray;
    margin-right: 10px;
    color: rgb(38, 81, 181);
}

.body--dark {

    .iconMenu {
        color: #97b6ff;
    }

    .rowText {
        color: white;
    }

    .env {
        color: white;
    }

}
</style>
