import { redirect } from "next/navigation";
import Image from "next/image";

export default function Home() {
  // Redirect to property page to maintain consistent behavior with original app
  redirect("/property");
}
