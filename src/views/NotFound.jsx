import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound(){
  const navigate=useNavigate();
  useEffect(()=>{
    setTimeout(()=>{
      navigate("/")
    },1500)
  },[])
  return(
    <>
    <div className="notFind">
      <h1>卡斯柏老師說不能色色喔！！！</h1>
      <img src="./src/assets/2WrTnabULJ78cdA-K8FxR3vehtJPtBVo1PAMttTwDLY.png" alt="notFind" className="notFind-pic"/>
    </div>
    </>
  )
}
export default NotFound;