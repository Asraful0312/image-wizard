import Link from "next/link";
import { ImageIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#E5E7EB] py-12 w-full">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <ImageIcon className="h-8 w-8 text-[#6B46C1]" />
            <span className="font-bold text-xl">Image to text now</span>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-gray-800 mb-2">Product</h3>
              <Link href="#" className="text-gray-600 hover:text-[#6B46C1]">
                Features
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#6B46C1]">
                Pricing
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#6B46C1]">
                API
              </Link>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-gray-800 mb-2">Company</h3>
              <Link href="#" className="text-gray-600 hover:text-[#6B46C1]">
                About
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#6B46C1]">
                Blog
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#6B46C1]">
                Careers
              </Link>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-gray-800 mb-2">Legal</h3>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-[#6B46C1]"
              >
                Terms and Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-[#6B46C1]"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-8 mt-8 text-center">
          <p className="text-gray-600">
            © 2025 Image to text now. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
