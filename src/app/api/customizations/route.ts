import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''

  const skip = (page - 1) * limit

  const [customizations, total] = await Promise.all([
    prisma.productCustomization.findMany({
      where: {
        OR: [
          { productType: { contains: search } },
          { designCode: { contains: search } },
          { barcodeData: { contains: search } },
        ],
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.productCustomization.count({
      where: {
        OR: [
          { productType: { contains: search } },
          { designCode: { contains: search } },
          { barcodeData: { contains: search } },
        ],
      },
    }),
  ])

  return NextResponse.json({
    customizations,
    total,
    pages: Math.ceil(total / limit),
  })
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const customization = await prisma.productCustomization.create({
      data: {
        productType: json.productType,
        fontFamily: json.fontFamily,
        fontSize: json.fontSize,
        width: json.width,
        height: json.height,
        barcodeFormat: json.barcodeFormat,
        barcodeData: json.barcodeData,
        designCode: `DESIGN-${Math.floor(Math.random() * 10000)}`,
      },
    })

    return NextResponse.json(customization)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create customization' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    const { id, ...data } = json

    const customization = await prisma.productCustomization.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        revisionCount: { increment: 1 },
      },
    })

    return NextResponse.json(customization)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update customization' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await prisma.productCustomization.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete customization' },
      { status: 500 }
    )
  }
}
