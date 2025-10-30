
import FormEditor from './FormEditor/FormEditor'
import { DebugOverlay } from './components/DebugOverlay'

export function App() {
  return (
    <>
      <FormEditor />
      {import.meta.env.MODE === 'development' && <DebugOverlay />}
    </>
  )
}
