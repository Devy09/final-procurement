"use client"

import { useRef, useState, useEffect } from "react"
import SignaturePad from "signature_pad"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignatureDialog() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("draw")
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signaturePadRef = useRef<SignaturePad | null>(null)

  useEffect(() => {
    if (activeTab === "draw") {
      initSignaturePad()
    }
  }, [activeTab])

  const initSignaturePad = () => {
    if (canvasRef.current && !signaturePadRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "#000000",
        minWidth: 2,
        maxWidth: 2,
      })
    }
  }

  const clearSignature = () => {
    if (activeTab === "draw") {
      signaturePadRef.current?.clear()
    } else if (activeTab === "upload") {
      setUploadedSignature(null)
    }
  }

  const saveSignature = () => {
    let signatureData: string | null = null;

    if (activeTab === "draw") {
      if (signaturePadRef.current?.isEmpty()) {
        alert("Please provide a signature first.")
        return
      }
      signatureData = signaturePadRef.current?.toDataURL() || null
    } else if (activeTab === "upload") {
      if (!uploadedSignature) {
        alert("Please upload a signature image.")
        return
      }
      signatureData = uploadedSignature
    }

    console.log("Signature saved:", signatureData)
    setOpen(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedSignature(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Signature</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add your signature</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">Draw</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="draw">
            <div className="space-y-4">
              <div className="border rounded-lg p-2 bg-white">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  className="touch-none"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="upload">
            <div className="space-y-2">
              <Label htmlFor="upload-signature">Upload signature image</Label>
              <Input
                id="upload-signature"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
              {uploadedSignature && (
                <img src={uploadedSignature} alt="Uploaded signature" className="mt-2 max-w-full h-auto" />
              )}
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={clearSignature}>
            Clear
          </Button>
          <Button onClick={saveSignature}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

