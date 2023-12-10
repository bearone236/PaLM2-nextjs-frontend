import { ModeToggle } from "./ModeToggle";

export function Header() {
  return (
    <div className="border-b-2  flex justify-between items-center py-3">
      <p className="text-xl font-bold ml-5">Nextjs ✖️ PaLM2</p>
      <div className="flex items-center mr-5">
        <ModeToggle />
      </div>
    </div>
  );
}
