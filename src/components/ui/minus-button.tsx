import { Minus } from "lucide-react";
import { Button } from "./button";

export function MinusButton(props: React.ComponentProps<typeof Button>) {
    return (
        <Button
            type="button"
            className="bg-red-800 hover:bg-red-800"
            {...props}
        >
            <Minus />
        </Button>
    );
}
