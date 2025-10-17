import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const TableSearch = ({ search, onChange }) => {
  return (
    <div className="flex items-center gap-2 mb-4 w-full relative">
      <Input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => onChange(e.target.value)}
        className="pr-16"
      />
      {search && (
        <p
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs cursor-pointer text-gray-400 hover:text-gray-600"
        >
      <X className="w-4 h-4"/>
        </p>
      )}
    </div>
  );
};

export default TableSearch;
