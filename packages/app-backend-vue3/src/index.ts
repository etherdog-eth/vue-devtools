import { DevtoolsBackend, BuiltinBackendFeature } from '@vue-devtools/app-backend-api'
import { ComponentWalker } from './components/tree'
import { getInstanceDetails } from './components/data'
import { getInstanceName, getInstanceOrVnodeRect } from './components/util'
import { getComponentInstanceFromElement } from './components/el'

export const backend: DevtoolsBackend = {
  frameworkVersion: 3,

  availableFeatures: [
    BuiltinBackendFeature.COMPONENTS
  ],

  setup (api) {
    api.on.getAppRecordName(payload => {
      if (payload.app._component) {
        payload.name = payload.app._component.name
      }
    })

    api.on.getAppRootInstance(payload => {
      if (payload.app._container?._vnode?.component) {
        payload.root = payload.app._container?._vnode?.component
      }
    })

    api.on.walkComponentTree((payload, ctx) => {
      const walker = new ComponentWalker(payload.maxDepth, payload.filter, ctx)
      payload.componentTreeData = walker.getComponentTree(payload.componentInstance)
    })

    api.on.walkComponentParents((payload, ctx) => {
      const walker = new ComponentWalker(0, null, ctx)
      payload.parentInstances = walker.getComponentParents(payload.componentInstance)
    })

    api.on.inspectComponent(async (payload, ctx) => {
      payload.instanceData = await getInstanceDetails(payload.componentInstance, ctx)
    })

    api.on.getComponentName(async payload => {
      payload.name = await getInstanceName(payload.componentInstance)
    })

    api.on.getComponentBounds(async payload => {
      payload.bounds = await getInstanceOrVnodeRect(payload.componentInstance)
    })

    api.on.getElementComponent(payload => {
      payload.componentInstance = getComponentInstanceFromElement(payload.element)
    })

    // @TODO
  }
}
