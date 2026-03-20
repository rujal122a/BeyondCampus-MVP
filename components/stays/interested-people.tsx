"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { isSupabaseStorageUrl } from "@/lib/image-utils";
import type { ListingInterestWithProfile } from "@/lib/types";
import { Loader2, MessageSquare, Users } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InterestedPeopleProps {
  listingId: string;
  isOwner?: boolean;
}

export default function InterestedPeople({ listingId, isOwner = false }: InterestedPeopleProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [interests, setInterests] = useState<ListingInterestWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInterests = async () => {
    try {
      const { data, error } = await supabase
        .from("listing_interests")
        .select("*, profiles(*)")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });

      if (error) {
        // If the table doesn't exist yet, this will fail gracefully and just show an empty list
        if (error.code === '42P01') {
          console.warn("listing_interests table not created yet. Please run the SQL migration.");
          return;
        }
        throw error;
      }

      setInterests((data as ListingInterestWithProfile[]) || []);
    } catch (error) {
      console.error("Error fetching interests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchInterests();
  }, [listingId]);

  const handleInterest = async () => {
    if (!user) {
      router.push(`/login?next=/stays/${listingId}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("listing_interests")
        .insert([{ listing_id: listingId, user_id: user.id }]);

      if (error) {
         if (error.code === '42P01') {
           toast.error("Database table missing. Please check console.");
           return;
         }
         throw error;
      }

      toast.success("You've been added to the interested list!");
      await fetchInterests();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error("You are already on the interested list.");
      } else {
        toast.error("Failed to add interest. Please try again.");
      }
      console.error("Error adding interest:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveInterest = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("listing_interests")
        .delete()
        .eq("listing_id", listingId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("You've been removed from the interested list.");
      await fetchInterests();
    } catch (error) {
      toast.error("Failed to remove interest. Please try again.");
      console.error("Error removing interest:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChat = (contactId: string) => {
    if (!user) {
      toast.error("Please login to chat.");
      router.push("/login");
      return;
    }
    
    if (user.id === contactId) {
       toast.info("This is you!");
       return;
    }

    toast.info("Chat functionality coming soon!");
  };

  const isUserInterested = user 
    ? interests.some((interest) => interest.user_id === user.id)
    : false;

  const canViewList = isOwner || isUserInterested;

  if (isLoading) {
    return (
      <div className="rounded-4xl border border-border-subtle/20 bg-white/40 p-6 sm:p-8 animate-pulse shadow-sm h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-blue" />
      </div>
    );
  }

  return (
    <div className="rounded-4xl border border-border-subtle/20 bg-white/40 shadow-sm overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle/10 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-lilac/30 text-accent-blue-deep">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">Interested People</h2>
        </div>
        <div className="text-sm font-medium text-text-secondary">
          {interests.length} {interests.length === 1 ? "Interested" : "Interested"}
        </div>
      </div>

      <div className="p-6 sm:p-8 relative">
        {!canViewList ? (
           <>
              <div className="space-y-4 blur-[6px] opacity-60 pointer-events-none select-none max-h-[200px] overflow-hidden">
                {/* Dummy layout for blurred background if list is empty, or show actual blurred list */}
                {interests.length > 0 ? interests.slice(0, 3).map((item) => (
                   <div key={item.id} className="flex items-center justify-between rounded-3xl bg-white/60 p-4 border border-border-subtle/10">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-border-subtle/20" />
                        <div className="space-y-2">
                           <div className="h-4 w-24 rounded-full bg-border-subtle/20" />
                           <div className="h-3 w-32 rounded-full bg-border-subtle/20" />
                        </div>
                     </div>
                     <div className="h-10 w-24 rounded-full bg-border-subtle/20" />
                   </div>
                )) : (
                   Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-3xl bg-white/60 p-4 border border-border-subtle/10">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-full bg-border-subtle/20" />
                         <div className="space-y-2">
                            <div className="h-4 w-24 rounded-full bg-border-subtle/20" />
                            <div className="h-3 w-32 rounded-full bg-border-subtle/20" />
                         </div>
                      </div>
                      <div className="h-10 w-24 rounded-full bg-border-subtle/20" />
                    </div>
                 ))
                )}
              </div>
              
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10 p-6">
                <button
                  type="button"
                  onClick={handleInterest}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-full bg-surface px-8 py-4 text-base font-semibold text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Users className="h-5 w-5" />
                  )}
                  + I&apos;m Interested
                </button>
              </div>
           </>
        ) : interests.length === 0 ? (
           <div className="py-8 text-center text-text-secondary">
             <p className="text-base font-medium">No one has shown interest yet.</p>
             <p className="text-sm mt-1">When students show interest, they will appear here.</p>
           </div>
        ) : (
           <div className="space-y-6">
              <div className="space-y-4 max-h-[320px] overflow-y-auto no-scrollbar pr-2">
                {interests.map((interest) => {
                  const profile = interest.profiles;
                  if (!profile) return null;
                  
                  return (
                    <div key={interest.id} className="flex items-center justify-between gap-3 rounded-3xl bg-white/70 p-4 border border-border-subtle/10 transition-all hover:bg-white hover:shadow-md">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border-subtle/20 bg-white/50">
                          {profile.avatar_url ? (
                            <Image
                              src={profile.avatar_url}
                              alt={profile.full_name ?? "User"}
                              fill
                              sizes="48px"
                              unoptimized={isSupabaseStorageUrl(profile.avatar_url)}
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-bold text-text-secondary bg-surface/5">
                              {profile.full_name?.charAt(0) ?? "U"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary flex items-center gap-2 truncate">
                            <span className="truncate">{profile.full_name ?? "User"}</span>
                            {user?.id === profile.id && <span className="shrink-0 text-xs font-normal text-text-secondary bg-border-subtle/10 px-2 py-0.5 rounded-full">(You)</span>}
                          </p>
                          <p className="text-sm text-text-secondary w-full truncate border-none outline-none ring-0 focus:outline-none focus:ring-0">
                             {[profile.major, profile.bio].filter(Boolean).join(" • ") || "Verified Profile"}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleChat(profile.id)}
                        className="shrink-0 flex items-center gap-2 rounded-full border border-border-subtle/20 bg-white px-3 sm:px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-all hover:border-accent-blue/50 hover:text-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2"
                      >
                         <MessageSquare className="h-4 w-4 shrink-0 text-accent-lilac" />
                         <span className="hidden sm:inline">Chat</span>
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {!isOwner && (
                <div className="pt-2 text-center border-t border-border-subtle/10">
                  <button
                    type="button"
                    onClick={handleRemoveInterest}
                    disabled={isSubmitting}
                    className="text-sm font-medium text-text-secondary underline underline-offset-4 hover:text-text-primary transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Updating..." : "No longer interested? Leave list"}
                  </button>
                </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
}
