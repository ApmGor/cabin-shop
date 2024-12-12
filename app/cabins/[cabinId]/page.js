import { EyeSlashIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";
import {getBookedDatesByCabinId, getCabin, getCabins, getSettings} from "@/app/_lib/data-service";
import Image from "next/image";
import TextExpander from "@/app/_components/TextExpander";
import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";

export function generateMetadata({ params: { cabinId } }) {
  return {
    title: "Cabin 00" + cabinId
  }
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map(cabin => ({ cabinId: String(cabin.id)}));
  return ids;
}

export default async function Page({ params: { cabinId } }) {
  const [cabin, settings, bookedDates] =
    await Promise.all([getCabin(cabinId), getSettings(), getBookedDatesByCabinId(cabinId)]);

  const { id, name, maxCapacity, regularPrice, discount, image, description } =
    cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-10 mb-24">
        <div className="relative scale-[1.15] -translate-x-3">
          <Image src={image} fill alt={`Cabin ${name}`} className={"object-cover"} />
        </div>

        <div>
          <h3 className="text-accent-100 font-black text-7xl mb-5 translate-x-[-254px] bg-primary-950 p-6 pb-1 w-[150%]">
            Cabin {name}
          </h3>

          <p className="text-lg text-primary-300 mb-10">
            <TextExpander>
              {description}
            </TextExpander>
          </p>

          <ul className="flex flex-col gap-4 mb-7">
            <li className="flex gap-3 items-center">
              <UsersIcon className="h-5 w-5 text-primary-600" />
              <span className="text-lg">
                For up to <span className="font-bold">{maxCapacity}</span>{" "}
                guests
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <MapPinIcon className="h-5 w-5 text-primary-600" />
              <span className="text-lg">
                Located in the heart of the{" "}
                <span className="font-bold">Dolomites</span> (Italy)
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <EyeSlashIcon className="h-5 w-5 text-primary-600" />
              <span className="text-lg">
                Privacy <span className="font-bold">100%</span> guaranteed
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {name} today. Pay on arrival.
        </h2>
        <div className={"grid grid-cols-[1.8fr_1fr] border border-primary-800 min-h-[400px]"}>
          <DateSelector />
          <ReservationForm />
        </div>
      </div>
    </div>
  );
}
