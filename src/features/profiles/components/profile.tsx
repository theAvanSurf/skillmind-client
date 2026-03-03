import React from "react";
import Image from "next/image";

interface ProfileProps {
    ProfileName: string;
    ProfilePicture: string;
    isKids: boolean;
    isDimmed: boolean;
}

export const Profile: React.FC<ProfileProps> = ({ ProfileName, ProfilePicture, isKids, isDimmed }) => {
    return (
        <div className={`group flex flex-col items-center gap-3 cursor-pointer select-none transition-all duration-300
            ${isDimmed ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>

            <div className="relative transition-all duration-200 ease-out group-hover:-translate-y-2">

                {/* Red border on hover */}
                <div className="absolute -inset-[3px] rounded-md bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0" />

                <Image
                    className="rounded-md relative z-10 object-cover transition-all duration-200 group-hover:brightness-110"
                    src={'https://res.cloudinary.com/dgsfeis7x/image/upload/v1771390135/Sabrina_t12oxl.jpg'}
                    alt={ProfileName}
                    width={200}
                    height={200}
                />

                {isKids && (
                    <span className="absolute bottom-2 right-2 z-20 bg-[#e50914] text-white text-xs font-black px-2 py-0.5 rounded-sm tracking-wide uppercase">
                        Kids
                    </span>
                )}
            </div>

            <p className="text-gray-400 group-hover:text-white transition-colors duration-200 tracking-wide text-sm font-medium">
                {ProfileName}
            </p>
        </div>
    );
};