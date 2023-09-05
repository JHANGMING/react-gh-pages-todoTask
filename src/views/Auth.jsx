import { Outlet } from "react-router-dom";


function Auth(){
  return(
    <>
    <div id="loginPage" className="bg-yellow">
      <div className="conatiner loginPage vhContainer ">
            <div className="side">
                <img className="d-m-n" src="./src/assets/left.png" alt="workImg"/>
            </div>
            <Outlet />
        </div>
  </div>
    </>
  )
}
export default Auth;