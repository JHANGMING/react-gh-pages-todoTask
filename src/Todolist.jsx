import { Routes, Route } from "react-router-dom";
import Login_page from "./views/Login_page";
import SignUp from "./views/SignUp";
import Auth from "./views/Auth";
import Todolisttask from "./views/Todolisttask";
import NotFound from "./views/NotFound";



function Todolist(){
  
  return(<>

  <Routes>
    <Route path='/' element={<Auth/>}>
      <Route index element={<Login_page />}/>
      <Route path='Signup' element={<SignUp />}/>
    </Route>
    <Route path='/todolist' element={<Todolisttask/>}/>
    <Route path="*" element={<NotFound />}/>
  </Routes>
  </>)
}
export default Todolist;