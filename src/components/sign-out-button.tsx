"use client";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
export function SignOutButton(){const router=useRouter();async function signOut(){await createClient().auth.signOut();router.replace("/login");router.refresh()}return <button onClick={()=>void signOut()} className="mt-4 flex w-full items-center gap-2 border-t border-white/10 pt-3 text-xs text-white/55"><LogOut size={14}/>Chiqish</button>}
