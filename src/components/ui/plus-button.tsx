import { Plus } from "lucide-react";
import { Button } from "./button";

export function PlusButton(props: React.ComponentProps<typeof Button>) {
    return (
        <Button
            type="button"
            className="bg-green-500 hover:bg-green-500"
            {...props}
        >
            <Plus />
        </Button>
    );
}
