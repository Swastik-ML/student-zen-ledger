
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

interface ExportMenuProps {
  onExport: (period: 'all' | 'year' | 'month') => void;
}

const ExportMenu = ({ onExport }: ExportMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onExport('all')}>
          Full Data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('year')}>
          Current Year Data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('month')}>
          Current Month Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportMenu;
