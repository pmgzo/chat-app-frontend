import Image from 'next/image'

export default function Home() {
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


      <div className="flex justify-content b-10">
        {/** Complete login here:  */}
      </div>
    </main>
  )
}
