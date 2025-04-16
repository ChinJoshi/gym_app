// import Image from "next/image";
// import Link from "next/link";
export default function Footer() {
    return (
        <footer className="flex flex-row justify-center m-[2ch]">
            {/* <div className="basis-[25ch] max-w-[25ch] text-left text-xs">
                <Link href="https://github.com/ChinJoshi">
                    <span className="inline-flex items-baseline">
                        <Image
                            src="/github-mark.svg"
                            alt="github"
                            width="98"
                            height="96"
                            className="mx-[0.25ch] size-3 self-center"
                        />
                        <span>github</span>
                    </span>
                </Link>
            </div> */}
            <div className="basis-[25ch] max-w-[25ch] text-center text-xs">
                &copy; Gym App
            </div>
            {/* <div className="basis-[25ch] max-w-[25ch] text-right text-xs">
                <Link href="https://linkedin.com/in/cshjoshi">
                    <span className="inline-flex items-baseline">
                        <Image
                            src="/InBug-Black.png"
                            alt="linkedin"
                            width="98"
                            height="96"
                            className="mx-[0.25ch] size-3 self-center"
                        />
                        <span>linkedin</span>
                    </span>
                </Link>
            </div> */}
        </footer>
    );
}
