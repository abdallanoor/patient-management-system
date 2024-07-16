import { StatusIcon } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div
      className={cn("status-badge", {
        "bg-blue-600": status === "pending",
        "bg-green-600": status === "scheduled",
        "bg-red-600": status === "canceled",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt={status}
        width={12}
        height={12}
        className="w-3 h-fit"
      />
      <p
        className={cn("text-12-semibold capitalize", {
          "text-blue-500": status === "pending",
          "text-green-500": status === "scheduled",
          "text-red-500": status === "canceled",
        })}
      >
        {status}
      </p>
    </div>
  );
};

export default StatusBadge;
