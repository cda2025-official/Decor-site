"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "./Firebase" // Import Firebase config
import { ArrowUp, ArrowDown, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PositionEditor() {
  const [galleryImages, setGalleryImages] = useState([])
  const [productImages, setProductImages] = useState([])
  const [brochures, setBrochures] = useState([])
  const [galleryPositions, setGalleryPositions] = useState({})
  const [productPositions, setProductPositions] = useState({})
  const [brochurePositions, setBrochurePositions] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("gallery")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch gallery images
        const imagesDocRef = doc(db, "data", "adminImages")
        const imagesDocSnap = await getDoc(imagesDocRef)
        if (imagesDocSnap.exists()) {
          const data = imagesDocSnap.data()

          // Process gallery images
          if (data.galleryImages) {
            const images = data.galleryImages.map((image, index) => {
              const imageUrl = typeof image === "string" ? image : image.url
              const id = `gallery-${index}`
              return { id, imageUrl, index }
            })
            setGalleryImages(images)
          }

          // Load gallery positions
          if (data.galleryPositions) {
            setGalleryPositions(data.galleryPositions)
          }
        }

        // Fetch product images
        const productsDocRef = doc(db, "data", "adminProducts")
        const productsDocSnap = await getDoc(productsDocRef)
        if (productsDocSnap.exists()) {
          const data = productsDocSnap.data()

          // Process product images
          if (data.products) {
            const products = data.products.map((product, index) => {
              const id = `product-${index}`
              return {
                id,
                imageUrl: product.imageUrl,
                title: product.heading,
                category: product.category,
                index,
              }
            })
            setProductImages(products)
          }

          // Load product positions
          if (data.productPositions) {
            setProductPositions(data.productPositions)
          }
        }

        // Fetch brochures
        const filesDocRef = doc(db, "data", "adminFiles")
        const filesDocSnap = await getDoc(filesDocRef)
        if (filesDocSnap.exists()) {
          const data = filesDocSnap.data()

          // Process brochures
          if (data.files) {
            const files = data.files.map((file, index) => {
              const id = `file-${index}`
              return {
                id,
                thumbnailUrl: file.thumbnailUrl,
                title: file.title,
                index,
              }
            })
            setBrochures(files)
          }

          // Load brochure positions
          if (data.filePositions) {
            setBrochurePositions(data.filePositions)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getPosition = (id, type) => {
    if (type === "gallery") {
      return galleryPositions[id] || 999
    } else if (type === "product") {
      return productPositions[id] || 999
    } else if (type === "brochure") {
      return brochurePositions[id] || 999
    }
    return 999
  }

  const moveUp = (id, type) => {
    if (type === "gallery") {
      setGalleryPositions({
        ...galleryPositions,
        [id]: Math.max(1, (galleryPositions[id] || 999) - 1),
      })
    } else if (type === "product") {
      setProductPositions({
        ...productPositions,
        [id]: Math.max(1, (productPositions[id] || 999) - 1),
      })
    } else if (type === "brochure") {
      setBrochurePositions({
        ...brochurePositions,
        [id]: Math.max(1, (brochurePositions[id] || 999) - 1),
      })
    }
  }

  const moveDown = (id, type) => {
    if (type === "gallery") {
      setGalleryPositions({
        ...galleryPositions,
        [id]: (galleryPositions[id] || 999) + 1,
      })
    } else if (type === "product") {
      setProductPositions({
        ...productPositions,
        [id]: (productPositions[id] || 999) + 1,
      })
    } else if (type === "brochure") {
      setBrochurePositions({
        ...brochurePositions,
        [id]: (brochurePositions[id] || 999) + 1,
      })
    }
  }

  const resetPosition = (id, type) => {
    if (type === "gallery") {
      const newPositions = { ...galleryPositions }
      delete newPositions[id]
      setGalleryPositions(newPositions)
    } else if (type === "product") {
      const newPositions = { ...productPositions }
      delete newPositions[id]
      setProductPositions(newPositions)
    } else if (type === "brochure") {
      const newPositions = { ...brochurePositions }
      delete newPositions[id]
      setBrochurePositions(newPositions)
    }
  }

  const savePositions = async () => {
    try {
      setSaving(true)

      // Save gallery positions
      const imagesDocRef = doc(db, "data", "adminImages")
      await updateDoc(imagesDocRef, {
        galleryPositions: galleryPositions,
      })

      // Save product positions
      const productsDocRef = doc(db, "data", "adminProducts")
      await updateDoc(productsDocRef, {
        productPositions: productPositions,
      })

      // Save brochure positions
      const filesDocRef = doc(db, "data", "adminFiles")
      await updateDoc(filesDocRef, {
        filePositions: brochurePositions,
      })

      alert("Positions saved successfully!")
    } catch (error) {
      console.error("Error saving positions:", error)
      alert("Error saving positions.")
    } finally {
      setSaving(false)
    }
  }

  const renderItems = (items, type) => {
    // Sort items by position
    const sortedItems = [...items].sort((a, b) => {
      const posA =
        type === "gallery"
          ? galleryPositions[a.id] || 999
          : type === "product"
            ? productPositions[a.id] || 999
            : brochurePositions[a.id] || 999
      const posB =
        type === "gallery"
          ? galleryPositions[b.id] || 999
          : type === "product"
            ? productPositions[b.id] || 999
            : brochurePositions[b.id] || 999
      return posA - posB
    })

    return sortedItems.map((item) => (
      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg mb-4 bg-white">
        <div className="relative w-20 h-20 flex-shrink-0">
          <img
            src={item.imageUrl || item.thumbnailUrl || "/placeholder.svg"}
            alt={item.title || `Item ${item.index}`}
            className="w-full h-full object-cover rounded-md"
          />
          <div className="absolute top-0 right-0 bg-black/70 text-white text-xs px-2 py-1 rounded-bl-md">
            {getPosition(item.id, type) < 999 ? getPosition(item.id, type) : "-"}
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="font-medium">{item.title || `Item ${item.index + 1}`}</h3>
          {item.category && <p className="text-sm text-gray-500">{item.category}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" size="icon" onClick={() => moveUp(item.id, type)} className="h-8 w-8">
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => moveDown(item.id, type)} className="h-8 w-8">
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={() => resetPosition(item.id, type)} className="text-xs">
          Reset
        </Button>
      </div>
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Manage Display Order</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-6">
          Set the display order for gallery images, products, and brochures. Items with lower position numbers will
          appear first. Items without a position value will appear after positioned items.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="gallery">Gallery Images</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="brochures">Brochures</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            <div className="max-h-[600px] overflow-y-auto pr-2">
              {galleryImages.length > 0 ? (
                renderItems(galleryImages, "gallery")
              ) : (
                <p className="text-center py-8 text-gray-500">No gallery images found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="max-h-[600px] overflow-y-auto pr-2">
              {productImages.length > 0 ? (
                renderItems(productImages, "product")
              ) : (
                <p className="text-center py-8 text-gray-500">No products found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="brochures" className="space-y-4">
            <div className="max-h-[600px] overflow-y-auto pr-2">
              {brochures.length > 0 ? (
                renderItems(brochures, "brochure")
              ) : (
                <p className="text-center py-8 text-gray-500">No brochures found.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={savePositions} disabled={saving} className="bg-[#2A777C] hover:bg-[#1d5a5e]">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Positions
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}