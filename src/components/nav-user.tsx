// "use client";

// import { useRouter } from "next/navigation";
// // import { SignOutButton } from "../app/dashboard/components/signout-button";
// import { Bell, ChevronsUpDown, UserCog, Moon, Sun, LogOut } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { useTheme } from "next-themes";
// import { useState } from "react";
// import { ProfileSheet } from "./profile-sheet";

// interface UserProps {
//   userData: {
//     id?: string;
//     clerkId?: string;
//     fullName: string;
//     email: string;
//     imageUrl?: string;
//   };
// }

// export function NavUser({ userData }: UserProps) {
//   const router = useRouter();
//   const { theme, setTheme } = useTheme();
//   const [isSheetOpen, setSheetOpen] = useState(false);

//   const primaryEmail = userData.email || "No email available";

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//             >
//               <Avatar className="h-8 w-8 rounded-lg">
//                 {userData.imageUrl ? (
//                   <AvatarImage src={userData.imageUrl} alt="User avatar" />
//                 ) : (
//                   <AvatarFallback className="rounded-lg">DP</AvatarFallback>
//                 )}
//               </Avatar>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-semibold">
//                   {userData.fullName || "Anonymous User"}
//                 </span>
//                 <span className="truncate text-xs">{primaryEmail}</span>
//               </div>
//               <ChevronsUpDown className="ml-auto size-4" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent
//             className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="p-0 font-normal">
//               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">
//                     {userData.fullName || "Anonymous User"}
//                   </span>
//                   <span className="truncate text-xs">{primaryEmail}</span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               {theme !== "light" && (
//                 <DropdownMenuItem onClick={() => setTheme("light")}>
//                   <Sun className="mr-2 h-4 w-4" />
//                   Light
//                 </DropdownMenuItem>
//               )}
//               {theme !== "dark" && (
//                 <DropdownMenuItem onClick={() => setTheme("dark")}>
//                   <Moon className="mr-2 h-4 w-4" />
//                   Dark
//                 </DropdownMenuItem>
//               )}
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => setSheetOpen(true)}>
//                 <UserCog className="mr-2 h-4 w-4" />
//                 Profile
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Bell className="mr-2 h-4 w-4" />
//                 Notification
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 {/* <SignOutButton /> */}
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* Render ProfileSheet component */}
//         <ProfileSheet
//           isOpen={isSheetOpen}
//           onClose={() => setSheetOpen(false)}
//         />
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }
