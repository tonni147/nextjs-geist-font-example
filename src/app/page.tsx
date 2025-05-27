"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Dynamically import components to avoid SSR issues
const ProductCustomizer = dynamic(() => import("@/components/ProductCustomizer"), { ssr: false })
const PreviewPanel = dynamic(() => import("@/components/PreviewPanel"), { ssr: false })
const DataTable = dynamic(() => import("@/components/DataTable"), { ssr: false })

interface Column {
  id: string
  name: string
}

interface TableData {
  columns: Column[]
  rows: Record<string, string>[]
}

export default function Home() {
  const [customizations, setCustomizations] = useState({
    productType: "Sticker",
    fontSize: 16,
    fontFamily: "Inter",
    width: 100,
    height: 100,
    barcodeFormat: "QR",
    barcodeData: "",
  })

  const [tableData, setTableData] = useState<TableData>({
    columns: [
      { id: "productType", name: "Product Type" },
      { id: "size", name: "Size" },
      { id: "color", name: "Color" },
      { id: "designCode", name: "Design Code" },
      { id: "barcode", name: "Barcode" },
    ],
    rows: []
  })

  const handleCustomizationChange = (updates: Partial<typeof customizations>) => {
    setCustomizations((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const handleSaveToTable = () => {
    const newRow = {
      productType: customizations.productType,
      size: `${customizations.width}mm x ${customizations.height}mm`,
      color: "Black", // Default color
      designCode: `DESIGN-${Math.floor(Math.random() * 1000)}`,
      barcode: customizations.barcodeData || "N/A",
    }

    setTableData(prev => ({
      ...prev,
      rows: [...prev.rows, newRow]
    }))
  }

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Product Customizer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <ProductCustomizer 
              customizations={customizations}
              onChange={handleCustomizationChange}
              onSave={handleSaveToTable}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <PreviewPanel customizations={customizations} />
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <DataTable 
            data={tableData}
            onDataChange={setTableData}
          />
        </Card>
      </div>
    </main>
  )
}
