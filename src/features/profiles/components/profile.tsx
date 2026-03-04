import React from "react";
import Image from "next/image";

interface ProfileProps {
    ProfileName: string;
    ProfilePicture: string;
    isKids: boolean;
    isDimmed: boolean;
    isManaging?: boolean;
    onClick?: () => void;
}

import { Pencil } from "lucide-react";

export const Profile: React.FC<ProfileProps> = ({ ProfileName, ProfilePicture, isKids, isDimmed, isManaging, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group flex flex-col items-center gap-3 cursor-pointer select-none transition-all duration-300
            ${isDimmed ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}
        >

            <div className="relative transition-all duration-200 ease-out group-hover:-translate-y-2">

                {/* Red border on hover */}
                <div className="absolute -inset-[3px] rounded-md bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0" />

                <div className="w-50 h-50 rounded-md relative z-10 overflow-hidden">
                    <Image
                        className={`object-cover transition-all duration-200 ${isManaging ? 'brightness-50' : 'group-hover:brightness-110'}`}
                        src={ProfilePicture || 'https://res.cloudinary.com/dgsfeis7x/image/upload/v1771390135/Sabrina_t12oxl.jpg'}
                        alt={ProfileName}
                        fill
                        sizes="200px"
                    />
                </div>

                {isKids && (
                    <span className="absolute bottom-2 right-2 z-20 bg-[#e50914] text-white text-xs font-black px-2 py-0.5 rounded-sm tracking-wide uppercase">
                        Kids
                    </span>
                )}

                {/* Edit Pencil Overlay */}
                {isManaging && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center">
                        <div className="flex bg-black/50 p-3 rounded-full border-2 border-white/80 group-hover:scale-110 transition-transform">
                            <Pencil size={24} className="text-white" />
                        </div>
                    </div>
                )}
            </div>

            <p className="text-gray-400 group-hover:text-white transition-colors duration-200 tracking-wide text-sm font-medium">
                {ProfileName}
            </p>
        </div>
    );
};