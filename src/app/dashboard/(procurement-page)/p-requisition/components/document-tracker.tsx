'use client'

import { useState, useEffect } from "react"
import { Check, UserCircle, FileInput, Loader2 } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface DocumentTrackerProps {
  purchaseRequestId: string
}

interface ApprovalDetails {
  id: string
  status: string
  approvedByAccountant: boolean
  approvedAtAccountant?: string | null
  accountantName?: string | null
  accountantRole?: string | null
  approvedByPresident: boolean
  approvedAtPresident?: string | null
  presidentName?: string | null
  presidentRole?: string | null
  hasQuotation?: boolean
}

export default function DocumentTracker({ purchaseRequestId }: DocumentTrackerProps) {
  const [approvalDetails, setApprovalDetails] = useState<ApprovalDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)
  const { toast } = useToast();

  useEffect(() => {
    const fetchApprovalDetails = async () => {
      try {
        const response = await fetch(`/api/requisition-view/${purchaseRequestId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch approval details')
        }
        const data = await response.json()
        setApprovalDetails(data)
      } catch (error) {
        console.error('Error fetching approval details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApprovalDetails()
  }, [purchaseRequestId])

  const getProgress = () => {
    if (!approvalDetails) return 0
    const approvedCount = [
      approvalDetails.approvedByAccountant,
      approvalDetails.approvedByPresident
    ].filter(Boolean).length
    return (approvedCount / 2) * 100
  }

  const handleRequestQuotation = async () => {
    setIsRequesting(true)
    try {
      const response = await fetch(`/api/quotation/create/${purchaseRequestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create quotation request')
      }

      toast({
        title: "Success",
        description: "Quotation created successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error creating quotation request:', error)
      toast({
        title: "Success",
        description: "Failed to create quotation request",
        variant: "default",
      });
    } finally {
      setIsRequesting(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const approvalStages = [
    {
      id: 1,
      title: "Accountant",
      status: approvalDetails?.approvedByAccountant ? "approved" : "pending",
      approvedAt: approvalDetails?.approvedAtAccountant,
      approverName: approvalDetails?.accountantName,
      approverRole: approvalDetails?.accountantRole,
    },
    {
      id: 2,
      title: "President",
      status: approvalDetails?.approvedByPresident ? "approved" : "pending",
      approvedAt: approvalDetails?.approvedAtPresident,
      approverName: approvalDetails?.presidentName,
      approverRole: approvalDetails?.presidentRole,
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <Toaster />
        <div className="mb-4">
          <Progress value={getProgress()} className="h-4 w-full" />
        </div>
        <div className="space-y-10">
          {approvalStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                stage.status === "approved" ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
              }`}>
                {stage.status === "approved" ? (
                  <Check className="w-6 h-6 text-green-500" />
                ) : (
                  <UserCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold">{stage.title}</h3>
                <p className="text-sm text-gray-500">
                  {stage.status === "approved" ? (
                    <>
                      Approved by {stage.approverName} on{' '}
                      {stage.approvedAt && format(new Date(stage.approvedAt), 'PPP')}
                    </>
                  ) : (
                    "Pending approval"
                  )}
                </p>
              </div>
              {index < approvalStages.length - 1 && (
                <div className="absolute left-5 w-1 h-14 rounded-full bg-gray-300 -z-10" style={{ transform: "translateX(-50%)" }} />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleRequestQuotation}
            disabled={
              approvalDetails?.status !== 'approved' || 
              isRequesting || 
              approvalDetails?.hasQuotation
            }
            variant={approvalDetails?.hasQuotation ? "secondary" : "default"}
          >
            {isRequesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Request...
              </>
            ) : approvalDetails?.hasQuotation ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Already Requested
              </>
            ) : (
              <>
                <FileInput className="mr-2 h-4 w-4" />
                Request for Quotation
              </>
            )}
          </Button>
        </div>
    </div>
  )
}