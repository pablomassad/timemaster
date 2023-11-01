import { reactive, readonly } from 'vue'
import { ui } from 'fwk-q-ui'
import fb from 'fwk-q-firebase'
import { LocalStorage } from 'quasar'
import { ENVIRONMENTS } from 'src/environments'

fb.initFirebase(ENVIRONMENTS.firebase)

const state = reactive({
    path: undefined,
    config: undefined,
    user: LocalStorage.getItem('TN_user')
})
const set = {
    user (o) {
        console.log('store set.user:', o)
        state.user = o
        LocalStorage.set('TN_user', o)
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
    async findUserById (id) {
        ui.actions.notify('Id user: ' + id, 'info')
        // const u = await fb.getCollectionFlex(`${state.path}/users`, { field: 'id', val: id })[0]
        const u = await fb.getDocument(`${state.path}/users`, id)
        set.user(u)
        return u
    },
    async subscribeToFCM () {
        const vapidKey = 'BP6nPflTuZhSgdqiyDaPMLxYy3o2gvcMM_oUl1NFP-CkMIgnAiXfOKeOhrNbjhCUOKVNEosPR4U9j2t_NSLhjy4'
        await fb.saveMessagingDeviceToken(state.document, vapidKey, state.document)
    }
}

export default {
    set,
    state: readonly(state),
    actions
}
