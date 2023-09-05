import { useNavigate,Link } from "react-router-dom";
import { useForm} from 'react-hook-form';
import axios from "axios";
import Swal from 'sweetalert2';
const {VITE_APP_HOST}=import.meta.env;

function SignUp(){
  const { register, handleSubmit,watch , formState: { errors },reset } = useForm();
  const navigate=useNavigate()

  const onSubmit = (data) => {
    signUp(data)
  };

  const signUp=async(data)=>{
    Swal.fire({
                icon: 'info',
                title: `註冊中，請稍待`,
                showConfirmButton: false,
                allowEscapeKey: false,
                didOpen: async () => {
                  Swal.showLoading();
                  try{
                    const res=await axios.post(`${VITE_APP_HOST}/users/sign_up`,data);
                  console.log(res)
                  Swal.hideLoading();
                  Swal.fire({
                      icon: 'success',
                      title: `恭喜！註冊成功`,
                      text: '即將前往登入頁面',
                      showConfirmButton: false,
                      timer: 1500,
                  });
                  navigate("/")
                    reset()
                  }
                  catch(error){
                    Swal.hideLoading();
                    Swal.update({
                        icon: 'error',
                        title: '哎唷！註冊失敗',
                        text: error?.response.data.message,
                        showConfirmButton: true,
                    });
                  }
                }})
    
  }

  return(
    <>
    <div>
    <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="formControls_txt">註冊帳號</h2>
        <label className="formControls_label" htmlFor="email">Email</label>
        <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email"  {...register("email",
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
        <label className="formControls_label" htmlFor="name">您的暱稱</label>
        <input className="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" {...register("nickname", {required: {
                                value: true,
                                message: '請輸入您的小名!'
                            }})} />
        <span>{errors.nickname?.message}</span>
        <label className="formControls_label" htmlFor="pwd">密碼</label>
        <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼"  {...register("password",
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
        <label className="formControls_label" htmlFor="pwd">再次輸入密碼</label>
        <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請再次輸入密碼" {...register("passwordCheck",
                        {
                            required: {
                                value: true,
                                message: '請輸入密碼!'
                            },
                            minLength: {
                                value: 6,
                                message: "密碼長度至少6位字元"
                            },
                            validate: (val) => {
                                if (watch('password') !== val) {
                                  return "密碼沒有一致喔！！";
                                }
                              }
                        }
                    )} />
        <span>{errors.passwordCheck?.message}</span>
        <input className="formControls_btnSubmit" type="submit"  value="註冊帳號" />
        <Link to='/' className='formControls_btnLink'>
           登入
        </Link>
    </form>
    </div>
    </>
  )
}

export default SignUp;