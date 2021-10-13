import { Ref, ref, reactive, computed } from 'vue'
import { Step, positionConf } from '../src/steps-guide-types'

export function useStepsGuideNav(steps: Step[], stepIndex:Ref<number>) {
  
  const currentStep = computed<Step>(() => {
    const _step = steps[stepIndex.value]
    _step.position = _step.position || 'top'
    return _step
  })
  const guideClassList = ['d-steps-guide']
  const stepsRef = ref(null)
  const guidePosition = reactive({
    left: '',
    top: '',
    zIndex: 1100
  })
  const updateGuidePosition = () => {
    const baseTop = window.pageYOffset - document.documentElement.clientTop
    const baseLeft = window.pageXOffset - document.documentElement.clientLeft
    const currentStepPosition:positionConf = currentStep.value.position
    let _left, _top
    // 自定义 position位置
    if (typeof currentStepPosition !== 'string') {
      const { top = 0, left = 0, type = 'top' } = currentStepPosition
      guideClassList.splice(1, 1, type)
      _left = left
      _top = top
    } else {
      guideClassList.splice(1, 1, currentStepPosition)
      const stepGuideElement = stepsRef.value
      const triggerSelector = currentStep.value.target || currentStep.value.trigger
      const triggerElement = document.querySelector(triggerSelector)
      const targetRect = triggerElement.getBoundingClientRect()
      _left = targetRect.left + triggerElement.clientWidth / 2 - stepGuideElement.clientWidth / 2 + baseLeft
      _top = targetRect.top + triggerElement.clientHeight / 2 - stepGuideElement.clientHeight / 2 + baseTop
      
      const positionTypes = currentStepPosition.split('-')
      switch (positionTypes[0]) {
        case 'top':
          _top += (-stepGuideElement.clientHeight / 2 - triggerElement.clientHeight)
          break
        case 'bottom':
          _top += (stepGuideElement.clientHeight / 2 + triggerElement.clientHeight)
          break
        case 'left':
          _top += (stepGuideElement.clientHeight / 2 - triggerElement.clientHeight)
          _left += (-stepGuideElement.clientWidth / 2 - triggerElement.clientWidth / 2)
          break
        case 'right':
          _top += (stepGuideElement.clientHeight / 2 - triggerElement.clientHeight)
          _left += (stepGuideElement.clientWidth / 2 + triggerElement.clientWidth / 2)
          break
      }
      switch (positionTypes[1]) {
        case 'left':
          _left += (stepGuideElement.clientWidth / 2 - triggerElement.clientWidth / 2)
          break
        case 'right':
          _left += (-stepGuideElement.clientWidth / 2 + triggerElement.clientWidth / 2)
          break
      }
    }
    guidePosition.left = _left + 'px'
    guidePosition.top = _top + 'px'
  }
  return {
    currentStep,
    stepsRef,
    guidePosition,
    guideClassList,
    updateGuidePosition
  }
}