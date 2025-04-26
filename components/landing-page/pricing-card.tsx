import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  title: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: "default" | "outline"
  highlighted?: boolean
}

export default function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant,
  highlighted = false,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "border transition-all hover:shadow-lg",
        highlighted ? "border-[#6B46C1] shadow-md scale-105 relative z-10" : "border-gray-200",
      )}
    >
      {highlighted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#6B46C1] text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          {period && <span className="text-gray-500 ml-1">{period}</span>}
        </div>
        <p className="text-gray-600 mt-2">{description}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={buttonVariant}
          className={cn(
            "w-full py-6",
            buttonVariant === "default"
              ? "bg-[#6B46C1] hover:bg-purple-800"
              : "border-[#6B46C1] text-[#6B46C1] hover:bg-purple-50",
          )}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
