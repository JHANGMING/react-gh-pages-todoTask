
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan,faPencil,faXmark,faCheck} from '@fortawesome/free-solid-svg-icons'; // 導入icon
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
const {VITE_APP_HOST}=import.meta.env;


function Todolisttask(){
  const [text,setText]=useState("")
  const [list,setList]=useState([])
  const [change,setChange]=useState("all")
  const [edit,setEdit]=useState("")
  const [target,setTarget]=useState("")
  const [nickname,setNickname]=useState("")
  const navigate=useNavigate()
  const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  onOpen: toast => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
  })

  useEffect(()=>{
    //取得cookie
    const cookieValue = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];
  //預設axios的表頭
  axios.defaults.headers.common['Authorization'] = cookieValue;
  //驗證登入
  checkOut()
  //取得代辦
  getTodos();
  },[])

  const checkOut= async()=>{
    try{
    const res=await axios.get(`${VITE_APP_HOST}/users/checkout`);
    setNickname(res.data.nickname)
    }
    catch(error){
      Swal.hideLoading();
      Swal.fire({
          icon: 'error',
          title: '登入失敗',
          text: error?.response.data.message,
          showConfirmButton: true,
      });
      navigate("/")
    }
  }

  //取得代辦資料
  const getTodos=async()=>{
  const res=await axios.get(`${VITE_APP_HOST}/todos`);
    setList(res.data.data)
    
  }

  //新增代辦
  const addItem=async()=>{
    if(!text){
      Swal.hideLoading();
      Swal.fire({
          icon: 'error',
          title: '請輸入代辦喔！！',
          showConfirmButton: true,
      });
      return;
    }
    const todo={
      content:text,
    }
    try{
      const res=await axios.post(`${VITE_APP_HOST}/todos`,todo,);
      setText("");
      console.log(res.data)
      Toast.fire({
        icon: 'success',
        title: `加入代辦事項:${res.data.newTodo.content} 成功！`
      })
      getTodos();
    }catch (error) {
      Toast.fire({
        icon: 'error',
        title: `${error.response.data.message}!`
      })
    }
  }

  //刪除個別代辦
  const delItem=async(id)=>{
    try{
      const res=await axios.delete(`${VITE_APP_HOST}/todos/${id}`);
      Toast.fire({
        icon: 'success',
        title: `刪除代辦事項成功！`
      })
        getTodos()
    }catch (error) {
      Toast.fire({
        icon: 'error',
        title: `${error.response.data.message}!`
      })
    }
  }

  //刪除已完成
  const delAllItem=(e)=>{
    e.preventDefault()
    const Numlist=list.filter((item)=>item.status!==false)
    Numlist.map(async(item)=>{
      try{
      const res=await axios.delete(`${VITE_APP_HOST}/todos/${item.id}`);
      Toast.fire({
        icon: 'success',
        title: '刪除已勾選代辦成功！'
      })
        getTodos()
    }catch (error) {
      Toast.fire({
        icon: 'error',
        title: `${error.response.data.message}!`
      })
    }
    })
  }

  //切換個別代辦狀態
  const togglecheck=async(id)=>{
  try{
    const res=await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`,{});
    console.log(res.data)
    Toast.fire({
          icon: 'success',
          title: `${res.data.message}!!`
        })
      getTodos()
  }catch (error) {
    Toast.fire({
        icon: 'error',
        title: `${error.response.data.message}!`
      })
  }
  }

  // 改變分頁狀態
  const newlist=list.filter((item)=>{
    if(change==="all"){
      return item
    }else if(change==="work"){
      return item.status===false
    }else{
      return item.status!==false
    }
  })

  //已完成項目
  const totalNum=()=>{
    const Numlist=newlist.filter((item)=>item.status===false)
    return Numlist.length
  }

  //修改個別項目
  const editTodo=async(id)=>{
    try{
      const todo={
      content:edit,
    }
    const res=await axios.put(`${VITE_APP_HOST}/todos/${id}`,todo);
    console.log(res.data)
    Toast.fire({
          icon: 'success',
          title: '更新個別項目成功！'
        })
    setEdit("");
    setTarget("");
    getTodos();
    }
    catch(error){
      Toast.fire({
        icon: 'error',
        title: `${error.response.data.message}!`
      })
    }
  }

  //登出
  const signout=async(e)=>{
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      title: '確定要離開代辦頁面嗎？',
      showCancelButton: true,
      confirmButtonText: 'YES',
      }).then(async(result) => {
  if (result.isConfirmed) {
    const res=await axios.post(`${VITE_APP_HOST}/users/sign_out`,{});
      Swal.hideLoading();
      Swal.fire({
          icon: 'success',
          title: '登出成功',
          showConfirmButton: true,
      });
    navigate("/")
  } 
  })
    
  }

  const transform=(e)=>{
    e.preventDefault()
    Swal.fire({
      icon: 'warning',
      title: '確定要先回首頁看看嗎？',
      showCancelButton: true,
      confirmButtonText: 'YES',
  }).then((result) => {
  if (result.isConfirmed) {
    navigate("/")
  } 
  })
  }

  const   handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addItem();
    }
  }
  
  return(
    <>
    <div id="todoListPage" className="bg-half">
        <nav>
            <h1><a href="#" onClick={transform}>ONLINE TODO LIST</a></h1>
            <ul>
                <li className="todo_sm"><span>{nickname}的代辦</span></li>
                <li><a href="#loginPage" onClick={signout}>登出</a></li>
            </ul>
        </nav>
        <div className="conatiner todoListPage vhContainer">
            <div className="todoList_Content">
                <div className="inputBox">
                    <input type="text" placeholder="請輸入待辦事項" value={text} onChange={(e)=>{setText((e.target.value).trim())}} onKeyPress={handleKeyPress}/>
                    <a href="#" onClick={(e)=>{e.preventDefault(),addItem()}}>
                        <FontAwesomeIcon icon={faPlus} style={{color: "#ffffff",}} />
                    </a>
                </div>
                {list.length===0?(
                  <>
                  <div className="empty">
                    <div className="empty-text">目前尚無待辦事項</div>
                    <img src="./src/assets/empty 1.png" alt="empty-pic" className="empty-pic"/>
                  </div>
                  </>
                ):(<>
                <div className="todoList_list">
                    <ul className="todoList_tab">
                        <li><a href="#" className={change === "all" ? "active" : ""} onClick={(e)=>{e.preventDefault(),setChange("all")}}>全部</a></li>
                        <li><a href="#" className={change === "work" ? "active" : ""} onClick={(e)=>{e.preventDefault(),setChange("work")}}>待完成</a></li>
                        <li><a href="#" className={change === "done" ? "active" : ""} onClick={(e)=>{e.preventDefault(),setChange("done")}} >已完成</a></li>
                    </ul>
                    <div className="todoList_items">
                        <ul className="todoList_item">
                          {newlist.length===0?(<>
                          <li>
                            <label className="todoList_label">
                                   目前尚無待辦事項
                            </label>
                            </li>
                          </>):
                          (<>
                          {newlist.map((item)=>{
                            return(
                              <li key={item.id}>
                                {target===item.id?(
                                  <>
                                  <label className="todoList_label">
                                    <input className="todoList_input" type="checkbox" checked={item.status} onClick={()=>{togglecheck(item.id)}}/>
                                    <input type="text"
                                      className="editInput"
                                      value={edit || item.content}
                                      onChange={(e) => setEdit(e.target.value)}/>
                                      <a href="" className="icon" onClick={(e)=> {e.preventDefault(),editTodo(item.id)}}>
                                        <FontAwesomeIcon icon={faCheck} />
                                      </a>
                                      <a href="" className="icon" onClick={(e)=> {e.preventDefault(),setTarget('')}}>
                                        <FontAwesomeIcon icon={faXmark} />
                                      </a>
                                  </label> 
                                      </>
                                ):(
                                  <>
                                  <label className="todoList_label">
                                    <input className="todoList_input" type="checkbox" checked={item.status} onClick={()=>{togglecheck(item.id)}}/>
                                    <span>{item.content}</span>
                                  </label>
                                  <a href="#" onClick={(e)=>{e.preventDefault(),setEdit(""),setTarget(item.id)}}>
                                    <FontAwesomeIcon icon={faPencil} />
                                </a>
                                <a href="#" onClick={(e)=>{e.preventDefault(),delItem(item.id)}}>
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </a>
                                </>
                                )}
                              </li>
                            )
                          })}
                          </>)}

                        </ul>
                        <div className="todoList_statistics">
                            <p> {totalNum()} 個代辦項目</p>
                            <a href="#" onClick={delAllItem}>清除已完成項目</a>
                        </div>
                    </div>
                </div>
                </>)}
                
            </div>
        </div>
    </div>
    </>
  )
}

export default Todolisttask;