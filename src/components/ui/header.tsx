import { Button } from "@/components/ui/button";
import { LogOut, Plus, Spade } from "lucide-react";

interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
}

export const Header = ({ userEmail, onLogout }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Spade className="h-8 w-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Spades Squad</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-slate-300">Welcome, {userEmail}</span>
        <Button onClick={onLogout} variant="ghost">
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  )
}
