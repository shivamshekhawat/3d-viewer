"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, PerspectiveCamera, Html, useProgress } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { SavedView } from "@/types/model"
const url = "/duck.glb";



function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)

  return <primitive object={scene} />
}

function CameraController({ currentView }: { currentView: SavedView | null }) {
  const { camera, controls } = useThree()

  useEffect(() => {
    if (currentView && controls) {
      // Apply saved camera position and target
      if (currentView.position) {
        const pos = currentView.position
        camera.position.set(pos.x, pos.y, pos.z)
      }

      if (currentView.target) {
        const target = currentView.target
        controls.target.set(target.x, target.y, target.z)
      }

      controls.update()
    }
  }, [currentView, camera, controls])

  return null
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="text-center">
        <div className="mb-2 text-lg font-medium">Loading 3D Model</div>
        <div className="w-32 h-2 bg-gray-200 rounded-full">
          <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-1 text-sm">{progress.toFixed(0)}%</div>
      </div>
    </Html>
  )
}

function FileUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    // Check if file is a supported 3D format
    const supportedFormats = [".glb", ".gltf", ".obj"]
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    if (!supportedFormats.includes(fileExtension)) {
      toast({
        title: "Unsupported file format",
        description: "Please upload a .glb, .gltf, or .obj file",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would upload to a server here
    // For this demo, we'll use a local URL
    const fileUrl = URL.createObjectURL(file)
    onUpload(fileUrl)

    toast({
      title: "File uploaded",
      description: "Your 3D model has been uploaded successfully",
    })
  }

  return (
    <Html center>
      <div
        className={`p-8 text-center border-2 border-dashed rounded-lg ${
          isDragging ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4 text-lg font-medium">Upload 3D Model</div>
        <p className="mb-4 text-sm text-gray-500">Drag and drop your 3D model here, or click to browse</p>
        <Input type="file" accept=".glb,.gltf,.obj" onChange={handleFileChange} className="hidden" id="file-upload" />
        <label htmlFor="file-upload">
          <Button as="span">Select File</Button>
        </label>
        <p className="mt-2 text-xs text-gray-400">Supported formats: .glb, .gltf, .obj</p>
      </div>
    </Html>
  )
}

interface ThreeViewerProps {
  modelUrl: string
  currentView: SavedView | null
  onUpload?: (url: string) => void
}

export default function ThreeViewer({ modelUrl, currentView, onUpload }: ThreeViewerProps) {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 1, 5]} />
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Suspense fallback={<Loader />}>
        {modelUrl ? <Model url={modelUrl} /> : onUpload ? <FileUploader onUpload={onUpload} /> : null}
        <Environment preset="city" />
        {currentView && <CameraController currentView={currentView} />}
      </Suspense>
    </Canvas>
  )
}

