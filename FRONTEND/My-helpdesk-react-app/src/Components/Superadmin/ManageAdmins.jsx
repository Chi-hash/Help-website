import React from 'react'
import { LeftHeader } from '../../LeftHeader'
import { TopHeader } from '../../TopHeader'

export const ManageAdmins = () => {
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
