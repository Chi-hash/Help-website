import React from 'react'


export const SiginupPage = () => {
  return (
    <Router>
        <Routes>
            <Route path = "/" element = {<LoginPage/>}></Route>
        </Routes>
    </Router>
  )
}
