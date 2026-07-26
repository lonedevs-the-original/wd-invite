"use client";
import { useState } from "react";
import { Check,Copy } from "lucide-react";
export function CopyLinkButton({slug}:{slug:string}){const [copied,setCopied]=useState(false);async function copy(){await navigator.clipboard.writeText(`${location.origin}/i/${slug}`);setCopied(true);setTimeout(()=>setCopied(false),1500)}return <button onClick={()=>void copy()} aria-label="Havolani nusxalash" className="rounded-lg border border-[#e4e2dd] p-2 text-[#69645e]">{copied?<Check size={16}/>:<Copy size={16}/>}</button>}
