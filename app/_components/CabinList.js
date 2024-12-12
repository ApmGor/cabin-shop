import CabinCard from "@/app/_components/CabinCard";
import {getCabins} from "@/app/_lib/data-service";

export default async function CabinList({filter}) {
  const cabins = await getCabins();

  let displayedCabins;
  switch (filter) {
    case "small": displayedCabins = cabins.filter(cabin => cabin.maxCapacity <= 3); break;
    case "medium": displayedCabins = cabins.filter(cabin => cabin.maxCapacity > 3 && cabin.maxCapacity < 8); break;
    case "large": displayedCabins = cabins.filter(cabin => cabin.maxCapacity >= 8); break;
    default: displayedCabins = cabins;
  }

  return <>{displayedCabins.length > 0 && <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
    {displayedCabins.map((cabin) => (
      <CabinCard cabin={cabin} key={cabin.id}/>
    ))}
  </div>}</>
}