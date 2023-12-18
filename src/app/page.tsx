'use client';

import Image from 'next/image'
import { useForm, Resolver } from "react-hook-form"

type LoginFormValues = {
  username: string
  password: string
}

const resolver: Resolver<LoginFormValues> = async (values) => {

  let errors = {}

  console.log(values.username)
  console.log(null)

  errors = {...(values.username === '' ? { 
    username: {
      type: "required",
      message: "This is required."
    }} : {}
  ), ...errors}
  errors = {...(values.password === '' ? { 
    password: {
      type: "required",
      message: "This is required."
    }} : {}
  ), ...errors}

  return {
    values: values.username && values.password ? values : {},
    errors
  }
}

const Home: React.FunctionComponent<{}> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver })
  const onSubmit = handleSubmit((data) => console.log(data))

  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-black w-max-full top-50 mx-10 my-5 p-10 rounded-3xl">
        <div className="flex flex-row justify-center">
          
          <Image
            src="/chat.svg"
            width={210}
            height={210}
            className="dark:invert"
            alt="Jivan from Noun Project"
          />
          <div className="text-9xl text-white">
            Chat app
          </div>
          
        </div>
      </div>
      
      <div className="flex flex-row-reverse mr-10">
        <button className="text-black p-2 hover:bg-black hover:text-white hover:rounded-xl hover:p-2">
          Sign up
        </button>
      </div>

      <div className="grid justify-items-center w-full">
        <div className="grid justify-items-center border-2 border-black w-3/12 h-80 rounded-3xl">
          <h4 className="text-black mt-10 text-3xl">Login</h4>

          <form onSubmit={onSubmit} className="flex flex-col">

            <div className="grid justify-center justify-between">
            <input className="login-input" {...register("username")} placeholder="Username"/>
            {errors?.username && <p className="text-red-600">{errors.username.message}</p>}
            
            <input className="login-input" type="password" {...register("password")} placeholder="Password" />
            {errors?.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>
            <input className="border-black border-2 text-black rounded-xl max-w-xl hover:bg-black hover:text-white m-2" type="submit" value="Submit" />
          </form>

        </div>
      </div>

    </main>
  )
};

export default Home;