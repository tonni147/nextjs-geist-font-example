"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface ProductCustomizerProps {
  customizations: {
    productType: string
    fontSize: number
    fontFamily: string
    width: number
    height: number
    barcodeFormat: string
    barcodeData: string
  }
  onChange: (updates: Partial<ProductCustomizerProps["customizations"]>) => void
  onSave: () => void
}

export default function ProductCustomizer({ customizations, onChange, onSave }: ProductCustomizerProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Customize Product</h2>
        <Button onClick={onSave} variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Save to Table
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Product Type</Label>
          <Select
            value={customizations.productType}
            onValueChange={(value) => onChange({ productType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sticker">Sticker</SelectItem>
              <SelectItem value="Label">Label</SelectItem>
              <SelectItem value="Hangtag">Hangtag</SelectItem>
              <SelectItem value="Box">Box</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={customizations.fontFamily}
            onValueChange={(value) => onChange({ fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Size: {customizations.fontSize}px</Label>
          <Slider
            value={[customizations.fontSize]}
            min={8}
            max={72}
            step={1}
            onValueChange={([value]) => onChange({ fontSize: value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Width (mm)</Label>
            <Input
              type="number"
              value={customizations.width}
              onChange={(e) => onChange({ width: Number(e.target.value) })}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Height (mm)</Label>
            <Input
              type="number"
              value={customizations.height}
              onChange={(e) => onChange({ height: Number(e.target.value) })}
              min={1}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Barcode Format</Label>
          <Select
            value={customizations.barcodeFormat}
            onValueChange={(value) => onChange({ barcodeFormat: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="QR">QR Code</SelectItem>
              <SelectItem value="UPC-A">UPC-A</SelectItem>
              <SelectItem value="CODE128">CODE128</SelectItem>
              <SelectItem value="EAN13">EAN-13</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Barcode Data</Label>
          <Input
            value={customizations.barcodeData}
            onChange={(e) => onChange({ barcodeData: e.target.value })}
            placeholder="Enter barcode data..."
          />
        </div>
      </div>
    </div>
  )
}
