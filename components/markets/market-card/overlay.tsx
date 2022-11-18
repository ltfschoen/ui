import { ExternalLink, X } from "react-feather";
import MarketCardOverlayCategories, {
  MarketCategories,
} from "./overlay-categories";

export type MarketCardOverlayProps = {
  categories: MarketCategories;
  className?: string;
  onCloseIconClick?: () => void;
};

const MarketCardOverlay = ({
  categories,
  className = "",
  onCloseIconClick,
}: MarketCardOverlayProps) => {
  return (
    <div
      className={
        "w-full absolute bg-white z-ztg-20 rounded-[10px] shadow-ztg-5 p-[16px] flex flex-col " +
        className
      }
    >
      <div className="flex flex-col mb-[25px]">
        <div className="flex flex-row justify-between">
          <div className="font-lato font-bold text-ztg-16-150">
            {categories.length} Outcomes
          </div>
          <X
            onClick={onCloseIconClick}
            className="cursor-pointer text-sky-600"
            size={24}
          />
        </div>
        <div className="flex flex-row items-center h-[26px] text-ztg-12-150 text-sky-600">
          Showing 1-4
        </div>
      </div>
      <MarketCardOverlayCategories categories={categories} />
      <div className="flex flex-row h-[24px] items-center cursor-pointer mt-[30px]">
        <ExternalLink size={24} className="text-sky-600" />
        <div className="ml-[11px] text-ztg-14-110 text-sky-600 font-bold">
          Go to Market
        </div>
      </div>
    </div>
  );
};

export default MarketCardOverlay;
