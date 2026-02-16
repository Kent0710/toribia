import { ArrowRight } from "lucide-react";
import { Description } from "../reusables/texts";
import { Button } from "../ui/button";

interface LeftPanelItemProps {
    placeName: string;
    location: string;
}
const LeftPanelItem: React.FC<LeftPanelItemProps> = ({
    placeName,
    location,
}) => {
    return (
        <li className="flex items-center justify-between px-6 py-2 border rounded-full">
            <section>
                <p className="font-medium">{placeName}</p>
                <Description>{location}</Description>
            </section>
            <Button size={'sm'} >
                Go
                <ArrowRight />
            </Button>
        </li>
    );
};

export default LeftPanelItem;
