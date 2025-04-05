export function Footer() {
  return (
    <footer className="w-full py-4 px-6 bg-pink-100 border-t">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Network Explorer - All rights reserved
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-gray-600">
            <div>Anurag Kushwaha (Reg: CSE/22024/878)</div>
            <div>Abhishek Pal (Reg: CSE/22002/856)</div>
            <div>Aasheen Biswas (Reg: CSE/22001/855)</div>
            <div>Arindam Mondal (Reg: CSE/22026/880)</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

