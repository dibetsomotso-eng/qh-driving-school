import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function WhatsAppButton() {
  const whatsappNumber = "+27733813197";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg z-50"
          >
            <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
              <Icons.Whatsapp className="h-8 w-8 text-white" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chat on WhatsApp</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
