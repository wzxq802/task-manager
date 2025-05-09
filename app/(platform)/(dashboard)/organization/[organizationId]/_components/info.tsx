"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";

export const Info = () => {
    const { organization, isLoaded } = useOrganization();
    if(!isLoaded){
        return(
            <Info.Skeleton/>
        );
    };
    const imageUrl = organization?.imageUrl || "/default-image.png";
    return(
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
              <Image
                src={imageUrl}
                fill
                alt="Organization"
                className="rounded-md object-cover"
              />
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-xl">
                    {organization?.name}
                </p>
            </div>
        </div>
    );
};

Info.Skeleton = function SkeletonInfo(){
    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
                <Skeleton className="w-full h-full absolute"/>
            </div>
            <div className="space-y-2">
                <Skeleton className="w-[200px] h-10"/>
                <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2"/>
                    <Skeleton className="h-4 w-[100px]"/>
                </div>
            </div>
        </div>
    );
};