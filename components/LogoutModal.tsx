"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

const LogoutModal = () => {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("accessKey");
    toast({
      title: "Logged out successfully",
    });
    router.push("/");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="hover:text-white/70 transition-colors">
        Logout
      </AlertDialogTrigger>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="shad-gray-btn">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="shad-danger-btn" onClick={logout}>
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutModal;
