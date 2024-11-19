'use client'

import { useState, useEffect } from "react"
import { Check, UserCircle } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"

interface DocumentTrackerProps {
  purchaseRequestId: string
}

interface ApprovalDetails {
  approvedByProcurementOfficer: boolean
  approvedAtProcurementOfficer?: string | null
  procurementOfficerName?: string | null
  procurementOfficerRole?: string | null
  approvedByAccountant: boolean
  approvedAtAccountant?: string | null
  accountantName?: string | null
  accountantRole?: string | null
  approvedByPresident: boolean
  approvedAtPresident?: string | null
  presidentName?: string | null
  presidentRole?: string | null
}

export default function DocumentTracker({ purchaseRequestId }: DocumentTrackerProps) {
  const [approvalDetails, setApprovalDetails] = useState<ApprovalDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      approvalDetails.approvedByProcurementOfficer,
      approvalDetails.approvedByAccountant,
      approvalDetails.approvedByPresident
    ].filter(Boolean).length
    return (approvedCount / 3) * 100
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const approvalStages = [
    {
      id: 1,
      title: "Procurement Officer",
      status: approvalDetails?.approvedByProcurementOfficer ? "approved" : "pending",
      approvedAt: approvalDetails?.approvedAtProcurementOfficer,
      approverName: approvalDetails?.procurementOfficerName,
      approverRole: approvalDetails?.procurementOfficerRole,
    },
    {
      id: 2,
      title: "Accountant",
      status: approvalDetails?.approvedByAccountant ? "approved" : "pending",
      approvedAt: approvalDetails?.approvedAtAccountant,
      approverName: approvalDetails?.accountantName,
      approverRole: approvalDetails?.accountantRole,
    },
    {
      id: 3,
      title: "President",
      status: approvalDetails?.approvedByPresident ? "approved" : "pending",
      approvedAt: approvalDetails?.approvedAtPresident,
      approverName: approvalDetails?.presidentName,
      approverRole: approvalDetails?.presidentRole,
    },
  ]

  return (
    <div className="container mx-auto p-4">
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
    </div>
  )
}