import type { FormElementTemplate } from '@/FormEditor/FormEditor.constants'
import type { FormElement, FormRow } from '@/FormEditor/FormEditor.types'
import { init } from '@paralleldrive/cuid2'
import { getDefaultStore } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import type { WritableDraft } from 'immer'

export const formAtom = atomWithImmer<FormRow[]>([])

export type FormElementUpdateFn = (prev: WritableDraft<FormElement>) => void

const store = getDefaultStore()

export function addNewElement(
  rowIndex: number | null,
  itemTemplate: FormElementTemplate,
) {
  store.set(formAtom, (prev) => {
    // add a new row if rowIndex is null
    if (rowIndex === null || rowIndex < 0) {
      prev.push(createRow())
      rowIndex = 0
    }
    // add the element to end of row
    prev[rowIndex].elements.push(createElement(itemTemplate, prev))
    redistributeCols(prev[rowIndex])
  })
}

export function updateElement(
  elementId: string,
  rowIndex: number,
  updateFn: FormElementUpdateFn,
) {
  store.set(formAtom, (prev) => {
    const row = prev[rowIndex]

    updateElementInteral(row, elementId, updateFn)
  })
}

function updateElementInteral(
  row: WritableDraft<FormRow>,
  elementId: string,
  updateFn: FormElementUpdateFn,
) {
  const elementIndex = row.elements.findIndex((el) => el.id === elementId)
  if (elementIndex !== -1) {
    updateFn(row.elements[elementIndex])
  }
}

export function redistributeCols(row: WritableDraft<FormRow>) {
  const numElems = row.elements.length
  const colsPerElement = Math.floor(12 / numElems)

  let start = 1
  let end = colsPerElement + 1
  row.elements.forEach((element) => {
    element.colSpan = [start, end]
    start += colsPerElement
    end += colsPerElement
  })
}

function createRow(): FormRow {
  return {
    elements: [],
  }
}

const createId = init({
  length: 8,
})

function createElement(
  itemTemplate: FormElementTemplate,
  formRows: FormRow[],
): FormElement {
  let i = 1
  let label = `${itemTemplate.label} #${i}`
  while (true) {
    if (
      !formRows.some((row) =>
        row.elements.some((element) => element.label === label),
      )
    ) {
      break
    }
    i++
    label = `${itemTemplate.label} #${i}`
  }

  const id = `${itemTemplate.type}-${createId()}`

  return {
    id,
    type: itemTemplate.type,
    label,
    placeholder: '',
    required: false,
    resized: false,
    colSpan: [1, 13],
  }
}
