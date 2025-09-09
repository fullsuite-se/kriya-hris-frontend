import { Input } from "@/components/ui/input";

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
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs cursor-pointer text-[#008080] hover:text-[#72b0b1]"
        >
          Clear
        </p>
      )}
    </div>
  );
};

export default TableSearch;
