"use client"

import Link from "next/link"

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">This page could not be found.</p>
      <div className="flex gap-4">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
        <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  )
}

