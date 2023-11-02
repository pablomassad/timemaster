import { reactive, readonly } from 'vue'
import { ui } from 'fwk-q-ui'
import fb from 'fwk-q-firebase'
import { LocalStorage } from 'quasar'
import { ENVIRONMENTS } from 'src/environments'

fb.initFirebase(ENVIRONMENTS.firebase)

const state = reactive({
    path: undefined,
    config: undefined,
    users: undefined,
    curGuardias: LocalStorage.getItem('TN_curGuardias') || {},
    curMaestranza: LocalStorage.getItem('TN_curMaestranza')
})
const set = {
    users (o) {
        console.log('store set.users:', o)
        state.users = o
    },
    path (p) {
        console.log('store set path:', p)
        state.path = p
    },
    config (cfg) {
        console.log('store config:', cfg)
        state.config = cfg
    }
}
const actions = {
    async initApp () {
        const setting = await fb.getDocument('settings', ENVIRONMENTS.lugar)
        set.config(setting)
        set.path(`settings/${ENVIRONMENTS.lugar}`)
    },
    async getUsers () {
        const guardias = await fb.getCollectionFlex(`${state.path}/users`, { field: 'role', val: 'GUARDIA' })
        const maestranza = await fb.getCollectionFlex(`${state.path}/users`, { field: 'role', val: 'MAESTRANZA' })
        const coordinador = await fb.getCollectionFlex(`${state.path}/users`, { field: 'role', val: 'COORDINADOR' })
        const users = [...guardias, ...maestranza, ...coordinador]
        set.users(users)
        return users
    },
    async getCurGuardias () {
        const logsActivos = await fb.getCollectionFlex(`${state.path}/timeLogs`, { field: 'activo', val: true })
    },
    async checkIO (uid, action, type = 'online') {
        const fnd = state.users.find(x => x.id === pl.uid)
        const pl = {
            type, // offline - online - manual
            action,
            uid,
            name: fnd.name,
            datetime: new Date().getTime()
        }
        if (pl.action === 'checkin') {
            addGuardia(fnd)
            ui.actions.notify('Persona entrante: ' + fnd.name, 'success')
        }
        if (pl.action === 'checkout') {
            delGuardia(pl.uid)
            ui.actions.notify('Persona saliente: ' + fnd.name, 'error')
        }
        console.log('checkIO payload:', pl)
        await fb.setDocument(`${state.path}/timeLogs`, pl)
    }
}

export default {
    set,
    state: readonly(state),
    actions
}

function addGuardia (o) {
    console.log('addGuardia:', o)
    state.curGuardias[o.id] = o
    LocalStorage.set('TN_curGuardias', state.curGuardias)
}
function delGuardia (uid) {
    console.log('delGuardia:', uid)
    delete state.curGuardias[uid]
    LocalStorage.set('TN_curGuardias', state.curGuardias)
}
//    async createLotesCol() {
//    for (let index = 1; index <= 48; index++) {
//        const lote = {
//            id: index.toString(),
//            unitId: index.toString()
//        }
//        const path = `${state.path}/lotes`
//        await fb.setDocument(path, lote, lote.id)
//        console.log('lote creado:', lote)
//    }
// },
