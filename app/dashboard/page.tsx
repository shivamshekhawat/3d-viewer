"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"

interface SavedModel {
  id: string
  name: string
  createdAt: string
  thumbnail?: string
}

export default function DashboardPage() {
  const [models, setModels] = useState<SavedModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models")
        if (!response.ok) {
          throw new Error("Failed to fetch models")
        }
        const data = await response.json()
        setModels(data)
      } catch (error) {
        console.error("Error fetching models:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [])

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your 3D Models</h1>
        <Button onClick={() => router.push("/viewer/new")}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Upload New Model
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : models.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent className="pt-6 pb-4">
            <h3 className="mb-2 text-xl font-medium">No models found</h3>
            <p className="text-gray-500 mb-6">Upload your first 3D model to get started</p>
            <Button onClick={() => router.push("/viewer/new")}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Upload New Model
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <Link href={`/viewer/${model.id}`} key={model.id}>
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <div className="h-48 bg-gray-100">
                  {model.thumbnail ? (
                    <img
                      src={model.thumbnail || "/placeholder.svg"}
                      alt={model.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      No preview available
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{model.name}</CardTitle>
                  <CardDescription>Created on {new Date(model.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Model
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

