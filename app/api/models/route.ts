import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()
    const modelsCollection = db.collection("models")

    const models = await modelsCollection
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      models.map((model) => ({
        id: model._id.toString(),
        name: model.name,
        createdAt: model.createdAt,
        thumbnail: model.thumbnail,
      })),
    )
  } catch (error) {
    console.error("Error fetching models:", error)
    return NextResponse.json({ error: "An error occurred while fetching models" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, fileUrl } = await request.json()

    if (!name || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const modelsCollection = db.collection("models")

    const result = await modelsCollection.insertOne({
      name,
      fileUrl,
      userId: new ObjectId(session.user.id),
      createdAt: new Date(),
      savedViews: [],
    })

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        name,
        fileUrl,
        createdAt: new Date(),
        savedViews: [],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating model:", error)
    return NextResponse.json({ error: "An error occurred while creating the model" }, { status: 500 })
  }
}

