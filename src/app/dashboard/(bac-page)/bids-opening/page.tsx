import React from 'react'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'

const BidsOpeningPage = () => {
  return (
    <>
      <div className="text-2xl font-bold m-6">Abstract of Bids</div>
      <DataTable columns={columns} />
    </>
  )
}

export default BidsOpeningPage;