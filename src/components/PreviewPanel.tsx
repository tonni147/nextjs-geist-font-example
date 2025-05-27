"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileImage, FileText } from "lucide-react"
import * as htmlToImage from "html-to-image"
import jsPDF from "jspdf"

interface PreviewPanelProps {
  customizations: {
    productType: string
    fontSize: number
    fontFamily: string
    width: number
    height: number
    barcodeFormat: string
    barcodeData: string
  }
}

export default function PreviewPanel({ customizations }: PreviewPanelProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [barcodeUrl, setBarcodeUrl] = useState<string>("")

  useEffect(() => {
    const generateBarcode = async () => {
      if (customizations.barcodeData && customizations.barcodeFormat === "QR") {
        try {
          const url = await QRCode.toDataURL(customizations.barcodeData)
          setBarcodeUrl(url)
        } catch (err) {
          console.error("Error generating QR code:", err)
        }
      }
    }

    generateBarcode()
  }, [customizations.barcodeData, customizations.barcodeFormat])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size based on product dimensions
    canvas.width = customizations.width * 2 // Scale up for better resolution
    canvas.height = customizations.height * 2

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw border
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)

    // Set font
    ctx.font = `${customizations.fontSize * 2}px ${customizations.fontFamily}`
    ctx.fillStyle = "#000000"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw product type
    ctx.fillText(
      customizations.productType,
      canvas.width / 2,
      canvas.height / 3
    )

    // Draw dimensions
    const dimensionsText = `${customizations.width}mm x ${customizations.height}mm`
    ctx.font = `${14 * 2}px ${customizations.fontFamily}`
    ctx.fillText(
      dimensionsText,
      canvas.width / 2,
      (canvas.height / 3) * 2
    )

  }, [customizations])

  const downloadAsPNG = async () => {
    if (!previewRef.current) return

    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current)
      const link = document.createElement('a')
      link.download = `${customizations.productType.toLowerCase()}-preview.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error downloading PNG:', err)
    }
  }

  const downloadAsPDF = async () => {
    if (!previewRef.current) return

    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [customizations.width, customizations.height]
      })

      pdf.addImage(dataUrl, 'PNG', 0, 0, customizations.width, customizations.height)
      pdf.save(`${customizations.productType.toLowerCase()}-preview.pdf`)
    } catch (err) {
      console.error('Error downloading PDF:', err)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Preview</h2>
      
      <div 
        ref={previewRef}
        className="relative border rounded-lg p-4 bg-white"
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "400px",
            margin: "0 auto",
            display: "block"
          }}
        />
        
        {barcodeUrl && (
          <div className="mt-4 flex justify-center">
            <img
              src={barcodeUrl}
              alt="Barcode"
              style={{
                maxWidth: "150px",
                height: "auto"
              }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={downloadAsPNG} variant="outline">
          <FileImage className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
        <Button onClick={downloadAsPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  )
}
