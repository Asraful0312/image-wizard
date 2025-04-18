import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-[70vh]">
      <Loader2 className="size-7 shrink-0 animate-spin" />
    </div>
  );
};

export default Loader;
