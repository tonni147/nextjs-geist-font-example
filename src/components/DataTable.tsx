"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit2, Save, X } from "lucide-react"

interface Column {
  id: string
  name: string
}

interface DataTableProps {
  data: {
    columns: Column[]
    rows: Record<string, string>[]
  }
  onDataChange: (data: DataTableProps["data"]) => void
}

export default function DataTable({ data, onDataChange }: DataTableProps) {
  const [newColumnName, setNewColumnName] = useState("")
  const [editingCell, setEditingCell] = useState<{row: number, column: string} | null>(null)
  const [editValue, setEditValue] = useState("")

  const addColumn = () => {
    if (!newColumnName.trim()) return
    
    const newColumnId = newColumnName.toLowerCase().replace(/\s+/g, "_")
    
    onDataChange({
      columns: [...data.columns, { id: newColumnId, name: newColumnName }],
      rows: data.rows.map(row => ({
        ...row,
        [newColumnId]: ""
      }))
    })
    
    setNewColumnName("")
  }

  const removeColumn = (columnId: string) => {
    onDataChange({
      columns: data.columns.filter(col => col.id !== columnId),
      rows: data.rows.map(row => {
        const { [columnId]: removed, ...rest } = row
        return rest
      })
    })
  }

  const addRow = () => {
    const newRow = data.columns.reduce((acc, col) => ({
      ...acc,
      [col.id]: ""
    }), {})

    onDataChange({
      ...data,
      rows: [...data.rows, newRow]
    })
  }

  const startEditing = (rowIndex: number, columnId: string, value: string) => {
    setEditingCell({ row: rowIndex, column: columnId })
    setEditValue(value)
  }

  const saveEdit = () => {
    if (!editingCell) return

    const newRows = [...data.rows]
    newRows[editingCell.row] = {
      ...newRows[editingCell.row],
      [editingCell.column]: editValue
    }

    onDataChange({
      ...data,
      rows: newRows
    })

    setEditingCell(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue("")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Data Table</h2>
        <Button onClick={addRow} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="New column name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        />
        <Button onClick={addColumn}>
          <Plus className="h-4 w-4 mr-2" />
          Add Column
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {data.columns.map((column) => (
                <TableHead key={column.id} className="relative">
                  {column.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => removeColumn(column.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {data.columns.map((column) => (
                  <TableCell key={column.id}>
                    {editingCell?.row === rowIndex && editingCell?.column === column.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                        />
                        <Button size="icon" onClick={saveEdit}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex justify-between items-center group cursor-pointer"
                        onClick={() => startEditing(rowIndex, column.id, row[column.id])}
                      >
                        <span>{row[column.id]}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
