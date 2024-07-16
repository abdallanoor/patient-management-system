import { cn } from "@/lib/utils";
import Image from "next/image";

interface StatCardProps {
  type: "appointments" | "pending" | "canceled";
  count: number;
  label: string;
  icon: string;
}

const StatCard = ({ type, label, count, icon }: StatCardProps) => {
  return (
    <div
      className={cn("stat-card", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-canceled": type === "canceled",
      })}
    >
      <div className="flex items-center gap-3">
        <Image
          src={icon}
          alt="logo"
          width={32}
          height={32}
          className="h-8 w-fit"
        />
        <p className="text-32-bold">{count}</p>
      </div>
      <p className="text-14-regular">
        Total number of <span>{label}</span>
      </p>
    </div>
  );
};

export default StatCard;
