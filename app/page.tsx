import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="sr-only">3D Object Viewer</span>
            <span>3D Object Viewer</span>
          </Link>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Visualize & Manipulate 3D Objects
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Upload, view, and interact with 3D models in your browser. Save your work and access it from anywhere.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button className="px-8">Get Started</Button>
                </Link>
                <Link href="/viewer/demo">
                  <Button variant="outline" className="px-8">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Upload 3D Models</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Support for common 3D file formats including .obj, .glb, and .gltf
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Interactive Manipulation</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Rotate, zoom, and pan your 3D models with intuitive controls
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Save Your Work</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Save camera positions and interaction states for later use
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 px-4 py-6 text-center md:flex-row md:gap-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 3D Object Viewer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

