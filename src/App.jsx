// src/App.jsx
import { useState, useEffect } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import CodeEditor from 'react-simple-code-editor'
import { normalizeApiCall } from '@/lib/utils/normalizer'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from './components/mode-toggle'
import { CallHeader } from '@/components/call-header'
import { ScriptHelper } from '@/components/script-helper'

function App() {
  const [calls, setCalls] = useState([])
  const [methods, setMethods] = useState(new Set())
  const [activeMethod, setActiveMethod] = useState('all')

  const [selectedCall, setSelectedCall] = useState(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.onmessage = (event) => {
      console.log('=== New API Call ===')
      console.log('Raw data:', event.data)

      const data = JSON.parse(event.data)
      console.log('Parsed data:', data)

      const normalizedData = normalizeApiCall(data)
      console.log('Normalized data:', normalizedData)

      setMethods((prev) => new Set(prev).add(normalizedData.method))
      setCalls((prev) => [normalizedData, ...prev].slice(0, 100))
    }

    ws.onopen = () => {
      console.log('WebSocket Connected')
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [])

  const filteredCalls =
    activeMethod === 'all'
      ? calls
      : calls.filter((call) => call.method === activeMethod)

  return (
    <ThemeProvider
      defaultTheme='dark'
      storageKey='vite-ui-theme'
    >
      <SidebarProvider>
        <AppSidebar
          methods={methods}
          setMethods={setMethods}
          setActiveMethod={setActiveMethod}
          activeMethod={activeMethod} // Add this prop
          calls={calls}
          setCalls={setCalls}
        />

        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 border-b'>
            <div className='flex items-center gap-2 px-3'>
              <SidebarTrigger />
              <Separator
                orientation='vertical'
                className='mr-2 h-4'
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className='hidden md:block'>
                    <BreadcrumbLink href='#'>Methods</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='hidden md:block' />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {activeMethod === 'all'
                        ? 'All Methods'
                        : shortenString(activeMethod, 20)}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <ModeToggle />
            </div>
          </header>

          <div className='flex flex-1 gap-4'>
            {/* Left column */}

            <div className='flex-1 max-w-md p-4'>
              {filteredCalls.map((call, i) => (
                <div
                  key={i}
                  className='mb-5 p-4 rounded-lg shadow-md cursor-pointer'
                  onClick={() => setSelectedCall(call)}
                >
                  <CallHeader call={call} />
                  <pre className='rounded-lg p-4 overflow-auto'>
                    <CodeEditor
                      value={JSON.stringify(call.payload, null, 2)}
                      onValueChange={() => {}}
                      highlight={(code) => code}
                      padding={10}
                      style={{
                        fontFamily: '"Fira Code", monospace',
                        fontSize: 12,
                        whiteSpace: 'pre',
                      }}
                    />
                  </pre>
                </div>
              ))}
            </div>

            {/* Right column */}
            <div className='w-1/3 p-8 border-l'>
              <ScriptHelper activeCall={selectedCall} />
            </div>
          </div>

          <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

function shortenString(str, maxLength) {
  if (str.length <= maxLength) {
    return str
  }
  return `${str.slice(0, maxLength - 3)}...`
}

export default App
