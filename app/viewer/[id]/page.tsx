"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import ThreeViewer from "@/components/three-viewer"
import type { SavedView } from "@/types/model"

interface ModelData {
  id: string
  name: string
  fileUrl: string
  savedViews: SavedView[]
}

export default function ViewerPage() {
  const { id } = useParams()
  const [model, setModel] = useState<ModelData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewName, setViewName] = useState("")
  const [currentView, setCurrentView] = useState<SavedView | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchModel = async () => {
      if (id === "demo") {
        // Load demo model
        setModel({
          id: "demo",
          name: "Demo Model",
          fileUrl: "/assets/3d/duck.glb",
          savedViews: [],
        })
        setIsLoading(false)
        return
      }

      if (id === "new") {
        setModel({
          id: "new",
          name: "New Model",
          fileUrl: "",
          savedViews: [],
        })
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/models/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch model")
        }
        const data = await response.json()
        setModel(data)
      } catch (error) {
        console.error("Error fetching model:", error)
        toast({
          title: "Error",
          description: "Failed to load the 3D model",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchModel()
  }, [id, toast])

  const handleSaveView = async (cameraPosition: any) => {
    if (!viewName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for this view",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/models/${id}/views`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: viewName,
          cameraPosition,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save view")
      }

      const savedView = await response.json()

      setModel((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          savedViews: [...prev.savedViews, savedView],
        }
      })

      setViewName("")

      toast({
        title: "Success",
        description: "View saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save view",
        variant: "destructive",
      })
    }
  }

  const handleLoadView = (view: SavedView) => {
    setCurrentView(view)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="mb-2 text-xl font-bold">Model not found</h2>
          <p className="mb-4">The requested 3D model could not be found.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container grid h-screen grid-cols-1 gap-4 p-4 mx-auto lg:grid-cols-4">
      <div className="lg:col-span-3 h-[calc(100vh-2rem)] bg-gray-100 rounded-lg overflow-hidden">
        <ThreeViewer
          modelUrl={model.fileUrl || "/assets/3d/duck.glb"}
          currentView={currentView}
          onUpload={id === "new" ? (url) => setModel((prev) => (prev ? { ...prev, fileUrl: url } : null)) : undefined}
        />
      </div>
      <div className="lg:col-span-1">
        <Tabs defaultValue="controls">
          <TabsList className="w-full">
            <TabsTrigger value="controls" className="flex-1">
              Controls
            </TabsTrigger>
            <TabsTrigger value="views" className="flex-1">
              Saved Views
            </TabsTrigger>
          </TabsList>
          <TabsContent value="controls" className="p-4 border rounded-md mt-2">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Model Information</h3>
                <p className="text-sm text-gray-500">{model.name}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Camera Controls</h3>
                <p className="text-xs text-gray-500">
                  Left click + drag to rotate
                  <br />
                  Right click + drag to pan
                  <br />
                  Scroll to zoom
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Save Current View</h3>
                <div className="flex space-x-2">
                  <Input placeholder="View name" value={viewName} onChange={(e) => setViewName(e.target.value)} />
                  <Button onClick={() => handleSaveView({})} disabled={id === "demo"}>
                    Save
                  </Button>
                </div>
                {id === "demo" && <p className="text-xs text-gray-500">Login to save views</p>}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="views" className="p-4 border rounded-md mt-2">
            {model.savedViews.length === 0 ? (
              <div className="py-8 text-center">
                <p className="mb-2 text-gray-500">No saved views</p>
                <p className="text-sm text-gray-400">
                  Save camera positions to quickly navigate to specific views of your model
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {model.savedViews.map((view) => (
                  <Button
                    key={view.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleLoadView(view)}
                  >
                    {view.name}
                  </Button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

