"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { useImageLoader } from '@/hooks/use-image-loader'

interface MediaDebuggerProps {
  url?: string | null
  alt?: string
  title?: string
  showControls?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function MediaDebugger({
  url,
  alt = "Debug image",
  title = "Media Debugger",
  showControls = true,
  onSuccess,
  onError
}: MediaDebuggerProps) {
  const [testUrl, setTestUrl] = useState<string>(url || '')
  const [directUrl, setDirectUrl] = useState<string>('')
  const [apiUrl, setApiUrl] = useState<string>('')
  
  // Image loading status tracking
  const { status, error } = useImageLoader(testUrl || null)
  
  // When the url prop changes, update the test URL
  useEffect(() => {
    if (url) {
      setTestUrl(url)
    }
  }, [url])
  
  // Generate alternate URL formats for testing
  useEffect(() => {
    if (testUrl) {
      // Convert from /media/file.jpg to /api/media/file/file.jpg
      if (testUrl.startsWith('/media/')) {
        const filename = testUrl.replace('/media/', '')
        setApiUrl(`/api/media/file/${filename}`)
      } 
      // Convert from /api/media/file/file.jpg to /media/file.jpg
      else if (testUrl.startsWith('/api/media/file/')) {
        const filename = testUrl.replace('/api/media/file/', '')
        setDirectUrl(`/media/${filename}`)
      }
    }
  }, [testUrl])
  
  // Report status changes
  useEffect(() => {
    if (status === 'success' && onSuccess) {
      onSuccess()
    } else if (status === 'error' && onError && error) {
      onError(error)
    }
  }, [status, error, onSuccess, onError])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Debug media loading issues with this tool
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge 
            variant={
              status === 'loading' ? 'outline' : 
              status === 'success' ? 'secondary' : 
              'destructive'
            }
          >
            {status.toUpperCase()}
          </Badge>
        </div>
        
        {/* URL display */}
        <div>
          <p className="text-sm font-medium mb-1">Current URL:</p>
          <code className="text-xs bg-muted p-2 rounded block overflow-x-auto whitespace-pre-wrap break-all">
            {testUrl || 'No URL provided'}
          </code>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2">
            <p className="text-xs font-semibold text-destructive">Error:</p>
            <p className="text-xs text-destructive/90">{error}</p>
          </div>
        )}
        
        {/* Test URL input */}
        {showControls && (
          <div>
            <label htmlFor="testUrl" className="text-sm font-medium block mb-1">Test URL:</label>
            <div className="flex gap-2">
              <input 
                type="text"
                id="testUrl"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter URL to test"
              />
              <Button 
                variant="outline"
                onClick={() => setTestUrl(testUrl)}
                disabled={!testUrl}
              >
                Test
              </Button>
            </div>
          </div>
        )}
        
        {/* Alternative URL formats */}
        {(directUrl || apiUrl) && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Alternative formats:</p>
              
              {directUrl && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground">Direct URL:</p>
                  <div className="flex gap-2 items-center">
                    <code className="text-xs bg-muted p-1.5 rounded flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {directUrl}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setTestUrl(directUrl)}
                    >
                      Try
                    </Button>
                  </div>
                </div>
              )}
              
              {apiUrl && (
                <div>
                  <p className="text-xs text-muted-foreground">API URL:</p>
                  <div className="flex gap-2 items-center">
                    <code className="text-xs bg-muted p-1.5 rounded flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {apiUrl}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setTestUrl(apiUrl)}
                    >
                      Try
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Image preview */}
        <Separator />
        <div>
          <p className="text-sm font-medium mb-2">Image Preview:</p>
          <div className="border rounded-md overflow-hidden bg-white/50 bg-grid-pattern">
            <div className="relative aspect-video w-full">
              {status === 'loading' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : testUrl && status === 'success' ? (
                <Image
                  src={testUrl}
                  alt={alt}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    {status === 'error' ? 'Failed to load image' : 'No image to display'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-3">
        <p className="text-xs text-muted-foreground">
          If images aren't loading, make sure the media directory and symlink are set up correctly.
        </p>
      </CardFooter>
    </Card>
  )
}
