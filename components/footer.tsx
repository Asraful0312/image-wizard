import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t pt-5 px-10 flex items-center justify-between flex-wrap gap-5 w-full mt-10">
      <Link className="text-sm" href="/privacy">Privacy Policy</Link>
      <Link className="text-sm" href="/terms">Terms & Conditions</Link>
    </footer>
  );
};

export default Footer;
