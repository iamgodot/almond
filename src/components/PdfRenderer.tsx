"use client"

import React from "react"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import type {
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar"

interface PdfRendererProps {
  url: string
}

function PdfRenderer({ url }: PdfRendererProps) {
  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    ShowSearchPopover: () => <></>,
    Open: () => <></>,
    Print: () => <></>,
    MoreActionsPopover: () => <></>,
  })
  const renderToolbar = (
    Toolbar: (props: ToolbarProps) => React.ReactElement
  ) => <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
  })
  const { renderDefaultToolbar } =
    defaultLayoutPluginInstance.toolbarPluginInstance
  return (
    <div className="w-full h-screen p-5 shadow lg:h-full">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  )
}

export default PdfRenderer
