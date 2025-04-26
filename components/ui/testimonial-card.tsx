import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";
import Image from "next/image";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  avatarUrl,
}: TestimonialCardProps) {
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <QuoteIcon className="h-8 w-8 text-[#6B46C1] mb-4 opacity-50" />
        <p className="text-gray-700 mb-6 italic">&quot;{quote}&quot;</p>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt={author}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-gray-600 text-sm">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
