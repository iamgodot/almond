"use client"

import React from "react"
import {
  PageLayout,
  SpecialZoomLevel,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { useResizeDetector } from "react-resize-detector"

interface PdfRendererProps {
  url: string
}

function PdfRenderer({ url }: PdfRendererProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const { width, height, ref } = useResizeDetector()
  const pageLayout: PageLayout = {}
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div ref={ref} className="flex-1 w-full max-h-screen">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
          <div
            style={{
              border: "1px solid rgba(0, 0, 0, 0.3)",
              height: "750px",
            }}
          >
            <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
          </div>
        </Worker>
      </div>
    </div>
  )
}

export default PdfRenderer
