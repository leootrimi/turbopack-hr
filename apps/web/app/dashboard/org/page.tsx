import React from 'react'
import { OrgChart } from '../../../features/org/org-chart'
import { OrgChartWithD3Tree } from '../../../features/org/org-chart-graph'

const page = () => {
  return (
    <div>
      <OrgChartWithD3Tree />
    </div>
  )
}

export default page
