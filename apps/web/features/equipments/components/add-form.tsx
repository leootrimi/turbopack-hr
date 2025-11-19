'use client'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/components/ui/button'
import { Input } from '@/components/components/ui/input'
import { Label } from '@/components/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/components/ui/select'
import { useState } from 'react'

interface EquipmentFormData {
  id: string
  type: string
  model: string
  serial: string
  assignedTo: string
  department: string
  status: string
  purchaseDate: string
  price: number
  warrantyExpiration: string
}

export default function EquipmentForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EquipmentFormData>({
    defaultValues: {
      id: 'EQUIP-001',
      type: 'Laptop',
      model: 'MacBook Pro 16',
      serial: 'C02ZN9LFMD6V',
      assignedTo: 'Sarah Johnson',
      department: 'Engineering',
      status: 'Working',
      purchaseDate: '2023-03-15',
      price: 2499,
      warrantyExpiration: '2026-03-15',
    },
  })

  const [submitted, setSubmitted] = useState(false)

  const equipmentType = watch('type')
  const equipmentStatus = watch('status')
  const equipmentDepartment = watch('department')

  const onSubmit = (data: EquipmentFormData) => {
    console.log('Form submitted:', data)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <Card className="w-full max-w-3xl border-0 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-foreground">Equipment Inventory</CardTitle>
        <CardDescription>Manage and track equipment information</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Grid Layout: 1 column mobile, 2 columns desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment ID */}
            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm font-medium text-foreground">
                Equipment ID
              </Label>
              <Input
                id="id"
                {...register('id', { required: 'Equipment ID is required' })}
                placeholder="EQUIP-001"
                className="bg-muted border-border focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              {errors.id && <span className="text-xs text-destructive">{errors.id.message}</span>}
            </div>

            {/* Equipment Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-foreground">
                Equipment Type
              </Label>
              <Select value={equipmentType} onValueChange={(value) => setValue('type', value)}>
                <SelectTrigger className="bg-muted border-border focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Desktop">Desktop</SelectItem>
                  <SelectItem value="Tablet">Tablet</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Printer">Printer</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium text-foreground">
                Model
              </Label>
              <Input
                id="model"
                {...register('model', { required: 'Model is required' })}
                placeholder="MacBook Pro 16"
                className="bg-muted border-border focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              {errors.model && (
                <span className="text-xs text-destructive">{errors.model.message}</span>
              )}
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <Label htmlFor="serial" className="text-sm font-medium text-foreground">
                Serial Number
              </Label>
              <Input
                id="serial"
                {...register('serial', { required: 'Serial number is required' })}
                placeholder="C02ZN9LFMD6V"
                className="bg-muted border-border focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              {errors.serial && (
                <span className="text-xs text-destructive">{errors.serial.message}</span>
              )}
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <Label htmlFor="assignedTo" className="text-sm font-medium text-foreground">
                Assigned To
              </Label>
              <Input
                id="assignedTo"
                {...register('assignedTo', { required: 'Assignee is required' })}
                placeholder="Sarah Johnson"
                className="bg-muted border-border focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              {errors.assignedTo && (
                <span className="text-xs text-destructive">{errors.assignedTo.message}</span>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-foreground">
                Department
              </Label>
              <Select
                value={equipmentDepartment}
                onValueChange={(value) => setValue('department', value)}
              >
                <SelectTrigger className="bg-muted border-border focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-foreground">
                Status
              </Label>
              <Select value={equipmentStatus} onValueChange={(value) => setValue('status', value)}>
                <SelectTrigger className="bg-muted border-border focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Working">Working</SelectItem>
                  <SelectItem value="In Repair">In Repair</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <Label htmlFor="purchaseDate" className="text-sm font-medium text-foreground">
                Purchase Date
              </Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register('purchaseDate', { required: 'Purchase date is required' })}
                className="bg-muted border-border focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              {errors.purchaseDate && (
                <span className="text-xs text-destructive">{errors.purchaseDate.message}</span>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-foreground">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' },
                })}
                placeholder="2499.00"
                className="bg-muted border-border focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              {errors.price && (
                <span className="text-xs text-destructive">{errors.price.message}</span>
              )}
            </div>

            {/* Warranty Expiration */}
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiration" className="text-sm font-medium text-foreground">
                Warranty Expiration
              </Label>
              <Input
                id="warrantyExpiration"
                type="date"
                {...register('warrantyExpiration', { required: 'Warranty expiration date is required' })}
                className="bg-muted border-border focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              {errors.warrantyExpiration && (
                <span className="text-xs text-destructive">{errors.warrantyExpiration.message}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant='outline'
              className="w-full md:w-auto px-8 py-2 text-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity duration-200"
            >
              Save Equipment
            </Button>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm text-center animate-in fade-in">
              Equipment information saved successfully!
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
