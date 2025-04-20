import { CategoriesSection } from "@/modules/home/ui/section/categoryies-section";
import { ResultsSection } from "../section/result-sections";

interface SearchViewProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const SearchView = async ({ query, categoryId }: SearchViewProps) => {
  return (
    <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId} />
      <ResultsSection query={query} categoryId={categoryId} />
    </div>
  );
};
