import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
const {VITE_APP_HOST}=import.meta.env;


function Login_page(){
  const [isloading,setIsloading]=useState(false)
  const { register, handleSubmit, formState: { errors },reset } = useForm();
  const navigate=useNavigate()
  const onSubmit = (data) => {
    signIn(data)
  };
  const signIn=async(data)=>{
    setIsloading(true)
    Swal.fire({
        icon: 'info',
        title: `登入中`,
        showConfirmButton: false,
        allowEscapeKey: false,
        didOpen: async()=>{
          try{
            const res=await axios.post(`${VITE_APP_HOST}/users/sign_in`,data);
            Swal.showLoading();
            Swal.fire({
                icon: 'success',
                title: `登入成功`,
                text: '你可以前往待辦事項頁面',
                showConfirmButton: false,
                timer: 1000,
            });
            const {token}=res.data
            document.cookie = `token=${token}`;
            navigate("/todolist")
            setIsloading(false)
            reset()
            }
            catch(error){
              Swal.hideLoading();
              Swal.update({
                  icon: 'error',
                  title: '登入失敗',
                  text: error?.response?.data?.message,
                  showConfirmButton: true,
              });
            }
        }
        
      })
    
  }
  return(
  <>
    <div>
      <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
          <label className="formControls_label" htmlFor="email">Email</label>
          <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" {...register("email",
                        {
                            required: {
                                value: true,
                                message: '請輸入您的E-mail!'
                            },
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "未符合電子信箱格式!"
                            }
                        }
                    )} />
        <span>{errors.email?.message}</span>
          <label className="formControls_label" htmlFor="pwd">密碼</label>
          <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" {...register("password",
                        {
                            required: {
                                value: true,
                                message: '請輸入密碼!'
                            },
                            minLength: {
                                value: 6,
                                message: "密碼長度至少6位字元"
                            }
                        }
                    )}/>
         <span>{errors.password?.message}</span>
          <input className="formControls_btnSubmit" type="submit"  value="登入" disabled={isloading}/>
          <Link to='Signup' className='formControls_btnLink'>
                            前往註冊
          </Link>
          {/* <a className="formControls_btnLink" href="#Signup">註冊帳號</a> */}
      </form>
    </div>
  </>
  )
}
export default Login_page;