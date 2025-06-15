import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-4">
    <div className="flex flex-col gap-y-4">
      <div>
        <Button variant="elevated">
          I am a button
        </Button>
      </div>
      <div>
        <Input placeholder="I am a input " />
      </div>
      <div></div >
      </div>
      </div>
  )
}
