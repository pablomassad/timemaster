<template>
    <div>
        <ConfirmDialog :prompt="showForm" @onClose="showAdmin = false" bg-color="white">
            <template #header>
                <div class="dialogTitle">
                    Confirmar acción
                </div>
            </template>
            <template #default>
                <div class="actionFrame">
                    <Btn3d ref="refEntrada" text="Entrada" color="#0eee60" @change="onChangeEntrada" option />
                    <Btn3d ref="refSalida" text="Salida" color="#ff0000" @change="onChangeSalida" option />
                </div>
                <div v-if="isManual" class="manualPanel">
                    <q-input flat dense clearable v-model="fechaManual" label="Fecha" @click="selectFecha()" />
                    <q-input flat dense clearable v-model="horaManual" label="Hora" @click="selectHora()" />
                    <q-input v-model="comentario" filled type="textarea" label="Comentario" class="comment" />
                </div>
            </template>
            <template #footer>
                <div class="btnContainer">
                    <q-btn glossy round color="primary" icon="close" @click="cancelCheckIO"></q-btn>
                    <Btn3d ref="refManual" text="MANUAL" color="#00e2ff" @change="onChangeManual" />
                    <!--<q-btn glossy color="orange" icon="report_problem"  @click="manualAction">MANUAL</q-btn>-->
                    <q-btn glossy round color="primary" icon="check" @click="acceptCheckIO"></q-btn>
                </div>
            </template>
        </ConfirmDialog>
        <ModalPanel :modalActive="showFecha" @close="onFechaOKClick">
            <div>
                <q-date v-model="data.selectedDate" mask="DD-MM-YYYY" title="Fecha" text-color="white" :locale="data.myLocale" />
            </div>
        </ModalPanel>
        <ModalPanel :modalActive="showHora" @close="onHoraOKClick">
            <div>
                <q-time v-model="data.selectedTime" mask="HH:mm" title="Hora" text-color="white" format24h />
            </div>
        </ModalPanel>
        <ConfirmDialog :prompt="showConfirm" message="¿Está seguro que confirma esta acción ?" :onCancel="onCancelDialog" :onAccept="onAcceptDialog" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { ui } from 'fwk-q-ui'
import ConfirmDialog from 'fwk-q-confirmdialog'
import appStore from 'src/pages/appStore'
import Btn3d from './Btn3d.vue'
import ModalPanel from './ModalPanel.vue'
import moment from 'moment'

console.log('Admin CONSTRUCTOR............')

const refEntrada = ref()
const refSalida = ref()

const showForm = ref(false)
const emit = defineEmits(['onCheckIO'])
const usr = ref()
const isManual = ref(false)
const showFecha = ref(false)
const fechaManual = ref(moment().format('DD/MM/YYYY'))
const showHora = ref(false)
const horaManual = ref(moment().format('HH:mm'))
const data = reactive({
    selectedDate: '',
    datePickerTitle: '',
    myLocale: {
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split(
            '_'
        ),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
            '_'
        ),
        monthsShort:
            'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split(
                '_'
            ),
        firstDayOfWeek: 1
    }
})
const comentario = ref()
const showConfirm = ref(false)
const onAcceptDialog = ref()
const onCancelDialog = ref()

onMounted(async () => {
    console.log('CheckIO onMounted Event!!!')
})
const onChangeEntrada = (val) => {
    console.log('onChangeEntrada:', val)
    refSalida.value.setValue(!val)
}
const onChangeSalida = (val) => {
    console.log('onChangeSalida:', val)
    refEntrada.value.setValue(!val)
}
const onChangeManual = (val) => {
    isManual.value = val
}
const show = (uid) => {
    showForm.value = true
    usr.value = appStore.state.users.find(x => x.id === uid)
}
const selectFecha = () => {
    data.selectedDate = fechaManual.value
    showFecha.value = true
}
const onFechaOKClick = () => {
    showFecha.value = false
    fechaManual.value = data.selectedDate
        ? data.selectedDate
        : fechaManual.value
}
const selectHora = () => {
    data.selectedTime = horaManual.value
    showHora.value = true
}
const onHoraOKClick = () => {
    showHora.value = false
    horaManual.value = data.selectedTime
        ? data.selectedTime
        : horaManual.value
}
const cancelCheckIO = () => {
    showForm.value = false
}
const acceptCheckIO = () => {
    if (!comentario.value && isManual.value) {
        ui.actions.notify('El comentario es obligatorio!', 'error')
    } else {
        showConfirm.value = true
        onAcceptDialog.value = async () => {
            showConfirm.value = false
            const action = (usr.value.isWorking) ? 'checkout' : 'checkin'
            appStore.actions.checkIO(usr.value.id, action, comentario.value)
            showForm.value = false
        }
        onCancelDialog.value = () => {
            showConfirm.value = false
        }
    }
}

watch(() => (refSalida.value && refEntrada.value), (newUsr) => {
    if (refSalida.value === null) return
    if (usr.value.isWorking) {
        refSalida.value.setValue(true)
    } else {
        refEntrada.value.setValue(true)
    }
})
watch(() => showForm.value, (newVal) => {
    if (newVal === true) {
        console.log('watch showForm:', newVal)
        horaManual.value = moment().format('HH:mm')
        fechaManual.value = moment().format('DD/MM/YYYY')
        comentario.value = ''
        isManual.value = false
    }
})
defineExpose({ show })
</script>

<style scoped lang="scss">
.dialogTitle {
    font-size: 24px;
    text-align: center;
}

.manualPanel {
    margin: 16px;
    box-shadow: 1px 1px 5px gray;
    padding: 16px;
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
    width: 100%;
}

.comment {
    margin-top: 20px;
}

.actionFrame {
    display: flex;
    gap: 10px;
    justify-content: center;
}
</style>
