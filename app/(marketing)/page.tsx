import { Button } from "@/components/ui/button";
import { Medal } from "lucide-react";
import {cn} from "@/lib/utils";
import {Poppins} from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";

const headingFont = localFont({
    src:"../../public/fonts/open-sans.woff2"
});
const textFont = Poppins({
    subsets: ['latin'],
    weight: [
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900"
    ],
});
const MarketingPage = () => {
    return(
        <div className="flex items-center justify-center flex-col">
            <div className={cn("flex items-center justify-center flex-col", headingFont.className)}>
                <div className="mb-4 flex items-center border shadow-sm p-4 bg-blue-light text-titleColor  rounded-full uppercase">
                    <Medal className="h-6 w-5 mr-2"/>
                    No 1 в планировании
                </div>
                <h1 className="text-3xl md:text-6xl text-center text-titleColor mb-6">
                    GuruTask помагает командам
                </h1>
                <div className="text-3xl md:text-6xl bg-gradient-to-r from-blue-def to-baseLight text-titleColor px-4 p-2 rounded-md pb-4 w-fit">
                    двигаться вперед
                </div>
            </div>
            <div className={cn("text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto", textFont.className)}>
            Эффективность начинается с организации — познакомьтесь с Guru Task! Ваш надежный партнер в управлении задачами! Теперь каждый проект станет проще и эффективнее!
            </div>
            <Button className="bg-blue-400 hover:bg-blue-500 text-white mt-6" size="lg" asChild>
                <Link href="/sing-up">
                   Попробовать GuruTask
                </Link>
            </Button>
        </div>
    )
}
export default MarketingPage;