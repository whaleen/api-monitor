// src/components/call-header.jsx
import { Globe, BarChart3, Clock, Link } from 'lucide-react'

function getRootDomain(domain) {
  try {
    const parts = domain.split('.')
    if (parts.length > 2) {
      return parts.slice(-2).join('.')
    }
    return domain
  } catch {
    return domain
  }
}

function getFavicon(domain) {
  const rootDomain = getRootDomain(domain)
  return {
    src: `https://www.google.com/s2/favicons?domain=${rootDomain}`,
    fallbackSrc: `https://icons.duckduckgo.com/ip3/${rootDomain}.ico`,
  }
}

function getApiTypeIcon(call) {
  if (call.isAnalytics) return <BarChart3 className='w-4 h-4 text-blue-500' />
  if (call.pathString.includes('telemetry'))
    return <BarChart3 className='w-4 h-4 text-green-500' />
  return <Globe className='w-4 h-4 text-gray-500' />
}

export function CallHeader({ call }) {
  return (
    <div className='flex items-center justify-between mb-4'>
      <div className='flex items-center gap-3'>
        <img
          src={getFavicon(call.domain).src}
          onError={(e) => {
            if (e.target.src !== getFavicon(call.domain).fallbackSrc) {
              e.target.src = getFavicon(call.domain).fallbackSrc
            } else {
              e.target.style.display = 'none'
            }
          }}
          className='w-4 h-4'
          alt=''
        />
        <h3 className='font-medium text-lg'>{call.method}</h3>
        {getApiTypeIcon(call)}
      </div>

      <div className='flex items-center gap-4 text-sm text-gray-500'>
        <span className='flex items-center gap-1'>
          <Clock className='w-4 h-4' />
          {new Date(call.timestamp).toLocaleTimeString()}
        </span>
        <span className='flex items-center gap-1'>
          <Link className='w-4 h-4' />
          {call.domain}
        </span>
      </div>
    </div>
  )
}
