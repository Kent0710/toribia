import Link from "next/link";
import { Title } from "../reusables/texts";

const Header = () => {
    return (
        <header className="h-[3rem] flex items-center px-4 gap-4">
            <Link href={"/"}>
                <Title> Toribia </Title>
            </Link>
        </header>
    );
};

export default Header;
