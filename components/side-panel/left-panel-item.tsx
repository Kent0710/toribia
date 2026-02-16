import { ArrowRight } from "lucide-react";
import { Description } from "../reusables/texts";
import { Button } from "../ui/button";
import Link from "next/link";

interface LeftPanelItemProps {
    placeName: string;
    location: string;
    id: number;
}
const LeftPanelItem: React.FC<LeftPanelItemProps> = ({
    placeName,
    location,
    id,
}) => {
    return (
        <li className="flex items-center justify-between px-6 py-2 border rounded-full">
            <section>
                <p className="font-medium">{placeName}</p>
                <Description>{location}</Description>
            </section>
            <Link
                href={`&place=${id}`}
            >
            <Button size={'sm'} >
                Go
                <ArrowRight />
            </Button>
            </Link>
        </li>
    );
};

export default LeftPanelItem;
