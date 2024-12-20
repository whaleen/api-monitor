// src/components/script-helper.jsx
import { ClipboardCopy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function ScriptHelper({ activeCall }) {
  if (!activeCall) {
    return (
      <div className='p-4'>
        <h3 className='text-lg font-medium mb-2'>Scripts</h3>
        <p className='text-sm text-muted-foreground'>
          Select an API call to generate a script template.
        </p>
      </div>
    )
  }

  const scriptTemplate = `// scripts/${activeCall.domain}/${activeCall.method}.js
import { makeRequest } from '../utils/api'

/**
 * ${activeCall.method} API Call
 * Domain: ${activeCall.domain}
 * Endpoint: ${activeCall.pathString}
 */
export async function /* camelCaseMethod */() {
  const response = await makeRequest({
    url: '${activeCall.url}',
    method: '${activeCall.httpMethod}',
    // Add your parameters here
  })
  
  return response.data
}
`

  return (
    <div className='p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Create Script</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Copy this template to create a reusable script for the{' '}
            {activeCall.method} API call.
          </p>
        </CardHeader>
        <CardContent>
          <div className='relative'>
            <pre className='p-4 bg-muted rounded-lg text-sm'>
              {scriptTemplate}
            </pre>
            <Button
              size='sm'
              variant='outline'
              className='absolute top-2 right-2'
              onClick={() => navigator.clipboard.writeText(scriptTemplate)}
            >
              <ClipboardCopy className='w-4 h-4 mr-2' />
              Copy
            </Button>
          </div>

          <div className='mt-4 text-sm'>
            <h4 className='font-medium mb-2'>Usage Instructions:</h4>
            <ol className='list-decimal pl-4 space-y-1'>
              <li>Create a file in scripts/{activeCall.domain}/</li>
              <li>Paste the template code</li>
              <li>Add any required parameters</li>
              <li>Import and use in your application</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
