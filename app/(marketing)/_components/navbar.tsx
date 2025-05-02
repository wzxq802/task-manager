import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const Navbar= () => {
    return(
        <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-blue-400 flex items-center">
            <div className="md:max-w-screen-2xl mx-auto flex item-center w-full justify-between">
                <Logo/>
                <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
                    <Button className="bg-blue-200 text-blackText hover:bg-blue-300 hover:text-white" size="sm" asChild>
                        <Link  href="/sing-in">Войти</Link>
                    </Button>
                    {/* <Button className="bg-white text-blackText hover:bg-blue-300 hover:text-white" size="sm" asChild>
                        <Link href="/sing-up">Get start with GuruTask</Link>
                    </Button> */}
                </div>
            </div>
        </div>
    )
}
