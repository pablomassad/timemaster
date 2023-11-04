<template>
    <div>
        <ConfirmDialog :prompt="showForm" noPersistant @onClose="showAdmin = false" bg-color="white">
            <template #header>
                <div class="title">
                    Confirmar acción
                </div>
            </template>
            <template #default>
                <div class="actionFrame">
                    <Btn3d text="Entrada" color="red" @change="onChangeButton" />
                    <Btn3d text="Entrada" color="red" @change="onChangeButton" />
                </div>
            </template>
            <template #footer>
                <div class="btnContainer">
                    <q-btn glossy color="primary" icon="check" class="footerBtns" @click="cancelCheckIO">Cancelar</q-btn>
                    <q-btn glossy color="primary" icon="check" class="footerBtns" @click="acceptCheckIO">Aceptar</q-btn>
                </div>
            </template>
        </ConfirmDialog>
        <ConfirmDialog :showFlag="promptConfirm" message="¿Está seguro que confirma la accion ?" :onCancel="onCancelDialog" :onAccept="onAcceptDialog" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ui } from 'fwk-q-ui'
import ConfirmDialog from 'fwk-q-confirmdialog'
import appStore from 'src/pages/appStore'
import Btn3d from './Btn3d.vue'

console.log('Admin CONSTRUCTOR............')

const showForm = ref(false)
const promptConfirm = ref(false)
const onAcceptDialog = ref()
const onCancelDialog = ref()

const emit = defineEmits(['onCheckIO'])
let userId

onMounted(async () => {

})

const show = (uid) => {
    showForm.value = true
    userId = uid
}
const cancelCheckIO = () => {
    showForm.value = false
}
const acceptCheckIO = () => {
    showForm.value = false
    const usr = appStore.state.users.find(x => x.id === userId)
    const action = (usr.isWorking) ? 'checkout' : 'checkin'
    appStore.actions.checkIO(usr.id, action)
}
const confirmAction = () => {
    promptConfirm.value = true
    onAcceptDialog.value = async () => {
        promptConfirm.value = false
    }
    onCancelDialog.value = () => {
        promptConfirm.value = false
    }
}

defineExpose({ show })
</script>

<style scoped lang="scss">
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
</style>
