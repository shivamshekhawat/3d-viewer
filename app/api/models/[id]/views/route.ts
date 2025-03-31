import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(request: Request, context: { params: { id: string } }) {
  try {
    const { params } = context;
    
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { name, cameraPosition } = body;

    if (!name || !cameraPosition) {
      return NextResponse.json({ error: "View name and camera position are required" }, { status: 400 });
    }

    // Validate Model ID
    if (!params?.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid Model ID" }, { status: 400 });
    }

    const modelId = new ObjectId(params.id);
    const userId = ObjectId.isValid(session.user.id) ? new ObjectId(session.user.id) : session.user.id;

    // Connect to MongoDB
    const db = await connectToDatabase();
    const modelsCollection = db.collection("models");

    // Construct query to find model owned by the user
    const filterQuery = { _id: modelId, userId };

    // Define the new view object
    const viewId = new ObjectId();
    const savedView = {
      id: viewId.toString(),
      name,
      cameraPosition,
      createdAt: new Date(),
    };

    // Update document (Ensuring savedViews exists)
    const result = await modelsCollection.updateOne(
      filterQuery,
      {
        $push: { savedViews: savedView }, 
        $setOnInsert: { savedViews: [] }, // Ensures savedViews array exists
      },
      { upsert: false }
    );

    // If no document was found/matched, return 404
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Model not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(savedView, { status: 201 });

  } catch (error) {
    console.error("Error saving view:", error);
    return NextResponse.json({ 
      error: "An error occurred while saving the view",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
