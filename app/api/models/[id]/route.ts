import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()
    const modelsCollection = db.collection("models")

    const model = await modelsCollection.findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id),
    })

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: model._id.toString(),
      name: model.name,
      fileUrl: model.fileUrl,
      createdAt: model.createdAt,
      savedViews: model.savedViews || [],
    })
  } catch (error) {
    console.error("Error fetching model:", error)
    return NextResponse.json({ error: "An error occurred while fetching the model" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, fileUrl } = await request.json()

    const db = await connectToDatabase()
    const modelsCollection = db.collection("models")

    const result = await modelsCollection.updateOne(
      {
        _id: new ObjectId(params.id),
        userId: new ObjectId(session.user.id),
      },
      {
        $set: {
          ...(name && { name }),
          ...(fileUrl && { fileUrl }),
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Model updated successfully" })
  } catch (error) {
    console.error("Error updating model:", error)
    return NextResponse.json({ error: "An error occurred while updating the model" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()
    const modelsCollection = db.collection("models")

    const result = await modelsCollection.deleteOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Model deleted successfully" })
  } catch (error) {
    console.error("Error deleting model:", error)
    return NextResponse.json({ error: "An error occurred while deleting the model" }, { status: 500 })
  }
}

