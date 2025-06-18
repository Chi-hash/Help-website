import React from 'react'
import { TopHeader } from '../../TopHeader'
import { LeftHeader } from '../../LeftHeader'

export const ManageUsers = () => {
  return (
    <>
       <section id="dashboardsection">
                    <div className="left">
                    <LeftHeader/>
                     </div>
                     <div className="right">
                        <TopHeader/>
                     </div>
                 </section>
    </>
  )
}
