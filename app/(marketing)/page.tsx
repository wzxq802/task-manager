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
                    No 1 task managment
                </div>
                <h1 className="text-3xl md:text-6xl text-center text-titleColor mb-6">
                    GuruTask helps team move
                </h1>
                <div className="text-3xl md:text-6xl bg-gradient-to-r from-blue-def to-baseLight text-titleColor px-4 p-2 rounded-md pb-4 w-fit">
                    work forward
                </div>
            </div>
            <div className={cn("text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto", textFont.className)}>
                GuruTask is your perfect assistant for task management! This task manager allows you to easily plan tasks, set priorities, and track progress.
            </div>
            <Button className="bg-blue-400 hover:bg-blue-500 text-white mt-6" size="lg" asChild>
                <Link href="/sing-up">
                    Get start with GuruTask
                </Link>
            </Button>
        </div>
    )
}
export default MarketingPage;