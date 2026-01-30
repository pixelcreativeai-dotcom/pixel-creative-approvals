'use client';

import Image from "next/image";
import { Heart, MessageCircle, Send, Bookmark, Music, Globe, Briefcase, Search } from "lucide-react";

type PreviewProps = {
    assetUrl: string;
    assetType: 'image' | 'video';
};

export function MetaFeedPreview({ assetUrl, assetType }: PreviewProps) {
    return (
        <div className="bg-white dark:bg-black rounded-md w-full">
            <div className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="flex-1">
                    <div className="w-2/5 h-3 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                </div>
            </div>

            <div className="aspect-square bg-black">
                 {assetType === 'image' ? (
                    <Image src={assetUrl} alt="Asset preview" layout="fill" objectFit="contain" />
                ) : (
                    <video src={assetUrl} muted loop playsInline autoPlay className="w-full h-full object-contain" />
                )}
            </div>

            <div className="p-3 space-y-2">
                <div className="flex items-center gap-4">
                    <Heart className="w-6 h-6" />
                    <MessageCircle className="w-6 h-6" />
                    <Send className="w-6 h-6" />
                    <div className="flex-1"></div>
                    <Bookmark className="w-6 h-6" />
                </div>
                <div className="w-1/4 h-3 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
            </div>
        </div>
    );
}

export function InstagramStoryPreview({ assetUrl, assetType }: PreviewProps) {
    return (
        <div className="aspect-[9/16] bg-black rounded-md w-full relative overflow-hidden">
            {assetType === 'image' ? (
                <Image src={assetUrl} alt="Asset preview" layout="fill" objectFit="cover" />
            ) : (
                <video src={assetUrl} muted loop playsInline autoPlay className="w-full h-full object-cover" />
            )}
            <div className="absolute top-0 left-0 p-4 w-full flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-500/50"></div>
                <div className="h-3 w-1/3 bg-gray-500/50 rounded-sm"></div>
            </div>
        </div>
    );
}

export function TikTokPreview({ assetUrl, assetType }: PreviewProps) {
    return (
        <div className="aspect-[9/16] bg-black rounded-md w-full relative overflow-hidden">
             {assetType === 'image' ? (
                <Image src={assetUrl} alt="Asset preview" layout="fill" objectFit="cover" />
            ) : (
                <video src={assetUrl} muted loop playsInline autoPlay className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-0 left-0 p-3 text-white w-full bg-gradient-to-t from-black/50 to-transparent">
                <div className="font-bold">@cliente</div>
                <p className="text-sm mt-1">Descripción del video aquí #fyp #marketing</p>
                <div className="flex items-center gap-2 mt-2">
                    <Music className="w-4 h-4" />
                    <p className="text-sm">Sonido original - @cliente</p>
                </div>
            </div>
             <div className="absolute bottom-0 right-0 p-3 flex flex-col items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-700"></div>
                <div className="flex flex-col items-center">
                    <Heart className="w-8 h-8" fill="white" />
                    <span className="text-xs">1.2M</span>
                </div>
                <div className="flex flex-col items-center">
                    <MessageCircle className="w-8 h-8" fill="white" />
                    <span className="text-xs">8492</span>
                </div>
                 <div className="flex flex-col items-center">
                    <Bookmark className="w-8 h-8" fill="white" />
                    <span className="text-xs">123K</span>
                </div>
                 <div className="flex flex-col items-center">
                    <Send className="w-8 h-8" fill="white" />
                    <span className="text-xs">45K</span>
                </div>
            </div>
        </div>
    );
}

export function LinkedInFeedPreview({ assetUrl, assetType }: PreviewProps) {
    return (
        <div className="bg-white dark:bg-slate-950 rounded-md w-full border">
            <div className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/80 text-white flex items-center justify-center text-xs font-semibold">in</div>
                <div className="flex-1">
                    <div className="h-3 w-2/5 bg-slate-200 dark:bg-slate-800 rounded-sm"></div>
                    <div className="h-2 w-1/3 bg-slate-100 dark:bg-slate-900 rounded-sm mt-2"></div>
                </div>
                <Briefcase className="w-4 h-4 text-slate-400" />
            </div>
            <div className="aspect-[1.91/1] bg-slate-900 relative">
                {assetType === 'image' ? (
                    <Image src={assetUrl} alt="Asset preview" layout="fill" objectFit="cover" />
                ) : (
                    <video src={assetUrl} muted loop playsInline autoPlay className="w-full h-full object-cover" />
                )}
            </div>
            <div className="p-3 space-y-2">
                <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-sm"></div>
                <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-sm"></div>
                <div className="flex items-center justify-between text-slate-400 text-xs pt-2">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Contenido patrocinado</span>
                    </div>
                    <span>CTA</span>
                </div>
            </div>
        </div>
    );
}

export function GoogleAdsPreview({ assetUrl, assetType }: PreviewProps) {
    return (
        <div className="bg-white dark:bg-slate-950 rounded-md w-full border overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/80 text-white flex items-center justify-center text-[10px] font-bold">G</div>
                    <span>Google Ads</span>
                </div>
                <Search className="w-4 h-4" />
            </div>
            <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900 relative">
                {assetType === 'image' ? (
                    <Image src={assetUrl} alt="Asset preview" layout="fill" objectFit="cover" />
                ) : (
                    <video src={assetUrl} muted loop playsInline autoPlay className="w-full h-full object-cover" />
                )}
            </div>
            <div className="p-3 space-y-2">
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-sm"></div>
                <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-sm"></div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600">Anuncio</span>
                    <span>www.pixelcreative.agency</span>
                </div>
            </div>
        </div>
    );
}
