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
    async checkIO (id) {
        // Lee los logs del usuario id y cambia de estado el ultimo registro
        const logs = await fb.getCollectionFlex(`${state.path}/timeLogs`, { field: 'uid', val: id })
        const pl = {
            activo: false,
            uid: id
        }
        if (logs.length) {
            pl.activo = !logs[logs.length - 1].activo
        } else {
            pl.activo = true
        }
        console.log('checkIO payload:', pl)
        const fnd = state.users.find(x => x.id === pl.uid)
        if (pl.activo) {
            addGuardia(fnd)
            ui.actions.notify('Persona entrante: ' + fnd.name, 'success')
        } else {
            delGuardia(pl.uid)
            ui.actions.notify('Persona saliente:' + fnd.name, 'error')
        }
        const now = new Date().getTime().toString()
        await fb.setDocument(`${state.path}/timeLogs`, pl, now)
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
