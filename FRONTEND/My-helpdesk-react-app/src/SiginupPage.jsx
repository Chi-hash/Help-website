import React from 'react'
import { Link } from 'react-router-dom'
import HelpLogo from "./assets/HELPLOGO.svg";



export const SiginupPage = () => {
  return (
      <>
        <section id="signupcontainer">
            <div className="container">
                <div className="top">
                  <img src={HelpLogo} alt="" className='help-logo' />
                </div>
                <form action="#">
                    <h1>Sign up</h1>
                </form>
            </div>
        </section>
      </>
  )
}
